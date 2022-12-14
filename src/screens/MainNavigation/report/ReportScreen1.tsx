import { useQuery } from "@tanstack/react-query";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Checkbox } from "react-native-paper";
import HeaderComponent from "../../../components/HeaderComponent";
import { useTranslation } from "../../../hooks/translation";
import { getReportCategories } from "../../../lib/supabase";

type Props = {};

function ReportScreen1({}: Props) {
  const [checkedCategoryId, setCheckedCategoryId] = React.useState<
    number | undefined
  >(undefined);
  const t = useTranslation();
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

  if (isError) {
    return <Text>ERROR</Text>;
  }

  return (
    <View style={styles.page}>
      {isLoading ? (
        <Text>Loading...</Text>
      ) : (
        <>
          <HeaderComponent
            title={"Why are you reporting this product"}
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
                  <Checkbox
                    status={
                      checkedCategoryId == category.id ? "checked" : "unchecked"
                    }
                  />
                  <Text>
                    {t.t(
                      "<report_categories></report_categories>." + category.code
                    )}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    position: "relative",
  },
  header: {
    marginTop: 10,
  },
  contentView: {
    paddingHorizontal: 26,
    marginBottom: 80,
  },
  categoryItem: {
    flex: 1,
    flexDirection: "row",
  },
});

export default ReportScreen1;
