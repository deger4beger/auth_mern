import { Link } from 'react-router-dom';
import { Login } from "./Login/Login"
import { Registration } from "./Registration/Registration"
import { ForgetPassword } from "./ForgetPassword/ForgetPassword"
import { ResetPassword } from "./ResetPassword/ResetPassword"
import s from "./LoginPage.module.css"
import { withAuthRedirect } from "../../other/hoc/withAuthRedirect"
import { GoogleAuth } from "./GoogleLogin/GoogleLogin"

function LoginPage({subComp}) {
    const renderElement = () => {
        switch(subComp) {
            case "log":
                return <Login />
            case "reg":
                return <Registration />   
            case "forget":
                return <ForgetPassword />   
            case "reset":
                return <ResetPassword />  
            default:
                return null         
        }
    }
    return (
        <div className={s.wrapper}>
            <div className={s.top}>
                <div className={s.left}>
                    {renderElement()}
                </div>
                <div className={s.topText}>
                    Or login via google
                    <GoogleAuth />
                </div>
            </div>
            <div className={s.bottom}>
                Don't have an account ? Create <Link to={"/loginpage/registration"} style={{color: "var(--main)"}}><span className={s.newAccButton}>new</span></Link>
            </div>
        </div>
     )
}

export default withAuthRedirect(LoginPage)

