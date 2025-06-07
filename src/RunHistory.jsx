import React from 'react';
import { Accordion, AccordionTab } from 'primereact/accordion';
 
import { Card } from 'primereact/card';
import { InputTextarea } from 'primereact/inputtextarea'; 


import { Link, useNavigate } from 'react-router-dom'


import "./style.css"

const API_URL = import.meta.env.VITE_METASPLOIT_API_URL + ":" + 
                import.meta.env.VITE_METASPLOIT_PORT;

                

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
                    <span style={{color:"#6b7280;", textDecoration: "none", paddingRight:"5px"}}>{run.name}</span> 
                    {run.session != "" && (
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="bi bi-star" viewBox="0 0 16 16">
                            <path d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.56.56 0 0 0-.163-.505L1.71 6.745l4.052-.576a.53.53 0 0 0 .393-.288L8 2.223l1.847 3.658a.53.53 0 0 0 .393.288l4.052.575-2.906 2.77a.56.56 0 0 0-.163.506l.694 3.957-3.686-1.894a.5.5 0 0 0-.461 0z"/>
                        </svg>
                    )}
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
