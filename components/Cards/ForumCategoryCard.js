import React from "react";
import { 
    View,
    Text,
    StyleSheet,
    Image
} from "react-native";
import assets from "../../assets/assets";
import Typo from "../utils/Typo";
import Space from "../utils/Space";
import RoundedSmallButton from "../Buttons/RoundedSmallButton";
import Theme from "../../src/Theme";

function ForumCategoryCard({buttonColor,title,subtitle,image,color}){
    return(
    <View style={[styles.container,{
        backgroundColor:color
    }]}>
    <View>
    <Image
    source={image}
    style={styles.image}
    />
    </View>
    <View style={{paddingVertical:10,paddingHorizontal:5,flex:1}}>
        <Typo numberOfLines={1} style={{fontSize:22}}>{title}</Typo>
        <Typo grey>{subtitle}</Typo>
        <Space space={10}/>
        <View style={{flexDirection:'row'}}>
        <RoundedSmallButton
        color={buttonColor}
        label={"View It Now"}
        />
        </View>
    </View>
    </View>
    )}
export default ForumCategoryCard;

const styles = StyleSheet.create({
    container: {
        borderRadius:15,
        paddingHorizontal:20,
        flexDirection:'row',
        paddingVertical:3,
        gap:15,
        marginBottom:10
    },
    image:{
        height:115,
        width:115,
        resizeMode:'contain'
    },
});