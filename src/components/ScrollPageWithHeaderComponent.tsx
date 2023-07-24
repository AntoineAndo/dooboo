import React, { useRef, useState } from "react";
import { View, StyleSheet, StatusBar, Animated } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import PageComponent from "./PageComponent";
import colors from "../config/colors";
import Header2Component from "./Header2Component";
import spacing from "../config/spacing";
type Props = {
  title: any;
  showBackButton: boolean;
  showLogo?: boolean;
  children?: any;
  customSubHeaderComponent?: any;
  footer?: any;
};

const TIMER_DURATION = 10;
const VERIFICATION_CODE_LENGTH = 6;

function ScrollPageWithHeaderComponent({
  title,
  showBackButton,
  showLogo = false,
  children,
  customSubHeaderComponent,
  footer,
}: Props) {
  const scrollOffset = useRef(new Animated.Value(0)).current;

  const HEADER_MIN_HEIGHT = 75;
  const HEADER_MAX_HEIGHT = 200;
  const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

  const headerTranslateY = scrollOffset.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
    extrapolate: "clamp",
  });

  return (
    <PageComponent style={styles.page} withNavbar={true}>
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
        />
      </Animated.View>
      <ScrollView
        // ref={scrollViewRef}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollOffset } } }], // event.nativeEvent.contentOffset.x to scrollX
          { useNativeDriver: false } // use native driver for animation
        )}
        scrollEventThrottle={16}
        contentContainerStyle={{
          paddingTop: HEADER_MAX_HEIGHT + spacing.s1,
          display: "flex",
          backgroundColor: colors.primary,
        }}
        style={{
          flex: 1,
          backgroundColor: "white",
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* CONTENT */}
        {children}
      </ScrollView>
      {footer && footer}
    </PageComponent>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
    backgroundColor: colors.primary,
    position: "relative",
  },
});

export default ScrollPageWithHeaderComponent;
