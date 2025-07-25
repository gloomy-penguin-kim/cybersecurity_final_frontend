import React, { useState, useEffect } from 'react'; 
import { Accordion, AccordionTab } from 'primereact/accordion';
 
import { Card } from 'primereact/card';
import { InputTextarea } from 'primereact/inputtextarea'; 


import { Link, useNavigate } from 'react-router-dom'


import "./style.css" 


function Sessions({ sessions, handleDeleteSession }) {   
  
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
                    <div className="col-md-1" onClick={() => handleDeleteSession(s)} >
                        close
                    </div>
                </div>
            </>
        )
    }

 
  return (
    <>

        <div className="container">  
            <div className="row" style={{marginTop:"2em"}}>
                <Card title="Sessions" style={{width:"740px"}}> 
                 
                    <Accordion multiple>
                        {sessions?.map((s) => (
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
