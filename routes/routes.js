import React, { useEffect, useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoginPage from '../src/loginPage/LoginPage';
import HomePage from '../src/homePage/home';
import ProjetPage from '../src/ProjetPage/ProjetPage';
import { useTheme } from '../src/SettingsPage/themeContext';
import MyTabs from '../src/tab/BottomTabNavigation';
import SuiviProjet from '../src/suiviProjet/SuiviProjet';
import IndicatorPage from '../src/Indicateur/IndicatorPage';
import ChangePasswordPage from '../src/ChangePasswordPage/ChangePasswordPage';
import SuiviDetailPage from '../src/Indicateur/SuiviDetailsPage';
import Infrastructure from '../src/infrastructure/Infrastructure'
import SuiviInfrastructure from '../src/SuiviInfrastructure/SuiviInfrastructure';
import SuiviDetail from '../src/suiviProjet/SuiviDetail';
import IntroScreens from '../src/loginPage/IntroScreens';

const Stack = createStackNavigator();

const Routes = () => {
  const { theme } = useTheme();
  const [initialRoute, setInitialRoute] = useState(null); // Start with null to avoid early render

  useEffect(() => {
    const checkToken = async () => {
      const token = await AsyncStorage.getItem('userToken');
      if (token) {
        setInitialRoute('MyTabs');
      } else {
        setInitialRoute('IntroScreens');
      }
    };

    checkToken();
  }, []);

  if (initialRoute === null) {
    // Optionally show a loading screen while checking the token
    return null;
  }

  return (
    <NavigationContainer theme={theme}>
      <Stack.Navigator initialRouteName={initialRoute}>
        <Stack.Screen
          name="retour"
          component={MyTabs}
          options={{ headerShown: false }}
        />
         <Stack.Screen
          name="IntroScreens"
          component={IntroScreens}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="LoginPage"
          component={LoginPage}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="SuiviProjet"
          component={SuiviProjet}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Accueil"
          component={HomePage}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ProjetPage"
          component={ProjetPage}
          options={{ title: 'Projet' }}
        />
        <Stack.Screen
          name="IndicatorPage"
          component={IndicatorPage}
          options={{ title: 'Indicateur' }}
        />
         <Stack.Screen
          name="SuiviDetailPage"
          component={SuiviDetailPage}
          options={{ title: 'Suivi Indicateur' }}
        />
         <Stack.Screen
          name="ChangePasswordPage"
          component={ChangePasswordPage}
          options={{ title: 'Changer le mot de passe' }}
        />
         <Stack.Screen
          name="Infrastructure"
          component={Infrastructure}
          options={{ title: 'Infrastructure' }}
        />
        <Stack.Screen
          name="SuiviInfrastructure"
          component={SuiviInfrastructure}
          options={{ title: 'Suivi Infrastructure' }}
        />
         <Stack.Screen
          name="SuiviDetail"
          component={SuiviDetail}
          options={{ title: 'Détails du Suivi' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Routes;
