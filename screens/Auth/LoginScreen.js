import React, { useRef, useState } from "react";
import { 
    View,
    StyleSheet,
    TouchableOpacity,
    Alert,
    Pressable,
    ImageBackground
} from "react-native";
import Theme from "../../src/Theme";
import IconHeader from "../../components/Headers/IconHeader";
import Typo from "../../components/utils/Typo";
import Space from "../../components/utils/Space";
import InputBox from "../../components/utils/InputBox";
import FullButton from "../../components/Buttons/FullButton";
import LoadingView from "../../components/utils/LoadingView";
import useStore from "../../store/index";
import { sendEmailVerification, signInWithEmailAndPassword } from "firebase/auth";
import { AUTH } from "../../config/firebase";
import AsyncStorage from '@react-native-async-storage/async-storage';


function LoginScreen({navigation}){
    const [email,setEmail] = useState("")
    const [password,setPassword] = useState("")
    const [loading, setLoading] = useState(false);

    const setIsLoggedIn = useStore((state) => state.setIsLoggedIn);
    const setUserID = useStore((state) => state.setUserID);

    const handleResendVerificationEmail = async () => {
      try {
        const user = AUTH.currentUser;
        if (user) {
          await sendEmailVerification(user);
          console.log("Verification email sent");
          Alert("Verification email sent")
        } else {
          setError("User not found");
        }
      } catch (err) {
        setError(err.message);
      }
    };

    const handleLogin = async () => {
      if(email && password){
        setLoading(true);
        try {
          const { user } = await signInWithEmailAndPassword(AUTH, email, password);
    
          if (user && user.emailVerified) {
            console.log("Login successful",user.uid);
            await AsyncStorage.setItem("userID", user.uid); 
            await AsyncStorage.setItem("isLoggedIn", "true");
            await AsyncStorage.setItem("email", email);
            setIsLoggedIn(true)
            setUserID(user.uid);
            navigation.replace('AccountSetupScreen',{
              email
            })
          } else {
            Alert.alert(
              "Email Not Verified",
              "Please verify your email before logging in",
              [
                {
                  text: "Ok",
                  onPress: () => {
                    // Handle Ok button press if needed
                  },
                },
                {
                  text: "Resend",
                  onPress: handleResendVerificationEmail,
                },
              ]
            );
          }
        } catch (err) { 
          Alert.alert(err.message);
        }
        setLoading(false);
 
      }
      else{
        Alert.alert("Input all fields","Please make sure to enter all fields.")
      }
    }


    return (
      <ImageBackground
      source={require("../../assets/images/loginbg.jpg")}
      style={styles.container}>
        <IconHeader
          handleLeftIconPress={() => navigation.goBack()}
          leftIcon={true}
        />
        <View style={styles.body}>
          <View style={styles.loginWrapper}>
            <View style={{ alignItems: "center" }}>
              <Typo style={{ fontSize: 30 }}>
                Welcome!
              </Typo>
              <Typo grey light>Sign In to your account</Typo>
            </View>
            <Space space={25}/>

           <View>
           <InputBox
             leftIcon={"mail"}
              placeholder={"Email Address"}
              value={email}
              onChangeText={(text)=>setEmail(text)}
            />
            <Space space={15}/>
            <InputBox
              leftIcon={"lock-closed"}
              placeholder={"Password"}
              value={password}
              onChangeText={(text)=>setPassword(text)}
            />
            <View style={{alignItems:'flex-end',marginTop:7}}>
              <TouchableOpacity>
                <Typo s style={{textDecorationLine:"underline"}}>Forgot Password?</Typo>
              </TouchableOpacity>
            </View>
           </View>
           <Space space={25}/>

            <FullButton
            handlePress={handleLogin}
              color={Theme.primaryColor}
              label={"Login"}
            />
             <Space space={15}/>
              <Pressable onPress={()=>navigation.navigate("SignupScreen")}>
               <Typo s>Don't have an account? <Typo bold s style={{textDecorationLine:"underline"}}>Sign up?</Typo></Typo>
              </Pressable>
          </View>
        </View>



        {
          loading ?
          <LoadingView />
          :
          null
        }
      </ImageBackground>
    );}
export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  loginWrapper: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 20,
  },
  body: {
    flex: 1,
  },
  emptySpace: {
    flex: 0.4,
  },
  countryItem: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#242424",
    paddingVertical: 15,
  },
  flagIcon: {
    height: 18,
    width: 18,
    resizeMode: "contain",
    marginRight: 10,
  },
  countryName: {
    flex: 1,
    fontSize: 15,
    fontFamily: Theme.OutfitMedium,
  },
});