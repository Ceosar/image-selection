import React, { useState } from "react";
import { URL } from "../../helpers/constants";
import classes from "./Auth.module.css";
import axios from "axios";

const Auth = ({ setUserID, setToken }) => {
    const [UserName, setUserName] = useState('');
    const [Password, setPassword] = useState('');

    const handleSubmit = (event) => {
        setUserName(document.getElementById("login").value);
        setPassword(document.getElementById("password").value);
        var bodyFormData = new FormData();
        bodyFormData.append('UserName', UserName);
        bodyFormData.append('Password', Password);
        event.preventDefault();

        axios({
            method: "post",
            url: `${URL}/auth`,
            data: bodyFormData,
            headers: { "Content-Type": "multipart/form-data" },
        })
            .then(response => {
                setUserName("");
                setPassword("");
                // localStorage.setItem('Token', response.data['token']);
                setToken(response.data['token']);
                // console.log(response.data.user.id)
                setUserID(response.data.user.id)
            })
            .catch(error => {
                console.log(error);
            })
    }

    return (
        <>
            <div className={classes.login_form}>
                <div className={classes.login_content}>
                    <h2>Авторизация</h2>
                    <div className={classes.login_input_login}>
                        <label>Введите ваш логин</label>
                        <input placeholder="Логин" type="text" id="login" onChange={event => setUserName(event.target.value)} />
                    </div>
                    <div className={classes.login_input_pas}>
                        <label>Введите ваш пароль</label>
                        <input placeholder="Пароль" type="password" id="password" onChange={event => setPassword(event.target.value)} />
                    </div>
                    <div className={classes.enter_btn}>
                        <button
                            type="submit"
                            id="enter_btn"
                            onClick={handleSubmit}
                        >Войти</button>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Auth;