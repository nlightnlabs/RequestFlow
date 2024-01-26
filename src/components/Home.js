import React, {useState, useContext, useEffect, useRef, useLayoutEffect} from 'react'
import {Context} from "./Context.js"
import "bootstrap/dist/css/bootstrap.min.css"
import 'animate.css';
import { getTable, getRecords } from './apis/axios.js';


const Home = (props) => {

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
    appData,
    setAppData,
    attachments,
    setAttachments,
    pageList,
    setPageList,
    tableName,
    setTableName,
    users,
    setUsers,
    requestTypes,
    setRequestTypes,
    icons,
    selectedApp,
    setSelectedApp
  } = useContext(Context)

  
  useEffect(()=>{
    getRequests()
},[])

  const [requests, setRequests] = useState([])
  const getRequests = async (req, res)=>{

    try{
        const response = await getTable("requests")
        setRequests(response.data)

    }catch(error){
        console.log(error)
    }
  }

 
  const handleSelect=(e)=>{
    const seletectedRequest=e.target.id    
    const nextPage = seletectedRequest
    setPageName(nextPage)
  }
  

  const sectionTitleStyle={
    fontSize: 32,
    fontWeight: "normal",
    color: "#5B9BD5",
    marginBottom: 10
  }

  const iconStyle={
    maxHeight: 40,
    maxWidth: 40,
    cursor: "pointer"
  }

return(
    <div className="d-flex justify-content-center animate__animated animate__fadeIn animate__duration-0.5s">

        <div className="d-flex flex-column" style={{maxWidth: "600px", minWidth: "300px"}}>
          <div style={sectionTitleStyle}>Request Something</div>
          <div className="d-flex flex-column bg-light justify-content-center rounded-3 shadow p-3" style={{height: "100%"}}>
              <div className="flex-fill flex-column" style={{height: "600px", overflow: "auto"}}>
              {requestTypes.map((item, index)=>(
              <div key={index} id={item.name} className="d-flex bg-white border border-1 border-light shadow shadow-sm p-2 m-2" 
              style={{cursor: "pointer", zIndex:7}} onClick={(e)=>handleSelect(e)}>
                  <img  id={item.name} src={item.icon || "other_request_icon.png"} alt={`${item.name} icon`} style={{maxHeight: 30, maxWidth: 30}}></img>
                  <div id={item.name} className="d-flex flex-column ps-3">
                      <div id={item.name} style={{fontSize: 14, fontWeight: 'bold'}}>{item.name}</div>
                      <div id={item.name}  style={{fontSize: 12, color: 'gray'}}>{item.description} </div>
                  </div>
              </div>
              ))}
              </div>
          </div>
        </div>
 
</div>
)
}

export default Home