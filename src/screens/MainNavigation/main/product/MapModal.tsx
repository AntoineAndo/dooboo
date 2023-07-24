import React from "react";
import {
  BackHandler,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import IonIcons from "react-native-vector-icons/Ionicons";
import MapView, { Marker } from "react-native-maps";
import { useFocusEffect } from "@react-navigation/native";
import { useConfig } from "../../../../providers/ConfigProvider";
import * as Location from "expo-location";
import { getNearbyStores, getProductFindings } from "../../../../lib/supabase";
import SpinnerComponent from "../../../../components/SpinnerComponent";
import spacing from "../../../../config/spacing";

type Props = {
  product: any;
  style: any;
  onClose: Function;
  initialMapRegion: any;
};

function MapModal({ product, style, onClose, initialMapRegion }: Props) {
  const [findings, setFindings] = React.useState<any[]>([]);
  const [findingsLoading, setFindingsLoading] = React.useState(false);
  const [mapRef, updateMapRef] = React.useState<any>(null);
  //Create a back press handler to close the map
  useFocusEffect(() => {
    //Mount event listener
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        onClose();
        return true;
      }
    );

    //Unmount event listener
    return () => {
      backHandler.remove();
    };
  });
  const { currentCountry } = useConfig();
  const [mapRegion, setMapRegion] = React.useState<
    | {
        latitude: number;
        longitude: number;
        latitudeDelta: number;
        longitudeDelta: number;
      }
    | undefined
  >(initialMapRegion);

  //Location permission
  React.useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        // setErrorMsg("Permission to access location was denied");
        return;
      }

      //Once the user location access is granted
      //Navigate the map to its location
      Location.getCurrentPositionAsync({})
        .then((location: any) => {
          let userRegion = {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          };

          setMapRegion(userRegion);

          //Navigate to user's location once it's defined
          mapRef.animateToRegion(userRegion);
        })
        .catch((e) => {
          //If the user already granted the app the geoloc access
          // but geoloc is disabled
          console.log("error", "Device's location is disabled");
        });
    })();
  }, []);

  const getFindings = async () => {
    if (mapRef === null) {
      return;
    }

    let camera = await mapRef.getCamera();

    setFindingsLoading(true);

    getNearbyStores({
      latitude: camera.center.latitude,
      longitude: camera.center.longitude,
      distance: 1000,
      product_id: product.id,
    })
      .then((data) => {
        //Extract latitude and longitude from location field
        data = data.map((finding: any) => {
          finding.lat = finding.location.match(/(\d+\.\d+)/g)[1];
          finding.lng = finding.location.match(/(\d+\.\d+)/g)[0];

          return finding;
        });

        setFindings(data);
      })
      .catch((e) => {
        console.error(e);
      })
      .finally(() => {
        setFindingsLoading(false);
      });
  };

  const styles = StyleSheet.create({
    mapModal: {
      height: "100%",
      width: "100%",
      backgroundColor: "white",
    },
    map: {
      flex: 1,
    },
    backButton: {
      backgroundColor: "white",
      borderRadius: 20,
      position: "absolute",
      top: 25,
      left: 25,
      zIndex: 5,
      padding: 5,
    },
  });

  return (
    <View style={[styles.mapModal, style]}>
      <StatusBar
        translucent
        backgroundColor={"white"}
        barStyle={"dark-content"}
      />
      {/* FIXED BUTTONS */}
      <TouchableOpacity
        onPress={() => {
          onClose();
        }}
        style={styles.backButton}
      >
        <IonIcons name={"arrow-back-outline"} size={30} />
      </TouchableOpacity>

      {findingsLoading && (
        <View
          style={{
            position: "absolute",
            top: spacing.s3,
            zIndex: 999,
            flex: 1,
            width: "100%",
          }}
        >
          <SpinnerComponent style={{ alignSelf: "center" }} />
        </View>
      )}

      <MapView //https://github.com/react-native-maps/react-native-maps/blob/master/docs/mapview.md
        style={styles.map}
        ref={(ref) => updateMapRef(ref)}
        onMapReady={() => getFindings()}
        initialRegion={mapRegion}
        onRegionChangeComplete={(e) => {
          getFindings();
        }}
        pitchEnabled={false}
        rotateEnabled={false}
        showsUserLocation={true}
        showsMyLocationButton={true}
        showsPointsOfInterest={false}
        toolbarEnabled={false}
      >
        {findings.map((store: any, i: number) => {
          return (
            <Marker
              coordinate={{
                latitude: parseFloat(store.lat),
                longitude: parseFloat(store.lng),
              }}
              title={store.name}
              key={store.id}
            />
          );
        })}
      </MapView>
    </View>
  );
}

export default MapModal;
