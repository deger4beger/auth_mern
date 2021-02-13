import { ThemeProvider } from "react-switch-theme"
import { useDispatch } from 'react-redux'
import { App } from "./App"
import { useEffect } from 'react'
import { authAC, logoutAC } from "./redux/authReducer"
import decode from "jwt-decode" 

export const AppContainer = () => {
	const dispatch = useDispatch()
	useEffect( () => {
		const userData = JSON.parse(localStorage.getItem("profile"))
		if (userData) {
			const decodedToken = decode(userData.token)

			if (decodedToken.exp * 1000 < new Date().getTime()) {
				dispatch(logoutAC())
				return null
			}
			dispatch(authAC(JSON.parse(localStorage.getItem("profile"))))	
		}
	}, [])
	const colors = {
		light: {
		  	firstBg: "#ececed",
		  	secBg: "#fff",
		  	additional: "#999999FF",
		 	color: "black",
		 	main: "rgb(56, 182, 255)",
		 	mainSec: "#E84E4EFF"
		},
		dark: {
		  	firstBg: "rgb(18, 18, 21)",
		  	secBg: "rgb(30, 30, 33)",
		  	additional: "#4F4F4FFF",
		 	color: "#ececed",
		 	main: "rgb(56, 182, 255)",
		 	mainSec: "#E84E4EFF"
		}
	}
	const activeMode = "dark"
	const offlineStorageKey = "regergegre26784"


	return (		
		<ThemeProvider
			colors={colors}
			activeMode={activeMode}
			offlineStorageKey={offlineStorageKey}>
				<App />
		</ThemeProvider>
	)
}