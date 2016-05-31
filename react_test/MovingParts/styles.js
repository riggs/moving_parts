/**
 * Created by riggs on 2016/5/26.
 */
"use strict";

import { StyleSheet } from 'react-native'


export const app = StyleSheet.create({
  container: {
    flex: 1,
    margin: 0,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
})


export const title_bar = StyleSheet.create({
  background: {
    flexDirection: 'row',
    paddingTop: 30,
    paddingBottom: 10,
    backgroundColor: 'rgba(220,244,179,1)' ,
  },
  title_text: {
    color: 'black',
    fontSize:  16,
    fontWeight: 'bold',
    fontFamily:  'Helvetica Neue' ,
    textAlign: 'center',
    flex: 1,
  },
  menu: {
    width: 50,
    color: 'black',
    textAlign: 'center',
  },
})


export const side_bar = StyleSheet.create({
  background: {
    width: 200,
    backgroundColor: "rgba(200,216,251,1)",
    alignItems: 'center',
  },
})


export const behavior = StyleSheet.create({
  background: {
    height: 120,
    width: 120,
    borderWidth: 1,
    borderRadius: 60,
//     transform: [
//        {scaleX: 2},
//     ],
  },
  title_text: {
    textAlign: 'center',
    margin: 5,
    fontWeight: 'bold',
    // height: 24,
    flex: 3,
    fontSize: 12,
  },
  body_text: {
    // height: 48,
    flex: 2,
    margin: 5,
    fontSize: 10,
  },
});
