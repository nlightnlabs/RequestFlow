import React, {useState, useContext, useEffect, useRef} from 'react';
import {Context } from './Context';
import "bootstrap/dist/css/bootstrap.min.css"
import axios from './axios.js'
import Table from './Table.js';
import List from './List.js';
import ParetoChart from './ParetoChart.js'

import { createParetoData } from './dataAnalysis.js';

const Requests = () => {

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
  } = useContext(Context)

  const [requestData, setRequestData] = useState([])
  const [windowWidth, setWindowWidth] = useState(window.innerWidth)

  const getRequestData = async (req, res)=>{
    try{
      const response = await axios.get("/db/table/requests")
      const data = await response.data

      setRequestData(data.sort((a, b) => {
        return  b.id-a.id;
      }));

    }catch(error){
      console.log(error)
    }
  }

  
  useEffect(()=>{
    getRequestData()
  },[])

  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleWindowResize = () => {
      setWindowSize({
        width: window.innerWidth, 
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleWindowResize);

    return () => {
      window.removeEventListener('resize', handleWindowResize);
    };
  }, []);

  return (

    <div className="flex-container">
      <div className="row-sm p-0">
      <div className="col-sm-12 p-3">
        <div className="d-flex flex-column bg-light">

            <h1>Requests</h1>
            {/* Charts container */}
            <div className="d-flex flex-wrap justify-content-around p-3" >

              <div className="d-flex border border-1 bg-white justify-content-center rounded-3 shadow" style={{minWidth: 400, minHeight: 200}}>
                <ParetoChart 
                  chartWidth = {500}
                  chartHeight = {250}
                  tableName = {"requests"}
                  chartTitle = {"Requests By Stage"}
                  categoryLabels = {"stage"}
                  aggregationMethod = {"count"}
                />
              </div>

              <div className="d-flex border border-1 bg-white justify-content-center rounded-3 shadow" style={{minWidth: 400, minHeight: 200}}>
                <ParetoChart 
                  chartWidth = {500}
                  chartHeight = {250}
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

              <div className="d-flex border border-1 bg-white justify-content-center rounded-3 shadow" style={{minWidth: 400, minHeight: 200}}>
                <ParetoChart 
                 chartWidth = {500}
                 chartHeight = {250}
                  tableName = {"requests"}
                  chartTitle = {"Requests By Stage"}
                  categoryLabels = {"stage"}
                  aggregationMethod = {"count"}
                />
              </div>


            </div>


 
            {/* Show table container for large screen size */}
            {requestData.length>0 &&
            <div className="d-none d-md-flex flex-column p-3 border border-1 rounded-3 shadow bg-white" style={{height: "50vh", overflowY:"auto"}}>
              <Table data={requestData}/>
            </div>
            }

            {/* Show list container for small screen size */}
            {requestData.length>0 &&
            <div className="d-flex d-md-none justify-content-center flex-wrap p-3" style={{height: "50vh", overflowY:"scroll"}}>
              <List data={requestData}/>
            </div>
            }

        </div>
      </div>
      </div>
    </div>
  )
}

export default Requests