import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, ImageBackground, Animated, TouchableOpacity } from "react-native";
import { AntDesign } from '@expo/vector-icons';
import Theme from "../../src/Theme";
import Typo from "../../components/utils/Typo";
import Swiper from 'react-native-swiper'
import Slide1 from "./Slides/Slide1";
import Slide2 from "./Slides/Slide2";
import Slide3 from "./Slides/Slide3";

function OnboardingScreen({ navigation }) {

  return (
    <View style={styles.container}>
    <Swiper loop={false} style={styles.wrapper} showsButtons={false} showsPagination={true} activeDotColor="white">
       <Slide1 navigation={navigation}/>
       <Slide2 navigation={navigation}/>
       <Slide3 navigation={navigation}/>
    </Swiper>
    </View>
  );
}
export default OnboardingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  textContainer: {
    position: 'absolute',
    left: 20,
    top: '8%', // Adjust this value to bring the title down
    paddingRight:20,
    textAlign:'left'
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
