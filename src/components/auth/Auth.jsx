import React, { useRef, useState } from "react";
import { URL } from "../../helpers/constants";
import classes from "./Auth.module.css";
import axios from "axios";

const Auth = ({ setToken }) => {
    const [UserName, setUserName] = useState('');
    const [Password, setPassword] = useState('');
    const loginRef = useRef(null);
    const passwordRef = useRef(null);
    // login user_1
    // pass 12345

    const handleSubmit = (event) => {
        setUserName(loginRef.current.value);
        setPassword(passwordRef.current.value);
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
                setToken(response.data['token']);
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
                        <input
                            placeholder="Логин"
                            type="text"
                            id="login"
                            ref={loginRef}
                            onChange={event => setUserName(event.target.value)}
                        />
                    </div>
                    <div className={classes.login_input_pas}>
                        <label>Введите ваш пароль</label>
                        <input
                            placeholder="Пароль"
                            type="password"
                            id="password"
                            ref={passwordRef}
                            onChange={event => setPassword(event.target.value)}
                        />
                    </div>
                    <button
                        className={classes.enter_btn}
                        type="submit"
                        id="enter_btn"
                        onClick={handleSubmit}
                    >Войти</button>
                </div>
            </div>
        </>
    );
}

export default Auth;