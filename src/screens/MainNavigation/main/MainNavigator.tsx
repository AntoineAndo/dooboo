import React from "react";

import { createNativeStackNavigator } from "@react-navigation/native-stack";

//Screen imports
import HomeScreen from "./home/HomeScreen";
import SearchScreen from "./search/SearchScreen";
import SearchResultScreen from "./searchResult/SearchResultScreen";
import SearchCategoriesScreen from "./SearchCategoriesScreen/SearchCategoriesScreen";
import ProductScreen from "./product/ProductScreen";
import SearchBrandsScreen from "./SearchBrandsScreen/SearchBrandsScreen";
import SuccessScreen from "../../AddFlow/SuccessScreen";
import { useAppState } from "../../../providers/AppStateProvider";
import AddScreenImages from "../../AddFlow/AddScreenImages";
import AddScreenStore from "../../AddFlow/AddScreenStore";

const Stack = createNativeStackNavigator();

type Props = {
  navigation: object;
};

function HomeNavigation({ navigation }: Props) {
  const { state } = useAppState();

  return (
    <Stack.Navigator
      initialRouteName="HomeScreen"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="HomeScreen" component={HomeScreen} options={{}} />
      <Stack.Screen
        name="Search"
        component={SearchScreen}
        options={{
          animation: "slide_from_right",
        }}
      />
      <Stack.Screen
        name="Search result"
        component={SearchResultScreen}
        options={{
          animation: "slide_from_right",
        }}
      />
      <Stack.Screen
        name="Search categories"
        component={SearchCategoriesScreen}
        options={{
          animation: "slide_from_right",
        }}
      />
      <Stack.Screen
        name="Search brands"
        component={SearchBrandsScreen}
        options={{
          animation: "slide_from_right",
        }}
      />
      <Stack.Screen
        name="Product"
        component={ProductScreen}
        options={{
          animation: "slide_from_right",
        }}
        initialParams={{
          mapRegion: {
            latitude: state.userLocation?.latitude,
            longitude: state.userLocation?.longitude,
          },
        }}
      />
      <Stack.Screen
        name="Contribution"
        component={AddScreenStore}
        options={{
          animation: "slide_from_right",
        }}
        initialParams={{
          oneWay: true,
          withNavbar: true,
          title: "contribution",
          subtitle: "",
        }}
      />
      <Stack.Screen
        name="AddScreenImages"
        component={AddScreenImages}
        options={{
          animation: "slide_from_right",
        }}
        initialParams={{
          oneWay: true,
          type: "contribution",
        }}
      />
      <Stack.Screen
        name="SuccessScreen"
        component={SuccessScreen}
        options={{
          animation: "slide_from_right",
        }}
        initialParams={{ oneWay: true }}
      />
    </Stack.Navigator>
  );
}

export default HomeNavigation;
