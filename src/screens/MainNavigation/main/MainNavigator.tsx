import React from "react";

import { createNativeStackNavigator } from "@react-navigation/native-stack";

//Screen imports
import HomeScreen from "./home/HomeScreen";
import SearchScreen from "./search/SearchScreen";
import SearchResultScreen from "./searchResult/SearchResultScreen";
import SearchCategoriesScreen from "./SearchCategoriesScreen/SearchCategoriesScreen";
import ProductScreen from "./product/ProductScreen";

const Stack = createNativeStackNavigator();

type Props = {
  navigation: object;
};

function HomeNavigation({ navigation }: Props) {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Home" component={HomeScreen} options={{}} />
      <Stack.Screen name="Search" component={SearchScreen} />
      <Stack.Screen name="Search result" component={SearchResultScreen} />
      <Stack.Screen
        name="Search categories"
        component={SearchCategoriesScreen}
      />
      <Stack.Screen name="Product" component={ProductScreen} />
    </Stack.Navigator>
  );
}

export default HomeNavigation;
