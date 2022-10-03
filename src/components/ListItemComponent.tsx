import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";

//Types import
import Product from "../types/product";

type Props = {
  key: number;
  children: Product;
};

function ListItemComponent({ children }: Props) {
  return (
    <View style={styles.item}>
      <Image
        source={{ uri: "https://via.placeholder.com/200x100.jpg" }}
        style={styles.image}
      />
      <View style={styles.textContainer}>
        <View style={styles.row}>
          <Text style={styles.title}>{children.name}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.stores}>{getStoreList(children)}</Text>
        </View>
      </View>
    </View>
  );
}

function getStoreList(product: Product): string {
  if (product.product_store == undefined || product.product_store.length == 0) {
    return "";
  }

  return product.product_store
    .reduce((acc, product_store) => {
      acc.push(product_store.store.name);
      return acc;
    }, [])
    .join(", ");
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
  stores: {
    fontSize: 18,
  },
});

export default ListItemComponent;
