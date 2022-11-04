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
    refetch,
  } = useQuery(["products"], () => {
    const searchQuery = {
      fk_country_id: config.country.id,
    };
    return getProducts(searchQuery);
  });

  const onProductClick = (product: any) => {
    navigation.navigate("Product", { product });
  };

  //Refetch on refresh
  const onRefresh = refetch;

  const displayContent = () => {
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

    return (
      <>
        <Text style={commonStyles.label}>
          {translation.t("latest_product")}
        </Text>
        <View style={styles.list}>
          <ListComponent
            itemList={productList}
            onItemClick={onProductClick}
            refresh={onRefresh}
          ></ListComponent>
        </View>
      </>
    );
  };

  return (
    <View style={styles.page}>
      <View style={[styles.searchBarContainer, commonStyles.bottomShadow]}>
        <SearchBarComponent onTouch={() => startSearch(navigation)} />
      </View>
      <View style={styles.content}>{displayContent()}</View>
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
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "red",
  },
  list: {
    borderWidth: 1,
  },
});

export default HomeScreen;
