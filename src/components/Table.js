import React, {useState, useEffect, useMemo, useCallback} from 'react'
import { AgGridReact } from 'ag-grid-react'; // React Grid Logic
import "ag-grid-community/styles/ag-grid.css"; // Core CSS
import "ag-grid-community/styles/ag-theme-quartz.css"; // Theme
import axios from './axios.js'
import DraggableDiv from './DraggableDiv.js';


const Table = (props) => {

    const data = props.data;
    const [fields, setFields] = useState([])
    

    const headers= ()=>{
      let fieldList = []
      if(data.length>0){
        Object.keys(data[0]).map((field,index)=>(
          fieldList.push({field: field, filter: true})
        ))
        setFields(fieldList)
      }
    }

    //Record Details Window
    const [selectedRecord, setSelectedRecord] = useState({})
    const [showRecordDetails, setShowRecordDetails] = useState(false)
    const approveButtonLabel = props.approveButtonLabel
    const denyButtonLabel = props.denyButtonLabel
    const [activityData, setActivityData] = useState(props.activityData || [])


    const getActivityData = async(req, res)=>{
      
      try{
        const response = await axios.get('/db/query/table/activities')
        const data = await response.data
        setActivityData(data)
      }catch(error){
        console.log(error)
      }
    }

    const onCellClicked = (event) => {
      console.log(event)
      setSelectedRecord(event.data)
      setShowRecordDetails(true)
    }
    const handleRecordDetailForm =(e)=>{
      console.log(e.target.name)
      setShowRecordDetails(false)
    }

    const handleChange =(e)=>{

    }

    const toProperCase = (str)=>{
      try{
        return str.split(" ")
       .map(w => w[0].toUpperCase() + w.substring(1).toLowerCase())
       .join(" ").replaceAll("_"," ")
      }catch(error){
        return str
      }
    }

    useEffect(()=>{
      headers()
    },[props])

  
  return (
      <div className="ag-theme-quartz" style={{ height: "100%", width: "100%" }}>
        <AgGridReact 
          rowData={data} 
          columnDefs={fields} 
          onCellClicked={onCellClicked}
        />
        {
          showRecordDetails && 
          <div className="d-flex flex-column border border-1 rounded-3 shadow bg-light p-3" style={{position: "absolute", top: 0, right: 0, height: "100%", width: 1000, overflowY:"auto", overflowX: "hidden", zIndex: 1000}}>
              
              <div className="d-flex justify-content-end mb-3">
                <div className="button-group">
                  {approveButtonLabel && <button className="btn btn-primary" name="approveButton" onClick={(e)=>{handleRecordDetailForm(e)}}>{approveButtonLabel}</button>}
                  {denyButtonLabel && <button className="btn btn-outline-danger" name="denyButton" onClick={(e)=>{handleRecordDetailForm(e)}}>{denyButtonLabel}</button>}
                  <button className="btn btn-outline-secondary" name="closeButton" onClick={(e)=>{handleRecordDetailForm(e)}}>Close</button>
                </div>
              </div>

              <div className="d-flex flex-fill flex-column w-100">
                <h4>Workflow Status</h4>
                <div className="d-flex flex-fill flex-column w-100 p-3 bg-white border border-1" style={{position: "relative", height:350, width: "100%", overflow:'auto'}} >
                    <DraggableDiv label={"Submitted"} startingCoordinates={{x: 50, y:100}}/>
                    <DraggableDiv label={"Inventory Check"} startingCoordinates={{x: 250, y:25}}/>
                    <DraggableDiv label={"Catalog Check"} startingCoordinates={{x: 250, y:200}}/>
                    <DraggableDiv label={"Sourcing Required?"} startingCoordinates={{x: 450, y:100}}/>
                    <DraggableDiv label={"Route For Sourcing"} startingCoordinates={{x: 650, y:200}}/>
                    <DraggableDiv label={"Budget Check"} startingCoordinates={{x: 650, y:25}}/>
                    <DraggableDiv label={"Close"} startingCoordinates={{x: 850, y:100}}/>
                </div>
                
              </div>

            <div className="d-flex" style={{overflowY: 'auto', position: 'relative'}}>
              <div className="d-flex flex-column w-50 p-3">
              <h4>Details</h4>    
              <form>
                {(Object.keys(selectedRecord)).map((item,index)=>(
                  <div key={index} 
                    className="form-group mb-2">
                    <input className="form-control" value={selectedRecord[item]} onChange={(e)=>handleChange(e)}></input>
                    <label className="form-label">{toProperCase(item)}</label>
                  </div>
                ))}
              </form>
              </div>

              <div className="d-flex flex-column w-50 p-3 p-3">
                <h4>Activity</h4>
                <div>
                  { typeof activityData =="object" && activityData.length>0?
                    <div>{activityData.map((item,index)=>(<div key={index}>{item.timestamp}:  {item.description}</div>))}</div>
                  :
                    <div>No activities logged to this record</div>
                  }
                </div>
              </div>

            </div>
            

          </div>
        }          
    </div>
  )
}

export default Table