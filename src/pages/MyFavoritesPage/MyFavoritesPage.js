import React, { useEffect, useState }  from "react"
import PostListMobile from "../../components/PostListMobile/PostListMobile"
import firebase from '../../services/firebaseConfig';
import Loader from "../../components/Loader/Loader";
import { BottomNav } from "../../components/BottomNav/BottomNav";
import { useMediaQuery } from "react-responsive";

export const  MyFavoritesPage = () => {

	const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
	const isTabletOrMobile = useMediaQuery({ query: '(max-width: 1224px)' })

    

   const handlePost = (post) => {

    }

    const fetchData = async (mode = 'all', search = null) => {
        setLoading(true);
        let query = firebase.firestore().collection('posts');
      
        if (mode === 'location') {
          query = query.where('mode', '==', 'location');
        } else if (mode === 'vente') {
          query = query.where('mode', '==', 'vente');
        }
      
        if (search !== null) {
          query = query.where('title', '>=', search); // Changed '<=' to '>=' for search
        }
      
        query.onSnapshot((snapshot) => {
          snapshot.docChanges().forEach((change) => {
            const doc = change.doc;
            const postData = {
              id: doc.id,
              ...doc.data()
            };
      
            if (change.type === 'added') {
              // Handle added document
              setPosts((prevPosts) => [...prevPosts, postData]);
            } else if (change.type === 'modified') {
              // Handle modified document
              setPosts((prevPosts) =>
                prevPosts.map((post) => (post.id === postData.id ? postData : post))
              );
            } else if (change.type === 'removed') {
              // Handle removed document
              setPosts((prevPosts) =>
                prevPosts.filter((post) => post.id !== postData.id)
              );
            }
          });
      
          setLoading(false);
        });
      };
      
    

    
    
      useEffect(() => {
       fetchData();
     // Clean up the listener when unmounti
      },[]);

    return (
        <>
       { loading ? <Loader  /> : <div className="p-4">
          <h4>Mes annonces</h4>
          <div>
            {posts && <PostListMobile posts={posts} postToHomePage={handlePost} favorites={[]}/>} 
          </div>
       </div>}
       {isTabletOrMobile  &&  <BottomNav />}
       </>
       )

}