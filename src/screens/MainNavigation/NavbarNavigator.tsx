import React from "react";

import { StyleSheet } from "react-native";
// import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";

import IonIcons from "react-native-vector-icons/Ionicons";

//Screen imports
import HomeScreen from "./main/home/HomeScreen";
import ProfileScreen from "./profile/ProfileScreen";
import AddScreen from "./add/AddStep1/AddScreen";

//Style import
import colors from "../../config/colors";
import HomeNavigation from "./main/MainNavigator";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import AddNavigator from "./add/AddNavigator";

//Screen names
const homeName = "Home";
const profileName = "Profile";
const addName = "Add";

export type RootStackParams = {
  Home: any;
  Profile: any;
  Add: any;
};

const Tab = createMaterialBottomTabNavigator<RootStackParams>();

type Props = {};

function NavbarNavigator({}: Props) {
  return (
    <Tab.Navigator
      initialRouteName={homeName}
      labeled={true}
      activeColor={colors.primary}
      inactiveColor={colors.primary}
    >
      <Tab.Screen
        name={homeName}
        component={HomeNavigation}
        options={{
          tabBarIcon: ({ color }: any) => {
            return (
              <MaterialCommunityIcons name="home" color={color} size={26} />
            );
          },
        }}
      ></Tab.Screen>
      <Tab.Screen
        name={addName}
        component={AddNavigator}
        options={{
          tabBarIcon: ({ color }) => {
            return (
              <MaterialCommunityIcons
                name="plus-circle-outline"
                color={color}
                size={26}
              />
            );
          },
        }}
      ></Tab.Screen>
      <Tab.Screen
        name={profileName}
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color }) => {
            return (
              <MaterialCommunityIcons name="account" color={color} size={26} />
            );
          },
        }}
      ></Tab.Screen>
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    height: 70,
  },
});

export default NavbarNavigator;

// screenOptions={({ route }: any) => ({
//   tabBarStyle: styles.tabBar,
//   tabBarIcon: ({ focused, color, size }: any) => {
//     let iconName;
//     let rn = route.name;
//     color = colors.primary;

//     if (rn === homeName) {
//       iconName = focused ? "home" : "home-outline";
//     } else if (rn === profileName) {
//       iconName = focused ? "person" : "person-outline";
//     } else if (rn === addName) {
//       iconName = focused ? "add-circle" : "add-circle-outline";
//     } else {
//       iconName = "";
//     }

//     return <IonIcons name={iconName} size={40} color={color} />;
//   },
// })}
