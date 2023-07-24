import React, { useState } from "react";
import { View, StyleSheet, StatusBar, Pressable } from "react-native";
import HeaderComponent from "../../components/HeaderComponent";

import Form from "../../types/Form";
import ButtonComponent from "../../components/ButtonComponent";
import RadioComponent from "../../components/RadioComponent";
import spacing from "../../config/spacing";
import T from "../../components/T";
import NetworkViewComponent from "../../components/NetworkViewComponent";
import OfflineCard from "../../components/OfflineCard";
import PageComponent from "../../components/PageComponent";

import commonStyles from "../../config/stylesheet";
import { useTranslation } from "../../hooks/translation";
import SeparatorComponent from "../../components/SeparatorComponent";

type Props = {
  route: any;
  navigation: any;
};

/**
 * @description This screen is part of the Add flow
 * The first time a store is selected, this screens is added to the flow
 * to gather more information on the store.
 *  - Is it a vegan store ?
 */
function AddScreenStoreDetails({ route, navigation }: Props) {
  let initialState: Form = route.params != undefined ? route.params.form : {};
  initialState.errors = {};

  const [form, setForm] = useState<Form>(initialState);
  const [errors, setErrors] = useState<any>({});
  const { translate } = useTranslation();

  /**
   * @description Called when the Next button is clicked
   * Check for errors and if none, navigate to the next page
   */
  const onSubmit = () => {
    const _errors = checkErrors();
    if (Object.values(_errors).length == 0) {
      navigation.navigate("AddScreenImages", { form: form });
    }
  };

  const checkErrors = () => {
    let errors: any = {};
    if (form?.store?.vegan == undefined) {
      errors.vegan = "Please select a value";
    }

    setErrors(errors);

    return errors;
  };

  //Method used to update the form/state value
  const patchForm = (key: string, value: any) => {
    setForm({
      ...form,
      [key]: value,
    });
  };

  const set = (field: string, value: any) => {
    setErrors({
      ...errors,
      [field]: undefined,
    });
    patchForm("store", {
      ...form.store,
      [field]: value,
    });
  };

  return (
    <PageComponent withNavbar={route.params.withNavbar ?? false}>
      <View style={styles.header}>
        <HeaderComponent
          title={
            route.params.title
              ? translate(route.params.title)
              : translate("add_product")
          }
          showBackButton={false}
          subtitle={
            route.params.subtitle == "" ? undefined : translate("store_details")
          }
        />
      </View>

      <NetworkViewComponent
        style={styles.pageContent}
        offlineComponent={<OfflineCard />}
      >
        <T>{translate("label_is_store_vegan")}</T>
        <View style={{ marginTop: spacing.s1 }}>
          <Pressable
            style={styles.radioContainer}
            onPress={() => {
              set("vegan", true);
            }}
          >
            <RadioComponent
              checked={form.store?.vegan ?? false}
              onPress={() => {
                set("vegan", true);
              }}
            />
            <T style={styles.radioLabel}>{translate("yes")}</T>
          </Pressable>
          <SeparatorComponent />
          <Pressable
            style={styles.radioContainer}
            onPress={() => {
              set("vegan", false);
            }}
          >
            <RadioComponent
              checked={form.store?.vegan == false}
              onPress={() => {
                set("vegan", false);
              }}
            />
            <T style={styles.radioLabel}>{translate("no")}</T>
          </Pressable>
          {errors["vegan"] && <T style={styles.error}>{errors["vegan"]}</T>}
        </View>
      </NetworkViewComponent>

      <View style={commonStyles.footer}>
        <ButtonComponent onPress={() => navigation.goBack()} type="secondary">
          {translate("back")}
        </ButtonComponent>
        <ButtonComponent onPress={() => onSubmit()}>
          {form.store == undefined ? translate("skip") : translate("next")}
        </ButtonComponent>
      </View>
    </PageComponent>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    marginTop: StatusBar.currentHeight,
  },
  header: {
    marginTop: 10,
  },
  pageContent: {
    flex: 1,
    // paddingBottom: 50,
    // justifyContent: "center",
    padding: spacing.s3,
  },
  error: {
    color: "red",
  },
  radioContainer: {
    height: 40,
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    flexDirection: "row",
  },
  radioLabel: {
    marginLeft: spacing.s1,
  },
});

export default AddScreenStoreDetails;
