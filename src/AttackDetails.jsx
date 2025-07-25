import React, {useState, useEffect } from "react";
import {
  useParams, useSearchParams, Link 
} from "react-router-dom";

import { Card } from 'primereact/card';

import './style.css'

import axios from 'axios'
const API_URL = import.meta.env.VITE_METASPLOIT_API_URL + ":" + 
                import.meta.env.VITE_METASPLOIT_PORT;


function AttackDetails() {  

    const [searchParams, setSearchParams] = useSearchParams();

    const attackId = searchParams.get("attackId")

    const [attack, setAttack] = useState({})
    const [loading, setLoading] = useState(true)
    const [hasError, setHasError] = useState("") 

    useEffect(() => {  
        axios.get(API_URL+'/attacks/'+attackId)
            .then((response) => { 
                setAttack(response.data)
                setLoading(false)
            })
            .catch((err) => {
                console.log("error", err)  
                setHasError(err.message); 
            })
    },[attackId])


    const attackCardTitle = (item) => {
        return (<h4><Link to={{ pathname: '/app', search: '?attackIds='+item.attack_id }}>{item.name}</Link></h4>)
    }
    const attackCardSubtitle = (item) => {
        return (<h5>{item.module}</h5>)
    }

    return (
        <>
        {hasError != "" && 
        <>
        <br/><br/><br/>
            <h3>{hasError}</h3>
            </>
        }
        {loading && <p>Loading...</p>}
        {!loading && 


      <div className="container" style={{width: "900px"}}>  
          <div className="row" style={{ marginTop: "2em" }}>
            <Card title={attackCardTitle(attack)} subTitle={attackCardSubtitle(attack)} style={{ width: "880px" }}>
  


        <div className="container">
     
        <div style={{display:"flex"}}>
            <div className="col-sm-1" style={{textAlign: "right", marginRight:"10px", minWidth:"100px"}}>
                <b>Name:</b>
            </div>
            <div className="col-sm-12">
                {attack.name} 
            </div>
            </div>

        <div style={{display:"flex"}}>
        <div className="col-sm-1" style={{textAlign: "right", marginRight:"10px", minWidth:"100px"}}>
                <b>Module: </b>
            </div>
            <div className="col-sm-12">
                {attack.module} 
            </div>
            </div>

<div style={{display:"flex"}}>
<div className="col-sm-1" style={{textAlign: "right", marginRight:"10px", minWidth:"100px"}}>
<b>Platform:</b>
    </div>
    <div className="col-sm-12">
        {attack.platform} 
    </div>
    </div>

<div style={{display:"flex"}}>
<div className="col-sm-1" style={{textAlign: "right", marginRight:"10px", minWidth:"100px"}}>
<b>Arch: </b>
    </div>
    <div className="col-sm-12">
        {attack.arch} 
    </div>
    </div>

<div style={{display:"flex"}}>
<div className="col-sm-1" style={{textAlign: "right", marginRight:"10px", minWidth:"100px"}}>
<b>Privileged:</b>
    </div>
    <div className="col-sm-12">
        {attack.privileged} 
    </div>
    </div>

<div style={{display:"flex"}}>
<div className="col-sm-1" style={{textAlign: "right", marginRight:"10px", minWidth:"100px"}}>
        <b>License: </b>
    </div>
    <div className="col-sm-12">
        {attack.license} 
    </div>
    </div>

<div style={{display:"flex"}}>
<div className="col-sm-1" style={{textAlign: "right", marginRight:"10px", minWidth:"100px"}}>
        <b>Rank: </b>
    </div>
    <div className="col-sm-12">
        {attack.rank} 
    </div>
    </div>

<div style={{display:"flex"}}>
<div className="col-sm-1" style={{textAlign: "right", marginRight:"10px", minWidth:"100px"}}>
<b>Disclosed:  </b>
    </div>
    <div className="col-sm-12">
        {attack.disclosed} 
    </div>
    </div>

    <br/>
<div style={{display:"block"}}>
    <div className="col-sm-4" style={{textAlign: "left", marginRight:"10px"}}>
    <b>Provided By: </b>
    </div>
    <div className="col-sm-12" style={{ whiteSpace: "pre-line", paddingLeft:"40px"}}>
        {attack.provided_by} 
    </div>
    </div>
    <br/>
{attack.module_side_effects && 
<>
<div style={{display:"block"}}>
<div className="col-sm-4" style={{textAlign: "left", marginRight:"10px"}}>
<b>Module Side Effects:</b>
    </div>
    <div className="col-sm-12" style={{ whiteSpace: "pre-line", paddingLeft:"40px"}}>
        {attack.module_side_effects} 
    </div>
    </div>
    <br/>
    </>
}
{attack.module_stability && 
<>
<div style={{display:"block"}}>
<div className="col-sm-4" style={{textAlign: "left", marginRight:"10px"}}>
<b>Module Stability: </b>
    </div>
    <div className="col-sm-12" style={{ whiteSpace: "pre-line", paddingLeft:"40px"}}>
        {attack.module_stability} 
    </div>
    </div>

<br/>
</>
}
{attack.module_reliability && 
<>
<div style={{display:"block"}}>
<div className="col-sm-4" style={{textAlign: "left", marginRight:"10px"}}>
<b>Module Reliability: </b>
    </div>
    <div className="col-sm-12" style={{ whiteSpace: "pre-line", paddingLeft:"40px"}}>
        {attack.module_reliability} 
    </div>
    </div>
    <br/>
    </>
}




{attack.target_options && attack.target_options?.length > 0 && 
<>
 
<div style={{display:"block"}}>
<div className="col-sm-4" style={{textAlign: "left", marginRight:"10px"}}>
<b>Available Targets: </b> 
    </div>
    <div className="col-sm-12" style={{ whiteSpace: "pre-line", paddingLeft:"40px"}}>
        <table className="mytable">
            <thead>
                <tr>
                    <th style={{padding:"3px", paddingRight:"20px", fontWeight:"bold"}}>Default</th>
                    <th style={{padding:"3px",  paddingRight:"20px",fontWeight:"bold"}}>ID</th>
                    <th style={{padding:"3px",  paddingRight:"20px",fontWeight:"bold"}}>Name</th>
                </tr>
            </thead>    
            <tbody>
            {attack.target_options.map((tar) =>(
                <tr>
                    <td>{tar.default_setting}</td>
                    <td>{tar.id}</td>
                    <td>{tar.name}</td>
                </tr>
            ))}
            </tbody>
        </table>
    </div>
    </div>
    <br/>


</>
} 
<div style={{display:"block"}}>
<div className="col-sm-4" style={{textAlign: "left", marginRight:"10px"}}>
<b>Check: </b>
    </div>
    <div className="col-sm-12" style={{ whiteSpace: "pre-line", paddingLeft:"40px"}}>
        {attack.check_supported} 
    </div>
    </div>
    <br/>

    {attack.module_options && attack.module_options.length > 0 && 
<>
 
<div style={{display:"block"}}>
<div className="col-sm-4" style={{textAlign: "left", marginRight:"10px"}}>
<b>Basic Options:</b>  
    </div>

    {attack.module_options.map((heading) =>(

        <>
    <div className="col-sm-12" style={{ whiteSpace: "pre-line", paddingLeft:"40px"}}>
        <table className="mytable">
            <thead>
                <tr>
                    <th  style={{padding:"3px", fontWeight:"normal"}} colSpan={3}>{heading.title}</th>
                </tr>
            <tr>
                <th style={{padding:"3px", paddingRight: "20px", fontWeight:"bold"}}>Name</th>
                <th style={{padding:"3px", paddingRight: "20px", fontWeight:"bold"}}>Current setting</th>
                <th style={{padding:"3px", paddingRight: "20px", fontWeight:"bold"}}>Required</th>
                <th style={{padding:"3px", paddingRight: "20px", fontWeight:"bold"}}>Description</th>
            </tr>    
            </thead>
            <tbody>
            {heading.module_options.map((opt) =>(
                <tr>
                    <td>{opt.option_name}</td>
                    <td>{opt.option_value}</td>
                    <td>{opt.option_required}</td>
                    <td>{opt.option_description}</td>
                </tr>
            ))}
            </tbody>
        </table>
    </div>
    <br/>
    </>
    ))}
 
    </div>


</>
}

<div style={{display:"block"}}>
<div className="col-sm-4" style={{textAlign: "left", marginRight:"10px"}}>
<b>Payload Information: </b>
    </div>
    <div className="col-sm-12" style={{ whiteSpace: "pre-line", paddingLeft:"40px"}}>
        {attack.payload_information} 
    </div>
    </div>
 
    <br/>
<div style={{display:"block"}}>
<div className="col-sm-4" style={{textAlign: "left", marginRight:"10px"}}>
<b>Description:  </b>
    </div>
    <div className="col-sm-12" style={{ whiteSpace: "pre-line", paddingLeft:"40px"}}>
        {attack.description} 
    </div>
    </div>
 
    <br/>
<div style={{display:"block"}}>
<div className="col-sm-4" style={{textAlign: "left", marginRight:"10px"}}>
<b> References:  </b>
    </div>
    <div className="col-sm-12" style={{ whiteSpace: "pre-line", paddingLeft:"40px"}}>
        {attack.refs} 
    </div>
    </div>
 
    <br/>
    </div>
    </Card>
    </div>
    </div>
}
        </>
    )
}

export default AttackDetails
