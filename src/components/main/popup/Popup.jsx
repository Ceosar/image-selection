import classes from './Popup.module.css'

const Popup = ({ message, color }) => {
    if (color == "red") {
        return (
            <div className={`${classes.popup_body} ${classes.red}`}>
                <div className={classes.popup_text}>{message}</div>
            </div>
        );
    } else if (color == "green") {
        return (
            <div className={`${classes.popup_body} ${classes.green}`}>
                <div className={classes.popup_text}>{message}</div>
            </div>
        );
    }
}

export default Popup;