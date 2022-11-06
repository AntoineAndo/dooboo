import React from "react";

import { StyleSheet, Text, View } from "react-native";
// import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";

// import Ionicons from "@expo/vector-icons/Ionicons";
import IonIcons from "react-native-vector-icons/Ionicons";

//Screen imports
// import HomeScreen from "./main/home/HomeScreen";
import ProfileScreen from "./profile/ProfileHomeScreen";
import AddScreen from "../AddFlow/AddScreen";

//Style import
import colors from "../../config/colors";
import HomeNavigation from "./main/MainNavigator";

import { NavigationContainer } from "@react-navigation/native";
import ProfileNavigation from "./profile/ProfileNavigation";
import { useAuth } from "../../providers/AuthProvider";
import AddNavigator from "../AddFlow/AddNavigator";

const Tab = createMaterialBottomTabNavigator();

type Props = {
  navigation: any;
};

function NavbarNavigator({ navigation }: Props) {
  const { auth } = useAuth();

  return (
    <Tab.Navigator
      initialRouteName={"HomeNavigation"}
      labeled={true}
      activeColor={colors.primary}
      inactiveColor={colors.primary}
      barStyle={{
        marginTop: 0,
        backgroundColor: "white",
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
        listeners={{
          tabPress: (e) => {
            e.preventDefault();
            if (auth.phoneNumber != undefined) {
              navigation.navigate("AddNavigation");
            } else {
              navigation.navigate("ProfileNavigation", {
                redirect: "Authentication",
              });
            }
            return () => {
              console.log("focus out");
            };
          },
        }}
        children={AddNavigator}
        options={{
          tabBarIcon: ({ color }) => {
            return <IonIcons name="add" color={color} size={26} />;
          },
        }}
      ></Tab.Screen>
      <Tab.Screen
        name={"ProfileNavigation"}
        component={ProfileNavigation}
        options={{
          tabBarIcon: ({ color }) => {
            return <IonIcons name="person" color={color} size={26} />;
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
