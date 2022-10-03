import React, { useState } from "react";
import { StyleSheet, View, TextInput } from "react-native";
import { Image } from "react-native-elements/dist/image/Image";

type Props = {
  onSubmit: Function;
};

function SearchInput({ onSubmit }: Props) {
  let [text, setText] = useState("");

  return (
    <View style={styles.searchBar}>
      <Image
        style={styles.image}
        source={require("../assets/icons/search.svg")}
      ></Image>
      <TextInput
        style={styles.input}
        placeholder="Type text here"
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
