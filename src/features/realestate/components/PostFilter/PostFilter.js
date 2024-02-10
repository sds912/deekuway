import React from 'react';
import './PostFilter.css'
import { PostFilterForm } from '../PostFilterForm/PostFilterForm';


const PostFilter = ({onPostListFilter, screen}) => {

  return (
    <>
    <div className='PostFilter'>
     <PostFilterForm onSubmitFilter={onPostListFilter}  />
    </div>
    </>);
};

export default PostFilter;
