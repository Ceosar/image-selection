import { useState } from "react";
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
            console.log(newCroppedArea);
            setCroppedAreas([...croppedAreas, newCroppedArea]);
            setCrop(null);
            localStorage.setItem("rect", JSON.stringify(newCroppedArea))

        }
    }

    const getBorderColorByType = (type) => {
        switch (type) {
            case "red":
                return "red";
            case "blue":
                return "blue";
            case "green":
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

    return (
        <>
            <div className={classes.wrapper}>
                <div className={classes.container}>
                    <div className={classes.content_container}>
                        <section className={classes.properties}>
                            <button className={classes.prop_red}>Нет элементов</button>
                            <button className={classes.prop_yellow}
                                onClick={() => setCroppedAreas([])}
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
                            style={setButtonStyleBtn("red")}
                            onClick={() => {
                                setSelectedType("red");
                                setCrop(null);
                                setActiveType("red");
                            }}
                        >Счётчик</button>
                        <button className={classes.type_btn_green}
                            style={setButtonStyleBtn("green")}
                            onClick={() => {
                                setSelectedType("green");
                                setCrop(null);
                                setActiveType("green")
                            }}
                        >Пломба</button>
                        <button className={classes.type_btn_blue}
                            style={setButtonStyleBtn("blue")}
                            onClick={() => {
                                setSelectedType("blue")
                                setCrop(null);
                                setActiveType("blue")
                            }}
                        >Показание</button>
                    </section>
                </div>
            </div>
        </>
    );
}

export default Main;