import { useEffect, useState } from "react";
import classes from "./Main.module.css"
import ReactCrop from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'

import one_arrow_left from "../../assets/one_arrow_left.png"
import one_arrow_right from "../../assets/one_arrow_right.png"
import two_arrow_left from "../../assets/two_arrow_left.png"
import two_arrow_right from "../../assets/two_arrow_right.png"
import { URL_IMAGE } from "../../helpers/constants";
import MeterDataForm from "./meterDataForm/meterDataForm";

const Main = ({ meterData, pictures, currentIndex, setCurrentIndex, selectedImages }) => {
    const DEFAULT_TYPE1 = "meter";
    const DEFAULT_TYPE2 = "seal";
    const DEFAULT_TYPE3 = "indication";

    const STEP1 = "next";
    const STEP2 = "prev";
    const STEP3 = "first";
    const STEP4 = "last";

    const [crop, setCrop] = useState(null);
    const [croppedAreas, setCroppedAreas] = useState([]);
    const [selectedType, setSelectedType] = useState(DEFAULT_TYPE1);
    const [activeType, setActiveType] = useState(DEFAULT_TYPE1);
    const [state, setState] = useState({
        rect: []
    })
    const [imageID, setImageId] = useState('');
    const [img, setImg] = useState({
        images: []
    })
    const [meterDataInput, setMeterDataInput] = useState("");


    const swipeImage = (arg) => {
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
        setCrop(null);
        setCroppedAreas([]);
        setSelectedType(DEFAULT_TYPE1);
        setActiveType(DEFAULT_TYPE1);
        showMeterData(0);
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

    const onCompleteCrop = (crop) => {
        if (crop.width > 0 && crop.height > 0 && selectedType) {
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
            }

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

    const setImages = (newImagesName) => {
        const imagesName = JSON.parse(localStorage.getItem('state2'));
        const updatedArray = imagesName.images.slice();
        if (!updatedArray.includes(newImagesName)) {
            setImg((prevImg) => ({
                ...prevImg,
                images: [...prevImg.images, newImagesName],
            }));
        }
    }

    const pushImagesToStorage = () => {
        localStorage.setItem("state2", JSON.stringify(img));
    }

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
                // case "Digit1":
                //     break;
                // case "Digit2":
                //     break;
                // case "Digit3":
                //     break;
                case "KeyQ":
                    swipeType(DEFAULT_TYPE1);
                    break;
                case "KeyW":
                    swipeType(DEFAULT_TYPE2);
                    break;
                case "KeyE":
                    swipeType(DEFAULT_TYPE3);
                    break;
                case "KeyA":
                    if (currentIndex > 0) swipeImage(STEP2);
                    break;
                case "KeyD":
                    if (currentIndex < pictures.length - 1) swipeImage(STEP1);
                    break;
                default:
                    break;
            }
        }

        window.addEventListener('keypress', handleKeyPress);

        return () => {
            window.removeEventListener('keypress', handleKeyPress);
        };
    }, [currentIndex, pictures.length]);

    const noneType = () => {
        deleteRect();

        const newCroppedArea = {
            name: pictures[currentIndex].fn_file,
            id: pictures[currentIndex].fn_file,
            type: "none"
        };

        setRect(newCroppedArea);
    }

    const deleteRect = () => {
        setCroppedAreas([])
        const filteredRect = state.rect.filter(
            (element) => element.name !== pictures[currentIndex].fn_file
        );

        setState((prevState) => ({
            ...prevState,
            rect: filteredRect
        }));

        localStorage.setItem("state", JSON.stringify({ ...state, rect: filteredRect }));
    };

    const checkPrev = () => {
        const filterRect = state.rect.filter(
            (element) => pictures[currentIndex].fn_file == element.name
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
        pushImagesToStorage();
    }, [currentIndex]);

    useEffect(() => {
        pushDataToStorage();
    }, [state]);

    useEffect(() => {
    }, [meterData])

    const showMeterData = (toggle) => {
        if (toggle) {
            document.getElementById("meter-state").style.opacity = "1";
        } else {
            document.getElementById("meter-state").style.opacity = "0";
        }
    }

    return (
        <>
            <div className={classes.main_wrapper}>
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
                    <p>{currentIndex + 1}/{pictures.length}</p>
                    <button onClick={() => swipeImage(STEP1)} disabled={currentIndex == (pictures.length - 1)}>
                        <img src={one_arrow_right} alt="" />
                    </button>
                    <button onClick={() => swipeImage(STEP4)} disabled={currentIndex == (pictures.length - 1)}>
                        <img src={two_arrow_right} alt="" />
                    </button>
                </section>
                <div className={classes.wrapper}>
                    <section className={classes.properties}>
                        <button className={classes.prop_red}
                            onClick={noneType}
                        >Нет элементов</button>
                        <button className={classes.prop_yellow}
                            onClick={deleteRect}
                        >Сброс</button>
                        <button className={classes.prop_green}>Готово</button>
                    </section>
                    <div className={classes.container}>
                        <div className={classes.content_container}>
                            {pictures.length > 0 && (
                                <div className={classes.image_content}>
                                    <ReactCrop
                                        crop={crop}
                                        onChange={c => setCrop(c)}
                                        onComplete={onCompleteCrop}
                                        disabled={!selectedType}
                                    >
                                        <img className={classes.image} src={`${URL_IMAGE}${imageID}`} alt="" />
                                        {croppedAreas.map((area, index) => (
                                            <div
                                                className={classes.image}
                                                key={index}
                                                style={{
                                                    position: "absolute",
                                                    border: `4px solid ${getBorderColorByType(area.type)}`,
                                                    left: area.x,
                                                    top: area.y,
                                                    width: area.width,
                                                    height: area.height
                                                }}
                                            />
                                        ))}
                                        {/* <img className={classes.image} src={selectedImages[currentIndex].url} alt={selectedImages[currentIndex].name} /> */}
                                    </ReactCrop>
                                </div>
                            )}
                            {/* <img className={classes.image} src={`${URL_IMAGE}${imageID}`} alt="" /> */}
                            {/* <img className={classes.image} src={`${URL_IMAGE}${imageID}`} alt="" /> */}
                            {/* <img className={classes.image} src={`https://msk-mc-app.mrsk-1.ru/release/file?id=${fn_file}`} alt="" /> */}
                        </div>
                    </div>
                    <section className={classes.meter_data} id="meter-state">
                        <MeterDataForm pictures={pictures} currentIndex={currentIndex} meterData={meterData} setMeterDataInput={setMeterDataInput} />
                    </section>
                </div>
            </div>
        </>
    );
}

export default Main;