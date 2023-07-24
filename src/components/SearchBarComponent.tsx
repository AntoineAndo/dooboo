import { useNavigation } from "@react-navigation/native";
import React from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import { Text } from "react-native-elements";
import IonIcons from "react-native-vector-icons/Ionicons";

//Style import
import colors from "../config/colors";
import fontSizes from "../config/fontSizes";
import { useTranslation } from "../hooks/translation";
import T from "./T";

type Props = {
  onTouch: Function;
};

function SearchBarComponent({ onTouch }: Props) {
  const navigation = useNavigation<any>();
  const { translate } = useTranslation();
  if (translate == undefined) {
    return <></>;
  }
  return (
    <TouchableOpacity
      style={styles.searchBar}
      onPress={() => navigation.navigate("Search")}
    >
      <IonIcons name={"search-outline"} style={styles.image} size={40} />
      <View style={styles.textContainer}>
        <T style={styles.text1}>{translate("search")}</T>
        <T style={styles.text2}>{translate("search_subtitle")}</T>
      </View>
    </TouchableOpacity>
  );
}

const gap = 5;
const styles = StyleSheet.create({
  searchBar: {
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: colors.lightgrey,
    borderRadius: 100,
    padding: 5,
    flexDirection: "row",
  },
  image: {
    margin: 5,
    width: 40,
    height: 40,
    marginHorizontal: gap,
  },
  textContainer: {
    flex: 1,
    marginHorizontal: gap,
  },
  text1: {
    color: colors.black,
    fontFamily: "Milliard-Regular",
    fontSize: fontSizes.label,
  },
  text2: {
    color: colors.black,
    fontSize: fontSizes.p,
  },
});

export default SearchBarComponent;
