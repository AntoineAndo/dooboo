import React, { useEffect, useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";
import IonIcons from "react-native-vector-icons/Ionicons";
import colors from "../config/colors";
import { upsertRating } from "../lib/supabase";
import { useAppState } from "../providers/AppStateProvider";
import { useAuth } from "../providers/AuthProvider";
import Product from "../types/product";
import T from "./T";

type Props = {
  product: Product;
  onRatingChange?: Function;
};

function RatingsComponent({ product, onRatingChange }: Props) {
  const { auth } = useAuth();
  const { patchState } = useAppState();
  const [rating, setRating] = useState(0);

  useEffect(() => {
    if (
      auth.user == undefined ||
      !product.rating ||
      product.rating.length == 0
    ) {
      setRating(0);
    } else {
      let ur = product.rating.find(
        (rating: any) => rating.fk_user_id == auth.user?.id
      );

      setRating(ur?.rating ?? 0);
    }
  }, [product.rating]);

  const renderRatings = () => {
    let r = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        r.push(
          <IonIcons
            key={i}
            name="star"
            color={colors.darkgrey}
            size={24}
            onPress={() => updateRating(i)}
          />
        );
      } else {
        r.push(
          <IonIcons
            key={i}
            name="star-outline"
            color={colors.darkgrey}
            size={24}
            onPress={() => updateRating(i)}
          />
        );
      }
    }
    return r;
  };

  const updateRating = (rating: number) => {
    if (!auth.user) {
      return patchState("showAuthPop", true);
    }

    setRating(rating);

    upsertRating({
      user: auth.user,
      product: product,
      rating,
    }).then((data) => {
      if (onRatingChange) {
        onRatingChange();
      }
    });
  };

  return (
    <View style={styles.ratingsContainer}>
      <View style={styles.starsContainer}>{renderRatings()}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  ratingsContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  starsContainer: {
    display: "flex",
    flexDirection: "row",
  },
});

export default RatingsComponent;
