import React from 'react';
import { View, Text, StyleSheet, Linking } from 'react-native';
import { useTheme } from './themeContext';
import { Button, Card, Title, Divider } from 'react-native-paper';
import Toast from 'react-native-toast-message';
import { useNavigation } from '@react-navigation/native';
import AuthService from '../../services/authServices';

const SettingsPage = () => {
  const { changeTheme, theme } = useTheme();
  const navigation = useNavigation();

  const themes = [
    {
      primary: '#018F8F',
      background: '#fff',
      card: '#f0f0f0',
      text: '#000',
      border: '#ddd', 
    },
    {
      primary: '#f9d310', // New green color
      background: '#fff',
      card: '#018F8F',   // New yellow color
      text: '#000',
      border: '#006666',
    },
    {
      primary: '#a05a2c',
      background: '#fff',
      card: 'rgba(230, 204, 178, 0.8)',
      text: '#000',
      border: '#a05a2c',
    },
    {
      primary: '#fff',
      background: '#000',
      card: '#333',
      text: '#fff',
      border: '#fff',
      Ttext: '#ddd'
    },
  ];

  const changePassword = () => {
    navigation.navigate('ChangePasswordPage');
  };

  const deconnexion = async () => {
    try {
      await AuthService.logout();
      Toast.show({
        type: 'success',
        text1: 'Déconnexion réussie'
      });
      navigation.navigate('LoginPage');
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Erreur de déconnexion',
        text2: 'Veuillez réessayer'
      });
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background, padding: 20 }}>
      <Title style={{ color: theme.colors.text, marginBottom: 10 }}>Thèmes</Title>
      {themes.map((theme, index) => (
        <View style={{ flexDirection: '' }} key={index}>
          <Button
            style={{ ...styles.card, backgroundColor: theme.card }}
            onPress={() => changeTheme(theme)}
          >
            <Card.Content>
              <Text style={{ color: theme.primary }}>Thème {index + 1}</Text>
            </Card.Content>
          </Button>
        </View>
      ))}
      <Divider style={{ marginVertical: 20, backgroundColor: theme.primary }} />
    
      <Title style={{ color: theme.colors.text, marginBottom: 10 }}>Sécurité</Title>
      <Button style={{ marginBottom: 10 }} mode="outlined" onPress={changePassword} color={theme.primary}>
        Changer le mot de passe
      </Button>
      <Button mode="outlined" onPress={deconnexion} color={theme.primary}>
        Déconnexion
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical: 5,
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
});

export default SettingsPage;
