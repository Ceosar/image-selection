import classes from './Popup.module.css'

const Popup = ({ message, color }) => {
    if (color == "red") {
        return (
            <div className={classes.popup_body_red}>
                <div className={classes.popup_text}>{message}</div>
            </div>
        );
    } else if (color == "green") {
        return (
            <div className={classes.popup_body_green}>
                <div className={classes.popup_text}>{message}</div>
            </div>
        );
    }
}

export default Popup;