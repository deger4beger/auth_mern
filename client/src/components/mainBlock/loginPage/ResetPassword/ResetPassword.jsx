import { useState } from 'react'
import { Form, FormGroup, FormControl, HelpBlock, ControlLabel, Button,
		ButtonToolbar, Schema, Alert } from "rsuite"
import { resetPass } from "../../../../redux/authReducer"		
import s from "./ResetPassword.module.css"
import { useDispatch, useSelector } from 'react-redux'
import { Link, useHistory } from 'react-router-dom'
import { useSpring, animated } from "react-spring"

const { StringType } = Schema.Types;
const model = Schema.Model({
  newPassword: StringType()
    .isRequired('This field is required.'),
  confirmNewPassword: StringType()
    .isRequired('This field is required.'),
  token: StringType()
    .isRequired('This field is required.')    
});		

export function ResetPassword() {
	const [error, setError] = useState({})
	const [formData, setFormData] = useState({})
	const history = useHistory()
	const isLoading = useSelector( (state) => {
		return state.auth.isLoading
	})
	const dispatch = useDispatch()
	const onSubmit = async () => {
		const res = await dispatch(resetPass(formData))
		if (res[0] === "success") {
			Alert.success(res[1], 5000)			
			history.push("/loginpage/login")
		} else {
			Alert.error(res[1], 5000)
			setFormData( prev => {
				return {
					...prev,
					newPassword: "",
					confirmNewPassword: ""
				}
			})
		}
	}	
	const styles = useSpring({
		transform: "translateY(0px)",
		opacity: 1,
		from: {
			transform: "translateY(-200px)",
			opacity: 0
		}
	})
    return (
    	<animated.div className={s.wrapper} style={styles}>
    		<Form model={model} onCheck={setError} onChange={setFormData} formValue={formData}>
			    <FormGroup>
			      	<ControlLabel className={s.label}>New password</ControlLabel>
			      	<FormControl
			      		checkTrigger={"blur"}
			      		type={"password"}
			      		disabled={isLoading}
			      		name="newPassword" 
			      		placeholder="Password" 
			      		errorPlacement={"topEnd"}/>
			      	<HelpBlock>Required</HelpBlock>
			    </FormGroup>
			    <FormGroup>
			      	<ControlLabel className={s.label}>Confirm new password</ControlLabel>
			      	<FormControl
			      		checkTrigger={"blur"}
			      		type={"password"}
			      		disabled={isLoading}
			      		name="confirmNewPassword" 
			      		placeholder="Confirm password" 
			      		errorPlacement={"topEnd"}/>
			      	<HelpBlock>Required</HelpBlock>
			    </FormGroup>
			    <FormGroup>
			      	<ControlLabel className={s.label}>Reset key</ControlLabel>
			      	<FormControl
			      		checkTrigger={"blur"}
			      		type={"password"}
			      		disabled={isLoading}
			      		name="token" 
			      		placeholder="Email" 
			      		errorPlacement={"topEnd"}/>
			      	<HelpBlock>Still don't have a key ? <Link to={"/loginpage/forgetpassword"} style={{color: "var(--main)"}} className={s.resend}><span>Resend</span></Link></HelpBlock>
			    </FormGroup> 
			    <ButtonToolbar>
        			<Button
        				loading={isLoading}
        				type="submit"
        				className={s.loginButton}
        				style={{backgroundColor: `var(--main)`,
        							color: "var(--firstBg)",
        							padding: "6px 30px 6px 30px",
        							fontSize: "20px"}}
        				onClick={onSubmit}
        				disabled={!!Object.keys(error).length || !["newPassword", "confirmNewPassword", "token"].every(u => Object.keys(formData).includes(u))}>      				
          				Confirm reset password
        			</Button>
      			</ButtonToolbar>
			</Form>
    	</animated.div>
 	)
}