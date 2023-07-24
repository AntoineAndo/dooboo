import React, { Component } from "react";
import { DevSettings, StyleSheet, Text } from "react-native";
import T from "./T";

import * as Sentry from "sentry-expo";
import PageComponent from "./PageComponent";
import colors from "../config/colors";
import ButtonComponent from "./ButtonComponent";
import { useNavigation } from "@react-navigation/native";
import spacing from "../config/spacing";
import { TranslationComponent } from "../../App";

type Props = {
  children: any;
  translate: any;
};

type State = {
  hasError: Boolean;
  error: any;
};

class ErrorBoundary extends React.Component<Props, State> {
  translate: any;

  constructor(props: Props, translate: any) {
    super(props);
    this.state = { hasError: false, error: undefined };
    this.translate = translate;
  }

  static getDerivedStateFromError(error: any) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    this.setState({
      hasError: true,
      error: error,
    });
  }

  sendErrorReport = () => {
    //Send error to Sentry
    Sentry.Native.captureException(this.state.error);

    //Then restart
    DevSettings.reload();
  };

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <TranslationComponent>
          {(translate) => (
            <PageComponent style={styles.page}>
              <T style={styles.message}>{translate("main_error_message")}</T>
              <T>{translate("submit_error_prompt")}</T>
              <T>{translate("submit_error_tip")}</T>
              <ButtonComponent
                style={{ width: "100%" }}
                onPress={() => {
                  DevSettings.reload();
                }}
                type={"secondary"}
                slim={true}
              >
                {translate("restart_only")}
              </ButtonComponent>
              <ButtonComponent
                style={{ width: "100%", marginTop: spacing.s2 }}
                onPress={this.sendErrorReport}
                type={"primary"}
              >
                {translate("send_and_restart")}
              </ButtonComponent>
            </PageComponent>
          )}
        </TranslationComponent>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.s3,
  },
  message: {
    fontSize: 24,
    color: colors.primary,
  },
});

export default ErrorBoundary;
