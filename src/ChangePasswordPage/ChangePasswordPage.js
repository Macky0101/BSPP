import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, ScrollView } from 'react-native';
import { TextInput, Button, useTheme } from 'react-native-paper';
import AuthService from '../../services/authServices';
import { ProgressBar } from 'react-native-paper';
// Calculer la force du mot de passe sous forme de pourcentage
const getPasswordStrengthPercentage = (password) => {
  let strength = 0;

  // Vérifier la longueur du mot de passe
  if (password.length >= 8) strength += 0.25;

  // Vérifier s'il y a au moins une lettre minuscule
  if (/[a-z]/.test(password)) strength += 0.25;

  // Vérifier s'il y a au moins une lettre majuscule
  if (/[A-Z]/.test(password)) strength += 0.25;

  // Vérifier s'il y a au moins un chiffre
  if (/\d/.test(password)) strength += 0.25;

  // Vérifier s'il y a au moins un symbole
  if (/[@!#&$%^&*(),.?":{}|<>]/.test(password)) strength += 0.25;

  return Math.min(strength, 1.0); // Assurer que la valeur soit au maximum de 1.0
};

const ChangePasswordPage = () => {
  const { colors } = useTheme();
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordConfirmation, setNewPasswordConfirmation] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const isChangePasswordDisabled = !oldPassword || !newPassword || !newPasswordConfirmation || loading;
  // Fonction pour vérifier la validité du mot de passe
  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@!#&])[A-Za-z\d@!#&]{8,}$/;
    return passwordRegex.test(password);
  };
  const passwordStrengthPercentage = getPasswordStrengthPercentage(newPassword);


  const handleChangePassword = async () => {
    if (!validatePassword(newPassword)) {
      setError('Le mot de passe doit contenir au moins 8 caractères, une lettre majuscule, une lettre minuscule, un chiffre et un caractère spécial.');
      return;
    }

    if (newPassword !== newPasswordConfirmation) {
      setError('La confirmation du mot de passe ne correspond pas.');
      return;
    }

    setLoading(true);
    try {
      const response = await AuthService.changePassword(oldPassword, newPassword, newPasswordConfirmation);
      if (response && response.status === 'success') {
        Alert.alert('Succès', 'Mot de passe changé avec succès');
        // Réinitialisez les champs après la réussite de l'opération
        setOldPassword('');
        setNewPassword('');
        setNewPasswordConfirmation('');
        setError('');
      } else {
        setError('Échec du changement de mot de passe. Veuillez réessayer.');
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
          style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border }]}
          theme={{ colors: { primary: colors.primary } }}
        />
        <TextInput
          mode="outlined"
          label="Nouveau Mot de Passe"
          secureTextEntry
          value={newPassword}
          onChangeText={setNewPassword}
          style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border }]}
          theme={{ colors: { primary: colors.primary } }}
        />
        <TextInput
          mode="outlined"
          label="Confirmer le Nouveau Mot de Passe"
          secureTextEntry
          value={newPasswordConfirmation}
          onChangeText={setNewPasswordConfirmation}
          style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border }]}
          theme={{ colors: { primary: colors.primary } }}
        />
       
        <ProgressBar
          progress={passwordStrengthPercentage}
          color={
            passwordStrengthPercentage === 1.0
              ? 'green'
              : passwordStrengthPercentage >= 0.75
                ? 'orange'
                : 'red'
          }
          style={{ marginVertical: 10, height: 8 }}
        />

        <Button
          style={{ marginBottom: 10 }}
          mode="outlined"
          onPress={handleChangePassword}
          loading={loading}
          disabled={isChangePasswordDisabled}
        >
          Changer le mot de passe
        </Button>
        {error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : null}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 0,
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
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    marginBottom: 10,
    borderColor: '#a05a2c',
    fontSize: 13,
  },
  button: {
    marginTop: 20,
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
    textAlign: 'center',
  },
});

export default ChangePasswordPage;
