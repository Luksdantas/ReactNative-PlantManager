import React, {useEffect, useState} from 'react';
import {StyleSheet, SafeAreaView, Text, View} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import {EnvironmentButton} from '../components/EnvironmentButton';
import {PlantCardPrimary} from '../components/PlantCardPrimary';
import {Header} from '../components/Header';
//import api from '../services/api';
import colors from '../styles/colors';
import fonts from '../styles/fonts';
import server from '../services/server';
import {Load} from '../components/Load';
import {useNavigation} from '@react-navigation/core';
import {PlantProps} from '../libs/storage';

interface EnvironmentProps {
  key: string;
  title: string;
}

export function PlantSelect() {
  const navigation = useNavigation();
  const environments = server.plants_environments as EnvironmentProps[];
  const plants = server.plants as PlantProps[];
  const [environmentSelected, setEnvironmentSelected] = useState('all');
  const [filteredPlants, setFilteredPlants] = useState<PlantProps[]>(plants);
  const [loading, setLoading] = useState(true);

  // const [plants, setPlants] = useState<PlantProps[]>([]);
  // const [environments, setEnvironments] = useState<EnvironmentProps[]>([]);
  // const [page, setPage] = useState(1);
  // const [loadingMore, setLoadingMore] = useState(false);

  function handlePlantSelect(plant: PlantProps) {
    navigation.navigate('PlantSave', {plant});
  }

  function handleEnvironmentSelected(environment: string) {
    setEnvironmentSelected(environment);

    if (environment === 'all') {
      return setFilteredPlants(plants);
    }

    const filtered = plants.filter(plant =>
      plant.environments.includes(environment),
    );

    setFilteredPlants(filtered);
  }

  //   async function fetchPlants() {
  //     const {data} = await api.get(`plants?_sort=name&_order=asc&page=${page}&_limit=8`);
  //     if(!data) return setLoading(true)
  //     if(page > 1) setPlants(oldValue => [...oldValue, ...data])
  //     else {
  //         setPlants(data);
  //         setFilteredPlants(data)
  //     }
  //     setLoading(false)
  //     setLoadingMore(false)
  //   }

  //   function handleFetchMore(distance: number) {
  //       if(distance <1) return
  //       setLoadingMore(true)
  //       setPage(oldValue => oldValue + 1)
  //       fetchPlants()
  //   }

  //   useEffect(() => {
  //     async function fetchEnvironment() {
  //       const {data} = await api.get(
  //         'plants_environments?_sort=title&_order=asc',
  //       );
  //       setEnvironments([
  //         {
  //           key: 'all',
  //           title: 'Todos',
  //         },
  //         ...data,
  //       ]);
  //     }
  //     fetchEnvironment();
  //   }, []);

  // useEffect(() => {
  //   fetchPlants();
  // }, []);

  useEffect(() => {
    setTimeout(() => setLoading(false), 3000);
  });

  if (loading) {
    return <Load />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Header />
        <Text style={styles.title}>Em qual ambiente</Text>
        <Text style={styles.subtitle}>você quer colocar sua planta?</Text>
      </View>
      <View>
        <FlatList
          data={environments}
          keyExtractor={item => String(item.key)}
          renderItem={({item}) => (
            <EnvironmentButton
              title={item.title}
              key={item.key}
              active={item.key === environmentSelected}
              onPress={() => handleEnvironmentSelected(item.key)}
            />
          )}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.environmentList}
        />
      </View>
      <View style={styles.plants}>
        <FlatList
          data={filteredPlants}
          keyExtractor={item => String(item.id)}
          renderItem={({item}) => (
            <PlantCardPrimary
              data={item}
              key={item.name}
              onPress={() => handlePlantSelect(item)}
            />
          )}
          showsVerticalScrollIndicator={false}
          numColumns={2}
          onEndReachedThreshold={0.1}
          // onEndReached={({ distanceFromEnd }) => handleFetchMore(distanceFromEnd) }
          // contentContainerStyle={styles.contentContainerStyle}
          // ListFooterComponent={ loadingMore ? <ActivityIndicator color={colors.green} /> : <></> }
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: 30,
  },
  title: {
    fontSize: 17,
    color: colors.heading,
    fontFamily: fonts.heading,
    lineHeight: 20,
    marginTop: 15,
  },
  subtitle: {
    fontSize: 17,
    fontFamily: fonts.text,
    lineHeight: 20,
    color: colors.heading,
  },
  environmentList: {
    height: 40,
    justifyContent: 'center',
    paddingBottom: 5,
    marginLeft: 32,
    marginVertical: 32,
  },
  plants: {
    flex: 1,
    paddingHorizontal: 32,
    justifyContent: 'center',
  },
});
