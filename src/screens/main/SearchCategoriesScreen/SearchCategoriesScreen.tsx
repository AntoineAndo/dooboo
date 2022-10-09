import React from "react";
import { View } from "react-native";
import HeaderComponent from "../../../components/HeaderComponent";

function SearchCategoriesScreen({}) {
  return (
    <View>
      <HeaderComponent
        title="Categories"
        showBackButton={true}
        subtitle="prout"
      />
      <View>
        <View>item 1</View>
        <View>item 2</View>
      </View>
    </View>
  );
}

export default SearchCategoriesScreen;
