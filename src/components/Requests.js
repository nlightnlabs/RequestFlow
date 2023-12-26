import React, {useState, useContext, useEffect, useRef} from 'react';
import {Context } from './Context';
import "bootstrap/dist/css/bootstrap.min.css"
import axios from './apis/axios.js'
import Table from './Table.js';
import List from './List.js';
import ParetoChart from './ParetoChart.js'
import { getTable } from './apis/axios.js';
import { toProperCase } from './functions/formatValue.js';

const Requests = (props) => {

  const {
    user,
    setUser,
    userLoggedIn,
    setUserLoggedIn,
    page,
    setPage,
    pages,
    setPages,
    pageName,
    setPageName,
    requestType,
    setRequestType,
    requestTypes,
    setRequestTypes,
    appData,
    setAppData,
    attachments,
    setAttachments,
    pageList,
    setPageList,
    tableName,
    setTableName,
    tables,
    setTables
  } = useContext(Context)

  const [data, setData] = useState([])
  const [fields, setFields] = useState([])
  const [windowWidth, setWindowWidth] = useState(window.innerWidth)
  const [showTable, setShowTable] = useState(true)
  const [showCharts, setShowCharts] = useState(true)

  
  const getRequestData = async (req, res)=>{
    const response = await getTable(tableName)
    setData(response.sort((a, b) => {
      return  b.id-a.id;
    }));
    setFields(Object.keys(response[0]))
}

useEffect(()=>{
  getRequestData()
},[])

  return (

    <div className="flex-container">
      <div className="row-sm p-0">
      <div className="col-sm-12 p-3">
        <div className="d-flex flex-column bg-light">

            <h2>{toProperCase(tableName)}</h2>
            {/* Charts container */}
            <div className="d-flex flex-wrap justify-content-around p-3" style={{height: "35vh", overflow: 'auto'}}>

              <div className="d-flex border border-1 bg-white justify-content-center rounded-3 shadow mb-3" style={{minWidth: 400, minHeight: 200}}>
                <ParetoChart 
                  chartWidth = {400}
                  chartHeight = {200}
                  tableName = {"requests"}
                  chartTitle = {"Requests By Stage"}
                  categoryLabels = {"stage"}
                  aggregationMethod = {"count"}
                  fillColor = {"#A9D18E"}
                  strokeColor = {"#70AD47"}
                />
              </div>
                

              <div className="d-flex border border-1 bg-white justify-content-center rounded-3 shadow mb-3" style={{minWidth: 400, minHeight: 200}}>
                <ParetoChart 
                  chartWidth = {400}
                  chartHeight = {200}
                  tableName = {"requests"}
                  chartTitle = {"Requests By Type"}
                  categoryLabels = {"request_type"}
                  aggregationMethod = {"count"}
                  fillColor = {"#A9D18E"}
                  strokeColor = {"#70AD47"}
                  xAxisLabelRotation = {-90}
                  xAxisTextAnchor = {"end"}
                  xAxisXTextOffset = {-20}
                  xAxisYTextOffset = {30}
                  bottomMargin = {50}
                  xAxisLabelWrapWidth = {50}
                />
              </div>

              <div className="d-flex border border-1 bg-white justify-content-center rounded-3 shadow mb-3" style={{minWidth: 400, minHeight: 200}}>
                <ParetoChart 
                  chartWidth = {400}
                  chartHeight = {200}
                  tableName = {"requests"}
                  chartTitle = {"Requests By Type"}
                  categoryLabels = {"request_type"}
                  aggregationMethod = {"count"}
                  fillColor = {"#A9D18E"}
                  strokeColor = {"#70AD47"}
                  xAxisLabelRotation = {-90}
                  xAxisTextAnchor = {"end"}
                  xAxisXTextOffset = {-20}
                  xAxisYTextOffset = {30}
                  bottomMargin = {50}
                  xAxisLabelWrapWidth = {50}
                />
              </div>
              
            </div>

            {/* Show table container for large screen size */}
            {data.length>0 &&
            <div className="d-none d-md-flex flex-column p-3 border border-1 rounded-3 shadow bg-white" style={{height: "50vh", overflowY:"auto"}}>
              <Table 
                userData={appData.user_info}
                tableName={tableName}
                />
            </div>
            }

            {/* Show list container for small screen size */}
            {data.length>0 &&
            <div className="d-flex d-md-none justify-content-center flex-wrap" style={{height: "50vh", overflowY:"scroll"}}>
                <List
                  tableName={tableName}
                  userData={appData.user_info}
                />
            </div>
            }
        </div>
      </div>
      </div>
    </div>
  )
}

export default Requests