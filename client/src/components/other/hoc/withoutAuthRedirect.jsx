import {Redirect} from "react-router-dom"
import React from "react"
import {connect} from "react-redux"

let mapStateToPropsForRedirect = (state) => ({
		isAuth: state.auth.isAuth
	})

export const withoutAuthRedirect = (Component) => {
	class RedirectComponent extends React.Component {
		render() {
			if (!this.props.isAuth) return <Redirect to="/loginpage/login" />	
				return <Component {...this.props} />
		}
	}

	let ConnectedAuthRedirectComponent = connect(mapStateToPropsForRedirect)(RedirectComponent)

	return ConnectedAuthRedirectComponent
}