import React, {useState, useContext, useEffect, useRef, useLayoutEffect} from 'react'
import {Context} from "./Context.js"
import "bootstrap/dist/css/bootstrap.min.css"
import 'animate.css';
import { appIcons } from './apis/icons.js';
import MultiInput from './MultiInput.js';
import { getTable } from './apis/axios.js';
import StatusListBox from './StatusListBox.js';

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
    apps,
    setApps,
    selectedApp,
    setSelectedApp
  } = useContext(Context)


  const [formData, setFormData] = useState({})
  const [newsData, setNewsData] = useState([])
  const [requests, setRequests] = useState([])

  // const [currentImageNumber, setCurrentImageNumber] = useState(0);
  const [highlightedNews, setHighlightedNews] = useState({});
  
  const getNewsData = async (req, res)=>{
    try{
        const response = await getTable("news")
          // console.log(response)
          setNewsData(await response.data)
          setHighlightedNews(response.data[0]);
    }catch(error){
        // console.log(error)
        setNewsData([])
    }
  }

  const getApps = async (req, res)=>{
    try{
        const response = await getTable("apps")
          setApps(await response.data)
    }catch(error){
        // console.log(error)
        setApps([])
    }
  }

  const getRequests = async (req, res)=>{
    try{
        const response = await getTable("requests")
        setRequests(await response.data)
    }catch(error){
        // console.log(error)
        setRequests([])
    }
  }

  const colors =[
    {status: "Draft", color: "rgba(200,200,200,1)"},
    {status: "Approved", color: "green"},
    {status: "Reviewing", color: "rgba(92,155,213,1)"},
    {status: "Hold", color: "orange"},
    {status: "Denied", color: "red"},
    {status: "Completed", color: "green"},
    {status: "New Document", color: "rgba(92,155,213,1)"},
    {status: "New Comment", color: "orange"},
    {status: "Cancelled", color: "red"}
]

  useEffect(()=>{
    getNewsData()
    getApps()
    getRequests()
},[])

  const handleSelect=(e)=>{
    const seletectedRequest=e.target.id
    const selectedRequestData = requestTypes.filter(x=>x.name===seletectedRequest)[0]
    setRequestType(selectedRequestData)

    let new_data = {
      requester: user,
      request_type: selectedRequestData.name
    }
    
    let formData = {...appData[`${page.data}`],...new_data}
    setAppData({...appData,[`${page.data}`]:formData})
    
    const nextPage = seletectedRequest
    setPage(pages.filter(x=>x.name===nextPage)[0])
    setPageList([...pageList,nextPage])
    setPageName(nextPage)
  }

  const goToMarket =(e)=>{
    const nextPage = "Market"
    setPage(pages.filter(x=>x.name===nextPage)[0])
    setPageList([...pageList,nextPage])
    setPageName(nextPage)
  }

  const gotToGenAI =(e)=>{
    const nextPage = "GenAIStudio"
    setPage(pages.filter(x=>x.name===nextPage)[0])
    setPageList([...pageList,nextPage])
    setPageName(nextPage)
  }

  const handleSelectedApp =(e,app)=>{
    
    const parentId = e.currentTarget.parentElement.id; 
    setSelectedApp(parentId)

    setTableName(apps.filter(row=>row.name==parentId)[0].db_table)

    const nextPage = app.default_component
    setPage(pages.filter(x=>x.name===nextPage)[0])
    setPageList([...pageList,nextPage])
    setPageName(nextPage)
  }


  const handleSelectedArticle =(articleId)=>{
    
    if (articleId>0){
      setAppData({...appData,...{["selected_article_id"]:articleId}})
      const nextPage = "News Article"
      setPage(pages.filter(x=>x.name===nextPage)[0])
      setPageList([...pageList,nextPage])
      setPageName(nextPage)
    }
  }
  
  

  
 // Effect to rotate images at equal intervals
 useEffect(() => {
    let intervalId;
    if (newsData.length > 0) {
      let index = 0;
  
      const rotateImages = () => {
        index = (index + 1) % newsData.length; // Increment index and reset to 0 when reaching the end  
        setHighlightedNews(newsData[index]);
      };

      // Set an interval to rotate images at 3-second intervals
      intervalId = setInterval(rotateImages, 3000);
    }

    // Clean up the interval when the component unmounts or when newsData changes
    return () => clearInterval(intervalId);
  }, [newsData]);

  const sectionTitleStyle={
    fontSize: 20,
    fontWeight: "normal",
    color: "#5B9BD5",
    marginBottom: 10
  }

  const iconStyle={
    maxHeight: 40,
    maxWidth: 40,
    cursor: "pointer"
  }

  const bannerRef = useRef()
  const [bannerWidth, setBannerWidth] = useState("100%")
  const [contentWidth, setContentWidth] = useState("100%")
  useEffect(()=>{
    setBannerWidth(bannerRef.current.clientWidth)
  },[bannerRef, newsData])

  useEffect(()=>{
    setContentWidth(bannerWidth)
  },[bannerWidth])

  const [imageClass, setImageClass] = useState("container animate__animated animate__fadeIn animate__duration-0.5s")
  const [pageClass, setPageClass] = useState("flex-container animate__animated animate__fadeIn animate__duration-0.5s")



  // This segment auto sizes the content height according to the window height
  const contentContainerRef = useRef();
  const [contentContainerHeight, setContentContainerHeight] = useState('');
  const [windowHeight, setWindowHeight] = useState(window.innerHeight);

  const handleContainerResize = () => {
    if (contentContainerRef.current) {
      const { top } = contentContainerRef.current.getBoundingClientRect();
      setContentContainerHeight(windowHeight - top-50);
    }
  };

  useEffect(() => {
    const handleResize = () => {
      setWindowHeight(window.innerHeight);
    };

    // Listen for window resize events
    window.addEventListener('resize', handleResize);

    handleContainerResize(); 

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [windowHeight]);


  useLayoutEffect(() => {
    
    // Recalculate container height on window resize
    window.addEventListener('resize', handleContainerResize);

    // Call initially to calculate height after render
    handleContainerResize(); 

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener('resize', handleContainerResize);
    };
  }, [windowHeight, contentContainerRef]);
  

