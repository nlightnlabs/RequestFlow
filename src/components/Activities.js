import React, {useState, useEffect, useRef} from 'react'
import "bootstrap/dist/css/bootstrap.min.css"
import { getData } from './apis/axios'
import { toProperCase } from './functions/formatValue'
import {UTCToLocalTime} from './functions/time'
import { generalIcons } from './apis/icons'

const Activities = (props) => {

  const data = props.activities
  const tableName = props.tableName || ""
  const recordId = props.recordId || ""
  const [activities, setActivities] = useState(props.activities)

  const windowSize =useRef()

  useEffect(()=>{
    setActivities(data)
  },[props])

  //function to return data from db as JSON or string
  const dataFormat=(text)=>{
    try{
     return JSON.parse(text)
   }catch(error){
     return text.toString()
   }
 }

 const iconStyle ={
  maxHeight: 30,
  maxWidth: 30,
  cursor: "pointer",
  marginLeft: 5
}

 const titleStyle={
  fontSize: 24
}

const handleSort = ()=>{

}

const handleFilter = ()=>{

}

  return (
    <div className="d-flex flex-column bg-light flex-fill" style={{height: "75%"}}>
      <div style={titleStyle}>Activities</div>
            <div className="d-flex justify-content-end p-1">
                <img 
                    src={`${generalIcons}/sort_icon.png`} alt="Sort"
                    style={iconStyle} 
                    onClick={(e)=>handleSort(e)}>    
                </img>
                <img 
                  src={`${generalIcons}/filter_icon.png`} 
                  alt="Filter" style={iconStyle} 
                  onClick={(e)=>handleFilter(e)}
                  ></img>
            </div>

      <div className="d-flex flex-column" style={{maxHeight: "75%", overflowY: "auto"}}>

        { typeof activities =="object" && activities.length>0?
        activities.map((item,index)=>(
        <div key={index} className="d-flex flex-column bg-light mb-3" >
          <div className="d-flex flex-fill text-secondary p-1" style={{fontSize: 12}}>{(`${item.first_name} ${item.last_name}`)|| item.user}</div> 
          
          <div className="d-flex flex-column bg-white border border-1 p-2 rounded-3 shadow-sm" style={{fontSize: 14, lineHeight: 1.5}}>
              {
              typeof dataFormat(item.description)=="object"? 
                Object.keys(dataFormat(item.description)).map((field, index)=>(
                  <div key={index}>
                    <span style={{fontWeight: 'bold', color: "#70AD47"}}>{`${toProperCase(field.replaceAll("_"," "))}`}</span>
                    <span style={{color: 'gray'}}> updated to </span>
                    <span style={{fontWeight: 'bold', color: "#5B9BD5"}}>{`${(dataFormat(item.description))[field]}`}</span>
                  </div>
                ))
                :
                <div key={index}>
                    <span style={{fontWeight: 'normal'}}>{`${toProperCase(dataFormat(item.description).replaceAll("_"," "))}`}</span>
                </div>
              }
          </div>
          <div className="d-flex flex-fill text-secondary p-1 justify-content-end" style={{fontSize: 12}}>{`${UTCToLocalTime(item.timestamp)}`}</div> 
        </div>
        ))
        :
        <div className="d-flex justify-content-center justify-content-start" style={{fontSize: 16, height: "80"}}>No activities logged to this record</div>
        }
      </div>
    </div>
  )
}

export default Activities