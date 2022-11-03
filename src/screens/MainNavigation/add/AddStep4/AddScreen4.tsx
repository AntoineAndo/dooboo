import { CommonActions, useNavigation } from "@react-navigation/native";
import React from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import { useAppState } from "../../../../providers/AppStateProvider";

function AddScreen4() {
  const navigation = useNavigation();
  const onSubmit = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: "Navbar" }],
      })
    );
  };

  return (
    <View>
      <View style={styles.contentView}>
        <Button
          onPress={() => {
            onSubmit();
          }}
          title="Go to Homepage"
        ></Button>
        {/* <Button
        
          mode="contained"
          onPress={() => {
            onSubmit();
          }}
        >
          Go to Homepage
        </Button> */}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  contentView: {
    paddingHorizontal: 26,
  },
});

export default AddScreen4;
