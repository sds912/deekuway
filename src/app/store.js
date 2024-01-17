import { configureStore } from '@reduxjs/toolkit'
import  postReducer  from './../features/post-slice';

export default configureStore({
  reducer: {
    post: postReducer
  },
})