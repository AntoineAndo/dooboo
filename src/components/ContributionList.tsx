import { useQuery } from "@tanstack/react-query";
import React from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import IonIcons from "react-native-vector-icons/Ionicons";
import { deleteContribution, getContributions } from "../lib/supabase";
import { useAuth } from "../providers/AuthProvider";
import Contribution from "../types/Contribution";
import Store from "../types/Store";

type Props = {
  contributions: Contribution[];
};

function ContributionList({ contributions }: Props) {
  const { auth } = useAuth();

  let initialContributions = contributions as any;

  const {
    isLoading,
    isError,
    data: contributionList,
    refetch,
  } = useQuery({
    queryKey: ["contributions_" + auth.user?.id],
    queryFn: () => {
      if (auth.user != undefined) {
        return getContributions(auth.user.id);
      }
    },
    initialData: initialContributions,
  });

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
            });
          },
        },
      ]
    );
  };

  return (
    <View>
      {contributionList.map((c: any) => {
        return (
          <View style={styles.item} key={c.product.id}>
            <View style={styles.itemFields}>
              <Text style={styles.name}>{c.product.name}</Text>
              <Text> - </Text>
              <Text>{c.store.name}</Text>
            </View>
            <View>
              <IonIcons
                name={"trash-outline"}
                style={styles.icon}
                size={20}
                onPress={() => _deleteContribution(c)}
              />
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  list: {},
  item: {
    display: "flex",
    flexDirection: "row",
    borderWidth: 1,
    height: 40,
    alignItems: "center",
    paddingHorizontal: 10,
    justifyContent: "space-between",
  },
  itemFields: {
    display: "flex",
    flexDirection: "row",
  },
  name: {
    fontWeight: "bold",
  },
  icon: {},
});

export default ContributionList;
