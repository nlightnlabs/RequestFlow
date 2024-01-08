import React, {useState, useEffect} from 'react'
import { askGPT, generateImage } from './apis/axios'
import SummarizeDocument from './SummarizeDocument'
import "bootstrap/dist/css/bootstrap.min.css"


const Gpt = (props) => {

    const [prompt, setPrompt] = useState("")
    const [taskType, setTaskType] = useState("Ask Question")
    const [response, setResponse] = useState("")
    const [summarizeDocument, setSummarizeDocument] = useState(false)
    const [scannedDocument, setScannedDocument] = useState("")
    const [imageResponse, setImageResponse] = useState(null)
    const [messageWindowClass, setMessageWindowClass] = useState("d-none")
    const [waiting, setWaiting] = useState(false)
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    

    const handleResize = () => {
        setWindowWidth(window.innerWidth);
      };


      useEffect(() => {
        // Event listener for window resize
        window.addEventListener('resize', handleResize);
    
        // Cleanup: remove event listener on component unmount
        return () => {
          window.removeEventListener('resize', handleResize);
        };
      }, []);

    const [thread, setThread] = useState([])

    const handleSubmit = async(e)=>{
        console.log(e.target.id )
        setResponse("")
        setImageResponse("")
        setScannedDocument("")
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

            

            try{
                const result = await scanInvoice(prompt)
                // console.log(result)
                setScannedDocument(result)
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


    const pageStyle={fontSize: 14, padding: 20}
    const iconButton={
        height: "100px",
        width: "150px",
        verticalAlign: "center"
    }

  return (
    <div className="d-flex flex-column" style={pageStyle}>
        <h2 className="p-3 text-center">GenAI Studio</h2>
        <div className="d-flex justify-content-around">
            <div id="askButton" className="d-flex border border-1 rounded-3 shadow bg-white" style={iconButton} onClick={(e)=>setTaskType("Ask Question")}>Ask Question</div>
            <div id="summarizeDocumentButton" className="d-flex border border-1 rounded-3 shadow bg-white" style={iconButton} onClick={(e)=>setTaskType("Summarize Document")}>Summarize Document</div>
            <div id="scanInvoiceButton" className="d-flex border border-1 rounded-3 shadow bg-white" style={iconButton} onClick={(e)=>setTaskType("Scan Invoice")}>Scan Invoice</div>
            <div id="generateImageButton" className="d-flex border border-1 rounded-3 shadow bg-white" style={iconButton} onClick={(e)=>setTaskType("Generate Image")}>Generate Image</div>
            
        </div>

        <div className="d-flex justify-content-center">
            <div className="d-flex w-50 w-lg-50 justify-content-center flex-wrap">
                <div className="d-flex w-100 flex-column bg-light border border-3 p-3 rounded-3 shadow">
                    <textarea
                        id='prompt'
                        name='prompt'
                        value={prompt}
                        onChange={(e)=>setPrompt(e.target.value)}
                        style={{color: "#5B9BD5", outline: "none"}}
                        className="border rounded-3 p-3"
                        rows={5}
                    >
                    </textarea>
                    <div className="d-flex justify-content-center mt-1">
                        <div className="d-flex justify-content-around">
                            <div class="btn-group" role="group" aria-label="Basic example">
                                <button id="askButton" className="btn btn-primary" onClick={(e)=>askQuestion(true)}>Ask Question</button>
                                <button id="summarizeDocumentButton" className="btn btn-primary" onClick={(e)=>setSummarizeDocument(true)}>Summarize Document</button>
                                <button id="scanInvoice" className="btn btn-primary" onClick={(e)=>setScanInvoice(true)}>Scan Invoice</button>
                                <button id="generateImageButton" className="btn btn-primary" onClick={(e)=>setGenerateImage(true)}>Generate Image</button>
                            </div>
                        </div>
                    </div>
                </div>

                {summarizeDocument && <SummarizeDocument />}

                {response.length>0 && 
                <div className="d-flex w-100 flex-column bg-light border border-3 p-3 rounded-3 shadow mt-3">
                    <span style={{color: "#70AD47", fontWeight: 'bold'}}>{response}</span>
                </div>}

                {imageResponse && 
                <div className="d-flex w-100 flex-column bg-light border border-3 p-3 rounded-3 shadow mt-3">
                    <img src={imageResponse} alt="image response" style={{color: "#70AD47", fontWeight: 'bold'}}></img>
                </div>}

            </div>
        </div>
        {waiting && 
            <div className="d-flex bg-light shadow p-3 text-center text-danger fw-bold border border-3 rounded-3" style={{position: "absolute", height: 150, width: 300, top: "30vh", left: windowWidth/2-300/2}}>
                ChatGPT is working on a response.  Please wait a few moments...
            </div>
        }
    </div>
  )
}

export default Gpt