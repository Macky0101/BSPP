import { StyleSheet } from 'react-native';

export default StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     padding: 20,
//   },
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  indicatorTitle: {
    fontSize: 16,
    color: '#000',
    fontWeight: 'bold',
  },
  addButton: {
    fontSize: 32,
    color: '#a05a2c',
  },
  indicatorCardContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  indicatorCard: {
    flex: 1,
    backgroundColor: '#EDE0D4',
    borderRadius: 5,
    padding: 20,
    marginHorizontal: 5,
    justifyContent: 'space-between', // Aligner le contenu verticalement
  },
  indicatorLabel: {
    fontSize: 14,
    color: '#000',
    marginBottom: 10,
  },
  IndicatorNav: {
    fontSize: 36,
    color: '#a05a2c',
    alignSelf: 'flex-end', 
  },
});
