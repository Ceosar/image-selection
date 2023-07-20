import { useState } from "react";
import classes from "./Main.module.css"

const Main = () => {
    const [selectedImages, setSelectedImages] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
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
        setSelectedImages([...selectedImages, ...newImagesArray]);
        setCurrentIndex(0);
    }

    const prevImage = () => {
        setCurrentIndex(currentIndex - 1);
    }

    const nextImage = () => {
        setCurrentIndex(currentIndex + 1);
    }
    console.log(currentIndex)
    console.log(selectedImages.length)

    return (
        <>
            <div className={classes.wrapper}>
                <div className={classes.container}>
                    <div className={classes.content_container}>
                        <input type="file" multiple onChange={uploadImage} />
                        {selectedImages.length > 0 && (
                            <div className={classes.image_content}>
                                <img className={classes.image} src={selectedImages[currentIndex].url} alt={selectedImages[currentIndex].name} />
                                {/* <p>{currentIndex+1}/{selectedImages.length}</p> */}
                            </div>
                        )}
                    </div>
                    <section className={classes.navigation}>
                        <button onClick={prevImage} disabled={currentIndex == 0}>Назад</button>
                        <p>{currentIndex+1}/{selectedImages.length}</p>
                        <button onClick={nextImage} disabled={currentIndex == (selectedImages.length-1)}>Вперёд</button>
                    </section>
                </div>
            </div>
        </>
    );
}

export default Main;