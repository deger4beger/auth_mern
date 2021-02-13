import s from "./Cabinet.module.css"
import { Button, Alert } from "rsuite"
import { withoutAuthRedirect } from "../../other/hoc/withoutAuthRedirect"
import Modal from "../../other/Modal/Modal"
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { deleteAccount } from "../../../redux/authReducer"
import { useHistory } from 'react-router-dom';

function Cabinet() {
    const [modalActive, setModalActive] = useState(false)
    const dispatch = useDispatch()
    const history = useHistory()
    const isLoading = useSelector( (state) => {
        return state.auth.isLoading
    })
    const userId = useSelector( (state) => {
        return state.auth.userData.id
    })
    const isGoogle = useSelector( (state) => {
        return state.auth.userData.isGoogle
    })
    const deleteUser = async () => {
        const res = await dispatch(deleteAccount({id: userId}))
        if (res[0] === "success") {
            Alert.success(res[1], 5000)            
            history.push("/homepage")
        } else {
            Alert.error(res[1], 5000)
        }
    }
    return (
        <div className={s.wrapper}>
            <div className={s.container}>
                <div className={s.element}>
                    <div className={s.definition}>Delete account</div>
                    <div className={s.func}>
                        <Button className={s.deleteButton}
                            style={{backgroundColor: `#E84E4EFF`,
                                    color: "var(--firstBg)",
                                    padding: "4px 20px 6px 20px",
                                    fontSize: "20px"}}
                            loading={isLoading}
                            disabled={isGoogle}
                            onClick={setModalActive}
                            >
                            Delete
                        </Button>
                    </div>    
                </div>        
            </div>
            <Modal active={modalActive} setActive={setModalActive}>
                <div className={s.modalContainer}>
                    <div className={s.modalContent}>
                        Are you sure you want to delete your account ?                  
                    </div>
                    <div className={s.modalButton}>
                        <Button className={s.deleteButton}
                            style={{backgroundColor: `var(--mainSec)`,
                                    color: "var(--firstBg)",
                                    padding: "4px 20px 6px 20px",
                                    fontSize: "20px"}}
                            disabled={isGoogle}
                            loading={isLoading}
                            onClick={deleteUser}
                            >
                            Confirm
                        </Button>
                    </div>
                </div>               
            </Modal>           
        </div>
     )
}

export default withoutAuthRedirect(Cabinet)