import { useNavigation } from "@react-navigation/native";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import colors from "../config/colors";

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
        <Text style={styles.backAction} onPress={() => navigation.goBack()}>
          ←
        </Text>
      )}
      <Text style={styles.title}>{title}</Text>
      {subtitle != undefined && <Text style={styles.subtitle}>{subtitle}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    width: "100%",
    borderBottomWidth: 1,
    textAlign: "center",
    position: "relative",
    paddingVertical: 30,
    justifyContent: "center",
  },
  title: {
    width: "100%",
    color: colors.primary,
    fontSize: 34,
    fontWeight: "400",
  },
  subtitle: {
    color: colors.primary,
    fontSize: 28,
  },
  backAction: {
    position: "absolute",
    left: 20,
    fontSize: 40,
    fontWeight: "700",
  },
});

export default HeaderComponent;
