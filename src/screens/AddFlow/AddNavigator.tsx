import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import { useAuth } from "../../providers/AuthProvider";
import AddScreen from "./AddScreen";
import AddScreenStore from "./AddScreenStore";
import AddScreenImages from "./AddScreenImages";
import SuccessScreen from "./SuccessScreen";
import AddScreenCategories from "./AddScreenCategories";
import AddInfoScreen from "./AddInfoScreen";
import AddScreenStoreDetails from "./AddScreenStoreDetails";

type Props = {
  route: any;
};

const Stack = createNativeStackNavigator();

function AddNavigator({ route }: Props) {
  const { auth } = useAuth();

  const [shouldHide, setShouldHide] = React.useState(false);

  return shouldHide ? null : (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {auth.session != undefined && (
        <>
          <Stack.Screen
            name="AddStep1"
            component={AddScreen}
            options={{}}
            initialParams={{
              oneWay: true,
              store: route?.params?.store,
            }}
          />
          <Stack.Screen
            name="AddScreenCategories"
            component={AddScreenCategories}
            options={{
              animation: "slide_from_right",
            }}
            initialParams={{ oneWay: true }}
          />
          <Stack.Screen
            name="AddScreenStore"
            component={AddScreenStore}
            options={{
              animation: "slide_from_right",
            }}
            initialParams={{ oneWay: true }}
          />
          <Stack.Screen
            name="AddScreenStoreDetails"
            component={AddScreenStoreDetails}
            options={{
              animation: "slide_from_right",
            }}
            initialParams={{ oneWay: true }}
          />
          <Stack.Screen
            name="AddScreenImages"
            component={AddScreenImages}
            options={{
              animation: "slide_from_right",
            }}
            initialParams={{
              oneWay: true,
              type: "addition",
            }}
          />
          <Stack.Screen
            name="SuccessScreen"
            component={SuccessScreen}
            initialParams={{ oneWay: true }}
          />
          <Stack.Screen
            name="AddInfoScreen"
            component={AddInfoScreen}
            initialParams={{ oneWay: true }}
          />
        </>
      )}
    </Stack.Navigator>
  );
}

export default AddNavigator;
