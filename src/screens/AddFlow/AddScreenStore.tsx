import React, { useCallback, useMemo } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Keyboard,
  Animated,
  StatusBar,
  Pressable,
} from "react-native";
import HeaderComponent from "../../components/HeaderComponent";

import MapView, { LatLng, Marker } from "react-native-maps";

import { searchPlaces } from "../../lib/PlacesFinder";
import Store from "../../types/Store";
import Form from "../../types/Form";
import { useConfig } from "../../providers/ConfigProvider";
import ButtonComponent from "../../components/ButtonComponent";
import RadioComponent from "../../components/RadioComponent";
import SeparatorComponent from "../../components/SeparatorComponent";
import spacing from "../../config/spacing";
import T from "../../components/T";
import NetworkViewComponent from "../../components/NetworkViewComponent";
import OfflineCard from "../../components/OfflineCard";
import PageComponent from "../../components/PageComponent";

import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import BottomSheetSearchInputComponent from "../../components/BottomSheetSearchInput";
import commonStyles from "../../config/stylesheet";
import { useAppState } from "../../providers/AppStateProvider";
import * as Location from "expo-location";
import SearchHereButtonComponent from "../../components/SearchHereButtonComponent";
import { useTranslation } from "../../hooks/translation";
// import IonIcons from "react-native-vector-icons/Ionicons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import colors from "../../config/colors";
import SpinnerComponent from "../../components/SpinnerComponent";
import { getStoreById } from "../../lib/supabase";
import MarkerComponent from "../../components/MarkerComponent";

type Props = {
  route: any;
  navigation: any;
};

