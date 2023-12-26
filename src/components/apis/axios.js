import axios from "axios";
console.log(`Environment: ${process.env.NODE_ENV}`);

const baseURL = process.env.NODE_ENV==="production" ? "https://nlightnlabs.net" : "http://localhost:3001"
const dbUrl = axios.create({
  baseURL,
})

console.log(baseURL);
export default axios.create({
    baseURL,
})


//General Query
export const getData = async (query, res)=>{
  try{
    const result = await dbUrl.post("/db/query",{query})
    console.log(result)
    const data = await result.data
    return (data)
  }catch(error){
    console.log(error)
  }
}


//Get Data
export const getTable = async (tableName, res)=>{
    try{
      const result = await dbUrl.get(`/db/table/${tableName}`)
      console.log(result)
      const data = await result.data
      return (data)
    }catch(error){
      console.log(error)
    }
  }

//Get Record
export const getRecord = async (req, res)=>{
  const params = {
      tableName: req.tableName,
      recordId: req.recordId,
      idField: req.idField
  }

  try{
    const result = await dbUrl.post("/db/getRecord",{params})
    console.log(result)
    const data = await result.data
    return (data)
  }catch(error){
    console.log(error)
  }
}

//Get Records
export const getRecords = async (req, res)=>{
  const params = {
      tableName: req.tableName,
      recordId: req.recordId,
      idField: req.idField
  }

  try{
    const result = await dbUrl.post("/db/getRecords",{params})
    console.log(result)
    const data = await result.data
    return (data)
  }catch(error){
    console.log(error)
  }
}


//Create New Record
export const addRecord = async (req, res)=>{

    const params = {
        tableName: req.tableName,
        columns: req.columns,
        values: req.values
    }

    try{
      const result = await dbUrl.post("/db/addRecord",{params})
      console.log(result)
      const data = await result.data
      return (data)
    }catch(error){
      console.log(error)
    }
}

//Update Record
export const updateRecord = async (req, res)=>{
    
    const params = {
        tableName: req.tableName,
        idField: req.idField,
        recordId: req.recordId,
        formData: req.formData
    }

    console.log(params)
    try{
      const result = await dbUrl.post("/db/updateRecord",{params})
      console.log(result)
      const data = await result.data
      return (data)
    }catch(error){
      console.log(error)
    }
}

//Delete Record
export const deleteRecord = async (req, res)=>{

  const params = {
      tableName: req.tableName,
      idField: req.idField,
      recordId: req.recordId
  }
  try{
    const result = await dbUrl.post("/db/deleteRecord",{params})
    console.log(result)
    const data = await result.data
    return (data)
  }catch(error){
    console.log(error)
  }
}

//Get list of all tables in database:
const query= `SELECT table_name FROM information_schema.tables where table_schema = 'public';`