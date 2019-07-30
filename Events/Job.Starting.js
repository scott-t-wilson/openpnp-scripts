var upCamLights = machine.getActuatorByName("UpCamLights");
if (upCamLights) {
	upCamLights.actuate(true);
}
var downCamLights = machine.getActuatorByName("DownCamLights");
if (downCamLights) {
	downCamLights.actuate(true); 
}
