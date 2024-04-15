import React from "react";
import { 
    View,
    Image,
    StyleSheet,
    TouchableOpacity
} from "react-native";
import Typo from "../utils/Typo";
import { MaterialIcons } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import Theme from "../../src/Theme";

function DetailCard({title,subtitle,icon,handlPress}){
    return(
    <TouchableOpacity onPress={handlPress} style={styles.container}>
        <View style={{flexDirection:'row',alignItems:'center'}}>
        <View style={styles.circle}>
        <Feather name={icon} size={20} color={Theme.primaryColor} />
        </View>
        <View>
        <Typo>{title}</Typo>
        {subtitle ? <Typo grey s light>{subtitle}</Typo> : null}
        </View>
        </View>
        <MaterialIcons name="chevron-right" size={23} color="black" />
    </TouchableOpacity>
    )}
export default DetailCard;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingVertical: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    flex: 1,
    marginBottom:10,
    paddingHorizontal:10,
    borderRadius:15,
    backgroundColor:Theme.containerGrey
  },
  icon: {
    height: 31,
    width: 31,
    resizeMode: "contain",
    marginRight: 10,
  },
  circle:{
    padding:7,
    borderRadius:100,
    marginRight:10
  }
});