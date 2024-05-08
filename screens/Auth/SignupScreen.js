import React, { useRef, useState } from "react";
import { 
    View,
    StyleSheet,
    TouchableOpacity,
    Alert,
    ImageBackground,
} from "react-native";
import Theme from "../../src/Theme";
import IconHeader from "../../components/Headers/IconHeader";
import Typo from "../../components/utils/Typo";
import Space from "../../components/utils/Space";
import InputBox from "../../components/utils/InputBox";
import FullButton from "../../components/Buttons/FullButton";
import LoadingView from "../../components/utils/LoadingView";
import useStore from "../../store/index";
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { AUTH, dbFS } from "../../config/firebase";


function SignupScreen({navigation}){
    const [email,setEmail] = useState("")
    const [password,setPassword] = useState("")
    const [cpassword,setcPassword] = useState("")
    const [loading, setLoading] = useState(false);
    const setUserID = useStore((state) => state.setUserID);


    const handleSignup = async () => {
        if(cpassword === password) {
            if (email && password && cpassword) {
                setLoading(true);
                try {
                  // Sign up the user with email and password
                  const { user } = await createUserWithEmailAndPassword(
                    AUTH,
                    email,
                    password
                  );
          
                  await sendEmailVerification(user);
                  setUserID(user.uid);
                  console.log("Sign up successful, Please verify email",user.uid);
                  navigation.navigate("LoginScreen")
                  Alert.alert("Email Verification Required","Your signup has been succesfull, please verify your email to login.")
                } catch (err) {
                  setError(err.message);
                }
                setLoading(false);
              }
              else{
                Alert.alert("Please check all your fields")
              }
        }
        else{
            Alert.alert("Password Don't Match","Please make sure the passwords match.")
        }
    }



    return (
      <ImageBackground
      source={require("../../assets/images/signupbg.jpg")}
      style={styles.container}>
        <IconHeader
          handleLeftIconPress={() => navigation.goBack()}
          leftIcon={true}
        />
        <View style={styles.body}>
          <View style={styles.loginWrapper}>
            <View style={{ alignItems: "center" }}>
              <Typo style={{ fontSize: 30 }}>
                Sign up!
              </Typo>
              <Typo grey light>Create your account to get started</Typo>
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
              passwordMode={true}
              onChangeText={(text)=>setPassword(text)}
            />
            <Space space={15}/>
            <InputBox
              leftIcon={"lock-closed"}
              placeholder={"Confirm Password"}
              value={cpassword}
              passwordMode={true}
              onChangeText={(text)=>setcPassword(text)}
            />
           </View>
           <Space space={15}/>
           <View style={{flexDirection:'row',alignItems:'center'}}>
           <Typo s>By Signing up You agree to  </Typo>
           <TouchableOpacity onPress={()=>navigation.navigate("TermsConditions")}>
            <Typo style={{textDecorationLine:"underline",color:Theme.primaryColor}}>Terms and Conditions</Typo>
            </TouchableOpacity>
           </View>
           <Space space={25}/>

            <FullButton
            handlePress={handleSignup}
              color={Theme.primaryColor}
              label={"Sign up"}
            />
             <Space space={15}/>
              <TouchableOpacity onPress={()=>navigation.navigate("LoginScreen")}>
               <Typo s>Already have an account? <Typo bold s style={{textDecorationLine:"underline"}}>Login</Typo></Typo>
              </TouchableOpacity>
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
export default SignupScreen;

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