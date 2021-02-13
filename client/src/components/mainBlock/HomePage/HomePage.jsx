import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import s from "./HomePage.module.css"
import { getPosts, deleteLike, setLike } from "../../../redux/postsReducer"
import { subscr, unsubscr } from "../../../redux/authReducer"
import { Post } from "./Post/Post"

export function HomePage() {
	const dispatch = useDispatch()
	const userId = useSelector( (state) => {
		return state.auth.userData?.id
	})
	const posts = useSelector( (state) => {
		return state.posts.posts
	})
	const subs = useSelector( (state) => {
		return state.auth.userData?.subs
	})
	const isAuth = useSelector( (state) => {
		return state.auth.isAuth
	})
	const isLoading = useSelector( (state) => {
		return state.posts.isLoading
	})
	const likePost = (postId) => {
		dispatch(setLike(postId, userId))
	}
	const unlikePost = (postId) => {
		dispatch(deleteLike(postId, userId))
	}
	const subscribe = (authorId) => {
		dispatch(subscr(authorId))
	}
	const unsubscribe = (authorId) => {
		dispatch(unsubscr(authorId))
	}
	useEffect( () => {
		dispatch(getPosts(false))
	}, [])
    return (
    	<div className={s.wrapper}>
    		{posts?.map(post => <Post
    			{...post}
    			key={post._id}
    			likePost={likePost}
    			unlikePost={unlikePost}
    			liked={post.likes.includes(userId)}
    			subscribe={subscribe}
    			unsubscribe={unsubscribe}
    			disabled={!isAuth}
    			loading={isLoading}
    			subscribed={ subs ? subs.includes(post.authorId._id) : false} />)}
		</div>
 	)
}