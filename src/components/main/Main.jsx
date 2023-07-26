import { useEffect, useState } from "react";
import axios from "axios";
import classes from "./Main.module.css"
import ReactCrop from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'

import one_arrow_left from "../../assets/one_arrow_left.png"
import one_arrow_right from "../../assets/one_arrow_right.png"
import two_arrow_left from "../../assets/two_arrow_left.png"
import two_arrow_right from "../../assets/two_arrow_right.png"

const Main = ({ selectedImages, token }) => {
    const DEFAULT_TYPE1 = "meter";
    const DEFAULT_TYPE2 = "seal";
    const DEFAULT_TYPE3 = "indication";

    const STEP1 = "next";
    const STEP2 = "prev";
    const STEP3 = "first";
    const STEP4 = "last";

    const [currentIndex, setCurrentIndex] = useState(0);
    const [crop, setCrop] = useState(null);
    const [croppedAreas, setCroppedAreas] = useState([]);
    const [selectedType, setSelectedType] = useState(DEFAULT_TYPE1);
    const [activeType, setActiveType] = useState(DEFAULT_TYPE1);
    const [state, setState] = useState({
        rect: []
    })



    const swipeImage = (arg) => {
        switch (arg) {
            case STEP1:
                setCurrentIndex(currentIndex + 1);
                break;
            case STEP2:
                setCurrentIndex(currentIndex - 1)
                break;
            case STEP3:
                setCurrentIndex(0);
                break;
            case STEP4:
                setCurrentIndex(selectedImages.length - 1);
            default:
                break;
        }
        setCrop(null);
        setCroppedAreas([]);
        setSelectedType(DEFAULT_TYPE1);
        setActiveType(DEFAULT_TYPE1);
    }

    const swipeType = (type) => {
        setCrop(null);
        switch (type) {
            case DEFAULT_TYPE1:
                setSelectedType(DEFAULT_TYPE1)
                setActiveType(DEFAULT_TYPE1)
                break;
            case DEFAULT_TYPE2:
                setSelectedType(DEFAULT_TYPE2)
                setActiveType(DEFAULT_TYPE2)
                break;
            case DEFAULT_TYPE3:
                setSelectedType(DEFAULT_TYPE3)
                setActiveType(DEFAULT_TYPE3)
                break;

            default:
                break;
        }
    }

    const onCompleteCrop = (crop) => {
        if (crop.width > 0 && crop.height > 0 && selectedType) {
            const newCroppedArea = {
                name: selectedImages[currentIndex].name,
                id: selectedImages[currentIndex].url,
                x: crop.x,
                y: crop.y,
                width: crop.width,
                height: crop.height,
                type: selectedType
            };
            setCroppedAreas([...croppedAreas, newCroppedArea]);
            setCrop(null);
            setRect(newCroppedArea);
        }
    }

    const setRect = (newCroppedArea) => {
        setState((prevState) => ({
            ...prevState,
            rect: [...prevState.rect, newCroppedArea]
        }));
    };

    const pushDataToStorage = () => {
        localStorage.setItem("state", JSON.stringify(state));
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
            switch (e.code) {
                case "Digit1":
                    swipeType(DEFAULT_TYPE1);
                    break;
                case "Digit2":
                    swipeType(DEFAULT_TYPE2);
                    break;
                case "Digit3":
                    swipeType(DEFAULT_TYPE3);
                    break;
                case "KeyQ":
                    if (currentIndex > 0) swipeImage(STEP2);
                    break;
                case "KeyE":
                    if (currentIndex < selectedImages.length - 1) swipeImage(STEP1);
                    break;
                case "KeyA":
                    if (currentIndex > 0) swipeImage(STEP2);
                    break;
                case "KeyD":
                    if (currentIndex < selectedImages.length - 1) swipeImage(STEP1);
                    break;
                default:
                    break;
            }
        }

        window.addEventListener('keypress', handleKeyPress);

        return () => {
            window.removeEventListener('keypress', handleKeyPress);
        };
    }, [currentIndex, selectedImages.length]);

    const noneType = () => {
        deleteRect();

        const newCroppedArea = {
            name: selectedImages[currentIndex].name,
            id: selectedImages[currentIndex].url,
            type: "none"
        };

        setRect(newCroppedArea);
    }

    const deleteRect = () => {
        setCroppedAreas([])
        const filteredRect = state.rect.filter(
            (element) => element.name !== selectedImages[currentIndex].name
        );

        setState((prevState) => ({
            ...prevState,
            rect: filteredRect
        }));

        localStorage.setItem("state", JSON.stringify({ ...state, rect: filteredRect }));
    };

    const checkPrev = () => {
        const filterRect = state.rect.filter(
            (element) => selectedImages[currentIndex].name == element.name
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
    }, [currentIndex]);

    useEffect(() => {
        pushDataToStorage();
    }, [state]);

    return (
        <>
            <div className={classes.wrapper}>
                <div className={classes.container}>
                    <section className={classes.type}>
                        <button className={classes.type_btn_red}
                            style={setButtonStyleBtn(DEFAULT_TYPE1)}
                            onClick={() => swipeType(DEFAULT_TYPE1)}
                        >Счётчик</button>
                        <button className={classes.type_btn_green}
                            style={setButtonStyleBtn(DEFAULT_TYPE2)}
                            onClick={() => swipeType(DEFAULT_TYPE2)}
                        >Пломба</button>
                        <button className={classes.type_btn_blue}
                            style={setButtonStyleBtn(DEFAULT_TYPE3)}
                            onClick={() => swipeType(DEFAULT_TYPE3)}
                        >Показание</button>
                    </section>
                    <section className={classes.navigation}>
                        <button onClick={() => swipeImage(STEP3)} disabled={currentIndex == 0}>
                            <img src={two_arrow_left} alt="" />
                        </button>
                        <button onClick={() => swipeImage(STEP2)} disabled={currentIndex == 0}>
                            <img src={one_arrow_left} alt="" />
                        </button>
                        <p>{currentIndex + 1}/{selectedImages.length}</p>
                        <button onClick={() => swipeImage(STEP1)} disabled={currentIndex == (selectedImages.length - 1)}>
                            <img src={one_arrow_right} alt="" />
                        </button>
                        <button onClick={() => swipeImage(STEP4)} disabled={currentIndex == (selectedImages.length - 1)}>
                            <img src={two_arrow_right} alt="" />
                        </button>
                    </section>
                    <div className={classes.content_container}>
                        {selectedImages.length > 0 && (
                            <div className={classes.image_content}>
                                <ReactCrop
                                    crop={crop}
                                    onChange={c => setCrop(c)}
                                    onComplete={onCompleteCrop}
                                    disabled={!selectedType}
                                >
                                    {croppedAreas.map((area, index) => (
                                        <div
                                            className={classes.image}
                                            key={index}
                                            style={{
                                                position: "absolute",
                                                border: `2px solid ${getBorderColorByType(area.type)}`,
                                                left: area.x,
                                                top: area.y,
                                                width: area.width,
                                                height: area.height
                                            }}
                                        />
                                    ))}
                                    <img className={classes.image} src={selectedImages[currentIndex].url} alt={selectedImages[currentIndex].name} />
                                </ReactCrop>
                            </div>
                        )}
                        <section className={classes.properties}>
                            <button className={classes.prop_red}
                                onClick={noneType}
                            >Нет элементов</button>
                            <button className={classes.prop_yellow}
                                onClick={deleteRect}
                            >Сброс</button>
                            <button className={classes.prop_green}>Готово</button>
                        </section>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Main;