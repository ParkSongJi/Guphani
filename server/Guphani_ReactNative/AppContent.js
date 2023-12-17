import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, BackHandler, Linking } from 'react-native';
import { WebView } from 'react-native-webview';
import { useNavigation } from '@react-navigation/native';

const AppContent = () => {
  const navigation = useNavigation();
  const webviewRef = useRef(null);

  const backAction = () => {
    if (webviewRef.current) {
      // Check if WebView can go back
      webviewRef.current.goBack();
      return true; // Return true to prevent default behavior
    } else {
      return true;
    }
  };

  const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

  useEffect(() => {
    return () => backHandler.remove();
  }, [backHandler]);

  return (
    <View style={styles.container}>
      <WebView
        ref={webviewRef}
        source={{ uri: 'https://www.guphani.com/html/index.html'}}
        onShouldStartLoadWithRequest={(event) => {
          if (event.url.startsWith('tel:')) {
            Linking.openURL(event.url);
            return false;
          }
          return true;
        }}
        onError={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
          console.warn('WebView error: ', nativeEvent);
        }}
        originWhitelist={['*']}
        style={styles.webView}
        javaScriptEnabled={true}
        bounces={false}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        onLoadEnd={this.onLoadEnd}
        onError={this.onError}
        mixedContentMode={'never'} // security
        startInLoadingState={true}
        javaScriptEnabledAndroid={true}
        onMessage={m => this.onMessage(m)} 
        onMessage={(event) => {
          const message = event.nativeEvent.data;
          if (message.startsWith('tel:')) {
            Linking.openURL(message);
          }
        }}
        domStorageEnabled
        cacheEnabled
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webView: {
    marginTop: 1,
    marginBottom: 1,
    marginLeft: 0.5,
    marginRight: 0.5,
    width: '100%',
    height: '100%',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'white',
    backgroundColor: 'white',
    overflow: 'scroll',
  },
});

export default AppContent;
