import classes from "./Header.module.css"

const Header = ({ setSelectedImages }) => {
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
    }

    return (
        <>
            <div className={classes.wrapper}>
                <div className={classes.container}>
                    <label className={classes.open_btn}>
                        Открыть
                        <input type="file" multiple onChange={uploadImage} />
                    </label>
                </div>
            </div>
        </>
    );
}

export default Header;