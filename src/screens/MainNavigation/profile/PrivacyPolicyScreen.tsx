import { useQuery } from "@tanstack/react-query";
import React from "react";
import { ScrollView, StatusBar, StyleSheet, View } from "react-native";
import HeaderComponent from "../../../components/HeaderComponent";
import PageComponent from "../../../components/PageComponent";
import SpinnerComponent from "../../../components/SpinnerComponent";
import { getInformation } from "../../../lib/sanity";
import T from "../../../components/T";
import spacing from "../../../config/spacing";
import fontSizes from "../../../config/fontSizes";
import { useTranslation } from "../../../hooks/translation";

type Props = {};

function PrivacyPolicyScreen({}: Props) {
  const { translate } = useTranslation();
  const { isLoading, data } = useQuery({
    queryKey: ["privacy_policy"],
    queryFn: () => {
      return getInformation("privacy_policy");
    },
    select: (data) => {
      return data[0];
    },
  });

  return (
    <PageComponent style={styles.page} withNavbar={true}>
      <HeaderComponent
        title={translate("privacy_policy")}
        showBackButton={true}
      />
      {isLoading ? (
        <SpinnerComponent style={{ alignSelf: "center" }} />
      ) : (
        <ScrollView style={styles.scrollView}>
          {data.content.map((block: any, index: number) => {
            return (
              <T
                style={[
                  styles.text,
                  block.style == "h3" ? styles.heading : null,
                ]}
                key={index}
              >
                {block.children.map((children: any) => {
                  return children.text;
                })}
              </T>
            );
          })}
          <T></T>
          <T></T>
          <T></T>
        </ScrollView>
      )}
    </PageComponent>
  );
}

const styles = StyleSheet.create({
  page: {
    paddingTop: StatusBar.currentHeight,
  },
  scrollView: {
    height: 500,
    width: "100%",
    paddingHorizontal: spacing.s3,
  },
  text: {
    lineHeight: 20,
    textAlign: "justify",
  },
  heading: {
    fontFamily: "Milliard-Medium",
    fontSize: fontSizes.label,
    marginVertical: spacing.s1,
  },
});

export default PrivacyPolicyScreen;
