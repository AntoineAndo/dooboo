import { useNavigation } from "@react-navigation/native";
import React from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import { Text } from "react-native-elements";
import { Image } from "react-native-elements/dist/image/Image";

//Style import
import colors from "../config/colors";

type Props = {
  onTouch: Function;
};

function SearchBarComponent({ onTouch }: Props) {
  const navigation = useNavigation<any>();
  return (
    <TouchableOpacity
      style={styles.searchBar}
      onPress={() => navigation.navigate("Search")}
    >
      <Image
        style={styles.image}
        source={require("../assets/icons/search.svg")}
      ></Image>
      <View style={styles.textContainer}>
        <Text style={styles.text1}>Search</Text>
        <Text style={styles.text2}>Product name, brand, etc</Text>
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
    flex: 1,
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
