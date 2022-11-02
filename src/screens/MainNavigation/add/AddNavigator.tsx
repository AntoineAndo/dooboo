import React from "react";

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AddScreen from "./AddStep1/AddScreen";
import AddScreen2 from "./AddStep2/AddScreen2";
import AddScreen3 from "./AddStep3/AddScreen3";
import AddScreen4 from "./AddStep4/AddScreen4";

//Screen imports

const Stack = createNativeStackNavigator();

type Props = {
  navigation: object;
};

function AddNavigator({ navigation }: Props) {
  return (
    <Stack.Navigator
      initialRouteName="AddStep1"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="AddStep1" component={AddScreen} options={{}} />
      <Stack.Screen name="AddStep2" component={AddScreen2} options={{}} />
      <Stack.Screen name="AddStep3" component={AddScreen3} options={{}} />
      <Stack.Screen name="AddStep4" component={AddScreen4} />
    </Stack.Navigator>
  );
}

export default AddNavigator;
