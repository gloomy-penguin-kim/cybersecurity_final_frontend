import React, { useState, useEffect } from 'react'; 
import { useSearchParams } from 'react-router-dom'

import DataTableGrid from '././DataTable'
import SetOptions from './SetOptions';
import RunHistory from './RunHistory'

import { useCookies } from 'react-cookie';

import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
 
import 'bootstrap/dist/css/bootstrap.css';

import Sessions from './Sesssions'
 
   
function FormPage() {  
  const [runHistory, setRunHistory] = useState([]); 
  const [updateSessions, setUpdateRessions] = useState(Date.now()); 

  const [loading, setLoading] = useState(true)
  
  const [ cookies, setCookies, removeCookie ] = useCookies(['runHistory']);  

    useEffect(() => {
        // const fetchData = async () => { 
        //   if (attacks.length == 0) {
        //     const data = await getAllData();
        //     setAttacks(data);
        //   }
        //     setLoading(false); 
        // };
        // fetchData();

        setRunHistory(cookies.runHistory || []) 
        
        console.log("runHistory", runHistory) 
    }, []);


    useEffect(() => {
      setCookies('runHistory', runHistory, {path: "/onetwothree", maxAge: 504000});
      setUpdateRessions(Date.now())
  }, [runHistory, setCookies]);


  const handleRunHistory = (row) => { 
    if (runHistory.length > 100) setRunHistory(runHistory[100]) 
    let tempArr = [...runHistory]
    tempArr.unshift(row) 
    setRunHistory(tempArr)  ;
    setCookies('runHistory', runHistory, {path: "/onetwothree", maxAge: 504000});   
  }

  const handleRemoveHistoryItem = (run) => { 
    console.log("deleting run from runHistory", run) 
    setRunHistory(runHistory.filter((obj) => obj.run_id != run.run_id));
    setCookies('runHistory', runHistory, {path: "/onetwothree", maxAge: 504000});
  }
  

  return (
    <>
 
 {loading && <p>Loading...</p>}
        <div className="container" style={{display:"flex"}}>

          <div style={{marginRight: "20px"}}>

            <SetOptions 
              setLoading={setLoading}
              handleRunHistory={handleRunHistory}
              />
          </div>
          <div>
          {!loading &&
            <>
              <Sessions updateSessions={updateSessions}></Sessions> 
              <RunHistory 
                runHistory={runHistory}
                handleRemoveHistoryItem={handleRemoveHistoryItem}/>
            </>
          }
          </div>

        </div> 


    </>
  )
}

export default FormPage
