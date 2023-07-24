import React from "react";
import { View, StyleSheet, StatusBar, ScrollView } from "react-native";
import { useTranslation } from "../../../../hooks/translation";
import { useConfig } from "../../../../providers/ConfigProvider";
import SearchForm from "../../../../types/SearchForm";
import spacing from "../../../../config/spacing";
import { useQuery } from "@tanstack/react-query";
import { getCategories } from "../../../../lib/supabase";
import NetworkViewComponent from "../../../../components/NetworkViewComponent";
import OfflineCard from "../../../../components/OfflineCard";
import SpinnerComponent from "../../../../components/SpinnerComponent";
import SeparatorComponent from "../../../../components/SeparatorComponent";
import ScrollPageWithHeaderComponent from "../../../../components/ScrollPageWithHeaderComponent";
import DropDownMenuComponent from "../../../../components/DropDownMenuComponent";
import ButtonComponent from "../../../../components/ButtonComponent";
import commonStyles from "../../../../config/stylesheet";

function SearchCategoriesScreen({ navigation }: any) {
  const { config, patchConfig } = useConfig();
  const { translate } = useTranslation();
  const [searchForm, setSearchForm] = React.useState<SearchForm>({
    categories: [],
    searchString: "",
    brandIds: [],
  });

  const {
    isLoading,
    isError,
    data: categoriesTree,
    error,
  } = useQuery({
    queryKey: ["categories", config.countryId],
    queryFn: () => getCategories(config.countryId),
    // structuralSharing(oldData, newData) {
    //   return oldData?.length == newData?.length ? oldData : newData;
    // },
    select: (categories) => {
      // return [];
      if (categories == undefined) return [];
      //Sort by ID because for some reason supabase ordering is not reliable
      let idSort = categories.sort((c1: any, c2: any) => {
        return c1.id > c2.id ? 1 : -1;
      });

      //First sort the main categories first
      let sorted = idSort.sort((c1: any, c2: any) => {
        return c1.parent_category_id == null && c2.parent_category_id != null
          ? -1
          : 1;
      });

      const cat_tree = sorted.reduce((acc: any, category: any) => {
        //If it is a parent category
        if (!category.parent_category_id) {
          acc.push({
            ...category,
            children: [],
          });
        } else {
          //else if child category
          let parent_category = acc.find(
            (cat: any) => cat.id == category.parent_category_id
          );
          if (parent_category) {
            parent_category.children.push(category);
          }
        }
        return acc;
      }, []);

      const ordered_tree = cat_tree.sort((a: any, b: any) => {
        return a.id > b.id ? 1 : -1;
      });

      //Patch categories in the config
      if (config?.categories?.length != ordered_tree.length)
        patchConfig("categories", ordered_tree);

      return ordered_tree;
    },
    initialData: config.categories,
  });

  //Function to handle checkbox check
  const handleCheck = function (action: "check" | "uncheck", items: any[]) {
    let newArray = [...searchForm.categories];

    //Parent category check
    if (items.length > 1) {
      if (action == "check") {
        newArray = [...new Set(newArray.concat(items))];
      } else {
        newArray = newArray.filter((cat) => {
          return items.indexOf(cat) == -1;
        });
      }
    } else {
      //
      let index = newArray.indexOf(items[0]);

      //If the clicked element is not present in the array
      if (index == -1) {
        newArray.push(items[0]);
      } else {
        //else removed
        newArray.splice(index, 1);
      }
    }

    patchForm("categories", newArray);
  };

  function patchForm(key: string, value: string | string[]) {
    //Enforce validation

    setSearchForm({
      ...searchForm,
      [key]: value,
    });
  }

  function onSubmit(form: any) {
    //si pas d'erreur
    navigation.navigate("Search result", { searchParams: form });
  }

  return (
    <ScrollPageWithHeaderComponent
      title={translate("categories")}
      showBackButton={true}
      footer={
        <View style={commonStyles.footer}>
          <ButtonComponent
            onPress={() => onSubmit(searchForm)}
            style={{ fontFamily: "Milliard-Medium", width: 200 }}
            disabled={searchForm.categories.length == 0}
          >
            {translate("search")}
          </ButtonComponent>
        </View>
      }
    >
      <NetworkViewComponent
        style={styles.content}
        offlineComponent={<OfflineCard />}
      >
        <ScrollView>
          {isLoading ? (
            <SpinnerComponent style={{ alignSelf: "center" }} />
          ) : (
            categoriesTree.map((category: any, index: number) => {
              // let checked = searchForm.categories.indexOf(category) != -1;
              return (
                <View key={category.id}>
                  <DropDownMenuComponent
                    item={category}
                    title={translate(category.code)}
                    imageUrl={`icons/${category.icon_name}.png`}
                    dispatch={(action: "check" | "uncheck", items: any[]) =>
                      handleCheck(action, items)
                    }
                    childrens={category.children}
                    checkedItems={searchForm.categories}
                    noCheckboxForParents={false}
                  />
                  {index < categoriesTree.length - 1 && (
                    <SeparatorComponent
                      style={{
                        marginHorizontal: 20,
                      }}
                    />
                  )}
                </View>
              );
            })
          )}
        </ScrollView>
      </NetworkViewComponent>
    </ScrollPageWithHeaderComponent>
  );
}

const styles = StyleSheet.create({
  content: {
    backgroundColor: "white",
    // borderTopRightRadius: 25,
    flex: 1,
    padding: spacing.s3,
    paddingBottom: 100,
  },
});

export default SearchCategoriesScreen;
