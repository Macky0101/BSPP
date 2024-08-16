import React from 'react';
import Onboarding from 'react-native-onboarding-swiper';
import { Image, StyleSheet } from 'react-native';

const IntroScreens = ({ navigation }) => {
  return (
    <Onboarding
      onSkip={() => navigation.replace('LoginPage')}
      onDone={() => navigation.replace('LoginPage')}
      nextLabel="Suivant" // Bouton "Next" en français
      skipLabel="Passer"  // Bouton "Skip" en français
      doneLabel="Terminé" // Bouton "Done" en français
      pages={[
        {
          backgroundColor: '#fff',
          image: <Image source={require('./../../assets/images/suivi.jpg')} style={styles.image} />,
          title: 'Suivi de Projet',
          subtitle: 'Suivez l\'avancement de vos projets en temps réel. Obtenez des informations détaillées sur le niveau d\'exécution, l\'état du projet, les contraintes et les décaissements.',
        },
        {
          backgroundColor: '#f7f7f7',
          image: <Image source={require('./../../assets/images/infrastructure.jpg')} style={styles.image} />,
          title: 'Suivi des Infrastructures',
          subtitle: 'Gardez un œil sur chaque infrastructure. Visualisez les images, les progrès techniques et les informations de projet associées.',
        },
        {
          backgroundColor: '#fff',
          image: <Image source={require('./../../assets/images/indicateur.jpg')} style={styles.image} />,
          title: 'Suivi des Indicateurs',
          subtitle: 'Suivez les indicateurs clés de vos projets. Renseignez les réalisations effectuées et ajoutez vos observations pour un suivi complet.',
        },
      ]}
    />
  );
};

const styles = StyleSheet.create({
  image: {
    width: 200,  // Ajustez la largeur selon vos besoins
    height: 200, // Ajustez la hauteur selon vos besoins
    resizeMode: 'contain', // Garde l'image dans ses proportions d'origine
    marginBottom: 20, // Espace en bas de l'image
  },
});

export default IntroScreens;
