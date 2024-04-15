import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import Theme from '../../src/Theme';
const LoadingNavigate = () => {
  const navigation = useNavigation();
  
  useFocusEffect(
    React.useCallback(() => {
      navigation.replace('CreatePost');

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
