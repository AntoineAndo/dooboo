import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Button } from "react-native-paper";
import { useAppState } from "../../../../providers/AppStateProvider";

type Props = {
  navigation: any;
};

function AddScreen4({ navigation }: Props) {
  const onSubmit = () => {
    navigation.replace("Navbar");
  };

  return (
    <View>
      <View style={styles.contentView}>
        <Button
          mode="contained"
          onPress={() => {
            onSubmit();
          }}
        >
          Go to Homepage
        </Button>
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
