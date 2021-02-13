import { Redirect, Route, Switch } from 'react-router-dom'
import React from "react";

import './App.css'
import { Header } from "./components/Header/Header"
import { HomePage } from "./components/mainBlock/HomePage/HomePage"
import { NotFound } from "./components/other/NotFound/NotFound"
import { Footer } from "./components/Footer/Footer"
import LoginPage from "./components/mainBlock/loginPage/LoginPage"
import Cabinet from "./components/mainBlock/Cabinet/Cabinet"

import 'rsuite/dist/styles/rsuite-default.css'

export const App = (props) => {
    return (
    	<>
    		<Header />
    		<div className={"wrapper"}>
	    		<div className={"mainBlock"}>
			        <Switch>
				  		<Route exact path="/">
				  			<Redirect to="/homepage"/>
				  		</Route>
				        <Route path="/homepage" render={() =>
				            <HomePage />}/>
				        <Route exact path="/loginpage/login" render={() =>
				            <LoginPage subComp={"log"}/>}/>
				        <Route exact path="/loginpage/registration" render={() =>
				            <LoginPage subComp={"reg"}/>}/>
				        <Route exact path="/loginpage/forgetpassword" render={() =>
				            <LoginPage subComp={"forget"}/>}/>
				        <Route exact path="/loginpage/resetpassword" render={() =>
				            <LoginPage subComp={"reset"}/>}/>
				        <Route exact path="/cabinet" render={() =>
				            <Cabinet /> } />
				        <Route path="*" render={() =>
				            <NotFound />}/>
				    </Switch>
			    </div>
		    </div>
		    <Footer />
	    </>
    )
}
