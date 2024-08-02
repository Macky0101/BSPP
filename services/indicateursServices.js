import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BSPP_URL = 'https://project-files.org/bspp/public';

const IndicateurService = {
  getIndicator: async () => {
    try {
      const codeProjet = await AsyncStorage.getItem('codeProjetIndicateur');
      if (!codeProjet) {
        throw new Error('CodeProjet not found in AsyncStorage');
      }
      const token = await AsyncStorage.getItem('userToken');
      const response = await axios.get(`${BSPP_URL}/api/indicateurs/suivis`, {
        params: {
          projet: codeProjet
        },
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      // console.log('indicateurs',response.data.data.indicateurs);
      return response.data.data.indicateurs;
    } catch (error) {
      console.error('Error fetching indicateur details:', error);
      return null;
    }
  },

  addIndicatorSuivi: async (newIndicator) => {
    try {
      const codeProjet = await AsyncStorage.getItem('codeProjetIndicateur');
      if (!codeProjet) {
        throw new Error('CodeProjet not found in AsyncStorage');
      }
      const token = await AsyncStorage.getItem('userToken');
      const response = await axios.post(`${BSPP_URL}/api/indicateurs/suivis`, {
        CodeIndicateur: newIndicator.CodeIndicateur,
        DateSuivi: newIndicator.DateSuivi,
        Realisation: newIndicator.Realisation,
        Observations: newIndicator.Observations
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error ajout indicateurSuivi:', error);
      if (error.response) {
        console.error('Server response:', error.response.data);
      }
      return null;
    }
  },

  updateIndicatorSuivi: async (updatedIndicator) => {
    try {
      const codeProjet = await AsyncStorage.getItem('codeProjetIndicateur');
      if (!codeProjet) {
        throw new Error('CodeProjet not found in AsyncStorage');
      }
      const token = await AsyncStorage.getItem('userToken');
      const response = await axios.post(`${BSPP_URL}/api/indicateurs/suivis`, {
        id: updatedIndicator.id,
        CodeIndicateur: updatedIndicator.CodeIndicateur,
        DateSuivi: updatedIndicator.DateSuivi,
        Realisation: updatedIndicator.Realisation,
        Observations: updatedIndicator.Observations
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error updating indicateurSuivi:', error);
      if (error.response) {
        console.error('Server response:', error.response.data);
      }
      return null;
    }
  },
  deleteIndicatorSuivi: async (suiviId) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await axios.delete(`${BSPP_URL}/api/indicateurs/suivis/${suiviId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error deleting indicateurSuivi:', error);
      if (error.response) {
        console.error('Server response:', error.response.data);
      }
      return null;
    }
  }
  
  
};

export default IndicateurService;





// addIndicator : async (newIndicator) => {
//   try {
//       const codeProjet = await AsyncStorage.getItem('codeProjet');
//       if (!codeProjet) {
//           throw new Error('CodeProjet not found in AsyncStorage');
//       }

//       const token = await AsyncStorage.getItem('userToken');
//       console.log('Sending request to:', `${BSPP_URL}/api/indicateurs`);
//       console.log('Request payload:', {
//           indicateurs: [
//               {
//                   ...newIndicator,
//                   CodeProjet: codeProjet
//               }
//           ]
//       });

//       const response = await axios.post(`${BSPP_URL}/api/indicateurs`, {
//           indicateurs: [
//               {
//                   ...newIndicator,
//                   CodeProjet: codeProjet
//               }
//           ]
//       }, {
//           headers: {
//               Authorization: `Bearer ${token}`,
//               'Content-Type': 'application/json'
//           }
//       });

//       console.log('Response data:', response.data);
//       return response.data;
//   } catch (error) {
//       console.error('Error adding indicateur:', error);
//       if (error.response) {
//           console.error('Server response:', error.response.data);
//       }
//       return null;
//   }
// },


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
