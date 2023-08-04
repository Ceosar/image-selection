import { useEffect, useState } from 'react';
import classes from './MeterDataForm.module.css'


const MeterDataForm = ({ state, setState, imageID, currentIndex, meterData, meterDataInput, setMeterDataInput }) => {
    const [resultMeter, setResultMeter] = useState();
    useEffect(() => {
        document.getElementById("input_meter_data").value = meterData;
        setMeterDataInput(document.getElementById("input_meter_data").value);
    }, [meterData])

    const handleMeterDataInput = (e) => {
        setMeterDataInput(e.target.value);
    }

    const sendMeterData = () => {
        const foundMeterData = state.rect.find(element => element.type=="indication" && element.name === imageID)
        if(foundMeterData){
            const updatedState = { ...state };
            updatedState.rect[updatedState.rect.length - 1].meterData = meterDataInput;
            setState(updatedState);
            setResultMeter(meterDataInput);
        }else{
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
        <>
            <label htmlFor="">Показание счётчика</label>
            <div className={classes.input_meter_data} id="input_form_meter_data">
                <input type="text" onChange={handleMeterDataInput} id="input_meter_data" />
                <button id="input_meter_btn" onClick={sendMeterData} >Ввод</button>
            </div>
            <label>Итоговое показание</label>
            <div>{resultMeter}</div>
        </>
    );
}

export default MeterDataForm;