import React from "react";
import { StatusBar, StyleSheet, View } from "react-native";
import spacing from "../config/spacing";
import SearchBarComponent from "./SearchBarComponent";

const SearchHeaderComponent = () => {
  return (
    <View style={styles.searchBar}>
      <SearchBarComponent onTouch={() => "startSearch(navigation)"} />
    </View>
  );
};

const styles = StyleSheet.create({
  searchBar: {
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: 999,
    width: "100%",
    backgroundColor: "white",
    borderBottomRightRadius: 40,
    borderBottomLeftRadius: 40,
    elevation: 2,
    padding: spacing.s3,
    paddingTop: spacing.s1 + (StatusBar.currentHeight ?? spacing.s3),
    overflow: "hidden",
  },
});

export default SearchHeaderComponent;
