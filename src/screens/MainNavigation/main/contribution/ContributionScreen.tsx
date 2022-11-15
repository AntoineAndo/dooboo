import React from "react";
import {
  Alert,
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
import {
  deleteContribution,
  getContributions,
  linkProductStore,
  upsertStore,
} from "../../../../lib/supabase";
import { Button } from "react-native-paper";
import { useAuth } from "../../../../providers/AuthProvider";
import { useQuery } from "@tanstack/react-query";
import colors from "../../../../config/colors";
import { useConfig } from "../../../../providers/ConfigProvider";

type Props = {
  navigation: any;
  route: any;
};

const markerLimit = 5;

function ContributionScreen({ navigation, route }: Props) {
  const mapRef = React.useRef<MapView>(null);
  const { config } = useConfig();
  const [places, setPlaces] = React.useState<any[]>([]);
  const [selectedStore, setSelectedStore] = React.useState<Store | undefined>(
    undefined
  );
  const app = useAppState();
  const { auth } = useAuth();
  const {
    isLoading,
    isError,
    data: myContributions,
    refetch,
  } = useQuery({
    queryKey: ["contributions_" + auth.user?.id],
    queryFn: () => {
      if (auth.user != undefined) {
        return getContributions(auth.user.id);
      }
    },
    select: (data: any) => {
      if (data.length != 0) {
        //Get only the store list out of the product_store list result
        let storeList = data.map((p_s: any) => {
          return p_s.store;
        });

        return storeList;
      }
      return [];
    },
    initialData: [],
  });

  const product: Product = route.params.product;

  const storeSelected = (store: Store) => {
    navigateMapTo({ latitude: store.lat, longitude: store.lng } as LatLng);
    setSelectedStore(store);
  };

  const unselectStore = () => {
    setSelectedStore(undefined);
  };

  const navigateMapTo = ({ latitude, longitude }: LatLng) => {
    const region = {
      latitude,
      longitude,
      latitudeDelta: 0.00922,
      longitudeDelta: 0.00421,
    };
    mapRef.current?.animateToRegion(region);
  };

  const onPlaceSeach = (searchQuery: string) => {
    if (searchQuery == undefined || searchQuery.length < 3) {
      return;
    }

    const options = {
      country: config.dropdownValues.countries.find(
        (country: any) => country.id == config.countryId
      ),
      language: config.language_code,
      searchQuery: searchQuery,
    };

    searchPlaces(options).then((results: Store[]) => {
      let storeList = results;

      //Get list of the stores where the user already contributed
      const excludePlacesId = myContributions.map((p: Store) => {
        return p.id;
      });

      //Filter out already contributed stores
      storeList = storeList.filter(
        (store: any) => excludePlacesId.indexOf(store.id) == -1
      );

      setPlaces(storeList);

      //Center map on the first marker
      if (storeList[0] != undefined) {
        let coordinates = storeList.map((result: Store) => {
          return { latitude: result.lat, longitude: result.lng } as LatLng;
        });
        navigateMapTo({
          latitude: storeList[0].lat,
          longitude: storeList[0].lng,
        } as LatLng);
        mapRef.current?.fitToCoordinates(coordinates);
      }
    });
  };

  const onSubmit = async () => {
    if (selectedStore == undefined || selectedStore.id == undefined) {
      console.error("Error with the selected store");
      return;
    }

    if (auth.user == undefined) {
      console.error("Not allowed to execute this operation");
      navigation.redirect("Authentication");
      return;
    }

    //Show the loading overlay
    app.patchState("isLoading", true);

    const storeUpsertResult = await upsertStore(selectedStore);
    if (storeUpsertResult.error != null) {
      app.patchState("isLoading", false);
      return;
    }

    const linkProductStoreResult = await linkProductStore(
      product.id,
      selectedStore.id,
      auth.user
    );

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
            if (i < markerLimit) {
              return (
                <Marker
                  coordinate={{ latitude: place.lat, longitude: place.lng }}
                  title={place.name}
                  key={place.id}
                  onPress={() => storeSelected(place)}
                />
              );
            }
          })}
          {/* My contributions */}
          {myContributions.map((place: any, i: number) => {
            return (
              <Marker
                coordinate={{
                  latitude: parseFloat(place.lat),
                  longitude: parseFloat(place.lng),
                }}
                title={place.name}
                key={place.id}
                pinColor={colors.primary}
                onPress={() => unselectStore()}
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
            {places.map((place: any, i: number) => {
              if (i < markerLimit) {
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
              }
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
