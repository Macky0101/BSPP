import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BSPP_URL = 'https://project-files.org/bspp/public';

const SuiviProjetService = {
    AddSuiviProjet: async (newAddSuiviProjet) => {
        try {
            const codeProjet = await AsyncStorage.getItem('codeProjet');
            if (!codeProjet) {
                throw new Error('CodeProjet not found in AsyncStorage');
            }
            const token = await AsyncStorage.getItem('userToken');
            if (!token) {
                throw new Error('User token not found in AsyncStorage');
            }

            const dataToSend = {
                DateSuivi: newAddSuiviProjet.DateSuivi,
                NiveauExecution: newAddSuiviProjet.NiveauExecution,
                TauxAvancementPhysique: newAddSuiviProjet.TauxAvancementPhysique,
                CodeProjet: codeProjet,
                StatutProjet: newAddSuiviProjet.StatutProjet,
                Observations: newAddSuiviProjet.Observations,
                contraintes: newAddSuiviProjet.contraintes || [],
                bailleurs: newAddSuiviProjet.bailleurs || []
            };

            const response = await axios.post(`${BSPP_URL}/api/projet-suivis`, dataToSend, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            return response.data;
        } catch (error) {
            console.error('Erreur lors de l\'enregistrement du suivi de projet', error);
            throw error;
        }
    }

    // {
    //     "DateSuivi":"2024-07-15",
    //     "NiveauExecution":10,
    //     "TauxAvancementPhysique":10,
    //     "CodeProjet":"022", // le code du projet en question
    //     "StatutProjet":"DANGER", // les valeurs possible DANGER,EN COURS,TERMINER
    //     "Observations":null,
    //     // le contraintes peut null si aucun ne doit etre fourni
    //     "contraintes":[
    //         {
    //             "IntituleConstrainte":"Constrainte First to be saved",
    //             "TypeConstrainte":"ADMIN" // les valeurs possible ADMIN et TECH
    //         },
    //         {
    //             "IntituleConstrainte":"Constrainte First to be saved",
    //             "TypeConstrainte":"ADMIN" // les valeurs possible ADMIN et TECH
    //         }
    //     ],
    //     // bailleurs peut etre laisser null si aucun decaissement n'a été faite
    //     "bailleurs":[
    //         {
    //             "CodeBailleur":"BND",
    //             "MontantDecaisser":20000
    //         }
    //     ]
    // }
  
};

export default SuiviProjetService;



// updateIndicator : async (updatedIndicator) => {
// try {
//   // Étape 1 : Récupérer les données nécessaires depuis AsyncStorage
//   const codeProjet = await AsyncStorage.getItem('codeProjet');
//   if (!codeProjet) {
//     throw new Error('CodeProjet not found in AsyncStorage');
//   }

//   const token = await AsyncStorage.getItem('userToken');

//   // Étape 2 : Préparer les données à envoyer
//   const dataToSend = {
//     indicateurs: [
//       {
//         ...updatedIndicator,
//         CodeProjet: codeProjet
//       }
//     ]
//   };

//   // Afficher dans la console pour vérification
//   console.log('Sending request to:', `${BSPP_URL}/api/indicateurs/update`);
//   console.log('Request payload:', dataToSend);

//   // Étape 3 : Faire la requête PUT avec Axios
//   const response = await axios.put(`${BSPP_URL}/api/indicateurs/update`, dataToSend, {
//     headers: {
//       Authorization: `Bearer ${token}`,
//       'Content-Type': 'application/json'
//     }
//   });

//   // Afficher les données de réponse pour vérification
//   console.log('Response data:', response.data);
//   return response.data;
// } catch (error) {
//   // Gérer les erreurs
//   console.error('Error updating indicator:', error);
//   if (error.response) {
//     console.error('Server response:', error.response.data);
//   }
//   return null;
// }
// }
