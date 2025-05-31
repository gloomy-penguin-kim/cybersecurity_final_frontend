import React, { useState, useEffect } from 'react'; 
import { Accordion, AccordionTab } from 'primereact/accordion';
 
import { Card } from 'primereact/card';
import { InputTextarea } from 'primereact/inputtextarea'; 


import { Link, useNavigate } from 'react-router-dom'


import "./style.css"


import axios from 'axios'

const API_URL = import.meta.env.VITE_METASPLOIT_API_URL;


function Sessions({updateSessions}) {  
    
    const [sessions, setSessions] = useState([]); 
  
    const accordianTabHeader = (s) => { 
        return (
            <>
                <div style={{display:"flex", textDecorationLine: "none", color: "#6b7280;"}}>
                    <div className="col-md-11" >
                        <span style={{color:"#6b7280;", textDecoration: "none"}}>
                            Session ID: {s.session_id}
                            {s.info ? "  (" + s.info  + ")" : ""} 
                             
                        </span>
                    </div> 
                    <div className="col-md-1" onClick={() => closeSession(s)} >
                        close
                    </div>
                </div>
            </>
        )
    }

    const closeSession = (s) => {

        console.log("Close session", s)

        if (!confirm("Delete and close session in Metasploit?")) return; 

        setSessions(sessions.filter((obj) => obj.session_id != s.session_id))

        axios.get(API_URL + '/close_session/'+s.session_id)
            .then((response) => {
                console.log(response) 
            })
            .catch((error) => {
                console.log(error) 
            })
            .finally(() => {
                getSessions() 
            })
    }

    const getSessions = () => { 
        axios.get(API_URL + '/get_sessions')
            .then((response) => {
                console.log(response)
                setSessions(response.data) 
            })
            .catch((error) => {
                console.log(error) 
            })
    }

    useEffect(() => {
        getSessions() 
    },[])

    useEffect(() => {
        getSessions() 
    },[updateSessions])
 
  return (
    <>

        <div className="container">  
            <div className="row" style={{marginTop:"2em"}}>
                <Card title="Sessions" style={{width:"740px"}}> 
                 
                    <Accordion multiple>
                        {sessions.map((s) => (
                            <AccordionTab header={accordianTabHeader(s)}>
                                <InputTextarea 
                                    variant="filled" 
                                    rows={10} 
                                    cols={72} 
                                    value={JSON.stringify(s, null, 2)}>
                                </InputTextarea>
                            </AccordionTab>
                        ))}


                    </Accordion>
 
                </Card>
            </div>
        </div>

    </>
  )
}

export default Sessions
