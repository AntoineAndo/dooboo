import { useNavigation } from "@react-navigation/native";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import colors from "../config/colors";
import IonIcons from "react-native-vector-icons/Ionicons";
import T from "./T";
import spacing from "../config/spacing";

type Props = {
  title: string;
  showBackButton?: Boolean;
  onBackAction?: Function;
  subtitle?: string;
  type?: "white" | "green";
  style?: any;
};

function HeaderComponent({
  title,
  showBackButton = true,
  subtitle,
  type = "white",
  style,
  onBackAction,
}: Props) {
  const navigation = useNavigation();

  const goBack = () => {
    if (onBackAction) {
      return onBackAction();
    }

    navigation.goBack();
  };

  const styles = StyleSheet.create({
    header: {
      width: "100%",
      position: "relative",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      padding: spacing.s3,
    },
    title: {
      width: "100%",
      textAlign: "center",
      color: type == "white" ? colors.primary : "white",
      fontSize: 34,
      fontWeight: "400",
    },
    subtitle: {
      color: type == "white" ? colors.primary : "white",
      fontSize: 25,
      textAlign: "center",
    },
    actionContainer: {
      width: "100%",
      position: "absolute",
      height: "100%",
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
    },
    backAction: {
      aspectRatio: 1,
      height: 35,
      fontSize: 35,
      fontWeight: "700",
      marginTop: 5,
    },
  });

  return (
    <View style={[styles.header, style]}>
      <T style={styles.title}>{title}</T>
      {subtitle != undefined && <T style={styles.subtitle}>{subtitle}</T>}

      <View style={styles.actionContainer}>
        {showBackButton && (
          <IonIcons
            name={"arrow-back-outline"}
            style={styles.backAction}
            size={35}
            onPress={() => goBack()}
          />
        )}
      </View>
    </View>
  );
}

export default HeaderComponent;
