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

  const requestsByStage = [
    { label: 'Draft', value: 30 },
    { label: 'Category B', value: 50 },
    { label: 'Category C', value: 78 },
    { label: 'Category D', value: 80 },
    { label: 'Category E', value: 90 },
    { label: 'Category F', value: 95 },
    { label: 'Category G', value: 100 },
  ];

  const requestsByType = [
    { label: 'Purchase Requests', value: 30 },
    { label: 'Software Access', value: 28 },
    { label: 'IT Equipment', value: 22 },
    { label: 'Temporary Staff', value: 15 },
    { label: 'Contract', value: 10 },
    { label: 'Sourcing', value: 8 },
    { label: 'Budget', value: 3 },
    { label: 'IT Support', value: 2 },
    { label: 'HR Support', value: 2 },
    { label: 'Other', value: 1 }
  ];

 //create pareto data
//  const requestsByTypeParetoData = createParetoData(data=requestData, category='request_type', aggregation_type='count', field_to_aggregate="")
//  const requestsByStageParetoData = createParetoData(data=requestData,category='stage', aggregation_type='count',field_to_aggregate="")

  
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
        <div className="d-flex flex-column pe-0 ps-0 bg-light">

            <h1>Requests</h1>
            {/* Charts container */}
            <div className="d-flex d-md-none justify-content-center flex-wrap p-0" >
              <div className="flex-fill border border-1 p-2 bg-white" style={{minHeight: 300, minWidth: 400}}>
              <ParetoChart barData={[]} lineData={[]} chartWidth={200} chartHeight={300}/>
              </div>
            </div>

            <div className="d-none d-md-flex justify-content-between p-3" style={{minHeight:200, overflow:"auto"}}>
              <div className="flex-fill border border-1 rounded rounded-2 shadow p-2 m-3 bg-white" style={{minHeight: 300, minWidth: 400}}>
                
              </div>
              <div className="flex-fill border border-1 rounded rounded-2 shadow p-2 m-3 bg-white" style={{minHeight: 300, minWidth: 400}}></div>
              <div className="flex-fill border border-1 rounded rounded-2 shadow p-2 m-3 bg-white" style={{minHeight: 300, minWidth: 400}}></div>
            </div>
 
            {/* Show table container for large screen size */}
            {requestData.length>0 &&
            <div className="d-none d-md-flex flex-column p-3 shadow bg-white" style={{height: "50vh", overflowY:"auto"}}>
              <Table data={requestData} setData={setRequestData}/>
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