import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import './PostFilter.css'
import firebase from '../../services/firebaseConfig';


const PostFilter = ({onPostListFilter}) => {

const [mode, setMode] = useState('location');
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

    if (distance !== null) {
      query = query.where('distance', '>=', distance); 
    }
    if (type !== null) {
      query = query.where('type', '==', type); 
    }
    if (budget !== null) {
      query = query.where('price', '<=', parseInt(budget));
    }

    query.get().then((querySnapshot) => {
      const filteredData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));
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
           <button className={mode === 'location'? 'btn-mode btn-mode-active': 'btn-mode'} onClick={() => searchMode('location')}>Location</button>
           <button className={mode === 'vente'? 'btn-mode btn-mode-active': 'btn-mode'} onClick={() => searchMode('vente')}>Vente</button>
        </div>
        <div className='d-flex justify-content-start align-items-end bg-white p-2'>
           <div className='form-group '>
              <label className='form-label'>Distance</label>
              <select defaultValue={distance} className='form-select' onChange={(e) => setDistance(e.target.value)} >
                {distances.map(distance => <option className='text-muted' value={distance.value}>{distance.label}</option>)}
              </select>
           </div>
           <div className='form-group px-4' >
              <label className='form-label '>Type</label>
              <select defaultValue={type} className='form-select distance-input' onChange={(e) => setType(e.target.value)}>
              {appartementOptions}
              </select>
           </div>
           <div className='form-group'>
              <label className='form-label'>Budget</label>
              <input defaultValue={budget} type='number' className='form-control' placeholder='15 000' onChange={(e) => setBudget(e.target.value)}  />
           </div>
           <div >
              <button className='btn btn-warning search-btn ms-3' onClick={() => search()}>
                <i className='fa fa-search'></i>
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default PostFilter;
