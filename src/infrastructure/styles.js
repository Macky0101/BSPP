
// styles.js
import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    container: {
      flex: 1,
      padding: 10,
    },
    welcomeContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    indicatorCardContainer: {
      width: '100%',
    },
    indicatorCard: {
      width: '100%',
      borderRadius: 5,
      padding: 20,
      marginVertical: 5,
      marginTop: 10,
    },
    header: {
      fontSize: 20,
      fontWeight: 'bold',
    },
    subtitle: {
      fontSize: 16,
    //   marginBottom: 5,
    },
    content: {
      marginTop: 10,
    },
    progressBar: {
      marginTop: 8,
      height: 8,
    },
});
