import axios from "axios";
import {REGISTER_FAILED, REGISTER_SUCCESS, USER_LOADED, AUTH_ERROR, LOGIN_FAILED, LOGIN_SUCCESS, LOGOUT, CLEAR_PROFILE } from './types'
import { setAlert } from './alert'
import setAuthToken from '../util/setAuthToken'


//LOAD USER 
export const loadUser = () => async dispatch => {
    if(localStorage.token){
        setAuthToken(localStorage.token)
    }
    try {
        const res = await axios.get('/api/auth')
        console.log(res.data)
        dispatch({
            type: USER_LOADED,
            payload:res.data
        })
       
    } catch (err) {
        dispatch({
            type:AUTH_ERROR
        })
    }
}
//register user

export const register = ({name,email,password}) => async dispatch =>{
    const config = {
        'Content-Type': 'application/json'
    }
    const body = { name, email, password}
    try {
        const res = await axios.post('/api/users', body, config)
        console.log(res.data)
        dispatch({
            type: REGISTER_SUCCESS,
            payload: res.data,
            
        });
        dispatch(loadUser())
    } catch (err) {
        console.log(err)
        const errors = err.response.data.errors
        if(errors){
            errors.forEach(error =>dispatch(setAlert(error.msg, 'danger')))
        }
        dispatch({
            type:REGISTER_FAILED,
        })
    }
}

//Login user
export const login = (email, password) => async dispatch =>{
    const config = {
        'Content-Type': 'application/json'
    }
    const body = { email, password}
    try {
        const res = await axios.post('/api/auth/login', body, config)
        console.log(res.data)
        dispatch({
            type: LOGIN_SUCCESS ,
            payload: res.data,
            
        });
        dispatch(loadUser())
    } catch (err) {
        console.log(err)
        const errors = err.response.data.errors
        if(errors){
            errors.forEach(error =>dispatch(setAlert(error.msg, 'danger')))
        }
        dispatch({
            type:LOGIN_FAILED,
        })
    }
}


//LOGOUT

export const logout = () => dispatch => {
    dispatch({type:LOGOUT})
    dispatch({type:CLEAR_PROFILE})
}