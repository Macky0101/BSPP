import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Card, Title, Paragraph, Divider } from 'react-native-paper';
import AuthService from '../../services/authServices';
import { useTheme } from '../SettingsPage/themeContext';

const ProjetPage = () => {
  const [projectDetail, setProjectDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showObjectifs, setShowObjectifs] = useState(false);
  const [showIndicateurs, setShowIndicateurs] = useState(false);
  const { theme } = useTheme();

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

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={{ color: theme.colors.text }}>Chargement...</Text>
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

  return (
    <ScrollView style={{ ...styles.container, backgroundColor: theme.colors.background }}>
      <Card style={[styles.card, { backgroundColor: theme.colors.card }]}>
        <Card.Content>
          <Title style={{ ...styles.title, color: theme.colors.text }}>Informations Générales</Title>
          <Paragraph style={{color: theme.colors.Ttext,color: theme.colors.text}}><Text style={{ ...styles.label, color: theme.colors.text }}>Sigle: </Text>{Sigle}</Paragraph>
          <Paragraph style={{color: theme.colors.Ttext, color: theme.colors.text}}><Text style={{ ...styles.label, color: theme.colors.text }}>Nom du Projet: </Text>{NomProjet}</Paragraph>
          <Paragraph style={{color: theme.colors.Ttext, color: theme.colors.text}}><Text style={{ ...styles.label, color: theme.colors.text }}>Description: </Text>{Description}</Paragraph>
          <Paragraph style={{color: theme.colors.Ttext, color: theme.colors.text}}><Text style={{ ...styles.label, color: theme.colors.text }}>Date début: </Text>{DateDebut}</Paragraph>
          <Paragraph style={{color: theme.colors.Ttext, color: theme.colors.text}}><Text style={{ ...styles.label, color: theme.colors.text }}>Date fin: </Text>{DateFin}</Paragraph>
        </Card.Content>
      </Card>

      <Divider style={{ ...styles.divider, backgroundColor: theme.colors.border }} />

      <TouchableOpacity onPress={() => setShowObjectifs(!showObjectifs)}>
        <Card style={[styles.card, { backgroundColor: theme.colors.card }]}>
          <Card.Content>
            <Title style={{ ...styles.title, color: theme.colors.text }}>Objectifs du Projet</Title>
            {showObjectifs && objectifs.map((objectif, index) => (
              <Paragraph key={index} style={{ ...styles.paragraph, color: theme.colors.text }}>{objectif.Intitule}</Paragraph>
            ))}
          </Card.Content>
        </Card>
      </TouchableOpacity>

      <Divider style={{ ...styles.divider, backgroundColor: theme.colors.border }} />

      <Card style={[styles.card, { backgroundColor: theme.colors.card }]}>
        <Card.Content>
          <Title style={{ ...styles.title, color: theme.colors.text }}>Zones Concernées</Title>
          {regions.map((region, index) => (
            <Paragraph key={index} style={{ ...styles.paragraph, color: theme.colors.text }}>{region.region.NomRegion}</Paragraph>
          ))}
        </Card.Content>
      </Card>

      <Divider style={{ ...styles.divider, backgroundColor: theme.colors.border }} />

      <TouchableOpacity onPress={() => setShowIndicateurs(!showIndicateurs)}>
        <Card style={[styles.card, { backgroundColor: theme.colors.card }]}>
          <Card.Content>
            <Title style={{ ...styles.title, color: theme.colors.text }}>Indicateurs</Title>
            {showIndicateurs && indicateurs.map((indicateur, index) => (
              <View key={index} style={styles.indicatorContainer}>
                <Paragraph style={{color: theme.colors.Ttext, color: theme.colors.text}}><Text style={{ ...styles.label, color: theme.colors.text }}>Code: </Text>{indicateur.CodeIndicateur}</Paragraph>
                <Paragraph style={{color: theme.colors.Ttext, color: theme.colors.text}}><Text style={{ ...styles.label, color: theme.colors.text }}>Intitulé: </Text>{indicateur.IntituleIndicateur}</Paragraph>
                <Paragraph style={{color: theme.colors.Ttext, color: theme.colors.text}}><Text style={{ ...styles.label, color: theme.colors.text }}>Cible: </Text>{indicateur.CibleFinProjet}</Paragraph>
              </View>
            ))}
          </Card.Content>
        </Card>
      </TouchableOpacity>

      <Divider style={{ ...styles.divider, backgroundColor: theme.colors.border }} />

      <Card style={[styles.card, { backgroundColor: theme.colors.card }]}>
        <Card.Content>
          <Title style={{ ...styles.title, color: theme.colors.text }}>Responsables</Title>
          {responsables.map((responsable, index) => (
            responsable.user ? (
              <View key={index} style={styles.responsableContainer}>
                <Paragraph style={{color: theme.colors.Ttext, color: theme.colors.text}}><Text style={{ ...styles.label, color: theme.colors.text }}>Nom: </Text>{responsable.user.Prenoms} {responsable.user.Nom}</Paragraph>
                <Paragraph style={{color: theme.colors.Ttext, color: theme.colors.text}}><Text style={{ ...styles.label, color: theme.colors.text }}>Email: </Text>{responsable.user.email}</Paragraph>
              </View>
            ) : (
              <Paragraph key={index} style={{ color: theme.colors.text }}>Responsable non attribué</Paragraph>
            )
          ))}
        </Card.Content>
      </Card>

      <Divider style={{ ...styles.divider, backgroundColor: theme.colors.border }} />

      <Card style={[styles.card, { backgroundColor: theme.colors.card }]}>
        <Card.Content>
          <Title style={{ ...styles.title, color: theme.colors.text }}>Bailleurs</Title>
          {bailleurs.map((bailleur, index) => (
            <Paragraph key={index} style={{ ...styles.paragraph, color: theme.colors.text, color: theme.colors.text }}><Text style={{ ...styles.label, color: theme.colors.text }}>Budget: </Text>{bailleur.Budget}</Paragraph>
          ))}
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 2,
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
    marginVertical: 5,
    borderRadius: 3,
    elevation: 1,
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
    marginBottom: 5,
  },
  indicatorContainer: {
    marginBottom: 15,
  },
  responsableContainer: {
    marginBottom: 15,
  },
  divider: {
    marginVertical: 0,
    height: 1,
  },
});

export default ProjetPage;
