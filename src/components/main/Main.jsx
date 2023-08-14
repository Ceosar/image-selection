import { useDebugValue, useEffect, useState } from "react";
import classes from "./Main.module.css"
import ReactCrop from 'react-image-crop'
// import 'react-image-crop/dist/ReactCrop.css'
import './ReactCrop.scss'

import one_arrow_left from "../../assets/one_arrow_left.png"
import one_arrow_right from "../../assets/one_arrow_right.png"
import two_arrow_left from "../../assets/two_arrow_left.png"
import two_arrow_right from "../../assets/two_arrow_right.png"
import MeterDataForm from "./meterDataForm/meterDataForm";
import {
    URL,
    URL_IMAGE,
    DEFAULT_TYPE1,
    DEFAULT_TYPE2,
    DEFAULT_TYPE3,
    STEP1,
    STEP2,
    STEP3,
    STEP4
} from "../../helpers/constants";
import axios from "axios";

const Main = ({ meterData, pictures, currentIndex, setCurrentIndex, showNotification }) => {
    const [crop, setCrop] = useState(null);
    const [croppedAreas, setCroppedAreas] = useState([]);
    const [selectedType, setSelectedType] = useState(DEFAULT_TYPE1);
    const [activeType, setActiveType] = useState(DEFAULT_TYPE1);
    const [imageID, setImageId] = useState('');
    const [meterDataInput, setMeterDataInput] = useState("");
    const [state, setState] = useState({ rect: [] })
    const [img, setImg] = useState({ images: [] })
    const [noElements, setNoElements] = useState(false);
    const [loading, setLoading] = useState(0);

    const isLoading = () => {
        setLoading(1);
    }

    const swipeImage = (arg) => {
        // sendDataToBack();
        switch (arg) {
            case STEP1:
                setCurrentIndex(currentIndex + 1);
                break;
            case STEP2:
                setCurrentIndex(currentIndex - 1);
                break;
            case STEP3:
                setCurrentIndex(0);
                break;
            case STEP4:
                setCurrentIndex(pictures.length - 1);
            default:
                break;
        }
        sendDataToBack(pictures[currentIndex].fn_file);
        setCrop(null);
        setCroppedAreas([]);
        setSelectedType(DEFAULT_TYPE1);
        setActiveType(DEFAULT_TYPE1);
        showMeterData(0);
        noElemFill(0);
        setLoading(0);
    }

    useEffect(() => {
        if (pictures.length > 0) {
            setImageId(pictures[currentIndex].fn_file);
            setImages(pictures[currentIndex].fn_file);
        }
    }, [pictures, currentIndex]);

    const swipeType = (type) => {
        setCrop(null);
        switch (type) {
            case DEFAULT_TYPE1:
                setSelectedType(DEFAULT_TYPE1);
                setActiveType(DEFAULT_TYPE1);
                showMeterData(0);
                break;
            case DEFAULT_TYPE2:
                setSelectedType(DEFAULT_TYPE2);
                setActiveType(DEFAULT_TYPE2);
                showMeterData(0);
                break;
            case DEFAULT_TYPE3:
                setSelectedType(DEFAULT_TYPE3);
                setActiveType(DEFAULT_TYPE3);
                showMeterData(1);
                break;

            default:
                break;
        }
    }

    useEffect(() => {
        if (state.rect.length > 0) {
            state.rect.forEach((element) => {
                if (
                    element.name === pictures[currentIndex].fn_file
                    &&
                    element.type === "none"
                ) {
                    noElemFill(1);
                }
            })

        }
    }, [currentIndex])

    const removeRectItems = () => {
        console.log(imageID)
        // const filteredRect = state.rect.filter(
        //     (element) => element.id != pictures[currentIndex].fn_file && Object.keys(element).length !== 2
        // );

        const filteredRect = state.rect.filter((element) => {
            const isMatching = element.id === pictures[currentIndex].fn_file && Object.keys(element).length === 2;
            return !isMatching;
        });

        console.log(filteredRect)
        setState((prevState) => ({
            ...prevState,
            rect: filteredRect
        }));

        localStorage.setItem(
            "state",
            JSON.stringify({ ...state, rect: filteredRect })
        );

    }

    const originalImage = document.getElementById("image");
    const onCompleteCrop = (crop) => {
        if (crop.width > 0 && crop.height > 0 && selectedType) {
            const scaleX = originalImage.naturalWidth / originalImage.width;
            const scaleY = originalImage.naturalHeight / originalImage.height;

            removeRectItems();

            const newCroppedArea = {
                name: pictures[currentIndex].fn_file,
                id: imageID,
                x: crop.x,
                y: crop.y,
                width: crop.width,
                height: crop.height,
                type: selectedType
            };
            if (selectedType === DEFAULT_TYPE3 && meterDataInput) {
                newCroppedArea.meterData = meterDataInput;
                const inp = document.getElementById('input_meter_data');
                inp.focus();
            }
            if (selectedType === 'none') {
                setNoElements(true);
            }
            else {
                setNoElements(false);
            }

            const copyCroppedArea = {
                name: pictures[currentIndex].fn_file,
                id: imageID,
                x: parseFloat((crop.x * scaleX).toFixed(2)),
                y: parseFloat((crop.y * scaleY).toFixed(2)),
                width: parseFloat((crop.width * scaleX).toFixed(2)),
                height: parseFloat((crop.height * scaleY).toFixed(2)),
                type: selectedType
            };
            if (selectedType === DEFAULT_TYPE3 && meterDataInput) {
                newCroppedArea.meterData = meterDataInput;
            }

            setCroppedAreas([...croppedAreas, copyCroppedArea]);
            setCrop(null);
            setRect(copyCroppedArea);
            console.log(document.getElementById("image").naturalWidth);
            console.log(document.getElementById("image").naturalHeight);
        }
    }

    const setRect = (newCroppedArea) => {
        console.log("setrect")
        setState((prevState) => ({
            ...prevState,
            rect: [...prevState.rect, newCroppedArea]
        }));
    };

    const setImages = (newImagesName) => {
        const imagesName = JSON.parse(localStorage.getItem('state2'));
        try {
            const updatedArray = imagesName.images.slice();
            if (!updatedArray.includes(newImagesName)) {
                setImg((prevImg) => ({
                    ...prevImg,
                    images: [...prevImg.images, newImagesName],
                }));
            }
        } catch (error) {
            console.log(error);
        }
    }

    const pushDataToStorage = (arg) => {
        switch (arg) {
            case "data":
                localStorage.setItem("state", JSON.stringify(state));
                break;
            case "images":
                localStorage.setItem("state2", JSON.stringify(img));
                break;
            default:
                break;
        }
    }

    const getBorderColorByType = (type) => {
        switch (type) {
            case DEFAULT_TYPE1:
                return "red";
            case DEFAULT_TYPE2:
                return "green";
            case DEFAULT_TYPE3:
                return "blue";
            default:
                return "";
        }
    }

    const setButtonStyleBtn = (type) => {
        return {
            backgroundColor: activeType === type ? "orange" : "initial"
        }
    }

    useEffect(() => {
        const handleKeyPress = (e) => {
            if (e.target.id != "input_meter_data") {
                switch (e.code) {
                    case "KeyQ":
                        swipeType(DEFAULT_TYPE1);
                        break;
                    case "KeyW":
                        swipeType(DEFAULT_TYPE2);
                        break;
                    case "KeyE":
                        swipeType(DEFAULT_TYPE3);
                        e.preventDefault()
                        break;
                    case "KeyA":
                        if (currentIndex > 0) swipeImage(STEP2);
                        break;
                    case "KeyD":
                        if (currentIndex < pictures.length - 1) swipeImage(STEP1);
                        break;
                    case "KeyZ":
                        noneType();
                        break;
                    case "KeyX":
                        deleteRect();
                        break;

                    default:
                        break;
                }
            }
        }

        window.addEventListener('keypress', handleKeyPress);

        return () => {
            window.removeEventListener('keypress', handleKeyPress);
        };
    }, [currentIndex, pictures.length]);

    const noneType = () => {
        // deleteRect();
        noElemFill(1);

        setCroppedAreas([]);
        const filteredRect = state.rect.filter(
            (element) => element.id !== pictures[currentIndex].fn_file
        );

        setState((prevState) => ({
            ...prevState,
            rect: filteredRect
        }));

        localStorage.setItem(
            "state",
            JSON.stringify({ ...state, rect: filteredRect })
        );

        const newCroppedArea = {
            name: pictures[currentIndex].fn_file,
            id: pictures[currentIndex].fn_file,
            type: "none"
        };

        setRect(newCroppedArea);
    }

    const [isChanges, setIsChanges] = useState(false);

    useEffect(() => {
        const filteredRect = state.rect.filter(element => element.id === imageID);
        // console.log(filteredRect.length === 0);
        // console.log(isChanges);
        if (filteredRect.length === 0 && isChanges) {
            console.log("заполнение")
            const newCroppedArea = {
                id: pictures[currentIndex].fn_file,
                name: pictures[currentIndex].fn_file,
            };
            // setState(prevState => ({
            //     ...prevState,
            //     rect: [...prevState.rect, newCroppedArea]
            // }));
            setRect(newCroppedArea);
        }
        setIsChanges(false);
    }, [currentIndex, isChanges])

    // const pushEmptyPic = () => {
    //     const filteredRect = state.rect.filter(element => element.id === imageID);
    //     if (filteredRect.length === 0 && isChanges) {
    //         console.log("заполнение");
    //         const newCroppedArea = {
    //             id: pictures[currentIndex].fn_file,
    //             name: pictures[currentIndex].fn_file,
    //         };

    //         setRect(newCroppedArea);
    //     }
    //     setIsChanges(false);
    // }

    const deleteRect = () => {
        setIsChanges(true);
        notificationFunction("Сброс выполнен!", "red")
        noElemFill(0);
        setCroppedAreas([]);
        const filteredRect = state.rect.filter(
            (element) => element.id !== pictures[currentIndex].fn_file
        );

        setState((prevState) => ({
            ...prevState,
            rect: filteredRect
        }));

        localStorage.setItem(
            "state",
            JSON.stringify({ ...state, rect: filteredRect })
        );
    };

    const emptyPicture = () => {
        const newCroppedArea = {
            id: pictures[currentIndex].fn_file,
            name: pictures[currentIndex].fn_file,
        };
        setRect(newCroppedArea)
    }

    // const emptyPicture = () => {
    //     const hasNoRect = state.rect.every(element => element.id !== pictures[currentIndex].fn_file);
    //     if (hasNoRect) {
    //     }
    // }

    const checkPrev = () => {
        const filterRect = state.rect.filter(
            (element) => pictures[currentIndex].fn_file == element.id
        )
        setCroppedAreas(filterRect);
    }

    useEffect(() => {
        const savedState = localStorage.getItem("state");
        if (savedState) {
            const parsedState = JSON.parse(savedState);
            setState(parsedState);
            checkPrev();
        }
        // pushImagesToStorage();
        pushDataToStorage("images");
    }, [currentIndex]);

    useEffect(() => {
        pushDataToStorage("data");
    }, [state]);

    const showMeterData = (toggle) => {
        if (toggle) {
            document.getElementById("meter-state").style.opacity = "1";
            const inp = document.getElementById('input_meter_data');
            inp.focus();
        } else {
            document.getElementById("meter-state").style.opacity = "0";
        }
    }

    const noElemFill = (arg) => {
        if (arg) {
            setNoElements(true)
            document.getElementById("no_elements").style.opacity = "1"
        } else {
            setNoElements(false);
            document.getElementById("no_elements").style.opacity = "0";
        }
    }

    const notificationFunction = (message, color) => {
        showNotification(message, color)
    }

    const sendDataToBack = async (imageID) => {
        try {
            const stateFromLocal = JSON.parse(localStorage.getItem('state'));
            const filteredRect = stateFromLocal.rect.filter(element => element.id === imageID);
            if (filteredRect.length > 0) {
                const response = await axios({
                    method: 'post',
                    url: `${URL}/rpc`,
                    headers: {
                        "rpc-authorization": `Token ${localStorage.getItem('Token')}`,
                        "Content-Type": "application/json"
                    },
                    data: {
                        action: "sd_attachments",
                        method: "AddOrUpdate",
                        "schema": "dbo",
                        data: [{
                            'id': imageID,
                            'f_user': 3,
                            'c_name': `${imageID}.jpg`,
                            'jb_data': JSON.stringify(filteredRect),
                        }],
                        type: "rpc"
                    }
                });
                console.log(response.data[0].code)
                if (response.data[0].code === 200) {
                    notificationFunction("Успешно!", "green")
                }
            } else {
                console.log(filteredRect);
            }
        }
        catch (error) {
            console.log(error)
            notificationFunction("УПС! Произошла ошибка!", "red")
        }
    }

    return (
        <>
            <div className={classes.main_wrapper}>
                <section className={classes.type}>
                    <button className={classes.type_btn_red}
                        style={setButtonStyleBtn(DEFAULT_TYPE1)}
                        onClick={() => swipeType(DEFAULT_TYPE1)}
                    >Счётчик [Q]</button>
                    <button className={classes.type_btn_green}
                        style={setButtonStyleBtn(DEFAULT_TYPE2)}
                        onClick={() => swipeType(DEFAULT_TYPE2)}
                    >Пломба [W]</button>
                    <button className={classes.type_btn_blue}
                        style={setButtonStyleBtn(DEFAULT_TYPE3)}
                        onClick={() => swipeType(DEFAULT_TYPE3)}
                    >Показание [E]</button>
                </section>
                <section className={classes.navigation}>
                    <button
                        onClick={() => swipeImage(STEP3)}
                        disabled={currentIndex == 0}
                    >
                        <img src={two_arrow_left} alt="" />
                    </button>
                    <button
                        title="Клавиша A"
                        onClick={() => swipeImage(STEP2)}
                        disabled={currentIndex == 0}
                    >
                        {/* <img src={one_arrow_left} alt="" /> */}
                        <p>Назад [A]</p>
                    </button>
                    <p>{currentIndex + 1}/{pictures.length}</p>
                    <button
                        title="Клавиша D"
                        onClick={() => swipeImage(STEP1)}
                        disabled={currentIndex == (pictures.length - 1)}
                    >
                        {/* <img src={one_arrow_right} alt="" /> */}
                        <p>Вперёд [D]</p>
                    </button>
                    <button
                        onClick={() => swipeImage(STEP4)}
                        disabled={currentIndex == (pictures.length - 1)}
                    >
                        <img src={two_arrow_right} alt="" />
                    </button>
                </section>
                <div className={classes.wrapper}>
                    <section className={classes.properties}>
                        <button
                            className={classes.prop_red}
                            onClick={noneType}
                        >Нет элементов [Z]</button>
                        <button
                            className={classes.prop_yellow}
                            onClick={deleteRect}
                        >Сброс [X]</button>
                        {currentIndex === pictures.length - 1  && (
                            <button
                                className={classes.prop_green}
                                onClick={() => sendDataToBack(imageID)}
                            >Готово</button>
                        )}
                    </section>
                    <div className={classes.container}>
                        <div className={classes.content_container}  >
                            {/* {pictures.length > 0 && ( */}
                            <div className={classes.image_content} >
                                <ReactCrop
                                    crop={crop}
                                    onChange={c => setCrop(c)}
                                    onComplete={onCompleteCrop}
                                    disabled={noElements}
                                >
                                    <div
                                        id="no_elements"
                                        style={{
                                            // width: "100%",
                                            // height: "100%",
                                            // top: "40%",
                                            textAlign: "center",
                                            position: "absolute",
                                            fontSize: "50px",
                                            color: "white",
                                            opacity: "0",
                                            zIndex: "999",
                                            textShadow: "-2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 2px 2px 0 #000",
                                            transition: "all .1s"
                                        }}
                                    >Нет элеменmов</div>
                                    <img
                                        onLoad={isLoading}
                                        className={`${classes.image} ${noElements ? classes.no_elem : ''}`}
                                        src={`${URL_IMAGE}${imageID}`}
                                        alt=""
                                        id="image"
                                    />
                                    {croppedAreas.map((area, index) => {
                                        if (loading) {
                                            return <div
                                                className={classes.image}
                                                key={index}
                                                style={{
                                                    width: '100%',
                                                    height: '100%',
                                                    position: "absolute",
                                                    border: `4px solid ${getBorderColorByType(area.type)}`,
                                                    left: area.x / (originalImage.naturalWidth / originalImage.width),
                                                    top: area.y / (originalImage.naturalHeight / originalImage.height),
                                                    width: area.width / (originalImage.naturalWidth / originalImage.width),
                                                    height: area.height / (originalImage.naturalHeight / originalImage.height)
                                                }}
                                            />
                                        }
                                    })}
                                </ReactCrop>
                            </div>
                        </div>
                    </div>
                    <section hidden className={classes.meter_data} id="meter-state">
                        <MeterDataForm
                            state={state}
                            setState={setState}
                            imageID={imageID}
                            currentIndex={currentIndex}
                            meterData={Math.round(meterData)}
                            meterDataInput={meterDataInput}
                            setMeterDataInput={setMeterDataInput}
                        />
                    </section>
                </div>
            </div>
        </>
    );
}

export default Main;