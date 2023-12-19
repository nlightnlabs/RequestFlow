import React, {useState, useContext, useEffect, useRef} from 'react';
import {Context } from './Context';
import "bootstrap/dist/css/bootstrap.min.css"
import axios from './axios.js'

const LandingPage = () => {


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
    icons
  } = useContext(Context)

const [requests, setRequests] = useState([])
const [tasks, setTasks] = useState([])
const [toDos, setToDos] = useState([])

const getRequests = async (req, res)=>{
    setUser('avik.ghosh@nlightnlabs.com')
    const query = `Select * from requests;`
    const params = {
        query: query
    }
    try{
        const response = await axios.get('/db/table/requests')
        const data = await response.data
        setRequests(data)
    }catch(error){
        console.log(error)
    }
}

const getTasks = async (req, res)=>{
    setUser('avik.ghosh@nlightnlabs.com')
    const query = `Select * from requests;`
    const params = {
        query: query
    }
    try{
        const response = await axios.get('/db/table/requests')
        const data = await response.data
        setTasks(data)
    }catch(error){
        console.log(error)
    }
}


useEffect(()=>{
    getRequests()
    getTasks()
},[])
 

  return (
    <div className="flex-container h-100 p-3">
        <div className="row p-3  flex-wrap" style={{height: "100%"}}>
           <div className="col-2 d-none d-md-flex flex-column">

            <div className="d-flex flex-column" style={{minWidth: 400}}>
                <div className="d-flex rounded-circle bg-light p-3" style={{height: 150, width: 150, overflow:"hidden"}}>
                    <img src={`${icons}/profile_icon.png`}></img>
                </div>
                <h2>Welcome John</h2>
                <h4>Sr. Product Manager</h4>
                <h6>Product Management</h6>
            </div>
                
           </div>
           <div className="col-12 col-md-8" style={{height: "100%"}}>
                <div className="d-flex flex-column bg-white shadow rounded-3 p-3" style={{height: "50%"}}>
                    <div className="d-flex flex-fill" style={{fontSize: 32, fontWeight: 'bold'}}>My Work</div>
                    <div className="d-flex flex-column" style={{height: "100%", overflowY:"auto"}}>
                        {tasks.map(task=>(
                            <div className="d-flex flex-column border border-1 m-1 p-3 rounded-3">
                                <h5 >{task.subject}</h5>
                                <div>{task.stage}</div>
                                <div>{task.status}</div>
                            </div>
                        ))}
                    </div>
                </div>

           </div>
        </div>
    </div>
  )
}

export default LandingPage