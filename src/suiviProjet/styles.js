
// styles.js
import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    // paddingTop: 20,
    // position: 'relative', // Ajout de position relative
  },
  welcomeContainer: {
    alignItems: 'flex-start',
    // marginBottom: 15,
    // paddingTop: 15,
    justifyContent: 'space-between',
    flexDirection: 'row'
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  indicatorCard: {
    flex: 1,
    borderRadius: 5,
    padding: 20,
    marginVertical: 10,
    width: '100%',
  },
  cardContent: {
    marginBottom: 10,
  },
  IndicatorNav: {
    fontSize: 24,
    alignSelf: 'flex-end',
  },
  indicatorLabel: {
    fontSize: 16,
    marginBottom: 5,
  },
  progressBar: {
    height: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  closeModal: {
    // alignContent: 'flex-end',
    // alignItems: 'center',
  },
  ModalTitleCont: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
  },
  modalTitle: {
    fontSize: 16,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
  showMoreText: {
    marginTop: 5,
    fontWeight: 'bold',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent:{
    width: '100%',
    height: '100%',
  }
});
