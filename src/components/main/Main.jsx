import { useEffect, useRef, useState } from "react";
import classes from "./Main.module.css"
import ReactCrop from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'

const Main = ({ selectedImages }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [crop, setCrop] =useState()

    const prevImage = () => {
        setCurrentIndex(currentIndex - 1);
    }

    const nextImage = () => {
        setCurrentIndex(currentIndex + 1);
    }

    return (
        <>
            <div className={classes.wrapper}>
                <div className={classes.container}>
                    <div className={classes.content_container}>
                        {selectedImages.length > 0 && (
                            <div className={classes.image_content}>
                                <ReactCrop crop={crop} onChange={c => setCrop(c)}>
                                    <img className={classes.image} src={selectedImages[currentIndex].url} alt={selectedImages[currentIndex].name} />
                                </ReactCrop>
                                {/* <p>{selectedImages[currentIndex].url}</p> */}
                            </div>
                        )}
                    </div>
                    <section className={classes.navigation}>
                        <button onClick={prevImage} disabled={currentIndex == 0}>Назад</button>
                        <p>{currentIndex + 1}/{selectedImages.length}</p>
                        <button onClick={nextImage} disabled={currentIndex == (selectedImages.length - 1)}>Вперёд</button>
                    </section>
                    <section className={classes.type}>
                        <button className={classes.red}>Счётчик</button>
                        <button className={classes.green}>Пломба</button>
                        <button className={classes.blue}>Показание</button>
                    </section>
                </div>
            </div>
        </>
    );
}

export default Main;