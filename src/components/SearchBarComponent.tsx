import { useNavigation } from "@react-navigation/native";
import React from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import { Text } from "react-native-elements";
import IonIcons from "react-native-vector-icons/Ionicons";

//Style import
import colors from "../config/colors";
import { useTranslation } from "../hooks/translation";

type Props = {
  onTouch: Function;
};

function SearchBarComponent({ onTouch }: Props) {
  const navigation = useNavigation<any>();
  const translation = useTranslation();
  return (
    <TouchableOpacity
      style={styles.searchBar}
      onPress={() => navigation.navigate("Search")}
    >
      <IonIcons name={"search-outline"} style={styles.image} size={40} />
      <View style={styles.textContainer}>
        <Text style={styles.text1}>{translation.t("search")}</Text>
        <Text style={styles.text2}>{translation.t("search_subtitle")}</Text>
      </View>
    </TouchableOpacity>
  );
}

const gap = 5;
const styles = StyleSheet.create({
  searchBar: {
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "#000",
    borderRadius: 100,
    margin: 20,
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
    fontWeight: "700",
    fontSize: 20,
  },
  text2: {
    color: colors.black,
    fontWeight: "100",
    fontSize: 18,
  },
});

export default SearchBarComponent;
