import React from "react";

import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import IonIcons from "react-native-vector-icons/Ionicons";

//Screen imports
import HomeScreen from "./screens/HomeScreen";
import ProfileScreen from "./screens/ProfileScreen";
import colors from "./config/colors";
import AddScreen from "./screens/AddScreen";

//Screen names
const homeName = "Home";
const profileName = "Profile";
const addName = "Add";

const Tab = createBottomTabNavigator();

type Props = {};

function MainContainer({}: Props) {
  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName={homeName}
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
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

            return <IonIcons name={iconName} size={30} color={color} />;
          },
        })}
      >
        <Tab.Screen
          name={homeName}
          component={HomeScreen}
          options={{
            tabBarShowLabel: false,
          }}
        ></Tab.Screen>
        <Tab.Screen
          name={addName}
          component={AddScreen}
          options={{
            tabBarShowLabel: false,
          }}
        ></Tab.Screen>
        <Tab.Screen
          name={profileName}
          component={ProfileScreen}
          options={{
            tabBarShowLabel: false,
          }}
        ></Tab.Screen>
      </Tab.Navigator>
    </NavigationContainer>
  );
}

export default MainContainer;
