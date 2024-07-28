
// styles.js
import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  welcomeContainer: {
    alignItems: 'flex-start',
    marginBottom: 15,
    paddingTop: 15,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  indicatorCard: {
    flex: 1,
    borderRadius: 5,
    padding: 20,
    marginVertical: 10,
    width: '100%', // Makes the card take the full width of the screen
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
});
