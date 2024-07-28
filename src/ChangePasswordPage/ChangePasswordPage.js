import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, ScrollView } from 'react-native';
import { TextInput, Button, useTheme } from 'react-native-paper';
import AuthService from '../../services/authServices'; 


const ChangePasswordPage = () => {
  const { colors } = useTheme();
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordConfirmation, setNewPasswordConfirmation] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChangePassword = async () => {
    setLoading(true);
    try {
      const response = await AuthService.changePassword(oldPassword, newPassword, newPasswordConfirmation);
      if (response && response.status === 'success') {
        Alert.alert('Succès', 'Mot de passe changé avec succès');
        // Réinitialisez les champs après la réussite de l'opération
        setOldPassword('');
        setNewPassword('');
        setNewPasswordConfirmation('');
      } else {
        Alert.alert('Erreur', 'Échec du changement de mot de passe');
      }
    } catch (error) {
      Alert.alert('Erreur', 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={[styles.innerContainer, { backgroundColor: colors.background }]}>
        <Text style={[styles.title, { color: colors.text }]}>Changer le Mot de Passe</Text>
        <TextInput
          mode="outlined"
          label="Ancien Mot de Passe"
          secureTextEntry
          value={oldPassword}
          onChangeText={setOldPassword}
          style={[styles.input, { backgroundColor: colors.card }]}
          theme={{ colors: { primary: colors.primary } }}
        />
        <TextInput
          mode="outlined"
          label="Nouveau Mot de Passe"
          secureTextEntry
          value={newPassword}
          onChangeText={setNewPassword}
          style={[styles.input, { backgroundColor: colors.card }]}
          theme={{ colors: { primary: colors.primary } }}
        />
        <TextInput
          mode="outlined"
          label="Confirmer le Nouveau Mot de Passe"
          secureTextEntry
          value={newPasswordConfirmation}
          onChangeText={setNewPasswordConfirmation}
          style={[styles.input, { backgroundColor: colors.card }]}
          theme={{ colors: { primary: colors.primary } }}
        />
        <Button
          mode="contained"
          onPress={handleChangePassword}
          loading={loading}
          style={[styles.button, { backgroundColor: colors.primary }]}
        >
          Changer le Mot de Passe
        </Button>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 5,
  },
  innerContainer: {
    flex: 1,
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    marginBottom: 15,
    borderColor: '#a05a2c', // Assure le bord des inputs avec la couleur du thème
  },
  button: {
    marginTop: 20,
  },
});

export default ChangePasswordPage;
