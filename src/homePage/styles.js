// styles.js
import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  welcomeContainer: {
    // flexDirection: 'row',
    justifyContent: 'space-between',
    // alignItems: 'center',
    // marginBottom: 15,
    // paddingTop: 15,
  },
  selectProjet:{
    alignItems: 'flex-end',
    // backgroundColor:'#dddddd',
    paddingBottom: 10,
    borderRadius: 20,
    paddingHorizontal: 10,
    marginHorizontal: 20,
    marginBottom: 10,
  },
  modalItemText:{
    padding:10
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  userName: {
    fontSize: 16,
  },
  profileImage:{

        width: 50, 
        height: 50,
        borderRadius: 25, 
        marginRight:10
   
  },
  logoutIcon: {
    fontSize: 32,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  statsContainerBudeget:{
    textAlign: 'center',
  },
  statsCard: {
    flex: 1,
    borderRadius: 5,
    padding: 20,
    elevation: 100,

  },
  statsCard1: {
    flex: 1,
    borderRadius: 5,
    padding: 30,
  },
  titleCard: {
    // flexDirection: 'row',
    alignContent: 'flex-start',
  },
  icon: {
    // flexDirection: 'row',
    alignContent: 'flex-end',
    alignItems: 'flex-end',
  },
  titleCard1: {
    flexDirection: 'row',
    alignContent: 'flex-start',
  },
  statsIcon: {
    fontSize: 24,
    marginBottom: 10,
    marginRight: 10,
  },
  statsLabel: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statsLabel1: {
    fontSize: 15,
    fontWeight: '500',
    marginBottom: 4,
  },

  // statsValue: {
  //   fontSize: 32,
  //   fontWeight: 'bold',
  // },
  navContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  navItem: {
    alignItems: 'center',
  },
  navIcon: {
    fontSize: 36,
    marginBottom: 5,
  },
  navLabel: {
    fontSize: 14,
  },
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  indicatorTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  addButton: {
    fontSize: 25,
    paddingTop:5
  },
  indicatorCardContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  indicatorCard: {
    flex: 1,
    borderRadius: 5,
    padding: 20,
    // marginHorizontal: 2,
    marginLeft:1,
    justifyContent: 'space-between',
  },
  labelcard: {
    flexDirection:'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  indicatorLabel: {
    fontSize: 14,
    marginBottom: 5,
  },
  labelText:{
    fontSize: 30,
    fontWeight: 'bold',
  },
  horizontalScrollView: {
    flexDirection: 'row',
  },
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    // marginBottom: 10,
  },
  indicatorTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  indicatorCard1: {
    width: 250, 
    borderRadius: 5,
    padding: 20,
    marginRight: 10,
    justifyContent: 'space-between',
    marginTop:10

  },
  logoContainer: {
    position: 'absolute',
    // top: 10,
    left: 10,
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
  IndicatorNav: {
    fontSize: 24,
  },

  statsSection: {
    padding: 10,
    // borderBottomColor: '#ffffff',
    // borderBottomWidth: 10,
    // Ajustez ces styles pour obtenir un design plus épuré
  },




  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  projectItem: {
    fontSize: 18,
    padding: 10,
  },








  statutContainer: {
    padding: 16,
  },
  statutTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  statutItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statutText: {
    fontSize: 14,
    marginLeft: 8,
  },
  badgeDanger: {
    backgroundColor: 'red',
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  badgeTerminer: {
    backgroundColor: 'green',
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  badgeEnCours: {
    backgroundColor: 'yellow',
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  // avancementContainer: {
  //   padding: 16,
  //   marginBottom: 16,
  // },
  // avancementTitle: {
  //   fontSize: 18,
  //   fontWeight: 'bold',
  // },
  // horizontalScrollView: {
  //   paddingVertical: 8,
  // },
  // avancementItem: {
  //   width: 200,
  //   marginRight: 16,
  //   alignItems: 'center',
  // },
  // avancementLabel: {
  //   fontSize: 14,
  //   fontWeight: '500',
  //   marginBottom: 4,
  // },
  // progressBar: {
  //   height: 10,
  //   width: '100%',
  //   borderRadius: 5,
  //   marginBottom: 4,
  // },
  // avancementPercent: {
  //   fontSize: 12,
  // },

  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  statusText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    marginBottom: 8,
  },
  value: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'right',
  },


  //////////////////////////////// style skeleton////////////////////////////////
  skeletonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  skeletonCard: {
    width: '100%',
    height: 150,
    borderRadius: 10,
    marginBottom: 20,
  },
  skeletonGradient: {
    flex: 1,
    borderRadius: 10,
    padding: 15,
  },
  skeletonHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  skeletonCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E0E0E0',
    marginRight: 10,
  },
  skeletonTitle: {
    flex: 1,
    height: 20,
    backgroundColor: '#E0E0E0',
    borderRadius: 5,
  },
  skeletonBody: {
    flex: 1,
  },
  skeletonLine: {
    height: 15,
    backgroundColor: '#E0E0E0',
    borderRadius: 5,
    marginBottom: 10,
  },
});
