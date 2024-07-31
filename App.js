// App.js
import React from 'react';
import { ThemeProvider } from './src/SettingsPage/themeContext';
import Routes from './routes/routes'; 
import { ModalPortal } from 'react-native-modals';

const App = () => {
  return (
    <ThemeProvider>
      <Routes /> 
      <ModalPortal />
    </ThemeProvider>
  );
};

export default App;
