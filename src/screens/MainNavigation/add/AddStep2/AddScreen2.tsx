import React from "react";
import { ScrollView, View, StyleSheet, Text, TextInput } from "react-native";
import HeaderComponent from "../../../../components/HeaderComponent";
//@ts-ignore
import GoogleMapReact, { Coords } from "google-map-react";

//@ts-ignore
import { REACT_APP_GOOGLE_API_KEY } from "@env";
import { searchPlaces } from "../../../../lib/google";
import SearchInput from "../../../../components/SearchInput";
import MarkerComponent from "../../../../components/MarkerComponent";

type Props = {
  route: any;
  navigation: any;
};

function AddScreen2({ route }: Props) {
  let initialState = route.params != undefined ? route.params.form : {};

  const [form, setForm] = React.useState(initialState);
  const [places, setPlaces] = React.useState<any[]>([]);
  const [google, setGoogle] = React.useState<{ map?: any; maps?: any }>({});

  const handleApiLoaded = (map: any, maps: any) => {
    console.log("map loaded");
    setGoogle({
      map,
      maps,
    });
  };

  const onSubmit = () => {};

  const onPlaceSeach = (searchQuery: string) => {
    if (searchQuery == undefined || searchQuery.length < 3) {
      return;
    }

    const options = {
      country: "kr",
      language: "en",
      searchQuery: searchQuery,
    };

    searchPlaces(options).then((result: any) => {
      console.log(result);

      setPlaces(result);

      //Center map on the first marker
      google.map.setCenter(result[0].geometry.location);
    });
  };

  const defaultProps = {
    center: {
      lat: 37.555015,
      lng: 126.937007,
    },
    zoom: 15,
  };

  return (
    <View>
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
        <GoogleMapReact
          bootstrapURLKeys={{ key: REACT_APP_GOOGLE_API_KEY }}
          defaultCenter={defaultProps.center}
          defaultZoom={defaultProps.zoom}
          yesIWantToUseGoogleMapApiInternals={true}
          onGoogleApiLoaded={({ map, maps }: any) => handleApiLoaded(map, maps)}
        >
          {places.map((place: any, i: number) => {
            return (
              <MarkerComponent
                lat={place.geometry.location.lat}
                lng={place.geometry.location.lng}
                text={place.name}
                key={i}
              />
            );
          })}
        </GoogleMapReact>
      </View>

      {/* <Button onPress={placeSearch}>SEND IT</Button> */}
      {places.length == 0 && <Text>Search pls</Text>}
      {places.length != 0 && (
        <>
          <ScrollView
            style={styles.contentView}
            keyboardShouldPersistTaps={"handled"}
          >
            {places.map((place: any) => {
              return <Text key={place.place_id}>{place.name}</Text>;
            })}
          </ScrollView>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    marginTop: 10,
  },
  contentView: {
    paddingHorizontal: 26,
  },
  mapContainer: {
    height: 300,
  },
});

export default AddScreen2;
