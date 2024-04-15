import React from "react";
import { 
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator
} from "react-native";
import Theme from "../../src/Theme";

function FullButton({color,label,handlePress,loading}){
    return (
      <TouchableOpacity
        disabled={loading?true:false}
        onPress={handlePress}
        style={[styles.container, { backgroundColor: color }]}
      >
       {
        loading ?
        <ActivityIndicator color={'white'}/>
        :
        <Text style={styles.text}>{label}</Text>
       }
      </TouchableOpacity>
    );}
export default FullButton;

const styles = StyleSheet.create({
  container: {
    height: 45,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
  },
  text: {
    fontSize: 16,
    fontFamily: Theme.OutfitMedium,
    color:'white'
  },
});