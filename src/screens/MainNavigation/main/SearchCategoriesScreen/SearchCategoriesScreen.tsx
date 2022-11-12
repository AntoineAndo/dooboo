import React from "react";
import { Text, View, Button } from "react-native";
import { Checkbox } from "react-native-paper";
import HeaderComponent from "../../../../components/HeaderComponent";
import { useTranslation } from "../../../../hooks/translation";
import { useConfig } from "../../../../providers/ConfigProvider";

function SearchCategoriesScreen({ navigation }: any) {
  const { config } = useConfig();
  const translation = useTranslation();
  const [searchForm, setSearchForm] = React.useState<any>({
    categories: [],
  });

  const handleCheck = function (option: any) {
    let newArray = [...searchForm.categories];
    let index = newArray.indexOf(option);

    //If the clicked element is not present in the array
    if (index == -1) {
      newArray.push(option);
    } else {
      //else removed
      newArray.splice(index, 1);
    }

    patchState("categories", newArray);
  };

  function patchState(key: string, value: string | string[]) {
    //Enforce validation

    setSearchForm({
      ...searchForm,
      [key]: value,
    });
  }

  function onSubmit() {
    //si pas d'erreur
    navigation.navigate("Search result", { searchParams: searchForm });
  }

  return (
    <View>
      <HeaderComponent title="Categories" showBackButton={true} subtitle="" />
      <View>
        {config.dropdownValues.categories.map((category: any) => {
          return (
            <View key={category.id}>
              <Checkbox
                status={
                  searchForm.categories.indexOf(category) != -1
                    ? "checked"
                    : "unchecked"
                }
                onPress={() => {
                  handleCheck(category);
                }}
              />
              <Text>{translation.t("categories." + category.code)}</Text>
            </View>
          );
        })}

        <Button
          title="Next step"
          onPress={() => {
            onSubmit();
          }}
        ></Button>
      </View>
    </View>
  );
}

export default SearchCategoriesScreen;
