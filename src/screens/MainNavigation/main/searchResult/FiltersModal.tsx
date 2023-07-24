import React from "react";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import ButtonComponent from "../../../../components/ButtonComponent";
import CheckboxComponent from "../../../../components/CheckboxComponent";
import T from "../../../../components/T";
import spacing from "../../../../config/spacing";
import commonStyles from "../../../../config/stylesheet";
import { useTranslation } from "../../../../hooks/translation";
import { Config } from "../../../../providers/ConfigProvider";
import SearchForm from "../../../../types/SearchForm";

type Props = {
  config: Config;
  onClose: Function;
  searchParams: SearchForm;
};

function FiltersModal({ config, onClose, searchParams }: Props) {
  const { translate } = useTranslation();
  const [searchForm, setSearchForm] = React.useState<SearchForm>(searchParams);

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
      <T style={commonStyles.bigText}>{translate("filters")}</T>

      {/* FILTERS */}
      {/* Categories */}
      <View style={styles.list}>
        {config.categories?.map((category: any) => {
          return (
            <TouchableOpacity
              style={styles.checkbox}
              key={category.id}
              onPress={() => {
                handleCheck(category);
              }}
            >
              <Text>{translate(category.code)}</Text>
              <CheckboxComponent
                checked={searchForm.categories.indexOf(category) != -1}
                onPress={() => {
                  handleCheck(category);
                }}
              />
            </TouchableOpacity>
          );
        })}
      </View>

      {/* FOOTER */}
      <View style={styles.footer}>
        <ButtonComponent type="secondary" onPress={() => onClose(null)}>
          Cancel
        </ButtonComponent>
        <ButtonComponent onPress={() => onClose(searchForm)}>
          Apply
        </ButtonComponent>
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
  list: {
    flex: 1,
    flexDirection: "column",
    marginTop: spacing.s3,
  },
  checkbox: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 12,
  },
  footer: {
    position: "absolute",
    padding: 20,
    bottom: 0,
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
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
