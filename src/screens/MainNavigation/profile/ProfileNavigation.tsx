import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import { useAuth } from "../../../providers/AuthProvider";
import AuthenticationScreen from "./authentication/AuthenticationScreen";
import MyContributionsScreen from "./MyContributionsScreen";
import ProfileHomeScreen from "./ProfileHomeScreen";
import SettingsScreen from "./SettingsScreen";

type Props = {
  route: any;
};

const Stack = createNativeStackNavigator();

function ProfileNavigation({ route }: Props) {
  const { auth } = useAuth();

  return (
    <Stack.Navigator
      initialRouteName="ProfileHome"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen
        name="ProfileHome"
        component={ProfileHomeScreen}
        options={{}}
      />
      <Stack.Screen name="SettingsScreen" component={SettingsScreen} />
      {auth.session != undefined && (
        <Stack.Screen
          name="My Contributions"
          component={MyContributionsScreen}
          options={{}}
        />
      )}
      {auth.session == undefined && (
        <Stack.Screen
          name="Authentication"
          component={AuthenticationScreen}
          options={{}}
        />
      )}
    </Stack.Navigator>
  );
}

export default ProfileNavigation;
