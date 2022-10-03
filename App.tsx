import { StyleSheet, Platform, StatusBar } from "react-native";
import { useDimensions } from "@react-native-community/hooks";
import RootNavigator from "./src/screens/RootNavigator";

export default function App() {
  return <RootNavigator />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
});
