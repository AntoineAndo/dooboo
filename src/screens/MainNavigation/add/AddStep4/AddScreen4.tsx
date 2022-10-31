import React from "react";
import { View, Text, StyleSheet, Button } from "react-native";
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
