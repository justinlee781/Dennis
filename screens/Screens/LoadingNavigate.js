import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import Theme from '../../src/Theme';
import useStore from '../../store';
import { dbFS } from '../../config/firebase';
import { doc, getDoc,setDoc } from 'firebase/firestore';

const LoadingNavigate = () => {
  const navigation = useNavigation();
  const userID = useStore(state => state.userID);

  
  useFocusEffect(
    React.useCallback(() => {
      const checkSellerDetails = async () => {
        try {
          const sellerDetailsRef = doc(dbFS, 'sellerDetails', userID);
          const sellerDetailsSnapshot = await getDoc(sellerDetailsRef);
          const sellerDetailsData = sellerDetailsSnapshot.data();

          if (
            sellerDetailsSnapshot.exists() &&
            sellerDetailsData &&
            sellerDetailsData.accountID &&
            sellerDetailsData.stripeLinkingProcessFinished === true
          ) {
            navigation.replace('CreatePost');
          } else {
            if (!sellerDetailsSnapshot.exists() || !sellerDetailsData || !sellerDetailsData.accountID) {
              await setDoc(doc(dbFS, 'sellerDetails', userID), { stripeLinkingProcessFinished: false });
            }
            navigation.replace('BecomeSeller');
          }
          
        } catch (error) {
          console.error("Error checking seller details: ", error);
          navigation.navigate('BecomeSeller');
        } finally {
          setLoading(false);
        }
      };

      checkSellerDetails();

      return () => {};
    }, [navigation])
  );

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" color={Theme.primaryColor} />
    </View>
  );
};

export default LoadingNavigate;
