// // ThemeSelector.js
// import React from 'react';
// import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
// import { useTheme } from './themeContext';

// const ThemeSelector = () => {
//   const { changeTheme } = useTheme();

//   const themes = [
//     {
//       primary: '#a05a2c',
//       background: '#fff',
//       card: 'rgba(230, 204, 178, 0.8)',
//       text: '#000',
//       border: '#a05a2c',
//       notification: '#ff5252',
//     },
//     {
//       primary: '#3498db',
//       background: '#ecf0f1',
//       card: '#2980b9',
//       text: '#ecf0f1',
//       border: '#3498db',
//       notification: '#3498db',
//     },
//     {
//       primary: '#2ecc71',
//       background: '#e0f2f1',
//       card: '#27ae60',
//       text: '#e0f2f1',
//       border: '#2ecc71',
//       notification: '#2ecc71',
//     },
//   ];

//   return (
//     <View>
//       {themes.map((theme, index) => (
//         <TouchableOpacity key={index} onPress={() => changeTheme(theme)} style={styles.button}>
//           <Text style={{ color: theme.primary }}>Theme {index + 1}</Text>
//         </TouchableOpacity>
//       ))}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   button: {
//     padding: 10,
//     marginVertical: 5,
//     alignItems: 'center',
//     borderWidth: 1,
//     borderRadius: 5,
//   },
// });

// export default ThemeSelector;
