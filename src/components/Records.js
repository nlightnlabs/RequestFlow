import React, {useState, useContext, useEffect, useRef} from 'react';
import {Context } from './Context.js';
import "bootstrap/dist/css/bootstrap.min.css"
import Table from './Table.js';
import List from './List.js';
import { getTable } from './apis/axios.js';
import { toProperCase } from './functions/formatValue.js';
import ParetoChart from './ParetoChar.js';

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
    setTables,
    apps,
    setApps,
    selectedApp,
    setSelectedApp,
  } = useContext(Context)

  const [data, setData] = useState([])
  const [fields, setFields] = useState([])
  const [windowWidth, setWindowWidth] = useState(window.innerWidth)
  const [showTable, setShowTable] = useState(true)
  const [showCharts, setShowCharts] = useState(true)

  const formName = apps.find(item=>item.name===selectedApp).edit_form_name || ""

  const chartsSectionRef = useRef(null)
  const [chartsSectionWindowSize, setChartsSectionWindowSize] = useState({})

  const getData = async (req, res)=>{
    console.log(tableName)
    const response = await getTable(tableName)
    console.log(response.data)

    setData(response.data.sort((a, b) => {
      return  b.id-a.id;
    }));
    setFields(Object.keys(response.data[0]))
}

useEffect(()=>{
  getData()
},[])

useEffect(()=>{
  setChartsSectionWindowSize({
    width: chartsSectionRef.current.clientWidth,
    height: chartsSectionRef.current.clientHeight,
  })
},[chartsSectionRef])

const chartContainerStyle={
  position: "sticky",
  top: 0,
  width: (chartsSectionWindowSize.width/3-20),
  height: 300,
  minWidth: 400, 
  minHeight: 300,
  margin: 5,
  overflowY: "fixed",
  overflowX: "auto"
}

const tableContainerStyle = {
  height: "100vh", 
  overflowY:"auto",
  padding: 20
}

const [pageClass, setPageClass] = useState("flex-container flex-column animate__animated animate__fadeIn animate__duration-0.5s")

  return (

    <div className={pageClass}>
        <div className="d-flex flex-column bg-light">
            
            <h2 className="ps-3">{toProperCase(tableName.replaceAll("_"," "))}</h2>
            {/* Charts container */}
            <div ref = {chartsSectionRef} className="d-flex justify-content-around" style={{height: "35vh", overflow: 'auto', backgroundColor:"rgb(220,220,220)"}}>
              <div className="d-flex border border-1 bg-white justify-content-center rounded-3 shadow m-3 w-md-100" style={chartContainerStyle}>
              
              </div>
              <div className="d-flex border border-1 bg-white justify-content-center rounded-3 shadow m-3 w-md-100" style={chartContainerStyle}>
              
              </div>
              <div className="d-flex border border-1 bg-white justify-content-center rounded-3 shadow m-3 w-md-100" style={chartContainerStyle}>
              
              </div>
            </div>

            {/* Show table container for large screen size */}
            {data.length>0 &&
            <div className="d-flex bg-light" style={tableContainerStyle}>
              <Table 
                userData={appData.user_info}
                tableName={tableName}
                formName={formName}
                />
            </div>
            }

            {/* Show list container for small screen size */}
            {data.length>0 &&
            <div className="d-flex d-md-none justify-content-center flex-wrap" style={{minHeight: "50%", overflowY:"scroll"}}>
                <List
                  tableName={tableName}
                  userData={appData.user_info}
                  formName={formName}
                />
            </div>
            }
        </div>
    </div>
  )
}

export default Requests