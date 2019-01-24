class WaterCalculations{

	constructor(){
		this.gravity = 9.81 // gravity on Earth
		this.waterDensity = 998.21 // density of water at 15 deg celsius
	}

	calculatePressure(height){
		// where height is the height of water above measurement position, measured in metres
		//returns result in kilo pascals
		let pressure = this.waterDensity * this.gravity * height
		//convert pascals to kilo pascals by dividing by 1000
		pressure =  pressure / 1000
		return pressure  
	}

	calculateVelocity(waterHeight){
		let velocity = Math.sqrt(2*this.gravity*(waterHeight/100))
		return velocity 
	}

	calculateTimeToGround(y){
		//calculate t
		//t = sqrt(y/(0.5g))
		let time = Math.sqrt(y/(0.5 * this.gravity))
		return time 
	}

	calculateYFromTime(time){
		// y = 0.5gt2
		let t = time
		let y = 0.5 * (this.gravity * (t * t))
		return y
	}

	calculateHorizontalDistanceWaterTravelled(velocity, time){
		let distanceX = (velocity * time) 
		return distanceX
	}

	getXYFlowPosition(velocity, time){
		return {
			y: this.calculateYFromTime(time), 
			x: this.calculateHorizontalDistanceWaterTravelled(velocity, time)
		}
	}
}