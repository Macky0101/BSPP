import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BSPP_URL = 'https://project-files.org/bspp/public';

const SuiviProjetService = {
  AddSuiviProjet: async (newAddSuiviProjet) => {
    try {
      const codeProjet = await AsyncStorage.getItem('codeProjetIndicateur');
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
      // console.log('donne envoyer ac',dataToSend);

      const response = await axios.post(`${BSPP_URL}/api/projet-suivis`, dataToSend, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      // console.log('donne envoyer',response);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement du suivi de projet', error);
      throw error;
    }
  },
  getDetailSuivi: async (suiviId) => {
    try {

      const token = await AsyncStorage.getItem('userToken');
      const response = await axios.get(`${BSPP_URL}/api/projet-suivis/detail/${suiviId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      // console.log('suivi detail',response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching suivi details:', error);
      return null;
    }
  },
  getProjectDetails: async () => {
    try {
      const codeProjet = await AsyncStorage.getItem('codeProjet');
      if (!codeProjet) {
        throw new Error('CodeProjet not found in AsyncStorage');
      }
      const token = await AsyncStorage.getItem('userToken');
      const response = await axios.get(`${BSPP_URL}/api/projets/detail/${codeProjet}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      // console.log('Project bailleurs:', response.data.data.bailleurs);
      return response.data.data.bailleurs;
    } catch (error) {
      console.error('Error fetching project details:', error);
      return null;
    }
  },

  getBailleur: async () => {
    try {
      const codeProjet = await AsyncStorage.getItem('codeProjetIndicateur');
      if (!codeProjet) {
        throw new Error('CodeProjet not found in AsyncStorage');
      }
      const token = await AsyncStorage.getItem('userToken');

      // Assuming the API accepts codeProjet as a query parameter
      const response = await axios.get(`${BSPP_URL}/api/bailleurs`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          codeProjet, // Add codeProjet as a query parameter
        },
      });

      // console.log('Bailleur avec le code projet', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching bailleur:', error);
      return null;
    }
  },


  UpdateSuiviProjet: async (suiviProjet) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        throw new Error('User token not found in AsyncStorage');
      }

      const response = await axios.put(`${BSPP_URL}/api/projet-suivis/update`, suiviProjet, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
      
    } catch (error) {
      console.error('Erreur lors de la modification du suivi de projet', error);
      throw error;
    }
  },
  deleteSuiviProjet: async (suiviId) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        throw new Error('User token not found in AsyncStorage');
      }

      const response = await axios.delete(`${BSPP_URL}/api/projet-suivis/${suiviId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      console.error('Erreur lors de la suppression du suivi de projet', error);
      throw error;
    }
  },

};

export default SuiviProjetService;


