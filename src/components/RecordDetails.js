import React, {useState, useEffect} from 'react'
import Workflow from './Workflow'
import Form from './Form'
import Activities from './Activities'
import { generalIcons } from './apis/icons'
import {deleteRecord, getRecord, getRecords, getData, getTable} from './apis/axios.js'
import "bootstrap/dist/css/bootstrap.min.css"


const RecordDetails = (props) => {

    const tableName = props.tableName || ""
    const recordId = props.recordId || ""
    const userData = props.userData ||[]
    const tableData = props.tableData || []
    const refreshTable = props.refreshTable

    const setShowRecordDetails = props.setShowRecordDetails
    const [recordData, setRecordData] = useState([])
    const [fields, setFields] = useState([])
    const [activities, setActivities] = useState([])

    const getRecordData = async ()=>{
        const params={
            tableName,
            recordId,
            idField: 'id'
        }
        const returnedData = await getRecord(params)
        console.log(returnedData)
        setRecordData(returnedData)
        setFields(Object.keys(returnedData))
      }

      const getActivityData = async ()=>{
        const query = `SELECT A.*, B.first_name, B.last_name from activities as A left join users as B on A.user = B.email where "record_id"='${recordId}' and "app" = '${tableName}' order by "created" desc;`
        const returnedData = await getData(query)
        setActivities(returnedData)
      }

      useEffect(()=>{
        getRecordData()
        getActivityData()
      },[props])


    const handleRecordDetailForm = (e)=>{

        if(e.target.name == "closeButton"){
            setShowRecordDetails(false)

        }else if(e.target.name == "trashButton"){

            alert("Please confirm you want to delete this record")

            const params = {
                tableName,
                idField: 'id',
                recordId
            }
            const deleteRespponse = deleteRecord(params)
            console.log(deleteRespponse)
            setShowRecordDetails(false)

             //Refreshes the table in the UI
            const updateTable = async (req, res)=>{
                const response = await getTable(tableName)
                refreshTable(response.sort((a, b) => {
                return  b.id-a.id;
                }));
            }
            updateTable()

        }else{
            return
        }
    }

  return (
    <div className="flex-container" style={{height: "100%", overflow: "hidden"}}>
        <div className="row">
            <div className="d-flex justify-content-between mb-3">
                {userData.role!=="Individual" && <div className="d-flex justify-content-end">
                    <div className="button-group justify-content-between">
                        <button className="btn btn-primary m-1" name="approveButton" onClick={(e)=>{handleRecordDetailForm(e)}}>Approve</button>
                        <button className="btn btn-danger m-1" name="denyButton" onClick={(e)=>{handleRecordDetailForm(e)}}>Deny</button>
                    </div>
                </div>}
                <div className="d-flex justify-content-end">
                    <div className="button-group">
                        <img src={`${generalIcons}/trash_icon.png`} className="icon-button" name="trashButton" onClick={(e)=>{handleRecordDetailForm(e)}}></img>
                        <img src={`${generalIcons}/close_icon.png`} className="icon-button"  name="closeButton" onClick={(e)=>{handleRecordDetailForm(e)}}></img>
                    </div>
                </div>
            </div>
        </div>
        <div className="row">
            <Workflow/>
        </div>
        <div className="row">
            <div className="col-6 p-3">
                <Form
                    tableName={tableName}
                    recordId={recordId}
                    formData={recordData}
                    fields = {fields}
                    userData={userData}
                    updateActivitiesOnSave = {true}
                    updateRecord = {setRecordData}
                    refreshActivities = {setActivities}
                    refreshTable = {refreshTable}
                />
             </div>
            
            <div className="col-6 p-3">
                <Activities
                    tableName={tableName}
                    recordId={recordId}
                    userData={userData}
                    activities={activities}
                />
            </div>
        </div>
        </div>
  )
}

export default RecordDetails