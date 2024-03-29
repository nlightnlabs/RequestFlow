import React, {useState, useEffect, useContext, useRef, createRef} from 'react'
import { Context } from "./Context.js"
import {getTable} from './apis/axios.js'
import "bootstrap/dist/css/bootstrap.min.css"
import 'animate.css';
import SuperInput from './SuperInput.js'

const SourcingRequest = () => {

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
    requestTypes,
    setRequestTypes,
    initialFormData,
    setInitialFormData
} = useContext(Context)

useEffect(()=>{
  setPage(pages.filter(x=>x.name===pageName)[0])
  setPageList([...pageList,pageName])
  initializeItems()
  getCategories()
},[])

let formData = {}

  const [categoryData, setCategoryData] = useState([])
  const [categories, setCategories] = useState([])
  const [formClassList, setFormClassList] = useState("form-group")

  const formRef = useRef()
  const categoryRef = useRef()

  const [items, setItems] = useState([
    {category: "", products:""},
    {category: "", products:""},
    {category: "", products:""}
  ])
  const [showAddItemError, setShowAddItemError] = useState(false)

  const usernameRefs = useRef([]);
  usernameRefs.current = items.map(
      (ref, index) =>   usernameRefs.current[index] = createRef(index)
    )

    const initializeItems = ()=>{
      let x = JSON.stringify(Object.values(appData))
      if(x.search("items")>0){
        console.log("items found")
        setItems(appData[page.data]["items"])
      }
    }
 
  const getCategories = async ()=>{

    try{
      const response = await getTable('spend_categories')
      const data = await response.data
      setCategoryData(data)
  
      let categorySet = new Set()
        await data.forEach(item=>{
          categorySet.add(item.subcategory)
        })
        
        let categoryList = [...categorySet]
        setCategories(categoryList.sort())

    }catch(error){
      console.log(error)
    }
  }


  const handleChange = (e)=>{
    const {name, value} = e.target
    let new_data = {[name]: value}
    formData = {...appData[`${page.data}`],...new_data}
    setInitialFormData(formData)
    setAppData({...appData,[`${page.data}`]:formData})
  }

  let itemData = items
  const handleUserInput = (e, index)=>{
    let {name, value} = e.target
    if(name.search("category")>0){
      name = "category"
    }else if(e.target.id.search("products")>0)(
      name = "products"
    )
    let new_data = {[name]: value}
    itemData[index] =  {...itemData[index],...new_data}
    console.log(itemData)
    setItems(itemData)
    let request_details = {...appData.request_details,["items"]:itemData}
    setAppData({...appData, request_details})
  }

  const handleSubmit = async (e)=>{
    
    e.preventDefault();
    const form = e.target

    if(e.nativeEvent.submitter.name==="backButton"){
      setFormClassList("form-group")

      let pageListCopy = pageList
      let thisPage = pageListCopy.splice(-1)
      let nextPage = pageListCopy[pageListCopy.length-1]
      setPageList(pageListCopy)
      setPage(pages.filter(x=>x.name===nextPage)[0])
      setPageName(nextPage)

    }else{
        if(!form.checkValidity()){
          e.preventDefault();
        }else{
          let header_data = {
            subject: appData[`${page.data}`].subject,
            request_details: appData[`${page.data}`].details
          }
        
          let request_summary = {...appData.request_summary,...header_data}
          setAppData({...appData, request_summary})

          let nextPage = "Additional Info"
          setPage(pages.filter(x=>x.name===nextPage)[0])
          setPageList([...pageList,nextPage])
          setPageName(nextPage)
        }
    }
    setFormClassList('form-group was-validated')
}

