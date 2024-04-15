import React from "react";
import { 
    View,
    Text,
    StyleSheet
} from "react-native";

function CircularPhotos({images}){


    const renderCircularPhotos = () => {
        if (!images || images.length === 0) {
          return null;
        }
        let circleComponents = [];
        for (let i = 0; i < Math.min(images.length, 3); i++) {
          circleComponents.push(
            <CircularPhoto key={i} source={{ uri: images[i] }} />
          );
        }
        if (images.length > 3) {
          const fourthImage = images[3];
          circleComponents.push(
            <ImageBackground
              source={{ uri: fourthImage }}
              style={styles.circularPhoto}
              key={3}
            >
              <BlurView style={{flex:1}} intensity={10}>
                <View style={styles.imageOverlay}>
                  <Typo light s white>{`+${images.length - 3}`}</Typo>
                </View>
              </BlurView>
            </ImageBackground>
          );
        }
        return circleComponents;
      };

      

    return(
        <View style={styles.photoContainer}>
        {renderCircularPhotos()}
        </View>
    )}
export default CircularPhotos;

const styles = StyleSheet.create({
  circularPhoto: {
    width: 40,
    height: 40,
    borderRadius: 22,
    overflow: "hidden",
    marginRight: -15, // Overlapping effect
    marginTop: 10,
  },
  circularPhotoBorder: {
    width: "100%",
    height: "100%",
  },
  photo: {
    width: "100%",
    height: "100%",
    borderWidth: 3,
    borderRadius: 55,
  },
  photoContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  imageOverlay: {
    backgroundColor: "rgba(0,0,0,0.5)",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});


function CircularPhoto({ source }) {
    return (
      <View style={styles.circularPhoto}>
        <View style={styles.circularPhotoBorder}>
          <Image source={source} style={styles.photo} />
        </View>
      </View>
    );
  }
  
  