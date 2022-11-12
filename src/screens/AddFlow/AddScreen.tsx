import React from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Button,
  ScrollView,
  BackHandler,
  Alert,
} from "react-native";
import HeaderComponent from "../../components/HeaderComponent";
import IonIcons from "react-native-vector-icons/Ionicons";
import { useTranslation } from "../../hooks/translation";
import { Checkbox } from "react-native-paper";
import { useConfig } from "../../providers/ConfigProvider";
import Form from "../../types/Form";
import { useQuery } from "@tanstack/react-query";
import { getCategories } from "../../lib/supabase";

type Props = {
  navigation: any;
};

function AddScreen({ navigation }: Props) {
  const translation = useTranslation();
  const { config } = useConfig();
  let [formTouched, setFormTouched] = React.useState(false);
  const { isLoading, isError, data, error } = useQuery(
    ["categories_" + config.countryId],
    () => getCategories(config.countryId)
  );
  const maxCategoryChoices = 3;

  const [form, setForm] = React.useState<Form>({
    name: "",
    categories: [],
    store: undefined,
    countryId: config.countryId,
    errors: [],
  });

  //Create a back button press event listener
  // to prevent instant go back if the form has been changed
  React.useEffect(() => {
    const backAction = () => {
      if (!formTouched) {
        navigation.goBack();
      } else {
        Alert.alert("Hold on!", "Are you sure you want to go back?", [
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

    //Mount event listener
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    //Unmount event listener
    return () => backHandler.remove();
  }, []);

  //Method used to update the form/state value
  const patchForm = (key: string, value: any) => {
    formTouched = true;
    setForm({
      ...form,
      [key]: value,
    });
  };

  function handleChange(key: string, value: any) {
    //Enforce validation
    patchForm(key, value);
  }

  const handleCheck = function (option: any) {
    let newArray = [...form.categories];
    let index = newArray.indexOf(option);

    //If the clicked element is not present in the array
    if (index == -1) {
      //If the max number of choices is reached
      // then the choice is not added to the array
      if (newArray.length == maxCategoryChoices) {
        return;
      }
      newArray.push(option);
    } else {
      //else removed
      newArray.splice(index, 1);
    }

    handleChange("categories", newArray);
  };

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

    if (fields == undefined || fields.indexOf("categories") != -1) {
      //1 to 3 categories
      if (
        form.categories.length == 0 ||
        form.categories.length > maxCategoryChoices
      ) {
        newErrors["categories"] = true;
      }
    }
    patchForm("errors", newErrors);
    return newErrors;
  };

  const onSubmit = () => {
    //Error check
    let _errors = checkErrors();
    //si pas d'erreur
    if (Object.values(_errors).length == 0) {
      navigation.navigate("AddStep2", { form: form });
    }
  };

  if (isLoading || data == undefined) {
    return <></>;
  }

  const categoriesList = data.data as any[];

  return (
    <ScrollView style={styles.page}>
      <View style={styles.header}>
        <HeaderComponent
          title="Add a product"
          showBackButton={false}
          subtitle="Product description"
        />
      </View>

      <View style={styles.contentView}>
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Product name</Text>
          <Text style={styles.inputSubLabel}>
            Please include the brand name
          </Text>

          <View style={styles.searchBar}>
            <IonIcons name={"search-outline"} style={styles.image} size={40} />

            <TextInput
              style={styles.input}
              value={form.name}
              onChangeText={(evt) => {
                handleChange("name", evt);
              }}
              onBlur={() => {
                checkErrors(["name"]);
              }}
              placeholder={translation.t("search_placeholder")}
              placeholderTextColor={"#888"}
              returnKeyType="next"
            ></TextInput>
          </View>
          {form.errors["name"] && (
            <Text style={styles.error}>Product name is mandatory</Text>
          )}
        </View>

        <Text style={styles.inputLabel}>Product category</Text>
        <Text style={styles.inputSubLabel}>
          Please select from 1 to 3 categories
        </Text>

        {categoriesList.map((option) => {
          return (
            <View key={option.id}>
              <Checkbox
                status={
                  form.categories.indexOf(option) != -1
                    ? "checked"
                    : "unchecked"
                }
                onPress={() => {
                  handleCheck(option);
                }}
              />
              <Text>{translation.t("categories." + option.code)}</Text>
            </View>
          );
        })}
        {form.errors["categories"] && (
          <Text style={styles.error}>Please select at least one category</Text>
        )}

        <Button
          title="Next step"
          onPress={() => {
            onSubmit();
          }}
        ></Button>
      </View>
      <View style={styles.footer}></View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    paddingBottom: 50,
  },
  header: {
    marginTop: 10,
  },
  contentView: {
    paddingHorizontal: 26,
  },
  inputGroup: {
    marginBottom: 24,
  },
  inputLabel: {
    fontWeight: "bold",
    fontSize: 22,
  },
  inputSubLabel: {
    fontSize: 18,
  },
  error: {
    color: "red",
  },
  input: {
    outlineStyle: "none",
    paddingLeft: 10,
    fontSize: 20,
    flex: 1,
  },
  searchBar: {
    marginVertical: 16,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "#000",
    borderRadius: 100,
    padding: 3,
    flexDirection: "row",
  },
  image: {
    resizeMode: "contain",
    fontSize: 30,
    margin: 5,
    height: 30,
    width: 30,
  },
  footer: {
    height: 40,
  },
});

export default AddScreen;
