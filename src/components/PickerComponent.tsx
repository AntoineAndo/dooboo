import { Picker } from "@react-native-picker/picker";
import React from "react";
import { StyleProp, StyleSheet, TextStyle, View } from "react-native";
import emojiFlags from "emoji-flags";
import colors from "../config/colors";

type Props = {
  value: any;
  onChange: Function;
  choices: any[];
  showEmoji?: Boolean;
  labelField: string;
  valueField: string;
  style?: StyleProp<TextStyle> | TextStyle;
};

function PickerComponent({
  value,
  onChange,
  choices,
  showEmoji,
  labelField,
  valueField,
  style,
}: Props) {
  return (
    <View style={[styles.pickerContainer, style]}>
      <Picker
        selectedValue={value}
        onValueChange={(itemValue, itemIndex) => {
          onChange(itemValue);
        }}
        style={styles.picker}
      >
        {choices.map((country: any) => {
          if (showEmoji) {
            return (
              <Picker.Item
                label={`${emojiFlags.countryCode(country.code).emoji} ${
                  country[labelField]
                }`}
                value={country[valueField]}
                key={country.code}
              />
            );
          } else {
            return (
              <Picker.Item
                label={`${country[labelField]}`}
                value={country[valueField]}
                key={country.code}
                fontFamily={"Milliard-Medium"}
              />
            );
          }
        })}
      </Picker>
    </View>
  );
}

const styles = StyleSheet.create({
  pickerContainer: {
    borderWidth: 1,
    borderColor: colors.grey,
    borderRadius: 30,
    overflow: "hidden",
    paddingLeft: 15,
    backgroundColor: "white",
  },
  picker: {
    width: "100%",
    height: 55,
  },
  pickerItem: {
    fontFamily: "Milliard-Medium",
  },
});

export default PickerComponent;
