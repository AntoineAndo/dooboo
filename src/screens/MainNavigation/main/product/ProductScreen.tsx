import React, { useCallback, useEffect, useMemo } from "react";
import {
  Image,
  Linking,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import IonIcons from "react-native-vector-icons/Ionicons";
import MapView, { Marker } from "react-native-maps";
import { useQuery } from "@tanstack/react-query";
import {
  downloadImages,
  getProductFindings,
  getProducts,
} from "../../../../lib/supabase";
import { useAuth } from "../../../../providers/AuthProvider";
import { useTranslation } from "../../../../hooks/translation";
import PageComponent from "../../../../components/PageComponent";
import T from "../../../../components/T";
import spacing from "../../../../config/spacing";
import fontSizes from "../../../../config/fontSizes";
import ImageView from "react-native-image-viewing";
import { ImageSource } from "react-native-image-viewing/dist/@types";
import ButtonComponent from "../../../../components/ButtonComponent";
import SeparatorComponent from "../../../../components/SeparatorComponent";

import * as Location from "expo-location";
import colors from "../../../../config/colors";
import { useAppState } from "../../../../providers/AppStateProvider";
import RatingsComponent from "../../../../components/RatingsComponent";
import commonStyles from "../../../../config/stylesheet";
import { useConfig } from "../../../../providers/ConfigProvider";
import { brands } from "../../../../utils/utils";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import MarkerComponent from "../../../../components/MarkerComponent";

type Props = {
  route: any;
  navigation: any;
};

function ProductScreen({ route, navigation }: Props) {
  let productInitialData = route.params.product;
  let initialMapRegion = route.params.mapRegion;

  let initialImageUrl = productInitialData.imageUrl;

  const { auth } = useAuth();
  const { config } = useConfig();
  const { patchState } = useAppState();
  const { translate } = useTranslation();

  const [findings, setFindings] = React.useState<any[]>([]);
  const [findingsLoading, setFindingsLoading] = React.useState(false);
  const [imageIndex, setImageIndex] = React.useState(0);
  const [carouselOpen, setCarouselOpen] = React.useState(false);
  const mapRef = React.useRef<any>(null);
  const [selectedStore, setSelectedStore] = React.useState<any>(undefined);
  const [isMapVisible, setIsMapVisible] = React.useState(true);
  const [mapRegion, setMapRegion] = React.useState<
    | {
        latitude: number;
        longitude: number;
        latitudeDelta: number;
        longitudeDelta: number;
      }
    | undefined
  >({
    latitude: initialMapRegion.latitude,
    longitude: initialMapRegion.longitude,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  });

  // const isFocused = useIsFocused();
  // useEffect(() => {
  //   refetchProduct();
  // }, [isFocused]);

  // useFocusEffect(
  //   useCallback(() => {
  //     // refetchProduct();
  //     if (!isMapVisible) {
  //       setIsMapVisible(true);
  //     }

  //     return () => {
  //       setIsMapVisible(false);
  //     };
  //   }, [])
  // );

  const getAllProductsData = async (searchQuery: any): Promise<any> => {
    return new Promise((res, rej) => {
      getProducts(searchQuery).then(async (data: Array<any>) => {
        let images = await downloadImages(
          data[0].product_image.map(
            (product_image: any) => product_image.image_url
          )
        );

        res({
          ...data[0],
          images,
        });
      });
    });
  };

  // Product data query
  const {
    isLoading,
    isError,
    data: product,
    refetch: refetchProduct,
  } = useQuery({
    queryKey: ["product", productInitialData.id],
    queryFn: () => {
      const searchQuery = {
        id: productInitialData.id,
      };
      return getAllProductsData(searchQuery);
    },
    initialData: productInitialData,
  });

  //Location permission
  React.useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        // setErrorMsg("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});

      setMapRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.1,
        longitudeDelta: 0.1,
      });
    })();
  }, []);

  //Calculate average rating of this product
  const averageRating = useMemo(() => {
    if (product.rating == undefined || product.rating.length == 0) {
      return undefined;
    }

    let average =
      product.rating.reduce((acc: number, next: any) => acc + next.rating, 0) /
      product.rating.length;

    return average;
  }, [product]);

  const openContribution = () => {
    //if the user is not authentified
    // then redirect to the login page
    if (auth.user == undefined) {
      patchState("showAuthPop", true);
      return;
    }
    navigation.navigate("Contribution", {
      form: {
        name: product.name,
        existingProduct: product,
      },
    });
  };

  const openImage = (index: number) => {
    setImageIndex(index);
    setCarouselOpen(true);
  };

  const closeCarousel = () => {
    setCarouselOpen(false);
  };

  const getFindings = () => {
    if (mapRef.current === null) {
      return;
    }
    mapRef.current
      .getMapBoundaries()
      .then((res: any) => {
        const min_lat =
          res.northEast.latitude > res.southWest.latitude
            ? res.southWest.latitude
            : res.northEast.latitude;
        const min_long =
          res.northEast.longitude > res.southWest.longitude
            ? res.southWest.longitude
            : res.northEast.longitude;

        const max_lat =
          res.northEast.latitude > res.southWest.latitude
            ? res.northEast.latitude
            : res.southWest.latitude;
        const max_long =
          res.northEast.longitude > res.southWest.longitude
            ? res.northEast.longitude
            : res.southWest.longitude;

        setFindingsLoading(true);

        getProductFindings({
          productId: product.id,
          min_lat,
          min_long,
          max_lat,
          max_long,
        })
          .then((data) => {
            //Extract latitude and longitude from location field
            data = data.map((finding: any) => {
              finding.lat = finding.location.match(/(\d+\.\d+)/g)[1];
              finding.lng = finding.location.match(/(\d+\.\d+)/g)[0];

              return finding;
            });

            setFindings(data);
          })
          .catch((e) => {
            console.error(e);
          })
          .finally(() => {
            setFindingsLoading(false);
          });
      })
      .catch((err: any) => console.log(err));
  };

  const openStoreInMapApp = () => {
    const scheme = Platform.select({
      ios: "maps:0,0?q=",
      android: "geo:0,0?q=",
    });
    const latLng = `${selectedStore.lat},${selectedStore.lng}`;
    const label = selectedStore.name;
    const url = Platform.select({
      ios: `${scheme}${label}@${latLng}`,
      android: `${scheme}${latLng}(${label})`,
    });

    if (url) Linking.openURL(url);
  };

  return (
    <PageComponent style={styles.page}>
      <StatusBar
        translucent
        backgroundColor={"transparent"}
        barStyle={"dark-content"}
      />
      {product.images != undefined && (
        <ImageView
          images={
            product.images.map((image: any) => {
              return { uri: image.publicUrl };
            }) as ImageSource[]
          }
          imageIndex={imageIndex}
          visible={carouselOpen}
          onRequestClose={() => closeCarousel()}
          doubleTapToZoomEnabled={true}
          presentationStyle={"overFullScreen"}
          FooterComponent={() => {
            if (product.brand != undefined) {
              return (
                <View>
                  <T
                    style={{
                      width: "100%",
                      color: "white",
                      textAlign: "center",
                      marginBottom: 60,
                      paddingLeft: spacing.s3,
                      fontSize: fontSizes.label,
                      fontFamily: "Milliard-Medium",
                    }}
                  >
                    {product.name}
                  </T>
                </View>
              );
            }
            return <></>;
          }}
        />
      )}

      {/* FIXED BUTTONS */}
      <TouchableOpacity
        onPress={() => {
          if (navigation.canGoBack()) {
            navigation.goBack();
          } else {
            navigation.navigate("HomeScreen");
          }
        }}
        style={styles.backButton}
      >
        <IonIcons name={"arrow-back-outline"} size={30} />
      </TouchableOpacity>
      {/* CONTENT */}
      <ScrollView>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            width: "100%",
            height: 250,
            overflow: "hidden",
            alignItems: "center",
          }}
        >
          <TouchableOpacity
            onPress={() => openImage(0)}
            style={{
              flexGrow: 3,
            }}
          >
            <Image
              source={{
                uri:
                  product.images != undefined
                    ? product.images[0].publicUrl
                    : initialImageUrl,
              }}
              style={styles.mainImage}
            />
          </TouchableOpacity>

          {product.images != undefined && (
            <View style={styles.imagesColumn}>
              {/* Loop over the 5 next images */}
              {product.images
                ?.slice(1, 4)
                .map((imageUrl: any, index: number) => {
                  return (
                    <TouchableOpacity
                      key={imageUrl.publicUrl}
                      style={styles.secondaryImageContainer}
                      onPress={() => openImage(index + 1)}
                    >
                      <Image
                        source={{
                          uri: imageUrl.publicUrl,
                        }}
                        style={styles.secondaryImage}
                      />
                      {index == 2 && product.images.length > 4 && (
                        <View style={styles.lastImageOverlay}>
                          <T style={styles.more}>
                            {" "}
                            {product.images.length - 4} {translate("more")}
                          </T>
                        </View>
                      )}
                    </TouchableOpacity>
                  );
                })}
            </View>
          )}
        </View>
        <View style={styles.content}>
          <View>
            <View style={styles.productHeadingRow}>
              <T style={styles.title}>{product.name}</T>
              {averageRating && (
                <View style={styles.averageRating}>
                  <T>{averageRating.toFixed(1)}</T>
                  <IonIcons
                    name="star"
                    color={colors.darkgrey}
                    size={fontSizes.p}
                    style={{
                      marginRight: spacing.s1,
                    }}
                  />
                  <T>({product.rating.length})</T>
                </View>
              )}
            </View>
            <T>{brands(product, config.language_code)}</T>
          </View>
          <RatingsComponent
            product={product}
            onRatingChange={() => refetchProduct()}
          />

          <View style={styles.categoriesContainer}>
            <T style={{ fontSize: fontSizes.label }}>
              {translate("categories")}
            </T>
            {product.product_category != undefined &&
              product.product_category.map((p_c: any) => {
                return (
                  <T key={p_c.category.id}> - {translate(p_c.category.code)}</T>
                );
              })}
          </View>
          <ButtonComponent
            onPress={() => openContribution()}
            style={{ marginVertical: spacing.s3 }}
          >
            {translate("i_found_product")}
          </ButtonComponent>

          <View style={styles.mapContainer}>
            {findingsLoading && (
              <View style={styles.findingsLoaderContainer}>
                <Image
                  source={require("assets/loader.gif")}
                  style={{
                    height: 60,
                    width: 60,
                  }}
                />
              </View>
            )}
            {isMapVisible && (
              <MapView //https://github.com/react-native-maps/react-native-maps/blob/master/docs/mapview.md
                style={styles.map}
                ref={mapRef}
                onMapReady={() => getFindings()}
                initialRegion={mapRegion}
                onRegionChangeComplete={(e) => {
                  getFindings();
                }}
                loadingEnabled={true}
                pitchEnabled={false}
                rotateEnabled={false}
                showsUserLocation={true}
                showsMyLocationButton={true}
                showsPointsOfInterest={false}
                toolbarEnabled={false}
                mapPadding={{
                  top: 0,
                  bottom: 5,
                  left: 5,
                  right: 0,
                }}
              >
                {findings.map((store: any, i: number) => {
                  return (
                    <MarkerComponent
                      lat={store.lat}
                      lng={store.lng}
                      key={store.id}
                      onPress={() => {
                        setSelectedStore(store);
                      }}
                      isSelected={selectedStore?.id == store.id}
                      color={
                        selectedStore?.id == store.id ? "red" : colors.lightred
                      }
                    />
                  );
                })}
              </MapView>
            )}
          </View>
          {selectedStore && (
            <Pressable
              style={styles.storeCard}
              onPress={() => openStoreInMapApp()}
            >
              <View style={commonStyles.flexRow}>
                <MaterialCommunityIcons
                  name={"map-marker"}
                  color={"red"}
                  size={22}
                />
                <T style={styles.storeText}>{selectedStore.name}</T>
              </View>
              <IonIcons
                name="navigate-circle-outline"
                color={colors.darkgrey}
                size={24}
              />
            </Pressable>
          )}
          <SeparatorComponent style={{ marginVertical: spacing.s3 }} />
          <TouchableOpacity
            style={{ flex: 1, flexDirection: "row" }}
            onPress={() => navigation.navigate("Report", { product: product })}
          >
            <IonIcons name={"flag-outline"} size={20} />
            <T style={{ marginLeft: spacing.s1 }}>
              {translate("report_product")}
            </T>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </PageComponent>
  );
}

