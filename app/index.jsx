import { View, Text, StyleSheet, ImageBackground, Pressable } from 'react-native'
import React from 'react'
import {Link} from 'expo-router'

import ShipperImg from "@assets/images/shipperimage.jpeg"

const app = () => {
  return (
    <View style={style.container}>
      <ImageBackground
         source={ShipperImg}
         resizeMode="cover"
         style={style.image}
      >
      <Text style={style.title}>FoodFast</Text>
      <Link href="/contact" style={{marginHorizontal: 'auto'}} asChild>
      <Pressable style={style.button}>
      <Text style={style.buttonText}>Contact Us</Text>
      </Pressable>
      </Link>
      </ImageBackground>
    </View>
  )
}

export default app

const style= StyleSheet.create({
  container: {
    flex:1,
    flexDirection: 'column',
  },
  image:{
    width: '100%',
    height: '100%',
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  title: {
    color: 'white',
    fontSize: 42,
    textAlign: 'center',
    fontWeight: 'bold',
    backgroundColor:'rgba(0,0,0,0.5)',
    marginBottom: 120,
  },
  button: {
    height: 60,
    borderRadius: 20,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.75)',
    padding: 6,

  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: 'bold',
    padding: 4,
  }
})