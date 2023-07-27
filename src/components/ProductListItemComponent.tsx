import React from "react";
import {
  GestureResponderEvent,
  Image,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import fontSizes from "../config/fontSizes";
import spacing from "../config/spacing";
import T from "./T";
import { useConfig } from "../providers/ConfigProvider";
import AnimatedLikeButtonComponent from "./AnimatedLikeButtonComponent";
import { useAuth } from "../providers/AuthProvider";
import { useAppState } from "../providers/AppStateProvider";
import { useQuery } from "@tanstack/react-query";
import { downloadImages } from "../lib/supabase";
import colors from "../config/colors";
import { useTranslation } from "../hooks/translation";
import IonIcons from "react-native-vector-icons/Ionicons";
import { brands } from "../utils/utils";
// import * as hangulRomanization from "hangul-romanization";

type Props = {
  product: any;
  onProductPress: Function;
  confirmProductInStore: Function;
  style?: any;
};

function ProductListItemComponent({
  product,
  onProductPress,
  confirmProductInStore,
  style,
}: Props) {
  const { config } = useConfig();
  const { translate } = useTranslation();
  const { auth } = useAuth();
  const { patchState } = useAppState();
  const [dayDiff, setDayDiff] = React.useState<number>(
    dateDiffInDays(new Date(product.last_seen), new Date())
  ); //The number of days between today and the last time this product was seen

  const [seenByUser, setSeenByUser] = React.useState<boolean>(
    dateDiffInDays(new Date(), new Date(product.last_seen_by_user)) == 0
  );

  console.log(product.last_seen_by_user);

  const {
    isLoading,
    isError,
    data: imageData,
    error,
  } = useQuery([product.product.main_image_url], () =>
    downloadImages([product.product.main_image_url])
  );

  // var romanization = hangulRomanization.convert("행복");

  const displayLastSeen = (diff: number) => {
    if (diff == 0) {
      return translate("last_seen_today");
    } else if (diff == 1) {
      return translate("last_seen_yesterday");
    } else {
      return `${translate("last_seen")} ${diff} ${translate("days_ago")}`;
    }
  };

  return (
    <Pressable
      style={[styles.listItem, style]}
      onPress={(e: GestureResponderEvent) => {
        e.preventDefault();
        onProductPress(product.product);
      }}
    >
      <View
        style={{
          flex: 1,
          flexDirection: "row",
        }}
      >
        <View style={styles.imageContainer}>
          {imageData && (
            <Image
              source={{ uri: imageData[0].publicUrl }}
              style={styles.image}
            />
          )}
        </View>
        <View
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-evenly",
            marginLeft: spacing.s2,
            flexShrink: 1,
            overflow: "hidden",
          }}
        >
          <View>
            <View style={styles.listHeader}>
              <T style={styles.listName} numberOfLines={3}>
                {product.product.name}
              </T>
              <T>{brands(product, config.language_code)}</T>
            </View>
            {product.product.totalRating && (
              <T style={styles.averageRating}>
                {product.product.totalRating.toFixed(1)}
                <IonIcons
                  name="star"
                  color={colors.darkgrey}
                  size={fontSizes.p}
                />
              </T>
            )}
          </View>
          <T style={styles.listText}>{displayLastSeen(dayDiff)}</T>
        </View>
      </View>
      <View style={{ justifyContent: "center" }}>
        <AnimatedLikeButtonComponent
          pressed={seenByUser}
          onPress={(e: GestureResponderEvent, cb: Function) => {
            if (auth.user == undefined) {
              //If not connected then show the auth popup
              return patchState("showAuthPop", true);
            }
            cb();
            //Else confirm finding today
            setDayDiff(0);
            setSeenByUser(true);
            confirmProductInStore(product.product);
          }}
        />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  listItem: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    padding: spacing.s2,
    // paddingHorizontal: spacing.s2,
    borderWidth: 2,
    borderColor: colors.lightergrey,
    height: 110 + spacing.s2 * 2,
  },
  imageContainer: {
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  image: {
    height: 90,
    aspectRatio: 1,
    display: "flex",
    borderRadius: 5,
    backgroundColor: colors.lightgrey,
  },
  listHeader: {
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "baseline",
  },
  averageRating: {
    // marginLeft: spacing.s1,
  },
  listName: {
    fontFamily: "Milliard-Medium",
    fontSize: fontSizes.p,
    flexWrap: "wrap",
  },
  brand: {
    fontFamily: "Milliard-Regular",
  },
  listText: {
    fontSize: 14,
  },
});

const dateDiffInDays = (a: Date, b: Date) => {
  const _MS_PER_DAY = 1000 * 60 * 60 * 24;
  // Discard the time and time-zone information.
  const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
  const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

  return Math.floor((utc2 - utc1) / _MS_PER_DAY);
};

export default ProductListItemComponent;
