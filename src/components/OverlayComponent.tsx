import React from "react";
import { View, Text, StyleSheet } from "react-native";
import colors from "../config/colors";

type Props = {};

function OverlayComponent({}: Props) {
  return (
    <View style={styles.overlay}>
      <Text style={styles.overlayText}>Loading...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    zIndex: 999,
    height: "100%",
    width: "100%",
    backgroundColor: "white",
    opacity: 0.7,
    justifyContent: "center",
    alignItems: "center",
  },
  overlayText: {
    color: colors.primary,
    fontSize: 20,
    fontWeight: "500",
  },
});
export default OverlayComponent;
