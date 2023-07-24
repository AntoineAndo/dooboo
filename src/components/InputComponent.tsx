import React from "react";
import {
  AccessibilityValue,
  ReturnKeyTypeOptions,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import colors from "../config/colors";
import fontSizes from "../config/fontSizes";

type Props = {
  value?: string;
  onChangeText?: Function;
  onBlur?: Function;
  placeholder?: string;
  returnKeyType?: ReturnKeyTypeOptions;
};

function InputComponent({
  value,
  onChangeText,
  onBlur,
  placeholder = "",
  returnKeyType = "default",
}: Props) {
  return (
    <View style={styles.inputContainer}>
      <TextInput
        style={styles.input}
        value={value}
        // accessibilityValue={(value ?? "") as AccessibilityValue}
        onChangeText={(evt) => {
          if (onChangeText) onChangeText(evt);
        }}
        onBlur={() => {
          if (onBlur != undefined) onBlur();
        }}
        placeholder={placeholder}
        placeholderTextColor={"#888"}
        returnKeyType={returnKeyType}
      ></TextInput>
    </View>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    height: 50,
    marginVertical: 16,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: colors.grey,
    borderRadius: 100,
    padding: 3,
    paddingLeft: 10,
    flexDirection: "row",
  },
  input: {
    // outlineStyle: "none",
    paddingLeft: 10,
    fontSize: fontSizes.p,
    flex: 1,
  },
});

export default InputComponent;
