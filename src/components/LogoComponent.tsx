import React from "react";
import { Animated, View } from "react-native";

type Props = {
  style?: any;
  logoOpacity?: any;
};

function LogoComponent({ style, logoOpacity }: Props) {
  return (
    <Animated.View
      style={[
        {
          width: 75,
          aspectRatio: 1,
          backgroundColor: "#fefff0",
          borderRadius: 5,
          transform: [{ rotate: "45deg" }],
          elevation: 3,
        },
        {
          opacity: logoOpacity ?? 1,
        },
        style,
      ]}
    ></Animated.View>
  );
}

export default LogoComponent;
