

import React, { useState, useEffect } from 'react'
import { useSearchParams, Link  } from 'react-router-dom' 
import FormPage from './FormPage'
import AttackDetails from './AttackDetails'

import DataTableGrid from '././DataTable'


import axios from 'axios'

const API_URL = import.meta.env.VITE_METASPLOIT_API_URL + ":" + 
                import.meta.env.VITE_METASPLOIT_PORT;



function App() { 
 
  const [searchParams, setSearchParams] = useSearchParams();
  
  const attackId = searchParams.get('attackId')

  const attackIds = searchParams.getAll("attackIds")

  const [attacks, setAttacks] = useState([]); 


      const getAllData = async (allData = []) => {
        let url = API_URL +"/attacks?offset=" + allData.length + "&limit=500"
        console.log("URL: " + url); 
        const response = await axios.get(url);
        const data = await response.data; 
        allData = allData.concat(data);    
        setAttacks(allData)
        if (data.length > 0) { return getAllData(allData);
        } 
        else { return allData; }
    };
        useEffect(() => { 
            const fetchData = async () => { 
              if (attacks.length == 0) {
                const data = await getAllData();
                setAttacks(data); 
              } 
            };
            fetchData(); 
        }, []); 
  

 
  return (
    <>
      <div style={{display:"flex"}}>
      

      <Link to="/app">
      <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" fill="currentColor" class="bi bi-star" viewBox="0 0 16 16">
  <path d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.56.56 0 0 0-.163-.505L1.71 6.745l4.052-.576a.53.53 0 0 0 .393-.288L8 2.223l1.847 3.658a.53.53 0 0 0 .393.288l4.052.575-2.906 2.77a.56.56 0 0 0-.163.506l.694 3.957-3.686-1.894a.5.5 0 0 0-.461 0z"/>
</svg>
 


</Link>&nbsp; &nbsp; &nbsp; 
      <h1>A Tiny Metasploit GUI</h1> 
      <div style={{display:"inline-block", marginTop:"17px", marginLeft:"10px"}}><h5>by Kim Jones</h5></div> 

      </div>
      <div style={{height: "100vh"}}>

        
      { attackIds.length > 0 && <FormPage></FormPage>}

      { attackId && <AttackDetails></AttackDetails> } 

      { !attackId && attackIds.length == 0  && 
          <DataTableGrid attacks={attacks}></DataTableGrid>}
      </div>      

 

    </>
  )
}

export default App
