import React, { useState, useEffect } from 'react'; 

import CheckboxRowSelectionDemo from '././DataTable'
import SetOptions from './SetOptions';
import RunHistory from './RunHistory'

import { useCookies } from 'react-cookie';

import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
 
import 'bootstrap/dist/css/bootstrap.css';



import axios from 'axios'

const API_URL = 'http://127.0.0.1:8082/attacks';

// const getAllData = async (allData = []) => {
//     let url = API_URL + "?offset=" + allData.length + "&limit=500"
//     console.log("URL: " + url); 
//     const response = await axios.get(url);
//     const data = await response.data; 
//     allData = allData.concat(data);    
//     if (data.length > 0) { return getAllData(allData);
//     } 
//     else { return allData; }
// };

function FormPage() { 
  const [attacks, setAttacks] = useState([])
  const [selectedAttacks, setSelectedAttacks] = useState([])
  const [runHistory, setRunHistory] = useState([]); 

  const [loading, setLoading] = useState(true)

  const [showDataTable, setShowDataTable] = useState(true);
  const [showSetOptions, setShowSetOptions] = useState(false); 
  
  const [ cookies, setCookies, removeCookie ] = useCookies(['runHistory']); 

  const getAllData = async (allData = []) => {
    let url = API_URL + "?offset=" + allData.length + "&limit=500"
    console.log("URL: " + url); 
    const response = await axios.get(url);
    const data = await response.data; 
    allData = allData.concat(data);    
    setAttacks(allData)
    if (data.length > 0) { return getAllData(allData);
    } 
    else { return allData; }
};
    useEffect(() => {
        const fetchData = async () => { 
          if (attacks.length == 0) {
            const data = await getAllData();
            setAttacks(data);
          }
            setLoading(false); 
        };
        fetchData();

        setRunHistory(cookies.runHistory || []) 
        
        console.log(runHistory) 
    }, []);


  const handleRunHistory = (row) => {
    
    if (runHistory.length > 50) setRunHistory(runHistory[50]) 
    let tempArr = [...runHistory]
    tempArr.unshift(row) 
    setRunHistory(tempArr) 
    setCookies('runHistory', runHistory, { path: '/', maxAge: 3456000 })  
  }

  const handleAttackSelection = () => { 
    console.log("selectedAttacks", selectedAttacks) 
    if (selectedAttacks.length > 0) {

        // get list of attack_ids 
        let attack_ids = [] 
        for (let i = 0; i < selectedAttacks.length; i++) {
          attack_ids.push(selectedAttacks[i].attack_id)
        }

        // use axios to post to /attacks/ to get full info 
        axios.post(API_URL, attack_ids)
          .then((response) => {
            console.log("response", response) 
            setSelectedAttacks(response.data) 
            setShowDataTable(false);
            setShowSetOptions(true); 
          })
          .catch((error) => {
            console.log("error", error) 
          })

    }

  };

  const handleToggle = (event) => {
    event.preventDefault(); 
    setShowDataTable(true); 
    setShowSetOptions(false); 
  }

  return (
    <>
        {showDataTable &&
            <CheckboxRowSelectionDemo  
                handleAttackSelection={handleAttackSelection} 
                selectedAttacks={selectedAttacks}
                setSelectedAttacks={setSelectedAttacks}
                attacks={attacks} 
                loading={loading}> 
            </CheckboxRowSelectionDemo>
        }
        {showSetOptions && 
        <>
        <h3>Click <a href="" onClick={e => handleToggle(e)}>here</a> to view the Datatable</h3>
        <div className="container" style={{display:"flex"}}>

          <div style={{marginRight: "20px"}}>

            <SetOptions 
              selectedAttacks={selectedAttacks} 
              setSelectedAttacks={setSelectedAttacks}
              handleRunHistory={handleRunHistory}
              />
          </div>
          <div>

            <RunHistory 
            runHistory={runHistory}/>
          </div>
        </div>
        </>
        }


    </>
  )
}

export default FormPage
