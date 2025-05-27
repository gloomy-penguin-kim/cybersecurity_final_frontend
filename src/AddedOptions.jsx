import React, { useState, useEffect } from 'react'; 
import { Card } from 'primereact/card';

import { InputText } from "primereact/inputtext";
import { InputTextarea } from 'primereact/inputtextarea';
import { Button } from 'primereact/button';

import { Dropdown } from 'primereact/dropdown';
import "./style.css"
 

const API_URL = 'http://127.0.0.1:8000';
 
function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

function AddedOptions({ selectedAttacks, setSelectedAttacks, attack_id }) {  
    
    const [options, setOptions] = useState([]); 

    useEffect(() => {
        updateSelectedAttacks(); 
    }, [options])
  
    const addRow = () => {
        let tempArr = [...options]
        tempArr.push({ "id": generateUUID(), "name": "", "value": "" })
        setOptions(tempArr)

        updateSelectedAttacks()
    }
    const removeRow = (row) => { 
        const newArray = options.filter(obj => obj.id != row.id); 
        setOptions(newArray) 
        updateSelectedAttacks() 
    }

    const updateSelectedAttacks = () => {
        let tempArr = [...selectedAttacks];
        for (let i = 0; i < tempArr.length; i++) { 
            if (tempArr[i].attack_id == attack_id) {
                tempArr[i].extras = options
            }
        }
        setSelectedAttacks(tempArr)  
    }

    const handleChangeEventValue = (event, opt) => {
        let tempArr = [...options] 
        for (let i = 0; i < tempArr.length; i++) {
            if (opt.id == tempArr[i].id) {
                tempArr[i].value = event.target.value
            }
        }
        setOptions(tempArr)

        updateSelectedAttacks()
    }
    const handleChangeEventName = (event, opt) => {
        let tempArr = [...options]
        for (let i = 0; i < tempArr.length; i++) {
            if (opt.id == tempArr[i].id) {
                tempArr[i].name = event.target.value
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
                <div className="col-md-4"> 
                    <InputText 
                        value={opt.name}  
                        onChange={(event) => handleChangeEventName(event,opt)} 
                        placeholder='Variable Name'
                        />
                </div>
                <div className="col-md-6">
                    <InputText 
                        value={opt.value}  
                        onChange={(event) => handleChangeEventValue(event,opt)} 
                        placeholder='Variable Value'
                        />
                </div>

        <div className=""
            style={{border: "2px solid lightgrey", borderRadius: "10px", padding:"3px", textAlign:"center", width:"20px", cursor:"pointer", backgroundColor: "white"}}
            onClick={() => removeRow(opt)}
                >-</div>
        </div>

</>
        ))}
        <div className=""
            style={{margin: "10px", border: "2px solid lightgrey", borderRadius: "10px", padding:"3px", textAlign:"center", width:"20px", cursor:"pointer", backgroundColor: "white"}}
            onClick={() => addRow()}
                >+</div>

 
    </>
  )
}

export default AddedOptions
