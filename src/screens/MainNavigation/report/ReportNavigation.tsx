import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";

//Screen imports
import ReportScreen1 from "./ReportScreen1";
import ReportScreen2 from "./ReportScreen2";

type Props = {
  route: any;
};

const Stack = createNativeStackNavigator();

function ReportNavigation({ route }: Props) {
  const [shouldHide, setShouldHide] = React.useState(false);

  const product = route.params.product;

  return shouldHide ? null : (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="report1"
    >
      <>
        <Stack.Screen
          name="report1"
          component={ReportScreen1}
          initialParams={route.params}
        />
        <Stack.Screen name="report2" component={ReportScreen2} />
      </>
    </Stack.Navigator>
  );
}

export default ReportNavigation;
