import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, ScrollView } from "react-native";
import IonIcons from "react-native-vector-icons/Ionicons";
import ListComponent from "../../../../components/ListComponent";
import Loader from "../../../../components/Loader";

//Style import
import commonStyles from "../../../../config/stylesheet";
import { getProducts } from "../../../../lib/supabase";
import { useConfig } from "../../../../providers/ConfigProvider";
import Product from "../../../../types/product";

type Props = {
  route: any;
  navigation: any;
};

function SearchResultScreen({ route, navigation }: Props) {
  const { config } = useConfig();
  const { searchParams } = route.params;

  const onProductClick = (product: any) => {
    navigation.navigate("Product", { product });
  };

  const {
    isLoading,
    isError,
    data: products,
    error,
  } = useQuery(["products_categories"], () => {
    let categoriesId: any[] = [];
    searchParams.categories.forEach((category: any) => {
      categoriesId.push(category.id);
    });

    const searchQuery = {
      country: config.countryId,
      categoriesId,
    };
    return getProducts(searchQuery);
  });

  if (isError || products == null || products == undefined) {
    return <></>;
  }

  console.log(products.length + " result(s)");

  return (
    <View style={styles.page}>
      <View style={[styles.header, commonStyles.bottomShadow]}>
        <View style={styles.container}>
          <IonIcons
            name={"arrow-back-outline"}
            style={styles.headerAction}
            size={40}
            onPress={() => navigation.goBack()}
          />
          <Text style={styles.headerText}>Search result</Text>
          <View style={styles.headerAction}>
            <Image
              style={styles.actionImage}
              source={require("../../../../assets/icons/filter.svg")}
            ></Image>
          </View>
        </View>
      </View>
      <ScrollView>
        <Text style={commonStyles.label}>{"Search results"}</Text>
        {products == undefined && <Loader />}
        {products != undefined && (
          <ListComponent
            itemList={products}
            onItemClick={onProductClick}
          ></ListComponent>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {},
  header: {
    height: 90,
    paddingHorizontal: 20,
  },
  container: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerText: {
    fontSize: 20,
    fontWeight: "500",
  },
  headerAction: {
    width: 40,
    height: 40,
    margin: 5,
  },
  actionImage: {
    flex: 1,
  },
  actionText: {
    fontSize: 40,
    fontWeight: "700",
  },
});

export default SearchResultScreen;
