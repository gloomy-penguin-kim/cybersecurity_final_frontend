import React, { useState, useEffect } from "react";
import { Card } from "primereact/card";

import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";

import { Link } from "react-router-dom";

import AddedOptions from "./AddedOptions";
import PayloadOptions from "./PayloadOptions";
import "./style.css";

import axios from "axios";

const API_URL = "http://127.0.0.1:8082";

function SetOptions({ selectedAttacks, setSelectedAttacks, handleRunHistory }) {
  const handleRemoveAttackItem = (attackItem) => {
    setSelectedAttacks(selectedAttacks.filter((item) => item.attack_id !== attackItem.attack_id));
  };

  useEffect(() => {
    console.log("selectedAttacks",selectedAttacks);
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

    if (validateForm(attackItem.attack_id)) {
      let textarea = document.getElementById(attackItem.attack_id + "_message_textarea");
      textarea.value = "Loading " + attackItem.check + "...";

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
            console.log(res.attack_id + "_message_textarea");

            console.log("data", RCinfo + "\n" + res.response.join("\n") ); 

            // let response = run.response[0]
            // run.msg = run.rcinfo.join("\n") + "\n" + response.value 


            let textarea2 = document.getElementById(res.attack_id + "_message_textarea");
            textarea2.value = RCinfo + "\n" + res.response.join("\n")

            const now = new Date();
            res["timestamp"] = now.toLocaleDateString() + " " + now.toLocaleTimeString();
            res["rcinfo"] = RCinfo.split("\n");

            handleRunHistory(res);
          }
        })
        .catch(function (error) {
          console.log("error", error);
          textarea.value = "Error loading data...";
          let res = {};
          const now = new Date();
          res["response"] = [error?.message];
          res["module"] = attackItem.module;
          res["attack_id"] = attackItem.attack_id;
          res["timestamp"] = now.toLocaleDateString() + " " + now.toLocaleTimeString();
          res["rcinfo"] = RCinfo.split("\n");

          handleRunHistory(res);
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
    item.extras = item.extras || [];
    for (let i = 0; i < item.extras.length; i++) {
      if (item.extras[i].name != "" && item.extras[i].value != "") msg += "set " + item.extras[i].name + " " + item.extras[i].value + "\n";
    }
    
    item.target = item.target || document.getElementById(item.attack_id + "_select")?.value;
    if (item.target != "" && item.target != undefined) msg += "set TARGET " + (item.target || document.getElementById(item.attack_id + "_select").value) + "\n";
    if (item.payload != "**" && item.payload_default != undefined) {
      msg += "set PAYLOAD " + item.payload_default + "\n";
    }
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

  const functionnn = (idk) => {
    let linkTo = "/static?attack_id=" + idk.attack_id;
    return (
      <>
        <Link to={linkTo} target="_blank" rel="noopener noreferrer">
          {idk.name}
        </Link>
      </>
    );
  };

  return (
    <>
      <div className="container" style={{width: "900px"}}>
        {selectedAttacks.map((item) => (
          <div className="row" style={{ marginTop: "2em" }}>
            <Card title={item.module} subTitle={functionnn(item)} style={{ width: "880px" }}>
              <div className="container">
                <p>{item.description}</p>

                {item.module_options
                  .sort((a, b) => a.order_by > b.order_by)
                  .map((opt_head) => (
                    <div className="card" style={{ width: "810px" }}>
                      <h5>{opt_head.title}</h5>

                      {opt_head.module_options
                        .sort((a, b) => a.order_by > b.order_by)
                        .map((opt) => (
                          <div className="row" style={{ marginTop: "0.5em" }} title={opt.option_description}>
                            <div className="col-md-4">{opt.option_required == "yes" ? <b>{opt.option_name}</b> : opt.option_name}</div>
                            <div className="col-md-6">
                              <InputText value={opt.option_value} className={opt.option_required == "yes" ? "borderbox" : ""} onChange={(event) => handleInputOnChange(event, item, opt)} required={opt.option_required == "yes"} />
                            </div>
                          </div>
                        ))}
                    </div>
                  ))}
                  {item.target_options.length > 0 && (
                <div className="card" style={{ width: "810px" }}>
                    <div className="row" style={{ marginTop: "0.5em" }}>
                      <div className="col-sm-4">TARGET</div>
                      <div className="col-sm-6">
                        <select onChange={(event) => handleTargetDropdownChage(event, item)} id={item.attack_id + "_select"}>
                          {item.target_options
                            .sort((a, b) => a.order_by > b.order_by)
                            .map((tar) => (
                              <option selected={tar.default_setting == "=>"} value={tar.id}>
                                {tar.name}
                              </option>
                            ))}
                        </select>
                      </div>
                    </div>
                    </div>
                  )}

                {item.payload_options.length > 0 && (
                  <div className="card"  style={{ width: "810px" }}>
                    <>
                      <div className="row" style={{ marginTop: "0.5em" }}>
                        <div className="col-sm-4">PAYLOAD</div>
                        <div className="col-sm-6">
                          <select onChange={(event) => handlePayloadDropdownChage(event, item)} 
                                id={item.attack_id + "_select_payloads"} 
                                defaultValue={item.payload_default}>
                            <option disabled value="" selected>
                              -- Select a Payload ---
                            </option>
                            {item.payload_options.map((payload) => (
                              <option value={payload.payload_name}>{payload.payload_name}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <br />
                      {item.payload_options
                        .filter((obj) => obj.payload_name == item.payload_default)
                        ?.map((payload_header) => (
                          <>
                            {payload_header.payload_options.map((popt) => (
                              <div className="row" style={{ marginTop: "0.5em" }} title={popt.option_description}>
                                <div className="col-md-4">{popt.option_required == "yes" ? <b>{popt.option_name}</b> : popt.option_name}</div>
                                <div className="col-md-6">
                                  <InputText
                                    value={popt.option_value}
                                    className={popt.option_required == "yes" ? "borderbox" : ""}
                                    onChange={(event) => handleInputOnChangePayload(event, item, popt)}
                                    required={popt.option_required == "yes"}
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
              <InputTextarea id={item.attack_id + "_message_textarea"} variant="filled" rows={10} cols={95}></InputTextarea>
            </Card>
          </div>
        ))}
      </div>
    </>
  );
}

export default SetOptions;
