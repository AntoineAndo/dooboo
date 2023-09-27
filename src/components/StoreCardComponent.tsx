import React from "react";
import {
  Animated,
  Dimensions,
  Linking,
  Platform,
  Pressable,
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import colors from "../config/colors";
import fontSizes from "../config/fontSizes";
import spacing from "../config/spacing";
import T from "./T";

import commonStyles from "../config/stylesheet";
import { useQuery } from "@tanstack/react-query";
import { getContributions, linkProductStore } from "../lib/supabase";
import SpinnerComponent from "./SpinnerComponent";
import { useAuth } from "../providers/AuthProvider";
import { useAppState } from "../providers/AppStateProvider";
import ProductListItemComponent from "./ProductListItemComponent";
import { useTranslation } from "../hooks/translation";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import IonIcons from "react-native-vector-icons/Ionicons";
import { useConfig } from "../providers/ConfigProvider";

type Props = {
  store: any;
  style?: any;
  onPress?: any;
  isOpen: boolean;
  isSelected: boolean;
  onProductPress: Function;
  filter: "last" | "all";
  setFilter: Function;
};

const LIMIT_DAYS = 30;

function StoreCardComponent({
  store,
  style,
  onPress,
  isOpen,
  isSelected,
  onProductPress,
  filter,
  setFilter,
}: Props) {
  const { auth } = useAuth();
  const { config } = useConfig();
  const { patchState } = useAppState();
  const { translate } = useTranslation();
  const {
    data: products_in_store,
    isFetching,
    isRefetching,
    refetch,
  } = useQuery(
    ["products", store.id, auth?.user?.id],
    () => {
      return getContributions({
        storeId: store.id,
        userId: auth?.user?.id ?? "",
      });
    },
    {
      initialData: [],
      enabled: isSelected,
      select: (data: any): any => {
        let tempList: any = {};

        data.forEach((p: any) => {
          let o = tempList[p.product.id];
          if (o == undefined) {
            tempList[p.product.id] = p;
          } else {
            //If multiple occurence, then take only the latest one
            if (new Date(p.last_seen) > new Date(o.last_seen)) {
              tempList[p.product.id] = p;
            }
          }
        });

        //Sort by last_seen
        let filteredData = Object.values(tempList).sort((a: any, b: any) => {
          return new Date(a.last_seen) < new Date(b.last_seen) ? 1 : -1;
        });

        const lastWeek: Date = new Date();
        //One week ago
        lastWeek.setDate(lastWeek.getDate() - LIMIT_DAYS);

        //Filter and sort the product in the two filter array
        return {
          all: filteredData,
          last: filteredData.filter((item: any) => {
            const itemDate = new Date(item.last_seen);

            return itemDate.getTime() > lastWeek.getTime();
          }),
        };
      },
    }
  );

  const confirmProductInStore = (product: any) => {
    //If user is not logged in
    let user = auth.user;
    if (user == undefined) {
      return patchState("showAuthPop", true);
    }

    linkProductStore(product.id, store.id, user).then(({ data, error }) => {
      if (error == null) {
        refetch();
      }
    });
  };

  const screenHeight = Dimensions.get("screen").height;
  const windowHeight = Dimensions.get("window").height;
  const windowWidth = Dimensions.get("window").width;

  const statusBarHeight =
    StatusBar.currentHeight != undefined ? StatusBar.currentHeight : 0;

  const navbarHeight = screenHeight - windowHeight + statusBarHeight;

  const styles = StyleSheet.create({
    card: {
      backgroundColor: "white",
      borderRadius: 25,
      padding: spacing.s3,
      overflow: "hidden",
      ...commonStyles.elevation2,
    },
    header: {
      marginBottom: spacing.s2,
      display: "flex",
      flexDirection: "row",
      position: "relative",
    },
    name: {
      fontSize: fontSizes.h2,
      fontFamily: "Milliard-Bold",
      flex: 1,
      flexWrap: "wrap",
    },
    counterContainer: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
    },
    counter: {
      backgroundColor: colors.mint,
      margin: spacing.s1,
      borderRadius: 10,
      paddingVertical: spacing.s1,
      paddingHorizontal: spacing.s2,
      // minWidth: 100,
      flex: 1,
    },
    selectedCounter: {
      backgroundColor: colors.primary,
    },
    countText: {
      fontSize: fontSizes.h1,
      fontFamily: "Milliard-Medium",
    },
    label: {},
    mapAction: {
      position: "absolute",
      bottom: spacing.s3,
      right: spacing.s3,
      display: "flex",
      width: 50,
      height: 50,
      backgroundColor: "#eeeeee",
      borderRadius: 25,
      ...commonStyles.elevation2,
      justifyContent: "center",
      alignItems: "center",
    },
    list: {
      // height: 500,
      display: "flex",
      margin: spacing.s1,
      // backgroundColor: "#9BB0A544",
    },
  });
  return (
    <Animated.View
      style={[
        styles.card,
        style,
        {
          borderRadius: isOpen ? 0 : 25,
          width: isOpen ? windowWidth : windowWidth - spacing.s3 * 2,
          height: isOpen ? windowHeight - navbarHeight : "auto",
          overflow: "visible",
          marginHorizontal: isOpen ? 0 : spacing.s3,
          marginBottom: isOpen ? 0 : spacing.s3,
          paddingTop: isOpen ? 100 : spacing.s3,
        },
      ]}
      onTouchEnd={() => {
        if (!isOpen) {
          onPress();
        }
      }}
    >
      <View style={styles.header}>
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <MaterialCommunityIcons
            name={"map-marker"}
            color={colors.lightred}
            size={24}
          />
          <T style={styles.name}>{store.name}</T>
          {isOpen && (
            <Pressable
              style={{
                top: 5,
                right: 5,
                width: 30,
                height: 30,
                justifyContent: "center",
                alignItems: "center",
              }}
              onPress={() => {
                const scheme = Platform.select({
                  ios: "maps:0,0?q=",
                  android: "geo:0,0?q=",
                });
                const latLng = `${store.lat},${store.lng}`;
                const label = store.name;
                const url = Platform.select({
                  ios: `${scheme}${label}@${latLng}`,
                  android: `${scheme}${latLng}(${label})`,
                });

                if (url) Linking.openURL(url);
              }}
            >
              <IonIcons
                name="navigate-circle-outline"
                color={colors.darkgrey}
                size={30}
              />
            </Pressable>
          )}
        </View>
      </View>
      <View>
        <T style={{ marginLeft: spacing.s1 }}>
          {translate("label_products_found")}
        </T>
        <View style={styles.counterContainer}>
          <TouchableOpacity
            style={[
              styles.counter,
              filter == "all" ? styles.selectedCounter : null,
            ]}
            onPress={() => {
              setFilter("all");
            }}
          >
            {isFetching ? (
              <SpinnerComponent imageStyle={{ height: 32, width: 32 }} />
            ) : (
              <T style={styles.countText}>{products_in_store.all.length}</T>
            )}
            <T style={styles.label}>{translate("all_time")}</T>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.counter,
              filter == "last" ? styles.selectedCounter : null,
            ]}
            onPress={() => {
              setFilter("last");
            }}
          >
            {isFetching ? (
              <SpinnerComponent imageStyle={{ height: 32, width: 32 }} />
            ) : (
              <T style={styles.countText}>{products_in_store.last.length}</T>
            )}
            <T style={styles.label}>
              {translate("last_days").replace(
                /({LIMIT_DAYS})/,
                config?.limitDays?.toString()
              )}
            </T>
          </TouchableOpacity>
        </View>

        {isOpen &&
          (isFetching && !isRefetching ? (
            <SpinnerComponent style={{ alignSelf: "center" }} />
          ) : (
            true && (
              <ScrollView
                style={styles.list}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                  paddingBottom: 250,
                  overflow: "hidden",
                }}
                refreshControl={
                  <RefreshControl
                    refreshing={isRefetching}
                    onRefresh={() => {
                      refetch();
                    }}
                  />
                }
              >
                {products_in_store[filter].map(
                  (product: any, index: number) => {
                    return (
                      <ProductListItemComponent
                        product={product}
                        onProductPress={(product: any) =>
                          onProductPress(product)
                        }
                        confirmProductInStore={(product: any) =>
                          confirmProductInStore(product)
                        }
                        key={product.product.id}
                        style={[
                          {
                            marginVertical: spacing.s1 / 2,
                          },
                          index == 0
                            ? {
                                borderTopLeftRadius: 10,
                                borderTopRightRadius: 10,
                                marginTop: 0,
                              }
                            : undefined,
                          products_in_store[filter].length - 1 == index
                            ? {
                                borderBottomLeftRadius: 10,
                                borderBottomRightRadius: 10,
                              }
                            : undefined,
                        ]}
                      />
                    );
                  }
                )}
              </ScrollView>
            )
          ))}
      </View>
    </Animated.View>
  );
}

export default StoreCardComponent;
