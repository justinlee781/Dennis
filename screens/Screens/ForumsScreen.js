import React, { useEffect } from "react";
import { View,StyleSheet } from "react-native";
import CustomHeader from "../../components/Headers/CustomHeader";
import Theme from "../../src/Theme";
import CurveView from "../../components/utils/CurveView";
import useStore from "../../store";
import { doc, onSnapshot } from "firebase/firestore"; // Import necessary Firestore functions and objects
import { dbFS } from "../../config/firebase";
import Space from "../../components/utils/Space";


function ForumsScreen({ navigation }) {
    const userData = useStore((state) => state.userData);
    const setUserData = useStore((state) => state.setUserData);
    const userID = useStore((state) => state.userID);

    useEffect(() => {
   
        if (userID && !userData) {
          const userRef = doc(dbFS, "users", userID);
  
          const unsubscribe = onSnapshot(userRef, (docSnapshot) => {
            if (docSnapshot.exists()) {
              setUserData(docSnapshot.data());
              console.log("First time user data retrieved", docSnapshot.data());
            }
          });
  
          return () => unsubscribe(); // Cleanup the subscription when the component unmounts
        }
  
    }, []);

    if(!userData){
        return null
    }

    return (
      <View style={styles.container}>
        <CustomHeader
          image={userData.userImage ? userData.userImage : placeholder}
          label={`Greetings ${userData.userName}!`}
        />

      <Space space={15}/>
        <CurveView>
      
        </CurveView>
      </View>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.secondaryColor,
  },
  card: {
    width: "100%",
    paddingHorizontal: 20,
  },
  promoCard: {
    height: 215,
    width: 160,
    borderRadius: 15,
    overflow: "hidden",
    marginLeft:10
  },
  titleBar:{
    marginTop:10,
    flexDirection:'row',
    width:'100%',
    justifyContent:'space-between',
    paddingHorizontal:20,
    alignItems:'center'
  },
  categories: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    width:'100%',
    marginTop:10
  },
  categoryItem: { 
    height:'100%',
    width:'100%'
  },
});

export default ForumsScreen;

const placeholder = "https://cdn-icons-png.flaticon.com/128/2202/2202112.png"