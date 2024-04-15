import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, ImageBackground, Animated, TouchableOpacity } from "react-native";
import { AntDesign } from '@expo/vector-icons';
import Theme from "../../../src/Theme";
import Typo from "../../../components/utils/Typo";

function Slide1({ navigation }) {
  const titlePosition = useRef(new Animated.Value(0)).current;
  const subtitleOpacity = useRef(new Animated.Value(0)).current;
  const buttonOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(titlePosition, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true
      }),
      Animated.timing(subtitleOpacity, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true
      }),
      Animated.timing(buttonOpacity, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true
      })
    ]).start();
  }, []);

  const titleTranslateY = titlePosition.interpolate({
    inputRange: [0, 1],
    outputRange: [100, 0],
  });

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../../../assets/images/bg.jpg")}
        style={{ flex: 1 }}
      >
        <Animated.View style={[styles.textContainer, { transform: [{ translateY: titleTranslateY }], opacity: subtitleOpacity }]}>
          <Typo style={styles.title}>Catch the Wave of Community</Typo>
          <Typo grey style={styles.subtitle}>Join the Swell - Buy, Sell, and Share Your Passion for Surfing</Typo>
        </Animated.View>

        <Animated.View style={[styles.buttonContainer, { opacity: buttonOpacity ,transform: [{ translateY: titleTranslateY }]}]}>
          <TouchableOpacity onPress={()=>navigation.navigate("LoginScreen")} style={styles.button}>
            <AntDesign name="swapright" size={30} color="white" />
          </TouchableOpacity>
        </Animated.View>
      </ImageBackground>
    </View>
  );
}
export default Slide1;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  textContainer: {
    position: 'absolute',
    left: 20,
    top: '8%', // Adjust this value to bring the title down
    paddingRight:20,
    textAlign:'left',
    
    maxWidth:400
  },
  
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 18,
    marginTop: 5,
  },
  buttonContainer: {
    position: 'absolute',
    top: '20%',
    left: 20,
  },
  button: {
    backgroundColor: Theme.primaryColor,
    width: 60,
    height: 60,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
