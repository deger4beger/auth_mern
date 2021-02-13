import {createStore, combineReducers, applyMiddleware, compose} from "redux"
import thunkMiddleware from "redux-thunk"
import { authReducer } from "./authReducer"
import { postsReducer } from "./postsReducer"

let rootReducer = combineReducers({
	auth: authReducer,
	posts: postsReducer
})


const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ &&
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({ trace: true, traceLimit: 25 }) || compose;
let store = createStore(rootReducer, composeEnhancers(applyMiddleware(thunkMiddleware)))


export default store