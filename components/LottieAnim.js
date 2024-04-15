import React from "react";
import { View, Text, StyleSheet } from "react-native";
import LottieView from "lottie-react-native";

function LottieAnim({ navigation }) {
    return (
        <View style={styles.container}>
            <Text>This is a Lottie Animation</Text>
            <LottieView
                source={require("../assets/waves.json")}
                style={{ width: "100%", height: 200 }}
                autoplay
            />
        </View>
    );
}

export default LottieAnim;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    }
});
