import React, { useState } from "react";
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  Touchable,
  TouchableOpacity,
  View,
} from "react-native";
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
      data={[...itemList]}
      renderItem={({ item, index }) => {
        return (
          <View
            style={styles.listElement}
            key={item.id}
            onTouchEnd={() => onItemClick(item)}
          >
            <ListItemComponent>{item}</ListItemComponent>
          </View>
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

// function renderChildItem({
//   item,
//   onItemClick,
// }: {
//   item: Product;
//   onItemClick: Function;
// }) {
//   return (
//     <TouchableOpacity
//       style={styles.listElement}
//       key={item.id}
//       onPress={() => onItemClick(item)}
//     >
//       <ListItemComponent>{item}</ListItemComponent>
//     </TouchableOpacity>
//   );
// }

// function renderChildItems(list: Array<Product>, onItemClick: Function) {
//   return list.map((element, index) => {
//     return (
//       <TouchableOpacity
//         style={styles.listElement}
//         key={index}
//         onPress={() => onItemClick(element)}
//       >
//         <ListItemComponent>{element}</ListItemComponent>
//       </TouchableOpacity>
//     );
//   });
// }

const styles = StyleSheet.create({
  listElement: {
    marginTop: 5,
    marginBottom: 5,
  },
});

export default ListComponent;
