import React from "react";
import { Image, ImageBackground, StyleSheet, View } from "react-native";

type Props = {};

function WelcomeScreen({}: Props) {
  return (
    <ImageBackground
      style={styles.background}
      // source={require("../assets/splash.png")}
      source={{
        uri: "https://picsum.photos/200/300",
      }}
    >
      <Image style={styles.logo} source={require("../assets/icon.png")}></Image>

      <View style={styles.loginButton}></View>
      <View style={styles.registerButton}></View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  logo: {
    width: 100,
    height: 100,
    position: "absolute",
    top: "25%",
  },
  loginButton: {
    width: "100%",
    height: 70,
    backgroundColor: "#fc5cc5",
  },
  registerButton: {
    width: "100%",
    height: 70,
    backgroundColor: "red",
  },
});

export default WelcomeScreen;
