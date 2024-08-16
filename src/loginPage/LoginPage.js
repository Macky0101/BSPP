import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import * as Animatable from 'react-native-animatable';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import Toast from 'react-native-toast-message';
import styles from './styles';
import AuthService from '../../services/authServices';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';


const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const data = await AuthService.login(email, password);
      Toast.show({
        type: 'success',
        text1: `Bienvenue, ${data.user.Prenoms}`
      });
      setLoading(false);
      navigation.replace('retour', { screen: 'Accueil' });
    } catch (error) {
      console.error('Login error:', error);
      Toast.show({
        type: 'error',
        text1: 'Erreur de connexion',
        text2: 'Veuillez vérifier vos identifiants'
      });
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={['#F2D6C8', '#0F131D']} style={styles.container}>
      {/* <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}> */}
        {/* <TouchableWithoutFeedback onPress={Keyboard.dismiss}> */}
        <KeyboardAwareScrollView
            enableOnAndroid={true}
            extraScrollHeight={10} // Augmente la marge entre le clavier et le contenu
            contentContainerStyle={styles.inner}
        >
          {/* <ScrollView contentContainerStyle={styles.inner}> */}
            <Animatable.View animation="fadeInUp" style={styles.circleContainer} />
            <Text style={styles.title}>Bienvenue sur B.S.P.P</Text>
            <Image style={styles.loginTopLogo} source={require('./../../assets/images/logo/logo_BSPP.png')} resizeMode="contain" />
            <Text style={styles.subtitle}>Bureau de Suivi des Priorités Présidentielles</Text>

            <View style={styles.inputContainer}>
              <Icon name="person" size={20} color="#fff" style={{ paddingRight: 5 }} />
              <TextInput
                style={styles.input}
                placeholder="Nom d’utilisateur"
                keyboardType="email"
                placeholderTextColor="#ddd"
                value={email}
                onChangeText={setEmail}
              />
            </View>

            <View style={styles.inputContainer}>
              <Icon name="lock" size={20} color="#fff" style={{ paddingRight: 5 }} />
              <TextInput
                style={styles.input}
                placeholder="Mot de passe"
                placeholderTextColor="#ddd"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
                <Text style={styles.buttonText}>{loading ? 'Connexion en cours...' : 'Connexion'}</Text>
              </TouchableOpacity>
            </View>

            {loading && (
              <View style={styles.modalBackground}>
                <View style={styles.activityIndicatorWrapper}>
                  <ActivityIndicator animating={loading} size="large" color="#FFFFFF" />
                </View>
              </View>
            )}
            
          {/* </ScrollView> */}
          </KeyboardAwareScrollView>
        {/* </TouchableWithoutFeedback> */}
      {/* </KeyboardAvoidingView> */}
      <Toast />
    </LinearGradient>
  );
};

export default LoginPage;
