import { useState } from 'react'
import { Form, FormGroup, FormControl, HelpBlock, ControlLabel, Button,
		ButtonToolbar, Schema, Checkbox, CheckboxGroup, Alert } from "rsuite"
import { login } from "../../../../redux/authReducer"		
import s from "./Login.module.css"
import { useDispatch, useSelector } from 'react-redux'
import { Link, useHistory } from 'react-router-dom';

const { StringType } = Schema.Types;
const model = Schema.Model({
  email: StringType()
    .isEmail('Please enter a valid email address.')
    .isRequired('This field is required.'),
  password: StringType().isRequired('This field is required.'),  
});		

export function Login() {
	const [error, setError] = useState({})
	const [formData, setFormData] = useState({})
	const history = useHistory()
	const isLoading = useSelector( (state) => {
		return state.auth.isLoading
	})
	const dispatch = useDispatch()
	const onSubmit = async () => {
		const {email, password} = formData
		const rememberMe = formData.checkbox && formData.checkbox?.length === 1 ? formData.checkbox[0] : false
		const payload = {email, password, rememberMe}
		const res = await dispatch(login(payload))
		if (res[0] === "success") {
			Alert.success(res[1], 5000)			
			history.push("/")
		} else {
			Alert.error(res[1], 5000)
			setFormData( prev => {
				return {
					...prev,
					password: ""
				}
			})
		}
	}	
    return (
    	<div className={s.wrapper}>
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

			    <FormGroup>
			      	<ControlLabel className={s.label}>Password</ControlLabel>
			      	<FormControl 
			      		checkTrigger={"blur"}
			      		type={"password"}
			      		disabled={isLoading}
			      		name="password" 
			      		placeholder="Password" 
			      		errorPlacement={"topEnd"} /> 
					<HelpBlock>Required <Link to={"/loginpage/forgetpassword"} style={{color: "var(--main)"}} className={s.forgetPassword}><span>Forget password ?</span></Link></HelpBlock>
			    </FormGroup>
			    <FormGroup>
				    <FormControl
				    	  disabled={isLoading}
				          name="checkbox"
				          accepter={CheckboxGroup}
				        >
				          <Checkbox value={true}>
				            Remember me
				          </Checkbox>
				        </FormControl>
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
        				disabled={!!Object.keys(error).length || !["email", "password"].every(u => Object.keys(formData).includes(u))}>      				
          				Login
        			</Button>
      			</ButtonToolbar>
			</Form>
    	</div>
 	)
}