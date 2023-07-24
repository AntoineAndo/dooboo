import React, { useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  BackHandler,
  Alert,
  StatusBar,
} from "react-native";
import HeaderComponent from "../../components/HeaderComponent";
import { useTranslation } from "../../hooks/translation";
import { useConfig } from "../../providers/ConfigProvider";
import Form from "../../types/Form";
import { useQuery } from "@tanstack/react-query";
import { findExistingProduct, getCategories } from "../../lib/supabase";
import { useFocusEffect } from "@react-navigation/native";
import SelectTextInput from "../../components/SelectTextInput";
import ButtonComponent from "../../components/ButtonComponent";
import fontSizes from "../../config/fontSizes";
import InputComponent from "../../components/InputComponent";
import Brand from "../../types/Brand";
import T from "../../components/T";
import NetworkViewComponent from "../../components/NetworkViewComponent";
import OfflineCard from "../../components/OfflineCard";
import PageComponent from "../../components/PageComponent";
import Fuse from "fuse.js";
import commonStyles from "../../config/stylesheet";
import { MenuItem } from "../../components/MenuItemComponent";
import spacing from "../../config/spacing";
import IonIcons from "react-native-vector-icons/Ionicons";
import colors from "../../config/colors";

type Props = {
  navigation: any;
  route: any;
};

