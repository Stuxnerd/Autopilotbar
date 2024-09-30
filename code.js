const varAP_Status = "A:AUTOPILOT MASTER";
const varAP_Heading = "A:AUTOPILOT HEADING LOCK";
const varAP_HeadingDir = "A:AUTOPILOT HEADING LOCK DIR";

const varAP_Alt = "A:AUTOPILOT ALTITUDE LOCK";
const varAP_AltVar = "A:AUTOPILOT ALTITUDE LOCK VAR";

const varAP_VS = "A:AUTOPILOT VERTICAL HOLD";
const varAP_VSVar = "A:AUTOPILOT VERTICAL HOLD VAR";

const varAP_Speed = "A:AUTOPILOT AIRSPEED HOLD";
const varAP_SpeedVar = "A:AUTOPILOT AIRSPEED HOLD VAR";

this.store = {
    active: false,
}
this.update_interval=.2;  //Refresh Interval (Seconds)
this.$api.datastore.import(this.store);

html_created((el) => {
	this.cellAP_Status = document.getElementById("AP_Status");
	this.cellAP_Heading = document.getElementById("AP_Heading");
	this.cellAP_Alt = document.getElementById("AP_Alt");
	this.cellAP_VS = document.getElementById("AP_VS");
	this.cellAP_Speed = document.getElementById("AP_Speed");
	this.update_elements();
}); 

this.update_elements = () => {
	document.getElementById("autopilottable").style.display=(this.store.active ? "block":"none");

    // Status of Autopilot
	this.stateAP_Status = this.$api.variables.get(varAP_Status, "Bool");
    this.cellAP_Status.innerHTML = this.stateAP_Status ? "on" : "off";
    this.cellAP_Status.style.color = this.stateAP_Status ? "lightgreen" : "red";

    // Heading of Autopilot
	this.stateAP_Heading = this.$api.variables.get(varAP_Heading, "Bool");
    // status of heading or heading itself
    this.textAP_Heading = "off";
    if (this.stateAP_Heading) { //overwrite with heading if active
        this.textAP_Heading = Math.round(this.$api.variables.get(varAP_HeadingDir, "Degrees")).toString().padStart(3, '0');
    }
    this.cellAP_Heading.innerHTML = this.textAP_Heading;
    this.cellAP_Heading.style.color = this.stateAP_Heading ? "lightgreen" : "red";

	// Altitude of Autopilot
	this.stateAP_Alt = this.$api.variables.get(varAP_Alt, "Bool");
    // status of altimeter or alitmeter value itself
    this.textAP_Alt = "off";
    if (this.stateAP_Alt) { //overwrite with alimeter if active
        this.textAP_Alt = Math.round(this.$api.variables.get(varAP_AltVar, "Feet (ft)")).toString();
    }
	// use VS mode for alternative information
    if (this.stateAP_VS) { //overwrite with alimeter if active
        this.textAP_Alt = "wait VS";
    }
    this.cellAP_Alt.innerHTML = this.textAP_Alt;
    this.cellAP_Alt.style.color = this.stateAP_Alt ? "lightgreen" : "red";

	// VS of Autopilot
	this.stateAP_VS = this.$api.variables.get(varAP_VS, "Bool");
    // status of VS or VS value itself
    this.textAP_VS = "off";
    if (this.stateAP_VS) { //overwrite with VS if active
        this.textAP_VS = Math.round(this.$api.variables.get(varAP_VSVar, "Feet (ft)/minute")).toString();
    }
    this.cellAP_VS.innerHTML = this.textAP_VS;
    this.cellAP_VS.style.color = this.stateAP_VS ? "lightgreen" : "red";

	// Speed of Autopilot
	this.stateAP_Speed = this.$api.variables.get(varAP_Speed, "Bool");
    // status of Speed or Speed value itself
    this.textAP_Speed = "off";
    if (this.stateAP_Speed) { //overwrite with VS if active
        this.textAP_Speed = Math.round(this.$api.variables.get(varAP_SpeedVar, "Knots")).toString();
    }
    this.cellAP_Speed.innerHTML = this.textAP_Speed;
    this.cellAP_Speed.style.color = this.stateAP_Speed ? "lightgreen" : "red";
}

this.update_counter=0;	
loop_30hz(()=>{
	if(this.store.active && (this.update_counter >= (this.update_interval*30))){
		this.update_counter=0;
		this.update_elements();
	}
	this.update_counter++;
});

run(() => {
	this.store.active=!this.store.active;
	this.$api.datastore.export(this.store);
	this.update_elements();
	return 2000;
});

style(() => {
    return this.store.active ? 'active' : 'inactive';
});