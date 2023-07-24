import { useQuery } from "@tanstack/react-query";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import ButtonComponent from "../../../components/ButtonComponent";
import HeaderComponent from "../../../components/HeaderComponent";
import PageComponent from "../../../components/PageComponent";
import RadioComponent from "../../../components/RadioComponent";
import T from "../../../components/T";
import spacing from "../../../config/spacing";
import { useTranslation } from "../../../hooks/translation";
import { getReportCategories, submitReport } from "../../../lib/supabase";
import { useAppState } from "../../../providers/AppStateProvider";
import Product from "../../../types/product";

type Props = {
  navigation: any;
  route: any;
};

function ReportScreen1({ navigation, route }: Props) {
  const selectedProduct = route.params.product as Product;

  const app = useAppState();
  const [checkedCategoryId, setCheckedCategoryId] = React.useState<
    number | undefined
  >(undefined);
  const { translate } = useTranslation();
  const {
    isLoading,
    isError,
    data: categories,
    refetch,
  } = useQuery({
    queryKey: ["report_categories"],
    queryFn: () => {
      return getReportCategories();
    },
    initialData: [],
  });

  const handleCheck = (category: any) => {
    setCheckedCategoryId(category.id);
  };

  const onSubmit = () => {
    if (checkedCategoryId != undefined) {
      //Show the loading overlay
      app.patchState("isLoading", true);

      submitReport(selectedProduct.id, checkedCategoryId).then(
        ({ data, error }) => {
          //Show the loading overlay
          app.patchState("isLoading", false);
          if (error) {
            console.log(error);
          } else {
            navigation.replace("report2");
          }
        }
      );
    }
  };

  if (isError) {
    return <T>ERROR</T>;
  }

  return (
    <PageComponent withNavbar={false}>
      {isLoading ? (
        <T>Loading...</T>
      ) : (
        <>
          <HeaderComponent
            title={translate("report_prompt")}
            showBackButton={true}
          />
          <View style={styles.contentView}>
            {categories.map((category: any) => {
              return (
                <TouchableOpacity
                  style={styles.categoryItem}
                  key={category.id}
                  onPress={() => {
                    handleCheck(category);
                  }}
                >
                  <RadioComponent
                    checked={checkedCategoryId == category.id}
                    onPress={() => {
                      handleCheck(category);
                    }}
                  />
                  <T style={{ marginLeft: spacing.s1 }}>
                    {translate(category.code)}
                  </T>
                </TouchableOpacity>
              );
            })}
          </View>
        </>
      )}
      <View style={styles.footer}>
        <ButtonComponent onPress={() => navigation.goBack()} type="secondary">
          {translate("cancel")}
        </ButtonComponent>
        <ButtonComponent
          onPress={() => onSubmit()}
          style={{ fontFamily: "Milliard-Medium" }}
          disabled={checkedCategoryId == undefined}
        >
          {translate("next")}
        </ButtonComponent>
      </View>
    </PageComponent>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    position: "relative",
  },
  header: {
    marginTop: spacing.s2,
  },
  contentView: {
    paddingHorizontal: spacing.s3,
    marginBottom: 80,
    display: "flex",
  },
  categoryItem: {
    display: "flex",
    flexDirection: "row",
    marginVertical: spacing.s1,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    height: 60,
    zIndex: 999,
    width: "100%",
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    backgroundColor: "white",
  },
});

export default ReportScreen1;
