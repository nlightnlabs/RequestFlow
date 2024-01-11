import React, {useState, useContext, useEffect, useRef, useLayoutEffect} from 'react'
import { useNavigate } from 'react-router';
import {Context} from "./Context.js"
import "bootstrap/dist/css/bootstrap.min.css"
import 'animate.css';
import { appIcons, generalIcons } from './apis/icons.js';
import MultiInput from './MultiInput.js';
import { getTable, getList } from './apis/axios.js';
import StatusListBox from './StatusListBox.js';

const Market = (props) => {

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
  const [starRatings, setStarRatings] = useState([
    `${String.fromCharCode(9733)}`,
    `${String.fromCharCode(9733)}${String.fromCharCode(9733)}`,
    `${String.fromCharCode(9733)}${String.fromCharCode(9733)}${String.fromCharCode(9733)}`,
    `${String.fromCharCode(9733)}${String.fromCharCode(9733)}${String.fromCharCode(9733)}${String.fromCharCode(9733)}`,
    `${String.fromCharCode(9733)}${String.fromCharCode(9733)}${String.fromCharCode(9733)}${String.fromCharCode(9733)}${String.fromCharCode(9733)}`
  ])
  const [orderItems, setOrderItems] = useState([])
  const [cart, setCart] = useState([])
  const [totalAmount, setTotalAmount] = useState("")
  const [totalItems, setTotalItems] = useState("")
  const [orderForm, setOrderForm] = useState({})

  
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
        setUpOrderItems(response.data)
      
      }
    }catch(error){
        // console.log(error)
        setCatalogItems([])
    }
  }

  const setUpOrderItems = (catalogItems)=>{
    let orderItemsWithQuantity = []
      catalogItems.map(item=>{
        orderItemsWithQuantity.push({...item,...{["quantity"]:0},...{["amount"]:0}})
      })
      setOrderItems(orderItemsWithQuantity)
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
    const amount = (quantity*price).toFixed(2)

    let tempOrderItems = orderItems
    tempOrderItems.filter(record=>record.id == item.id)[0].quantity = quantity
    tempOrderItems.filter(record=>record.id == item.id)[0].amount = amount
    console.log(tempOrderItems[index])
    setOrderItems(tempOrderItems)
  }

  const handleSelectedAd =(adId)=>{
    console.log(adId)
    const supplierWebsite = ads.filter(ad=>ad.id===adId)[0].supplier_website

    if (adId>0){
      setAppData({...appData,...{["selected_ad_id"]:adId}})
      // window.location.href = `https://${ads[adId].supplier_website}`
      const externalSiteURL = `https://${supplierWebsite}`
      const windowFeatures = 'width=800,height=600,resizable,scrollbars=yes';
  
      // Open the new window
      window.open(externalSiteURL, '_blank', windowFeatures);
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


  const handleFilterChange = (e)=>{
    const {name, value} = e.target
    if(name.length>0 && value.length>0){
      setOrderItems(orderItems.filter(item=>item[name]===value))
    }else{
      setOrderItems(orderItems)
    }
  }

  const [checkoutWindow, setCheckoutWindow] = useState(false)
  const [orderSummaryWindow, setOrderSummaryWindow] = useState(false)
  
  const handleSubmitOrder = async(req, res)=>{
    setOrderForm({...orderForm,...{['order_items']:cart}})
    setCheckoutWindow(false)
    setOrderSummaryWindow(true)
    console.log({...orderForm,...{['order_items']:cart}})
  }

  const handleReviewOrders=(e)=>{
    setOrderSummaryWindow(false)
    resetCart()
    setSelectedApp("orders")
    setTableName("orders")
    let nextPage = "Records"
    setPageList([nextPage])
    setPage(pages.filter(x=>x.name===nextPage)[0])
    setPageName(nextPage)
  }

  const resetCart= ()=>{
    setCart([])
    setUpOrderItems(catalogItems)
    setTotalAmount("")
    setTotalItems("")
    setOrderForm({})
    setCheckoutWindow(false)
    setOrderSummaryWindow(false)
  }

  const handleOrderAgain=(e)=>{
    resetCart()
  }

  const handleChange=(e)=>{
    const {name, value} = e.target
    setOrderForm({...orderForm,...{[name]:value}})
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

  const itemCardStyle = {
    width: "30%",
    margin: "5px",
    border: "1px solid lightgray",
    borderRadius: "10px",
    padding: "15px"
  }

  const itemImageStyle = {
    maxHeight: "100%",
    maxWidth: "100%"
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
    color: "black"
  }

  const itemSavingsStyle = {
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

  const cartInputStyle={
    border: "1px solid lightgray",
    maxWidth: "50px",
    outline: "none",
    textAlign: 'right',
    color: 'blue',
    borderRadius: "5px"
  }

  const cartCellStyle={
    textAlign: 'right'
  }


  // This segment auto sizes the content height according to the window height
    const contentContainerRef = useRef();
    const [contentContainerHeight, setContentContainerHeight] = useState('');
    const [windowHeight, setWindowHeight] = useState(window.innerHeight);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);


    const handleResize = () => {
      setWindowHeight(window.innerHeight);
      setWindowWidth(window.innerWidth);
    };
    
    const handleContainerResize = () => {
      if (contentContainerRef.current) {
        const { top } = contentContainerRef.current.getBoundingClientRect();
        setContentContainerHeight(windowHeight - top);
      }
    };

    useEffect(() => {
    
      // Listen for window resize events
      window.addEventListener('resize', handleResize);

      handleResize()
      handleContainerResize()
  
      // Clean up the event listener on component unmount
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }, []);
  
    useLayoutEffect(() => {

      // Recalculate container height on window resize
      window.addEventListener('resize', handleContainerResize);

      handleResize()
  
      // Call initially to calculate height after render
      handleContainerResize(); 
  
      // Clean up the event listener on component unmount
      return () => {
        window.removeEventListener('resize', handleContainerResize);
      };
    }, [windowHeight, contentContainerRef]);


const [pageClass, setPageClass] = useState("flex-container animate__animated animate__fadeIn animate__duration-0.5s")

return(
    <div className={pageClass} style={{width: "100vw", overflowX: "hidden"}}>
        
      <div className="d-flex justify-content-center p-0" style={{width:"100%", margin: "0", padding: "0" }}>
        <div ref={bannerRef} className="carousel p-0 border border-1 rounded-3 bg-white shadow mb-3 justify-content-center" 
        style={{width:"50%", overflowY: "hidden", margin: "0", padding: "0", cursor: "pointer"}}>
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

      <div ref={contentContainerRef} className="d-flex justify-content-center" style={{width: "100%", height:contentContainerHeight}}>

        <div className="d-flex flex-column" style={{width: "100%", height:"100%", overflowY:"hidden"}}>
            <div 
              className="d-flex justify-content-center bg-light border border-1 rounded-3 shadow p-2 m-3"
              style={{width: "100%", fontSize: "12px"}}
              > 
                  <div className="d-flex m-2">
                      <img src={`${generalIcons}/filter_icon.png`}  style={{...iconStyle,...{['marginTop']:"15px"}}} alt="Shopping Cart Icon"></img>
                  </div>
                  <div className="d-flex flex-column m-2" style={{width:"250px"}}>
                      <span style={{color: "gray"}}>Category</span>
                      <MultiInput id="category" name="category" valueColor="#5B9BD5" valueSize="12px" valueWeight="bold" list={categories} onChange={(e)=>handleFilterChange(e)}/>
                  </div>

                  <div className="d-flex flex-column m-2" style={{width:"250px"}}>
                      <span style={{color: "gray"}}>Subcategory</span>
                      <MultiInput id="subcategory" name="subcategory" valueColor="#5B9BD5" valueSize="12px" valueWeight="bold" list={categories} onChange={(e)=>handleFilterChange(e)}/>
                  </div>

                  <div className="d-flex flex-column m-2" style={{width:"250px"}}>
                      <span style={{color: "gray"}}>Supplier</span>
                      <MultiInput id="supplier" name="supplier" valueColor="#5B9BD5" valueSize="12px" valueWeight="bold" list={businesses} onChange={(e)=>handleFilterChange(e)}/>
                  </div>

                  <div className="d-flex flex-column ms-2 me-2">
                    <span className="ps-2" style={{color: "gray"}}>Price</span> 
                    <div className="d-flex justify-content-between border border-1 rounded-3 p-1">
                        
                        <span className="d-flex justify-content-between m-2" style={{color: "gray", width:"100px"}}>
                        <span style={{color: "gray", margin: "6px"}}>Low: </span> 
                          <MultiInput id="low_price" name="low_price" type="number" valueColor="#5B9BD5" valueSize="12px" valueWeight="bold" onChange={(e)=>handleFilterChange(e)}/>  
                        </span>
                        
                        <span className="d-flex justify-content-between m-2" style={{color: "gray", width:"100px"}}>
                          <span style={{color: "gray", margin: "6px"}}>High: </span> 
                          <MultiInput id="high_price" name="high_price" type="number" valueColor="#5B9BD5" valueSize="12px" valueWeight="bold" onChange={(e)=>handleFilterChange(e)}/>
                        </span>
                    
                    </div>
                  </div>

                  <div className="d-flex flex-column m-2" style={{width: "150px"}}>
                      <span style={{color: "gray"}}>Minimm Rating</span> 
                      <MultiInput id="rating" name="rating" list={starRatings} valueColor="#5B9BD5" valueSize="12px" valueWeight="bold" onChange={(e)=>handleFilterChange(e)}/>
                  </div>

                  <div className="d-flex flex-column m-2" style={{width: "150px"}}>
                      <span style={{color: "gray"}}>Quantity In Stock</span> 
                      <MultiInput id="quantity_in_stock" name="quantity_in_stock" type="number" valueColor="#5B9BD5" valueSize="12px" valueWeight="bold" onChange={(e)=>handleFilterChange(e)}/>
                  </div>

                  <div className="d-flex flex-column m-2" style={{width: "150px"}}>
                      <span style={{color: "gray"}}>Lead Time (Days)</span> 
                      <MultiInput id="lead_time" name="lead_time" valueColor="#5B9BD5" type="number" valueSize="12px" valueWeight="bold" onChange={(e)=>handleFilterChange(e)}/>
                  </div>
              
            </div>

            <div className="d-flex justify-content-between" style={{width: "100%", height:"100%", overflowY:"hidden"}}>

              <div 
                ref={itemsContainerRef}
                className="d-flex w-100 ms-3 p-2 justify-content-around bg-light border border-1 rounded-3 shadow flex-wrap responsive"
                style={{fontSize: "12px", height:"auto", overflowY:"auto"}}
                > 
        
                {orderItems.length>0 ?
                  orderItems.map((item,index)=>(
                    <div className="d-flex flex-column bg-white shadow-sm" style={itemCardStyle}>
                        
                          <div className="d-flex bg-light justify-content-end">
                            <label className="d-flex"  style={{height: "30px", paddingTop:"7px", fontSize: "10px", color: "gray"}} >Quantity:</label>
                            <input name={`item_${item.id}_quantity`} style={quantityInputStyle} onChange={(e)=>handleQuantityChange(e, item, index)}></input>
                            
                            <label className="d-flex"  style={{height: "30px", paddingTop:"7px", fontSize: "10px", color: "gray"}} >Add to cart: </label>
                            <img src={`${appIcons}/add_icon.png`} style={iconButtonStyle} onClick={(e)=>handleAddToCard(e,item, index)}/>
                          </div>
                      
                        <div style={{height: "100px", width:"100%", overflow: "hidden"}}>
                          { item.image? 
                            <img src={item.image} style={itemImageStyle}></img>
                            : 
                            <span style={{fontSize: "12px", color: "gray"}}>No image available</span>
                          }
                        </div>              
                        <div style={itemNameStyle} >{item.item_name}</div>
                        <div style={itemSupplierStyle} >
                          {item.supplier}
                        </div>
                        
                        <div style={itemPriceStyle} >${item.price} 
                          <span style={{color: "gray", fontSize:"12px", fontWeight: "normal"}}> /{item.unit_of_measure}</span>
                        </div>
                        <div style={itemSavingsStyle} >${item.savings} 
                          <span style={{color: "gray", fontSize:"12px", fontWeight: "normal"}}> negotiated savings</span>
                        </div>
                        <div style={itemRatingStyle}>
                          {item.rating}
                          <span style={{color: "gray", fontSize:"12px", fontWeight: "normal"}}> average community rating</span>
                        </div>
                        <div style={itemQuantityInStockStyle}>{item.quantity_in_stock} in stock</div>
                        <div style={itemLeadTimeStyle}>
                          {item.lead_time} {item.lead_time > 1 ? "days" : "day"}
                          <span style={{color: "gray", fontSize:"12px", fontWeight: "normal"}}> estimated lead time</span>
                        </div>
                    </div>
                  ))
                  :
                  <div className="d-flex text-center text-secondary mt-5"><h3>No items available. Please adjust filter criteria</h3></div>
                }
              
              </div>

              <div className="d-flex flex-column bg-light border border-1 rounded-3 shadow ms-3 p-3" style={{width: "30%", minWidth: "400px", height:contentContainerHeight, overflowY:"auto"}}>
                  <img src={`${appIcons}/shopping_icon.png`} style={iconStyle} alt="Shopping Cart Icon"></img>
                  <div className="d-flex w-100 flex-column justify-content-between">
                    {totalItems > 0 ? <div className="d-flex justify-content-end fw-bold" style={{fontSize: "16px"}}>{totalItems} item{totalItems>1?"s":""}</div> : null }
                    {totalAmount > 0 ? <div className="d-flex justify-content-end fw-bold" style={{fontSize: "16px"}}>${totalAmount} total</div> : null }
                    <button className="btn btn-primary" onClick={()=>setCheckoutWindow(true)}>Check Out</button>
                    <div className="d-flex flex-column" style={{overflow:"hidden", fontSize: "12px"}}>  
                      {cart.length>0 ?
                      <table className="table table-striped table-light table-border p-0">
                        <thead>
                            <tr className="fw-bold text-center">
                                <td>Item</td>
                                <td>Price</td>
                                <td>Quantity</td>
                                <td>Amount</td>
                                <td></td>
                              </tr>
                        </thead>
                      <tbody>
                      {cart.map((item,index)=>(
                            <tr className="animate__animated animate__slideInDown animate__duration-0.5s">
                                <td >{item.item_name}</td>
                                <td style={cartCellStyle}>{item.price}</td>
                                <td style={cartCellStyle}><input style={cartInputStyle} value={item.quantity}></input></td>
                                <td style={cartCellStyle}>{item.amount}</td>
                                <td style={{...cartCellStyle,['fontWeight']:'bold'}}><img style={{height: 25, width: 25}} src={`${appIcons}/delete_icon.png`}></img></td>
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

      {checkoutWindow && 
        <div 
          className="d-flex flex-column position-absolute border border-5 rounded-3 shadow bg-light" 
          style={{height: "auto", minHeight:"300px", overflow: "hidden", width:"800px", left: windowWidth/2-250, top: windowHeight/2-250}}
          >
              <div className="d-flex w-100 justify-content-end mb-3" style={{borderBottom: "1px solid lightgray"}}>
                <img src={`${appIcons}/close_icon.png`} style={iconStyle} onClick={(e)=>setCheckoutWindow(false)}></img>
              </div>
              {cart.length>0 ?
              <div className="d-flex flex-column p-3">
                <div style={{fontSize:"20px"}}>Please review your order and add any additional comments</div>
                <div className="d-flex flex-column" style={{height: "", overflowY: "auto"}}>
                  <table className="table table-striped table-white table-border p-0" style={{fontSize:"12px"}}>
                    <thead>
                        <tr className="fw-bold text-center">
                            <td>Item</td>
                            <td>Price</td>
                            <td>Quantity</td>
                            <td>Amount</td>
                          </tr>
                    </thead>
                  <tbody>
                  {cart.map((item,index)=>(
                        <tr>
                            <td >{item.item_name}</td>
                            <td style={cartCellStyle}>${item.price}</td>
                            <td style={cartCellStyle}>{item.quantity}</td>
                            <td style={cartCellStyle}>${item.amount}</td>
                          </tr>
                  ))}
                    <tr className="fw-bold" style={{borderTop:"2px solid gray"}}>
                      <td colSpan="3">Grand Total</td>
                      <td className="text-end">${totalAmount}</td>
                    </tr>
                  </tbody>
                  </table>
                </div>
                  <div>
                    <MultiInput id="notes" name="notes" type="textarea" label="Please add any notes you may have" onChange={(e)=>{handleChange(e)}}/>
                  </div>
                  <div className="d-flex justify-content-end mt-3">
                    <button className="btn btn-primary" onClick={(e)=>handleSubmitOrder(e)}>Submit</button>
                  </div>
                </div>
                :
                <div className="text-center" style={{color: "gray"}}>Nothing in cart</div>
            }
        </div>
      }

{orderSummaryWindow && 
        <div 
          className="d-flex flex-column position-absolute border border-5 rounded-3 shadow bg-light" 
          style={{height: "auto", minHeight:"300px", overflow: "hidden", width:"800px", left: windowWidth/2-250, top: windowHeight/2-250}}
          >
              <div className="d-flex w-100 justify-content-end mb-3" style={{borderBottom: "1px solid lightgray"}}>
                <img src={`${appIcons}/close_icon.png`} style={iconStyle} onClick={(e)=>setCheckoutWindow(false)}></img>
              </div>
              <div className="d-flex flex-column p-3">
                <div className="text-center text-success fw-bold" style={{fontSize:"20px"}}>{`${String.fromCharCode(9989)} Order submitted`}</div>
                  <div className="d-flex justify-content-center mt-3">
                    <button className="btn btn-primary m-1" onClick={(e)=>handleReviewOrders(e)}>Review Orders</button>
                    <button className="btn btn-primary m-1" onClick={(e)=>handleOrderAgain(e)}>Another Order</button>
                    <button className="btn btn-secondary m-1" onClick={(e)=>resetCart(e)}>Exit</button>
                  </div>
                </div>
        </div>
      }
    </div>
)
}

export default Market