import { useEffect } from 'react';
import classes from './MeterDataForm.module.css'


const MeterDataForm = ({ state, setState, meterData, meterDataInput, setMeterDataInput }) => {
    useEffect(() => {
        document.getElementById("input_meter_data").value = meterData;
        setMeterDataInput(document.getElementById("input_meter_data").value);
    }, [meterData])

    const handleMeterDataInput = (e) => {
        setMeterDataInput(e.target.value);
    }

    const sendMeterData = () => {
        const updatedState = { ...state };
        updatedState.rect[updatedState.rect.length - 1].meterData = meterDataInput;
        setState(updatedState);
    }
    return (
        <>
            <label htmlFor="">Показание счётчика</label>
            <div className={classes.input_meter_data} id="input_form_meter_data">
                <input type="text" onChange={handleMeterDataInput} id="input_meter_data" />
                <button id="input_meter_btn" onClick={sendMeterData} >Ввод</button>
            </div>
        </>
    );
}

export default MeterDataForm;