const styles = StyleSheet.create({
  page: {
    paddingBottom: 20,
  },
  mainImage: {
    height: 300,
    resizeMode: "cover",
  },
  imagesColumn: {
    flex: 1,
    flexGrow: 1,
    flexDirection: "column",
    height: "100%",
    backgroundColor: colors.lightgrey,
  },
  secondaryImageContainer: {
    flex: 1,
    maxHeight: "34%",
    alignItems: "center",
    width: "100%",
    position: "relative",
  },
  secondaryImage: {
    width: "100%",
    flex: 1,
    resizeMode: "cover",
  },
  lastImageOverlay: {
    backgroundColor: "#00000099",
    height: "100%",
    width: "100%",
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: 9,
    justifyContent: "center",
    alignItems: "center",
  },
  more: {
    color: "white",
    fontSize: fontSizes.p,
  },
  productHeadingRow: {
    display: "flex",
    flexDirection: "row",
    alignItems: "baseline",
  },
  title: {
    fontSize: fontSizes.h1,
    fontFamily: "Milliard-Medium",
    // marginBottom: spacing.s1,
  },
  averageRating: {
    paddingLeft: spacing.s2,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  star: {
    display: "flex",
    marginHorizontal: spacing.s2,
  },
  content: {
    padding: spacing.s3,
  },
  mapContainer: {
    height: 300,
    borderRadius: 25,
    overflow: "hidden",
    position: "relative",
  },
  findingsLoaderContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: 50,
    zIndex: 999,
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
  },
  map: {
    height: "100%",
    width: "100%",
  },
  backButton: {
    backgroundColor: "white",
    borderRadius: 20,
    position: "absolute",
    top: 25,
    left: 25,
    zIndex: 5,
    padding: 5,
  },
  storeCard: {
    marginTop: spacing.s3,
    paddingVertical: spacing.s2,
    paddingHorizontal: spacing.s3,
    borderRadius: 25,
    // borderColor: colors.darkgrey,
    // borderWidth: 1,
    backgroundColor: colors.lightergrey,
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    ...commonStyles.elevation2,
  },
  storeText: {
    color: colors.darkgrey,
    fontFamily: "Milliard-Bold",
    marginLeft: spacing.s1,
  },
  categoriesContainer: {
    marginVertical: spacing.s3,
  },
});

export default ProductScreen;
