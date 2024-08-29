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
    logoContainer: {
      // position: 'absolute',
      // top: 10,
      // left: 10,
      width: 50,
      height: 50,
      borderRadius: 25,
      overflow: 'hidden',
    },
    logoImage: {
      width: '100%',
      height: '100%',
      resizeMode: 'cover',
    },
    header: {
      fontSize: 14,
      fontWeight: 'bold',
    },
    subtitle: {
      fontSize: 13,
    },
    content: {
      marginTop: 10,
    },
    progressBar: {
      marginTop: 8,
      height: 8,
    },
    errorContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    iconContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 5,
    },
    iconTextContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 5,
    },
});
