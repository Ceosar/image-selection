import { useEffect } from "react";
import classes from "./Header.module.css"
import axios from "axios";
import { URL } from "../../helpers/constants";

const Header = ({ setMeterData, pictures, setPictures, currentIndex, setCurrentIndex, setToken, token, showNotification }) => {

    async function getPictures(counts) {
        counts === undefined ? counts = 10 : '';
        notificationFunction(`Выполняется загрузка ${counts} фотографий`, "green");
        const response = await axios({
            method: 'post',
            url: `${URL}/rpc`,
            headers: {
                "rpc-authorization": `Token ${token}`,
                "Content-Type": "application/json"
            },
            data: {
                action: "dd_pictures",
                method: "Query",
                "schema": "dbo",
                data: [{
                    "limit": counts,
                    sort:
                        [{
                            property: "fn_result",
                            direction: 'ASC'
                        }]
                }],
                type: "rpc"
            }
        })
        return response.data[0].result.records;
    }

    async function getMeterReadings(fn_result) {
        const response2 = await axios({
            method: 'post',
            url: `${URL}/rpc`,
            headers: {
                "rpc-authorization": `Token ${token}`,
                "Content-Type": "application/json"
            },
            data: {
                action: "dd_meter_readings",
                method: "Query",
                "schema": "dbo",
                data: [{
                    filter: [{
                        "property": "fn_result",
                        "value": fn_result
                    }
                    ]
                }],
                type: "rpc"
            }
        })

        const foundRecords = response2.data[0].result.records.find(record => record.fn_result === fn_result);
        foundRecords ? setMeterData(foundRecords.n_value) : setMeterData('');

        return response2;
    }

    async function handlerUpload(counts) {
        setCurrentIndex(0);
        const _pictures = await getPictures(counts);
        setPictures(_pictures);
    }

    useEffect(() => {
        handlerUpload();
    }, [])

    useEffect(() => {
        pictures.length > 0 ? getMeterReadings(pictures[currentIndex].fn_result) : '';
    }, [pictures, currentIndex])

    const handleExit = () => {
        localStorage.removeItem('Token');
        setToken("");
    }

    const notificationFunction = (message, color) => {
        showNotification(message, color);
    }

    return (
        <>
            <div className={classes.wrapper}>
                <div className={classes.container}>
                    <div className={classes.input_container}>
                        Введите количество фотографий:
                        <div className={classes.input_photos}>
                            <button
                                className={classes.btn_inputs}
                                onClick={() => {
                                    handlerUpload(10)
                                }}
                            >10</button>
                            <button
                                className={classes.btn_inputs}
                                onClick={() => {
                                    handlerUpload(50)
                                }}
                            >50</button>
                            <button
                                className={classes.btn_inputs}
                                onClick={() => {
                                    handlerUpload(100)
                                }}
                            >100</button>
                        </div>
                    </div>
                    <label className={classes.header_btns}
                        onClick={handleExit}
                    >
                        Выход
                    </label>
                </div>
            </div>
        </>
    );
}

export default Header;