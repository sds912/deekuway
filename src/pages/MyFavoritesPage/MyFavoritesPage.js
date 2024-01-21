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
        loadData();
      },[]);

      const loadData = () => {
        firebase.auth().onAuthStateChanged(user =>{
          if(user.uid){
            fetchData(user.uid);
          }
        })
      }

    return (
        <>
       {isTabletOrMobile && <MobileNavBar />}
       <div>
        <h4>Mes recherches</h4>
       </div>
       { loading ? <Loader  /> : <div className="p-4">
          <h4 style={{marginTop: '60px'}}>Mes annonces favories</h4>
          <div style={{marginTop: '20px'}}>
            {posts && <PostListMobile 
            posts={posts} 
            postToHomePage={() => {}} 
            favorites={[]} 
            reloadData={loadData}
            screen={'favorite'} />} 
          </div>
       </div>}
       {isTabletOrMobile  &&  <BottomNav />}
       </>
       )

}