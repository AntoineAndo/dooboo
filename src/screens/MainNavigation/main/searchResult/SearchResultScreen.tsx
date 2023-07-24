import { useInfiniteQuery } from "@tanstack/react-query";
import React, { useEffect } from "react";
import { View, StyleSheet, Modal, StatusBar } from "react-native";
import spacing from "../../../../config/spacing";

//Style import
import { getProducts } from "../../../../lib/supabase";
import { useConfig } from "../../../../providers/ConfigProvider";
import Product from "../../../../types/product";
import SearchForm from "../../../../types/SearchForm";
import FiltersModal from "./FiltersModal";
import { useTranslation } from "../../../../hooks/translation";
import FlatListPageWithHeaderComponent from "../../../../components/FlatListPageWithHeaderComponent";
import IonIcons from "react-native-vector-icons/Ionicons";

type Props = {
  route: any;
  navigation: any;
};

function SearchResultScreen({ route, navigation }: Props) {
  const { config } = useConfig();
  const [modalVisible, setModalVisible] = React.useState(false);

  const [searchParams, setSearchParams] = React.useState<SearchForm>({
    searchString: route.params?.searchString ?? "",
    categories: route.params?.searchParams?.categories ?? [],
    brandIds: route.params?.searchParams?.brandIds ?? [],
  });

  const onProductClick = (product: any) => {
    navigation.navigate("Product", { product });
  };

  const { translate } = useTranslation();

  const {
    isLoading,
    isError,
    error,
    data: products,
    refetch,
    isFetching,
    fetchNextPage,
  } = useInfiniteQuery({
    queryKey: [
      "search_result",
      searchParams.searchString,
      searchParams.categories.reduce((a, b) => a.concat(b.id), ""),
      searchParams.brandIds.join("-"),
    ],
    queryFn: async ({
      pageParam = 1,
    }): Promise<{ items: Product[]; nextPage: any }> => {
      let categoriesId: any[] = searchParams.categories.reduce(
        (prev: number[], category: any) => {
          prev.push(category.id);
          return prev;
        },
        []
      );

      const searchQuery = {
        country: config.countryId,
        searchString: searchParams.searchString,
        categoriesId,
        brandsId: searchParams.brandIds,
        onlyMainImage: true,
      };

      let p = await getProducts(searchQuery);
      let nextPage = pageParam;

      if (p.length != 0) {
        nextPage++;
      }
      return {
        items: p,
        nextPage: pageParam,
      };
    },
    getNextPageParam: (lastGroup: any) => {
      return lastGroup.nextPage;
    },
  });

  //refetch everytime we come back to the screen
  useEffect(() => {
    //Refetch on focus
    refetch();

    //Unmount event listener
    return () => {
      // backHandler.remove();
    };
  }, [navigation]);

  const onEndReached = () => {
    fetchNextPage();
  };

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
    <>
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <FiltersModal
          config={config}
          onClose={closeModal}
          searchParams={searchParams}
        />
      </Modal>
      <FlatListPageWithHeaderComponent
        title={translate("search_results")}
        showBackButton={true}
        data={products}
        onItemClick={onProductClick}
        onRefresh={() => refetch()}
        // onEndReached={() => null}
        rightActionComponent={
          <IonIcons
            name={"funnel-outline"}
            style={styles.headerAction}
            color={"white"}
            size={30}
            onPress={() => openModal()}
          />
        }
      ></FlatListPageWithHeaderComponent>
    </>
  );
}

const styles = StyleSheet.create({
  page: {
    paddingTop: StatusBar.currentHeight,
  },
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
    position: "absolute",
    zIndex: 10,
    top: 0,
    right: spacing.s3,
    aspectRatio: 1,
    height: 35,
    fontSize: 35,
    fontWeight: "700",
    marginTop: 5,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  actionImage: {
    flex: 1,
  },
  actionText: {
    fontSize: 40,
    fontWeight: "700",
  },
  listContainer: {
    flex: 1,
    padding: spacing.s3,
  },
  list: {
    flex: 1,
    // marginTop: spacing.s3,
  },
});

export default SearchResultScreen;
