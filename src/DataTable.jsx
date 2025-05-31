import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'
import { classNames } from 'primereact/utils';
import { FilterMatchMode, FilterService } from 'primereact/api';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { MultiSelect } from 'primereact/multiselect';
import { Tag } from 'primereact/tag';
import {
  TriStateCheckbox
} from 'primereact/tristatecheckbox'; 
import { InputNumber } from 'primereact/inputnumber';
 
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
 
import 'bootstrap/dist/css/bootstrap.css';

import axios from 'axios'

const API_URL = import.meta.env.VITE_METASPLOIT_API_URL;


// The rule argument should be a string in the format "custom_[field]".
FilterService.register('custom_activity', (value, filters) => {
  const [from, to] = filters ?? [null, null];
  if (from === null && to === null) return true;
  if (from !== null && to === null) return from <= value;
  if (from === null && to !== null) return value <= to;
  return from <= value && value <= to;
});

function DataTableGrid ({attacks, setAttacks}) {
 
    const [rowClick, setRowClick] = useState(true);
    const [loading, setLoading] = useState(true); 

    const navigate = useNavigate();


    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        name: { value: null, matchMode: FilterMatchMode.CONTAINS },
        module: { value: null, matchMode: FilterMatchMode.CONTAINS },  
        rank: { value: null, matchMode: FilterMatchMode.IN }, 
        type: { value: null, matchMode: FilterMatchMode.IN }, 
        check_supported: { value: null, matchMode: FilterMatchMode.IN },  
    }); 

    const [globalFilterValue, setGlobalFilterValue] = useState(''); 

    const [ranks]  = useState(['Excellent','Great','Good','Normal','Average','Manual'])
    const [checks] = useState(['Yes','No'])
    const [types]  = useState(['exploits','auxiliary','post'])
  
     
    const [selectedAttacks, setSelectedAttacks] = useState([]); 

  //   const getAllData = async (allData = []) => {
  //     let url =API_URL +"/attacks?offset=" + allData.length + "&limit=500"
  //     console.log("URL: " + url); 
  //     const response = await axios.get(url);
  //     const data = await response.data; 
  //     allData = allData.concat(data);    
  //     setAttacks(allData)
  //     if (data.length > 0) { return getAllData(allData);
  //     } 
  //     else { return allData; }
  // };
  //     useEffect(() => { 
  //         const fetchData = async () => { 
  //           if (attacks.length == 0) {
  //             const data = await getAllData();
  //             setAttacks(data); 
  //           }
  //             setLoading(false); 
  //         };
  //         fetchData(); 
  //     }, []); 

  const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    let _filters = { ...filters };
    // @ts-ignore
    _filters['global'].value = value;
    setFilters(_filters);
    setGlobalFilterValue(value);
  };

  const handleAttackSelection2 = () => { 
    console.log("selectedAttacks", selectedAttacks) 
    if (selectedAttacks.length > 0) {
      let ids = []
      for (let i = 0; i < selectedAttacks.length; i++) { 
        ids.push("attackIds=" + selectedAttacks[i].attack_id)
      }
      navigate({
        pathname: '/static',
        search: '?' + ids.join("&"),
      });  
    } 
  }

  const renderHeader = () => {
    return (
        <div className="row">
            <div className="col-sm"> 
                <InputText
                    value={globalFilterValue}
                    onChange={onGlobalFilterChange}
                    placeholder="Keyword Search"
                />  
            </div>
            <div className="col-sm" style={{textAlign:"right"}}>   
                <button type="submit" 
                  className="btn btn-primary" 
                  onClick={handleAttackSelection2}
                  disabled={!selectedAttacks || selectedAttacks.length == 0}>Attack Options
                </button> 
            </div>
      </div>
    );
  }; 

  const rankRowFilterTemplate = (
    options
  ) => {
    return ( 
      <MultiSelect
        value={options.value}
        options={ranks}
        onChange={(e) =>
          options.filterApplyCallback(e.value)
        } 
        placeholder="Select One"
        className="p-column-filter"
        showClear
        style={{ minWidth: '12rem' }}
      />
    );
  };


  const lockTemplate = (rowData, options) => {   
        let linkTo = "/static?attackId="+rowData.attack_id
        // target="_blank" rel="noopener noreferrer"
        return <Link to={linkTo} >{rowData.name}</Link>
};


  const typeRowFilterTemplate = (
    options
  ) => {
    return (
      <MultiSelect
        value={options.value}
        options={types}
        onChange={(e) =>
          options.filterApplyCallback(e.value)
        } 
        placeholder="Select One"
        className="p-column-filter"
        showClear
        style={{ minWidth: '12rem' }}
      />
    );
  };
  const checkRowFilterTemplate = (
    options
  ) => {
    return (
      <MultiSelect
        value={options.value}
        options={checks}
        onChange={(e) =>
          options.filterApplyCallback(e.value)
        } 
        placeholder="Select One"
        className="p-column-filter"
        showClear
        style={{ minWidth: '12rem' }}
      />
    );
  };
 
  const header = renderHeader();

  return (
    <div className="card">
      <DataTable
        value={attacks}
        paginator
        rows={15}
        dataKey="attack_id"
        filters={filters}
        filterDisplay="row" 
        globalFilterFields={[
          'name',
          'module',  
          'check',
          'rank',
          'type',
          'date',
        ]}
        header={header}
        emptyMessage="No data found."
        selectionMode={rowClick ? null : 'checkbox'} 
        selection={selectedAttacks} 
        onSelectionChange={(e) => setSelectedAttacks(e.value)} 
        tableStyle={{ minWidth: '125rem' }}
        size="small"  
        stripedRows
      >
        <Column
          field="name"
          header="Name"
          sortable
          filter
          body={lockTemplate}
          filterPlaceholder="Search by name"
          style={{ minWidth: '35rem' }}
        />
        <Column
          field="module"
          header="Module"
          sortable
          filter
          filterPlaceholder="Search by module"
          style={{ minWidth: '12rem' }}
        />
        <Column
          field="rank"
          header="Rank"
          showFilterMenu={false}
          filterMenuStyle={{ width: '14rem' }}
          style={{ minWidth: '12rem' }}
          //body={statusBodyTemplate}
          filter
          filterElement={rankRowFilterTemplate}
        />
        <Column
          field="type"
          header="Type"
          showFilterMenu={false}
          filterMenuStyle={{ width: '14rem' }}
          style={{ minWidth: '12rem' }}
          //body={statusBodyTemplate}
          filter
          filterElement={typeRowFilterTemplate}
        />
        <Column
          field="check_supported"
          header="Check"
          showFilterMenu={false}
          filterMenuStyle={{ width: '14rem' }}
          style={{ minWidth: '12rem' }} 
          filter
          filterElement={checkRowFilterTemplate}
        />
        <Column selectionMode="multiple" headerStyle={{ width: '3rem' }}></Column>
      </DataTable>
    </div>
  );
}

export default DataTableGrid