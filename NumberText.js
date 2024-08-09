import React, { useEffect, useState } from 'react';
import { Text } from 'react-native';
import * as Font from 'expo-font';

const CustomText = ({ style, children, ...props }) => {
  const [fontLoaded, setFontLoaded] = useState(false);

  useEffect(() => {
    const loadFonts = async () => {
      await Font.loadAsync({
        'MaPolice': require('./assets/fonts/Lora/static/Lora-Bold.ttf'), 
      });
      setFontLoaded(true);
    };

    loadFonts();
  }, []);

  if (!fontLoaded) {
    return null; // Vous pouvez afficher un indicateur de chargement ici si nécessaire
  }

  return (
    <Text {...props} style={[{ fontFamily: 'MaPolice' }, style]}>
      {children}
    </Text>
  );
};

export default CustomText;
