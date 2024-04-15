import React from "react";
import { 
    View,
    Text,
    StyleSheet,
    ActivityIndicator
} from "react-native";
import Theme from "../../src/Theme";

function LoadingView(){
    return(
    <View style={styles.container}>
        <ActivityIndicator color={Theme.primaryColor} size={'large'}/>
    </View>
    )}
export default LoadingView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: "100%",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    position: "absolute",
    zIndex: 1,
  },
});