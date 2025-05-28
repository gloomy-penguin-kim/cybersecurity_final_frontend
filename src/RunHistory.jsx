import React from 'react';
import { Accordion, AccordionTab } from 'primereact/accordion';
 
import { Card } from 'primereact/card';
import { InputTextarea } from 'primereact/inputtextarea';

import "./style.css"

function RunHistory({runHistory}) { 
 

    const accordianTabHeader = (run) => {
        return (
            <>
                <div style={{display:"flex", textDecorationLine: "none", color: "#6b7280;"}}>
                <div className="col-md-8" >
                    <span style={{color:"#6b7280;", textDecoration: "none"}}>{run.name}</span>
                </div> 
                <div className="col-md-4" style={{textAlign:"right"}}>
                    {run.timestamp}
                </div>
                </div>
            </>
        )
    }
 
  return (
    <>

        <div className="container">  
            <div className="row" style={{marginTop:"2em"}}>
                <Card title="Run History" style={{width:"700px"}}> 
                    
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
