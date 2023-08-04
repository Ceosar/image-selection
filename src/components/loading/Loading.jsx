import classes from './Loading.module.css'

const Loading = () => {
    return (
        <>
            <section className={classes.app_loader}>
                <div className={classes.bouncing_loader}>
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
            </section>
        </>
    );
}

export default Loading;