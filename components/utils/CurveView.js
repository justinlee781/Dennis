import React from "react";
import { 
    View,
    Text,
    StyleSheet,
    ScrollView
} from "react-native";
import Theme from "../../src/Theme";

function CurveView({children,style}){
    return(
    <View style={[styles.container,style ? style : null]}>
      <ScrollView showsVerticalScrollIndicator={false}>
       {children}
       </ScrollView>
    </View>
    )}
export default CurveView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.backgroundColor,
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
    paddingTop:10
  },
});