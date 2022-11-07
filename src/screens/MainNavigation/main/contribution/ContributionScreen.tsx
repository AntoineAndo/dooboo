import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import MapView, { LatLng, Marker } from "react-native-maps";
import SearchInput from "../../../../components/SearchInput";
import { searchPlaces } from "../../../../lib/PlacesFinder";
import Product from "../../../../types/product";
import Store from "../../../../types/Store";
import IonIcons from "react-native-vector-icons/Ionicons";
import { useAppState } from "../../../../providers/AppStateProvider";
import { linkProductStore, upsertStore } from "../../../../lib/supabase";
import { Button } from "react-native-paper";

type Props = {
  navigation: any;
  route: any;
};

function ContributionScreen({ navigation, route }: Props) {
  const mapRef = React.useRef<MapView>(null);
  const [places, setPlaces] = React.useState<any[]>([]);
  const [selectedStore, setSelectedStore] = React.useState<Store | undefined>(
    undefined
  );
  const app = useAppState();

  const product: Product = route.params.product;

  const storeSelected = (store: Store) => {
    navigateMapTo(store.location);
    setSelectedStore(store);
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

  const onSubmit = async () => {
    if (selectedStore == undefined) return;

    //Show the loading overlay
    app.patchState("isLoading", true);

    const storeUpsertResult = await upsertStore(selectedStore);
    if (storeUpsertResult.error != null) {
      app.patchState("isLoading", false);
      return;
    }

    console.log(storeUpsertResult);

    console.log(product);
    console.log(selectedStore);

    const linkProductStoreResult = await linkProductStore(
      product.id,
      selectedStore.id
    );

    console.log(linkProductStoreResult);

    app.patchState("isLoading", false);
    navigation.goBack();
  };

  return (
    <View style={styles.page}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.backButton}
      >
        <IonIcons name={"arrow-back-outline"} size={40} />
      </TouchableOpacity>
      <View style={styles.mapContainer}>
        <View style={styles.searchInput}>
          <SearchInput
            onSubmit={(value: string) => {
              onPlaceSeach(value);
            }}
          />
        </View>
        <MapView //https://github.com/react-native-maps/react-native-maps/blob/master/docs/mapview.md
          style={styles.map}
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
        >
          {places.map((place: any, i: number) => {
            return (
              <Marker
                coordinate={place.location}
                title={place.name}
                key={place.id}
                onPress={() => storeSelected(place)}
              />
            );
          })}
        </MapView>
      </View>
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
                  onPress={() => storeSelected(place)}
                  style={[
                    styles.storeListItem,
                    selectedStore?.id == place.id //Add the selected style if the place is the one selected
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
      <Button
        // style={styles.button}
        disabled={selectedStore == undefined}
        onPress={() => {
          onSubmit();
        }}
      >
        OK
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    paddingBottom: 50,
  },
  contentView: {
    paddingHorizontal: 26,
  },
  mapContainer: {
    height: 350,
    position: "relative",
    alignItems: "center",
  },
  map: {
    height: "100%",
    width: "100%",
  },
  searchInput: {
    width: "90%",
    position: "absolute",
    zIndex: 999,
    bottom: 20,
  },
  storeListItem: {
    margin: 10,
  },
  storeListItemSelected: {
    textDecorationLine: "underline",
  },
  backButton: {
    backgroundColor: "white",
    borderRadius: 20,
    position: "absolute",
    top: 25,
    left: 25,
    zIndex: 888,
  },
});

export default ContributionScreen;
