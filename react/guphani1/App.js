import React, { useState, useEffect } from 'react';
import { WebView } from 'react-native-webview';
import * as Location from 'expo-location';
import { BackHandler, Alert } from 'react-native';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  const getLocation = async () => {
    try {
      await Location.requestForegroundPermissionsAsync();
      const { coords: { latitude, longitude } } = await Location.getCurrentPositionAsync();
      console.log(latitude, longitude);
      setIsLoading(false);

      // WebView를 새로고침하는 로직 추가
      if (webViewRef.current) {
        webViewRef.current.reload();
      }

    } catch (error) {
      console.error(error);
      Alert.alert("Can't find you. ", "So sad");
    }
  };

  useEffect(() => {
    getLocation();

    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (webViewRef.current) {
        // WebView에서 뒤로가기 가능하면 처리하고 true 반환
        webViewRef.current.goBack();
        return true;
      } else {
        // WebView가 없거나 뒤로가기 불가능하면 종료 여부 확인 후 처리
        Alert.alert(
          '앱 종료',
          '앱을 종료하시겠습니까?',
          [
            { text: '아니오', onPress: () => false, style: 'cancel' },
            { text: '예', onPress: () => BackHandler.exitApp() },
          ],
          { cancelable: false }
        );
        return true;
      }
    });

    return () => {
      backHandler.remove();
    };
  }, []);

  const webViewRef = React.useRef(null);

  return (
    <WebView
      ref={webViewRef}
      source={{ uri: 'https://www.guphani.com/html/index.html' }}
      onShouldStartLoadWithRequest={(event) => {
        if (event.url.startsWith('tel:') || event.url.startsWith('sms:')) {
          Linking.openURL(event.url);
          return false;
        }
        return true;
      }}
      onMessage={(event) => {
        const message = event.nativeEvent.data;
        if (message.startsWith('tel:') || message.startsWith('sms:')) {
          Linking.openURL(message);
        }
      }}
    />
  );
}