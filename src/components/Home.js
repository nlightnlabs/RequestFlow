import React, {useState, useContext, useEffect} from 'react'
import {Context} from "./Context.js"
import "bootstrap/dist/css/bootstrap.min.css"
import 'animate.css';


const Home = () => {

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
    users,
    setUsers,
    requestTypes,
    setRequestTypes,
    icons
  } = useContext(Context)



  const [formData, setFormData] = useState({})

  useEffect(()=>{
    console.log(appData)
    console.log(page)
    console.log(pageList)
},[])

  const handleSelect=(e)=>{
    const seletectedRequest=e.target.id
    const selectedRequestData = requestTypes.filter(x=>x.name===seletectedRequest)[0]
    setRequestType(selectedRequestData)

    let new_data = {
      requester: user,
      request_type: selectedRequestData.name,
    }
    
    let formData = {...appData[`${page.data}`],...new_data}
    console.log({...appData,[`${page.data}`]:formData})
    setAppData({...appData,[`${page.data}`]:formData})
    
    const nextPage = seletectedRequest
    setPage(pages.filter(x=>x.name===nextPage)[0])
    setPageList([...pageList,nextPage])
    setPageName(nextPage)
  }

  return (
    <div className = "animate__animated animate__fadeIn animate__duration-0.5s">
        <div className="container">
            <div>
              <div className="row">
                <div className="col"></div>
                <div className="col-lg-6">
                <h2 className="text-left">Select a common request type</h2>
                <div className="=flex-fill shadow shadow-lg rounded-top-2" style={{backgroundImage: "linear-gradient(45deg, rgb(9, 128, 243), rgb(0, 223, 255))", height:25}}></div>
                  <div className="d-flex bg-light shadow border border-1 rounded-bottom-2 p-3 flex-column justify-content-center">
                    <div className="flex-fill bg-white flex-column" style={{height:700, overflowY:"scroll"}}>
                    {requestTypes.map((item, index)=>(
                            <div key={index} id={item.name} className="d-flex border border-1 border-light shadow shadow-sm p-3" style={{cursor: "pointer", zIndex:7}} onClick={(e)=>handleSelect(e)}>
                              <img src={item.icon || "other_request_icon.png"} alt={`${item.name} icon`} style={{maxHeight: 50, maxWidth: 50}}></img>
                              <div className="d-flex flex-column ps-3">
                                <div id={item.name} style={{fontSize: 18, fontWeight: 'bold'}}>{item.name}</div>
                                <div id={item.name}  style={{fontSize: 14, color: 'gray'}}>{item.description} </div>
                              </div>
                            </div>
                    ))}
                    </div>
                  </div>
                </div>
                <div className="col"></div>
              </div>
            </div>
        </div>
    </div>
  )
}

export default Home