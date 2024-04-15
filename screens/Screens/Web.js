import { BackHandler, StyleSheet, Text, View } from "react-native";
import React, { useEffect } from "react";
import { WebView } from "react-native-webview";

const Web = ({ navigation, route }) => {
  const viewRef = React.useRef(null);

  const handleNavigationStateChange = (navState) => {
    // if (navState.url.includes("ThankYou")) {
    //   setTimeout(() => {
    //     navigation.goBack();
    //     navigation.setParams({ success: true });
    //     //close the webview
    //   }, 2000);
    // }
  };

  //handle back button press
  useEffect(() => {
    const backAction = () => {
      navigation.goBack();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, []);

  return (
    <WebView
      ref={viewRef}
      source={{ uri: route?.params?.uri }}
      style={[{ flex: 1 }]}
      onNavigationStateChange={handleNavigationStateChange}
    />
  );
};

export default Web;

const styles = StyleSheet.create({});
