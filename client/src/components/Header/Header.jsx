import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useContext } from 'react';
import { Theme } from "react-switch-theme"
import s from "./Header.module.css"
import butterflyImg from "../../assets/logo.png"
import loginIcon from "../../assets/loginIcon.png"
import logoutIcon from "../../assets/logoutIcon.png"
import sun from "../../assets/sun.png"
import moon from "../../assets/moon.png"
import cn from "classnames"
import { Button } from "rsuite"
import { logoutAC } from "../../redux/authReducer"

export function Header() {
    // let activeColorMode = useSelector( (state) => state.initial.activeColorMode )
    const dispatch = useDispatch()
    const [activeColorMode, setMode] = useContext(Theme)
    const isAuth = useSelector( (state) => {
        return state.auth.isAuth
    })
    const isLoading = useSelector( (state) => {
        return state.auth.isLoading
    })

    const setActiveColorMode = () => {
        const theme = activeColorMode === "dark" ? "light" : "dark"
        setMode(theme)
    }

    const logout = () => {
        dispatch(logoutAC())
    }

    return (
        <div className={s.wrapper}>
            <div className={s.content}>
                <div className={s.left}>
                    <Link to={"/homepage"} className={s.link}>
                        <div className={cn(s.link, s.logo)}>
                            <img src={butterflyImg} alt="#" className={s.logoImg}/>
                            de<span className={s.span}>g</span>er
                        </div>
                    </Link>
                    <Link className={cn(s.link, s.route)} to={"/1"}>Route1</Link>
                    <Link className={cn(s.link, s.route)} to={"/2"}>Route2</Link>
                </div>            
                <div className={s.right}>
                    { isAuth ?
                    <Link className={cn(s.link)} to={"/cabinet"}>
                        <Button className={cn(s.loginButton, s.cabinetButton)}
                            style={{backgroundColor: `var(--main)`,
                                color: "var(--firstBg)",
                                padding: "4px 20px 6px 20px",
                                fontSize: "20px"}}
                            loading={isLoading}>  
                            Cabinet
                        </Button>
                    </Link> : null
                    }
                    
                    <div className={s.themeSwitcher}>
                        <img
                            src={activeColorMode === "dark" ? sun : moon}
                            alt="#"
                            className={activeColorMode === "dark" ? s.themeIconSun : s.themeIconMoon}
                            onClick={setActiveColorMode}/>        
                    </div>
                    {!isAuth ? 
                        <Link className={cn(s.link)} to={"/loginpage/login"}>
                            <Button className={s.loginButton}
                                    style={{backgroundColor: `var(--main)`,
                                        color: "var(--firstBg)",
                                        padding: "4px 30px 6px 20px",
                                        fontSize: "20px"}}
                                    loading={isLoading}>
                                <img src={loginIcon} alt="#" className={s.loginIcon}/>
                                Login
                            </Button>
                        </Link>
                    :
                        <Button className={s.loginButton}
                                style={{backgroundColor: `var(--main)`,
                                        color: "var(--firstBg)",
                                        padding: "4px 30px 6px 16px",
                                        fontSize: "20px"}}
                                loading={isLoading}
                                onClick={logout}>
                            <img src={logoutIcon} alt="#" className={s.loginIcon}/>
                            Logout
                        </Button>    
                    }
                </div>
            </div>        
        </div>
     )
}