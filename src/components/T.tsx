import React from "react";
import { StyleProp, StyleSheet, Text, TextStyle } from "react-native";
import colors from "../config/colors";
import fontSizes from "../config/fontSizes";

type Props = {
  children?: any;
  style?: StyleProp<TextStyle> | TextStyle;
  numberOfLines?: number;
};

function T({ children, style, numberOfLines }: Props) {
  const styles = StyleSheet.create({
    text: {
      fontFamily: "Milliard-Regular",
      color: colors.darkgrey,
      fontSize: fontSizes.p,
    },
  });

  return (
    <Text
      style={[styles.text, style]}
      numberOfLines={numberOfLines}
      ellipsizeMode="tail"
    >
      {children}
    </Text>
  );
}

export default T;
