import React, { LegacyRef } from "react";
import { ScrollView, View, StyleSheet, Text, Button } from "react-native";
// import { Button } from "react-native-paper";
import HeaderComponent from "../../../../components/HeaderComponent";

import MapView, { Camera, LatLng, Marker, Region } from "react-native-maps";

import * as Location from "expo-location";

//@ts-ignore
import SearchInput from "../../../../components/SearchInput";
import { searchPlaces } from "../../../../lib/PlacesFinder";
import Store from "../../../../types/Store";

type Props = {
  route: any;
  navigation: any;
};

function AddScreen2({ route, navigation }: Props) {
  let initialState = route.params != undefined ? route.params.form : {};

  const [form, setForm] = React.useState(initialState);
  const [places, setPlaces] = React.useState<any[]>([]);
  const [errors, setErrors] = React.useState<{
    [key: string]: any;
  }>({});
  const [location, setLocation] = React.useState<any>(undefined);
  const [errorMsg, setErrorMsg] = React.useState("");

  const mapRef = React.useRef<MapView>(null);

  //Location permission
  React.useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);

  /**
   * @description Method used to check for errors in the specified fields
   * @param fields Array of fields key to check
   * @returns
   */
  const checkErrors = (fields?: string[] | undefined) => {
    //Fields param allows us to specify for on which field to check for errors
    //if unspecified, all fields are checked

    //Reset error object
    let newErrors: {
      [key: string]: any;
    } = {};

    if (fields == undefined || fields.indexOf("store") != -1) {
      //Mandatory store
      if (form.store == undefined) {
        newErrors["store"] = true;
      }
    }

    setErrors(newErrors);
    return newErrors;
  };

  /**
   * @description Called when the Next button is clicked
   * Check for errors and if none, navigate to the next page
   */
  const onSubmit = () => {
    if (form.store == undefined) {
      return;
    }
    navigation.navigate("AddStep3", { form: form });
  };

  const placeSelected = (place: Store) => {
    // google.map.setCenter(place.location);
    navigateMapTo(place.location);
    setFormField("store", place.id);
  };

  //Method used to update the form/state value
  const setFormField = (key: string, value: string | string[]) => {
    setForm({
      ...form,
      [key]: value,
    });
  };

  const onPlaceSeach = (searchQuery: string) => {
    if (searchQuery == undefined || searchQuery.length < 3) {
      return;
    }

    const options = {
      country: "en",
      language: "en",
      searchQuery: searchQuery,
    };

    searchPlaces(options).then((results: Store[]) => {
      setPlaces(results);

      //Center map on the first marker
      if (results[0] != undefined) {
        let coordinates = results.map((result: Store) => {
          return result.location;
        });
        navigateMapTo(results[0].location as LatLng);
        mapRef.current?.fitToCoordinates(coordinates);
      }
    });
  };

  const navigateMapTo = ({ latitude, longitude }: LatLng) => {
    const region = {
      latitude,
      longitude,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    };
    mapRef.current?.animateToRegion(region);
  };

  return (
    <ScrollView style={styles.page}>
      <View style={styles.header}>
        <HeaderComponent
          title="Add a product"
          showBackButton={false}
          subtitle="Product location"
        />
      </View>

      <SearchInput
        onSubmit={(value: string) => {
          onPlaceSeach(value);
        }}
      />

      <View style={styles.mapContainer}>
        <MapView //https://github.com/react-native-maps/react-native-maps/blob/master/docs/mapview.md
          style={styles.mapContainer}
          initialRegion={{
            latitude: 37.555015,
            longitude: 126.937007,
            latitudeDelta: 0.1,
            longitudeDelta: 0.1,
          }}
          pitchEnabled={false}
          showsUserLocation={true}
          showsMyLocationButton={true}
          toolbarEnabled={false}
          ref={mapRef}
          onPress={() => navigateMapTo(places[0].location as LatLng)}
        >
          {places.map((place: any, i: number) => {
            return (
              <Marker
                coordinate={place.location}
                title={place.name}
                key={place.id}
                onPress={() => placeSelected(place)}
              />
            );
          })}
        </MapView>
      </View>

      {errors["store"] && (
        <Text style={styles.error}>Please pick a store or skip the step</Text>
      )}

      {/* <Button onPress={placeSearch}>SEND IT</Button> */}
      {places.length == 0 && <Text>Search pls</Text>}
      {places.length != 0 && (
        <>
          <ScrollView
            style={styles.contentView}
            keyboardShouldPersistTaps={"handled"}
          >
            {places.map((place: any) => {
              return (
                <Text
                  key={place.id}
                  onPress={() => placeSelected(place)}
                  style={[
                    styles.storeListItem,
                    form.store?.id == place.id //Add the selected style if the place is the one selected
                      ? styles.storeListItemSelected
                      : undefined,
                  ]}
                >
                  {place.name}
                </Text>
              );
            })}
          </ScrollView>
        </>
      )}

      <View style={styles.buttonContainer}>
        <Button
          title="Back"
          // style={styles.button}

          onPress={() => {
            navigation.goBack();
          }}
        ></Button>
        <Button
          title="Next step"
          // style={styles.button}
          disabled={form.store == undefined}
          onPress={() => {
            onSubmit();
          }}
        ></Button>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    paddingBottom: 50,
  },
  header: {
    marginTop: 10,
  },
  contentView: {
    paddingHorizontal: 26,
  },
  mapContainer: {
    height: 300,
  },
  storeListItem: {
    margin: 10,
  },
  storeListItemSelected: {
    textDecorationLine: "underline",
  },
  error: {
    color: "red",
  },
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around",
    gap: 10,
  },
  button: {
    flex: 1,
  },
});

export default AddScreen2;
