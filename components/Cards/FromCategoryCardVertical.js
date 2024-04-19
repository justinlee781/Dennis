import React from "react";
import { 
    View,
    StyleSheet,
    Image
} from "react-native";
import Typo from "../utils/Typo";
import Space from "../utils/Space";
import RoundedSmallButton from "../Buttons/RoundedSmallButton";

function ForumCategoryCardVertical({buttonColor,title,subtitle,image,color,handlePress}){
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
    <View style={{flex:1}}>
        <Typo center numberOfLines={1} style={{fontSize:20}}>{title}</Typo>
        <Typo center grey>{subtitle}</Typo>
        <Space space={10}/>
        <RoundedSmallButton
        color={buttonColor}
        label={"View It Now"}
        handlePress={handlePress}
        />
    </View>
    </View>
    )}
export default ForumCategoryCardVertical;

const styles = StyleSheet.create({
    container: {
        borderRadius:25,
        paddingHorizontal:20,
        paddingVertical:15,
        marginBottom:5,
        alignItems:'center',
        justifyContent:'center',
        flex:1
    },
    image:{
        height:100,
        width:115,
        resizeMode:'contain'
    },
});