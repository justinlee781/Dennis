import React from "react";
import { 
    View,
    Image,
    StyleSheet,
    SafeAreaView,
    Platform,
    TouchableOpacity
} from "react-native";
import Typo from "../utils/Typo";
import assets from "../../assets/assets";
import { useNavigation } from "@react-navigation/native";
import { AntDesign,Feather } from '@expo/vector-icons';

function HeaderTwoIcons({
  label,
  noMargin,
  rightIcon,
  rightIconName,
  handleRightIconPress,
  leftIcon
}) {
  const navigation = useNavigation();
  return (
    <SafeAreaView
      style={[
        styles.container,
        {
          marginTop: noMargin ? 15 : Platform.OS === "android" ? 20 : 0,
          backgroundColor: null,
        },
      ]}
    >
      <View style={styles.container}>
       {leftIcon ? <TouchableOpacity onPress={() => navigation.goBack()}>
       <AntDesign name="back" size={24} color="black" />
        </TouchableOpacity> : null}
        <Typo style={{textTransform:"capitalize"}} xl>
          {label}
        </Typo>
        {rightIcon === false ? (
          <View style={{ width: 25 }} />
        ) : (
          <>
            {rightIconName ? (
              <TouchableOpacity onPress={handleRightIconPress}>
              <Feather name={rightIconName} size={24} color="black" />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={() => navigation.navigate("CartScreen")}
              >
                <Image source={assets.cart} style={styles.icon} />
              </TouchableOpacity>
            )}
          </>
        )}
      </View>
    </SafeAreaView>
  );
}
export default HeaderTwoIcons;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Platform.OS === "ios" ? 15 : 10,
    justifyContent: "space-between",
    paddingTop: 20,
    width:'100%',
    paddingBottom:15
  },
  icon:{
    height:22,
    width:22,
  },
  back:{
    height:28,
    width:28,
  },
});