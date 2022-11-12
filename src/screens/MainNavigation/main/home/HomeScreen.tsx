import React from "react";
import {
  Text,
  StyleSheet,
  View,
  ScrollView,
  RefreshControl,
} from "react-native";
import ListComponent from "../../../../components/ListComponent";
import SearchBarComponent from "../../../../components/SearchBarComponent";
import { getProducts, supabase } from "../../../../lib/supabase";

import { useQuery } from "@tanstack/react-query";

//Style import
import commonStyles from "../../../../config/stylesheet";

//Types import
import { useTranslation } from "../../../../hooks/translation";
import { useConfig } from "../../../../providers/ConfigProvider";

import { Dimensions, StatusBar } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import SecureStorage from "../../../../lib/SecureStorage";

const screenHeight = Dimensions.get("screen").height;
const windowHeight = Dimensions.get("window").height;
const statusBarHeight =
  StatusBar.currentHeight != undefined ? StatusBar.currentHeight : 0;
const navbarHeight = screenHeight - windowHeight + statusBarHeight;

type Props = {
  navigation: any;
};

function HomeScreen({ navigation }: Props) {
  const { config } = useConfig();
  console.log(config);

  const translation = useTranslation();
  const [refreshing, setRefreshing] = React.useState(false);

  const {
    isLoading,
    isError,
    data: productList,
    refetch,
  } = useQuery(["products"], () => {
    const searchQuery = {
      fk_country_id: config.countryId,
    };
    return getProducts(searchQuery);
  });

  const onProductClick = (product: any) => {
    navigation.navigate("Product", { product });
  };

  //On list refetch
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);

    refetch().then(() => setRefreshing(false));
  }, []);

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
      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {displayContent()}
      </ScrollView>
      <View
        style={{ height: 0, marginBottom: 0, backgroundColor: "yellow" }}
      ></View>
    </View>
  );
}

function startSearch(navigation: any) {
  navigation.navigate("Search");
}

const styles = StyleSheet.create({
  page: {
    height: Dimensions.get("window").height - navbarHeight,
    marginTop: -5,
  },
  searchBarContainer: {
    height: 100,
  },
  content: {
    flex: 1,
    paddingHorizontal: 10,
  },
  list: {
    flex: 1,
  },
});

export default HomeScreen;
