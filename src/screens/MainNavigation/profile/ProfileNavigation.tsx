import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import AuthenticationScreen from "./authentication/AuthenticationScreen";
import ProfileHomeScreen from "./ProfileHomeScreen";

type Props = {
  route: any;
};

const Stack = createNativeStackNavigator();

function ProfileNavigation({ route }: Props) {
  console.log(route.params);
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
      <Stack.Screen
        name="Authentication"
        component={AuthenticationScreen}
        options={{}}
      />
    </Stack.Navigator>
  );
}

export default ProfileNavigation;
