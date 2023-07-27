import { useEffect, useState } from "react";
import classes from "./Header.module.css"
import axios from "axios";
import { URL } from "../../helpers/constants";

const Header = ({ currentIndex, setSelectedImages, setToken, token, setFn_file }) => {
    const [img, setImg] = useState({
        images: []
    });
    const [pictures, setPictures] = useState([]);

    // const [fn_file, setFn_file] = useState("");

    async function getPictures() {
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
                data: [{ "limit": 10, sort: [{property: "fn_result", direction: 'ASC'}]}],
                type: "rpc"
            }
        })
        
        console.log("fn_file " + response.data[0].result.records[0].fn_file);
        console.log("fn_result " + response.data[0].result.records[0].fn_result);
        console.log(response.data[0].result.records)
        return response.data[0].result.records;
    }

    async function getMeterReadings(fn_result) {
        let pageNum = 1;
        let foundPic = false;
        while (!foundPic) {
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
            const records = response2.data[0].result.records;

            for (const record of records) {
                if (record.fn_result = fn_result) {
                    console.log(record);
                    foundPic = true;
                    break;
                }
            }

            pageNum++;
            console.log(response2.data[0].result)
            return response2;
        }
    }

    async function handlerUpload() {
        const _pictures = await getPictures();
        setPictures(_pictures);
    }
    
    useEffect(() => {
        handlerUpload();
    }, []);
    
    useEffect(() => {
        if(pictures.length>0){
            getMeterReadings(pictures[currentIndex].fn_result)
            setFn_file(pictures[currentIndex].fn_file)
            console.log(pictures)
        }
    }, [pictures, currentIndex])

    const handleExit = () => {
        localStorage.removeItem('Token');
        setToken("");
    }

    const uploadImage = (imageUrls) => {
        const newImagesArray = imageUrls.map((imageUrl) => ({
            url: imageUrl,
            name: imageUrl.split("/").pop,
        }));
        setSelectedImages(newImagesArray);
        setImg((prevImg) => ({
            ...prevImg,
            images: [...prevImg.images, ...newImagesArray],
        }));
    }



    // const uploadImage = (event) => {
    //     const files = event.target.files;
    //     const files = fn_file
    //     const newImagesArray = [];
    //     for (let i = 0; i < files.length; i++) {
    //         const file = files[i]
    //         const imageObject = {
    //             url: URL.createObjectURL(file),
    //             name: file.name,
    //         };
    //         newImagesArray.push(imageObject);
    //     }
    //     setSelectedImages(newImagesArray);
    //     setImg((prevImg) => ({
    //         ...prevImg,
    //         images: [...prevImg.images, ...newImagesArray]
    //     }));
    // }

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
                    {/* <label className={classes.header_btns}>
                        Открыть
                        <input type="file" multiple onChange={uploadImage} />
                    </label> */}
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