return(
    <div className={pageClass}>

      <div className="d-flex justify-content-center mb-3">
        {<div className="d-flex justify-content-between" style={{width: "50%"}}>

          <div className="d-flex me-3 flex-column" onClick={(e)=>goToMarket(e)}>
                <img style={iconStyle} src={`${appIcons}/shopping_icon.png`}></img>
                <div style={{fontSize: 14, color: "gray"}}>Shop</div>
            </div>
            <div className="d-flex me-3 flex-column" onClick={(e)=>gotToGenAI(e)}>
                <img style={iconStyle} src={`${appIcons}/genAI_icon.png`}></img>
                <div style={{fontSize: 14, color: "gray"}}>GenAI</div>
            </div>

            <MultiInput
                valueSize={14}
                valueColor="#5B9BD5"
                label="Search"
                border={"2px solid lightgray"}
            />
        </div>}
    </div>
        
        
    <div className="d-flex justify-content-center p-0" style={{ margin: "0", padding: "0" }}>
      <div ref={bannerRef} className="carousel p-0 border border-1 rounded-3 bg-white shadow ms-2 me-2 mb-3 justify-content-center" 
      style={{ maxHeight: "300px", width: "100%", overflowY: "hidden", margin: "0", padding: "0", cursor: "pointer"}}>
          {newsData.length > 0 && (
              <img
                  src={highlightedNews.image_url}
                  alt={highlightedNews.headline}
                  className={imageClass}
                  style={{ width: "100%", height: "auto", margin: "auto", padding: "0", objectFit: "cover", display: "block" }}
                  onClick={(e)=>handleSelectedArticle(highlightedNews.id)}
              />
          )}
      </div>
  </div>

    <div className="d-flex justify-content-center">
    {
      <div ref={contentContainerRef} className="d-flex justify-content-between" style={{width: "100%", height:contentContainerHeight, minHeight:"300px"}}>
        
         {/* Request Something Panel*/}
        <div className="d-flex flex-column justify-content-around p-2 border border-1 rounded-3 bg-white shadow m-2" style={{height: "100%", width: "33%", minWidth:"300px", overflowY: "auto"}}>
            <div style={sectionTitleStyle}>Request Something</div>
            <div className="flex-fill bg-white flex-column overflow-y-scroll">
            {requestTypes.map((item, index)=>(
            <div key={index} id={item.name} className="d-flex border border-1 border-light shadow shadow-sm p-2 m-2" style={{cursor: "pointer", zIndex:7}} onClick={(e)=>handleSelect(e)}>
                <img  id={item.name} src={item.icon || "other_request_icon.png"} alt={`${item.name} icon`} style={{maxHeight: 30, maxWidth: 30}}></img>
                <div id={item.name} className="d-flex flex-column ps-3">
                    <div id={item.name} style={{fontSize: 14, fontWeight: 'bold'}}>{item.name}</div>
                    <div id={item.name}  style={{fontSize: 12, color: 'gray'}}>{item.description} </div>
                </div>
            </div>
            ))}
            </div>
        </div>

        {/* Request status panel */}
        <div className="d-flex flex-column justify-content-around p-2 border border-1 rounded-3 bg-white shadow m-2" style={{height: "100%", width: "33%", minWidth:"300px", overflowY: "auto"}}>
          <div style={sectionTitleStyle}>My Requests</div>
            <StatusListBox
                title="My Requests"
                data={requests}
                colors = {colors}
                buttonLabel = "New Request"
                listType = "status"
            />
        </div>

         {/* Work on Something Panel */}
        <div className="d-flex flex-column p-2 border border-1 rounded-3 bg-white shadow m-2" style={{height: "100%", width: "33%",minWidth:"300px", overflowY: "auto"}}>
            <div style={sectionTitleStyle}>Work on Something</div>
            <div className="d-flex justify-content-center flex-wrap">
            {
              apps.map((app,index)=>(
                <div id={app.name} className="d-flex flex-column m-3" style={{height: 50, width: 50, zIndex:100, cursor: "pointer"}} key={index}>
                    <img  src={`${appIcons}/${app.icon_url}`} alt={`${app.label} icon`} onClick={(e)=>{handleSelectedApp(e, app)}}></img>
                    <div style={{fontSize: 12, color: "gray"}} onClick={(e)=>{handleSelectedApp(e,app)}}>{app.label}</div>
                </div>
              ))
            }
            </div>
        </div>
            
        </div>
        }
    </div>
</div>
)
}

export default Home