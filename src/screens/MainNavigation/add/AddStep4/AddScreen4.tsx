import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Button } from "react-native-paper";

type Props = {
  route: any;
  navigation: any;
};

function AddScreen4({ route, navigation }: Props) {
  const onSubmit = () => {
    navigation.navigate("Home");
  };

  return (
    <View>
      <Text>OK</Text>

      <View style={styles.contentView}>
        <Button
          mode="contained"
          onPress={() => {
            onSubmit();
          }}
        >
          Next step
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
