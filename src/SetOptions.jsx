import React, { useState, useEffect, useRef } from "react";
import { Card } from "primereact/card";

import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { Message } from 'primereact/message';
import { Toast } from 'primereact/toast';

import { Link, useSearchParams } from "react-router-dom";

import AddedOptions from "./AddedOptions";
 
import "./style.css";
import "primereact/resources/themes/lara-light-indigo/theme.css";

import axios from "axios";
const API_URL = import.meta.env.VITE_METASPLOIT_API_URL + ":" + 
                import.meta.env.VITE_METASPLOIT_PORT;

function SetOptions({ setLoading, handleRunHistory, runningCommand, setRunningCommand }) {
  const [searchParams, setSearchParams] = useSearchParams()
  const [selectedAttacks, setSelectedAttacks] = useState([])


  const handleRemoveAttackItem = (attackItem) => {
    setSelectedAttacks(selectedAttacks.filter((item) => item.attack_id !== attackItem.attack_id));
  };

  useEffect(() => {
    //console.log("attackIds", attackIds); 
    console.log("selectedAttacks",selectedAttacks);

    console.log("searchParams", searchParams.getAll("attackId"))

    let attackIds = searchParams.getAll("attackIds"); 

    // use axios to post to /attacks/ to get full info 
    axios.post(API_URL + "/attacks", attackIds)
      .then((response) => {
        console.log("response", response) 
        setSelectedAttacks(response.data) 
        setLoading(false)
      })
      .catch((error) => {
        console.log("URL", API_URL + "/attacks") 
        console.log("error", error) 
      })

  }, [])
 

  const validateForm = (attack_id = 0) => {
    let tempArr = [...selectedAttacks];

    for (let i = 0; i < tempArr.length; i++) {
      if (attack_id == tempArr[i].attack_id || attack_id == 0) {
        for (let j = 0; j < tempArr[i].module_options.length; j++) {
          let module_heading = tempArr[i].module_options[j];

          for (let k = 0; k < module_heading.module_options.length; k++) {
            let module_option = module_heading.module_options[k];

            if (module_option.option_required == "yes" && module_option.option_value == "") {
              let msg = module_option.option_name + " is a required field.";
              if (attack_id == 0) msg = tempArr[i].name + " " + msg;
              alert(msg);
              return false;
            }
          }
        }
        if (tempArr[i].payload_default != undefined && tempArr[i].payload_default != "") {
          for (let j = 0; j < tempArr[i].payload_options.length; j++) {
            let payload_heading = tempArr[i].payload_options[j];

            if (payload_heading.payload_name == tempArr[i].payload_default) {
              for (let k = 0; k < payload_heading.payload_options.length; k++) {
                let module_option = payload_heading.payload_options[k];

                if (module_option.option_required == "yes" && module_option.option_value == "") {
                  let msg = module_option.option_name + " is a required field.";
                  if (attack_id == 0) msg = tempArr[i].name + " " + msg;
                  alert(msg);
                  return false;
                }
              }
            }
          }
       }
        if (tempArr[i].extras)
          for (let j = 0; j < tempArr[i].extras.length; j++) {
            if (tempArr[i].extras[j].name == "") {
              alert("All extra variables must have names");
              break;
            }
            if (tempArr[i].extras[j].value == "") {
              alert("Extra variable " + tempArr[i].extras[j].name + " must have a value");
              break;
            }
          }
      }
    }
    return true;
  };

  const handleSingleRunExploit = (attackItem) => {
    attackItem.check = "exploit";
    handleSingleRun(attackItem);
  };

  const handleSingleRunCheck = (attackItem) => {
    attackItem.check = "check";
    handleSingleRun(attackItem);
  };

  const handleSingleRun = (attackItem) => {
    const RCinfo = getRCInfo(attackItem);
    let anchorName = getAnchorName(attackItem); 

    if (validateForm(attackItem.attack_id)) {
      if (runningCommand != "") {
        alert("A command is already running.\n"+runningCommand)
        return 
      }
      else {
        setRunningCommand(attackItem.module); 
        console.log("name", name)
        toast.current.show({ severity: 'info', summary: 'RUNNING', 
          detail: attackItem, sticky: true,
          content: (props) => (
            <div style={{width: "100%"}}>  
              <span><b>{props.message.summary}</b></span><div style={{width:"10px", display:"inline-block"}}></div>
              <a href={"#" + anchorName} className="anchorfinished">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-right-circle" viewBox="0 0 16 16">
                <path fill-rule="evenodd" d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8m15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0M4.5 7.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5z"/>
              </svg>
              </a>
              <br/>
              {props.message.detail.name}<br/>
              {props.message.detail.module}
            </div>
          )});
      }

       
      attackItem.textarea = "Loading " + attackItem.check + "...";

      // let attacK_info = {
      //     attack_id: attackItem.attack_id,
      //     name: attackItem.name,
      //     module: attackItem.module,
      //     option_headings: attackItem.option_headings,
      //     target: attackItem.target || document.getElementById(attackItem.attack_id+"_select").value,
      //     payload: (attackItem.payload == "**" || attackItem.payload == undefined) ? "" : attackItem.payload,
      //     extras: attackItem.extras || [],
      //     check: attackItem.check
      // }  
      let attack = {
        attack_name: attackItem.name,
        RCinfo: RCinfo,
        attack_module: attackItem.module,
        attack_id: attackItem.attack_id,
      };

      console.log("attack", attack)

      axios
        .post(API_URL + "/run_single_attack", [attack], {
          headers: { 
            "Content-Type": "application/json",
          },
        })
        .then(function (response) {
          console.log(response.data);
          for (let i = 0; i < response.data.length; i++) {
            let res = response.data[i];

            console.log("res = ", res);
            console.log("res.response = ", res.response);
            console.log(res.attack_id + "_message_textarea");

            let ok_history = RCinfo + "\n" + (Array.isArray(res.response) ? res.response?.join("\n")  : res.response?.value)

            console.log("data", ok_history ); 

            // let response = run.response[0]
            // run.msg = run.rcinfo.join("\n") + "\n" + response.value 


            // let textarea2 = document.getElementById(res.attack_id + "_message_textarea");
            // textarea2.value = ok_history 

            attackItem.textarea = ok_history 

            const now = new Date();
            res["timestamp"] = now.toLocaleDateString() + " " + now.toLocaleTimeString();
            res["rcinfo"] = RCinfo.split("\n");
            res["name"] = attackItem.name;
            res['ok_history'] = ok_history
            res['run_id'] = String(Date.now()) + "_" + String(attackItem.attack_id)
 
            handleRunHistory(res);
            
            if (!res.error)  {
              toast.current.show({ severity: 'success',  
                detail: attackItem, 
                summary: "FINISHED", 
                sticky: true,
                content: (props) => (
                  <div style={{width: "100%"}}>  
                    <span><b>{props.message.summary}</b></span><div style={{width:"10px", display:"inline-block"}}></div>
                    <a href={"#" + anchorName} className="anchorfinished">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-right-circle" viewBox="0 0 16 16">
                      <path fill-rule="evenodd" d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8m15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0M4.5 7.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5z"/>
                    </svg>
                    </a>
                    <br/>
                    {props.message.detail.name}<br/>
                    {props.message.detail.module}
                  </div>
                )});

                if (res.session) { 
                  toast.current.show({ severity: 'info', summary: 'SESSION OPENED', 
                    detail: { name: attackItem.name, 
                              module: attackItem.module, 
                              session: "Session " + res.session + " opened" }, sticky: true,
                    content: (props) => (
                      <div style={{width: "100%"}}>  
                        <span><b>{props.message.summary}</b></span><div style={{width:"10px", display:"inline-block"}}></div>
                        <a href={"#topofpage"} className="anchorfinished">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-right-circle" viewBox="0 0 16 16">
                          <path fill-rule="evenodd" d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8m15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0M4.5 7.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5z"/>
                        </svg>
                        </a>
                        <br/>
                        {props.message.detail.session}<br/>
                        {props.message.detail.name}<br/>
                        {props.message.detail.module}
                      </div>
                    )});

                  }
            }

            else  
              toast.current.show({ severity: 'error',  
                detail: attackItem, 
                summary: "ERROR", 
                sticky: true,
                content: (props) => (
                  <div style={{width: "100%"}}>  
                    <span><b>{props.message.summary}</b></span><div style={{width:"10px", display:"inline-block"}}></div>
                    <a href={"#" + anchorName} className="anchorfinished">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-right-circle" viewBox="0 0 16 16">
                      <path fill-rule="evenodd" d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8m15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0M4.5 7.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5z"/>
                    </svg>
                    </a>
                    <br/>
                    {props.message.detail.name}<br/>
                    {props.message.detail.module}
                  </div>
                )});

              

                handleRunHistory(res);
          }
        })
        .catch(function (error) {
          console.log("error", error);
          let ok_history = "Error loading data...\n\n" + error?.message;
          attackItem.textarea = ok_history
          let res = {};
          const now = new Date();
          res["response"] = [error?.message];
          res["module"] = attackItem.module;
          res["name"] = attackItem.name;
          res["attack_id"] = attackItem.attack_id;
          res["timestamp"] = now.toLocaleDateString() + " " + now.toLocaleTimeString();
          res["rcinfo"] = RCinfo.split("\n");
          res['ok_history'] =  ok_history
          res['run_id'] = String(Date.now()) + "_" + String(attackItem.attack_id)

          handleRunHistory(res);       
          toast.current.show({ severity: 'error',  
            detail: attackItem, 
            sticky: true,
            content: (props) => (
              <div style={{width: "100%"}}>  
                <span><b>ERROR</b></span><br/>
                {props.message.detail.name}<br/>
                {props.message.detail.module}
              </div>
            )});
        })
        .finally(function() {
          setRunningCommand(""); 
        });
    }
  };

  const getRCInfo = (item) => {
    let option_names = [];
    let msg = "use " + item.module + "\n";
    for (let i = 0; i < item.module_options.length; i++) {
      let heading = item.module_options[i];
      for (let j = 0; j < heading.module_options.length; j++) {
        let option = heading.module_options[j];
        if (option.option_value != "" && !option_names.includes(option.option_name)) msg = msg + "set " + option.option_name + " " + option.option_value + "\n";
        option_names.push(option.option_name);
      }
    }
    item.target = item.target || document.getElementById(item.attack_id + "_select")?.value;
    if (item.target != "" && item.target != undefined) msg += "set TARGET " + (item.target || document.getElementById(item.attack_id + "_select").value) + "\n";


    if (item.payload_default != undefined && item.payload_default != "") {
      msg += "set PAYLOAD " + item.payload_default + "\n";

      for (let i = 0; i < item.payload_options.length; i++) {
        let heading = item.payload_options[i];
        if (heading.payload_name == item.payload_default) {
          for (let j = 0; j < heading.payload_options.length; j++) {
            let option = heading.payload_options[j];
            if (option.option_value != "" && !option_names.includes(option.option_name)) msg = msg + "set " + option.option_name + " " + option.option_value + "\n";
            option_names.push(option.option_name);
          }
        }
      }
   }

   item.extras = item.extras || [];
   for (let i = 0; i < item.extras.length; i++) {
     if (item.extras[i].name != "" && item.extras[i].value != "") msg += "set " + item.extras[i].name + " " + item.extras[i].value + "\n";
   }
   

    return msg + (item.check || "exploit") + "\n";
  };

  const handleViewAsRC = (item) => {
    if (validateForm(item.attack_id)) {
      let textarea2 = document.getElementById(item.attack_id + "_message_textarea");
      textarea2.value = getRCInfo(item);
    }
  };

  const handleInputOnChange = (event, item, opt) => {
    let tempArr = [...selectedAttacks];

    for (let i = 0; i < tempArr.length; i++) {
      if (tempArr[i].attack_id == item.attack_id) {
        for (let j = 0; j < tempArr[i].module_options.length; j++) {
          for (let k = 0; k < tempArr[i].module_options[j].module_options.length; k++) {
            if (tempArr[i].module_options[j].module_options[k].option_name == opt.option_name) {
              tempArr[i].module_options[j].module_options[k].option_value = event.target.value;
            }
          }
        }

        for (let j = 0; j < item.payload_options.length; j++) {
          if (item.payload_options[j].payload_name == item.payload_default) {
            for (let k = 0; k < item.payload_options[j].payload_options.length; k++) {
              if (item.payload_options[j].payload_options[k].option_name == opt.option_name) item.payload_options[j].payload_options[k].option_value = event.target.value;
            }
          }
        }
      }
    }
    setSelectedAttacks(tempArr);
  };

  const handleInputOnChangePayload = (event, item, opt) => { 
    let tempArr = [...selectedAttacks];
 

    for (let i = 0; i < tempArr.length; i++) {
      if (tempArr[i].attack_id == item.attack_id) { 
        for (let j = 0; j < item.payload_options.length; j++) { 
          if (item.payload_options[j].payload_name == item.payload_default) {
            for (let k = 0; k < item.payload_options[j].payload_options.length; k++) {
              if (item.payload_options[j].payload_options[k].option_name == opt.option_name) item.payload_options[j].payload_options[k].option_value = event.target.value;
            }
          }
        }

        for (let j = 0; j < tempArr[i].module_options.length; j++) {
          for (let k = 0; k < tempArr[i].module_options[j].module_options.length; k++) {
            if (tempArr[i].module_options[j].module_options[k].option_name == opt.option_name) {
              tempArr[i].module_options[j].module_options[k].option_value = event.target.value;
            }
          }
        }

        tempArr[i]["payload"] = event.target.value;
      }
    } 
    setSelectedAttacks(tempArr);
  };

  const handleTargetDropdownChage = (event, item) => { 
    let tempArr = [...selectedAttacks];
    console.log("item", item)
    console.log("event", event.target)

    for (let i = 0; i < tempArr.length; i++) {
      if (tempArr[i].attack_id == item.attack_id) {
        tempArr[i]["target"] = event.target.value;
      }
    } 
    setSelectedAttacks(tempArr);
  };

  const handlePayloadDropdownChage = (event, item) => { 
    let tempArr = [...selectedAttacks];

    for (let i = 0; i < tempArr.length; i++) {
      if (tempArr[i].attack_id == item.attack_id) {
        tempArr[i]["payload_default"] = event.target.value;
      } 
    }
    setSelectedAttacks(tempArr);
  };

  const attackCardTitle = (idk) => {
    let linkTo = "/app?attackId=" + idk.attack_id;
    return (
      <>  
        <span style={{textDecoration: "none"}}>
          <h4><Link to={linkTo} target="_blank" rel="noopener noreferrer" title={linkTo}>
            <b>{idk.name}</b>
          </Link> 
          </h4>
          </span>
      </>
    );
  }; 

  const attackCardSubtitle = (idk) => { 
    return (
      <>  
        <span><h5><b>
            {idk.module} 
            </b>
            </h5> 
          </span>
      </>
    );
  }; 

  const getAnchorName = (attackItem) => {
    return attackItem.module.replace(/\//g,"-").toLowerCase()  
    //.replace(/[^a-zA-Z0-9]/g,"")
  }

  const toast = useRef(null);
  return (
    <>
 
      <Toast ref={toast} />  

      <div id="topofpage" className="container" style={{width: "900px"}}>
        {selectedAttacks.map((item) => (


          <form autoComplete="on">
          <div id={getAnchorName(item)} className="row" style={{ marginTop: "2em" }}>
            <Card title={attackCardTitle(item)} subTitle={attackCardSubtitle(item)} style={{ width: "880px" }}>
              <div className="container">
                <p>{item.description}</p>

                {item.module_options
                  .sort((a, b) => a.order_by > b.order_by)
                  .filter((obj) => !obj.module_title.includes("Payload"))
                  .map((opt_head) => (
                    <div className="card" style={{ width: "810px", fontSize: "1rem", }}> 
                      <span style={{fontWeight:"bold"}}><p>{opt_head.module_title}</p></span> 
                      {opt_head.module_options
                        .sort((a, b) => a.order_by > b.order_by)
                        .map((opt) => (
                          <div className="row" style={{ marginTop: "0.5em", marginLeft:"10px"}} title={opt.option_description}>
                            <div className="col-md-4">{opt.option_required == "yes" ? <b>{opt.option_name}</b> : opt.option_name}</div>
                            <div className="col-md-6">
                              <InputText value={opt.option_value} 
                                className={opt.option_required == "yes" ? "borderbox" : ""} 
                                onChange={(event) => handleInputOnChange(event, item, opt)} 
                                required={opt.option_required == "yes"} 
                                name={opt.option_name} 
                                aria-label={opt.option_name}
                                />
                            </div>
                          </div>
                        ))}
                    </div>
                  ))}
                  {item.target_options.length > 0 && (
                <div className="card" style={{ width: "810px", fontSize: "1rem", }}>
                    <div className="row"><p><b>Target Options:</b></p></div>
                    <div className="row" style={{ marginTop: "0.5em", marginLeft:"10px" }}>
                      <div className="col-sm-4" style={{ marginTop: "0.5em" }}>TARGET</div>
                      <div className="col-sm-6">
             
                                
                        <Dropdown  
                            value={parseInt(item.target)}
                            onChange={(e) => handleTargetDropdownChage(e, item)} 
                            options={item.target_options} 
                            optionLabel="name" 
                            optionValue="id"
                            placeholder="Select a Target"  
                            className="w-full md:w-14rem"  
                            filter
                            showClear 
                            />

                      </div>
                    </div>
                    </div>
                  )}

                {item.payload_options.length > 0 && (
                  <div className="card"  style={{ width: "810px", fontSize: "1rem" }}>
                    <>
                      <div className="row"><p><b>Payload Options:</b></p></div>
                      <div className="row" style={{ marginLeft:"10px"}}>
                        <div className="col-sm-4" style={{ marginTop: "0.5em" }}>PAYLOAD</div>
                        <div className="col-sm-6">            
                          <Dropdown 
                            value={item.payload_default} 
                            onChange={(e) => handlePayloadDropdownChage(e, item)} 
                            options={item.payload_options} 
                            optionLabel="payload_name" 
                            optionValue="payload_name"
                            placeholder="Select a Payload"  
                            className="w-full md:w-14rem"  
                            filter
                            showClear
                            id={item.attack_id + "_select_payloads"} 
                            />
                        </div>
                      </div>
                      <br />
                      {item.payload_options
                        .filter((obj) => obj.payload_name == item.payload_default)
                        ?.map((payload_header) => (
    
                          <>
                            {payload_header.payload_options.map((popt) => (
                              <div className="row" style={{ marginTop: "0.5em", marginLeft:"10px" }} title={popt.option_description}>
                                <div className="col-md-4">{popt.option_required == "yes" ? <b>{popt.option_name}</b> : popt.option_name}</div>
                                <div className="col-md-6">
                                  <InputText
                                    value={popt.option_value}
                                    className={popt.option_required == "yes" ? "borderbox" : ""}
                                    onChange={(event) => handleInputOnChangePayload(event, item, popt)}
                                    required={popt.option_required == "yes"}
                                    name={popt.option_name} 
                                    aria-label={popt.option_name}
                                  />
                                </div>
                              </div>
                            ))}
                          </>
                        ))}
                    </>
                  </div>
                )}

                <div className="card" style={{ width: "810px" }}>
                  <AddedOptions selectedAttacks={selectedAttacks} setSelectedAttacks={setSelectedAttacks} attack_id={item.attack_id}></AddedOptions>
                </div>
              </div>

              <br />
              <div style={{ display: "flex", justifyContent: "center" }}>
                <div
                  key={item.module + "_remove_button"}
                  className="buttonhover col-sm-4"
                  style={{ margin: "10px", border: "2px solid lightgrey", borderRadius: "10px", padding: "3px", textAlign: "center", width: "125px", cursor: "pointer", backgroundColor: "white" }}
                  onClick={() => handleRemoveAttackItem(item)}
                >
                  <b>remove </b>
                </div>
                {item.check_supported == "Yes" && (
                  <>
                    <div style={{ height: "10px" }}></div>
                    <div
                      key={item.module + "_check_button"}
                      className="buttonhover col-sm-4"
                      style={{ margin: "10px", border: "2px solid lightgrey", borderRadius: "10px", padding: "3px", textAlign: "center", width: "125px", cursor: "pointer", backgroundColor: "white" }}
                      onClick={() => handleSingleRunCheck(item)}
                    >
                      <b>run check </b>
                    </div>
                  </>
                )}
                <div style={{ height: "10px" }}></div>
                <div
                  key={item.module + "_exploit_button"}
                  className="buttonhover col-sm-4"
                  style={{ margin: "10px", border: "2px solid lightgrey", borderRadius: "10px", padding: "3px", textAlign: "center", width: "125px", cursor: "pointer", backgroundColor: "white" }}
                  onClick={() => handleSingleRunExploit(item)}
                >
                  <b>run exploit</b>
                </div>

                <div style={{ height: "10px" }}></div>
                <div
                  key={item.module + "_rc_button"}
                  className="buttonhover col-sm-4"
                  style={{ margin: "10px", border: "2px solid lightgrey", borderRadius: "10px", padding: "3px", textAlign: "center", width: "125px", cursor: "pointer", backgroundColor: "white" }}
                  onClick={() => handleViewAsRC(item)}
                >
                  <b>view as .rc</b>
                </div>
              </div>
              <br />
              <InputTextarea id={item.attack_id + "_message_textarea"} variant="filled" rows={10} cols={95} value={item.textarea}></InputTextarea>
            </Card>
          </div>
          </form>
        ))}
      </div>
    </>
  );
}

export default SetOptions;
