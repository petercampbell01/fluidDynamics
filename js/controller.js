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
            let results = "<table><tr><td>Water Height:</td><td>" + waterHeight + 
            " cm</td></tr><tr><td>Height above ground:</td><td>" + heightY +
            " cm</td></tr><tr><td>Water Pressure:</td><td>"+ pressure + 
            " kPa </td></tr><tr><td>Velocity:</td><td>" + parseFloat(velocity/10).toFixed(2) +
            " m/s</td></tr><tr><td>Time:</td><td>" + time +
            " seconds</td></tr><tr><td>Distance:</td><td>" + (distance * this.view.interval).toFixed(2) + " cm</td></tr> </table>"
            let consoleResults = "Water Height: " + waterHeight + " cm\nHeight above ground: " + heightY +
            " cm\nWater Pressure: "+ pressure + 
            " kPa \nVelocity: " + parseFloat(velocity/10).toFixed(2) +
            " m/s\nTime: " + time +
            " seconds\nDistance: " + (distance * this.view.interval).toFixed(2) + " cm"

            this.view.displayResults(results)
            console.log(consoleResults)
            this.view.displayWaterFlowAnimation(timeInterval, positionArray, mousePosition.y, distance)
            //this.view.waterFlow(velocity, time, mousePosition.y, distance)
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

