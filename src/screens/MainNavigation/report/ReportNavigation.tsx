import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";

//Screen imports
import ReportScreen1 from "./ReportScreen1";

type Props = {};

const Stack = createNativeStackNavigator();

function ReportNavigation({}: Props) {
  const [shouldHide, setShouldHide] = React.useState(false);

  return shouldHide ? null : (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <>
        <Stack.Screen name="Report1" component={ReportScreen1} />
      </>
    </Stack.Navigator>
  );
}

export default ReportNavigation;
