import React, {useState, useEffect} from 'react'
import "bootstrap/dist/css/bootstrap.min.css"
import { generalIcons } from './apis/icons'

const StatusListBox = (props) => {

    
    const title = props.title

    //Data must have three fields: subject, status, and timestamp
    const data = props.data || []
    
    //Colors must have two fields: status, color
     const colors = props.colors || [
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
    const buttonLabel = props.buttonLabel

    // List type options should be status or actions
    const listType = props.listType || "status"

    const [fitlerWindowDisplay, setFilterWindowDisplay] = useState("none")
    const [sortWindowDisplay, setSortWindowDisplay] = useState("none")

  
    const iconStyle={
        maxHeight: 30,
        maxWidth: 30,
        marginLeft: 5,
    }
    
    const buttonStyle={
        fontSize: 14
    }
    
    const titleColor = {
        color: "#5B9BD5"
    }
    
    const getColor =(status)=>{
        
        try{
            const color = colors.filter(item=>item.status ===status)[0].color
            return color
        }catch(error){
            console.log(status)
            return "gray"
        }
    }
    
    const timeStampStyle = {
        display: "flex",
        justifyContent:"end",
        marginBottom: 5,
        color: "gray",
        fontSize: 12,
        padding: 2
    }

    const containerStyle={
        width: "100%",
        height: "100%",
        overflow: "hidden"
    }

    const headerStyle = {
        display: "flex",
        justifyContent: "space-between",
        height: "50px"
    }
    
    const headerButtonGroupStyle={
        display: "flex",
        justifyContent: "end"
    }
    
    const listBoxStyle = {
        display: "flex",
        flexDirection: "column",
        height: "450px",
        overflowY: "auto",
        overflowX: "hidden",
        padding: "5px",
        marginBottom: 20
    }
    
    const listItemStyle = {
        display: "flex",
        justifyContent: "space-between",
        minHeight: 50,
        padding: 5,
        border: "1px solid rgb(235,235,235)",
        borderRadius: 10,
        fontSize: 14,
        padding: 10,
        lineHeight:1.5,
        width: "100%"
    }

    const statusStyle={
        display: "flex", 
        width: "30%", 
        justifyContent: "end"
    }

    const filterWindowStyle={
        display: fitlerWindowDisplay
    }

    const sortWindowStyle={
        display: sortWindowDisplay
    }


    const handleFilter=()=>{

    }

    const handleSort=()=>{

    }

    const handleSubmit=()=>{
        
    }

    useEffect(()=>{

    },[props])

  return (
    <div style={containerStyle}>

    {/* Header */}
    <div style={headerStyle}>
        <h4 style={titleColor}>{title}</h4>
        <div style={headerButtonGroupStyle}>
            <img src={`${generalIcons}/filter_icon.png`} alt="filter" style={iconStyle} onClick={(e)=>handleFilter(e)}/>
            <img src={`${generalIcons}/sort_icon.png`} alt="sort" style={iconStyle} onClick={(e)=>handleSort(e)}/>
        </div>
    </div>


    {/* List Box */}
    <div style={listBoxStyle}>
        {data.map((item,index)=>(
        <div key={index} style={{display: "flex", flexDirection: "column", width: "100%"}}>
            { listType == "action"?
                <div style={{...listItemStyle,...{marginBottom: 10}}}>
                    <div style={{width: "70%"}}>{item.subject}</div>
                    <div className="btn-group btn-group-sm" style={{width: "25%"}}>
                        <button className="btn btn-outline-primary btn-sm p-0" style={{fontSize: 14, height: 28}}>Start</button>
                    </div>
                </div>
                :
                <>
                <div style={listItemStyle}>
                    <div style={{width: "55%"}}>{item.subject}</div>
                    <div style={{...statusStyle,...{color: getColor(item.status)}}}>{item.status}</div>
                </div>
                <div style={timeStampStyle}>{item.timestamp}</div>
                </>
            }
        </div>
        ))}
    </div>

    {
            listType=="status" &&
            <div style={{display: "flex", justifyContent: "end"}}>
                <button className="btn btn-primary" style={buttonStyle}>{buttonLabel}</button>
            </div>
        }


    {/* Menus */}
    <div style={filterWindowStyle}></div>
    <div style={sortWindowStyle}></div>
    </div>
  )
}

export default StatusListBox