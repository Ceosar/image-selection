import { useState } from "react";
import classes from "./Header.module.css"

const Header = () => {

    return (
        <>
            <div className={classes.wrapper}>
                <div className={classes.container}>
                    {/* <input type="file" onChange={uploadImage} />
                    <img className={classes.image} src={selectImages} alt="" /> */}
                </div>
            </div>
        </>
    );
}

export default Header;