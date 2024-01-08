import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import axios from 'axios'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'animate.css';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const SummarizeDocument = () => {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [pdfText, setPdfText] = useState('');
  const [file, setFile] = useState(null);

  const [preview, setPreview] = useState(true)
  const [extract, setExtract] = useState(false)

  const [summary, setSummary] = useState("")

  const summarize = async(documentText)=>{

    const prompt = `please summarize this text in less than 300 characters: ${documentText}`
    
    try{
      const response = await axios.post(`http://localhost:3001/gpt`,{prompt})
      const result = await response.data
      console.log(result)
      setSummary(result)
    }catch(error){
      console.log(error)
    }

    function updateSummary(result){
      console.log(`updating...${result}`)
        setSummary(result)
      }
  }

  function onFileChange(event) {

    const selectedFile = event.target.files[0];
    setFile(selectedFile);

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
      summarize(fullText)
      setNumPages(pdf.numPages);
    };

    reader.readAsArrayBuffer(selectedFile);
  }

  const handleViewModeOptions = (selectedValue)=>{
    console.log(selectedValue)
    if(selectedValue==="View Only"){
        setPreview(true)
        setExtract(false)
    }else if(selectedValue==="Extract Only") {
        setPreview(false)
        setExtract(true)
    }else{
        setPreview(true)
        setExtract(true)
    }
}
  return (
    <div className="d-flex flex-column">
      <h3 className="text-center">Summarize Document</h3>
        <div className="form-group">
            <input className="form-control mt-3" type="file" onChange={onFileChange} />
        </div>
        
      <div>
        {file && summary.length>0 && (
            <div className = "form-group border rounded rounded-3 mt-3 animate__animated animate__fadeIn aniamte__duration-0.5s bg-light p-3">
                <h5>Summary: </h5>
                <textarea rows={10} className = "form-control"  readonly>{summary}</textarea>
            </div>
        )}
        </div>
        {file && preview && (
            <div className="form-group border rounded rounded-3 mt-3 animate__animated animate__fadeIn aniamte__duration-0.5s bg-light p-3" style={{maxHeight: 500, overflow: "scroll"}}>
              <h5>Preview: </h5>
              <Document file={file}>
                  <Page pageNumber={pageNumber} />
              </Document>
              <p>
                  Page {pageNumber} of {numPages}
              </p>
            </div>
        )
        }
        
    </div>
  );
};

export default SummarizeDocument;
