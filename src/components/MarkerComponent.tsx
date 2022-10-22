import React from "react";
import { View, StyleSheet } from "react-native";

type Props = {
  text: string;
  lat: string;
  lng: string;
  key: number;
};

function MarkerComponent({ text, lat, lng, key }: Props) {
  return (
    <View style={styles.markerContainer}>
      <View style={styles.marker}></View>
      <View style={styles.markerAfter}></View>
    </View>
  );
}

const styles = StyleSheet.create({
  markerContainer: {
    position: "relative",
    alignSelf: "baseline",
  },
  marker: {
    position: "absolute",
    top: -30,
    left: -7,
    borderRadius: 30,
    borderWidth: 10,
    backgroundColor: "white",
    borderColor: "red",
    height: 30,
    width: 30,
  },
  markerAfter: {
    position: "absolute",
    width: 0,
    height: 0,
    bottom: -30,
    left: -7,
    borderColor: "transparent",
    borderWidth: 15,
    borderTopColor: "red",
    borderTopWidth: 25,
  },
});

export default MarkerComponent;
