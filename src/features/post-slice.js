import { createSlice } from '@reduxjs/toolkit'
import firebase from '../services/firebaseConfig';

export const postSlice = createSlice({
  name: 'post',
  initialState: {
    value: [],
    total: 0
  },
  reducers: {
    getAllPost: state => {
      state.value.push({
        id: 1,
        title: 'OK'
      })
    },
    countPage: (state, action) => {
        console.log(action)
        let postRef = firebase.firestore().collection('posts');
    if(action.payload && action.payload.mode !== null && action.payload.mode !== 'all'){
    postRef = postRef.where('mode', '==', action.payload.mode);
    }
    if(action.payload && action.payload.type !== null && action.payload.type !== 'all'){
      postRef = postRef.where('type', '==', action.payload.type);
      }
    postRef.get().then(res => {
     
      console.log(res.docs.length);
    })

    },
  },
})


const loadPageTotal = (mode = null, type = null, state) => {
    let postRef = firebase.firestore().collection('posts');
    if(mode !== null && mode !== 'all'){
    postRef = postRef.where('mode', '==', mode);
    }
    if(type !== null && type !== 'all'){
      postRef = postRef.where('type', '==', type);
      }
    postRef.get().then(res => {
     
     state.total = res.docs.length;
    })

    
  }
 

// Action creators are generated for each case reducer function
export const {  getAllPost, countPage } = postSlice.actions

export default postSlice.reducer