import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Image, Pressable, StyleSheet, View } from "react-native";
import fontSizes from "../config/fontSizes";
import IonIcons from "react-native-vector-icons/Ionicons";
import T from "../components/T";
import colors from "../config/colors";
import { downloadImages } from "../lib/supabase";
import spacing from "../config/spacing";
import CheckboxComponent from "./CheckboxComponent";

type MenuItemProps = {
  title: string;
  icon?: string;
  onPress: Function;
  imageUrl?: string;
  imageSrc?: any;
  checkbox?: boolean;
  checked?: boolean;
  onCheck?: Function;
  showArrow?: boolean;
  style?: any;
  imageStyle?: any;
  accessibilityLabel: string;
  accessibilityHint: string;
  dropdownIcon?: string;
  isOpen?: boolean;
};

export function MenuItem({
  title,
  icon,
  onPress,
  imageUrl,
  imageSrc,
  checkbox,
  checked,
  onCheck,
  showArrow = true,
  style,
  imageStyle,
  accessibilityHint,
  accessibilityLabel,
  dropdownIcon,
  isOpen = false,
}: MenuItemProps) {
  //Download the image
  const {
    isLoading,
    isError,
    data: image,
    error,
  } = useQuery(
    [imageUrl],
    //@ts-ignore
    () => downloadImages([imageUrl]),
    {
      enabled: imageUrl != undefined,
      select: (data: any) => {
        const url = data[0].publicUrl;
        return url;
      },
    }
  );
  return (
    <Pressable
      style={[styles.item, style]}
      onPress={() => onPress()}
      accessible={true}
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={accessibilityHint}
    >
      <View style={styles.itemContent}>
        {dropdownIcon && (
          <IonIcons
            name={dropdownIcon}
            style={styles.icon}
            size={22}
            color={colors.darkgrey}
            accessible={false}
          />
        )}
        {icon && (
          <IonIcons
            name={icon}
            style={styles.icon}
            size={22}
            color={colors.darkgrey}
            accessible={false}
          />
        )}
        {imageUrl && (
          <View style={styles.imageContainer} accessible={false}>
            {imageUrl && (
              <Image
                source={{ uri: image }}
                style={[styles.image, imageStyle]}
              />
            )}
          </View>
        )}
        {imageSrc && (
          <View style={styles.imageContainer} accessible={false}>
            <Image source={imageSrc} style={[styles.image, imageStyle]} />
          </View>
        )}
        <T style={styles.text}>{title}</T>
      </View>
      {checkbox ? (
        <CheckboxComponent
          checked={checked}
          onPress={() => {
            if (onCheck) {
              onCheck();
            }
          }}
        />
      ) : (
        showArrow && <T style={{ fontSize: 24 }}>{"›"}</T>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  item: {
    height: 75,
    paddingHorizontal: 10,
    display: "flex",
    alignItems: "center",
    flexDirection: "row",
  },
  itemContent: {
    flex: 1,
    flexDirection: "row",
    height: "100%",
    alignItems: "center",
    paddingVertical: spacing.s1,
  },
  icon: {
    paddingRight: 10,
  },
  imageContainer: {
    height: 50,
    width: 50,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    // backgroundColor: colors.lightgrey,
  },
  image: {
    height: "75%",
    width: "75%",
    resizeMode: "cover",
  },
  text: {
    fontSize: fontSizes.label,
    marginLeft: spacing.s1,
    flex: 1,
  },
});
