 var upCamLights = machine.getActuatorByName("UpCamLights");
 var downCamLights = machine.getActuatorByName("DownCamLights");
 if (upCamLights) {
	upCamLights.actuate(true);
 }
 if (downCamLights) {
	downCamLights.actuate(true); 
 }

