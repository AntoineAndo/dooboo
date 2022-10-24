import React from "react";
import { Text, StyleSheet, View, ScrollView } from "react-native";
import ListComponent from "../../../../components/ListComponent";
import SearchBarComponent from "../../../../components/SearchBarComponent";
import { getProducts } from "../../../../lib/supabase";

import { useQuery } from "@tanstack/react-query";

//Style import
import commonStyles from "../../../../config/stylesheet";

//Types import
import { useTranslation } from "../../../../hooks/translation";
import { useConfig } from "../../../../providers/ConfigProvider";

type Props = {
  navigation: any;
};

function HomeScreen({ navigation }: Props) {
  const { config, setConfig } = useConfig();

  const translation = useTranslation();

  const {
    isLoading,
    isError,
    data: productList,
    error,
  } = useQuery(["products"], () => getProducts(config.country.id));

  if (isLoading) {
    return (
      <View style={styles.page}>
        <Text>Loading</Text>
      </View>
    );
  }
  if (isError) {
    return (
      <View style={styles.page}>
        <Text>Error</Text>
      </View>
    );
  }

  console.log(productList);

  return (
    <View style={styles.page}>
      <View style={[styles.searchBarContainer, commonStyles.bottomShadow]}>
        <SearchBarComponent onTouch={() => startSearch(navigation)} />
      </View>
      <ScrollView style={styles.content}>
        <Text style={commonStyles.label}>
          {translation.t("latest_product")}
        </Text>
        <ListComponent itemList={productList}></ListComponent>
      </ScrollView>
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
