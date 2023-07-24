import React from "react";
import { StyleSheet, View } from "react-native";

import { Dimensions, StatusBar } from "react-native";
import { log } from "react-native-reanimated";

const screenHeight = Dimensions.get("screen").height;
const windowHeight = Dimensions.get("window").height;

const statusBarHeight =
  StatusBar.currentHeight != undefined ? StatusBar.currentHeight : 0;

const navbarHeight = screenHeight - windowHeight + statusBarHeight;

type Props = {
  children: any;
  withNavbar?: boolean;
  style?: any;
};

function PageComponent({ children, withNavbar = true, style }: Props) {
  let pageHeight = Dimensions.get("window").height + statusBarHeight;

  if (withNavbar) {
    pageHeight -= navbarHeight;
  } else {
  }

  const styles = StyleSheet.create({
    page: {
      height: pageHeight,
      backgroundColor: "white",
      paddingTop: 0,
    },
  });

  return <View style={[styles.page, style]}>{children}</View>;
}
export default PageComponent;
