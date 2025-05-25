import React from 'react';
import { Accordion, AccordionTab } from 'primereact/accordion';
 
import { Card } from 'primereact/card';
import { InputTextarea } from 'primereact/inputtextarea';

import "./style.css"

function RunHistory({runHistory}) { 

    console.log(runHistory) 

    const accordianTabHeader = (run) => {
        return (
            <>
                <div style={{display:"flex"}}>
                <div className="col-md-9" >
                    {run.module}
                </div>
                <div style={{width:"20px"}}>

                </div>
                <div className="col-md-3" style={{textAlign:"right"}}>
                    {run.timestamp}
                </div>
                </div>
            </>
        )
    }

    const valueFunction = (run) => {
        if (run && run.response && run.response.length > 0) {
            let response = run.response.join("\n")
            return run.rcinfo.join("\n") + "\n" + response
        }
        return ""
    }
  return (
    <>

        <div className="container">  
            <div className="row" style={{marginTop:"2em"}}>
                <Card title="Run History" style={{width:"700px"}}> 
                    
                    <Accordion>
                        {runHistory.map((run) => (
                            <AccordionTab header={accordianTabHeader(run)}>
                                <InputTextarea id={run.attack_id+run.timestamp+"_message_textarea"} 
                                variant="filled" 
                                rows={10} 
                                cols={72} 
                                value={valueFunction(run)}>
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
