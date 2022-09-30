import { StyleSheet, Platform, StatusBar } from "react-native";
import { useDimensions } from "@react-native-community/hooks";
import MainContainer from "./src/MainContainer";

export default function App() {
  return <MainContainer />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
});