function AddScreen({ navigation, route }: Props) {
  const { translate } = useTranslation();
  const { config, patchConfig } = useConfig();
  const [showSecondBrandField, setShowSecondBrandField] = useState(false);
  let [formTouched, setFormTouched] = useState(false);

  //If a store is passed in parameter
  // initialize the form with its value
  let initialStore = route.params.store;
  if (initialStore) initialStore.preset = true;

  const [form, setForm] = React.useState<Form>({
    name: "",
    existingProduct: undefined,
    brand1: undefined,
    brand2: undefined,
    brand3: undefined,
    categories: [],
    store: initialStore,
    countryId: config.countryId,
    errors: [],
  });

  const { data: similarProducts } = useQuery(
    [form.brand1?.id, form.name],
    async () => {
      if (form.brand1 && form.brand1.id && form.name != "") {
        let data: any[] = await findExistingProduct({
          name: form.name,
          brand_id: form.brand1.id,
        });
        const fuse = new Fuse(data, {
          keys: ["name"],
          includeScore: true,
        });
        const result = fuse.search(form.name);
        return result;
      }
    },
    {
      select: (data: any) => {
        return data.filter((item: any) => item.score < 0.5);
      },
      initialData: [],
      enabled:
        form.brand1 != undefined &&
        form.brand1.id != undefined &&
        form.name != "",
    }
  );

  const backAction = () => {
    if (!formTouched) {
      navigation.goBack();
    } else {
      Alert.alert("Wait!", "Are you sure you want to go back?", [
        {
          text: "Cancel",
          onPress: () => null,
          style: "cancel",
        },
        { text: "YES", onPress: () => navigation.goBack() },
      ]);
    }
    return true;
  };

  //Create a back button press event listener
  // to prevent instant go back if the form has been changed
  useFocusEffect(() => {
    //Mount event listener
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    //Unmount event listener
    return () => {
      backHandler.remove();
    };
  });

  //Method used to update the form/state value
  const patchForm = (key: string, value: any) => {
    // formTouched = true;
    setFormTouched(true);
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

    if (fields == undefined || fields.indexOf("name") != -1) {
      //Mandatory name
      if (form.name == "") {
        newErrors["name"] = true;
      }
    }

    if (fields == undefined || fields.indexOf("brand1") != -1) {
      //Mandatory brand
      if (form.brand1 == undefined) {
        newErrors["brand1"] = true;
      }
    }
    patchForm("errors", newErrors);
    return newErrors;
  };

  const onSubmit = () => {
    //Error check
    let _errors = checkErrors();

    console.log(form);

    //si pas d'erreur
    if (Object.values(_errors).length == 0) {
      //If this is an existing product
      if (form.existingProduct != null) {
        //If the product is not vegan, then navigate to info screen to show reason
        if (form.existingProduct.vegan == false) {
          return navigation.navigate("AddInfoScreen", {
            product: form.existingProduct,
          });
        }

        //If this is an existing product, then continue to the store selection and skip categories
        return navigation.navigate("AddScreenStore", { form: form });
      }

      //Else continue to categories selection
      navigation.navigate("AddScreenCategories", { form: form });
    }
  };

  return (
    <PageComponent withNavbar={false} style={styles.page}>
      <ScrollView
        alwaysBounceHorizontal={false}
        alwaysBounceVertical={false}
        bounces={false}
        keyboardShouldPersistTaps={"never"}
      >
        <View style={styles.header}>
          <HeaderComponent
            title="Add a product"
            showBackButton={true}
            subtitle="Product description"
          />
        </View>

        {form.store?.preset && (
          // <View style={styles.storeNameContainer}>
          <T style={styles.storeName}>
            <IonIcons name="location" color={"red"} size={24} />
            {form.store.name}
          </T>
          // </View>
        )}

        <NetworkViewComponent
          style={styles.contentView}
          offlineComponent={<OfflineCard />}
        >
          {/* Product name input group */}
          <View style={styles.inputGroup}>
            <T style={styles.inputLabel}>{translate("product_name_label")}</T>
            <T style={styles.inputSubLabel}>{translate("product_name_tip")}</T>
            <InputComponent
              value={form.name}
              onChangeText={(evt: any) => handleChange("name", evt)}
              onBlur={() => {
                checkErrors(["name"]);
              }}
              placeholder={translate("product_name_placeholder")}
              returnKeyType="next"
            />
            {form.errors["name"] && (
              <T style={styles.error}>
                {translate("product_name_mandatory_error")}
              </T>
            )}
          </View>

          {/* Product brand input group */}
          <View style={styles.inputGroup}>
            <T style={styles.inputLabel}>{translate("product_brand_label")}</T>
            <SelectTextInput
              valueChange={(selectedBrand: Brand) =>
                handleChange("brand1", selectedBrand)
              }
            />
            {form.errors["brand1"] && (
              <T style={styles.error}>
                {translate("product_brand_mandatory_error")}
              </T>
            )}
          </View>
          {!showSecondBrandField && (
            <ButtonComponent
              onPress={() => setShowSecondBrandField(true)}
              type="secondary"
            >
              {translate("add_second_brand")} ({translate("optional")})
            </ButtonComponent>
          )}

          {/* Product brand 2 input group */}
          {showSecondBrandField && (
            <View style={styles.inputGroup}>
              <T style={styles.inputLabel}>
                {translate("second_product_brand_label")}
              </T>
              <SelectTextInput
                valueChange={(selectedBrand: Brand) =>
                  handleChange("brand2", selectedBrand)
                }
                canClear={true}
              />
              {form.errors["brand2"] && (
                <T style={styles.error}>
                  {translate("product_brand_mandatory_error")}
                </T>
              )}
            </View>
          )}

          {similarProducts.length != 0 && (
            <View style={styles.similarContainer}>
              <T
                style={{
                  color: "red",
                  lineHeight: 20,
                }}
              >
                {translate("duplicate_warning")}
              </T>
              <View style={styles.similarList}>
                {similarProducts.map((product: any) => {
                  return (
                    <MenuItem
                      title={product.item.name}
                      onPress={() => patchForm("existingProduct", product.item)}
                      imageUrl={product.item.product_image[0].image_url}
                      showArrow={false}
                      style={
                        form?.existingProduct?.id == product.item.id
                          ? styles.selectedExistingProduct
                          : null
                      }
                      imageStyle={{
                        height: "100%",
                        width: "100%",
                      }}
                      accessibilityLabel={"product " + product.item.name}
                      accessibilityHint={translate(
                        "accessibility_hint_product_duplicate"
                      )}
                    />
                  );
                })}
                <MenuItem
                  title={translate("none_above")}
                  onPress={() => patchForm("existingProduct", null)}
                  showArrow={false}
                  style={
                    form?.existingProduct === null
                      ? styles.selectedExistingProduct
                      : null
                  }
                  accessibilityLabel={translate("none_above")}
                  accessibilityHint={translate("accessibility_hint_none_above")}
                />
              </View>
            </View>
          )}
        </NetworkViewComponent>
      </ScrollView>
      <NetworkViewComponent style={commonStyles.footer}>
        <ButtonComponent onPress={() => backAction()} type="secondary">
          {translate("cancel")}
        </ButtonComponent>
        <ButtonComponent
          onPress={() => onSubmit()}
          style={{ fontFamily: "Milliard-Medium" }}
          disabled={
            similarProducts.length > 0 &&
            form.existingProduct !== null &&
            form.existingProduct == undefined
          }
        >
          {translate("next")}
        </ButtonComponent>
      </NetworkViewComponent>
    </PageComponent>
  );
}

const styles = StyleSheet.create({
  page: {
    paddingTop: StatusBar.currentHeight,
  },
  header: {
    marginTop: 10,
  },
  storeName: {
    fontSize: fontSizes.h2,
    fontFamily: "Milliard-Bold",
    flex: 1,
    flexWrap: "wrap",
    textAlign: "center",
    marginBottom: spacing.s3,
  },
  contentView: {
    paddingHorizontal: 26,
    marginBottom: 80,
  },
  categoriesList: {
    marginTop: 12,
  },
  inputGroup: {
    marginBottom: spacing.s2,
  },
  inputLabel: {
    fontWeight: "bold",
    fontSize: fontSizes.label,
  },
  inputSubLabel: {
    fontSize: fontSizes.p,
  },
  error: {
    color: "red",
  },
  checkbox: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    // alignItems: "center",
    margin: 5,
  },
  similarContainer: {},
  similarList: {
    marginTop: spacing.s2,
  },
  selectedExistingProduct: {
    // borderWidth: 1,
    borderRadius: 10,
    backgroundColor: colors.lightergrey,
  },
});

export default AddScreen;
