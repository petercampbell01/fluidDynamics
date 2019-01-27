class SimulationCanvas{

	constructor(canvas, resultsField){
		//Set canvas parametres		
        this.controller = null
        this.canvas = canvas		
		this.ctx = canvas.getContext("2d")
		this.canvasWidth = canvas.width
        this.canvasHeight = canvas.height
        this.resultsField = resultsField
        

		//set picture parametres
		this.groundTop = 	(this.canvasHeight / 4) * 3	
				
		//set colours		
		this.grassColour = "green"
		this.skyColour = this.ctx.createLinearGradient(0, 0, 0, 250)
		this.skyColour.addColorStop(0, "#88d7f7");
		this.skyColour.addColorStop(1, "white");
		this.waterColour = "blue"
		this.containerColour = "black"
		this.flowingWater = this.ctx.createLinearGradient(0,0,200,200)
		this.flowingWater.addColorStop(0, "blue");
		this.flowingWater.addColorStop(1, "#88b2fc");
	}
	
    setController(controller){
        this.controller = controller
    }

	checkMouseInWater(mousePosition){
		return mousePosition.x > this.containerLeft && 
			mousePosition.x < this.containerRight && 
			mousePosition.y > this.waterTop && 
			mousePosition.y < this.groundTop
	}

	calculateWaterHeight(mouseY){
		this.mousePositionY = mouseY
		let waterHeight = ((mouseY - this.waterTop) / this.scaleInterval) * this.interval
		return waterHeight.toFixed(2) 
	}

	calculateHeightY(mouseY){
		this.mousePositionY = mouseY
		let heightAboveGroundY = ((this.groundTop - mouseY) / this.scaleInterval) * this.interval
		return heightAboveGroundY.toFixed(2)
    }
    
    displayResults(results){
        this.resultsField.innerHTML = results
        return true
    }
	
/*	waterFlow(velocity, time, startY=0 , endX=0){
        if(!this.controller){
            return false
        }
        let startX = this.containerRight
		let endY = this.groundTop
		endX = (endX * this.scaleInterval)  + this.containerRight
		this.ctx.strokeStyle = this.flowingWater
		this.ctx.lineWidth = 3
		this.ctx.moveTo( startX, startY)
		let newPosX = startX
		let newPosY = startY
		let rep = 500
		for(let timeCounter = time / rep; newPosY <= endY && newPosX <= endX; timeCounter += time /rep){
			let newPositions = this.controller.getXYFlowPosition(velocity, timeCounter)
			newPosX = ((newPositions.x * this.interval) * this.scaleInterval) + startX
			newPosY = ((newPositions.y * this.interval) * this.scaleInterval) + startY
			if(newPosY < this.groundTop){
				this.ctx.lineTo(newPosX, newPosY)
			}else{
				this.ctx.lineTo(endX, this.groundTop)
				this.ctx.stroke()
				break
			}
			this.ctx.stroke()
		}
		//REDRAW GROUND AND ADD GROUND SCALE AGAIN
		this.drawGround()
		this.drawHorizontalScaleRight()
	}
*/
	displayWaterFlowAnimation(timeInterval, positionArray, startY=0 , endX=0){
		let startX = this.containerRight
		let endY = this.groundTop
		endX = (endX * this.scaleInterval)  + this.containerRight
		this.ctx.strokeStyle = this.flowingWater
		this.ctx.lineWidth = 3
		this.ctx.moveTo( startX, startY)
		let ctx = this.ctx
		let newPosX = startX
		let newPosY = startY
		let posArray = positionArray
		let animationsRun = setInterval(function(){
			if(positionArray.length === 0){
				mouseActive = true
				clearInterval(animationsRun)
			}
			let newPosition = posArray.shift()
			if(newPosition){
				newPosX = newPosition.x + startX
				newPosY = newPosition.y + startY
			}
				if(newPosY < endY){
				ctx.lineTo(newPosX, newPosY)
				ctx.stroke()
			}else{
				ctx.lineTo(endX, endY)
				ctx.stroke()
				mouseActive = true
				clearInterval(animationsRun)
			}
		}, timeInterval)
	}

	drawSky(){
		this.ctx.fillStyle = this.skyColour
		this.ctx.fillRect(0, 0, this.canvasWidth, this.groundTop)	
	}
	
	drawGround(){
		this.ctx.fillStyle = this.grassColour
		this.ctx.fillRect(0, this.groundTop, this.canvasWidth, this.canvasHeight)
	}

	drawWater(containerWidth = 25, containerHeight = 250){
		//draw water
		this.containerHeight = containerHeight
		this.ctx.fillStyle = this.waterColour
		this.containerLeft = this.canvasWidth / 6
		this.containerTop = this.groundTop - containerHeight - 5
		this.waterTop = this.containerTop + 5
		this.ctx.fillRect(this.containerLeft, this.waterTop, containerWidth, containerHeight)
	}
	drawContainer(containerWidth = 25, containerHeight = 250){
		//draw container
		this.ctx.lineWidth = 5
		this.ctx.strokeStyle = this.containerColour
		this.ctx.moveTo(this.containerLeft, this.containerTop)
		this.ctx.lineTo(this.containerLeft, this.groundTop)
		this.containerRight = this.containerLeft + containerWidth
		this.ctx.lineTo(this.containerRight, this.groundTop)
		this.ctx.lineTo(this.containerRight, this.containerTop)
		this.ctx.stroke()		
	}

	drawVerticalScaleLeft(units, min, max, interval){
		this.ctx.font = "12px arial"
		this.ctx.fillStyle = this.containerColour
		let divisor = ((max - min) / interval)
		this.units = units
		let scaleInterval = this.containerHeight / divisor
		this.interval = interval
		this.scaleInterval = scaleInterval
		for(let scaler = min, yPos = this.waterTop +5; scaler <= max; scaler += interval, yPos += scaleInterval ){
			let label = scaler + " " + units	+" -";
			let leftSpacer = (this.containerLeft - (label.length * 6))
			this.ctx.fillText(label, leftSpacer, yPos)
		}
	}
	
	drawHorizontalScaleRight(min = 0, max = 100){
		if (!this.horizontalScaleMin && !this.horizontalScaleMax){
			this.horizontalScaleMin = min
			this.horizontalScaleMax = max
		}else{
			min = this.horizontalScaleMin
			max = this.horizontalScaleMax
		}
		this.ctx.font = "10px arial"
		this.ctx.fillStyle = "white"
		for(let scaler = min, xPos = this.containerRight; scaler <= max; scaler += this.interval, xPos += this.scaleInterval ){
			let marker = "|"
			let label =  scaler + this.units;
			this.ctx.fillText(marker, xPos, this.groundTop + 9)
			this.ctx.fillText(label, xPos - 10, this.groundTop + 22)
		}		
	}
}