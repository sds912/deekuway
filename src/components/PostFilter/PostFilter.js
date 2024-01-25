import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import './PostFilter.css'
import firebase from '../../services/firebaseConfig';
import Loader from '../Loader/Loader';
import { PostFilterForm } from '../PostFilterForm/PostFilterForm';


const PostFilter = ({onPostListFilter, screen}) => {





  return (
    <>

    <div className='PostFilter'>
     <PostFilterForm onSubmitFilter={onPostListFilter} />
    </div>
    </>);
};

export default PostFilter;
