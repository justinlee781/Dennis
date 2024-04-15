import React from "react";
import { 
    View,
    StyleSheet,
    Image,
    TouchableOpacity
} from "react-native";
import Typo from "../utils/Typo";
import Theme from "../../src/Theme";

function ProductCard({ img, title, price ,handleImagePress,brand}) {
  
  return (
    <View style={styles.container}>
     <TouchableOpacity onPress={handleImagePress}>
     <Image source={{ uri: img }} style={{ flex: 1,borderRadius:10,height:178,backgroundColor:'#f8f8f8' }}>
      </Image>
     </TouchableOpacity>
      <View style={styles.blurContainer}>
          <View style={{ flex: 1 }}>
          <Typo style={{textTransform:"capitalize"}} numberOfLines={1} grey s>
             {/* {formatTimestamp(postDate)} */} {brand}
            </Typo>
            <Typo style={{textTransform:"capitalize"}} numberOfLines={1} l>
              {title}
            </Typo>
     
            <Typo numberOfLines={1} bold style={{color:Theme.primaryColor}}>
              $ {price}
            </Typo>

          </View>
        </View>
    </View>
  );
}

export default ProductCard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderWidth:2,
    borderColor:'#f9f9f9',
    borderRadius:10
  },
  blurContainer: {
    paddingVertical: 10,
    flexDirection: "row",
    borderBottomLeftRadius:10,
    borderBottomRightRadius:10,
    paddingHorizontal:5
  },
  profile:{
    height:35,
    width:35,
    borderRadius:100,
    marginRight:5
  }
});