import React, {useState, useContext, useEffect, useRef} from 'react'
import { useNavigate } from 'react-router';
import {Context} from "./Context.js"
import "bootstrap/dist/css/bootstrap.min.css"
import 'animate.css';
import { appIcons, generalIcons } from './apis/icons.js';
import MultiInput from './MultiInput.js';
import { getTable, getList } from './apis/axios.js';
import StatusListBox from './StatusListBox.js';

const LandingPage = (props) => {

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
  const [ads, setAds] = useState([])
  const [highlightedAd, setHighlightedAd] = useState({});

  const [catalogItems, setCatalogItems] = useState([]);
  const [categories, setCategories] = useState([])
  const [businesses, setBusinesses] = useState([])
  const [subCategories, setSubcategories] = useState([])
  const [orderItems, setOrderItems] = useState([])
  const [cart, setCart] = useState([])
  const [totalAmount, setTotalAmount] = useState("")
  const [totalItems, setTotalItems] = useState("")

  
  const itemsContainerRef = useRef()
  const [itemsContainerWidth, setItemsContainerWidth] = useState("80%")
  useEffect(()=>{
    setItemsContainerWidth(itemsContainerRef.current.clientWidth)
  },[itemsContainerRef])
  
  const getAds = async (req, res)=>{
    try{
        const response = await getTable("ads")
        if(response.data.length>0){
          setAds(response.data)
          setHighlightedAd(response.data[0]);
        }
    }catch(error){
        // console.log(error)
        setAds([])
    }
  }

  const getCatalogItems = async (req, res)=>{
    try{
      const response = await getTable("catalog_items")
      if(response.data.length>0){
        setCatalogItems(response.data)
        
        let orderItemsWithQuantity = []
        response.data.map(item=>{
          orderItemsWithQuantity.push({...item,...{["quantity"]:0},...{["amount"]:0}})
        })
       
        setOrderItems(orderItemsWithQuantity)
      }
    }catch(error){
        // console.log(error)
        setCatalogItems([])
    }
  }
  

  const getCategories = async (req, res)=>{
    try{
        const response = await getList("spend_categories","category")
        if(response.length>0){

          setCategories(response)
        }
    }catch(error){
        // console.log(error)
        setCategories([])
    }
  }

  const getBusinesses = async (req, res)=>{
    try{
        const response = await getList("businesses","name")
        if(response.length>0){
          setBusinesses(response)
        }
    }catch(error){
        // console.log(error)
        setBusinesses([])
    }
  }



  useEffect(()=>{
    getAds()
    getCatalogItems()
    getCategories()
    getBusinesses()
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

  const handleAddToCard = (e,item, index)=>{
    console.log(cart.find(record=>record.id=item.id))
    let updatedCart = cart
    if(cart.find(record=>record.id=item.id)){
      let existingItem = cart.find(record=>record.id=item.id)
      let updatedItem = {...existingItem,...item}
      updatedCart[index] = updatedItem
    }else{
      updatedCart = [...cart,item]
    }

    setCart(updatedCart)
    setTotalItems(updatedCart.length)
    let total = 0;
    updatedCart.map(item=>{
      total = (Number(total)+Number(item.amount)).toFixed(2)
    })
    setTotalAmount(total)
  }

  const handleQuantityChange = (e, item, index)=>{
    const quantity = Number(e.target.value)
    const price = Number(item.price)
    const amount = quantity*price.toFixed(2)

    let tempOrderItems = orderItems
    tempOrderItems.filter(record=>record.id == item.id)[0].quantity = quantity
    tempOrderItems.filter(record=>record.id == item.id)[0].amount = amount
    console.log(tempOrderItems[index])
    setOrderItems(tempOrderItems)
  }


  const goToGPT =(e)=>{
    const nextPage = "Gen AI Studio"
    setPage(pages.filter(x=>x.name===nextPage)[0])
    setPageList([...pageList,nextPage])
    setPageName(nextPage)
  }


  const navigateTo = useNavigate()
  const handleSelectedAd =(adId)=>{
    if (adId>0){
      setAppData({...appData,...{["selected_ad_id"]:adId}})
      navigateTo(ads[adId].supplier_website)
    }
  }
  

 // Effect to rotate images at equal intervals
 useEffect(() => {
    let intervalId;
    if (ads.length > 0) {
      let index = 0;
  
      const rotateImages = () => {
        index = (index + 1) % ads.length; // Increment index and reset to 0 when reaching the end  
        setHighlightedAd(ads[index]);
      };

      // Set an interval to rotate images at 3-second intervals
      intervalId = setInterval(rotateImages, 3000);
    }

    // Clean up the interval when the component unmounts or when newsData changes
    return () => clearInterval(intervalId);
  }, [ads]);

  const sectionTitleStyle={
    fontSize: 20,
    fontWeight: "normal",
    color: "#5B9BD5",
    marginBottom: 10
  }

  const iconStyle={
    maxHeight: 30,
    maxWidth: 30,
    cursor: "pointer"
  }

  const bannerRef = useRef()
  const [bannerWidth, setBannerWidth] = useState("100%")
  const [contentWidth, setContentWidth] = useState("100%")
  useEffect(()=>{
    setBannerWidth(bannerRef.current.clientWidth)
  },[bannerRef, ads])

  useEffect(()=>{
    setContentWidth(bannerWidth)
  },[bannerWidth])

  const itemCardStyle = {
    width: "30%",
    margin: "5px",
    border: "1px solid lightgray",
    borderRadius: "10px",
    padding: "15px"
  }

  const itemImageStyle = {
    height: "100%",
    width: "auto"
  }

  const itemNameStyle = {
    fontSize: "18px",
    fontWeight: "bold"
  }

  const itemSupplierStyle = {
    fontSize: "14px",
    fontWeight: "bold",
    color: "#5B9BD5"
  }

  const itemPriceStyle = {
    fontSize: "18px",
    fontWeight: "bold",
    color: "#70AD47"
  }


  const itemRatingStyle = {
    fontSize: "12px",
    color: "orange"
  }

  const itemDescriptionStyle = {
    fontSize: "12px",
    color: "gray"
  }

  const itemQuantityInStockStyle = {
    fontSize: "14px",
    color: "black"
  }

  const itemLeadTimeStyle = {
    fontSize: "14px",
    color: "black"
  }

  const iconButtonStyle = {
    maxHeight: "30px",
    maxWidth: "30px"
  }

  const quantityInputStyle={
    fontSize: "12px",
    color: "gray",
    border: "1px solid lightgray",
    borderRadius: "5px",
    width: "50px",
    outline: "none",
    color: "blue",
    textAlign: "center"
  }

  

const [pageClass, setPageClass] = useState("flex-container animate__animated animate__fadeIn animate__duration-0.5s")

return(
    <div className={pageClass} style={{width: "100vw", overflowX: "hidden"}}>
        
        <div className="d-flex justify-content-center p-0" style={{width:"100%", margin: "0", padding: "0" }}>
          <div ref={bannerRef} className="carousel p-0 border border-1 rounded-3 bg-white shadow mb-3 justify-content-center" 
          style={{maxHeight: "300px", width: "80%", overflowY: "hidden", margin: "0", padding: "0", cursor: "pointer"}}>
              {ads.length > 0 && (
                  <img
                      src={highlightedAd.image_url}
                      alt={highlightedAd.headline}
                      className={highlightedAd}
                      style={{ width: "100%", height: "auto", margin: "0", padding: "0", objectFit: "cover", display: "block" }}
                      onClick={(e)=>handleSelectedAd(highlightedAd.id)}
                  />
              )}
          </div>
      </div>

      <div className="d-flex justify-content-center" style={{width: "100%"}}>
        <div className="d-flex justify-content-between" style={{width: "100%"}}>
            <div 
              className="d-flex flex-column bg-light border border-1 rounded-3 shadow p-3"
              style={{width: "15%", minWidth:"250px", fontSize: "12px"}}
              > 
                <div className = "d-flex flex-column">
                  <img src={`${generalIcons}/filter_icon.png`}  style={iconStyle} alt="Shopping Cart Icon"></img>
                  <div className="d-flex flex-column mb-1">
                      Category <MultiInput list={categories}/>
                  </div>

                  <div className="d-flex flex-column mb-1">
                      Subcategory <MultiInput list={categories}/>
                  </div>

                  <div className="d-flex flex-column mb-1">
                      Supplier <MultiInput list={businesses}/>
                  </div>

                  Price 
                  <div className="d-flex flex-column mb-1 border border-1 rounded-3 p-2">
                      <div className="d-flex p-1">
                          <span>Low: <MultiInput /></span>
                          <span>High: <MultiInput /></span>
                      </div>
                  </div>

                  <div className="d-flex flex-column mb-1">
                      Quantity In Stock <MultiInput />
                  </div>

                  <div className="d-flex flex-column mb-1">
                      Lead Time <MultiInput />
                  </div>
                </div>

            </div>

            
            <div 
              ref={itemsContainerRef}
              className="d-flex ms-3 p-2 justify-content-around bg-light border border-1 rounded-3 shadow flex-wrap responsive"
              style={{fontSize: "12px"}}
              > 
       
              {orderItems.length>0 &&
                orderItems.map((item,index)=>(
                  <div className="d-flex flex-column bg-white shadow-sm" style={itemCardStyle}>
                      
                        <div className="d-flex bg-light justify-content-end">
                          <label className="d-flex"  style={{height: "30px", paddingTop:"7px", fontSize: "10px", color: "gray"}} >Quantity:</label>
                          <input name={`item_${item.id}_quantity`} style={quantityInputStyle} onChange={(e)=>handleQuantityChange(e, item, index)}></input>
                          
                          <label className="d-flex"  style={{height: "30px", paddingTop:"7px", fontSize: "10px", color: "gray"}} >Add to cart: </label>
                          <img src={`${appIcons}/add_icon.png`} style={iconButtonStyle} onClick={(e)=>handleAddToCard(e,item, index)}/>
                        </div>
                     
                      <div style={{height: "100px"}}>
                        { item.image? 
                          <img src={item.image} style={itemImageStyle}></img>
                          : 
                          <span style={{fontSize: "12px", color: "gray"}}>No image available</span>
                        }
                      </div>              
                      <div style={itemNameStyle} >{item.item_name}</div>
                      <div style={itemSupplierStyle} >{item.supplier}</div>
                      <div style={itemLeadTimeStyle}>{item.lead_time}</div>
                      <div style={itemPriceStyle} >${item.price} <span style={{color: "gray", fontSize:"10px", fontWeight: "normal"}}>/ {item.unit_of_measure}</span></div>
                      <div style={itemRatingStyle}>{item.rating}</div>
                      <div style={itemQuantityInStockStyle}>{item.quantity_in_stock} in stock</div>
                  </div>
                ))
              }
             
            </div>

            <div className="d-flex flex-column bg-light border border-1 rounded-3 shadow ms-3 p-3" style={{width: "25%", minWidth: "300px"}}>
                <img src={`${appIcons}/shopping_icon.png`} style={iconStyle} alt="Shopping Cart Icon"></img>
                <div className="d-flex w-100 flex-column justify-content-between">
                  {totalItems > 0 ? <div className="d-flex justify-content-end fw-bold" style={{fontSize: "16px"}}>{totalItems} item{totalItems>1?"s":""}</div> : null }
                  {totalAmount > 0 ? <div className="d-flex justify-content-end fw-bold" style={{fontSize: "16px"}}>${totalAmount} total</div> : null }
                  <button className="btn btn-primary">Check Out</button>
                  <div className="d-flex flex-column" style={{overflow:"hidden", fontSize: "12px"}}>  
                    {cart.length>0 ?
                    <table className="table table-border p-0">
                      <thead>
                          <tr>
                              <td>Item</td>
                              <td>Price</td>
                              <td>Quantity</td>
                              <td>Amount</td>
                            </tr>
                      </thead>
                    <tbody>
                     {cart.map((item,index)=>(
                          <tr>
                              <td>{item.item_name}</td>
                              <td>{item.price}</td>
                              <td>{item.quantity}</td>
                              <td>{item.amount}</td>
                            </tr>
                     ))}
                     </tbody>
                    </table>
                    :
                    <div className="text-center" style={{color: "gray"}}>Nothing in cart</div>
                    }
                  </div>
                </div>
            </div>
        </div>
      </div>
    </div>
)
}

export default LandingPage