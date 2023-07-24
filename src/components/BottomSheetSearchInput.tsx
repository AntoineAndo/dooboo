import { BottomSheetTextInput } from "@gorhom/bottom-sheet";
import React, { useState } from "react";
import { StyleSheet, View, TextInput, Pressable } from "react-native";
import IonIcons from "react-native-vector-icons/Ionicons";
import commonStyles from "../config/stylesheet";
import { useTranslation } from "../hooks/translation";
import colors from "../config/colors";
import spacing from "../config/spacing";

type Props = {
  onSubmit?: Function;
  onChange?: Function;
  onClear?: Function;
  value: string;
};

function BottomSheetSearchInputComponent({
  onSubmit,
  onChange,
  onClear,
  value,
}: Props) {
  const { translate } = useTranslation();

  function _change(value: string) {
    if (onChange) onChange(value);
  }

  return (
    <View style={styles.searchBar}>
      <IonIcons name={"search-outline"} style={styles.image} size={30} />
      <BottomSheetTextInput
        style={styles.input}
        placeholder={translate("search_place_placeholder")}
        placeholderTextColor={"#888"}
        returnKeyType="search"
        onChangeText={_change}
        value={value}
        onSubmitEditing={() => _submit(value, onSubmit)}
      ></BottomSheetTextInput>
      {value != "" && onClear && (
        <Pressable
          style={styles.inputClear}
          onPress={() => {
            _change("");
            onClear();
          }}
        >
          <IonIcons name="close" color={colors.darkgrey} size={20} />
        </Pressable>
      )}
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
  inputContainer: {
    // flex: 1,
  },
  inputClear: {
    position: "absolute",
    height: "100%",
    top: spacing.s2,
    right: spacing.s2,
  },
});

export default BottomSheetSearchInputComponent;
