import axios from "axios"

const instance = axios.create({
	baseURL: "http://localhost:3000",
})

instance.interceptors.request.use((req) => {
	if (localStorage.getItem("profile")) {
		req.headers.Authorization = `Bearer ${JSON.parse(localStorage.getItem("profile")).token}`
	}
	return req
})

export const authApi = {
	signup(payload) {
		return instance.post("/user/signup", payload)
			.then(response => response.data)
	},

	login(payload) {
		return instance.post("/user/login", payload)
			.then(response => response.data)
	},

	forgetPass(payload) {
		return instance.put("/user/forgotpassword", payload)
			.then(response => response.data)
	},

	resetPass(payload) {
		return instance.put("/user/resetpassword", payload)
			.then(response => response.data)
	},

	deleteUser(payload) {
		return instance.delete(`/user/${payload.id}`)
			.then(response => response.data)
	},

	googleAuth(payload) {
		return instance.post("/user/googleauth", payload)
			.then(response => response.data)
	}
}

export const postsAPI = {
	getPosts(filter) {
		return instance.get(`posts?sub=${filter ? "true" : "false"}`)
			.then(response => response.data)
	},

	setLike(postId) {
		return instance.post(`posts/${postId}`)
			.then(response => response.data)
	},

	deleteLike(postId) {
		return instance.delete(`posts/${postId}`)
			.then(response => response.data)
	},

	subscribe(userId) {
		return instance.post(`user/sub/${userId}`)
			.then(response => response.data)
	},

	unsubscribe(userId) {
		return instance.delete(`user/sub/${userId}`)
			.then(response => response.data)
	}

}