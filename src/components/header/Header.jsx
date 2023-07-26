import { useEffect, useState } from "react";
import classes from "./Header.module.css"
import axios from "axios";
import { URL } from "../../helpers/constants";

const Header = ({ setSelectedImages, setToken, token }) => {
    const [img, setImg] = useState({
        images: []
    });

    const handleLoad = () => {
        axios({
            method: 'post',
            url: `${URL}/rpc`,
            headers: {
                "rpc-authorization": `Token ${token}`,
                "Content-Type": "application/json"
            },
            data: {
                action: "dd_meter_readings",
                method: "Query",
                "schema":"dbo",
                data: [{
                    "limit": 10,
                }],
                type: "rpc"
            }
        })
            .then(response => {
                console.log(response.data);
            })
            .catch(error => {
                console.log(error)
            })
    }
    handleLoad();

    const handleExit = () => {
        localStorage.removeItem('Token');
        setToken("");
    }

    const uploadImage = (event) => {
        const files = event.target.files;
        const newImagesArray = [];
        for (let i = 0; i < files.length; i++) {
            const file = files[i]
            const imageObject = {
                url: URL.createObjectURL(file),
                name: file.name,
            };
            newImagesArray.push(imageObject);
        }
        setSelectedImages(newImagesArray);
        setImg((prevImg) => ({
            ...prevImg,
            images: [...prevImg.images, ...newImagesArray]
        }));
    }

    const pushDataToStorage = () => {
        localStorage.setItem("state2", JSON.stringify(img));
    }

    useEffect(() => {
        pushDataToStorage();
    }, [img])

    return (
        <>
            <div className={classes.wrapper}>
                <div className={classes.container}>
                    <label className={classes.header_btns}>
                        Открыть
                        <input type="file" multiple onChange={uploadImage} />
                    </label>
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