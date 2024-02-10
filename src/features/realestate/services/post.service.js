import firebase from "./firebaseConfig";
import  data  from "../../../../../assets/data.json";

const postRef      = firebase.firestore().collection('posts');

const initFakeData = () =>{

  data.posts.forEach(d => {
    postRef.add({ ...d, createdAt: firebase.firestore.FieldValue.serverTimestamp() });
  })

}
const addPost = (post) => {
return firebase.firestore().collection('posts').add(post);
}
export const PostService = {
  initFakeData,
  addPost
}