const handleReset = ()=>{
  let formData={}
  setAppData({...appData, [`${page.data}`]:formData})
}

  const addIconStyle = {
    height: 30,
    width: 30,
    cursor: "pointer"
  }

  const removeIconStyle = {
    height: 30,
    width: 30,
    cursor: "pointer"
  }

  const addProduct = () =>{
    setPage("Add Product")
  }

  const addItem = (e, index) =>{
        const newRow={item:"",quantity:""}
        setItems([...items,newRow])
    }

  const removeItem = (e, index) =>{
    if(index>0){
      setItems(
        items.filter(item => items.indexOf(item) !== index)
      );
    }

  }

  

  const inputRequired = (index)=>{
    if(index==0){
      return {required: true}
    }
  }

  const addIcon = "https://nlightnlabs01.s3.us-west-1.amazonaws.com/icons/add_icon.png"
  const removeIcon = "https://nlightnlabs01.s3.us-west-1.amazonaws.com/icons/delete_icon.png"

  const [pageClass, setPageClass] = useState("container mt-5 animate__animated animate__fadeIn animate__duration-0.5s")
  
  const sectionTitleStyle={
    fontSize: 32,
    fontWeight: "normal",
    color: "#5B9BD5",
    marginBottom: 10
  }

  return (
    <div className = {pageClass}>
      <div className="row">
        <div className="col"></div>

        <div className="col-lg-6">
          
        <div style={sectionTitleStyle}>{pageName}</div>
          
          <div className="d-flex flex-column bg-light border shadow p-3 rounded-2 justify-content-center">
          
          <form name='form' id="form" onSubmit={handleSubmit} className = {formClassList} noValidate>
            
            {/* Button Group */}
            <div className="d-flex justify-content-center mb-3">
              <div className="d-flex w-100 justify-content-between">
                <button name= "backButton" className="btn btn-outline-secondary" style={{width:"100px"}} data-bs-toggle="button" type="submit">Back</button>
                <button name="nextButton" className="btn btn-primary" style={{width:"100px"}} data-bs-toggle="button" type="submit">Next</button>
              </div>
            </div>

            <div className="form-floating mb-3">
              <input id = "subject" name= "subject" className="form-control form-control text-primary" onChange={handleChange} value={initialFormData.subject} placeholder="Provide a subject or headline for this request" required></input>
              <label htmlFor="subject" className="form-label text-body-tertiary small">Summarize what you need</label>
            </div>

            <div className="form-floating mb-3">
              <textarea 
                id="details" 
                name="details" 
                className="form-control form-control text-primary" 
                rows="3" style={{height:"100%"}} 
                onChange={handleChange}
                value={initialFormData.details}
                placeholder="Please provide specific details for your request" 
                required
                >
              </textarea>
              <label htmlFor="details" className="form-label text-body-tertiary small">Describe what you need in detail</label>
            </div>

            <div className="form-group mb-3">
             <h5>List the categories and products or services you'd like to source</h5>
              <table className="table w-100 border rounded rounded-2">
                <thead>
                  <tr className="text-center text-small">
                    <th scope="col" style={{width: "45%"}}>Category</th>
                    <th scooe="Col" style={{width: "45%"}}>Specific Products or Services</th>
                    <th></th>
                  </tr>
                  <tr className="table-group-divider"></tr>
                </thead>
                <tbody className="table-group-divider text-small">
                  {items.map((item, index)=>(
                    <tr key={index} id={`user_${index}`} ref={usernameRefs.current[index]}>
                      <td>
                        <SuperInput
                          id={`item_${index}_category`}
                          name={`item_${index}_category`}
                          list={categories}
                          value={items[index].category}
                          valueColor="#2C7BFF"
                          onChange={handleChange} 
                          height={38}
                          required={inputRequired(index)}
                          />
                      </td>
                      <td><input id={`item_${index}_products`} name={`item_${index}_products`} className="form-control text-primary" style={{fontSize: 12}} type="text" onChange={(e)=>handleUserInput(e, index)} value={items[index].quantity}></input></td>
                      <td id={`remove_item_${index}`} className="small bg-second"><img src={removeIcon} style={removeIconStyle} onClick={(e)=>removeItem(e, index)}></img></td>
                    </tr>
                  ))}
                  <tr>
                    <td colSpan="2" className="small bg-second" style={{background:"none"}}><img src={addIcon} style={addIconStyle} onClick={(e)=>addItem(e)}>
                    </img>Add item</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="form-floating mb-3">
              <textarea 
                id="suppliers" 
                name="suppliers" 
                className="form-control form-control text-primary" 
                rows="2" style={{height:"100%"}} 
                onChange={handleChange}
                value={initialFormData.suppliers}
                placeholder="Please provide specific details for your request" 
                >
              </textarea>
              <label htmlFor="details" className="form-label text-body-tertiary small">List any suppliers you'd like to engage</label>
            </div>

           

            {/* <div className="d-flex justify-content-center">
              <div className="btn-group">
                <button name= "backButton" className="btn btn-outline-secondary w-25" data-bs-toggle="button">Back</button>
                <button name="nextButton" className="btn btn-primary w-25" data-bs-toggle="button" type="submit">Next</button>
              </div>
            </div> */}
          </form>

          </div>
        </div>
        
        <div className="col"></div> 
      </div>
    </div>
  )
}

export default SourcingRequest