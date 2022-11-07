import React, { useState } from "react";
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  Touchable,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { TouchableRipple } from "react-native-paper";
import Product from "../types/product";

//Types import
import ListItemComponent from "./ListItemComponent";

type Props = {
  itemList: Array<Product>;
  onItemClick: Function;
};

function ListComponent({ itemList, onItemClick }: Props) {
  return (
    <View>
      {itemList.map((item) => {
        return (
          <TouchableRipple
            style={styles.listElement}
            key={item.id}
            onPress={() => onItemClick(item)}
          >
            <ListItemComponent>{item}</ListItemComponent>
          </TouchableRipple>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    flex: 1,
  },
  listElement: {
    marginBottom: 10,
  },
});

export default ListComponent;
