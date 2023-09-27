import React from "react";
import PageComponent from "../../components/PageComponent";
import { useQuery } from "@tanstack/react-query";
import { downloadImages, getProducts } from "../../lib/supabase";
import { Image, StyleSheet, View } from "react-native";
import colors from "../../config/colors";
import T from "../../components/T";
import spacing from "../../config/spacing";
import fontSizes from "../../config/fontSizes";
import ButtonComponent from "../../components/ButtonComponent";
import { useTranslation } from "../../hooks/translation";
import { CommonActions } from "@react-navigation/native";

type Props = {
  route: any;
  navigation: any;
};

function AddInfoScreen({ route, navigation }: Props) {
  const { translate } = useTranslation();

  let productInitialData = route.params.product;

  // Product data query
  const { data: product } = useQuery({
    queryKey: ["product", productInitialData.id],
    queryFn: () => {
      const searchQuery = {
        id: productInitialData.id,
      };
      return getAllProductsData(searchQuery);
    },
    select: (data: any): any => {
      return data;
    },
    initialData: productInitialData,
  });

  const getAllProductsData = async (searchQuery: any): Promise<any> => {
    return new Promise((res, rej) => {
      getProducts(searchQuery).then(async (data: Array<any>) => {
        //Get the primary image for this product
        //Then download the publicUrl
        let images = await downloadImages([
          data[0].product_image.find((pi: any) => pi.main == true).image_url,
        ]);

        res({
          ...data[0],
          images,
        });
      });
    });
  };

  const goBackToPreviousScreen = () => {
    let filteredRoutes = navigation.getState().routes.filter((r: any) => {
      return r?.params?.oneWay != true;
    });

    if (filteredRoutes.length != 0) {
      let action = CommonActions.reset({
        index: filteredRoutes.length,
        routes: filteredRoutes,
      });

      return navigation.dispatch(action);
    } else {
      return navigation.navigate({
        name: "Home",
        key: 0,
      });
    }
  };

  return (
    <PageComponent withNavbar={false}>
      <View style={styles.content}>
        <Image
          source={{
            uri:
              product.images != undefined
                ? product.images[0].publicUrl
                : undefined,
          }}
          style={styles.image}
        />
        <T style={styles.productName}>{product.name}</T>
        <T>{product.brand.name_ori}</T>
        <View style={styles.card}>
          <T style={{ color: "black", fontFamily: "Milliard-Medium" }}>
            {translate("no_submit_label")}
          </T>
          <T style={{ color: "black" }}>{product.justification}</T>
        </View>
      </View>
      <ButtonComponent
        style={styles.button}
        onPress={() => goBackToPreviousScreen()}
      >
        {translate("contribution_back_homepage")}
      </ButtonComponent>
    </PageComponent>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.s3,
  },
  image: {
    height: 200,
    width: 200,
    borderWidth: 1,
    borderColor: colors.grey,
    borderRadius: 25,
  },
  productName: {
    fontFamily: "Milliard-Medium",
    fontSize: fontSizes.label,
    marginTop: spacing.s1,
  },
  card: {
    backgroundColor: colors.lightred,
    padding: spacing.s3,
    marginTop: spacing.s3,
    borderRadius: 25,
  },
  button: {
    margin: spacing.s3,
  },
});

export default AddInfoScreen;
