import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  welcomeContainer: {
    // alignItems: 'flex-start',
    marginBottom: 15,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  indicatorCardContainer: {
    width: '100%', // Assurez-vous que le conteneur prend toute la largeur
  },
  indicatorCard: {
    width: '100%', // Assurez-vous que la carte prend toute la largeur du conteneur
    borderRadius: 5,
    padding: 20,
    marginVertical: 5, // Ajout d'espace vertical entre les cartes
    backgroundColor: '#fff', // Couleur de fond pour la carte
  },
  IndicatorNav: {
    fontSize: 24,
  },
  indicatorLabel: {
    fontSize: 16,
    marginBottom: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  mesbutton:{
    padding: 10,
    backgroundColor:'#dddddd',
    borderRadius: 5,
    color: '#FFFFFF',
    alignItems: 'center',
    marginBottom: 4,
  },
  mesbutton1:{
    padding: 10,
    backgroundColor:'#dddddd',
    borderRadius: 5,
    color: '#FFFFFF',
    alignItems: 'center',
    marginBottom: 4,
  }

});
