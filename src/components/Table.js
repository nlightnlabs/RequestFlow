import React, {useState, useEffect, useMemo, useCallback} from 'react'
import { AgGridReact } from 'ag-grid-react'; // React Grid Logic
import "ag-grid-community/styles/ag-grid.css"; // Core CSS
import "ag-grid-community/styles/ag-theme-quartz.css"; // Theme
import './styles/main.css'
import RecordDetails from './RecordDetails.js';
import { getTable } from './apis/axios.js';


const Table = (props) => {

    const userData = props.userData;
    const tableName = props.tableName || ""
    const [tableData, setTableData] = useState([]);
    const [fields, setFields] = useState([])
    const [recordId, setSelectedRecordId] = useState(0)
    const [showRecordDetails, setShowRecordDetails] = useState(false)


    const getTableData = async (req, res)=>{
      const response = await getTable(tableName)
      setTableData(response.sort((a, b) => {
        return  b.id-a.id;
      }));

      let fieldList = []
        if(response.length>0){
          Object.keys(response[0]).map((field,index)=>(
            fieldList.push({field: field, filter: true})
          ))
          setFields(fieldList)
        }
      }
      
  
  useEffect(()=>{
    console.log(tableName)
    getTableData()
  },[props])


    const onCellClicked = (e) => {
      console.log(e.data.id)
      setSelectedRecordId(e.data.id)
      setShowRecordDetails(true)
    }
  
  return (
      <div className="ag-theme-quartz" style={{ height: "100%", width: "100%" }}>
        <AgGridReact 
          rowData={tableData} 
          columnDefs={fields} 
          onCellClicked={onCellClicked}
        />
        {
          showRecordDetails && 
          <div 
            className="d-flex flex-column border border-1 rounded-3 shadow bg-light p-3" style={{position: "absolute", top: 60, right: 0, height: "100%", width: 1000, overflowY:"auto", overflowX: "hidden", zIndex: 1000}}>
              <RecordDetails
                tableName={tableName}
                recordId={recordId}
                tableData={tableData}
                userData = {userData}
                setShowRecordDetails = {setShowRecordDetails}
                refreshTable = {setTableData}
              />
          </div>
        }          
    </div>
  )
}

export default Table