

import { useSearchParams, useParams } from 'react-router-dom'
import FormPage from './FormPage'
import AttackDetails from './AttackDetails'

import CheckboxRowSelectionDemo from '././DataTable'

function App() { 
 
  const [searchParams, setSearchParams] = useSearchParams();
  
  const attack_id = searchParams.get('attack_id')

  return (
    <>
      <div style={{display:"flex"}}>
      
      <h1>A Tiny Metasploit GUI</h1> 
      </div>
      <div style={{height: "100vh"}}>
      { attack_id ? <AttackDetails attack_id={attack_id}></AttackDetails> : <FormPage></FormPage> } 
      </div>      

    </>
  )
}

export default App
