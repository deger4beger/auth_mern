import { useState } from 'react'
import { useSpring, animated } from "react-spring"
import { Form, FormGroup, FormControl, HelpBlock, ControlLabel, Button,
		ButtonToolbar, Schema } from "rsuite"
import s from "./Registration.module.css"
import { signup } from "../../../../redux/authReducer"
import { useDispatch, useSelector } from 'react-redux'
import { Alert } from "rsuite"
import { useHistory } from 'react-router-dom'

const { StringType } = Schema.Types;
const model = Schema.Model({
  email: StringType()
    .isEmail('Please enter a valid email address.')
    .isRequired('This field is required.'),
  password: StringType().isRequired('This field is required.'),  
  confirmPassword: StringType().isRequired('This field is required.')
})		

export function Registration() {
	const [error, setError] = useState({})
	const [formData, setFormData] = useState({})
	const history = useHistory()
	const isLoading = useSelector( (state) => {
		return state.auth.isLoading
	})
	const dispatch = useDispatch()
	const onSubmit = async () => {
		const message = await dispatch(signup(formData))
		if (message[0] === "success") {
			Alert.success(message[1], 5000)
			history.push("/loginpage/login")
		} else {
			Alert.error(message[1], 5000)
			setFormData( prev => {
				console.log(prev)
				return {
					...prev,
					password: "",
					confirmPassword: ""
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
			      		disabled={isLoading}
			      		name="email" 
			      		placeholder="Email" 
			      		errorPlacement={"topEnd"}/>
			      	<HelpBlock>Required</HelpBlock>
			    </FormGroup>

			    <FormGroup>
			      	<ControlLabel className={s.label}>Password</ControlLabel>
			      	<FormControl 
			      		checkTrigger={"none"}
			      		type={"password"}
			      		disabled={isLoading}
			      		name="password" 
			      		placeholder="Password" 
			      		errorPlacement={"topEnd"} />
			      	<HelpBlock>Required</HelpBlock>
			    </FormGroup>
			    <FormGroup>
			      	<ControlLabel className={s.label}>Confirm password</ControlLabel>
			      	<FormControl 
			      		checkTrigger={"none"}
			      		type={"password"}
			      		disabled={isLoading}
			      		name="confirmPassword" 
			      		placeholder="Password" 
			      		errorPlacement={"topEnd"} />
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
        				disabled={!!Object.keys(error).length || !["email", "password", "confirmPassword"].every(u => Object.keys(formData).includes(u))}>      				
          				Sign up
        			</Button>
      			</ButtonToolbar>
			</Form>
    	</animated.div>
 	)
}