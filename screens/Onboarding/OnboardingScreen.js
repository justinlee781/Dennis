import React, { useState } from "react";
import { 
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    TouchableOpacity,
    Image
} from "react-native";
import Theme from "../../src/Theme";
import ObSwiper from "../../components/Onboarding/ObSwiper";
import Typo from "../../components/utils/Typo";
import assets from "../../assets/assets";
import Space from '../../components/utils/Space'
import FullButton from '../../components/Buttons/FullButton'
import FullButtonStroke from "../../components/Buttons/FullButtonStroke";

//TODO:change this data to update your slider.
const data = [
    {
      id: '1',
      image: assets.cat1,
      text: 'Recycle Now',
      subText:'Get upto 50% OFF on all your Electronics.'
    },
    {
      id: '2',
      image: assets.cat2,
      text: 'Premium Laptops',
      subText:'Buy Same Laptops upto 80% off on value!'
    },
    {
      id: '3',
      image: assets.cat6,
      text: 'Clear Hardware',
      subText:'Buy or sell your harware at a good price!'
    },
  ];


function OnboardingScreen({navigation}){

    const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

    const handleSlideChange = (index) => {
      setCurrentSlideIndex(index);
    };

    return (
      <View style={styles.container}>
        <SafeAreaView>
          <View style={styles.headerWrapper}>
          </View>
        </SafeAreaView>
        <View style={styles.body}>
          <View style={styles.sliderWrapper}>
            <View style={{ flex: 4 }}>
              <ObSwiper data={data} onSlideChange={handleSlideChange} />
            </View>
            <View style={styles.contentWrapper}>
              <Typo xl>
                {data[currentSlideIndex].text}
              </Typo>
              <Space space={2} />
              <Typo light grey >{data[currentSlideIndex].subText}</Typo>
            </View>
          </View>
          <View style={styles.buttonWrapper}>
            <FullButton colors={Theme.primaryColor} handlePress={()=>navigation.navigate("LoginScreen")} label={"Get Started!"} color={Theme.primaryColor} />
            <Space space={10} />
            <FullButtonStroke
              label={"Terms and Conditions"}
            />
          </View>
        </View>
      </View>
    );}
export default OnboardingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.secondaryColor,
  },
  body: {
    flex: 1,
  },
  headerWrapper: {
    paddingHorizontal: 20,
    alignItems: "flex-end",
    justifyContent: "flex-end",
    paddingVertical: 15,
  },
  buttonWrapper: {
    flex: 1,
    backgroundColor: Theme.backgroundColor,
    paddingHorizontal: 20,
  },
  sliderWrapper: {
    flex: 4,
  },
  contentWrapper: {
    flex: 1,
    backgroundColor: Theme.backgroundColor,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    alignItems: "center",
    justifyContent: "center",
  },
  flag:{
    height:18,
    width:18,
    resizeMode:'contain',
    marginRight:5
  }
});