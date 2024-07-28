import React from 'react';
import { createMaterialBottomTabNavigator } from 'react-native-paper/react-navigation';
import HomePage from '../../src/homePage/home';
import SuiviProjet from '../../src/suiviProjet/SuiviProjet';
import SettingsScreen from '../../src/SettingsPage/SettingsPage';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '../../src/SettingsPage/themeContext';

const Tab = createMaterialBottomTabNavigator();

function MyTabs() {
  const { theme } = useTheme();

  return (
    <Tab.Navigator
      initialRouteName='Accueil'
      // barStyle={{ backgroundColor: theme.colors.primary }}
    >
      <Tab.Screen
        name="Accueil"
        component={HomePage}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="home" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen
        name="SuiviProjet"
        component={SuiviProjet}
        options={{
          tabBarLabel: 'Suivi projet',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="clipboard-list-outline" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen
        name="SettingsScreen"
        component={SettingsScreen}
        options={{
          tabBarLabel: 'Paramètre',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="cog" color={color} size={26} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default MyTabs;
