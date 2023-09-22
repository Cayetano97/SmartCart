
import { useState, useEffect } from "react";
import Finished from "./Finished/Finished";
import Spinner from "../../Spinner/Spinner";
import Alert from "../../Alert/Alert";
import { Dimensions, Pressable, StyleSheet, Text, View } from "react-native";
import { useRouter } from 'expo-router';
// import {default as localStorage}  from '@react-native-async-storage/async-storage';
import Config from "../../../constants/Config";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { store } from "../../../store";

let width = Dimensions.get('window').width; 
let height = Dimensions.get('window').height; //full height

const SingleList = () => {
  const router = useRouter()
  const actualListId = store.useState(state => state.list.create.id)
  const actualStatusList = store.useState(state => state.list.create.status)
  //UseStates
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState({});
  const [listCreated, setListCreated] = useState('');
  const [alertGreen, setAlertGreen] = useState(false);
  const [alertRed, setAlertRed] = useState(false);

  //Handle function

  const handleBack = () => {
    // navigate(`/profile/list/${idUser}`);
  };

  const handleAddTicket = (id) => {
    console.log(id);
  };

  const handleCreateList = () => {
    
    router.replace('/home')
  }


  //Fetch function
  const fetchLastList = async () => {
    try {
      const idUserAux = await AsyncStorage.getItem("idUser")
      const tokenAux = await AsyncStorage.getItem("Token")
      const refreshTokenAux = await AsyncStorage.getItem("Refresh_Token")
      setIsLoading(true);
      const response = await fetch(`${Config.baseURL}/lastlist/${idUserAux}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "auth-token": tokenAux,
          "auth-token-refresh": refreshTokenAux,
        },
      });

      if (response.ok) {
        const dataResponseSingleLists = await response.json();
        const dataResponseSingleListsAux = dataResponseSingleLists.data.filter(item => item.status != 'Finalizada')
        setData(dataResponseSingleListsAux[0]);
        if(dataResponseSingleListsAux[0]){
          AsyncStorage.setItem('id_list', dataResponseSingleListsAux[0]._id)
          store.update((state) => {state.list.create.id = dataResponseSingleListsAux[0]._id})
        }
        
      } else {
        throw new Error("Something went wrong");
      }
    } catch (error) {
      console.log(error)
      setError(error);
    }
    setIsLoading(false);
  };
  useEffect(() => {
    fetchLastList();
  }, [ data ? data.status : data]);
  
  useEffect(() => {
    fetchLastList()
  }, [])

  useEffect(() =>{
    if(actualListId === ''){
      setData(undefined)
    }else {
      fetchLastList()
    }
  }, [actualListId, actualStatusList])

  return (
    <View>
      {isLoading ? (
        <Spinner />
      ) : error ? (
        <Alert text="Algo no ha ido como debía... ¡Inténtalo de nuevo!" />
      ) : !data 
      ? (
        <View style={styles.emptyListView}>
          <View style={styles.titleContainer}>
            <Text style={styles.textCreateNewList}>Upps.</Text>
            <Text style={styles.textCreateNewList}>Parece que aún no tienes ninguna lista creada. Crea una y empieza a ahorrar</Text>
          </View>
          <View style={styles.separator}  />
          
            <Pressable style={styles.buttonCreate} onPress={() => router.push('/createList/createList')}>
              <Text style={styles.textCreate}>Crear lista de la compra</Text>
            </Pressable>
        </View>
      ): (
        <Finished
          addTicket={handleAddTicket}
          data={data}
          isLoading={isLoading}
          error={error}
          updateList={() => fetchLastList()}
        />
      )
      }
    </View>
  );
};

export default SingleList;

const styles = StyleSheet.create({
  emptyListView: {
    flexDirection: 'column',
    height: 30,
    alignItems: 'center',
    backgroundColor: '#A4FFF7',
    marginHorizontal: 10,
    marginVertical: 16,
    width: width
  },  
  buttonCreate: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: '#22c990',
  },
  textCreate: {
    height: 25,
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: 'white',
  },
  separator: {
    marginVertical: 30,
    height: 2,
    width:  width - 150,
    backgroundColor: 'rgba(0,0,0,0.25)'
  },  
  titleContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    alignContent: 'center',
    justifyContent: 'space-between',
    fontWeight: 'bold',
    fontSize: 24,
  },
  textCreateNewList: {
    textAlign: 'center',
    color: '#AFAFAF',
    fontWeight: '700',
    fontSize: 16,
    marginBottom: 10,
    marginHorizontal: 10,
    letterSpacing: 0.25,
  }
})