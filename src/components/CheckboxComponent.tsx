import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import colors from "../config/colors";
import IonIcons from "react-native-vector-icons/Ionicons";

type Props = {
  checked?: boolean;
  onPress?: Function;
  style?: any;
};

function CheckboxComponent({ checked, onPress, style }: Props) {
  return (
    <TouchableOpacity
      style={[styles.checkbox, style, checked ? styles.checked : undefined]}
      onPress={(e) => {
        if (onPress != undefined) onPress();
      }}
    >
      {checked && (
        <IonIcons
          name={"checkmark-outline"}
          // style={styles.icon}
          size={18}
          color={"white"}
        />
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: colors.grey,
    borderRadius: 5,
  },
  checked: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
});

export default CheckboxComponent;
