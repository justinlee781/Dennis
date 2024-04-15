import React, { useRef, useState, useEffect } from "react";
import { 
    View,
    StyleSheet,
    ActivityIndicator,
    Alert,
} from "react-native";
import Theme from "../../src/Theme";
import IconHeader from "../../components/Headers/IconHeader";
import FullButton from "../../components/Buttons/FullButton";
import SelectOption from "../../components/AccountSetup/SelectOption";
import EnterDetails from "../../components/AccountSetup/EnterDetails";
import Swiper from 'react-native-swiper'
import SelectService from "../../components/AccountSetup/SelectService";
import useStore from "../../store";
import { doc, getDoc, setDoc } from "firebase/firestore"
import { dbFS } from "../../config/firebase"
import LoadingView from "../../components/utils/LoadingView";

function AccountSetupScreen({ navigation, route }) {
    const userID = useStore((state) => state.userID);
    const setUserData = useStore((state) => state.setUserData);

    const [userRole, setUserRole] = useState("");
    const [fullName, setFullName] = useState("");
    const [currentIndex, setCurrentIndex] = useState(0);
    const swiperRef = useRef(null);
    const { email } = route.params;
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      fetchUserData();
    }, [userID]); // Fetch user data as soon as the component mounts

    const fetchUserData = async () => {
      if (userID) {
        const userRef = doc(dbFS, "users", userID);
      
        try {
          const docSnapshot = await getDoc(userRef);
          if (docSnapshot.exists()) {
            setUserData(docSnapshot.data());
            console.log("User Data Found: ", docSnapshot.data());
            navigation.replace("MainRoute");
          } else {
            console.log("USER NEW : Proceeding with account setup.... ");
            setLoading(false);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          setLoading(false);
        }
      }
    };

    const handleSelectOption = (option) => {
      setUserRole(option);
    };

    const handleNext = async () => {
        if (currentIndex < 1) {
            swiperRef.current.scrollBy(1);
        } else {
            if (userRole && fullName) {
                const userRef = doc(dbFS, "users", userID);
                setLoading(true)
                try {
                    await setDoc(userRef, {
                        email: email,
                        userRole: userRole,
                        userName: fullName,
                        userID: userID
                    });

                    // Re-fetch user data after setting it
                    await fetchUserData();
                    setLoading(false)
                } catch (error) {
                    console.error("Error adding user details:", error);
                    Alert.alert("An error occurred. Please try again later.");
                }
            } else {
                Alert.alert("Please make sure to enter all inputs");
            }
        }
    };

    if (loading) {
      return (
        <View style={{flex:1,justifyContent:'center',alignItems:'center',backgroundColor:Theme.backgroundColor}}>
          <ActivityIndicator color={Theme.primaryColor} size={'large'} />
        </View>
      )
    }

    return (
      <View style={styles.container}>
        <IconHeader />
        <View style={styles.body}>
          <Swiper
            ref={swiperRef}
            activeDotColor={Theme.primaryColor}
            dotColor="#e5e5e5"
            paginationStyle={{ bottom: 25 }}
            showsButtons={false}
            onIndexChanged={(index) => setCurrentIndex(index)}
            loop={false}
          >
            <View style={{ paddingHorizontal: 20 }}>
              <EnterDetails fullName={fullName} setFullName={setFullName} />
            </View>
            <View style={{ paddingHorizontal: 20 }}>
              <SelectOption
                option={userRole}
                handleSelectOption={handleSelectOption}
              />
            </View>
          </Swiper>
        </View>

        <View style={styles.button}>
          <FullButton
            handlePress={handleNext}
            color={Theme.primaryColor}
            label={currentIndex === 1 ? "Continue" : "Next"}
          />
        </View>

        {loading ? <LoadingView /> : null}
      </View>
    );
}

export default AccountSetupScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Theme.backgroundColor,
    },
    loginWrapper: {
        flex: 1,
        alignItems: "center",
        paddingHorizontal: 20,
        justifyContent: "space-evenly",
    },
    socialWrapper: {
        flex: 1,
        paddingHorizontal: 20,
        justifyContent: "space-evenly",
        paddingBottom: 25,
    },
    body: {
        flex: 1,
        paddingTop: '5%'
    },
    button: {
        width: "100%",
        alignItems: "center",
        paddingHorizontal: 20,
        paddingBottom: 25,
    },
});
