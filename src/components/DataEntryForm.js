import 'bootstrap/dist/css/bootstrap.min.css';
import React, {useState, useEffect, useRef, createRef} from 'react'
import { toProperCase } from './functions/formatValue.js';
import MultiInput from './MultiInput.js';
import {generalIcons} from './apis/icons'
import axios,{updateRecord, getRecord, getRecords, addRecord} from './apis/axios.js'
import Attachments from './Attachments.js';
import TableInput from './TableInput.js';
import { rootPath } from './apis/fileServer'

const DataEntryForm = (props) => {

    const formName= props.formName || "Form"
    const pageTitle= props.pageTitle || toProperCase(formName.replaceAll("_"," "))
    const tableName = props.tableName
    const recordId = props.recordId
    const userId = props.userId
    const updateParentStates = props.updateParentStates

    const [initialFormData, setInitialFormData] = useState({})
    const [formData, setFormData] = useState({})
    const [userData, setUserData] = useState({})

    const [sections, setSections] = useState([])
    const [formElements, setFormElements] = useState([]);
    const [dropdownLists, setDropdownLists] = useState([]);
    const [allowEdit, setAllowEdit] = useState(true)
    const [valueColor, setValueColor] = useState("#5B9BD5")
    const [inputFill, setInputFill] = useState("#F4F5F5")
    const [border, setBorder] = useState("1px solid rgb(235,235,235)")    
    const [initialData, setInitialData] = useState({})
    
    const [updatedData,setUpdatedData] = useState({})
    const [attachments, setAttachments] = useState([])
    const [lineItems, setLineItems] = useState([])

    const getFormData = async()=>{
      const params = {
        tableName: tableName,
        recordId: recordId,
        idField: "id",
      }
      const response = await getRecord(params)
      setInitialFormData(response)
      setFormData(response)
    }

    const getUserData = async()=>{
      const params = {
        tableName: "users",
        recordId: userId,
        idField: "id",
      }
      const response = await getRecord(params)
      setUserData(response)
    }

    const getFormFields = async () => {
      const params = {
        tableName: "forms",
        recordId: formName,
        idField: "ui_form_name",
      }

      try {
        const data = await getRecords(params)
        // console.log(data)

        // Saving the state.  This is always consistent.
        setFormElements(data);
        
        // Calling a function to dynamically pull multiple dropdown lists from db
        getDropDownLists(data) 

        //Get the sections data
        getSections(data)

      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    const getDropDownLists = async (data)=>{
      let tempDropdownLists = []

      if(data.length>0){
     
        data.map(item=> {
          
          if(item.ui_reference_data_table !==null && item.ui_reference_data_field !==null && (item.ui_component_type === "select" || item.ui_component_type === "table")){
            const getListItems = async (req, res)=>{
              
              try{
                const response = await axios.get(`/db/list/${item.ui_reference_data_table}/${item.ui_reference_data_field}`); 
                const listItems  = await response.data.data
                
                // Storing each drop down list in an object
                let listData = {name:`${item.ui_id}_list`, listItems: listItems}
                tempDropdownLists.push(listData)
  
                //Add each list to the array of dropdown lists
                setDropdownLists([...dropdownLists,...tempDropdownLists]);
              
              }catch(error){
                console.log(error)
              }
            }
            getListItems();
          }
        })
      }
    }
      
    const getSections = (data)=>{
      
      let sectionSet = new Set()
      data.map(items=>{
        sectionSet.add(items.ui_form_section)
      })

      let sectionList = []
      sectionSet.forEach(item=>{
        let visible = data.filter(r=>r.ui_form_section == item)[0].ui_section_visible
        sectionList.push({name: item, visible: visible})
      })

      setSections(sectionList)
    }

    const prepareAttachments = (fileData)=>{
        setAttachments([...attachments,...fileData])
        setFormData({...formData,...{["attachments"]:[...attachments,...fileData]}})
    }


    const uploadFiles = async () => {
      let fileData = attachments;
    
      const upload = async () => {
        const updatedFiles = await Promise.all(
          fileData.map(async (file) => {
            let fileName = file.name;
            let filePath = `${rootPath}/user_${userData.id}_${userData.first_name}_${userData.last_name}/${fileName}`;
            if (userData) {
              filePath = `${rootPath}/user_${userData.id}_${userData.first_name}_${userData.last_name}/${fileName}`;
            } else {
              filePath = rootPath;
            }
            const response = await axios.post(`/getS3FolderUrl`, { filePath: filePath });
            const url = await response.data.data
            const fileURL = await url.split('?')[0]
    
            await fetch(url, {
              method: "PUT",
              headers: {
                "Content-Type": file.type,
              },
              body: file.data,
            });
            return { ...file,...{["name"]:file.name, ["type"]:file.type,["size"]:file.size,["url"]:fileURL}};
          })
        );
      
        setAttachments([...attachments, ...updatedFiles]);
        
        let updatedDataWithAttachments={...updatedData,...{["attachments"]:updatedFiles}}
        setUpdatedData({...updatedData,...{["attachments"]:updatedFiles}})
        
        let formDataWithAttachments={...formData,...{["attachments"]:updatedFiles}}
        setFormData({ ...formData, ...{ ["attachments"]: updatedFiles } });
        return {formDataWithAttachments, updatedDataWithAttachments}
      };
    
      const output = await upload();
      return output;
    };
    

    const handleSave = async (req, res) => {

      if(JSON.stringify(initialData) !== JSON.stringify(formData)){

        // console.log("udated data...")
        // console.log(updatedData)

        //Gather any attachements that may have been added
        let recordToSendToDb = formData
        let updatesToSendToDb = updatedData

        if(JSON.stringify(updatedData).search("attachments")>0 && Object.keys(updatedData["attachments"]).length>0){
          const {formDataWithAttachments, updatedDataWithAttachments} = await uploadFiles()
          recordToSendToDb = formDataWithAttachments
          updatesToSendToDb = updatedDataWithAttachments
        }
        
        // Stringify all fields that hold arrays or javascript objects to flatting the data
        Object.keys(recordToSendToDb).map(key=>{
          if(Array.isArray(recordToSendToDb[key])){
            recordToSendToDb = {...recordToSendToDb, ...{[key]:JSON.stringify(recordToSendToDb[key])}}
          }
        })
        // console.log(recordToSendToDb)
     
        //update database table with updated record data
          const params = {
              tableName: tableName,
              recordId: recordId,
              idField: 'id',
              formData: recordToSendToDb
          }
          const updatedRecordFromDb= await updateRecord(params)
          // console.log(updatedRecordFromDb)

          let match = true
          // Verify that the record has been updated in the database
          Object.keys(recordToSendToDb).map(field=>{
              // console.log(`recordToSendToDb[field]: ${recordToSendToDb[field]}`)
              console.log(`updatedRecordFromDb[field]: ${updatedRecordFromDb[field]}`)
              if(recordToSendToDb[field] && updatedRecordFromDb[field] && recordToSendToDb[field]!=="record_created" && 
              recordToSendToDb[field].toString() !== updatedRecordFromDb[field].toString()){
                // console.log(`recordToSendToDb; ${JSON.stringify(recordToSendToDb[field])}`)
                // console.log(`updatedRecordFromDb: ${JSON.stringify(updatedRecordFromDb[field])}`)
                match=false
                return match
              }
          })
              
          if(match){

              setFormData(recordToSendToDb)
              setInitialData(recordToSendToDb)
              alert("Record updated")
              getFormData()

              // Update activity log
              const params = {
                tableName: "activities",
                columns: ["app","record_id","user","description"],
                values: [tableName,recordId,userData.email,JSON.stringify(updatesToSendToDb)]
              }
              const updateActivityLog = await addRecord(params)

              //Refresh UI in Parent object
              updateParentStates.forEach(func=>{
                func();
              })

              }
              else{
                  alert("Unable to update record. Please check inputs.")
              }
          }else{
              alert("Nothing to save.  Form is not was not edited")
          }
      }


    const iconStyle ={
      maxHeight: 30,
      maxWidth: 30,
      cursor: "pointer",
      marginLeft: 5
    }

    const handleChange = (e)=> {
      
      const {name, value} = e.target
      const elementName = name.name 
      // console.log({...updatedData,...{[elementName]:value}})
      setUpdatedData({...updatedData,...{[elementName]:value}})
      setFormData({...formData,...{[elementName]:value}})
    }


    const handleClick = (e)=> {}
    const handleBlur = (e)=> {}
    const handleHover = (e)=> {}
    const handleAddData= (e)=>{}
    const handleSubmit = (e)=>{}

    const editProps = ()=>{
      if(allowEdit){
          setInputFill("white")
          setValueColor("#5B9BD5")
          setBorder("1px solid rgb(235,235,235)")
      }else{
          setInputFill("#F8F9FA")
          setValueColor("black")
          setBorder("none")
      }
    }

    const sectionTitle = {
      fontSize: 20,
      marginBottom: 10
    }

    const sectionStyle = {
      border: "1px solid rgb(235,235,235)",
      borderRadius: 10,
      padding: 15,
      backgroundColor: "white",
      marginBottom: 40
    }

    const titleStyle={
      fontSize: 24,
      fontWeight: 'normal'
    }


    useEffect(()=>{
      getFormFields();
      getFormData();
      getUserData();
    },[props])
  

    useEffect(()=>{
      editProps()
    },[allowEdit])
    
const pageStyle={
  minWidth: 300
}

return(
  <div className="d-flex flex-column w-100 h-100 overflow-y-auto bg-light" style={pageStyle}>
      <div className="d-flex" style={titleStyle}>{pageTitle}</div>
      
      <form>
      {/* Button menu */}
      <div className="d-flex justify-content-end p-1">
          <img 
              src={allowEdit ? `${generalIcons}/lock_icon.png` : `${generalIcons}/edit_icon.png`} alt="Edit" 
              style={iconStyle} 
              onClick={(e)=>setAllowEdit(!allowEdit)}>    
          </img>
          <img 
            src={`${generalIcons}/save_icon.png`} 
            alt="Save" style={iconStyle} 
            onClick={(e)=>handleSave(e)}>
          </img>
          <img 
            src={`${generalIcons}/trash_icon.png`} 
            alt="Save" style={iconStyle} 
            onClick={(e)=>handleSave(e)}>
          </img>
      </div>

      <div className="d-flex flex-column" style={{height: "70vh", overflowY: "auto",overflowX: "hidden"}}>
        {sections.map((section, sectionIndex)=>(
          section.name  !==null && section.visible ? 
            <div key={sectionIndex}  className="d-flex flex-column shadow-sm" style={sectionStyle}>
              <div style={sectionTitle}>{toProperCase(section.name.replaceAll("_"," "))}</div>
                {
                  formElements.map((item,index)=>(
                    item.ui_form_section === section.name && item.ui_component_visible && (item.ui_component_type === "input" || item.ui_component_type=="select") && item.ui_input_type!=="file"?
                    <div key={index} className="d-flex flex-column mb-3">
                      <MultiInput
                      id={{id: item.ui_id, section: item.ui_form_section}} 
                      name={{name: item.ui_name, section: item.ui_form_section}}
                      className={item.ui_classname}
                      label={item.ui_label}
                      type={item.ui_input_type}
                      value={initialFormData[item.ui_id]}
                      valueColor = {item.ui_color}
                      inputFill = {item.ui_backgroundColor}
                      fill={item.ui_backgroundColor}
                      border={border}
                      readonly = {eval(item.ui_readonly) || !allowEdit}
                      disabled = {eval(item.ui_disabled) || !allowEdit}
                      onClick = {eval(item.ui_onclick)}
                      onChange = {eval(item.ui_onchange)}
                      onBlur = {eval(item.ui_onblur)}
                      onMouseOver = {eval(item.ui_onmouseover)}
                      onMouseLeave = {eval(item.ui_mouseLeave)}
                      list={dropdownLists.filter(l=>l.name===`${item.ui_id}_list`).length>0 && dropdownLists.filter(l=>l.name===`${item.ui_id}_list`)[0].listItems}
                      allowAddData = {item.ui_allow_add_data}       
                    />
                    </div>
                  : item.ui_form_section === section.name && item.ui_component_visible && item.ui_input_type=="file"?
                  <div key={index} className="d-flex flex-column mb-3">
                    <Attachments 
                      id={{id: item.ui_id, section: item.ui_form_section}} 
                      name={{name: item.ui_name, section: item.ui_form_section}}
                      onChange = {(e)=>handleChange(e)}
                      valueColor = {item.ui_color}
                      currentAttachments = {initialFormData.attachments}
                      prepareAttachments = {prepareAttachments}
                      userData = {userData}
                      readonly = {eval(item.ui_readonly) || !allowEdit}
                      disabled = {eval(item.ui_disabled) || !allowEdit}
                    />
                    </div>
                    : item.ui_form_section === section.name && item.ui_component_visible && item.ui_component_type=="table"?
                    <div key={index} className="d-flex flex-column mb-3">
                      <TableInput
                        id={{id: item.ui_id, section: item.ui_form_section}} 
                        name={{name: item.ui_name, section: item.ui_form_section}}
                        onChange = {(e)=>handleChange(e)}
                        valueColor = {item.ui_color}
                        valueSize = {item.ui_font_size}
                        valueWeight = {item.ui_font_weight}
                        valueFill = {item.ui_background_color}
                        initialTableData = {initialFormData[item.ui_id]}
                        list={dropdownLists.filter(l=>l.name===`${item.ui_id}_list`).length>0 && dropdownLists.filter(l=>l.name===`${item.ui_id}_list`)[0].listItems}
                        readonly = {eval(item.ui_readonly) || !allowEdit}
                        disabled = {eval(item.ui_disabled) || !allowEdit}
                      />
                    </div>
                    :
                  null
                ))}
            </div>
            :
            null
        ))}
      </div>
    </form>
    </div>
  )
  
}

export default DataEntryForm