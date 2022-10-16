import { useNavigation } from "@react-navigation/native";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import colors from "../config/colors";
import IonIcons from "react-native-vector-icons/Ionicons";

type Props = {
  title: String;
  showBackButton?: Boolean;
  subtitle?: String;
};

function HeaderComponent({ title, showBackButton = true, subtitle }: Props) {
  const navigation = useNavigation();
  return (
    <View style={styles.header}>
      {showBackButton && (
        <IonIcons
          name={"arrow-back-outline"}
          style={styles.backAction}
          size={40}
          onPress={() => navigation.goBack()}
        />
      )}
      <Text style={styles.title}>{title}</Text>
      {subtitle != undefined && <Text style={styles.subtitle}>{subtitle}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    width: "100%",
    position: "relative",
    paddingVertical: 30,
    justifyContent: "center",
  },
  title: {
    width: "100%",
    textAlign: "center",
    color: colors.primary,
    fontSize: 34,
    fontWeight: "400",
  },
  subtitle: {
    color: colors.primary,
    fontSize: 28,
    textAlign: "center",
  },
  backAction: {
    position: "absolute",
    left: 20,
    fontSize: 40,
    fontWeight: "700",
  },
});

export default HeaderComponent;
