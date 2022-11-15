import { useQuery } from "@tanstack/react-query";
import React from "react";
import { Text, View } from "react-native";
import ContributionList from "../../../components/ContributionList";
import HeaderComponent from "../../../components/HeaderComponent";
import ListComponent from "../../../components/ListComponent";
import { getContributions } from "../../../lib/supabase";
import { useAuth } from "../../../providers/AuthProvider";

type Props = {};

function MyContributionsScreen({}: Props) {
  const { auth } = useAuth();

  const initialData: any[] = [];

  const {
    isLoading,
    isError,
    data: contributions,
    refetch,
  } = useQuery(
    ["contributions_" + auth.user?.id],
    () => {
      if (auth.user != undefined) {
        return getContributions(auth.user.id);
      }
    },
    {
      initialData: initialData,
    }
  );

  const displayContributions = () => {
    if (isLoading || contributions == undefined) {
      return <Text>Loading</Text>;
    }

    return <ContributionList contributions={contributions} />;
  };

  return (
    <View>
      <HeaderComponent title={"My contributions"} showBackButton={true} />
      <View>{displayContributions()}</View>
    </View>
  );
}

export default MyContributionsScreen;
