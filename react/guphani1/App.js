import React, { useState, useEffect } from 'react';
import { WebView } from 'react-native-webview';
import * as Location from 'expo-location';
import { BackHandler, Alert, Linking } from 'react-native';


function close() {
  Alert.alert("종료하시겠어요?", "확인을 누르면 종료합니다.", [
    {
      text: "취소",
      onPress: () => {},
      style: "cancel",
    },
    { text: "확인", onPress: () => BackHandler.exitApp() },
  ]);
}


export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  // 위치정보
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
      Alert.alert("위치정보 권한이 거절되었습니다.", "앱을 종료합니다.", [{ text: '확인', onPress: () => BackHandler.exitApp() }]);
    }
  };
  const webViewRef = React.useRef(null);

  useEffect(() => {
    getLocation();

    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      console.log();
      if (webViewRef.url === "https://www.guphani.com/html/index.html") {
        close();
      }
      if (webViewRef.current) {
        // WebView에서 뒤로가기 가능하면 처리하고 true 반환
        webViewRef.current.goBack();
        return true;
      } else {
        // WebView가 없거나 뒤로가기 불가능하면 종료 여부 확인 후 처리
        close()
        return true;
      }
    });

    return () => {
      backHandler.remove();
    };
  }, []);



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
