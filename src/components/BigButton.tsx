import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Image, Text, StyleSheet, TouchableOpacity } from "react-native";
import colors from "../config/colors";
import fontSizes from "../config/fontSizes";
import spacing from "../config/spacing";
import commonStyles from "../config/stylesheet";
import T from "./T";

type Props = {
  imageSource: any;
  children: any;
  onPress: Function;
  style?: any;
};

function BigButton({ imageSource, children, onPress, style }: Props) {
  return (
    <TouchableOpacity
      style={[styles.button, commonStyles.bottomShadow, style]}
      onPress={() => onPress()}
    >
      {/* //"#9B8FFF" */}
      <LinearGradient
        colors={["white", "white"]}
        start={{
          x: 0,
          y: 0,
        }}
        end={{
          x: 2,
          y: 2,
        }}
        style={[styles.gradient]}
      >
        <Image style={styles.image} source={imageSource}></Image>
        <T style={styles.text}>{children}</T>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  image: {
    width: "40%",
    height: "40%",
  },
  text: {
    fontSize: fontSizes.label,
    fontFamily: "Milliard-Medium",
    fontWeight: "500",
    marginTop: spacing.s1,
    color: colors.darkgrey,
  },
  button: {
    flex: 1,
    aspectRatio: 1,
    borderWidth: 4,
    borderColor: colors.primary,
    // margin: spacing.s2,
    borderRadius: 20,
    backgroundColor: "#eee",
    justifyContent: "center",
    alignItems: "center",
    ...commonStyles.elevation2,
    overflow: "hidden",
  },
  gradient: {
    width: "100%",
    height: "100%",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default BigButton;
