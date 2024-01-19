import React from 'react'

const Test = () => {


 const headerStyle = {}

 const pageStyle=`
    /* styles.css */

  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5); /* semi-transparent overlay */
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .modal-content {
    background: white;
    padding: 20px;
  }

 `

  
  return (
    <div className="flex-container">
      <div className="flex flex-column" style={headerStyle}></div>
      
    <style>{pageStyle}</style>
    </div>
  )
}

export default Test