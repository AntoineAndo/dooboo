import React from "react";
import { Text, View, Modal, StyleSheet, Pressable } from "react-native";
import { Checkbox } from "react-native-paper";
import { useTranslation } from "../../../../hooks/translation";
import { Config } from "../../../../providers/ConfigProvider";

type Props = {
  config: Config;
  onClose: Function;
};

function FiltersModal({ config, onClose }: Props) {
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

  return (
    <View style={styles.modalView}>
      {/* HEADER */}
      <Text style={styles.modalText}>Filters</Text>

      {/* FILTERS */}
      {/* Categories */}
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

      {/* FOOTER */}
      <View style={styles.footer}>
        <Pressable
          style={[styles.button, styles.buttonClose]}
          onPress={() => onClose(null)}
        >
          <Text style={styles.textStyle}>Close without saving</Text>
        </Pressable>
        <Pressable
          style={[styles.button, styles.buttonClose]}
          onPress={() => onClose(searchForm)}
        >
          <Text style={styles.textStyle}>Save and apply</Text>
        </Pressable>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  modalView: {
    position: "relative",
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 100,
    flex: 1,
  },
  footer: {
    position: "absolute",
    padding: 20,
    bottom: 0,
    flex: 1,
    flexDirection: "row",
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
});

export default FiltersModal;
