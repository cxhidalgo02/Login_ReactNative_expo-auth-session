import * as React from 'react';
import { TextInput, View, StyleSheet, Text, TouchableOpacity, } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { myColors } from './styles/colors';

const AuthContext = React.createContext();

function SplashScreen() {
  return (
    <View>
      <Text>Cargando...</Text>
    </View>
  );
}

function HomeScreen() {
  const { signOut } = React.useContext(AuthContext);

  return (
      <View style={styles.container}>
        <View style={styles.top} >
          <Text style={styles.title}>
            BIENVENIDO
          </Text>
        </View>
        <View style={styles.middle} >
          <Text style={styles.title}>
            CONTENIDO
          </Text>
        </View>
        <View style={styles.bottom} > 
          <TouchableOpacity style={styles.button} onPress={signOut}>
            <Text >SALIR</Text>
          </TouchableOpacity>
        </View>
      </View>
  );
}

function SignInScreen() {
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const { signIn } = React.useContext(AuthContext);

  return (
    <View style={styles.container}>
        <View style={styles.top} >
          <Text style={styles.title}>
            INGRESE LOS DATOS
          </Text>
        </View>
        <View style={styles.middle} >
          <View style={styles.inputs} >
            <TextInput placeholder="Correo" value={username} onChangeText={setUsername} style={styles.textInput} />
            <TextInput placeholder="Contraseña" value={password} onChangeText={setPassword} style={styles.textInput} secureTextEntry/>
          </View>
        </View>
        <View style={styles.bottom} > 
          <TouchableOpacity style={styles.button} onPress={() => signIn({ username, password })}>
            <Text >INICIAR</Text>
            </TouchableOpacity>
        </View>
    </View>
  );
}

const Stack = createStackNavigator();

export default function App({ navigation }) {
  const [state, dispatch] = React.useReducer(
    (prevState, action) => {
      switch (action.type) {
        case 'RESTORE_TOKEN':
          return {
            ...prevState,
            userToken: action.token,
            isLoading: false,
          };
        case 'SIGN_IN':
          return {
            ...prevState,
            isSignout: false,
            userToken: action.token,
          };
        case 'SIGN_OUT':
          return {
            ...prevState,
            isSignout: true,
            userToken: null,
          };
      }
    },
    {
      isLoading: true,
      isSignout: false,
      userToken: null,
    }
  );

  React.useEffect(() => {
    // Obtenga el token del almacenamiento y luego navegue hasta nuestro lugar apropiado
    const bootstrapAsync = async () => {
      let userToken;

      try {
        // Restaurar el token almacenado en `SecureStore` o cualquier otro almacenamiento cifrado
        // userToken = await SecureStore.getItemAsync('userToken');
      } catch (e) {
        // Error al restaurar el token
      }
      // Después de restaurar el token, es posible que necesitemos validarlo en aplicaciones de producción.
      // Esto cambiará a la pantalla de aplicación o a la pantalla de autenticación y se cargará.
      // La pantalla se desmontará y se desechará.
      dispatch({ type: 'RESTORE_TOKEN', token: userToken });
    };
    bootstrapAsync();
  }, []);

  const authContext = React.useMemo(
    () => ({
      signIn: async (data) => {
        // En una aplicación de producción, necesitamos enviar algunos datos (generalmente nombre de usuario, contraseña) al servidor y obtener un token.
        // También necesitaremos manejar los errores si falla el inicio de sesión.
        // Después de obtener el token, debemos conservarlo usando `SecureStore` o cualquier otro almacenamiento cifrado.
        // En el ejemplo, usaremos un token ficticio.
        dispatch({ type: 'SIGN_IN', token: 'dummy-auth-token' });
      },
      signOut: () => dispatch({ type: 'SIGN_OUT' }),
      signUp: async (data) => {
        // En una aplicación de producción, necesitamos enviar datos del usuario al servidor y obtener un token.
        // También necesitaremos manejar los errores si falla el registro.
        // Después de obtener el token, debemos conservarlo usando `SecureStore` o cualquier otro almacenamiento cifrado.
        // En el ejemplo, usaremos un token ficticio.
        dispatch({ type: 'SIGN_IN', token: 'dummy-auth-token' });
      },
    }),
    []
  );

  return (
    <AuthContext.Provider value={authContext}>
      <NavigationContainer>
        <Stack.Navigator>
          {state.isLoading ? (
            // Aún no hemos terminado de buscar el token.
            <Stack.Screen name="Splash" component={SplashScreen} />
          ) : state.userToken == null ? (
            // No se encontró ningún token, el usuario no ha iniciado sesión
            <Stack.Screen
              name="SignIn"
              component={SignInScreen}
              options={{
                title: 'INICIO',
                // Al cerrar sesión, una animación emergente resulta intuitiva
                animationTypeForReplace: state.isSignout ? 'pop' : 'push',
              }}
            />
          ) : (
            // El usuario ha iniciado sesión
            <Stack.Screen name="CONTENIDO" component={HomeScreen} />
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </AuthContext.Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  top: {
    flex: 0.1,
    backgroundColor: myColors.light,
  },
  middle: {
    flex: 0.6,
  },
  bottom: {
    flex: 0.1,
  },
  title: {
    textAlign: 'center',
    marginVertical: 8,
    fontSize: 16,
    color: myColors.navyblue,
  },
  inputs: {
    padding: 10,
  },
  textInput: {
    marginTop: 20,
    fontSize: 14, 
    borderWidth: 1,
    borderRadius: 8,
    borderColor: myColors.navyblue,
    padding: 10,
    backgroundColor: myColors.white,
    elevation: 2,
  },
  button: {
    alignItems: 'center',
    backgroundColor: myColors.mustard,
    padding: 10,
    marginTop: 10,
    borderRadius:10,
    elevation: 5,
  },
});