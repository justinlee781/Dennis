import React from "react";
import { 
    View,
    Text,
    StyleSheet,
    TouchableOpacity
} from "react-native";
import Theme from "../../src/Theme";
import Typo from "../utils/Typo";
import Space from "../utils/Space";

function AddressCard({title,address,handlePress}){
    return(
    <View style={styles.container}>
        <Typo>{title}</Typo>
        <Typo numberOfLines={4} s grey>{address}</Typo>
    </View>
    )}
export default AddressCard;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:Theme.containerGrey,
        borderRadius:10,
        padding:15
    }
});