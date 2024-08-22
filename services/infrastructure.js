import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BSPP_URL = 'https://project-files.org/bspp/public';

const Infrastructure = {
    getInfrastructure: async () => {
        try {
          const codeProjet = await AsyncStorage.getItem('codeProjetIndicateur');
          if (!codeProjet) {
            throw new Error('CodeProjet not found in AsyncStorage');
          }
          const token = await AsyncStorage.getItem('userToken');
          const response = await axios.get(`${BSPP_URL}/api/infrastructures`, {
            params: {
              projet: codeProjet
            },
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          // console.log('infrastructure',response.data.data);
          return response.data.data;
        } catch (error) {
          console.error('Error fetching indicateur details:', error);
          return null;
        }
      },

      detailSuiviInfrastructures: async (id) => {
        try {
            const token = await AsyncStorage.getItem('userToken');
            if (!token) {
                throw new Error('User token not found in AsyncStorage');
            }
            const response = await axios.get(`${BSPP_URL}/api/infrastructures/detail/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            // console.log('infrastructure',response.data.data);

            return response.data.data;
        } catch (error) {
            console.error('Error loading details:', error);
            return [];
        }
    },


      postSuiviInfrastructure : async (suiviDetails, images, videos) => {
        try {
          const codeProjet = await AsyncStorage.getItem('codeProjetIndicateur');
          if (!codeProjet) {
            throw new Error('CodeProjet not found in AsyncStorage');
          }
          const token = await AsyncStorage.getItem('userToken');
          const formData = new FormData();

          formData.append('DateSuivi', suiviDetails.DateSuivi);
          formData.append('CodeInfrastructure', suiviDetails.CodeInfrastructure);
          formData.append('NiveauAvancement', suiviDetails.NiveauAvancement);
          formData.append('MontantDecaisser', suiviDetails.MontantDecaisser);
          formData.append('TauxAvancementTechnique', suiviDetails.TauxAvancementTechnique);
          formData.append('Difficultes', suiviDetails.Difficultes);

          suiviDetails.Trimestre.forEach(trimestre => {
            formData.append('Trimestre[]', trimestre);
        });
    
          // Append images to formData
          images.forEach((image, index) => {
            formData.append('images[]', {
              uri: image.uri,
              type: image.type || 'image/jpeg',
              name: image.name || `image_${index}.jpg`
            });
          });
          
          videos.forEach((video, index) => {
            formData.append('videos[]', {
              uri: video.uri,
              type: video.type || 'video/mp4',
              name: video.name || `video_${index}.mp4`
            });
          });
    
          const response = await axios.post(`${BSPP_URL}/api/infrastructures/suivis`, formData, {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data'
            }
          });
    
          return response.data; // Returns response from the server
        } catch (error) {
          if (error.response) {
            console.error('Error response data:', error.response.data);
            console.error('Error response status:', error.response.status);
          } else {
            console.error('Error posting new suivi infrastructure:', error.message);
          }
          return null;
        }
      },

      updateSuiviInfrastructure: async (suiviDetails, images, videos) => {
        try {
          const codeProjet = await AsyncStorage.getItem('codeProjetIndicateur');
          if (!codeProjet) {
            throw new Error('CodeProjet not found in AsyncStorage');
          }
          const token = await AsyncStorage.getItem('userToken');
          const formData = new FormData();
    
          // Include the ID directly in the formData as part of the update payload
          formData.append('id', suiviDetails.id); // Assuming id is provided in suiviDetails
          formData.append('DateSuivi', suiviDetails.DateSuivi);
          formData.append('CodeInfrastructure', suiviDetails.CodeInfrastructure);
          formData.append('NiveauAvancement', suiviDetails.NiveauAvancement);
          formData.append('MontantDecaisser', suiviDetails.MontantDecaisser);
          formData.append('TauxAvancementTechnique', suiviDetails.TauxAvancementTechnique);
          formData.append('Difficultes', suiviDetails.Difficultes);
    
          if (Array.isArray(suiviDetails.Trimestre)) {
            suiviDetails.Trimestre.forEach(trimestre => {
                formData.append('Trimestre[]', trimestre);
            });
        }
        
          // Append images to formData
          images.forEach((image, index) => {
            formData.append('images[]', {
              uri: image.uri,
              type: image.type || 'image/jpeg',
              name: image.name || `image_${index}.jpg`
            });
          });
    
          // Append videos to formData
          videos.forEach((video, index) => {
            formData.append('videos[]', {
              uri: video.uri,
              type: video.type || 'video/mp4',
              name: video.name || `video_${index}.mp4`
            });
          });
    
          const response = await axios.post(`${BSPP_URL}/api/infrastructures/suivis`, formData, {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data'
            }
          });
    // console.log('macky',response);
          return response.data; 
        } catch (error) {
          if (error.response) {
            console.error('Error response data:', error.response.data);
            console.error('Error response status:', error.response.status);
          } else {
            console.error('Error updating suivi infrastructure:', error.message);
          }
          return null;
        }
      },

      deleteSuiviInfrastructure: async (id) => {
        try {
          const token = await AsyncStorage.getItem('userToken');
          const response = await axios.delete(`${BSPP_URL}/api/infrastructures/suivis/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
          });          
          return response.data;
        } catch (error) {
          console.error('Error deleting suivi infrastructure:', error.message);
          return null;
        }
      }
      
    };

export default Infrastructure;
