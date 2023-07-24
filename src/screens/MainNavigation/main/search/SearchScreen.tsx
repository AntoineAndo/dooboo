import React from "react";
import { View, StyleSheet, StatusBar } from "react-native";
import SearchInput from "../../../../components/SearchInput";
import T from "../../../../components/T";
import spacing from "../../../../config/spacing";
import commonStyles from "../../../../config/stylesheet";
import { useTranslation } from "../../../../hooks/translation";
import ScrollPageWithHeaderComponent from "../../../../components/ScrollPageWithHeaderComponent";
import { MenuItem } from "../../../../components/MenuItemComponent";
import SeparatorComponent from "../../../../components/SeparatorComponent";

type Props = {
  navigation: any;
};

function SearchScreen({ navigation }: Props) {
  const navToSearchCategory = function () {
    navigation.navigate("Search categories");
  };

  const navToSearchBrand = function () {
    navigation.navigate("Search brands");
  };

  const { translate } = useTranslation();

  return (
    <ScrollPageWithHeaderComponent
      showBackButton={true}
      title={translate("search")}
    >
      <View style={styles.content}>
        <T style={commonStyles.label}>{translate("search_by_name")}</T>
        <View style={styles.page.input}>
          <SearchInput
            onSubmit={(value: string) => search(navigation, value)}
            accessibilityLabel={translate("accessibility_label_search_input")}
          ></SearchInput>
        </View>
        <T
          style={[
            commonStyles.label,
            {
              textAlign: "center",
              fontSize: 20,
              fontFamily: "Milliard-Medium",
            },
          ]}
        >
          {translate("or")}
        </T>
        <View style={{ marginTop: spacing.s2 }}>
          <MenuItem
            title={translate("search_by_categories")}
            onPress={navToSearchCategory}
            imageSrc={require("assets/images/groceries.png")}
            showArrow={true}
            accessibilityLabel={"Search by categories"}
            accessibilityHint={
              "Navigate to the page where a product category can be selected for search"
            }
          />
          <SeparatorComponent />
          <MenuItem
            title={translate("search_by_brands")}
            onPress={navToSearchBrand}
            imageSrc={require("assets/images/cola.png")}
            showArrow={true}
            accessibilityLabel={"Search by brands"}
            accessibilityHint={
              "Navigate to the page where a product brand can be selected for search"
            }
          />
        </View>
      </View>
    </ScrollPageWithHeaderComponent>
  );
}

function search(navigation: any, value: String) {
  navigation.navigate("Search result", {
    searchString: value,
  });
}

const styles = StyleSheet.create({
  page: {
    input: {
      marginVertical: spacing.s3,
    },
    paddingTop: StatusBar.currentHeight,
  },
  content: {
    backgroundColor: "white",
    borderTopLeftRadius: 25,
    flex: 1,
    padding: spacing.s4,
  },
  quickSearchContainer: {
    flexDirection: "row",
    marginTop: spacing.s2,
    // paddingTop: spacing.s1,
  },
});

export default SearchScreen;
