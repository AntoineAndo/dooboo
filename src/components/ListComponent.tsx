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
  refresh: Function;
};

function ListComponent({ itemList, onItemClick, refresh }: Props) {
  const [refreshing, setRefreshing] = React.useState(false);

  //TODO
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);

    refresh().then(() => setRefreshing(false));
  }, []);

  return (
    <FlatList
      contentContainerStyle={styles.list}
      data={[...itemList]}
      renderItem={({ item, index }) => {
        return (
          <TouchableRipple
            style={styles.listElement}
            key={item.id}
            onPress={() => onItemClick(item)}
          >
            <ListItemComponent>{item}</ListItemComponent>
          </TouchableRipple>
        );
      }}
      keyExtractor={(item) => item.id}
      onRefresh={() => {}}
      refreshing={true}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    ></FlatList>
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
