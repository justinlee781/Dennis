import React from "react";
import { 
    View,
    StyleSheet,
    Platform,
    SafeAreaView,
    TouchableOpacity,
    Image
} from "react-native";
import { AntDesign } from '@expo/vector-icons';
function IconHeader({noMargin,leftIcon,handleLeftIconPress}){
    return (
      <SafeAreaView
        style={[
          styles.container,
          {
            marginTop: noMargin ? 15 : Platform.OS === "android" ? 45 : 0,
            backgroundColor: null,
          },
        ]}
      >
       <View style={styles.innerView}>
        {leftIcon ?<TouchableOpacity onPress={handleLeftIconPress}>
        <AntDesign name="back" size={24} color="black" />
        </TouchableOpacity> : null}
       </View>
      </SafeAreaView>
    );}
export default IconHeader;

const styles = StyleSheet.create({
  container: {},
  innerView: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Platform.OS === "ios" ? 15 : 10,
    justifyContent: "space-between",
    paddingVertical:20
  },
  icon:{
    height:35,
    width:35,
    resizeMode:'contain'
  }
});