import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import GoogleMapReact from "google-map-react";
import MarkerComponent from "../../../../components/MarkerComponent";
//@ts-ignore
import { REACT_APP_GOOGLE_API_KEY } from "@env";
import IonIcons from "react-native-vector-icons/Ionicons";

type Props = {
  route: any;
  navigation: any;
};

function ProductScreen({ route, navigation }: Props) {
  const [google, setGoogle] = React.useState<{ map?: any; maps?: any }>({});
  const [places, setPlaces] = React.useState<any[]>([]);

  let productInitialData = route.params.product;
  let initialStores: any[] = [];

  React.useEffect(() => {
    productInitialData.product_store.forEach(({ store }: any) => {
      initialStores.push(store);
    });
    setPlaces(initialStores);
    console.log(productInitialData);
    console.log(initialStores);
  }, []);

  const handleApiLoaded = (map: any, maps: any) => {
    setGoogle({
      map,
      maps,
    });
    if (places.length != 0) {
      map.setCenter({
        latitude: parseFloat(places[0].latitude),
        longitude: parseFloat(places[0].longitude),
      });
    }
  };

  const defaultProps = {
    center: {
      latitude: 37.555015,
      longitude: 126.937007,
    },
    zoom: 15,
  };

  console.log(productInitialData);

  return (
    <View>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.backButton}
      >
        <IonIcons name={"arrow-back-outline"} size={40} />
      </TouchableOpacity>
      <Image
        source={{ uri: productInitialData.imageUrl }}
        style={styles.mainImage}
      />
      <Text style={styles.title}>{productInitialData.name}</Text>

      <View style={styles.mapContainer}></View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainImage: {
    height: 300,
    resizeMode: "cover",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  mapContainer: {
    height: 300,
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

export default ProductScreen;
