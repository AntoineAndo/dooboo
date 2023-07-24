import React from "react";
import { StyleSheet, Pressable } from "react-native";
import colors from "../config/colors";
import fontSizes from "../config/fontSizes";
import T from "./T";
import commonStyles from "../config/stylesheet";

type Props = {
  onPress?: Function;
  onLongPress?: Function;
  children: any;
  disabled?: boolean;
  type?: "primary" | "secondary" | "warning";
  style?: any;
  textStyle?: any;
  slim?: boolean;
  accessibilityHint?: string;
  accessibilityLabel?: string;
};

function ButtonComponent({
  onPress,
  onLongPress,
  children,
  disabled = false,
  type = "primary",
  style,
  textStyle,
  slim,
  accessibilityLabel,
  accessibilityHint,
}: Props) {
  const styles = StyleSheet.create({
    button: {
      borderRadius: 25,
      height: !slim ? 50 : 40,
      minWidth: 100,
      // paddingTop: !slim ? 0 : 0,
      padding: 0,
      opacity: !disabled ? 1 : 0.3,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
    primary: {
      backgroundColor: colors.primary,
      borderWidth: 1,
      borderColor: colors.primary,
      text: {
        color: "white",
      },
    },
    secondary: {
      backgroundColor: "white",
      borderWidth: 1,
      borderColor: colors.lightgrey,
      text: {
        color: colors.primary,
      },
    },
    warning: {
      backgroundColor: "white",
      borderWidth: 1,
      borderColor: "red",
      text: {
        color: "red",
      },
    },
    text: {
      fontSize: !slim ? fontSizes.p : 14,
      fontFamily: "Milliard-Medium",
    },
  });

  if (onLongPress) {
    return (
      <Pressable
        onPress={() => onLongPress()}
        disabled={disabled}
        style={[
          styles.button,
          styles[type],
          type == "primary" && !disabled
            ? { ...commonStyles.elevation2 }
            : null,
          style,
        ]}
        accessible={true}
        accessibilityLabel={accessibilityLabel ?? children}
        accessibilityRole="button"
        accessibilityHint={accessibilityHint}
      >
        <T style={[styles.text, styles[type].text, textStyle]}>{children}</T>
      </Pressable>
    );
  } else if (onPress) {
    return (
      <Pressable
        onPress={() => {
          onPress();
        }}
        disabled={disabled}
        style={[
          styles.button,
          styles[type],
          type == "primary" && !disabled
            ? { ...commonStyles.elevation2 }
            : null,
          style,
        ]}
      >
        <T style={[styles.text, styles[type].text, textStyle]}>{children}</T>
      </Pressable>
    );
  } else {
    return (
      <Pressable
        disabled={disabled}
        style={[styles.button, styles[type], style]}
      >
        <T style={[styles.text, styles[type].text, textStyle]}>{children}</T>
      </Pressable>
    );
  }
}

export default ButtonComponent;
