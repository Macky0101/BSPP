import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BSPP_URL = 'https://project-files.org/bspp/public';

const AuthService = {
  login: async (email, password) => {
    try {
      const response = await axios.post(`${BSPP_URL}/api/system/login`, { email, password });
      // console.log('Login Response:', response.data);

      if (response.data.data.access_token) {
        await AsyncStorage.setItem('userToken', response.data.data.access_token);
        await AsyncStorage.setItem('userInfo', JSON.stringify(response.data.data.user));
      }
      return response.data.data;
    } catch (error) {
      console.error('Login Error:', error);
      throw error;
    }
  },

  getUserInfo: async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        throw new Error('Aucun jeton trouvé');
      }
      const response = await axios.get(`${BSPP_URL}/api/auth-user`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Stocker tous les projets dans AsyncStorage
      await AsyncStorage.setItem('userProjects', JSON.stringify(response.data.data.projects));
      
      // Optionnellement, définir le premier projet comme projet par défaut si aucune sélection n'est faite
      if (response.data.data.projects.length > 0) {
        const defaultProjectCode = response.data.data.projects[0].projet.CodeProjet;
        await AsyncStorage.setItem('codeProjet', defaultProjectCode);
      }

      return response.data.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des informations utilisateur:', error);
      throw error;
    }
  },

  // getUserInfo: async () => {
  //   try {
  //     const token = await AsyncStorage.getItem('userToken');
  //     if (!token) {
  //       throw new Error('No token found');
  //     }
  //     const response = await axios.get(
  //       `${BSPP_URL}/api/auth-user`,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`
  //         }
  //       }
  //     );
  //     const userProjects = response.data.data.projects;
  //     if (userProjects.length > 0) {
  //       const codeProjet = userProjects[0].projet.CodeProjet;
  //       // console.log('CodeProjet:', codeProjet);
        
  //       // Stocker le CodeProjet dans AsyncStorage
  //       await AsyncStorage.setItem('codeProjet', codeProjet);
  //     }
  //     // console.log('Get User Info :', response.data);
  //     // console.log('Get project:', response.data.data.projects);

  //     return response.data.data;
  //   } catch (error) {
  //     console.error('Get User Info Error:', error);
  //     throw error;
  //   }
  // },
  getProjectDetails : async () => {
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
      // console.log('Project :', response.data.data);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching project details:', error);
      return null;
    }
  },

  getIndicator: async () => {
    try {
      const codeProjet = await AsyncStorage.getItem('codeProjet');
      if (!codeProjet) {
        throw new Error('CodeProjet not found in AsyncStorage');
      }
      const token = await AsyncStorage.getItem('userToken');
      const response = await axios.get(`${BSPP_URL}/api/indicateurs`, {
        params: {
          projet: codeProjet
        },
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
    //   console.log('indicateur :', response.data);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching indicateur details:', error);
      return null;
    }
  },
  changePassword: async (oldPassword, newPassword, newPasswordConfirmation) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        throw new Error('No token found');
      }
      const response = await axios.post(
        `${BSPP_URL}/api/auth-change-password`,
        {
          old_password: oldPassword,
          password: newPassword,
          password_confirmation: newPasswordConfirmation
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      // console.log('Change Password Response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Change Password Error:', error);
      throw error;
    }
  },

  logout: async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        throw new Error('No token found');
      }
      console.log('Logout Token:', token);
      const response = await axios.post(
        `${BSPP_URL}/api/auth-user-logout`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      console.log('Logout Response:', response.data);
      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.removeItem('userInfo');
      return response.data;
    } catch (error) {
      console.error('Logout Error:', error);
      throw error;
    }
  }
};

export default AuthService;
