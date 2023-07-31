import { useEffect } from 'react';
import classes from './MeterDataForm.module.css'


const MeterDataForm = ({meterData, setMeterDataInput}) => {
useEffect(() => {
    document.getElementById("input_meter_data").value = meterData;
    setMeterDataInput(document.getElementById("input_meter_data").value);
},[meterData])

    const handleMeterDataInput = (e) => {
        setMeterDataInput(e.target.value);
    }

    const sendMeterData = () => {

        // if (selectedType === DEFAULT_TYPE3 && meterDataInput) {
        //     const updatedCroppedAreas = croppedAreas.map((area) => {
        //         if (area.type === DEFAULT_TYPE3) {
        //             return {
        //                 ...area,
        //                 meterData: meterDataInput,
        //             };
        //         }
        //         return area;
        //     });
        //     setCroppedAreas(updatedCroppedAreas);
        //     setMeterDataInput("");
        // }
    }
    return (
        <>
            <label htmlFor="">Показание счётчика</label>
            {/* {meterData} */}
            {/* <br /> */}
            <div className={classes.input_meter_data} id="input_form_meter_data">
                <input type="text" onChange={handleMeterDataInput} id="input_meter_data" />
                <button id="input_meter_btn" onClick={sendMeterData} >Ввод</button>
            </div>
        </>
    );
}

export default MeterDataForm;