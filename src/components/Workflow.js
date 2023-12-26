import React from 'react'
import DraggableDiv from './DraggableDiv'
import "bootstrap/dist/css/bootstrap.min.css"

const Workflow = (props) => {

  return (
    <div className="d-flex flex-fill flex-column w-100">
            <div className="d-flex flex-fill flex-column w-100 p-3 bg-white border border-1 rounded-3" style={{position: "relative", height:350, width: "100%", overflow:'auto'}} >
                <DraggableDiv label={"Submitted"} startingCoordinates={{x: 50, y:100}}/>
                <DraggableDiv label={"Inventory Check"} startingCoordinates={{x: 250, y:25}}/>
                <DraggableDiv label={"Catalog Check"} startingCoordinates={{x: 250, y:200}}/>
                <DraggableDiv label={"Sourcing Required?"} startingCoordinates={{x: 450, y:100}}/>
                <DraggableDiv label={"Route For Sourcing"} startingCoordinates={{x: 650, y:200}}/>
                <DraggableDiv label={"Budget Check"} startingCoordinates={{x: 650, y:25}}/>
                <DraggableDiv label={"Close"} startingCoordinates={{x: 850, y:100}}/>
            </div>
        </div>
  )
}

export default Workflow