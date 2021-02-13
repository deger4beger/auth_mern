import { useState } from 'react'
import { Form, FormGroup, FormControl, HelpBlock, ControlLabel, Button,
		ButtonToolbar, Schema, Alert } from "rsuite"
import { forgetPass } from "../../../../redux/authReducer"		
import s from "./ForgetPassword.module.css"
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { useSpring, animated } from "react-spring"

const { StringType } = Schema.Types;
const model = Schema.Model({
  email: StringType()
    .isEmail('Please enter a valid email address.')
    .isRequired('This field is required.')
});		

export function ForgetPassword() {
	const [error, setError] = useState({})
	const [formData, setFormData] = useState({})
	const history = useHistory()
	const isLoading = useSelector( (state) => {
		return state.auth.isLoading
	})
	const dispatch = useDispatch()
	const onSubmit = async () => {
		const res = await dispatch(forgetPass(formData))
		if (res[0] === "success") {
			Alert.success(res[1], 5000)			
			history.push("/loginpage/resetpassword")
		} else {
			Alert.error(res[1], 5000)
			setFormData( prev => {
				return {
					...prev,
					email: ""
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
			      	<ControlLabel className={s.label}>Email</ControlLabel>
			      	<FormControl
			      		checkTrigger={"blur"}
			      		type={"email"}
			      		disabled={isLoading}
			      		name="email" 
			      		placeholder="Email" 
			      		errorPlacement={"topEnd"}/>
			      	<HelpBlock>Required</HelpBlock>
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
        				disabled={!!Object.keys(error).length || !["email"].every(u => Object.keys(formData).includes(u))}>      				
          				Send reset link
        			</Button>
      			</ButtonToolbar>
			</Form>
    	</animated.div>
 	)
}