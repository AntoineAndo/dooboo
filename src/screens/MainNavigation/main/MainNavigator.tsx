import React from "react";

import { createNativeStackNavigator } from "@react-navigation/native-stack";

//Screen imports
import HomeScreen from "./home/HomeScreen";
import SearchScreen from "./search/SearchScreen";
import SearchResultScreen from "./searchResult/SearchResultScreen";
import SearchCategoriesScreen from "./SearchCategoriesScreen/SearchCategoriesScreen";
import ProductScreen from "./product/ProductScreen";
import { View } from "react-native";
import ContributionScreen from "./contribution/ContributionScreen";

const Stack = createNativeStackNavigator();

type Props = {
  navigation: object;
};

function s1() {
  return <View>1</View>;
}
function s2() {
  return <View>2</View>;
}

function HomeNavigation({ navigation }: Props) {
  return (
    <Stack.Navigator
      initialRouteName="HomeScreen"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="HomeScreen" component={HomeScreen} options={{}} />
      <Stack.Screen name="Search" component={SearchScreen} />
      <Stack.Screen name="Search result" component={SearchResultScreen} />
      <Stack.Screen
        name="Search categories"
        component={SearchCategoriesScreen}
      />
      <Stack.Screen name="Product" component={ProductScreen} />
      <Stack.Screen name="Contribution" component={ContributionScreen} />
    </Stack.Navigator>
  );
}

export default HomeNavigation;
