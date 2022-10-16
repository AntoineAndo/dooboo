import React, { useState } from "react";
import { StyleSheet, View, TextInput } from "react-native";
import IonIcons from "react-native-vector-icons/Ionicons";
import { useTranslation } from "../hooks/translation";

type Props = {
  onSubmit: Function;
};

function SearchInput({ onSubmit }: Props) {
  let [text, setText] = useState("");

  const translation = useTranslation();

  return (
    <View style={styles.searchBar}>
      <IonIcons name={"search-outline"} style={styles.image} size={40} />
      <TextInput
        style={styles.input}
        placeholder={translation.t("search_placeholder")}
        placeholderTextColor={"#888"}
        returnKeyType="search"
        onChangeText={setText}
        value={text}
        onSubmitEditing={() => _submit(text, onSubmit)}
      ></TextInput>
    </View>
  );
}

function _submit(value: string, onSubmit: Function) {
  onSubmit(value);
}

const gap = 5;
const styles = StyleSheet.create({
  input: {
    //@ts-ignore
    outlineStyle: "none",
    marginLeft: 10,
    fontSize: 20,
  },
  searchBar: {
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "#000",
    borderRadius: 100,
    padding: 5,
    flexDirection: "row",
  },
  image: {
    resizeMode: "contain",
    margin: 5,
    height: 40,
    width: 40,
    marginHorizontal: gap,
  },
});

export default SearchInput;
