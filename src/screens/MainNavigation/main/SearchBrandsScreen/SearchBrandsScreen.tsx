import React from "react";
import { View, StyleSheet, StatusBar } from "react-native";
import HeaderComponent from "../../../../components/HeaderComponent";
import PageComponent from "../../../../components/PageComponent";
import { useTranslation } from "../../../../hooks/translation";
import { useConfig } from "../../../../providers/ConfigProvider";
import SearchForm from "../../../../types/SearchForm";
import spacing from "../../../../config/spacing";
import { useQuery } from "@tanstack/react-query";
import { getTopBrands, searchBrands } from "../../../../lib/supabase";
import T from "../../../../components/T";
import NetworkViewComponent from "../../../../components/NetworkViewComponent";
import OfflineCard from "../../../../components/OfflineCard";
import SpinnerComponent from "../../../../components/SpinnerComponent";
import { MenuItem } from "../../../../components/MenuItemComponent";
import SeparatorComponent from "../../../../components/SeparatorComponent";
import InputComponent from "../../../../components/InputComponent";
import { queryClient } from "../../../../../App";
import ScrollPageWithHeaderComponent from "../../../../components/ScrollPageWithHeaderComponent";

function SearchBrandsScreen({ navigation }: any) {
  const { config } = useConfig();
  const { translate } = useTranslation();
  const [inputValue, setInputValue] = React.useState<string>("");
  const [searchForm, setSearchForm] = React.useState<SearchForm>({
    categories: [],
    searchString: "",
    brandIds: [],
  });

  const {
    isFetching: isFetchingTop,
    data: topBrands,
    refetch,
  } = useQuery({
    queryKey: ["top_brands", config.countryId],
    queryFn: () => {
      const searchQuery = {
        countryId: config.countryId,
      };

      let brands = getTopBrands(searchQuery);
      return brands;
    },
    select: (data: any) => {
      if (data.length != 0) {
        data.length = 5;
        return data.filter((b: any) => b);
      }
      return [];
    },
    initialData: [],
  });

  const { data: result, isFetching: isFetching } = useQuery(
    ["brands", inputValue, config.countryId],
    searchBrands,
    {
      enabled: inputValue.length > 0,
      select: (data: any) => {
        return data.filter((b: any) => b);
      },
      initialData: [],
    }
  );

  const onSelect = function (brandId: any) {
    patchForm("brandIds", [brandId]);
    navigation.navigate("Search result", {
      searchParams: {
        brandIds: [brandId],
      },
    });
  };

  function patchForm(key: string, value: string | string[]) {
    setSearchForm({
      ...searchForm,
      [key]: value,
    });
  }

  const onChange = (value: string) => {
    queryClient.invalidateQueries(["brands"]);
    setInputValue(value);
  };

  return (
    <ScrollPageWithHeaderComponent
      title={translate("brands")}
      showBackButton={true}
    >
      <NetworkViewComponent
        style={styles.content}
        offlineComponent={<OfflineCard />}
      >
        <View style={styles.list}>
          <InputComponent
            onChangeText={(v: string) => onChange(v)}
            value={inputValue}
            placeholder={translate("brand_name_placeholder")}
          />
          {isFetchingTop || isFetching ? (
            <SpinnerComponent style={{ alignSelf: "center" }} />
          ) : (
            (inputValue == "" &&
              topBrands.map((brand: any, index: number) => {
                return (
                  <View key={brand.id}>
                    <MenuItem
                      title={brand.name_ori}
                      onPress={() => onSelect(brand.id)}
                      accessibilityLabel={"Brand: " + brand.name_ori}
                      accessibilityHint={translate(
                        "accessibility_hint_search_brand"
                      )}
                    />
                    {index < topBrands.length - 1 && <SeparatorComponent />}
                  </View>
                );
              })) ||
            (result.length != 0 &&
              result.map((brand: any, index: number) => {
                return (
                  <View key={brand.id}>
                    <MenuItem
                      title={brand.name_ori}
                      onPress={() => onSelect(brand.id)}
                      accessibilityLabel={"Brand: " + brand.name_ori}
                      accessibilityHint={translate(
                        "accessibility_hint_search_brand"
                      )}
                    />
                    {index < result.length - 1 && <SeparatorComponent />}
                  </View>
                );
              })) || <T>{translate("no_results")}</T>
          )}
        </View>
      </NetworkViewComponent>
    </ScrollPageWithHeaderComponent>
  );
}

const styles = StyleSheet.create({
  page: {
    paddingTop: StatusBar.currentHeight,
  },
  content: {
    padding: spacing.s3,
    flex: 1,
    backgroundColor: "white",
  },
  list: {
    paddingHorizontal: spacing.s2,
  },
});

export default SearchBrandsScreen;
