import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import { useAuth } from "../../../providers/AuthProvider";
import AuthenticationScreen from "./authentication/AuthenticationScreen";
import MyContributionsScreen from "./MyContributionsScreen";
import ProfileHomeScreen from "./ProfileHomeScreen";

type Props = {
  route: any;
};

const Stack = createNativeStackNavigator();

function ProfileNavigation({ route }: Props) {
  console.log(route.params);

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
