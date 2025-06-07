import React, { useState, useEffect } from 'react'; 
import { Card } from 'primereact/card';

import { InputText } from "primereact/inputtext";
import { InputTextarea } from 'primereact/inputtextarea';
import { Button } from 'primereact/button';

import { Dropdown } from 'primereact/dropdown';
import "./style.css"

import data from './services/payload-options.json'
 

const API_URL = import.meta.env.VITE_METASPLOIT_API_URL + ":" + 
                import.meta.env.VITE_METASPLOIT_PORT;

  
function PayloadOptions({ selectedAttacks, setSelectedAttacks, attack_id, payload_default }) {  
    
    const [options, setOptions] = useState([]);  


    useEffect(() => {
        console.log("payload_default", payload_default)
        updateOptions(); 
    }, [payload_default])

    // useEffect(() => {
    //     if (options != [])
    //     updateOptions(); 
    //     if (options != [])
    //     updateSelectedAttacks(); 
    // }, [])

    // useEffect(() => {
    //     console.log("pyload_default", payload_default) 
    //     updateSelectedAttacks(); updateOptions(); 
    // }, [payload_default])


    // useEffect(() => {
    //     updateSelectedAttacks(); 
    //     console.log("options", options) 
    // }, [options])

    const updateOptions = () => {   
        let payload =  payload_default 
        console.log("data.filter(item => item.name = payload_default)", data.filter(item => item.title = "Module options: ("+ payload+"):")[0])
        setOptions(data.filter(item => item.name = payload_default)[0]?.options || [])  
        //selectedAttacks[i].payload_options = options;  
        console.log("HERRRE", data.filter(item => item.name = payload_default)[0])
        updateSelectedAttacks()
    }  

    const updateSelectedAttacks = () => {
        let tempArr = [...selectedAttacks];
        if (options != [])
        for (let i = 0; i < tempArr.length; i++) { 
            if (tempArr[i].attack_id == attack_id) {
                tempArr[i].payload_options = options
            }
        }
        setSelectedAttacks(tempArr) 
        console.log("selected attacks: ", options)
        console.log("selected attacks: ", selectedAttacks)
    }

    const handleChangeEventValue = (event, opt) => {
        let tempArr = [...options] 
        if (options != [])
        for (let i = 0; i < tempArr.length; i++) {
            if (opt.id == tempArr[i].id) {
                tempArr[i].value = event.target.value
            }
        }
        setOptions(tempArr)

        updateSelectedAttacks()
    } 
 
  
  return (
    <>  

        {options.map((opt) => (
            <>
     <div className="row" style={{marginTop:"0.5em"}}>
                <div className="col-md-5"> 
                    {opt.name}
                </div>
                <div className="col-md-6">
                    <InputText 
                        value={opt.current_setting}  
                        onChange={(event) => handleChangeEventValue(event,opt)} 
                        title={opt.description}
                        />
                </div>
 
        </div>

</>
        ))} 
 
    </>
  )
}

export default PayloadOptions
