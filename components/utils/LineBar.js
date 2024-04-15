import React from "react";
import { 
    View,
    Text,
} from "react-native";
import Theme from "../../src/Theme";


function LineBar({margin}){
    return (
      <View
        style={{
          marginVertical: margin,
          backgroundColor:'#e5e5e5',
          opacity: 1,
          height: 1,
          width: "100%",
        }}
      ></View>
    );}
export default LineBar;

