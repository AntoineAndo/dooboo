import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import GoogleMapReact from "google-map-react";
import MarkerComponent from "../../../../components/MarkerComponent";
//@ts-ignore
import { REACT_APP_GOOGLE_API_KEY } from "@env";
import IonIcons from "react-native-vector-icons/Ionicons";
import MapView, { Marker } from "react-native-maps";
import { useQuery } from "@tanstack/react-query";
import { getProducts } from "../../../../lib/supabase";
import { Button } from "react-native-paper";

type Props = {
  route: any;
  navigation: any;
};

function ProductScreen({ route, navigation }: Props) {
  const [places, setPlaces] = React.useState<any[]>([]);

  let productInitialData = route.params.product;
  const imageUrl = productInitialData.imageUrl;

  console.log(productInitialData);
  let initialStores: any[] = [];

  React.useEffect(() => {
    productInitialData.product_store.forEach(({ store }: any) => {
      initialStores.push(store);
    });
    console.log(initialStores);
    setPlaces(initialStores);
  }, []);

  const {
    isLoading,
    isError,
    data: product,
    refetch,
  } = useQuery({
    queryKey: ["product_" + productInitialData.id],
    queryFn: () => {
      const searchQuery = {
        id: productInitialData.id,
      };
      return getProducts(searchQuery);
    },
    initialData: productInitialData,
  });

  const openContribution = () => {
    navigation.navigate("Contribution", { product: product });
  };

  console.log(product);

  return (
    <View>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.backButton}
      >
        <IonIcons name={"arrow-back-outline"} size={40} />
      </TouchableOpacity>
      <Image source={{ uri: imageUrl }} style={styles.mainImage} />
      <Text style={styles.title}>{product.name}</Text>
      <Button onPress={() => openContribution()}>I found this product</Button>

      <View style={styles.mapContainer}>
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
        >
          {places.map((place: any, i: number) => {
            return (
              <Marker
                coordinate={{
                  latitude: parseFloat(place.lat),
                  longitude: parseFloat(place.lng),
                }}
                title={place.name}
                key={place.id}
              />
            );
          })}
        </MapView>
      </View>
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
  map: {
    height: "100%",
    width: "100%",
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
