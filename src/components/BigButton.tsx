import React from "react";
import { Image, Text, StyleSheet, TouchableOpacity } from "react-native";
import commonStyles from "../config/stylesheet";

type Props = {
  imageSource: any;
  children: any;
};

function BigButton({ imageSource, children }: Props) {
  return (
    <TouchableOpacity style={[styles.button, commonStyles.bottomShadow]}>
      <Image style={styles.image} source={imageSource}></Image>
      <Text style={styles.text}>{children}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  image: {
    width: "60%",
    height: "60%",
  },
  text: {
    fontSize: 20,
    fontWeight: "500",
  },
  button: {
    flex: 1,
    aspectRatio: 1,
    margin: 10,
    borderRadius: 20,
    backgroundColor: "#ddd",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default BigButton;
