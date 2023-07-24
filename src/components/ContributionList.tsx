import { useNavigation } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { Alert, FlatList, StyleSheet, Text, View } from "react-native";
import IonIcons from "react-native-vector-icons/Ionicons";
import { queryClient } from "../../App";
import colors from "../config/colors";
import spacing from "../config/spacing";
import { deleteContribution, getContributions } from "../lib/supabase";
import { useAuth } from "../providers/AuthProvider";
import Contribution from "../types/Contribution";
import Product from "../types/product";
import SeparatorComponent from "./SeparatorComponent";
import T from "./T";

type Props = {
  contributions: any;
};

function ContributionList({ contributions }: Props) {
  const { auth } = useAuth();
  const navigation = useNavigation<any>();

  let initialContributions = contributions as any;

  const {
    isLoading,
    isError,
    data: contributionList,
    refetch,
  } = useQuery({
    queryKey: ["contributions", auth.user?.id],
    queryFn: () => {
      if (auth.user != undefined) {
        return getContributions({ userId: auth.user.id });
      }
    },
    initialData: initialContributions,
  });

  const openProduct = (product: Product) => {
    navigation.navigate("Product", { product });
  };

  const _deleteContribution = (contribution: Contribution) => {
    Alert.alert(
      "Confirm",
      "Are you sure you want to delete this contribution?",
      [
        {
          text: "Cancel",
          onPress: () => null,
          style: "cancel",
        },
        {
          text: "Yes",
          onPress: () => {
            if (auth.user == undefined) return;

            deleteContribution(
              contribution.fk_product_id,
              contribution.fk_store_id,
              auth.user
            ).then(() => {
              // refetch();
              queryClient.invalidateQueries(["contributions", auth.user?.id]);
            });
          },
        },
      ]
    );
  };

  return (
    <FlatList
      data={contributionList}
      contentContainerStyle={{
        padding: spacing.s3,
      }}
      renderItem={({ item, index }: any) => {
        return (
          <View key={item.product.id}>
            <View style={styles.item}>
              <View
                style={styles.itemFields}
                onTouchEnd={() => openProduct(item.product)}
              >
                <T style={styles.name}>{item.product.name}</T>
                <T>{item.store.name}</T>
              </View>
              <View>
                <IonIcons
                  name={"trash-outline"}
                  style={styles.icon}
                  size={20}
                  onPress={() => _deleteContribution(item)}
                />
              </View>
            </View>
            {index < contributionList.length - 1 && <SeparatorComponent />}
          </View>
        );
      }}
    ></FlatList>
  );
}

const styles = StyleSheet.create({
  list: {},
  item: {
    display: "flex",
    flexDirection: "row",
    minHeight: 40,
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: spacing.s1,
    justifyContent: "space-between",
    marginBottom: spacing.s1,
  },
  separator: {},
  itemFields: {
    display: "flex",
    flexDirection: "column",
    flexWrap: "wrap",
    flexShrink: 1,
  },
  name: {
    fontWeight: "bold",
  },
  icon: {},
});

export default ContributionList;
