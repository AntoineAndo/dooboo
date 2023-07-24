import { useNavigation } from "@react-navigation/native";
import React from "react";
import { Dimensions, Image, StyleSheet, View } from "react-native";
import spacing from "../config/spacing";
import commonStyles from "../config/stylesheet";
import { useTranslation } from "../hooks/translation";
import { useAppState } from "../providers/AppStateProvider";
import { useAuth } from "../providers/AuthProvider";
import ButtonComponent from "./ButtonComponent";
import T from "./T";

type Props = {};

function NoStoresComponent({}: Props) {
  const { translate } = useTranslation();
  const { auth } = useAuth();
  const { patchState } = useAppState();
  const navigation = useNavigation<any>();

  return (
    <View style={styles.card}>
      <Image
        style={styles.image}
        source={require("assets/images/store.png")}
      ></Image>
      <T style={styles.text}>{translate("no_stores_found")}</T>
      <ButtonComponent
        onPress={() => {
          if (auth.session != undefined) {
            navigation.navigate("AddNavigation");
          } else {
            patchState("showAuthPop", true);
          }
        }}
      >
        {translate("add_product")}
      </ButtonComponent>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    borderRadius: 25,
    //   marginHorizontal: spacing.s3,
    padding: spacing.s3,
    alignSelf: "flex-end",
    overflow: "hidden",
    // height: 200,
    margin: spacing.s3,
    width: Dimensions.get("window").width - spacing.s3 * 2,
    justifyContent: "space-evenly",
    alignItems: "center",
    ...commonStyles.elevation2,
  },
  image: {
    height: 50,
    aspectRatio: 1,
  },
  text: {
    marginVertical: spacing.s2,
  },
});

export default NoStoresComponent;
