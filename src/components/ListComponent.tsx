import React, { useState } from "react";
import { StyleSheet, Touchable, TouchableOpacity, View } from "react-native";
import Product from "../types/product";

//Types import
import ListItemComponent from "./ListItemComponent";

type Props = {
  itemList: Array<Product>;
  onItemClick: Function;
};

function ListComponent({ itemList, onItemClick }: Props) {
  return <View>{renderChildItems(itemList, onItemClick)}</View>;
}

function renderChildItems(list: Array<Product>, onItemClick: Function) {
  return list.map((element, index) => {
    return (
      <TouchableOpacity
        style={styles.listElement}
        key={index}
        onPress={() => onItemClick(element)}
      >
        <ListItemComponent>{element}</ListItemComponent>
      </TouchableOpacity>
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
