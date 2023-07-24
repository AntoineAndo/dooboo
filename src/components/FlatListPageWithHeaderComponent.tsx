import React, { useRef, useState } from "react";
import {
  View,
  StyleSheet,
  StatusBar,
  Animated,
  FlatList,
  Pressable,
  RefreshControl,
} from "react-native";
import PageComponent from "./PageComponent";
import colors from "../config/colors";
import Header2Component from "./Header2Component";
import spacing from "../config/spacing";
import T from "./T";
import ListItemComponent from "./ListItemComponent";
import SeparatorComponent from "./SeparatorComponent";
import ProductListItemComponent from "./ProductListItemComponent";
import { useConfig } from "../providers/ConfigProvider";
type Props = {
  title: any;
  showBackButton: boolean;
  showLogo?: boolean;
  customSubHeaderComponent?: any;
  data: any;
  onItemClick: Function;
  rightActionComponent?: any;
  onRefresh: Function;
};

const TIMER_DURATION = 10;
const VERIFICATION_CODE_LENGTH = 6;

function FlatListPageWithHeaderComponent({
  title,
  showBackButton,
  showLogo = false,
  data,
  customSubHeaderComponent,
  onItemClick,
  rightActionComponent,
  onRefresh,
}: Props) {
  const { config } = useConfig();
  const scrollOffset = useRef(new Animated.Value(0)).current;
  const [isRefreshing, setIsRefreshing] = useState(false);

  const HEADER_MIN_HEIGHT = 75;
  const HEADER_MAX_HEIGHT = 200;
  const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

  const headerTranslateY = scrollOffset.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
    extrapolate: "clamp",
  });

  const styles = StyleSheet.create({
    page: {
      flex: 1,
      paddingTop: StatusBar.currentHeight,
      backgroundColor: colors.primary,
      position: "relative",
    },
    listElement: {
      marginBottom: 10,
    },
    flatList: {
      flex: 1,
      // backgroundColor: colors.primary,
    },
    contentContainer: {
      marginTop: HEADER_MAX_HEIGHT + spacing.s1,
      backgroundColor: "white",
      borderTopRightRadius: 25,
      // flex: 1,
      padding: spacing.s3,
      paddingBottom: HEADER_MAX_HEIGHT + spacing.s1 + 50,
    },
    backdrop: {
      position: "absolute",
      top: StatusBar.currentHeight,
      height: "100%",
      width: "100%",
      flex: 1,
      flexDirection: "column",
    },
  });

  return (
    <PageComponent style={styles.page} withNavbar={true}>
      <View style={styles.backdrop}>
        <View
          style={{
            flex: 1,
            backgroundColor: colors.primary,
          }}
        ></View>
        <View
          style={{
            flex: 1,
            backgroundColor: "white",
          }}
        ></View>
      </View>
      <Animated.View
        style={[
          {
            position: "absolute",
            top: StatusBar.currentHeight,
            left: 0,
            right: 0,
            backgroundColor: colors.primary,
            overflow: "hidden",
            height: headerTranslateY,
            zIndex: 999,
          },
        ]}
      >
        <Header2Component
          title={title}
          showBackButton={showBackButton}
          showLogo={showLogo}
          scrollOffset={scrollOffset}
          customSubHeaderComponent={customSubHeaderComponent}
          rightActionComponent={rightActionComponent}
        />
      </Animated.View>
      {/* {data && ( */}
      <FlatList
        data={data?.pages}
        refreshing={isRefreshing}
        onRefresh={() => onRefresh()}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollOffset } } }], // event.nativeEvent.contentOffset.x to scrollX
          { useNativeDriver: false } // use native driver for animation
        )}
        renderItem={({ item }: any) => {
          return item?.items?.map((product: any, index: number) => {
            return (
              <View key={product.id}>
                <Pressable
                  style={styles.listElement}
                  onPress={() => onItemClick(product)}
                >
                  <ListItemComponent config={config}>
                    {product}
                  </ListItemComponent>
                </Pressable>
                {index != item.items.length - 1 && <SeparatorComponent />}
              </View>
            );
          });
        }}
        scrollEventThrottle={16}
        contentContainerStyle={styles.contentContainer}
        style={styles.flatList}
        showsVerticalScrollIndicator={false}
      ></FlatList>
      {/* )} */}
    </PageComponent>
  );
}
export default FlatListPageWithHeaderComponent;
