/**
 * Controls lighting for the two cameras using two named actuators. All
 * of the lights are turned off.
 */

var upCamLights = machine.getActuatorByName("UpCamLights");
if (upCamLights) {
	upCamLights.actuate(false);
}

var downCamLights = machine.getActuatorByName("DownCamLights");
if (downCamLights) {
	downCamLights.actuate(false); 
}

var imports = new JavaImporter(org.openpnp.model, org.openpnp.util);
with (imports) {
	task(function() {
		var nozzle = machine.defaultHead.defaultNozzle;
		var location = nozzle.location;

		// Move to rotation 0
		location = location.derive(null, null, null, 0);
		nozzle.moveTo(location);
	});
}
