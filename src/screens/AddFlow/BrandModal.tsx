import { useQuery } from "@tanstack/react-query";
import React from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { queryClient } from "../../../App";
import ButtonComponent from "../../components/ButtonComponent";
import InputComponent from "../../components/InputComponent";
import RadioComponent from "../../components/RadioComponent";
import SeparatorComponent from "../../components/SeparatorComponent";
import T from "../../components/T";
import spacing from "../../config/spacing";
import { useTranslation } from "../../hooks/translation";
import { getTopBrands, searchBrands } from "../../lib/supabase";
import { useConfig } from "../../providers/ConfigProvider";
import Brand from "../../types/Brand";
import { useFocusEffect } from "@react-navigation/native";
import { BackHandler } from "react-native";
import commonStyles from "../../config/stylesheet";
import fontSizes from "../../config/fontSizes";
import SpinnerComponent from "../../components/SpinnerComponent";

type Props = {
  closeModal: Function;
};

function BrandModal({ closeModal }: Props) {
  const translation = useTranslation();
  const [inputValue, setInputValue] = React.useState("");
  const [selectedBrand, setSelectedBrand] = React.useState<Brand>();
  const { config } = useConfig();
  const { translate } = useTranslation();

  ///([\u3131-\uD79D]*[0-9]*)/ugi
  //Korean alphabet regex

  const {
    isLoading,
    isError,
    data: brands,
    refetch,
    isFetching: isFetchingTopBrands,
  } = useQuery({
    queryKey: ["top_brands"],
    queryFn: () => {
      const searchQuery = {
        // id: productInitialData.id,
        countryId: config.countryId,
      };

      let brands = getTopBrands(searchQuery);
      return brands;
    },
    select: (data: any) => {
      if (data.length != 0) {
        data.length = 5;
        return data;
      }
      return [];
    },
    initialData: [],
  });

  const { data: result, isFetching: isFetchingBrands } = useQuery(
    ["brands", inputValue, config.countryId],
    searchBrands,
    {
      enabled: inputValue.length > 0,
    }
  );

  const onChange = (value: string) => {
    queryClient.invalidateQueries(["brands"]);
    setSelectedBrand(undefined);
    setInputValue(value);
  };

  const validateBrandAndCloseModal = (action: string) => {
    if (action == "cancel") {
      return closeModal(undefined);
    }

    return closeModal(selectedBrand);
  };

  return (
    <ScrollView
      contentContainerStyle={styles.modalView}
      keyboardShouldPersistTaps={"handled"}
    >
      {/* HEADER */}
      <View style={{ width: 250 }}>
        <T
          style={[
            commonStyles.bigText,
            { fontSize: fontSizes.h1, textAlign: "center" },
          ]}
        >
          {translate("brand_name_placeholder")}
        </T>
        <InputComponent
          onChangeText={(v: string) => onChange(v)}
          value={inputValue}
          placeholder={translate("product_brand_placeholder")}
        />
      </View>
      {isFetchingBrands || isFetchingBrands ? (
        <SpinnerComponent />
      ) : (
        <View style={{ width: "100%", flex: 1 }}>
          {inputValue.length == 0 &&
            brands?.map((brand: Brand, i: number) => {
              return (
                <View key={brand.id}>
                  <TouchableOpacity
                    style={styles.radioContainer}
                    onPress={() => setSelectedBrand(brand)}
                  >
                    <RadioComponent
                      checked={selectedBrand?.name_ori == brand.name_ori}
                      onPress={() => setSelectedBrand(brand)}
                    />
                    <T style={styles.radioLabel}>
                      {brand.name_ori} - {brand.name_rom}
                    </T>
                  </TouchableOpacity>

                  {i != brands.length - 1 && <SeparatorComponent />}
                </View>
              );
            })}
          {result?.map((brand: any, i: number) => {
            return (
              <View key={brand.id}>
                <TouchableOpacity
                  style={styles.radioContainer}
                  onPress={() => setSelectedBrand(brand)}
                >
                  <RadioComponent
                    checked={selectedBrand?.name_ori == brand.name_ori}
                    onPress={() => setSelectedBrand(brand)}
                  />
                  <T style={styles.radioLabel}>
                    {brand.name_ori} - {brand.name_rom}
                  </T>
                </TouchableOpacity>

                {i != result.length - 1 && <SeparatorComponent />}
              </View>
            );
          })}
          {result?.length == 0 && (
            <>
              <TouchableOpacity
                style={styles.radioContainer}
                onPress={() =>
                  setSelectedBrand({
                    id: undefined,
                    name_ori: inputValue?.trim(),
                    name_rom: inputValue?.trim(),
                    active: true,
                    insert: true,
                  })
                }
              >
                <RadioComponent
                  checked={selectedBrand?.name_rom == inputValue?.trim()}
                  onPress={() =>
                    setSelectedBrand({
                      id: undefined,
                      name_ori: inputValue?.trim(),
                      name_rom: inputValue?.trim(),
                      active: true,
                      insert: true,
                    })
                  }
                />
                <T style={styles.radioLabel}>{inputValue}</T>
              </TouchableOpacity>
            </>
          )}
        </View>
      )}

      {/* FOOTER */}
      <View style={styles.footer}>
        <ButtonComponent
          type="secondary"
          onPress={() => validateBrandAndCloseModal("cancel")}
        >
          {translate("cancel")}
        </ButtonComponent>
        <ButtonComponent
          onPress={() => validateBrandAndCloseModal("select")}
          disabled={selectedBrand == undefined}
        >
          {translate("select")}
        </ButtonComponent>
      </View>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  modalView: {
    position: "relative",
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 25,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 100,
    flex: 1,
  },
  radioContainer: {
    height: 40,
    display: "flex",
    alignItems: "center",
    paddingHorizontal: 10,
    flexDirection: "row",
  },
  radioLabel: {
    marginLeft: spacing.s1,
  },
  selected: {
    // backgroundColor: "lightgrey",
  },
  footer: {
    position: "absolute",
    padding: 20,
    bottom: 0,
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
});

export default BrandModal;
