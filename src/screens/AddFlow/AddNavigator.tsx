import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import { useAuth } from "../../providers/AuthProvider";
import AddScreen from "./AddScreen";
import AddScreen2 from "./AddScreen2";
import AddScreen3 from "./AddScreen3";
import AddScreen4 from "./AddScreen4";

type Props = {};

const Stack = createNativeStackNavigator();

function AddNavigator({}: Props) {
  const { auth } = useAuth();
  console.log(auth);

  const [shouldHide, setShouldHide] = React.useState(false);

  return shouldHide ? null : (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {auth.session != undefined && (
        <>
          <Stack.Screen name="AddStep1" component={AddScreen} options={{}} />
          <Stack.Screen name="AddStep2" component={AddScreen2} options={{}} />
          <Stack.Screen name="AddStep3" component={AddScreen3} options={{}} />
          <Stack.Screen name="AddStep4" component={AddScreen4} />
        </>
      )}
    </Stack.Navigator>
  );
}

export default AddNavigator;
