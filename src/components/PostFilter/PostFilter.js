import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import './PostFilter.css'
import firebase from '../../services/firebaseConfig';


const PostFilter = ({onPostListFilter, screen}) => {

const [mode, setMode] = useState('all');
const [distances, setDistances] = useState([]);
const [appartementOptions, setAppartementOptions] = useState([]);
const [distance, setDistance] = useState(2);
const [budget, setBudget] = useState(null);
const [type, setType] = useState('appartement');



  useEffect(() => {
    generateDistances(2, 20, 2);
    generateAppartementOptions();
  }, [])

  const  generateDistances =  (minDistance, maxDistance, step) => {
    const distances = [];
    
    for (let i = minDistance; i <= maxDistance; i += step) {
      distances.push({
        label: `${i}km`,
        value: i
      });
    }
    
    setDistances(distances);
  }

  const generateAppartementOptions = () => {
    // Generate dynamic appartement options here
    const appartementTypes = ['Appartement', 'Studio', 'Chambre', 'Bureau', 'Magasin'];
    const options = appartementTypes.map((type) => (
      <option key={type.toLowerCase()} value={type.toLowerCase()}>
        {type}
      </option>
    ));
    setAppartementOptions(options);
  };


  const search = () => {
    // Construct the query based on selected filters
    let query = firebase.firestore().collection('posts');

    if (mode !== null && mode !== 'all') {
      query = query.where('mode', '==', mode); 
    }
    /*
    if (distance !== null) {
      query = query.where('distance', '>=', distance); 
    }
    */
    if (type !== null) {
      query = query.where('type', '==', type); 
    }
    if (budget !== null && budget !== '') {
      query = query.where('price', '<', budget);
    }

    query.get().then((querySnapshot) => {
      const filteredData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));
      console.log(filteredData)
      onPostListFilter(filteredData);
    }).catch((error) => {
      console.error('Error fetching filtered data:', error);
    });
  };

  const searchMode = (mode) =>{
    let query = firebase.firestore().collection('posts');

    if (distance !== null) {
      query = query.where('mode', '==', mode);
    }
   

    query.get().then((querySnapshot) => {
      const filteredData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));
      setMode(mode);
      onPostListFilter(filteredData);

    }).catch((error) => {
      console.error('Error fetching filtered data:', error);
    });
  }

  return (
    <div className='PostFilter'>
      <div className='search w-100'>
        <div className='d-flex'>
           <button className={mode === 'all'? 'btn-mode btn-mode-active': 'btn-mode'} onClick={() => setMode('all')}>Tous</button>
           <button className={mode === 'location'? 'btn-mode btn-mode-active': 'btn-mode'} onClick={() => setMode('location')}>Location</button>
           <button className={mode === 'vente'? 'btn-mode btn-mode-active': 'btn-mode'} onClick={() => setMode('vente')}>Vente</button>
        </div>
        <div className={ screen === 'Mobile'? 'bg-white p-2' :'d-flex justify-content-start align-items-end bg-white p-2'}>
           <div className='form-group mb-3 w-100'>
              <label className='form-label'>Distance</label>
              <select defaultValue={distance} className='form-select w-100' onChange={(e) => setDistance(e.target.value)} >
                <option disabled selected value={null}>Choisir la distance</option>
                {distances.map(distance => <option className='text-muted' value={distance.value}>{distance.label}</option>)}
              </select>
           </div>
           <div className='form-group  mb-3 w-100' >
              <label className='form-label '>Type d'appartement</label>
              <select defaultValue={type} className='form-select distance-input w-100' onChange={(e) => setType(e.target.value)}>
                <option disabled selected value={null}>Choisir la type</option>
                {appartementOptions}
              </select>
           </div>
           <div className='form-group mb-3 w-100'>
              <label className='form-label'>Budget</label>
              <input defaultValue={budget} type='number' className='form-control w-100' placeholder='15 000' onChange={(e) => setBudget(e.target.value)}  />
           </div>
           {screen !== 'Mobile' &&<div >
              <button className='btn btn-warning search-btn ms-3' onClick={() => search()}>
                <i className='fa fa-search'></i>
              </button>
           </div>}
           {screen === 'Mobile' &&<div  className='mt-5 w-100 text-center'>
              <button className='btn btn-warning  ms-3 btn-block py-3' style={{width: '70%'}} onClick={() => search()}>
                <span className='ms-2 fw-bold'>APPLIQUER LE FILTRE</span>
              </button>
           </div>}
        </div>
      </div>
    </div>
  );
};

export default PostFilter;
