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

import axios from 'axios'

const API_URL = import.meta.env.VITE_METASPLOIT_API_URL + ":" + 
                import.meta.env.VITE_METASPLOIT_PORT;
 
   
function FormPage() {  
  const [runHistory, setRunHistory] = useState([]); 
  const [updateSessions, setUpdateRessions] = useState(Date.now()); 

  const [loading, setLoading] = useState(true)
  
  const [ cookies, setCookies, removeCookie ] = useCookies(['runHistory']);  


  // function useToggle(initial = false) {
  //   const [state, setState] = useState(initial);
  //   const toggle = () => setState(s => !s);
  //   return [state, toggle];
  // }
  
  // const [runningCommand, toggleRunningCommand] = useToggle();

  const [runningCommand, setRunningCommand] = useState(""); 

  const [sessions, setSessions] = useState([]); 

  const getSessions = () => {  
    if (setRunningCommand != "" ) {
      return 
    }
    else {
      setRunningCommand("Getting Sessions right now")
    }
    axios.get(API_URL + '/get_sessions')
        .then((response) => {
            console.log(response)
            setSessions(response.data)  
        })
        .catch((error) => {
            console.log(error)  
        })
        .finally(() => { 
          setRunningCommand("")
        })
}



    useEffect(() => {
        // const fetchData = async () => { 
        //   if (attacks.length == 0) {
        //     const data = await getAllData();
        //     setAttacks(data);
        //   }
        //     setLoading(false); 
        // };
        // fetchData();

        getSessions(); 
        

        console.log("runHis", localStorage.getItem("runHistory")); 

        // if (!Array.isArray(localStorage.getItem("runHistory")) ) {
        //   localStorage.setItem("runHistory", []) 
        // }

        console.log("runHis", localStorage.getItem("runHistory")) 
        let objs = []; 
        if (localStorage.getItem("runHistory") != "")
          objs = JSON.parse(localStorage.getItem("runHistory")) 
          setRunHistory(objs || [])  
          if (!Array.isArray(objs) ) {
            localStorage.setItem("runHistory", JSON.stringify(runHistory)) 
          }


        
        console.log("runHistory", runHistory) 

    }, []);

    const handleDeleteSession = (s) => {  
      if (runningCommand != "") {
        alert ("Command already running\n"+runningCommand);
        return
      }

      console.log("Close session", s) 
      if (!confirm("Delete and close session in Metasploit?")) return;  
      setSessions(sessions.filter((obj) => obj.session_id != s.session_id)) 
 
      setRunningCommand("Closing Session")
      axios.get(API_URL + '/close_session/'+s.session_id)
          .then((response) => {
              console.log(response) 
          })
          .catch((error) => {
              console.log(error) 
          }) 
          .finally(() => {
            setRunningCommand("")
          })
    }




    useEffect(() => {
      // setCookies('runHistory', runHistory, {path: "/onetwothree", maxAge: 504000});
      localStorage.setItem("runHistory", JSON.stringify(runHistory))
      setUpdateRessions(Date.now())
  }, [runHistory, setCookies]);


  const handleRunHistory = (row) => { 
    if (runHistory.length > 100) setRunHistory(runHistory[100]) 
    let tempArr = [...runHistory]
    tempArr.unshift(row) 
    setRunHistory(tempArr)  ;
    setCookies('runHistory', tempArr, {path: "/onetwothree", maxAge: 504000});   
    localStorage.setItem("runHistory", JSON.stringify(tempArr)) 
    getSessions(); 
  }

  const handleRemoveHistoryItem = (run) => { 
    console.log("deleting run from runHistory", run) 
    setRunHistory(runHistory.filter((obj) => obj.run_id != run.run_id));
    setCookies('runHistory', runHistory, {path: "/onetwothree", maxAge: 504000});
    localStorage.setItem("runHistory", JSON.stringify(runHistory)) 
  }
  

  return (
    <>
 
 {loading && <p>Loading...</p>}
        <div className="container" style={{display:"flex"}}>

          <div style={{marginRight: "20px"}}>

            <SetOptions 
                  setLoading={setLoading}
                  handleRunHistory={handleRunHistory}
                  runningCommand={runningCommand}
                  setRunningCommand={setRunningCommand}
              />
          </div>
          <div>
          {!loading &&
            <>
              <Sessions updateSessions={updateSessions}
                    runningCommand={runningCommand}
                    setRunningCommand={setRunningCommand}
                    sessions={sessions}
                    deleteSession={handleDeleteSession}
              ></Sessions> 
              <RunHistory 
                runHistory={runHistory}
                      handleRemoveHistoryItem={handleRemoveHistoryItem}
                      runningCommand={runningCommand}
                      setRunningCommand={setRunningCommand}
                  />
            </>
          }
          </div>

        </div> 


    </>
  )
}

export default FormPage
