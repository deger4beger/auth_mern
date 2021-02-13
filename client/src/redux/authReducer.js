import { authApi } from "../api/api"
import { postsAPI } from "../api/api"

const TOGGLE_IS_LOADING = "TOGGLE_IS_LOADING"
const AUTH = "AUTH"
const LOGOUT = "LOGOUT"
const SUBSCRIBE = "SUBSCRIBE"
const UNSUBSCRIBE = "UNSUBSCRIBE"


const initialState = {
	isLoading: false,
	userData: null,
	isAuth: false
}

export const authReducer = (state = initialState, action) => {
	switch(action.type) {
		case TOGGLE_IS_LOADING:
			return {
				...state,
				isLoading: action.isLoading
			}
		case AUTH:
			localStorage.setItem("profile", JSON.stringify({ ...action.payload }))
			return {
				...state,
				userData: action.payload,
				isAuth: true
			}
		case LOGOUT:
			localStorage.clear()
			return {
				...state,
				userData: null,
				isAuth: false
			}
		case SUBSCRIBE:
			const newState = {
				...state,
				userData: {
					...state.userData,
					subs: [
						...state.userData.subs,
						action.userId
					],
					subsCount: state.userData.subsCount + 1
				}
			}
			localStorage.setItem("profile", JSON.stringify(newState.userData))
			return newState
		case UNSUBSCRIBE:
			const updatedState = {
				...state,
				userData: {
					...state.userData,
					subs: state.userData.subs.filter(sub => sub !== action.userId),
					subsCount: state.userData.subsCount - 1
				}
			}
			localStorage.setItem("profile", JSON.stringify(updatedState.userData))
			return updatedState
		default:
			return state
	}
}

const toggleIsLoadingAC = (isLoading) => ({type: TOGGLE_IS_LOADING, isLoading})
export const authAC = (payload) => ({type: AUTH, payload})
export const logoutAC = () => ({type: LOGOUT})
const subscribeAC = (userId) => ({type: SUBSCRIBE, userId})
const unsubscribeAC = (userId) => ({type: UNSUBSCRIBE, userId})

export const signup = (payload) => async (dispatch) => {
	try {
		dispatch(toggleIsLoadingAC(true))
		const data = await authApi.signup(payload)
		dispatch(toggleIsLoadingAC(false))
		return ["success", data.message]
	} catch (err) {
		dispatch(toggleIsLoadingAC(false))
		if (err.response) {
			return ["error", err.response.data.error]
		}
		return ["error", "Check your data"]

	}
}

export const login = (payload) => async (dispatch) => {
	try {
		dispatch(toggleIsLoadingAC(true))
		const data = await authApi.login(payload)
		dispatch(authAC(data))
		dispatch(toggleIsLoadingAC(false))
		return ["success", data.message]
	} catch (err) {
		dispatch(toggleIsLoadingAC(false))
		if (err.response) {
			return ["error", err.response.data.error]
		}
		return ["error", "Check your data"]
	}
}

export const forgetPass = (payload) => async (dispatch) => {
	try {
		dispatch(toggleIsLoadingAC(true))
		const data = await authApi.forgetPass(payload)
		dispatch(toggleIsLoadingAC(false))
		return ["success", data.message]
	} catch(err) {
		dispatch(toggleIsLoadingAC(false))
		if (err.response) {
			return ["error", err.response.data.error]
		}
		return ["error", "Check your data"]
	}
}

export const resetPass = (payload) => async (dispatch) => {
	try {
		dispatch(toggleIsLoadingAC(true))
		const data = await authApi.resetPass(payload)
		dispatch(toggleIsLoadingAC(false))
		return ["success", data.message]
	} catch(err) {
		dispatch(toggleIsLoadingAC(false))
		if (err.response) {
			return ["error", err.response.data.error]
		}
		return ["error", "Check your data"]
	}
}

export const deleteAccount = (payload) => async (dispatch) => {
	try {
		dispatch(toggleIsLoadingAC(true))
		const data = await authApi.deleteUser(payload)
		dispatch(logoutAC())
		dispatch(toggleIsLoadingAC(false))
		return ["success", data.message]
	} catch (err) {
		dispatch(toggleIsLoadingAC(false))
		if (err.response) {
			return ["error", err.response.data.error]
		}
		return ["error", "Check your data"]
	}
}

export const googleAuth = (payload) => async (dispatch) => {
	try {
		dispatch(toggleIsLoadingAC(true))
		const data = await authApi.googleAuth(payload)
		dispatch(authAC(data))
		dispatch(toggleIsLoadingAC(false))
		return ["success", data.message]
	} catch (err) {
		console.log(err.response)
		dispatch(toggleIsLoadingAC(false))
		if (err.response) {
			return ["error", err.response.data.error]
		}
		return ["error", "Check your data"]
	}
}

export const subscr = (userId) => async (dispatch) => {
	try {
		dispatch(toggleIsLoadingAC(true))
		const posts = await postsAPI.subscribe(userId)
		dispatch(subscribeAC(userId))
		dispatch(toggleIsLoadingAC(false))
	} catch (err) {
		dispatch(toggleIsLoadingAC(false))
	}
}

export const unsubscr = (userId) => async (dispatch) => {
	try {
		dispatch(toggleIsLoadingAC(true))
		const posts = await postsAPI.unsubscribe(userId)
		dispatch(unsubscribeAC(userId))
		dispatch(toggleIsLoadingAC(false))
	} catch (err) {
		dispatch(toggleIsLoadingAC(false))
	}
}

