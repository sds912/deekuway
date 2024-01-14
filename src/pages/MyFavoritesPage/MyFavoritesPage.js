import React, { useEffect, useState }  from "react"
import PostListMobile from "../../components/PostListMobile/PostListMobile"
import firebase from '../../services/firebaseConfig';
import Loader from "../../components/Loader/Loader";
import { BottomNav } from "../../components/BottomNav/BottomNav";
import { useMediaQuery } from "react-responsive";
import { MobileNavBar } from "../../components/MobileNavBar/MobileNavBar";

export const  MyFavoritesPage = () => {

	const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
	const isTabletOrMobile = useMediaQuery({ query: '(max-width: 1224px)' })

    

   const handlePost = (post) => {

    }

    const fetchData = async (uid) => {
        setLoading(true);
        let query = firebase.firestore().collection('favorites').where('owner.uid', "==", uid)
       const dataList = [];
       await query.get().then(res => {
       res.docs.forEach(d => {
          dataList.push({
            id: d.id,
            ...d.data()
          })
       })
       })
       .catch(err => setLoading(false))
       setPosts(dataList);
       setLoading(false);
      
      };
      
    

    
    
      useEffect(() => {
  firebase.auth().onAuthStateChanged(user =>{
    if(user.uid){
      fetchData(user.uid);
    }
  })
        
     // Clean up the listener when unmounti
      },[]);

    return (
        <>
       {isTabletOrMobile && <MobileNavBar />}

       { loading ? <Loader  /> : <div className="p-4">
          <h4>Mes annonces</h4>
          <div style={{marginTop: '50px'}}>
            {posts && <PostListMobile posts={posts} postToHomePage={handlePost} favorites={[]}/>} 
          </div>
       </div>}
       {isTabletOrMobile  &&  <BottomNav />}
       </>
       )

}