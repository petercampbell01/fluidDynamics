class SimController{

    constructor(view){
        this.view = view
        this.view.setController(this)
        this.currentCalc = null
    }

    ex1_3(){
        this.drawCanvas( 30, 250, 'cm', 0, 65, 10, 0, 80 )
        this.currentCalc = new WaterCalculations()

    }

    getXYFlowPosition(velocity, time){
        return this.currentCalc.getXYFlowPosition(velocity, time)
    }

    getFlowPositionArray(timeInterval, velocity, time){
        let positionArray = new Array()
        let timeInMilliseconds = time * 1000
        for(let i = timeInterval; i <= timeInMilliseconds; i += timeInterval){
            let position = this.getXYFlowPosition(velocity, (i/10000) )
            position.x = (position.x * this.view.interval) * this.view.scaleInterval
            position.y = (position.y * this.view.interval) * this.view.scaleInterval
            positionArray.push(position)
        }
        return positionArray
    }

    ex1_3RunSimulation(mousePosition){
        if(this.view.checkMouseInWater(mousePosition)){
            let waterHeight = parseFloat(this.view.calculateWaterHeight(mousePosition.y)).toFixed(2)
            let heightY = parseFloat(this.view.calculateHeightY(mousePosition.y)).toFixed(2)
            let pressure = parseFloat(this.currentCalc.calculatePressure(waterHeight/100)).toFixed(4)
            let velocity = parseFloat(this.currentCalc.calculateVelocity(waterHeight)).toFixed(2)
            let time = parseFloat(this.currentCalc.calculateTimeToGround(heightY)).toFixed(2)
            let distance = parseFloat(this.currentCalc.calculateHorizontalDistanceWaterTravelled(velocity, time)).toFixed(2)// I don't what units of measurement I have here
            let timeInterval = 5
            let positionArray = this.getFlowPositionArray(timeInterval, velocity, time)
            let results = "Water Height: " + waterHeight + " cm<br>Height above ground: " + heightY +
                " cm<br>Water Pressure: "+ pressure + 
                " kPa <br>Velocity: " + parseFloat(velocity/10).toFixed(2) +
                " m/s<br>Time: " + time +
                " seconds<br>Distance: " + (distance * this.view.interval).toFixed(2) + " cm"
  
            this.view.displayResults(results)
            results = results.replace(/<br>/g, "\n")
            console.log(results)
            this.view.displayWaterFlowAnimation(timeInterval, positionArray, mousePosition.y, distance)
        }

    }

    drawCanvas(waterWidth, waterHeight, unit, scaleMin, scaleMax, scaleInterval, scaleYmin, scaleYmax){
        this.view.drawSky()
        this.view.drawGround()
        this.view.drawWater(waterWidth, waterHeight)
        this.view.drawContainer(waterWidth, waterHeight)
        this.view.drawVerticalScaleLeft(unit, scaleMin, scaleMax, scaleInterval)
        this.view.drawHorizontalScaleRight(scaleYmin, scaleYmax)
    }
    
}

