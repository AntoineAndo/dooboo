import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { GestureResponderEvent, StyleSheet, View } from "react-native";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import ButtonComponent from "../../components/ButtonComponent";
import CheckboxComponent from "../../components/CheckboxComponent";
import HeaderComponent from "../../components/HeaderComponent";
import NetworkViewComponent from "../../components/NetworkViewComponent";
import OfflineCard from "../../components/OfflineCard";
import PageComponent from "../../components/PageComponent";
import SpinnerComponent from "../../components/SpinnerComponent";
import T from "../../components/T";
import fontSizes from "../../config/fontSizes";
import spacing from "../../config/spacing";
import commonStyles from "../../config/stylesheet";
import { useTranslation } from "../../hooks/translation";
import { getCategories } from "../../lib/supabase";
import { useConfig } from "../../providers/ConfigProvider";
import Form from "../../types/Form";
import DropDownMenuComponent from "../../components/DropDownMenuComponent";
import SeparatorComponent from "../../components/SeparatorComponent";

type Props = {
  navigation: any;
  route: any;
};

function AddScreenCategories({ route, navigation }: Props) {
  //Get form state from previous screen
  let initialState: Form = route.params != undefined ? route.params.form : {};
  initialState.errors = {};

  const { translate } = useTranslation();
  const { config, patchConfig } = useConfig();
  const [form, setForm] = useState<Form>(initialState);
  const {
    isLoading,
    isError,
    data: categoriesTree,
    error,
  } = useQuery({
    queryKey: ["categories", config.countryId],
    queryFn: () => getCategories(config.countryId),
    select: (categories) => {
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

  const CATEGORIES_MAX_CHOICES = 3;

  //Method used to update the form/state value
  const patchForm = (key: string, value: any) => {
    // formTouched = true;
    setForm({
      ...form,
      [key]: value,
    });
  };

  function handleChange(key: string, value: any) {
    //Enforce validation
    patchForm(key, value);
  }

  const checkErrors = (fields?: string[] | undefined) => {
    //Fields param allows us to specify for on which field to check for errors
    //if unspecified, all fields are checked

    //Reset error object
    let newErrors: {
      [key: string]: any;
    } = {};
    if (fields == undefined || fields.indexOf("categories") != -1) {
      //1 to 3 categories
      if (
        form.categories.length == 0 ||
        form.categories.length > CATEGORIES_MAX_CHOICES
      ) {
        newErrors["categories"] = true;
      }
    }
    patchForm("errors", newErrors);
    return newErrors;
  };

  //Function to handle checkbox check
  const handleCheck = function (action: "check" | "uncheck", items: any[]) {
    let newArray = [...form.categories];

    //Parent category check
    let index = newArray.indexOf(items[0]);

    //If the clicked element is not present in the array
    if (index == -1) {
      newArray.push(items[0]);
    } else {
      //else removed
      newArray.splice(index, 1);
    }

    if (newArray.length > CATEGORIES_MAX_CHOICES) {
      return;
    }

    patchForm("categories", newArray);
  };

  //Submit
  const onSubmit = () => {
    //Error check
    let _errors = checkErrors();

    //si pas d'erreur
    if (Object.values(_errors).length == 0) {
      navigation.navigate("AddScreenStore", { form: form });
    }
  };

  return (
    <PageComponent withNavbar={false}>
      <View style={styles.header}>
        <HeaderComponent
          title={translate("add_product")}
          showBackButton={true}
          subtitle={translate("product_categories_label")}
        />
      </View>
      <NetworkViewComponent
        style={styles.contentView}
        offlineComponent={<OfflineCard />}
      >
        {/* Category checkboxes */}
        <T style={styles.inputLabel}>{translate("product_categories_label")}</T>
        <T style={styles.inputSubLabel}>
          {translate("product_categories_tip")}
        </T>
        {form.errors["categories"] && (
          <T style={styles.error}>{translate("product_categories_error")}</T>
        )}
        <ScrollView showsVerticalScrollIndicator={false}>
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
                    checkedItems={form.categories}
                    noCheckboxForParents={true}
                  />
                  {index < categoriesTree.length - 1 && <SeparatorComponent />}
                </View>
              );
            })
          )}
        </ScrollView>
      </NetworkViewComponent>

      <View style={commonStyles.footer}>
        <ButtonComponent onPress={() => navigation.goBack()} type="secondary">
          {translate("back")}
        </ButtonComponent>
        <ButtonComponent
          onPress={() => onSubmit()}
          disabled={form.categories.length == 0}
        >
          {translate("next")}
        </ButtonComponent>
      </View>
    </PageComponent>
  );
}

const styles = StyleSheet.create({
  header: {
    marginTop: 10,
  },
  contentView: {
    flex: 1,
    paddingHorizontal: 26,
    marginBottom: 50,
  },
  error: {
    color: "red",
  },
  categoriesList: {
    marginTop: spacing.s2,
  },
  inputGroup: {
    marginBottom: 24,
  },
  inputLabel: {
    fontWeight: "bold",
    fontSize: fontSizes.label,
  },
  inputSubLabel: {
    fontSize: fontSizes.p,
  },
  checkbox: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    // alignItems: "center",
    marginVertical: spacing.s2,
  },
});

export default AddScreenCategories;
