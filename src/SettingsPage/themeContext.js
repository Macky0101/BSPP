// ThemeContext.js
import React, { createContext, useState, useContext } from 'react';

const ThemeContext = createContext();

const defaultTheme = {
  dark: false,
  colors: {
    primary: '#a05a2c',
    background: '#fff',
    card: 'rgba(230, 204, 178, 0.8)',
    text: '#000',
    border: '#a05a2c',
    notification: '#ff5252',
  },
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(defaultTheme);

  const changeTheme = (newTheme) => {
    setTheme((prevTheme) => ({
      ...prevTheme,
      colors: {
        ...prevTheme.colors,
        ...newTheme,
      },
    }));
  };

  return (
    <ThemeContext.Provider value={{ theme, changeTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
