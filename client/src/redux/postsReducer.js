import { postsAPI } from "../api/api"

const TOGGLE_IS_LOADING = "TOGGLE_IS_LOADING"
const SET_POSTS = "SET_POSTS"
const SET_LIKE = "SET_LIKE"
const DELETE_LIKE = "DELETE_LIKE"


const initialState = {
	isLoading: false,
	posts: null
}

export const postsReducer = (state = initialState, action) => {
	switch(action.type) {
		case TOGGLE_IS_LOADING:
			return {
				...state,
				isLoading: action.isLoading
			}
		case SET_POSTS:
			return {
				...state,
				posts: [
					...action.posts
				]
			}
		case SET_LIKE:
			return {
				...state,
				posts: state.posts.map(post => {
					if ( post._id === action.postId ) {
						return { ...post,
							likes: [ ...post.likes, action.userId],
							likesCount: post.likesCount + 1
						}
					}
					return post
				})
			}
		case DELETE_LIKE:
			return {
				...state,
				posts: state.posts.map(post => {
					if ( post._id === action.postId ) {
						return { ...post,
							likes: post.likes.filter(like => like !== action.userId),
							likesCount: post.likesCount - 1
						}
					}
					return post
				})
			}
		default:
			return state
	}
}

const toggleIsLoadingAC = (isLoading) => ({type: TOGGLE_IS_LOADING, isLoading})
const setPostsAC = (posts) => ({type: SET_POSTS, posts})
const setLikeAC = (postId, userId) => ({type: SET_LIKE, postId, userId})
const deleteLikeAC = (postId, userId) => ({type: DELETE_LIKE, postId, userId})


export const getPosts = (filter) => async (dispatch) => {
	try {
		dispatch(toggleIsLoadingAC(true))
		const posts = await postsAPI.getPosts(filter)
		dispatch(setPostsAC(posts.posts))
		dispatch(toggleIsLoadingAC(false))
	} catch (err) {
		dispatch(toggleIsLoadingAC(false))
	}
}

export const setLike = (postId, userId) => async (dispatch) => {
	try {
		dispatch(toggleIsLoadingAC(true))
		const posts = await postsAPI.setLike(postId)
		dispatch(setLikeAC(postId, userId))
		dispatch(toggleIsLoadingAC(false))
	} catch (err) {
		dispatch(toggleIsLoadingAC(false))
	}
}

export const deleteLike = (postId, userId) => async (dispatch) => {
	try {
		dispatch(toggleIsLoadingAC(true))
		const posts = await postsAPI.deleteLike(postId)
		dispatch(deleteLikeAC(postId, userId))
		dispatch(toggleIsLoadingAC(false))
	} catch (err) {
		dispatch(toggleIsLoadingAC(false))
	}
}

