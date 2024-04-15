import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, ImageBackground, Animated, TouchableOpacity } from "react-native";
import { AntDesign } from '@expo/vector-icons';
import Theme from "../../../src/Theme";
import Typo from "../../../components/utils/Typo";

function Slide2({ navigation }) {

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../../../assets/images/bg2.jpg")}
        style={{ flex: 1 }}
      >
        <View style={[styles.textContainer]}>
          <Typo style={styles.title}>Ride, Trade, Connect</Typo>
          <Typo grey style={styles.subtitle}>Exchange Old Waves, Find New Adventures, Build Community</Typo>
        </View>

        <View style={[styles.buttonContainer]}>
          <TouchableOpacity onPress={()=>navigation.navigate("LoginScreen")} style={styles.button}>
            <AntDesign name="swapright" size={30} color="white" />
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
  );
}
export default Slide2;

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
