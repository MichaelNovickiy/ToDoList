import {authAPI, securityAPI} from '../api/api';
import {setAppStatusAC} from './app-reducer';

//types
const SET_USER_DATA = 'AUTH_SET_USER_DATA'
const GET_CAPTCHA_URL_SUCCESS = 'GET_CAPTCHA_URL_SUCCESS'
const SET_ERROR = 'SET_ERROR'
type setAuthUserDataPayloadType = { id: number | null, email: string | null, login: string | null, isAuth: boolean }
type setAuthUserDataType = {
    type: typeof SET_USER_DATA,
    payload: setAuthUserDataPayloadType
}
type getCaptchaUrlSuccessType = { type: typeof GET_CAPTCHA_URL_SUCCESS, payload: { captchaUrl: string } }

export type authStateType = {
    id: number | null,
    email: string | null,
    login: string | null,
    isAuth: false,
    captchaUrl: string | null,
    error: string
}

//initial state
let initialState: authStateType = {
    id: null,
    email: null,
    login: null,
    isAuth: false,
    captchaUrl: null,
    error: ''
}

//reducer
export const authReducer = (state: authStateType = initialState, action: any): authStateType => {
    switch (action.type) {
        case SET_USER_DATA:
        case GET_CAPTCHA_URL_SUCCESS: {
            return {...state, ...action.payload}
        }
        case SET_ERROR: {
            return {...state, error: action.payload}
        }

        default:
            return state;
    }
}

//action creators
export const setAuthUserData = (id: number | null, email: string | null, login: string | null, isAuth: boolean): setAuthUserDataType => (
    {type: SET_USER_DATA, payload: {id, email, login, isAuth}})

export const getCaptchaUrlSuccess = (captchaUrl: string): getCaptchaUrlSuccessType => ({
    type: GET_CAPTCHA_URL_SUCCESS,
    payload: {captchaUrl}
})

export const setError = (errorMessage: string): any => ({type: SET_ERROR, payload: errorMessage})

//thanks
export const getAuthUserData = () => async (dispatch: any) => {
    dispatch(setAppStatusAC('loading'))
    let response = await authAPI.me();
    // @ts-ignore
    if (response.data.resultCode === 0) {
        // @ts-ignore
        let {id, login, email} = response.data.data;
        dispatch(setAuthUserData(id, email, login, true))
    }
    dispatch(setAppStatusAC('idle'))
}

export const login = (email: string, password: string, rememberMe: boolean, captcha: any) => async (dispatch: any) => {
    dispatch(setAppStatusAC('loading'))
    const response = await authAPI.login(email, password, rememberMe, captcha)
    // @ts-ignore
    if (response.data.resultCode === 0) {
        dispatch(getAuthUserData())
    } else {
        // @ts-ignore
        if (response.data.resultCode === 10) {
            dispatch(getCaptchaUrl())
        }
        // @ts-ignore
        let message = response.data.messages.length > 0 ? response.data.messages[0] : 'Some error'
        dispatch(setError(message))
    }
    dispatch(setAppStatusAC('idle'))
}

export const logout = () => async (dispatch: any) => {
    dispatch(setAppStatusAC('loading'))
    const response = await authAPI.logout()
    // @ts-ignore
    if (response.data.resultCode === 0) {
        dispatch(setAuthUserData(null, null, null, false))
    }
    dispatch(setError(''))
    dispatch(setAppStatusAC('idle'))
}

export const getCaptchaUrl = () => async (dispatch: any) => {
    dispatch(setAppStatusAC('loading'))
    const response = await securityAPI.getCaptchaUrl()
    // @ts-ignore
    const captchaUrl = response.data.url
    dispatch(getCaptchaUrlSuccess(captchaUrl))
    dispatch(setAppStatusAC('idle'))
}