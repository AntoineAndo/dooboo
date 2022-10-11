import React, { useEffect, useState } from "react";
import { Text, StyleSheet, View } from "react-native";
import ListComponent from "../../../components/ListComponent";
import SearchBarComponent from "../../../components/SearchBarComponent";
import { getProducts } from "../../../lib/supabase";

//Style import
import commonStyles from "../../../config/stylesheet";

//Types import
import Product from "../../../types/product";

type Props = {
  navigation: any;
};

function HomeScreen({ navigation }: Props) {
  let [productList, setProductList]: [Array<Product>, Function] = useState([]);

  useEffect(() => {
    getProducts(1, (products: Array<Product>) => {
      setProductList(products);
    });
  }, []);

  return (
    <View style={styles.page}>
      <View style={[styles.searchBarContainer, commonStyles.bottomShadow]}>
        <SearchBarComponent onTouch={() => startSearch(navigation)} />
      </View>
      <View style={styles.content}>
        <Text style={commonStyles.label}>Latest products</Text>
        <ListComponent itemList={productList}></ListComponent>
      </View>
    </View>
  );
}

function startSearch(navigation: any) {
  navigation.navigate("Search");
}

const styles = StyleSheet.create({
  page: {
    backgroundColor: "#fff",
    height: "100%",
  },
  searchBarContainer: {},
  content: {
    padding: 20,
  },
});

export default HomeScreen;
