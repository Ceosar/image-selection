import classes from './Popup.module.css'

const Popup = ({ message, color }) => {
    // switch (text_content) {
    //     case 1:
    //         break;
    //     case 2:
    //     default:
    //         break;
    // }
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