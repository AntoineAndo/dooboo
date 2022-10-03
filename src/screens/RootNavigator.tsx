import React from "react";

import { StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import IonIcons from "react-native-vector-icons/Ionicons";

//Screen imports
import HomeScreen from "./main/home/HomeScreen";
import ProfileScreen from "./profile/ProfileScreen";
import AddScreen from "./add/AddScreen";

//Style import
import colors from "../config/colors";
import HomeNavigation from "./main/MainNavigator";

//Screen names
const homeName = "Home";
const profileName = "Profile";
const addName = "Add";

export type RootStackParams = {
  Home: any;
  Profile: any;
  Add: any;
};

const Tab = createBottomTabNavigator<RootStackParams>();

type Props = {};

function RootNavigator({}: Props) {
  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName={homeName}
        screenOptions={({ route }: any) => ({
          tabBarStyle: styles.tabBar,
          tabBarIcon: ({ focused, color, size }: any) => {
            let iconName;
            let rn = route.name;
            color = colors.primary;

            if (rn === homeName) {
              iconName = focused ? "home" : "home-outline";
            } else if (rn === profileName) {
              iconName = focused ? "person" : "person-outline";
            } else if (rn === addName) {
              iconName = focused ? "add-circle" : "add-circle-outline";
            } else {
              iconName = "";
            }

            return <IonIcons name={iconName} size={40} color={color} />;
          },
        })}
      >
        <Tab.Screen
          name={homeName}
          component={HomeNavigation}
          options={{
            tabBarShowLabel: false,
            headerShown: false,
          }}
        ></Tab.Screen>
        <Tab.Screen
          name={addName}
          component={AddScreen}
          options={{
            tabBarShowLabel: false,
            headerShown: false,
          }}
        ></Tab.Screen>
        <Tab.Screen
          name={profileName}
          component={ProfileScreen}
          options={{
            tabBarShowLabel: false,
            headerShown: false,
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

export default RootNavigator;
