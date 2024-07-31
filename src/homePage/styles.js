// styles.js
import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  welcomeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    paddingTop: 15,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  userName: {
    fontSize: 16,
  },
  logoutIcon: {
    fontSize: 32,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  statsCard: {
    flex: 1,
    borderRadius: 5,
    padding: 20,
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
    marginBottom: 10,
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
    marginBottom: 10,
  },
  indicatorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  indicatorCard1: {
    width: 250, 
    borderRadius: 5,
    padding: 20,
    marginRight: 10,
    justifyContent: 'space-between',
  },
  IndicatorNav: {
    fontSize: 24,
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
});
