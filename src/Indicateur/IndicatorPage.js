import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../SettingsPage/themeContext';
import AuthService from '../../services/indicateursServices';
import styles from './styles';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Modal, ModalContent } from 'react-native-modals';

const IndicatorPage = () => {
  const { theme } = useTheme();
  const [indicatorData, setIndicatorData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchIndicator = async () => {
      try {
        const data = await AuthService.getIndicator();
        setIndicatorData(data);
        // console.log(data);
      } catch (error) {
        console.error('Failed to load indicator details:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchIndicator();
  }, []);

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <View style={{ flex: 1 }}>
        <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
          <View style={styles.welcomeContainer}>
            <View style={styles.indicatorCardContainer}>
              {indicatorData && indicatorData.map((indicator) => (
                <TouchableOpacity
                  key={indicator.CodeIndicateur}
                  onPress={() => navigation.navigate('SuiviDetailPage', { indicator })}
                >
                  <View style={[styles.indicatorCard, { backgroundColor: theme.colors.card }]}>
                    <Text style={[styles.indicatorLabel, { color: theme.colors.text }]}>
                      {indicator.CodeIndicateur}: {indicator.IntituleIndicateur}
                    </Text>
                    <View style={styles.buttonContainer}>
                    <Text style={[styles.indicatorLabel, { color: theme.colors.text }]}>
                      Cible: {indicator.CibleFinProjet}
                    </Text>
                    
                      <MaterialIcons name="list" style={[styles.IndicatorNav, { color: theme.colors.primary }]} />
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaProvider>
  );
};

export default IndicatorPage;
