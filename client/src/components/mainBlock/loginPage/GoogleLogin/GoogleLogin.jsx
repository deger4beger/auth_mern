import GoogleLogin from "react-google-login"
import { googleAuth } from "../../../../redux/authReducer"
import {useDispatch} from "react-redux";
import { useHistory } from 'react-router-dom';
import {Alert} from "rsuite";

export function GoogleAuth() {
    const dispatch = useDispatch()
    const history = useHistory()
    const responseSuccess = async (response) => {
        const res = await dispatch(googleAuth({tokenId: response.tokenId}))
        if (res[0] === "success") {
            Alert.success(res[1], 5000)
            history.push("/")
        } else {
            Alert.error(res[1], 5000)
        }
    }
    const responseError = (response) => {
        console.log(response)
    }
    return (
    	<div>
    		<GoogleLogin
                clientId="812496501226-1d2cv9v92kgb6ikhitpcnjnoco91a1lq.apps.googleusercontent.com"
                buttonText="Login with Google"
                onSuccess={responseSuccess}
                onFailure={responseError}
                cookiePolicy={'single_host_origin'}
            />
		</div>
 	)
}