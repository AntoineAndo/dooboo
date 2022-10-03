import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import Product from "../types/product";

//Types import
import ListItemComponent from "./ListItemComponent";

type Props = {
  itemList: Array<Product>;
};

function ListComponent({ itemList }: Props) {
  return <View>{renderChildItems(itemList)}</View>;
}

function renderChildItems(list: Array<Product>) {
  return list.map((element, index) => {
    return (
      <View style={styles.listElement}>
        <ListItemComponent key={index}>{element}</ListItemComponent>
      </View>
    );
  });
}

const styles = StyleSheet.create({
  listElement: {
    marginTop: 5,
    marginBottom: 5,
  },
});

export default ListComponent;
