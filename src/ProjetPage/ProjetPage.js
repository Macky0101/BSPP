import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Card, Title, Paragraph, Divider } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; // Import pour les icônes
import * as Animatable from 'react-native-animatable'; // Import pour les animations
import AuthService from '../../services/authServices';
import { useTheme } from '../SettingsPage/themeContext';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import AuthServices from '../../services/indicateursServices';
import SkeletonCard from './../suiviProjet/SkeletonCard';

const ProjetPage = () => {
  const navigation = useNavigation();
  const [projectDetail, setProjectDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showObjectifs, setShowObjectifs] = useState(false);
  const [showIndicateurs, setShowIndicateurs] = useState(false);
  const { theme } = useTheme();
  const [indicatorData, setIndicatorData] = useState(null);
  useEffect(() => {
    const fetchIndicator = async () => {
      try {
        const data = await AuthServices.getIndicator();
        setIndicatorData(data);
        //  console.log('ca',data);
      } catch (error) {
        console.error('Failed to load indicator details:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchIndicator();
  }, []);
  useEffect(() => {
    const getProjectDetails = async () => {
      try {
        const project = await AuthService.getProjectDetails();
        setProjectDetail(project);
      } catch (error) {
        console.error('Failed to load project details:', error);
      } finally {
        setLoading(false);
      }
    };

    getProjectDetails();
  }, []);

  // if (loading) {
  //   return (
  //     <View style={styles.loadingContainer}>
  //       <ActivityIndicator size="large" color={theme.colors.primary} />
  //       <Text style={{ color: theme.colors.text }}>Chargement...</Text>
  //     </View>
  //   );
  // }
  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </View>
    );
  }

  if (!projectDetail) {
    return (
      <View style={styles.errorContainer}>
        <Text style={{ color: theme.colors.text }}>Echec du chargement des détails du projet.</Text>
      </View>
    );
  }

  const {
    Sigle, NomProjet, Description, DateDebut, DateFin, indicateurs, regions,
    objectifs, bailleurs, responsables
  } = projectDetail;

  const formatCurrency = (amount) => {
    return `${parseInt(amount).toLocaleString()} GNF`;
  };

 const totalBudget = bailleurs.reduce((acc, bailleur) => acc + parseInt(bailleur.Budget), 0);
  const totalDecaisse = bailleurs.reduce((acc, bailleur) => {
    return acc + bailleur.decaissement.reduce((subAcc, decaissement) => subAcc + parseInt(decaissement.montant_decaisser), 0);
  }, 0);

  return (
    <ScrollView style={{ ...styles.container, backgroundColor: theme.colors.background }}>
      <Animatable.View animation="fadeInUp" duration={600}>
        <Card style={[styles.card, { backgroundColor: theme.colors.card }]}>
          <Card.Content>
            <Title style={{ ...styles.title, color: theme.colors.text }}>
              <Icon name="information-outline" size={24} color={theme.colors.primary} /> Informations Générales
            </Title>
            <Paragraph style={{ color: theme.colors.text }}>
              <Text style={styles.label}>Sigle: </Text>{Sigle}
            </Paragraph>
            <Paragraph style={{ color: theme.colors.text }}>
              <Text style={styles.label}>Nom du Projet: </Text>{NomProjet}
            </Paragraph>
            <Paragraph style={{ color: theme.colors.text }}>
              <Text style={styles.label}>Description: </Text>{Description}
            </Paragraph>
            <Paragraph style={{ color: theme.colors.text }}>
              <Text style={styles.label}>Date début: </Text>{DateDebut}
            </Paragraph>
            <Paragraph style={{ color: theme.colors.text }}>
              <Text style={styles.label}>Date fin: </Text>{DateFin}
            </Paragraph>
          </Card.Content>
        </Card>
      </Animatable.View>

      <Divider style={{ ...styles.divider, backgroundColor: theme.colors.border }} />

      <TouchableOpacity onPress={() => setShowObjectifs(!showObjectifs)}>
        <Animatable.View animation="fadeInLeft" duration={600}>
          <Card style={[styles.card, { backgroundColor: theme.colors.card }]}>
            <Card.Content>
              <Title style={{ ...styles.title, color: theme.colors.text }}>
                <Icon name="target" size={24} color={theme.colors.primary} /> Objectifs du Projet     <MaterialIcons name={showObjectifs ? 'expand-less' : 'expand-more'} size={24} color={theme.colors.text} />
              </Title>
              {showObjectifs && objectifs.map((objectif, index) => (
                <Paragraph key={index} style={{ color: theme.colors.text }}>
                  {objectif.Intitule}
                </Paragraph>
              ))}
            </Card.Content>
          </Card>
        </Animatable.View>
      </TouchableOpacity>

      <Divider style={{ ...styles.divider, backgroundColor: theme.colors.border }} />

      <Animatable.View animation="fadeInRight" duration={600}>
        <Card style={[styles.card, { backgroundColor: theme.colors.card }]}>
          <Card.Content>
            <Title style={{ ...styles.title, color: theme.colors.text }}>
              <Icon name="map-marker-radius" size={24} color={theme.colors.primary} /> Zones Concernées
            </Title>
            {regions.map((region, index) => (
              <Paragraph key={index} style={{ color: theme.colors.text }}>
                {region.region.NomRegion}
              </Paragraph>
            ))}
          </Card.Content>
        </Card>
      </Animatable.View>



      <Divider style={{ ...styles.divider, backgroundColor: theme.colors.border }} />

      <Animatable.View animation="fadeInUp" duration={600}>
        <Card style={[styles.card, { backgroundColor: theme.colors.card }]}>
          <Card.Content>
            <Title style={{ ...styles.title, color: theme.colors.text }}>
              <Icon name="cash" size={24} color={theme.colors.primary} /> Bailleurs et Budgets
            </Title>
            {bailleurs.map((bailleur, index) => (
              <View key={index} style={styles.bailleurContainer}>
                <View style={styles.bailleurHeader}>
                  <Text style={{ ...styles.bailleurName, color: theme.colors.text }}>
                    {bailleur.CodeBailleur}
                  </Text>
                </View>
                <View style={styles.budgetContainer}>
                  <Text style={{ ...styles.label, color: theme.colors.text }}>Budget: </Text>
                  <Text style={{ color: theme.colors.text }}> {formatCurrency(bailleur.Budget)}</Text>
                </View>
                {bailleur.decaissement.length > 0 && (
                  <View style={styles.decaissementContainer}>
                    <Text style={{ ...styles.label, color: theme.colors.text }}>Montant Décaisse: </Text>
                    <Text style={{ color: theme.colors.text }}>{formatCurrency(bailleur.decaissement.reduce((acc, decaissement) => acc + parseInt(decaissement.montant_decaisser), 0))} </Text>
                  </View>
                )}
              </View>
            ))}
            <Divider style={{ ...styles.divider, backgroundColor: theme.colors.border }} />
            <View style={styles.totalContainer}>
              <Text style={{ ...styles.totalText, color: theme.colors.text }}>Total Budget: {formatCurrency(totalBudget)}</Text>
              <Text style={{ ...styles.totalText, color: theme.colors.text }}>Total Décaissement: {formatCurrency(totalDecaisse)}</Text>
            </View>
          </Card.Content>
        </Card>
      </Animatable.View>
      
      <Divider style={{ ...styles.divider, backgroundColor: theme.colors.border }} />

      <Animatable.View animation="fadeInRight" duration={600}>
        <Card style={[styles.card, { backgroundColor: theme.colors.card, backgroundColor: theme.colors.card }]}>
          <Card.Content>
            <Title style={{ ...styles.title, color: theme.colors.text }}>
              <Icon name="account-group" size={24} color={theme.colors.primary} /> Responsables
            </Title>
            {responsables.map((responsable, index) => (
              responsable.user ? (
                <View key={index} style={styles.responsableContainer}>
                  <Paragraph style={{ color: theme.colors.text }}>
                    <Text style={styles.label}>Nom: </Text>{responsable.user.Prenoms} {responsable.user.Nom}
                  </Paragraph>
                  <Paragraph style={{ color: theme.colors.text }}>
                    <Text style={styles.label}>Email: </Text>{responsable.user.email}
                  </Paragraph>
                </View>
              ) : (
                <Paragraph key={index} style={{ color: theme.colors.text }}>Responsable non attribué</Paragraph>
              )
            ))}
          </Card.Content>
        </Card>
      </Animatable.View>


      <Divider style={{ ...styles.divider, backgroundColor: theme.colors.border }} />

      <TouchableOpacity
        onPress={() => setShowIndicateurs(!showIndicateurs)}
      >
        <Animatable.View animation="fadeInLeft" duration={600}>
          <Card style={[styles.card, { backgroundColor: theme.colors.card }]}>
            <Card.Content>
              <Title style={{ ...styles.title, color: theme.colors.text }}>
                <Icon name="chart-line" size={24} color={theme.colors.primary} /> Indicateurs
                <MaterialIcons name={showIndicateurs ? 'expand-less' : 'expand-more'} size={24} color={theme.colors.text} />
              </Title>
              {showIndicateurs && indicatorData.map((indicateur, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => navigation.navigate('SuiviDetailPage', {
                    indicator: indicateur,
                    CibleFinProjet: indicateur.CibleFinProjet,
                    IntituleIndicateur: indicateur.IntituleIndicateur,
                  })}
                >
                  <Card style={[styles.indicatorCard, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
                    <Card.Title
                      title={` code: ${indicateur.CodeIndicateur} Valeur Cible: ${indicateur.CibleFinProjet}`}
                      titleStyle={{ color: theme.colors.text }}
                      right={(props) => (
                        <Icon {...props} name="arrow-right" size={36} color={theme.colors.primary} />
                      )}
                    />
                    <Card.Content>
                      <Paragraph style={{ color: theme.colors.text }}>
                        {indicateur.IntituleIndicateur}
                      </Paragraph>
                    </Card.Content>
                  </Card>
                </TouchableOpacity>
              ))}
            </Card.Content>
          </Card>
        </Animatable.View>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    marginVertical: 10,
    borderRadius: 8,
    elevation: 2,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  label: {
    fontWeight: 'bold',
  },
  paragraph: {
    fontSize: 16,
    // marginBottom: 5,
  },
  indicatorContainer: {
    marginBottom: 15,
  },
  responsableContainer: {
    marginBottom: 15,
  },
  divider: {
    // marginVertical: 10,
    // height: 1,
  },
  indicatorCard: {
    marginVertical: 10,
    padding: 10,
    borderRadius: 8,
    elevation: 2,
  },
  bailleurContainer: {
    marginVertical: 10,
  },
  bailleurHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  bailleurName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  budgetContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 5,
  },
  decaissementContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 5,
  },
  totalContainer: {
    marginTop: 20,
  },
  totalText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ProjetPage;
