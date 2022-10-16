import React from "react";
import { Text, View } from "react-native";
import HeaderComponent from "../../../../components/HeaderComponent";

function SearchCategoriesScreen({}) {
  return (
    <View>
      <HeaderComponent title="Categories" showBackButton={true} subtitle="" />
      <View>
        <View>
          <Text>item 1</Text>
        </View>
        <View>
          <Text>item 2</Text>
        </View>
      </View>
    </View>
  );
}

export default SearchCategoriesScreen;
