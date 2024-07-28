// App.js
import React from 'react';
import { ThemeProvider } from './src/SettingsPage/themeContext';
import Routes from './routes/routes'; 
import { ModalPortal } from 'react-native-modals';
// import Toast from 'react-native-toast-message';

const App = () => {
  return (
    <ThemeProvider>
      <Routes /> 
      <ModalPortal />
      {/* <Toast /> */}
    </ThemeProvider>
  );
};

export default App;
