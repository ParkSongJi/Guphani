import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, BackHandler } from 'react-native';
import { WebView } from 'react-native-webview';
import { Linking } from 'react-native';
import { History } from 'history';




const AppContent = () => {
  const webviewRef = useRef(null);
  
  useEffect(() => {
    const backAction = async () => {
      try {
        if (!webviewRef.current) {
          // 웹뷰가 아닐 경우 처리를 해주세요. 
          return false; 
        }
        // 만약 모달창이 아닐 경우에는 뒤로 가기를 해주세요. 
        webviewRef.current.goBack();
        return true;
      } catch (error) {
        console.error('Error checking:', error);
        return false;
      }
    };

    // 뒤로 가기 컨트롤러
    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => backHandler.remove();
  }, []);

  return (
    <View style={styles.container}>
      {/* WebView component */}
      <WebView
        ref={webviewRef}
        source={{ uri: 'https://www.guphani.com/html/index.html' }}
        originWhitelist={['*']} // 다른 쪽 예를 들면 서버나 API 다 열어주기 
        style={styles.webView} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webView: {
    flex: 1,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'white',
    backgroundColor: 'white',
    overflow: 'scroll',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

window.history.pushState(null, "", window.location.href);
useEffect(() => {
  const event = history.listen((listener) => {
    if (listener.action === "POP") {
      history.back();
      toggleModal();
    }
  });
  return event;
}, [history]);

export default AppContent;
