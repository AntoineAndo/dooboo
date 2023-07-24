import React, { useState } from "react";
import { StyleSheet, View, TextInput, AccessibilityValue } from "react-native";
import IonIcons from "react-native-vector-icons/Ionicons";
import commonStyles from "../config/stylesheet";
import { useTranslation } from "../hooks/translation";

type Props = {
  onSubmit?: Function;
  onChange?: Function;
  accessibilityLabel: string;
};

function SearchInput({ onSubmit, onChange, accessibilityLabel }: Props) {
  let [text, setText] = useState("");

  const { translate } = useTranslation();

  function _change(value: string) {
    setText(value);
    if (onChange) onChange(value);
  }

  return (
    <View style={styles.searchBar}>
      <IonIcons name={"search-outline"} style={styles.image} size={30} />
      <TextInput
        style={styles.input}
        placeholder={translate("search_placeholder")}
        placeholderTextColor={"#888"}
        returnKeyType="search"
        onChangeText={_change}
        value={text}
        onSubmitEditing={() => _submit(text, onSubmit)}
        accessibilityLabel={accessibilityLabel}
        // accessibilityValue={text as AccessibilityValue}
      ></TextInput>
    </View>
  );
}

function _submit(value: string, onSubmit?: Function) {
  if (onSubmit) onSubmit(value);
}

const gap = 5;
const styles = StyleSheet.create({
  input: {
    //@ts-ignore
    // outlineStyle: "none",
    marginLeft: 0,
    fontSize: 16,
    flex: 1,
  },
  searchBar: {
    borderRadius: 100,
    padding: 1,
    flexDirection: "row",
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#ddd",
    // ...commonStyles.elevation2,
  },
  image: {
    // resizeMode: "contain",
    margin: 5,
    height: 30,
    width: 30,
    marginHorizontal: gap,
  },
});

export default SearchInput;
