import React, {useState, useEffect } from "react";
import {
  useParams, useSearchParams
} from "react-router-dom";

import './style.css'

import axios from 'axios'
const API_URL = 'http://127.0.0.1:8082/attacks/';

function AttackDetails({attack_id}) {  

    const [attack, setAttack] = useState({}); 
    useEffect(() => { 
 
        axios.get(API_URL+attack_id)
            .then((response) => {
                console.log("response.data",response) 
                setAttack(response.data)
            })
            .catch((err) => {
                console.log("error", err) 
            })
    },[])
    return (
        <>
        <h4>{attack.name}</h4>
        <h5>{attack.module}</h5>
        <br/>
        <div style={{display:"flex"}}>
            <div className="col-sm-1" style={{textAlign: "right", marginRight:"10px", minWidth:"100px"}}>
                Name: 
            </div>
            <div className="col-sm-12">
                {attack.name} 
            </div>
            </div>

        <div style={{display:"flex"}}>
        <div className="col-sm-1" style={{textAlign: "right", marginRight:"10px", minWidth:"100px"}}>
                Module: 
            </div>
            <div className="col-sm-12">
                {attack.module} 
            </div>
            </div>

<div style={{display:"flex"}}>
<div className="col-sm-1" style={{textAlign: "right", marginRight:"10px", minWidth:"100px"}}>
        Platform: 
    </div>
    <div className="col-sm-12">
        {attack.platform} 
    </div>
    </div>

<div style={{display:"flex"}}>
<div className="col-sm-1" style={{textAlign: "right", marginRight:"10px", minWidth:"100px"}}>
        Arch: 
    </div>
    <div className="col-sm-12">
        {attack.arch} 
    </div>
    </div>

<div style={{display:"flex"}}>
<div className="col-sm-1" style={{textAlign: "right", marginRight:"10px", minWidth:"100px"}}>
        Privileged: 
    </div>
    <div className="col-sm-12">
        {attack.privileged} 
    </div>
    </div>

<div style={{display:"flex"}}>
<div className="col-sm-1" style={{textAlign: "right", marginRight:"10px", minWidth:"100px"}}>
        License: 
    </div>
    <div className="col-sm-12">
        {attack.license} 
    </div>
    </div>

<div style={{display:"flex"}}>
<div className="col-sm-1" style={{textAlign: "right", marginRight:"10px", minWidth:"100px"}}>
        Rank: 
    </div>
    <div className="col-sm-12">
        {attack.rank} 
    </div>
    </div>

<div style={{display:"flex"}}>
<div className="col-sm-1" style={{textAlign: "right", marginRight:"10px", minWidth:"100px"}}>
        Disclosed: 
    </div>
    <div className="col-sm-12">
        {attack.disclosed} 
    </div>
    </div>

    <br/>
<div style={{display:"block"}}>
    <div className="col-sm-4" style={{textAlign: "left", marginRight:"10px"}}>
        Provided By: 
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
        Module Side Effects: 
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
        Module Stability: 
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
        Module Reliability: 
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
        Available Targets:  
    </div>
    <div className="col-sm-12" style={{ whiteSpace: "pre-line", paddingLeft:"40px"}}>
        <table className="mytable">
            <thead>
                <tr>
                    <th style={{padding:"3px", fontWeight:"normal"}}>Default</th>
                    <th style={{padding:"3px", fontWeight:"normal"}}>ID</th>
                    <th style={{padding:"3px", fontWeight:"normal"}}>Name</th>
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
        Check: 
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
        Basic Options:  
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
                <th style={{padding:"3px", fontWeight:"normal"}}>Name</th>
                <th style={{padding:"3px", fontWeight:"normal"}}>Current setting</th>
                <th style={{padding:"3px", fontWeight:"normal"}}>Required</th>
                <th style={{padding:"3px", fontWeight:"normal"}}>Description</th>
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
        Payload Information: 
    </div>
    <div className="col-sm-12" style={{ whiteSpace: "pre-line", paddingLeft:"40px"}}>
        {attack.payload_information} 
    </div>
    </div>
 
    <br/>
<div style={{display:"block"}}>
<div className="col-sm-4" style={{textAlign: "left", marginRight:"10px"}}>
    Description: 
    </div>
    <div className="col-sm-12" style={{ whiteSpace: "pre-line", paddingLeft:"40px"}}>
        {attack.description} 
    </div>
    </div>
 
    <br/>
<div style={{display:"block"}}>
<div className="col-sm-4" style={{textAlign: "left", marginRight:"10px"}}>
        References: 
    </div>
    <div className="col-sm-12" style={{ whiteSpace: "pre-line", paddingLeft:"40px"}}>
        {attack.refs} 
    </div>
    </div>
 
    <br/>
 
        </>
    )
}

export default AttackDetails
