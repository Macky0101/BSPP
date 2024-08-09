import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { ProgressBar } from 'react-native-paper';
import { useTheme } from '../SettingsPage/themeContext';
import AuthService from '../../services/infrastructure';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import styles from './styles';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation

const Infrastructure = () => {
  const { theme } = useTheme();
  const [infrastructureData, setInfrastructureData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation(); 

  useEffect(() => {
    const fetchInfrastructure = async () => {
      try {
        const data = await AuthService.getInfrastructure();
        // console.log('dataSuivi',data);
        setInfrastructureData(data);
      } catch (error) {
        console.error('Failed to load infrastructure details:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchInfrastructure();
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
              {infrastructureData.map((infra) => (
                <TouchableOpacity
                key={infra.id}
                onPress={() => navigation.navigate('SuiviInfrastructure', { id: infra.id, codeInfrastructure: infra.CodeInfrastructure })}
                style={[styles.indicatorCard, { backgroundColor: theme.colors.card }]}
              >
                
                  <Text style={[styles.header, { color: theme.colors.primary }]}>{infra.NomInfrastructure}</Text>
                  <Text style={[styles.subtitle, { color: theme.colors.text }]}>{infra.CodeInfrastructure}</Text>
                  <View style={styles.content}>
                    <Text style={{ color: theme.colors.text }}>Maître Ouvrage: {infra.MaitreOuvrage}</Text>
                    <Text style={{ color: theme.colors.text }}>Entreprise Responsable: {infra.EntrepriseResponsable}</Text>
                    <Text style={{ color: theme.colors.text }}>Date Debut: {infra.DateDebut}</Text>
                    <Text style={{ color: theme.colors.text }}>Date Fin: {infra.DateFin}</Text>
                    <ProgressBar
                      progress={parseFloat(infra.TauxAvancementTechnique) / 100}
                      color={theme.colors.primary}
                      style={styles.progressBar}
                    />
                    <Text style={{ color: theme.colors.text }}>{`Avancement Technique: ${infra.TauxAvancementTechnique}%`}</Text>
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

export default Infrastructure;
