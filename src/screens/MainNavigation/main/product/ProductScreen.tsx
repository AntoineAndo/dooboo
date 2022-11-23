import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import IonIcons from "react-native-vector-icons/Ionicons";
import MapView, { Marker } from "react-native-maps";
import { useQuery } from "@tanstack/react-query";
import { getProducts } from "../../../../lib/supabase";
import { Button } from "react-native-paper";
import { useFocusEffect } from "@react-navigation/native";

type Props = {
  route: any;
  navigation: any;
};

function ProductScreen({ route, navigation }: Props) {
  const [places, setPlaces] = React.useState<any[]>([]);

  useFocusEffect(() => {
    refetch();
  });

  let productInitialData = route.params.product;
  const imageUrl = productInitialData.imageUrl;

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
    select: (data: any[]) => {
      if (data.length != 0) {
        return data[0];
      }
    },
    initialData: productInitialData,
  });

  const openContribution = () => {
    navigation.navigate("Contribution", { product: product });
  };

  if (product == undefined) {
    return <></>;
  }

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
          rotateEnabled={false}
          showsUserLocation={true}
          showsMyLocationButton={true}
          toolbarEnabled={false}
        >
          {product.product_store.map(({ store }: any, i: number) => {
            console.log(store);
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
