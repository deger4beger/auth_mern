import s from "./Footer.module.css"

export function Footer() {
    return (
    	<div className={s.wrapper}>
    		<div className={s.container}>
    			<div className={s.upper}>
    				Some additional navigation or information
    			</div>
    			<div className={s.lower}>
    				deger © 2021
    			</div>  			
    		</div>   		
		</div>
 	)
}