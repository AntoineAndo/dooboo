import React from "react";
import { GestureResponderEvent, Pressable, StyleSheet } from "react-native";
import colors from "../config/colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

type Props = {
  onPress: Function;
  pressed: boolean;
};

function AnimatedLikeButtonComponent({ pressed, onPress }: Props) {
  const liked = useSharedValue(pressed ? 1 : 0);

  const styles = StyleSheet.create({
    button: {
      width: 30,
      height: 30,
    },
    animatedView: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
  });

  const outlineStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: interpolate(liked.value, [0, 1], [1, 0], Extrapolate.CLAMP),
        },
      ],
    };
  });

  const fillStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: liked.value,
        },
      ],
    };
  });

  const _onPress = (e: GestureResponderEvent) => {
    if (!pressed) {
      onPress(e, () => {
        liked.value = withSpring(1, {
          velocity: 100,
          damping: 100,
          mass: 1,
          stiffness: 1000,
        });
      });
    }
  };

  return (
    <Pressable style={styles.button} onPress={_onPress}>
      <Animated.View
        style={[
          styles.animatedView,
          StyleSheet.absoluteFillObject,
          outlineStyle,
        ]}
      >
        <MaterialCommunityIcons
          name={"thumb-up-outline"}
          size={25}
          color={colors.darkgrey}
        />
      </Animated.View>
      <Animated.View
        style={[styles.animatedView, StyleSheet.absoluteFillObject, fillStyle]}
      >
        <MaterialCommunityIcons
          name={"thumb-up"}
          size={25}
          color={colors.primary}
        />
      </Animated.View>
    </Pressable>
  );
}

export default AnimatedLikeButtonComponent;
