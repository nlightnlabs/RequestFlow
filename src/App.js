import React, {useState, useContext, useEffect, useRef} from 'react';
import {ContextProvider, Context } from './components/Context';
import "bootstrap/dist/css/bootstrap.min.css"
import axios from 'axios'

import Home from './components/Home.js';
import PurchaseRequest from './components/PurchaseRequest.js';
import SoftwareAccess from './components/SoftwareAccess.js'
import ITEquipment from './components/ITEquipment.js';
import TemporaryStaff from './components/TemporaryStaff.js';
import NewContract from './components/NewContract.js';
import Sourcing from './components/Sourcing.js';
import Budget from './components/Budget.js';
import ITSupport from './components/ITSupport.js';
import HRSupport from './components/HRSupport.js';
import NonStandard from './components/NonStandard.js';
import AdditionalInfo from './components/Additionalnfo.js';
import RequestSummary from './components/RequestSummary.js';
import AddBusiness from './components/AddBusiness.js';
import AddProduct from './components/AddProduct.js';
import Login from './components/Login.js';
import UserInfo from './components/UserInfo.js';
import Header from './components/Header.js';
import Requests from './components/Requests.js';
import Test from './components/Test.js';
import 'animate.css';

function App() {


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


  let pageData=[
    {name: "Log In", component: <Login/>, data: "user_info", request_type: false, description: "Description for this request", icon:`${icons}/log_in_icon.png`},
    {name: "User Info", component: <UserInfo/>, data: "user_info", request_type: false, description: "Description for this request", icon:"https://nlightnlabs.net/spendFlow/intake/icons/sign_up_icon.png"},
    {name: "Home", component: <Home/>, data: "request_summary", request_type: false, description: "Description for this request", icon:"https://nlightnlabs.net/spendFlow/intake/icons/home_icon.png"},
    {name: "Purchase Request", component: <PurchaseRequest/>, data: "request_details", request_type: true, description: "Purchase a good or service you need", icon:`${icons}/purchase_request_icon.png`},
    {name: "Software Access", component: <SoftwareAccess/>, data: "request_details", request_type: true, description: "Get access to software applications", icon:`${icons}/software_access_icon.png`},
    {name: "IT Equipment", component: <ITEquipment/>, data: "request_details", request_type: true, description: "Get access to common IT supplies like laptops, monitors, peripherals, etc.", icon:`${icons}/it_equipment_icon.png`},
    {name: "Temporary Staff", component: <TemporaryStaff/>, data: "request_details", request_type: true, description: "Hire contract labor support", icon:`${icons}/temporary_staff_icon.png`},
    {name: "Contract Request", component: <NewContract/>, data: "request_details", request_type: true, description: "Create a new agreement or modify/renew existing agreements" , icon:`${icons}/contract_request_icon.png`},
    {name: "Sourcing", component: <Sourcing/>, data: "request_details", request_type: true, description: "Get help with purchasing new products, services, negotiating deals, and engaging suppliers", icon:`${icons}/sourcing_icon.png`},
    {name: "Budget", component: <Budget/>, data: "request_details", request_type: true, description: "Ask for budget to fund a project or other business need", icon:`${icons}/budget_icon.png`},
    {name: "IT Support", component: <ITSupport/>, data: "request_details", request_type: true, description: "Get help for IT issues",icon:`${icons}/it_support_icon.png`},
    {name: "HR Support", component: <HRSupport/>, data: "request_details", request_type: true, description: "Ask HR for information and get help with issues",icon:`${icons}/hr_support_icon.png`},
    {name: "Other", component: <NonStandard/>, data: "non_standard_request_data", request_type: true, description: "Select this if you don't see what you need",icon:`${icons}/other_request_icon.png`},
    {name: "Additional Info", component: <AdditionalInfo/>, data: "request_summary", request_type: false, description: "Description for this request",icon:`${icons}/additional_info.png`},
    {name: "Request Summary", component: <RequestSummary/>, data: "request_summary", request_type: false, description: "Description for this request",icon:`${icons}/request_summary.png`},
    {name: "Requests", component: <Requests/>, data: "request_page_settings", request_type: false, description: "Dashboard for all requets",icon:`${icons}/requests_icon.png`},
    {name: "Add Business", component: <AddBusiness/>, data: "new_business_data", request_type: false, description: "Description for this request",icon:`${icons}/add_business.png`},
    {name: "Add Product", component: <AddProduct/>, data: "new_product_data", request_type: false, description: "Description for this request",icon:`${icons}/add_product.png`},
    {name: "Test", component: <Test/>, data: "test_data", request_type: false, description: "Description for this request",icon:`${icons}/test.png`}
  ]


  const getRequestTypes = ()=>{
    let list = []
    pageData.forEach(item=>{
      item.request_type && list.push(item)
    })
    return list
  }

 useEffect(()=>{
    setPages(pageData)
    setRequestTypes(getRequestTypes()) 
    setPage(pageData.filter(x=>x.name===pageName)[0])
  },[])
 

  const handleSelect=(e)=>{

    setRequestType(e.target.id)
    let request_type = e.target.id
    setAppData({...appData.request_data,...request_type})
  
    pages.push(e.target.id)
    setPageList(pages)
    setPage(e.target.id)
  }

  const pageStyle={
    backgroundSize: "cover",
    backgroundImage: "linear-gradient(0deg, rgb(220, 230, 255), rgb(245, 250, 255), white)",
    height: "100vh",
    overflow: "auto"
  }
 
  return (
    <div style={pageStyle}>

        {(!userLoggedIn && pageName == "Log In") && 
          <>
            <Login/>
            <div className="d-flex justify-content-center mt-5 ">
              <img style={{maxHeight: 100,  backgroundColor:"none", cursor: "pointer"}} src={`${icons}/nlightn+labs+logo.png`} onClick={()=>setPageName("Test")}></img>
            </div>
          </>
          }

        {!userLoggedIn && pageName == "User Info" && <UserInfo/>}

        {userLoggedIn && 
          <>
          <Header/>
          <>{pages.filter(x=>x.name===pageName)[0].component}</>
          </>
        }

    </div>
  );
}

export default App;
