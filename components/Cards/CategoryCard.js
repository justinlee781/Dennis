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

function CategoryCard({image,label,sublabel}){
    return(
    <View style={styles.container}>
     <Image source={image} style={styles.cover} />
     <Space space={8}/>
     <Typo l>{label}</Typo>
     <View style={{flexDirection:'row',alignItems:'center'}}>
     <MaterialIcons name="trending-up" size={20} color={Theme.primaryColor} />
     <Typo s grey> {sublabel}</Typo>
     </View>
    </View>
    )}
export default CategoryCard;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    cover:{
        height:150,
        width:'100%',
        borderRadius:10
    }
});