function AddScreenStore({ route, navigation }: Props) {
  let initialState: Form = route.params != undefined ? route.params.form : {};
  initialState.errors = {};

  const [form, setForm] = React.useState<Form>(initialState);
  const { state, patchState } = useAppState();
  const { currentCountry } = useConfig();
  const [places, setPlaces] = React.useState<any[]>(
    form.store?.preset ? [form.store] : []
  );
  const { translate } = useTranslation();
  const [mapRegion, setMapRegion] = React.useState<
    | {
        latitude: number;
        longitude: number;
        latitudeDelta: number;
        longitudeDelta: number;
      }
    | undefined
  >({
    latitude: currentCountry.default_latitude,
    longitude: currentCountry.default_longitude,
    latitudeDelta: currentCountry.delta,
    longitudeDelta: currentCountry.delta,
  });
  const [isLoading, setIsLoading] = React.useState(false);
  const { config } = useConfig();
  const [canSearchHere, setCanSearchHere] = React.useState(false);

  //If the store is preset,
  // then the initial search is the store's name
  const [currentSearch, setCurrentSearch] = React.useState(
    form.store?.preset ? form.store.name : ""
  );

  const mapRef = React.useRef<any>(null);

  const bottomSheetRef = React.useRef<BottomSheet>(null);

  const heightAnim = React.useRef(new Animated.Value(540)).current;

  // callbacks
  const handleSheetChanges = React.useCallback((index: number) => {
    if (index == 2) {
      Animated.timing(heightAnim, {
        toValue: 330,
        duration: 100,
        useNativeDriver: false,
      }).start();
    } else if (index == 1) {
      Animated.timing(heightAnim, {
        toValue: 480,
        duration: 100,
        useNativeDriver: false,
      }).start();
    } else if (index == 0) {
      Animated.timing(heightAnim, {
        toValue: 540,
        duration: 100,
        useNativeDriver: false,
      }).start();
    }
  }, []);

  //Handle user location availability change
  React.useEffect(() => {
    //If location becomes available
    // then center on user
    // then fetch nearby stores by passing the user's current location
    if (state.userLocation.isAvailable && mapRef.current != null) {
      centerMapOnUser();
    }
  }, [state.userLocation.isAvailable]);

  //Max number of markers displayed after search
  const markerLimit = 5;

  /**
   * @description Called when the Next button is clicked
   * Check for errors and if none, navigate to the next page
   */
  const onSubmit = () => {
    if (!form.store?.id) {
      return;
    }

    //If the store is preset, navigate to the Images screen
    if (form.store.preset) {
      return navigation.navigate("AddScreenImages", { form: form });
    }

    //Check if the selected store is already stored
    getStoreById(form.store?.id)
      .then(({ data, error }) => {
        if (error) {
          console.error("Error fetching store information", error);
          return;
        }

        // If the selected store already exists, go to the AddScreenImage
        if (data[0]) {
          navigation.navigate("AddScreenImages", { form: form });
        } else {
          //Else go to the Store Details screen
          navigation.navigate("AddScreenStoreDetails", { form: form });
        }
      })
      .catch((e: any) => {
        console.error("Error fetching store information", e);
      });
  };

  const placeSelected = (place: Store) => {
    const placeLocation = {
      latitude: place.lat,
      longitude: place.lng,
    };
    navigateMapTo(placeLocation);
    patchForm("store", place);
  };

  //Method used to update the form/state value
  const patchForm = (key: string, value: any) => {
    setForm({
      ...form,
      [key]: value,
    });
  };

  const onPlaceSearch = async () => {
    if (currentSearch == "") {
      return;
    }

    setCanSearchHere(false);

    setIsLoading(true);

    const options: any = {
      country: config.dropdownValues.countries.find(
        (country: any) => country.id == config.countryId
      ),
      language: "en",
      searchQuery: currentSearch,
      location: undefined,
    };

    //If searchQuery is undefined, it means that the "search here" button was pressed
    // so we use the map boundaries

    //If user location is undefined or search query undefined
    // then we use the map boundaries
    let camera = await mapRef.current.getCamera();
    options.location = {
      lat: camera.center.latitude,
      lng: camera.center.longitude,
    };

    searchPlaces(options)
      .then((results: Store[]) => {
        setPlaces(results);

        //Center map on the first marker
        if (results[0] != undefined) {
          let coordinates = results.map((result: Store) => {
            let coordinate: LatLng = {
              latitude: parseFloat(result.lat),
              longitude: parseFloat(result.lng),
            };
            return coordinate;
          });
          navigateMapTo({
            latitude: parseFloat(results[0].lat),
            longitude: parseFloat(results[0].lng),
          } as LatLng);
          mapRef.current.fitToCoordinates(coordinates);
        }
      })
      .catch((e) => {
        console.error(e);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  /**
   * Called by a button press on the map
   * Centers the map camera on the user's location
   * //TODO: when trying to center while not located
   */
  const centerMapOnUser = (ref?: any) => {
    if (!state.userLocation.isAvailable) {
      Location.getCurrentPositionAsync().then((location) => {
        patchState("userLocation", {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          isAvailable: true,
        });
      });
    }
    if (ref != undefined) {
      ref.animateToRegion({
        latitude: state.userLocation?.latitude,
        longitude: state.userLocation?.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    } else {
      mapRef.current.animateToRegion({
        latitude: state.userLocation?.latitude,
        longitude: state.userLocation?.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    }
  };

  //On input clear, reset search and center camera on user
  const clearSearch = useCallback(() => {
    setPlaces([]);
    if (state.userLocation.isAvailable && mapRef.current != null) {
      centerMapOnUser();
    }
  }, [mapRef.current]);

  const navigateMapTo = ({ latitude, longitude }: LatLng) => {
    const region = {
      latitude,
      longitude,
      latitudeDelta: 0.00922,
      longitudeDelta: 0.00421,
    };
    mapRef.current.animateToRegion(region);
  };

  const displayStoreList = () => {
    if (isLoading) {
      return (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Image
            source={require("assets/loader.gif")}
            style={{
              height: 60,
              width: 60,
            }}
          />
        </View>
      );
    }

    return (
      places.length != 0 && (
        <BottomSheetScrollView
          style={styles.storeList}
          keyboardShouldPersistTaps={"never"}
          keyboardDismissMode={"interactive"}
        >
          <View style={{ height: spacing.s3 }}></View>
          {places.map((place: any, i: number) => {
            if (i < markerLimit) {
              return (
                <View key={place.id}>
                  <TouchableOpacity
                    style={styles.radioContainer}
                    onPress={() => placeSelected(place)}
                  >
                    <RadioComponent
                      checked={form.store?.id == place.id}
                      onPress={() => placeSelected(place)}
                    />
                    <T style={styles.radioLabel}>{place.name}</T>
                  </TouchableOpacity>

                  {i != markerLimit - 1 && <SeparatorComponent />}
                </View>
              );
            }
          })}
          <View style={{ height: spacing.s3 }}></View>
        </BottomSheetScrollView>
      )
    );
  };

  let initialRegion = (() => {
    //If the store is preset
    //Then center the map on the store location
    if (form.store?.preset) {
      return {
        //@ts-ignore
        latitude: parseFloat(form.store.lat),
        //@ts-ignore
        longitude: parseFloat(form.store.lng),
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };
    }

    //Else if the user location is available, return it
    //Else return the default map region
    return state.userLocation.isAvailable
      ? {
          latitude: state.userLocation.latitude,
          longitude: state.userLocation.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }
      : mapRegion;
  })();

  return (
    <PageComponent withNavbar={route.params.withNavbar ?? false}>
      <View style={styles.header}>
        <HeaderComponent
          title={
            route.params.title
              ? translate(route.params.title)
              : translate("add_product")
          }
          showBackButton={false}
          subtitle={
            route.params.subtitle == ""
              ? undefined
              : translate("product_location")
          }
        />
      </View>

      <NetworkViewComponent
        style={styles.pageContent}
        offlineComponent={<OfflineCard />}
      >
        <Animated.View
          style={[
            styles.mapContainer,
            {
              height: heightAnim,
            },
          ]}
        >
          {isLoading && <SpinnerComponent style={{ alignSelf: "center" }} />}
          <MapView //https://github.com/react-native-maps/react-native-maps/blob/master/docs/mapview.md
            style={styles.map}
            onTouchStart={() => {
              Keyboard.dismiss();
            }}
            onRegionChange={() => {
              if (canSearchHere) {
                setCanSearchHere(false);
              }
            }}
            onRegionChangeComplete={() => {
              setCanSearchHere(true);
            }}
            ref={mapRef}
            //@ts-ignore
            initialRegion={initialRegion}
            pitchEnabled={false}
            rotateEnabled={false}
            showsUserLocation={true}
            showsMyLocationButton={true}
            mapPadding={{
              top: 0,
              bottom: 30,
              left: 0,
              right: 0,
            }}
            toolbarEnabled={false}
          >
            {/* Loop over the search results */}
            {places.map((place: Store, i: number) => {
              if (i < markerLimit) {
                const isSelected = form.store?.id == place.id;
                return (
                  <MarkerComponent
                    lat={place.lat}
                    lng={place.lng}
                    key={place.id + (isSelected ? "selected" : "")}
                    isSelected={isSelected}
                    onPress={() => placeSelected(place)}
                    color={isSelected ? "red" : colors.lightred}
                  />
                );
              }
            })}
          </MapView>

          {canSearchHere && currentSearch != "" && (
            <View style={styles.searchHereContainer}>
              <SearchHereButtonComponent
                onPress={onPlaceSearch}
                style={{
                  position: "relative",
                  top: -30,
                }}
              />
            </View>
          )}
        </Animated.View>

        {form.errors["store"] && (
          <T style={styles.error}>{translate("pick_store_or_skip")}</T>
        )}
        <BottomSheet
          ref={bottomSheetRef}
          index={form.store?.preset ? 1 : 0} //If the store is preset, expand to first snappoint
          snapPoints={[90, 150, 300]}
          keyboardBehavior={"extend"}
          style={{
            padding: spacing.s2,
          }}
          containerStyle={{
            marginBottom: 59,
            position: "relative",
          }}
          backgroundStyle={{
            borderRadius: 25,
            elevation: 10,
          }}
          onChange={(to) => {
            handleSheetChanges(to);
          }}
          enableOverDrag={true}
        >
          <BottomSheetSearchInputComponent
            onSubmit={(value: string) => {
              onPlaceSearch();
            }}
            onChange={(value: string) => {
              setCurrentSearch(value);
            }}
            onClear={clearSearch}
            value={currentSearch}
          />
          {displayStoreList()}
        </BottomSheet>
      </NetworkViewComponent>

      <View style={commonStyles.footer}>
        <ButtonComponent onPress={() => navigation.goBack()} type="secondary">
          {translate("back")}
        </ButtonComponent>
        <ButtonComponent onPress={() => onSubmit()}>
          {form.store == undefined ? translate("skip") : translate("next")}
        </ButtonComponent>
      </View>
    </PageComponent>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    marginTop: StatusBar.currentHeight,
  },
  header: {
    marginTop: 10,
  },
  pageContent: {
    flex: 1,
    // paddingBottom: 50,
  },
  storeList: {
    paddingHorizontal: spacing.s2,
  },
  mapContainer: {
    zIndex: -1,
  },
  map: {
    flex: 1,
    zIndex: -1,
  },
  findingsLoaderContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: 50,
    zIndex: 999,
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
  },
  searchHereContainer: {
    position: "absolute",
    width: "100%",
    // top: -60,
    bottom: 0,
    height: 50,
    zIndex: 9,
    flexDirection: "row",
    justifyContent: "center",
  },
  error: {
    color: "red",
  },
  radioContainer: {
    height: 40,
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    flexDirection: "row",
  },
  radioLabel: {
    marginLeft: spacing.s1,
  },
});

export default AddScreenStore;
