import React from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import HeaderComponent from "../../../../components/HeaderComponent";
import IonIcons from "react-native-vector-icons/Ionicons";
import { useTranslation } from "../../../../hooks/translation";
import { Button, Checkbox } from "react-native-paper";
import { useQuery } from "@tanstack/react-query";
import { getStores } from "../../../../lib/supabase";

type Props = {
  navigation: any;
};

export type Form = {
  title: string;
  categories: string[];
  storeId: string;
};

function AddScreen({ navigation }: Props) {
  const translation = useTranslation();
  const options = ["1", "2", "3"];
  const maxCategoryChoices = 2;

  const [form, setForm] = React.useState<Form>({
    title: "",
    categories: [],
    storeId: "",
  });

  const [errors, setErrors] = React.useState<{
    [key: string]: any;
  }>({});

  const {
    isLoading,
    isError,
    data: storeList,
    error,
  } = useQuery(["stores"], () => getStores(1));

  function handleChange(key: string, value: string | string[]) {
    //Enforce validation

    setForm({
      ...form,
      [key]: value,
    });
  }

  const handleCheck = function (option: string) {
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

    if (fields == undefined || fields.indexOf("title") != -1) {
      //Mandatory title
      if (form.title == "") {
        newErrors["title"] = true;
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
  };

  if (isLoading) {
    return (
      <View>
        <Text>Loading</Text>
      </View>
    );
  }
  if (isError) {
    return (
      <View>
        <Text>Error</Text>
      </View>
    );
  }

  return (
    <View>
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
              value={form.title}
              onChangeText={(evt) => {
                handleChange("title", evt);
              }}
              onBlur={() => {
                checkErrors(["title"]);
              }}
              placeholder={translation.t("search_placeholder")}
              placeholderTextColor={"#888"}
              returnKeyType="next"
            ></TextInput>
          </View>
          {errors["title"] && (
            <Text style={styles.error}>Product name is mandatory</Text>
          )}
        </View>

        <Text style={styles.inputLabel}>Product category</Text>
        <Text style={styles.inputSubLabel}>
          Please select from 1 to 3 categories
        </Text>

        {options.map((option) => {
          return (
            <View key={option}>
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
              <Text>{option}</Text>
            </View>
          );
        })}
        {errors["categories"] && (
          <Text style={styles.error}>Please select at least one category</Text>
        )}

        <Button
          mode="contained"
          onPress={() => {
            onSubmit();
          }}
        >
          Next step
        </Button>
      </View>
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
    marginLeft: 10,
    fontSize: 20,
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
});

export default AddScreen;
