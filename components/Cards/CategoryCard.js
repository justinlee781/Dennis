import React from "react";
import { 
    View,
    Image,
    StyleSheet
} from "react-native";
import Typo from "../utils/Typo";
import Space from "../utils/Space";
import { MaterialIcons } from '@expo/vector-icons';
import Theme from "../../src/Theme";

function CategoryCard({image,label}){
    return(
    <View style={styles.coverbg}>
        <View style={styles.container}>
     <Image source={{uri:image}} style={styles.cover} />
     <Typo style={{paddingRight:8}}>{label}</Typo>
    </View>
    </View>
    )}
export default CategoryCard;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection:'row',
        alignItems:'center'
    },
    cover:{
        height:35,
        width:35,
        borderRadius:55,
        marginRight:5
    },
    coverbg:{
        backgroundColor:'#f7f7f7',
        borderRadius:100,
        paddingHorizontal:5,
        paddingVertical:5,
        borderWidth:1,
        borderColor:'#e5e5e5'
    }
});