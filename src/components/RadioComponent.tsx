import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import colors from "../config/colors";
import IonIcons from "react-native-vector-icons/Ionicons";

type Props = {
  checked: boolean;
  onPress: Function;
};

function RadioComponent({ checked, onPress }: Props) {
  return (
    <TouchableOpacity
      style={[styles.checkbox, checked ? styles.checked : undefined]}
      onPress={(e) => {
        if (onPress != undefined) onPress();
      }}
    >
      {checked && (
        // <IonIcons
        //   name={"checkmark-outline"}
        //   // style={styles.icon}
        //   size={18}
        //   color={"white"}
        // />
        <View
          style={{ backgroundColor: colors.mint, flex: 1, borderRadius: 10 }}
        ></View>
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
    borderRadius: 10,
    padding: 5,
  },
  checked: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
});

export default RadioComponent;
