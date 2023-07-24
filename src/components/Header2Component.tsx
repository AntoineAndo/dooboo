import React, { useState } from "react";
import { Pressable, StyleSheet, View, Animated } from "react-native";
import T from "./T";
import commonStyles from "../config/stylesheet";
import IonIcons from "react-native-vector-icons/Ionicons";
import spacing from "../config/spacing";
import { useNavigation } from "@react-navigation/native";
import LogoComponent from "./LogoComponent";

type Props = {
  showBackButton?: boolean;
  title: string;
  subtitle?: string;
  showLogo?: boolean;
  scrollOffset: any;
  customSubHeaderComponent?: any;
  rightActionComponent?: any;
};

function Header2Component({
  title,
  subtitle = "",
  showBackButton = false,
  showLogo = false,
  scrollOffset,
  customSubHeaderComponent,
  rightActionComponent,
}: Props) {
  const navigation = useNavigation<any>();
  const [state, setState] = useState(0);

  const styles = StyleSheet.create({
    logoContainer: {
      flex: 1,
      justifyContent: "center",
      width: "100%",
      display: "flex",
      flexDirection: "column",
    },
    logo: {
      alignSelf: "center",
      width: 50,
    },
    title: {
      marginTop: showLogo ? spacing.s2 : 0,
      color: "white",
    },
    backAction: {
      position: "absolute",
      zIndex: 10,
      top: 0,
      left: spacing.s3,
      aspectRatio: 1,
      height: 35,
      fontSize: 35,
      fontWeight: "700",
      marginTop: 5,
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    subtitle: {
      color: "white",
      textAlign: "center",
    },
  });

  let logoOpacity, textMargin;
  if (showLogo && scrollOffset) {
    logoOpacity = scrollOffset.interpolate({
      inputRange: [0, 200],
      outputRange: [1, 0],
      extrapolate: "clamp",
    });

    textMargin = scrollOffset.interpolate({
      inputRange: [0, 200],
      outputRange: [0, 120],
      extrapolate: "clamp",
    });
  }

  return (
    <View style={[styles.logoContainer]}>
      <View
        style={{
          display: "flex",
        }}
      >
        {showBackButton && (
          <Pressable
            onPress={() => {
              navigation.goBack();
            }}
            style={[styles.backAction]}
          >
            <IonIcons name={"arrow-back-outline"} color={"white"} size={35} />
          </Pressable>
        )}
        {showLogo && (
          <LogoComponent style={styles.logo} logoOpacity={logoOpacity} />
        )}
        {rightActionComponent && rightActionComponent}
        <Animated.View
          style={{
            marginBottom: textMargin,
          }}
        >
          <T style={[commonStyles.title, styles.title]}>{title}</T>
        </Animated.View>
        {subtitle != "" && <T style={styles.subtitle}>{subtitle}</T>}
        {customSubHeaderComponent && customSubHeaderComponent}
      </View>
    </View>
  );
}

export default Header2Component;
