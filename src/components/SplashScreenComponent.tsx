import React from "react";
import { View, Text, StyleSheet } from "react-native";
import colors from "../config/colors";
import T from "./T";
import LogoComponent from "./LogoComponent";
import commonStyles from "../config/stylesheet";
import spacing from "../config/spacing";

type Props = {};

function SplashScreenComponent({}: Props) {
  return (
    <View style={styles.overlay}>
      <View style={styles.logoContainer}>
        <LogoComponent style={styles.logo} />
        {/* <T style={[commonStyles.title, styles.title]}>Dooboo</T> */}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    zIndex: 999,
    height: "100%",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.primary,
  },
  logoContainer: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
  },
  logo: {
    alignSelf: "center",
    width: 50,
  },
  title: {
    marginTop: spacing.s3,
    color: "white",
  },
});
export default SplashScreenComponent;
