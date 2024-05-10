import { useEffect, useRef, useState } from 'react';
import classes from './MeterDataForm.module.css'


const MeterDataForm = ({ state, setState, imageID, currentIndex, meterData, meterDataInput, setMeterDataInput }) => {
    const [resultMeter, setResultMeter] = useState();
    const meterDataInputRef = useRef(null)

    useEffect(() => {
        meterDataInputRef.current.value = meterData;
        setMeterDataInput(meterDataInputRef.current.value);
    }, [meterData])

    const handleMeterDataInput = (e) => {
        setMeterDataInput(e.target.value);
    }

    const sendMeterData = () => {
        const updatedRect = [...state.rect];
        const foundIndex = updatedRect.findIndex(element => element.type === "indication" && element.name === imageID);

        if (foundIndex !== -1) {
            updatedRect[foundIndex] = {
                ...updatedRect[foundIndex],
                meterData: meterDataInput
            };
            setState(prevState => ({
                ...prevState,
                rect: updatedRect
            }));
            setResultMeter(meterDataInput);
        } else {
            setResultMeter('Выделите область!');
        }
    }

    const resultMeterData = () => {
        const foundMeterData = state.rect.find(element => element.meterData && element.name === imageID)
        if (foundMeterData) {
            setResultMeter(foundMeterData.meterData);
        } else {
            setResultMeter('Не назначено');
        }
    }

    useEffect(() => {
        resultMeterData();
    }, [state.rect, currentIndex])

    return (
        <section className={classes.meter_data_form}>
            <label htmlFor="">Показание счётчика</label>
            <div
                className={classes.input_meter_data}
                id="input_form_meter_data"
                >
                <input
                    type="number"
                    onChange={handleMeterDataInput}
                    ref={meterDataInputRef}
                    id="input_meter_data"
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            sendMeterData();
                            document.activeElement.blur();
                        }
                        if(["e", "E", "+", "-"].includes(e.key)){
                            e.preventDefault();
                        }
                    }}
                />
                <button
                    id="input_meter_btn"
                    onClick={sendMeterData}
                >Ввод</button>
            </div>
            <label>Итоговое показание</label>
            <div>{resultMeter}</div>
        </section>
    );
}

export default MeterDataForm;