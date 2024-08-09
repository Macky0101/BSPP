
// styles.js
import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    formGroup: {
        marginBottom: 10,
        minHeight: 60, // Assurez-vous que chaque groupe de formulaire a suffisamment d'espace
    },
    label: {
        fontSize: 16,
        marginBottom: 8,
    },
    input: {
        borderWidth: 1,
        borderRadius: 5,
        padding: 5,
        marginBottom: 10,
        minHeight: 40, // Hauteur minimale pour les champs d'entrée
    },
    errorText: {
        color: 'red',
        marginTop: -10,
        marginBottom: 10,
    },
});
