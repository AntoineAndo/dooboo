import React from "react";
import { Image, View } from "react-native";

type Props = {
  style?: any;
  imageStyle?: any;
};

function SpinnerComponent({ style, imageStyle }: Props) {
  return (
    <View style={[{ alignSelf: "center" }, style]}>
      <Image
        source={require("assets/loader.gif")}
        style={[
          {
            height: 60,
            width: 60,
          },
          imageStyle,
        ]}
      />
    </View>
  );
}

export default SpinnerComponent;
