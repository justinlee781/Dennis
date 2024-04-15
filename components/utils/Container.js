import React from "react";
import { 
    View,
    Text,
    StyleSheet
} from "react-native";

function Container({children}){
    return(
    <View style={styles.container}>
        {children}
    </View>
    )}
export default Container;

const styles = StyleSheet.create({
    container: {
    width: "100%",
    alignItems: "center",
    paddingHorizontal: 10,
    flexDirection: "row",
    paddingVertical: 8,
    backgroundColor: '#050505',
    justifyContent: "space-between",
    borderRadius:15,
    borderWidth:1,
    borderColor:'#141414'
    }
});