import React from "react";
import { 
    View,
    StyleSheet,
    Image,
    TouchableOpacity
} from "react-native";
import Typo from "../utils/Typo";
import Theme from "../../src/Theme";

function ProductCard({ img, title, price ,handleImagePress,postDate}) {

  function formatTimestamp(timestamp) {
    const currentDate = new Date();
    const secondsAgo = (currentDate.getTime() - timestamp.toMillis()) / 1000;
  
    if (secondsAgo < 60) {
      return "Just now";
    } else if (secondsAgo < 3600) {
      const minutes = Math.floor(secondsAgo / 60);
      return minutes === 1 ? "1 min ago" : `${minutes} mins ago`;
    } else if (secondsAgo < 86400) {
      const hours = Math.floor(secondsAgo / 3600);
      return hours === 1 ? "1 h ago" : `${hours} hrs ago`;
    } else if (secondsAgo < 2592000) {
      const days = Math.floor(secondsAgo / 86400);
      return days === 1 ? "1 day ago" : `${days} days ago`;
    } else if (secondsAgo < 31536000) {
      const months = Math.floor(secondsAgo / 2592000);
      return months === 1 ? "1 month ago" : `${months} months ago`;
    } else {
      const years = Math.floor(secondsAgo / 31536000);
      return years === 1 ? "1 year ago" : `${years} years ago`;
    }
  }
  
  return (
    <View style={styles.container}>
     <TouchableOpacity onPress={handleImagePress}>
     <Image source={{ uri: img }} style={{ flex: 1,borderRadius:35,height:178,backgroundColor:'#f8f8f8' }}>
      </Image>
     </TouchableOpacity>
      <View style={styles.blurContainer}>
          <View style={{ flex: 1 }}>
          <Typo style={{textTransform:"capitalize"}} numberOfLines={1} grey s>
           {postDate ? formatTimestamp(postDate) : null}
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