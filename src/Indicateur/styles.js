import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    // flex: 1,
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
    marginVertical: 5, 
    backgroundColor: '#fff', // Couleur de fond pour la carte
    marginTop: 10,
  },
  IndicatorNav: {
    fontSize: 24,
  },
  indicatorLabel: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: '90%',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  modalContent: {
    width: '100%',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    width: '100%',
  },
  button: {
    padding: 10,
    borderRadius: 5,
  },
  cancelButton: {
    flex: 1,
    marginRight: 10,
    borderWidth: 1,
  },
  submitButton: {
    flex: 1,
    marginLeft: 10,
  },
  buttonText: {
    textAlign: 'center',
    fontSize: 16,
  },
  IndicatorNav: {
    paddingTop: 10,
    fontSize: 24,
    marginLeft: 10,
    textAlign: 'right',

  },



  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },





  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 40,
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  buttonContainer: {
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    flex: 1,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginHorizontal: 5,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  datePicker: {
    width: '100%',
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
  },
});
