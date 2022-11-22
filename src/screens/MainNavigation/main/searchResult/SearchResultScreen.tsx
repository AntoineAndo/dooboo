import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, ScrollView, Modal } from "react-native";
import IonIcons from "react-native-vector-icons/Ionicons";
import ListComponent from "../../../../components/ListComponent";
import Loader from "../../../../components/Loader";

//Style import
import commonStyles from "../../../../config/stylesheet";
import { getProducts } from "../../../../lib/supabase";
import { useConfig } from "../../../../providers/ConfigProvider";
import SearchForm from "../../../../types/SearchForm";
import FiltersModal from "./FiltersModal";

type Props = {
  route: any;
  navigation: any;
};

function SearchResultScreen({ route, navigation }: Props) {
  const { config } = useConfig();
  const [modalVisible, setModalVisible] = useState(false);
  const [searchParams, setSearchParams] = useState<SearchForm>({
    categories: route.params.searchParams.categories,
  });

  const onProductClick = (product: any) => {
    navigation.navigate("Product", { product });
  };

  const {
    isLoading,
    isError,
    data: products,
    error,
    refetch,
  } = useQuery(
    [
      "search_result_" +
        searchParams.categories.reduce((a, b) => a.concat(b.id), ""),
    ],
    () => {
      let categoriesId: any[] = [];
      searchParams.categories.forEach((category: any) => {
        categoriesId.push(category.id);
      });

      const searchQuery = {
        country: config.countryId,
        categoriesId,
      };
      return getProducts(searchQuery);
    }
  );

  if (isError || products == null || products == undefined) {
    return <></>;
  }

  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = (params: any) => {
    //hide modal
    setModalVisible(false);

    //If the result is not null, it means the user clicked on "Save and apply"
    //so refetch the products with the new filters
    if (params != null) {
      setSearchParams(params);
      refetch();
      return;
    }
  };

  return (
    <View style={styles.page}>
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <FiltersModal
          config={config}
          onClose={closeModal}
          searchParams={searchParams}
        />
      </Modal>
      <View style={[styles.header, commonStyles.bottomShadow]}>
        <View style={styles.container}>
          <IonIcons
            name={"arrow-back-outline"}
            style={styles.headerAction}
            size={40}
            onPress={() => navigation.goBack()}
          />
          <Text style={styles.headerText}>Search result</Text>
          <IonIcons
            name={"funnel-outline"}
            style={styles.headerAction}
            size={40}
            onPress={() => openModal()}
          />
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
