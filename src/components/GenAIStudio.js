import React, {useState, useEffect, useRef} from 'react'
import {appIcons} from './apis/icons.js'
import { askGPT, generateImage } from './apis/axios'
import SummarizeDocument from './SummarizeDocument'
import { scanInvoice } from './apis/axios'
import "bootstrap/dist/css/bootstrap.min.css"
import { Document, Page, pdfjs } from 'react-pdf';
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;


const Gpt = (props) => {

    
    const [prompt, setPrompt] = useState("")
    const [taskType, setTaskType] = useState("Ask Question")
    const [response, setResponse] = useState("")
    const [scannedResponse, setScannedResponse] = useState(null)
    const [scannedInvoice, setScannedInvoice] = useState({})
    const [imageResponse, setImageResponse] = useState(null)
    const [messageWindowClass, setMessageWindowClass] = useState("d-none")
    const [waiting, setWaiting] = useState(false)
    const [file, setFile] = useState([])
    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);
    const [pdfText, setPdfText] = useState('');

    const [preview, setPreview] = useState(true)
    const [extract, setExtract] = useState(false)

    const [summary, setSummary] = useState("")

    const [thread, setThread] = useState([])

    const handleFileUpload = (e)=>{

        setFile(e.target.files[0]);

        const reader = new FileReader();
        reader.onload = async function (event) {
        const typedArray = new Uint8Array(event.target.result);
        const pdf = await pdfjs.getDocument(typedArray).promise;

        let fullText = '';
        for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            const textItems = textContent.items.map((item) => item.str);
            const pageText = textItems.join(' ');
            fullText += pageText + '\n';
        }
        setPdfText(fullText);
        setNumPages(pdf.numPages);
       
        };
        reader.readAsArrayBuffer(e.target.files[0]);
    }
    

    const handleSubmit = async(e)=>{
        
        setResponse("")
        setImageResponse("")
        setScannedInvoice("")
        setWaiting(true)

        if (taskType == "Ask Question"){
            try{
                const result = await askGPT(prompt)
                console.log(result.data)
                setResponse(result.data)
                setThread({question: prompt, response:result.data, timestamp: new Date()})
                setWaiting(false)
            }catch(error){
                console.log(error)
                setWaiting(false)
            }
        }

        if (taskType == "Scan Invoice"){
            console.log(file)

            const args = {
                documentText: pdfText,
                record: {
                    supplier_name:"",
                    subject:"",
                    total_invoice_amount:"",
                    invoice_date:"",
                    payment_due_date:"",
                    supplier_contact_full_name:"",
                    supplier_email:"",
                    supplier_phone_number:"",
                    notes:""
                }
            }

            try{
                const result = await scanInvoice({args})
                console.log(result)
                console.log(typeof result)
                setScannedInvoice(result)
                setWaiting(false)
            }catch(error){
                console.log(error)
                setWaiting(false)
            }
        }

        if (taskType == "Summarize Document"){
            try{
                const result = await generateImage(prompt)
                // console.log(result)
                setImageResponse(result)
                setWaiting(false)
            }catch(error){
                console.log(error)
                setWaiting(false)
            }
        }

        if (taskType == "Generate Image"){
            try{
                const result = await generateImage(prompt)
                // console.log(result)
                setImageResponse(result)
                setWaiting(false)
            }catch(error){
                console.log(error)
                setWaiting(false)
            }
        }
    }


 const pageStyle={fontSize: 14, width:"100%", height: "100%", overflow: "hidden"}
 const titleStyle={fontSize: "32px", fontWeight: "bold"}

  return (
    <div className="d-flex flex-column" style={pageStyle}>
        
        <div className="d-flex bg-light p-3">
            <img src={`${appIcons}/genAI_icon.png`} style={{height: "50px", width: "50px"}} alt="Gen AI Icon"></img>
            <div style={titleStyle}>GenAI Studio</div>
        </div>

        <div className="d-flex" style={{width: "100%", height: "100%", overflow:"hidden"}}>
            <div 
                className="d-flex flex-column p-3" 
                style={{width: "250px", backgroundImage:"linear-gradient(0deg, rgb(150, 0, 150), rgb(0, 0, 150), rgb(0,150,0))", height: "100%"}}
            >
                <button id="askButton" className="btn btn-secondary mb-3"  onClick={(e)=>setTaskType("Ask Question")}>Ask Question</button>
                <button id="summarizeDocumentButton" className="btn btn-secondary mb-3"  onClick={(e)=>setTaskType("Summarize Document")}>Summarize Document</button>
                <button id="scanInvoiceButton" className="btn btn-secondary mb-3" onClick={(e)=>setTaskType("Scan Invoice")}>Scan Invoice</button>
                <button id="generateImageButton" className="btn btn-secondary mb-3" onClick={(e)=>setTaskType("Generate Image")}>Generate Image</button>
            </div>

        <div className="d-flex bg-dark  flex-fill flex-column" 
            style={{height: "100%", width: "100%", overflowY: "auto", backgroundImage:"linear-gradient(0deg, rgb(50, 50, 50), rgb(100, 100, 100))", height: "100%"}}
            
            >
            <div className = "d-flex justify-content-center" style={{fontSize: "24px", color: "white", fontWeight: "bold"}}>{taskType}</div>
            
            {(taskType=="Ask Question" || taskType=="Generate Image") &&
            <div className="d-flex justify-content-center w-100">
                <div className="d-flex flex-column bg-light border border-3 p-3 rounded-3 shadow" style={{width: "75%"}}>
                    <textarea
                        id='prompt'
                        name='prompt'
                        value={prompt}
                        onChange={(e)=>setPrompt(e.target.value)}
                        style={{fontSize: "18px", color: "gray", outline: "none", width: "100%"}}
                        className="border rounded-3 p-3"
                        rows={3}
                    >
                    </textarea>
                    <div className="d-flex justify-content-center mt-1" style={{width: "100%"}}>
                        <div class="btn-group" role="group" aria-label="Basic example">
                            <button id="askButton" className="btn btn-primary" onClick={(e)=>handleSubmit(true)}>Submit</button>
                        </div>
                    </div>

                    {response.length>0 && taskType == "Ask Question" &&
                    <div className="d-flex flex-column bg-light border border-3 p-3 rounded-3 shadow mt-3">
                        <span style={{color: "black", fontSize: "16px", fontWeight: 'bold'}}>{response}</span>
                    </div>
                    }

                    {imageResponse && taskType == "Generate Image" &&
                    <div className="d-flex flex-column bg-light border border-3 p-3 rounded-3 shadow mt-3" style={{height: "90%", overflowY: "auto"}}>
                        <img src={imageResponse} alt="image response" style={{color: "#70AD47", fontWeight: 'bold', height:"auto"}}></img>
                    </div>
                    }
                </div>
            </div>
            }

            
            {taskType == "Scan Invoice" &&
            <div className="d-flex justify-content-center w-100">
                <div className="d-flex flex-column bg-light border border-3 p-3 rounded-3 shadow" style={{width: "75%"}}>
                        <div className="form-group">
                            <label forHTML = "upload_file">Upload PDF Invoice:</label>
                            <input name="upload_file" type="file" className="form-control" onChange={(e)=>handleFileUpload(e)}></input>
                        </div>
                    <div className="d-flex justify-content-center mt-1">
                        <div className="d-flex justify-content-around">
                            <div class="btn-group" role="group" aria-label="Basic example">
                                <button id="scanFile" className="btn btn-primary" onClick={(e)=>handleSubmit(e)}>Scan</button>
                            </div>
                        </div>
                    </div>

                    {scannedInvoice && taskType == "Scan Invoice" &&
                        <div className="d-flex w-100 flex-column bg-light border border-3 p-3 rounded-3 shadow mt-3" style={{width: "75%"}}>
                            <h5>AI-Scanned Invoice: </h5>
                            <table>
                            <thead className="table table-bordered tabled-striped">
                                <tr>
                                    <td scope="col"></td>
                                    <td scope="col"></td>
                                </tr>
                            </thead>
                            <tbody>
                                {Object.keys(scannedInvoice).map((item,index)=>(
                                    <tr key={index}>
                                        <td>{item}</td>
                                        {typeof scannedInvoice[item] == "string"?
                                            <td>{scannedInvoice[item].replaceAll("_")}</td>
                                            :
                                            <td>{JSON.stringify(scannedInvoice[item])}</td>
                                        }
                                    </tr>
                                ))}
                            </tbody>
                            </table>
                        </div>
                    }
                </div>
                
            </div>
                
            }

            {taskType == "Summarize Document" && 
                <div className="d-flex justify-content-center w-100">
                    <div className="d-flex flex-column bg-light border border-3 p-3 rounded-3 shadow" style={{width: "75%"}}>
                        <SummarizeDocument />
                    </div>  
                </div>
            }

           
        </div>
            {
                waiting && 
                <div className="d-flex bg-light shadow p-3 text-center text-danger fw-bold border border-3 rounded-3" style={{position: "absolute", height: window.innerHeight/2-200, width: window.innerWidth, top: "30vh"}}>
                    ChatGPT is working on a response.  Please wait a few moments...
                </div>
            }
        </div>
    </div>
  )
}

export default Gpt