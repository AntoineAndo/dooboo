import React from "react";

import { StyleSheet, Text, View } from "react-native";
// import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";

// import Ionicons from "@expo/vector-icons/Ionicons";
import IonIcons from "react-native-vector-icons/Ionicons";

//Screen imports
// import HomeScreen from "./main/home/HomeScreen";
import ProfileScreen from "./profile/ProfileScreen";
import AddScreen from "./add/AddStep1/AddScreen";

//Style import
import colors from "../../config/colors";
import HomeNavigation from "./main/MainNavigator";

import AddNavigator from "./add/AddNavigator";
import { NavigationContainer } from "@react-navigation/native";

const Tab = createMaterialBottomTabNavigator();

type Props = {};

function NavbarNavigator({}: Props) {
  return (
    <NavigationContainer independent={true}>
      <Tab.Navigator
        initialRouteName={"HomeNavigation"}
        labeled={true}
        activeColor={colors.primary}
        inactiveColor={colors.primary}
        barStyle={{
          marginTop: 0,
        }}
      >
        <Tab.Screen
          name="HomeNavigation"
          component={HomeNavigation}
          options={{
            tabBarIcon: ({ color }) => {
              return <IonIcons name="home" color={color} size={26} />;
            },
          }}
        />
        <Tab.Screen
          name={"Add"}
          component={AddNavigator}
          options={{
            tabBarIcon: ({ color }) => {
              return <IonIcons name="add" color={color} size={26} />;
            },
          }}
        ></Tab.Screen>
        <Tab.Screen
          name={"ProfileScreen"}
          component={ProfileScreen}
          options={{
            tabBarIcon: ({ color }) => {
              return <IonIcons name="person" color={color} size={26} />;
            },
          }}
        ></Tab.Screen>
      </Tab.Navigator>
    </NavigationContainer>
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
