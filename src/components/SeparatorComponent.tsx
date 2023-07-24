import React from "react";
import { View } from "react-native";

type Props = {
  style?: any;
};

function SeparatorComponent({ style }: Props) {
  return (
    <View
      style={[
        {
          width: "100%",
          borderBottomWidth: 1,
          borderColor: "lightgrey",
          marginBottom: 10,
        },
        style,
      ]}
    ></View>
  );
}

export default SeparatorComponent;
