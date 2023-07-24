import React, {
  useState,
  useRef,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import {
  StyleSheet,
  StatusBar,
  View,
  Dimensions,
  TouchableOpacity,
  BackHandler,
  FlatList,
} from "react-native";

import IonIcons from "react-native-vector-icons/Ionicons";

//Hooks
import { useConfig } from "../../../../providers/ConfigProvider";

import PageComponent from "../../../../components/PageComponent";
import MapView, { Camera, Circle, Marker, Region } from "react-native-maps";
import SearchHeaderComponent from "../../../../components/SearchHeaderComponent";
import * as Location from "expo-location";
import spacing from "../../../../config/spacing";
import commonStyles from "../../../../config/stylesheet";
import colors from "../../../../config/colors";
import { getNearbyStores } from "../../../../lib/supabase";
import SpinnerComponent from "../../../../components/SpinnerComponent";
import StoreCardComponent from "../../../../components/StoreCardComponent";
import { useFocusEffect } from "@react-navigation/native";
import { useAppState } from "../../../../providers/AppStateProvider";
import SearchHereButtonComponent from "../../../../components/SearchHereButtonComponent";
import NoStoresComponent from "../../../../components/NoStoresComponent";
import { useAuth } from "../../../../providers/AuthProvider";
import MarkerComponent from "../../../../components/MarkerComponent";

type Props = {
  navigation: any;
};

const screenHeight = Dimensions.get("screen").height;
const windowHeight = Dimensions.get("window").height;

const navbarHeight = screenHeight - windowHeight + 6;

function HomeScreen({ navigation }: Props) {
  const SEARCH_RADIUS = 1000; //Search radius in meters

  const { currentCountry } = useConfig();

  const { state, patchState } = useAppState();
  const { auth } = useAuth();

  const currentOffset = useRef(0);
  const [hasSearched, setHasSearched] = useState<Boolean>(false);
  const [mapRef, updateMapRef] = useState<any>(null);
  const [flatListRef, setFlatListRef] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<Boolean>(false);
  const [stores, setStores] = useState<any[]>([]);
  const [selectedStore, setSelectedStore] = useState<any>(undefined);
  const [filterType, setFilterType] = useState<"last" | "all">("last");
  const [canSearchHere, setCanSearchHere] = useState(false);
  const [cameraCenter, setCameraCenter] = useState<any>(undefined);
  const [mapReady, setMapReady] = useState(false);
  const [mapRegion, setMapRegion] = useState<
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

  /**
   * Fetch the stores when the userLocation is available and the map is ready
   * Refetch on userLocation status change
   */
  useEffect(() => {
    //If location becomes available
    // then center on user
    // then fetch nearby stores by passing the user's current location
    if (mapReady && state.userLocation.isAvailable && mapRef != null) {
      centerMapOnUser();

      fetchNearbyStores({
        center: {
          latitude: state.userLocation?.latitude,
          longitude: state.userLocation?.longitude,
        },
      });
    }
  }, [state.userLocation.isAvailable, mapReady]);

  //Change to true when a store card is taped and open
  //disables the MapView, and expand card if open
  const [isStoreOpen, setIsStoreOpen] = useState(false);

  /**
   * Called by a button press on the map
   * Centers the map camera on the user's location
   * //TODO: when trying to center while not located
   */
  const centerMapOnUser = useCallback(
    (ref?: any) => {
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
        mapRef.animateToRegion({
          latitude: state.userLocation?.latitude,
          longitude: state.userLocation?.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        });
      }
    },
    [state.userLocation, mapRef, Location]
  );

  //Create a back button press event listener
  // to close the modal
  useFocusEffect(() => {
    //Mount event listener
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        if (isStoreOpen) {
          setIsStoreOpen(false);
          return true;
        }
        return false;
      }
    );

    //Unmount event listener
    return () => {
      backHandler.remove();
    };
  });

  /**
   * Get stores around the center of the map
   *
   */
  const fetchNearbyStores = useCallback(
    async (location?: any, cb?: Function) => {
      if (mapRef === null || isLoading) {
        return;
      }

      setCanSearchHere(false);
      setSelectedStore(undefined);
      setHasSearched(true);
      setIsLoading(true);

      //If the location params is defined, then use it to fetch nearby stores
      //instead of the default center of the camera
      let camera = location ?? (await mapRef.getCamera());

      const cameraCenter = {
        latitude: camera.center.latitude,
        longitude: camera.center.longitude,
        distance: SEARCH_RADIUS,
      };

      setCameraCenter(cameraCenter);

      getNearbyStores(cameraCenter)
        .then((data) => {
          //Extract latitude and longitude from location field
          data = data.map((finding: any) => {
            finding.lat = finding.location.match(/(\d+\.\d+)/g)[1];
            finding.lng = finding.location.match(/(\d+\.\d+)/g)[0];

            return finding;
          });

          setStores(data);

          if (data.length != 0) {
            //Scroll to Store Card
            flatListRef.scrollToIndex({
              index: 0,
            });
            setSelectedStore(data[0]);
          } else {
            //Workaround
            // setTimeout(() => {
            //   fetchNearbyStores();
            // });
          }
          if (cb) {
            cb(data);
          }
        })
        .catch((e) => {
          setStores([]);
          console.error(e);
        })
        .finally(() => {
          setIsLoading(false);
        });
    },
    [mapRef, flatListRef]
  );

  const onMarkerPress = useCallback(
    (storeIndex: number) => {
      //Scroll to Store Card
      flatListRef.scrollToIndex({
        index: storeIndex,
      });

      selectStore(storeIndex);
    },
    [flatListRef, selectedStore]
  );

  const selectStore = useCallback(
    (storeIndex: number) => {
      console.log("storeIndex", storeIndex);
      //get store from index
      const _selectedStore = stores[storeIndex];

      console.log("sss", _selectedStore);

      //update offset ref
      //Used to work around the multiples scrollend events fired
      currentOffset.current = storeIndex * Dimensions.get("window").width;

      //Get the current camera then modify its center position
      mapRef.getCamera().then((camera: Camera) => {
        let newCamera = {
          ...camera,
          center: {
            latitude: parseFloat(_selectedStore.lat),
            longitude: parseFloat(_selectedStore.lng),
          },
        };

        mapRef.animateCamera(newCamera);

        //Update state
        setSelectedStore(_selectedStore);
      });
    },
    [mapRef, stores]
  );

  //Called when the flatlist snaps to a card
  const onScrollEnd = (offset: number) => {
    //Get index from scroll offset
    const storeIndex = Math.round(offset / Dimensions.get("window").width);

    selectStore(storeIndex);
  };

  const navigateProduct = useCallback(
    (product: any) => {
      navigation.navigate("Product", {
        product,
      });
    },
    [navigation]
  );

  /**
   * Allow the user to start the contribution submission process in the selected store
   */
  const addProductInStore = useCallback(() => {
    if (!auth.user) {
      return patchState("showAuthPop", true);
    }

    if (selectedStore) {
      navigation.navigate("AddNavigation", {
        store: selectedStore,
      });
    }
  }, [auth.user, navigation, selectedStore]);

  return (
    <PageComponent style={styles.page}>
      <StatusBar
        translucent
        backgroundColor={"transparent"}
        barStyle={"dark-content"}
      />
      <SearchHeaderComponent />

      <MapView //https://github.com/react-native-maps/react-native-maps/blob/master/docs/mapview.md
        style={styles.map}
        ref={(ref) => updateMapRef(ref)}
        initialRegion={
          state.userLocation.isAvailable
            ? ({
                latitude: state.userLocation.latitude,
                longitude: state.userLocation.longitude,
                latitudeDelta: 0.02,
                longitudeDelta: 0.02,
              } as Region)
            : mapRegion
        }
        pitchEnabled={true}
        rotateEnabled={false}
        showsBuildings={false}
        scrollEnabled={!isStoreOpen}
        zoomEnabled={!isStoreOpen}
        showsUserLocation={true}
        showsMyLocationButton={false}
        toolbarEnabled={false}
        onMapReady={() => setMapReady(true)}
        onRegionChangeComplete={() => setCanSearchHere(true)}
        moveOnMarkerPress={false}
        onTouchStart={() => {
          if (canSearchHere) {
            setCanSearchHere(false);
          }
        }}
      >
        {/* Markers */}
        {stores.map((place: any, index: number) => {
          const isSelected = selectedStore?.id == place.id;
          let color;
          if (place.vegan) {
            // color = isSelected ? colors.primary : colors.primary;
            color = colors.primary;
          } else {
            // color = isSelected ? "red" : colors.lightred;
            color = colors.lightred;
          }
          return (
            <MarkerComponent
              lat={place.lat}
              lng={place.lng}
              key={place.id + (isSelected ? "selected" : "")}
              isSelected={isSelected}
              onPress={() => {
                onMarkerPress(index);
              }}
              color={color}
            />
          );
        })}

        {/* Circle overlay */}
        {cameraCenter && (
          <Circle
            center={{
              latitude: cameraCenter.latitude,
              longitude: cameraCenter.longitude,
            }}
            radius={SEARCH_RADIUS}
            fillColor={colors.primary + "22"}
            strokeColor={colors.primary}
            strokeWidth={2}
          />
        )}
      </MapView>

      <View style={styles.flatListContainer}>
        {/* Spinner & Search here button*/}
        <View style={styles.actionContainer}>
          {!isLoading && canSearchHere && (
            <SearchHereButtonComponent
              onPress={fetchNearbyStores}
              style={{
                position: "relative",
                top: -50,
              }}
            />
          )}
          {isLoading && !canSearchHere && <SpinnerComponent />}
          <TouchableOpacity
            style={[
              styles.mapAction,
              {
                position: "absolute",
                right: spacing.s3,
                bottom: 60,
                zIndex: 999,
              },
            ]}
            onPress={() => {
              centerMapOnUser();
            }}
          >
            <IonIcons name="locate-outline" color={colors.darkgrey} size={25} />
          </TouchableOpacity>
        </View>

        <FlatList
          horizontal={true}
          style={styles.scrollViewStoreCards}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-start",
            alignItems: isStoreOpen ? "flex-end" : "stretch",
          }}
          decelerationRate={"normal"}
          snapToInterval={Dimensions.get("window").width}
          snapToAlignment={"center"}
          ref={(ref) => setFlatListRef(ref)}
          onMomentumScrollEnd={(e) => {
            let offset = e.nativeEvent.contentOffset.x;
            if (offset != currentOffset.current) {
              onScrollEnd(e.nativeEvent.contentOffset.x);
            }
          }}
          data={stores}
          renderItem={(store: any) => {
            return (
              <StoreCardComponent
                key={store.item.id}
                store={store.item}
                onPress={() => {
                  setIsStoreOpen(!isStoreOpen);
                }}
                isOpen={isStoreOpen}
                isSelected={selectedStore?.id == store.item.id}
                onProductPress={(product: any) => navigateProduct(product)}
                filter={filterType}
                setFilter={(filter: "last" | "all") => {
                  setFilterType(filter);
                }}
              />
            );
          }}
        />

        {/* Show the not found card if the query is finished and there are no results */}
        {!isLoading && hasSearched && stores.length == 0 && (
          <View style={styles.scrollViewStoreCards}>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "flex-start",
              }}
            >
              <NoStoresComponent />
            </View>
          </View>
        )}
      </View>

      {/* Fixed button to switch back to map view */}
      {isStoreOpen && (
        <View style={styles.mapActionsContainer}>
          <TouchableOpacity
            style={[styles.mapAction]}
            onPress={() => addProductInStore()}
          >
            <IonIcons name="add-outline" color={colors.grey} size={30} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.mapAction, { marginTop: spacing.s1 }]}
            onPress={() => setIsStoreOpen(false)}
          >
            <IonIcons name="map-outline" color={colors.grey} size={25} />
          </TouchableOpacity>
        </View>
      )}
    </PageComponent>
  );
}

const styles = StyleSheet.create({
  page: {},
  map: {
    height: "100%",
    width: "100%",
  },
  mapActionsContainer: {
    position: "absolute",
    zIndex: 11,
    bottom: navbarHeight + spacing.s2,
    right: spacing.s3,
    display: "flex",
    flexDirection: "column",
  },
  mapAction: {
    zIndex: 999,
    display: "flex",
    width: 40,
    height: 40,
    backgroundColor: "white",
    borderRadius: 25,
    ...commonStyles.elevation2,
    justifyContent: "center",
    alignItems: "center",
  },
  actionContainer: {
    position: "absolute",
    width: "100%",
    // top: -60,
    height: 50,
    zIndex: 9,
    flexDirection: "row",
    justifyContent: "center",
  },
  flatListContainer: {
    position: "absolute",
    // bottom: navbarHeight - 2,
    bottom: 0,
    left: 0,
  },
  scrollViewStoreCards: {
    minHeight: spacing.s3,
    width: Dimensions.get("window").width,
    overflow: "visible",
    zIndex: 10,
  },
});

export default HomeScreen;
