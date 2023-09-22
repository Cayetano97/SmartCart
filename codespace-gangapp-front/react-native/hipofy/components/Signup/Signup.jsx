import { useState } from "react";
import Alert from "../Alert/Alert";
import Config from "../../constants/Config";
import Icon from "react-native-vector-icons/FontAwesome"
import {default as localStorage}  from '@react-native-async-storage/async-storage';
import {
  Text,
  TextInput,
  View,
  Button,
  StyleSheet,
  Dimensions,
  Image,
  Pressable,
} from "react-native";
import { useRouter } from "expo-router";

let width = Dimensions.get("window").width; //full width
let height = Dimensions.get("window").height; //full height
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePassword = (password) => {
  const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W_]).{8,}$/;
  return passwordRegex.test(password);
};

const SignUp = () => {
  const router = useRouter()

  const [alert, setAlert] = useState(false);
  const [eye, setEye] = useState(true);
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [lastname, setLastname] = useState('');
  const [password, setPassword] = useState('');

  const handlePassword = () => {
    setEye(!eye);
  };

  const handleSubmit = async () => {
    // const email = document.getElementsByName("email")[0].value;
    // const username = document.getElementsByName("username")[0].value;
    // const lastname = document.getElementsByName("lastname")[0].value;
    // const password = document.getElementsByName("password")[0].value;

    if (email !== "" && username !== "" && lastname !== "") {
      console.log(email)
      if (!validateEmail(email)) {
        setAlert("Email inválido. Por favor, ingresa un email válido.");
        return;
      }

      if (!validatePassword(password)) {
        setAlert(
          "Contraseña inválida (debe contener al menos 8 caracteres, una mayúscula, una minúscula, un número y un caracter especial)."
        );
        return;
      }

      // If we reach here, all fields are valid, and we can proceed with the registration request.
      const response = await fetch(`${Config.baseURL}/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          username: username,
          lastname: lastname,
          password: password,
        }),
      });
      await response.json();

      if (response.status === 200) {
        const response = await fetch(`${Config.baseURL}/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email,
            password: password,
          }),
        });
  
        const dataResponse = await response.json();
  
        //Almacenamiento response en localStorage para traerlo en Profile
        if (response.status === 200) {
          localStorage.setItem("Response", JSON.stringify(dataResponse));
          localStorage.setItem("idUser", dataResponse.data.id);
          localStorage.setItem("Token", dataResponse.data.token);
          localStorage.setItem("Refresh_Token", dataResponse.data.refreshToken);
          router.replace('/home')
          
          if (dataResponse.data.role === "admin") {
            // navigate("profile/admin/");
          }
        } else {
          localStorage.clear();
        }
  
        try {
          localStorage.setItem("idUser", dataResponse.data.id);
          localStorage.setItem("Token", dataResponse.data.token);
          localStorage.setItem("Refresh_Token", dataResponse.data.refreshToken);
        } catch (error) {
          setAlert("Error en registro.")
        }
      }
    } else {
      setAlert("Por favor, completa todos los campos.");
    }
  };

  const handleInputBlur = () => {
    setAlert(false);
  };

  return (
    <View style={styles.mainsingup}>
      <View style={styles.title}>
        <Image
          source={require("../../assets/images/hipofy-logo-login.png")}
          style={{ width: 222, height: 192 }}
        />
        {/* <Icon name='wrench' /> */}
        <Text style={styles.textSubMain}>¡Regístrate y empieza a ahorrar!</Text>
      </View>
      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Introduce tu email"
          value={email}
          onChangeText={(text) => {setEmail(text)}}
          onBlur={handleInputBlur}
        />
        <TextInput
          style={styles.input}
          placeholder="Introduce tu nombre"
          value={username}
          onChangeText={(text) => {setUsername(text)}}
          onBlur={handleInputBlur}
        />
        <TextInput
          style={styles.input}
          placeholder="Introduce tus apellidos"
          value={lastname}
          onChangeText={(text) => {setLastname(text)}}
          onBlur={handleInputBlur}
        />
        <TextInput
          style={styles.input}
          secureTextEntry={eye}
          placeholder="Introduce tu contraseña"
          value={password}
          onChangeText={(text) => {setPassword(text)}}
          onBlur={handleInputBlur}
        />
        <Icon
            style={styles.svg}
            name={eye ? 'eye' : 'eye-slash'}
            onPress={handlePassword}
          />

        <Pressable onPress={handleSubmit} style={{marginVertical: 10}}>
            <View style={styles.buttonSubmit}>
              <Text style={styles.buttonSubmitText}>Registrarme</Text>
            </View>
          </Pressable>
        <Pressable onPress={() => router.back()}>
          <Text style={{fontSize: 16}}>
            ¿Ya tienes una cuenta? Inicia sesión
          </Text>
        </Pressable>
      </View>
      {alert ? <Text style={styles.alert}>{alert}</Text> : null}
    </View>
  );
};

export default SignUp;

const styles = StyleSheet.create({
  mainsingup: {
    // display: "flex",
    // justifyContent: "center",
    // alignItems: "center",
    // backgroundColor: "#22C990",
    // width: width,
    // height: height,
  },
  form: {
    alignItems: "center",
    textAlign: "center",
    backgroundColor: "#62d9b0",
    width: width - 50,
    borderRadius: 10,
    padding: 20,
  },
  input: {
    borderRadius: 6,
    backgroundColor: "#fff",
    padding: 14,
    width: "100%",
    marginTop: 15,
    color: "#000",
    fontSize: 20,
  },
  title: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 20,
  },
  textSubMain: {
    color: "#A4FFF7",
    fontSize: 25,
    // fontFamily: 'Rubik',
    fontWeight: "600",
    textAlign: "center",
  },
  buttonSubmit: {
    borderRadius: 6,
    marginTop: 10,
    backgroundColor: '#017BFE',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.2)',
    width: width - 100,
    paddingVertical: 10
  },
  buttonSubmitText: { 
    textAlign: 'center',
    fontFamily: 'RubikRegular',
    fontSize: 24,
    color: '#FFF'
  },
  svg : {
    position: 'absolute',
    right: 35,
    top: 265,
    fontSize: 22,
    color: 'rgba(0, 0, 0, 0.5)'
  },
});
