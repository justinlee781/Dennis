import React from "react";
import { 
    Image,
    Text,
    StyleSheet,
    TouchableOpacity
} from "react-native";
import Theme from "../../src/Theme";


function FullButtonStroke({color,label,handlePress,leftImage}){
    return (
      <TouchableOpacity
        onPress={handlePress}
        style={[styles.container, { borderWidth: 1, borderColor: color }]}
      >
        {leftImage ? <Image source={leftImage} style={styles.img} /> : null}
        <Text style={[styles.text, { color: color }]}>{label}</Text>
      </TouchableOpacity>
    );}
export default FullButtonStroke;

const styles = StyleSheet.create({
  container: {
    height: 45,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    flexDirection:'row'
  },
  text: {
    fontSize: 16,
    fontFamily: Theme.OutfitMedium,
    color: "#FFF",
  },
  img:{
    height:15,
    width:15,
    resizeMode:'contain',
    marginRight:10,
  }
});