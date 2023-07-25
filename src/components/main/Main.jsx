import { useEffect, useState } from "react";
import classes from "./Main.module.css"
import ReactCrop from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'

import one_arrow_left from "../../assets/one_arrow_left.png"
import one_arrow_right from "../../assets/one_arrow_right.png"
import two_arrow_left from "../../assets/two_arrow_left.png"
import two_arrow_right from "../../assets/two_arrow_right.png"

const Main = ({ selectedImages }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [crop, setCrop] = useState(null);
    const [croppedAreas, setCroppedAreas] = useState([]);
    const [selectedType, setSelectedType] = useState(null);
    const [activeType, setActiveType] = useState(null);
    const [state, setState] = useState({
        rect: []
    })

    const prevImage = () => {
        setCurrentIndex(currentIndex - 1);
        setCrop(null);
        setCroppedAreas([]);
        setSelectedType(null);
        setActiveType(null);
    }

    const nextImage = () => {
        setCurrentIndex(currentIndex + 1);
        setCrop(null);
        setCroppedAreas([]);
        setSelectedType(null);
        setActiveType(null);
    }

    const firstImage = () => {
        setCurrentIndex(0);
        setCrop(null);
        setCroppedAreas([]);
        setSelectedType(null);
        setActiveType(null);
    }

    const lastImage = () => {
        setCurrentIndex(selectedImages.length - 1);
        setCrop(null);
        setCroppedAreas([]);
        setSelectedType(null);
        setActiveType(null);
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
    pushDataToStorage();

    const getBorderColorByType = (type) => {
        switch (type) {
            case "meter":
                return "red";
            case "indication":
                return "blue";
            case "seal":
                return "green";
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
            if (e.code === "Digit1") {
                setSelectedType("meter");
                setCrop(null);
                setActiveType("meter");
            } else if (e.code === "Digit2") {
                setSelectedType("seal");
                setCrop(null);
                setActiveType("seal");
            } else if (e.code === "Digit3") {
                setSelectedType("indication");
                setCrop(null);
                setActiveType("indication");
            } else if (e.code === "KeyD" && currentIndex < selectedImages.length - 1) {
                nextImage();
            } else if (e.code === "KeyA" && currentIndex > 0) {
                prevImage();
            } else if (e.code === "KeyE" && currentIndex < selectedImages.length - 1) {
                nextImage();
            } else if (e.code === "KeyQ" && currentIndex > 0) {
                prevImage();
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
            setState(parsedState);1
            checkPrev();
        }
    }, [currentIndex]);

    useEffect(() => {
        localStorage.setItem("state", JSON.stringify(state));
    }, [state]);

    return (
        <>
            <div className={classes.wrapper}>
                <div className={classes.container}>
                    <div className={classes.content_container}>
                        <section className={classes.properties}>
                            <button className={classes.prop_red}
                                onClick={noneType}
                            >Нет элементов</button>
                            <button className={classes.prop_yellow}
                                onClick={deleteRect}
                            >Сброс</button>
                            <button className={classes.prop_green}>Готово</button>
                        </section>
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
                                <div></div>
                            </div>
                        )}
                    </div>
                    <section className={classes.navigation}>
                        <button onClick={firstImage}>
                            <img src={two_arrow_left} alt="" />
                        </button>
                        <button onClick={prevImage} disabled={currentIndex == 0}>
                            <img src={one_arrow_left} alt="" />
                        </button>
                        <p>{currentIndex + 1}/{selectedImages.length}</p>
                        <button onClick={nextImage} disabled={currentIndex == (selectedImages.length - 1)}>
                            <img src={one_arrow_right} alt="" />
                        </button>
                        <button onClick={lastImage}>
                            <img src={two_arrow_right} alt="" />
                        </button>
                    </section>
                    <section className={classes.type}>
                        <button className={classes.type_btn_red}
                            style={setButtonStyleBtn("meter")}
                            onClick={() => {
                                setSelectedType("meter");
                                setCrop(null);
                                setActiveType("meter");
                            }}
                        >Счётчик</button>
                        <button className={classes.type_btn_green}
                            style={setButtonStyleBtn("seal")}
                            onClick={() => {
                                setSelectedType("seal");
                                setCrop(null);
                                setActiveType("seal")
                            }}
                        >Пломба</button>
                        <button className={classes.type_btn_blue}
                            style={setButtonStyleBtn("indication")}
                            onClick={() => {
                                setSelectedType("indication")
                                setCrop(null);
                                setActiveType("indication")
                            }}
                        >Показание</button>
                    </section>
                </div>
            </div>
        </>
    );
}

export default Main;