import React from 'react';
import { WebView } from 'react-native-webview';

const App = () => {
  return (
    <WebView 
      source={{ uri: 'http://guphani.dothome.co.kr/guphani/html/index.html' }} 
      // style={{ marginTop: 20 }} 
    />
  );
}

export default App;