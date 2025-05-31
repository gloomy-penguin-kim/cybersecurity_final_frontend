import React from 'react';
import { Accordion, AccordionTab } from 'primereact/accordion';
 
import { Card } from 'primereact/card';
import { InputTextarea } from 'primereact/inputtextarea'; 


import { Link, useNavigate } from 'react-router-dom'


import "./style.css"

function RunHistory({runHistory, handleRemoveHistoryItem}) {  
    const navigate = useNavigate(); 
 
    const getAnchorName = (name) => {
        return name.replace(/[^a-zA-Z0-9]/g,"").toLowerCase()  
    }

    const handleOnClick = (name) => {
        navigate("#"+name)
    }
    const accordianTabHeader = (run) => {
        let anchorName = getAnchorName(run.name)
        return (
            <>
                <div style={{display:"flex", textDecorationLine: "none", color: "#6b7280;"}}>
                <div className="col-md-8" >
                    <span style={{color:"#6b7280;", textDecoration: "none"}}>{run.name}</span>
                </div> 
                <div className="col-md-4" style={{textAlign:"right"}}>
                    {run.timestamp}
                </div>
                {/* <div className="col-md-1" style={{paddingLeft: "20px"}}>
                    
  <div style={{width:"5px", display:"inline-block"}}></div> 
                    <svg onClick={()=> handleRemoveHistoryItem(run)} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-x-circle" viewBox="0 0 16 16">
                        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                        <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"/>
                        </svg>


                </div> */}
                </div>
            </>
        )
    }
 
  return (
    <>

        <div className="container">  
            <div className="row" style={{marginTop:"2em"}}>
                <Card title="Run History" style={{width:"740px"}}> 
                    
                    <Accordion multiple>
                        {runHistory.map((run) => (
                            <AccordionTab header={accordianTabHeader(run)}>
                                <InputTextarea id={run.attack_id+run.timestamp+"_message_textarea"} 
                                variant="filled" 
                                rows={10} 
                                cols={72} 
                                value={run.ok_history}>
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

export default RunHistory
