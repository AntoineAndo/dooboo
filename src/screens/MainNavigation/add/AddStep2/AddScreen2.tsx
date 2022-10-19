import React from "react";
import { View, StyleSheet } from "react-native";
import HeaderComponent from "../../../../components/HeaderComponent";
import StorePicker from "../../../../components/StorePicker";
import { Button } from "react-native-paper";

type Props = {
  route: any;
  navigation: any;
};

function AddScreen2({ route, navigation }: Props) {
  let initialState = route.params != undefined ? route.params.form : {};
  let storeList = route.params != undefined ? route.params.storeList : [];

  const [form, setForm] = React.useState(initialState);
  const [errors, setErrors] = React.useState<{
    [key: string]: any;
  }>({});

  function handleChange(key: string, value: string | string[]) {
    //Enforce validation
    setForm({
      ...form,
      [key]: value,
    });
  }

  const checkErrors = (fields?: string[] | undefined) => {
    //Fields param allows us to specify for on which field to check for errors
    //if unspecified, all fields are checked

    //Reset error object
    let newErrors: {
      [key: string]: any;
    } = {};

    if (fields == undefined || fields.indexOf("storesId") != -1) {
      //Mandatory stores
      if (form.storesId.length == 0) {
        newErrors["storesId"] = true;
      }
    }

    setErrors(newErrors);
    return newErrors;
  };

  const onSubmit = () => {
    //Error check
    let _errors = checkErrors();
    //si pas d'erreur
    if (Object.values(_errors).length == 0) {
      navigation.navigate("AddStep2", { form: form, storeList });
    }
    console.log(form);
  };

  return (
    <View>
      <View style={styles.header}>
        <HeaderComponent
          title="Add a product"
          showBackButton={false}
          subtitle="Product location"
        />
      </View>

      <View style={styles.contentView}>
        <StorePicker
          storeList={storeList}
          onSelectedUpdate={(selectedStoresId: string[]) => {
            handleChange("storesId", selectedStoresId);
          }}
        />
      </View>
      <Button
        mode="contained"
        onPress={() => {
          onSubmit();
        }}
      >
        Next step
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    marginTop: 10,
  },
  contentView: {
    paddingHorizontal: 26,
  },
});

export default AddScreen2;
