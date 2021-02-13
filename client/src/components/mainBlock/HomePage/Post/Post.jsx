import s from "./Post.module.css"
import { Button, IconButton } from "rsuite"

export function Post(props) {
    const { likes, likesCount, _id, content, authorId, likePost,
        unlikePost, liked, subscribe, unsubscribe, subscribed, disabled,
        loading} = props
    const toggleLike = () => {
        liked ? unlikePost(_id) : likePost(_id)
    }
    const toggleSubscribe = () => {
        subscribed ? unsubscribe(authorId._id) : subscribe(authorId._id)
    }
    return (
        <div className={s.wrapper}>
            <div className={s.container}>
                <div className={s.upper}>
                    <div className={s.upper_left}>
                        <div className={s.email}>
                            { authorId.email }
                        </div>
                        <div>
                            <Button
                                loading={loading}
                                className={s.followButton}
                                style={{backgroundColor: `var(--main)`,
                                            color: "var(--firstBg)",
                                            padding: "0px 9px 4px 10px",
                                            fontSize: "20px"}}
                                onClick={toggleSubscribe}
                                disabled={disabled}>
                                  { subscribed ? "-" : "+"}
                            </Button>
                        </div>
                    </div>
                    <div className={s.upperRight}>

                    </div>
                </div>
                <div className={s.main}>
                    { props.content }
                </div>
                <div className={s.lower}>
                    <div className={s.like}>
                        <IconButton icon={ likesCount }
                                    color={liked ? "green" : ""}
                                    circle size="xs"
                                    disabled={disabled || loading}
                                    onClick={ toggleLike } />
                    </div>
                </div>
            </div>
        </div>
     )
}