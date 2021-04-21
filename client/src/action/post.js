import axios from 'axios'
import { setAlert } from './alert'
import { ADD_POST, DELETE_POST, GET_POST, GET_SINGLE_POST, POST_ERROR, UPDATE_LIKES, ADD_COMMENT, REMOVE_COMMENT } from './types'



/// get posts
export const getPosts = () => async dispatch => {
    try {
        const res = await axios.get('/api/post/all')
        dispatch({
            type: GET_POST,
            payload: res.data
        })
    } catch (err) {
        dispatch({
            type: POST_ERROR,
            payload:{msg:err.response.statusText, status: err.response.status}
        })
    }
}


//remove likes

export const removeLike = id => async dispatch => {
    try {
        const res = await axios.put(`/api/post/unlike/${id}`)
        dispatch({
            type: UPDATE_LIKES,
            payload: { id, likes: res.data}
        })
    } catch (err) {
        dispatch({
            type: POST_ERROR,
            payload:{msg:err.response.statusText, status: err.response.status}
        })
    }
}

//add likes

export const addLike = id => async dispatch => {
    try {
        const res = await axios.put(`/api/post/like/${id}`)
        dispatch({
            type: UPDATE_LIKES,
            payload: { id, likes: res.data}
        })
    } catch (err) {
        dispatch({
            type: POST_ERROR,
            payload:{msg:err.response.statusText, status: err.response.status}
        })
    }
}

//Delete Posts

export const deletePost = id => async dispatch => {
    try {
        await axios.delete(`/api/post/delete/${id}`)
        dispatch({
            type: DELETE_POST,
            payload: id
        })
        dispatch(setAlert('Post Removed', 'success'))
    } catch (err) {
        dispatch({
            type: POST_ERROR,
            payload:{msg:err.response.statusText, status: err.response.status}
        })
    }
}



/// get add post
export const addPost = formData => async dispatch => {
    const config = {
        headers: {'Content-type': 'application/json'}
    }

    try {
        const res = await axios.post(`/api/post/create`, formData, config)
        dispatch({
            type: ADD_POST,
            payload: res.data
        })
        dispatch(setAlert('Post Added', 'success'))
    } catch (err) {
        dispatch({
            type: POST_ERROR,
            payload:{msg:err.response.statusText, status: err.response.status}
        })
    }
}


/// get single post
export const getSinglePosts = id => async dispatch => {
    try {
        const res = await axios.get(`/api/post/${id}`)
        dispatch({
            type: GET_SINGLE_POST,
            payload: res.data
        })
    } catch (err) {
        dispatch({
            type: POST_ERROR,
            payload:{msg:err.response.statusText, status: err.response.status}
        })
    }
}


// get add Comment
export const addComment = (postId, formData) => async dispatch => {
    const config = {
        headers: {'Content-type': 'application/json'}
    }

    try {
        const res = await axios.post(`/api/post/comment/${postId}`, formData, config)
        dispatch({
            type: ADD_COMMENT,
            payload: res.data
        })
        dispatch(setAlert('Comment Added', 'success'))
    } catch (err) {
        dispatch({
            type: POST_ERROR,
            payload:{msg:err.response.statusText, status: err.response.status}
        })
    }
}


// get delete Comment
export const deleteComment = (postId, commentId) => async dispatch => {
   
    try {
        await axios.delete(`/api/post/comment/${postId}/${commentId}`)
        dispatch({
            type: REMOVE_COMMENT,
            payload: commentId
        })
        dispatch(setAlert('Comment Removed!', 'success'))
    } catch (err) {
        dispatch({
            type: POST_ERROR,
            payload:{msg:err.response.statusText, status: err.response.status}
        })
    }
}
