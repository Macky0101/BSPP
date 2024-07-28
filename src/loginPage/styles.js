import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  inner: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    color: '#000',
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  loginTopLogo: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 18,
    color: '#000',
    marginBottom: 40,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#000',
    borderRadius: 25,
    marginBottom: 20,
    paddingHorizontal: 20,
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  input: {
    flex: 1,
    color: '#fff',
  },
  buttonContainer: {
    width: '100%',
    marginTop: 20,
  },
  button: {
    backgroundColor: '#a05a2c', // Button color
    borderRadius: 25,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
