import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import { useAuth } from "../../../providers/AuthProvider";
import AccountPrivacyScreen from "./AccountPrivacyScreen";
import AccountScreen from "./AccountScreen";
import AuthenticationScreen from "./authentication/AuthenticationScreen";
import DeleteAccountConfirmationScreen from "./DeleteAccountConfirmationScreen";
import DeleteAccountScreen from "./DeleteAccountScreen";
import PrivacyPolicyScreen from "./PrivacyPolicyScreen";
import ProfileHomeScreen from "./ProfileHomeScreen";
import SettingsScreen from "./SettingsScreen";

type Props = {};

const Stack = createNativeStackNavigator();

function ProfileNavigation({}: Props) {
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
      <Stack.Screen
        name="SettingsScreen"
        component={SettingsScreen}
        options={{
          animation: "slide_from_right",
        }}
      />
      <Stack.Screen
        name="AccountPrivacyScreen"
        component={AccountPrivacyScreen}
        options={{
          animation: "slide_from_right",
        }}
      />
      <Stack.Screen
        name="PrivacyPolicyScreen"
        component={PrivacyPolicyScreen}
      />
      {auth.session != undefined && (
        <>
          <Stack.Screen
            name="AccountScreen"
            component={AccountScreen}
            options={{
              animation: "slide_from_right",
            }}
          />
          <Stack.Screen
            name="DeleteAccountScreen"
            component={DeleteAccountScreen}
          />
          <Stack.Screen
            name="DeleteAccountConfirmationScreen"
            component={DeleteAccountConfirmationScreen}
            options={{
              animation: "slide_from_right",
            }}
          />
        </>
      )}
      {auth.session == undefined && (
        <Stack.Screen
          name="Authentication"
          component={AuthenticationScreen}
          options={{
            animation: "slide_from_right",
          }}
        />
      )}
    </Stack.Navigator>
  );
}

export default ProfileNavigation;
