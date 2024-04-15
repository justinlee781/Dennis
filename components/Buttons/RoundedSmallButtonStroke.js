import React from "react";
import { 
    View,
    Text,
    StyleSheet,
    TouchableOpacity
} from "react-native";
import Theme from "../../src/Theme";
import { Feather } from '@expo/vector-icons';
function RoundedSmallButtonStroke({color,label,handlePress,icon}){
    return (
      <TouchableOpacity
        onPress={handlePress}
        style={[styles.container, { borderColor: color,borderWidth:1 }]}
      >
        {icon ? <Feather style={{marginRight:5}} name={icon} size={16} color={color} /> : null}
        <Text style={[styles.text,{color:color}]}>{label}</Text>
      </TouchableOpacity>
    );}
export default RoundedSmallButtonStroke;

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    paddingHorizontal:8,
    paddingVertical:5,
    flexDirection:'row',
    alignItems:'center',
  },
  text: {
    fontSize: 14,
    fontFamily: Theme.OutfitBold,
  },
});