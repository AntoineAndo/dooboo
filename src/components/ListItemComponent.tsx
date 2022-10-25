import { useQuery } from "@tanstack/react-query";
import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { downloadImage } from "../lib/supabase";

//Types import
import Product from "../types/product";

type Props = {
  children: any;
};

function ListItemComponent({ children }: Props) {
  const { isLoading, isError, data, error } = useQuery(
    [children.product_image[0].image_url],
    () => downloadImage(children.product_image[0].image_url)
  );

  if (isLoading) {
    return <></>;
  }

  //Once the url of the image is loaded
  //It is set in the image object
  // so that it can be reused by other components
  const imageUrl = data?.data.publicUrl;
  children.imageUrl = imageUrl;

  return (
    <View style={styles.item}>
      {!isLoading && <Image source={{ uri: imageUrl }} style={styles.image} />}

      <View style={styles.textContainer}>
        <View style={styles.row}>
          <Text style={styles.title}>{children.name}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    flexDirection: "row",
    backgroundColor: "powderblue",
    height: 100,
    width: "100%",
  },
  image: {
    height: "100%",
    width: 100,
    resizeMode: "cover",
  },
  textContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-around",
    padding: 10,
  },
  row: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "500",
    color: "#000",
  },
});

export default ListItemComponent;
