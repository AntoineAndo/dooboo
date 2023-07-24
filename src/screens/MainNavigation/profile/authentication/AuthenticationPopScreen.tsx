import React from "react";
import { View, StyleSheet, Image, BackHandler } from "react-native";
import { useAuth } from "../../../../providers/AuthProvider";
import T from "../../../../components/T";
import ButtonComponent from "../../../../components/ButtonComponent";
import { useTranslation } from "../../../../hooks/translation";
import spacing from "../../../../config/spacing";
import colors from "../../../../config/colors";
import { LinearGradient } from "expo-linear-gradient";
import commonStyles from "../../../../config/stylesheet";
import fontSizes from "../../../../config/fontSizes";
import { useFocusEffect, useNavigation } from "@react-navigation/native";

type Props = {
  style?: any;
  onClose: Function;
};

function AuthenticationPopScreen({ style, onClose }: Props) {
  const { translate } = useTranslation();
  const navigation = useNavigation<any>();

  // if (auth.user != undefined) {
  //   navigation.navigate("Profile");
  //   return null;
  // }

  //Create a back button press event listener
  // to close the modal
  useFocusEffect(() => {
    //Mount event listener
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        onClose();
        return true;
      }
    );

    //Unmount event listener
    return () => {
      backHandler.remove();
    };
  });

  return (
    <LinearGradient
      colors={[colors.primary, colors.primary, "#9B8FFF"]}
      start={{
        x: -1.5,
        y: -1.5,
      }}
      end={{
        x: 1.7,
        y: 1.7,
      }}
      style={[styles.content, style]}
    >
      <T
        style={[commonStyles.title, { marginTop: spacing.s3, color: "white" }]}
      >
        Dooboo
      </T>
      <Image
        source={require("assets/images/groceries.png")}
        style={styles.image}
      ></Image>
      <T style={styles.bigText}>{translate("auth_pop_title")}</T>
      <T style={styles.text}>{translate("auth_pop_subtitle")}</T>
      <View style={styles.buttonContainer}>
        <ButtonComponent
          onPress={() => onClose()}
          style={{ width: "100%", backgroundColor: undefined }}
          textStyle={{ color: "white" }}
          type="secondary"
          slim={true}
        >
          {translate("cancel")}
        </ButtonComponent>
        <ButtonComponent
          onPress={() => {
            onClose();
            navigation.navigate(translate("profile"), {
              screen: "Authentication",
            });
          }}
          style={{ width: "100%", marginTop: spacing.s2 }}
          type="primary"
        >
          {translate("login")}
        </ButtonComponent>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    // justifyContent: "space-evenly",
    padding: spacing.s3,
    backgroundColor: "white",
    borderRadius: 25,
  },
  image: {
    width: 100,
    height: 100,
    marginVertical: spacing.s3,
  },
  bigText: {
    fontFamily: "Milliard-Bold",
    lineHeight: fontSizes.label + 8,
    color: "white",
    fontSize: fontSizes.label + 2,
    width: "100%",
    textAlign: "center",
  },
  text: {
    fontFamily: "Milliard-Medium",
    lineHeight: fontSizes.label + 2,
    color: "white",
    fontSize: fontSizes.p,
    width: "100%",
    marginVertical: spacing.s2,
    textAlign: "center",
  },
  buttonContainer: {
    position: "absolute",
    bottom: spacing.s3,
    width: "100%",
  },
});

export default AuthenticationPopScreen;
