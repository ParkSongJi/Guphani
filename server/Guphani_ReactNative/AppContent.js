import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, BackHandler } from 'react-native';
import { WebView } from 'react-native-webview';

const AppContent = () => {
  const webviewRef = useRef(null);

  const handleBackButton = () => {
    if (webviewRef.current) {
      webviewRef.current.goBack();
      return true;
    }
    return false;
  };

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      // 웹뷰에서 뒤로 가기 처리
      if (handleBackButton()) {
        return true;
      }

      // 모달이 열려있는 경우 모달 닫기
      if (isModalDisplayed) {
        closeModal(); // closeModal 함수를 여기에 추가하세요.
        return true;
      }

      // 앱 종료 또는 다른 처리
      return false;
    });

    return () => backHandler.remove();
  }, [isModalDisplayed]);

  return (
    <View style={styles.container}>
      {/* WebView component */}
      <WebView
        ref={webviewRef}
        source={{ uri: 'https://www.guphani.com/html/index.html' }}
        originWhitelist={['*']}
        style={styles.webView}
      />
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
});

export default AppContent;