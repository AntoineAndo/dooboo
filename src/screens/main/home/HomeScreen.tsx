import React, { useEffect, useState } from "react";
import { Text, StyleSheet, View } from "react-native";
import ListComponent from "../../../components/ListComponent";
import SearchBarComponent from "../../../components/SearchBarComponent";
import { supabase } from "../../../lib/supabase";

import { TabActions } from "@react-navigation/native";

import { LayoutAnimation } from "react-native";

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
    getProducts((products: Array<Product>) => {
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
  // const nav = TabActions.jumpTo("Search");
  // navigation.dispatch(nav);
  LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
  navigation.navigate("Search");
}

function getProducts(done: Function) {
  supabase
    .from("product")

    .select(
      `
        id,
        name,
        product_store (
          count,
          store (
            name
          )
        )
      `
    )
    .then(({ data: products, error }) => {
      if (error != undefined) {
        console.error(error.message);
        console.error(error.hint);
      }

      done(products as Array<Product>);
    });
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
