from org.openpnp.machine.reference.driver import GcodeDriver
from org.openpnp.model import LengthUnit, Location

# Move 0,0,0
nozzle.moveToSafeZ()
location = nozzle.getLocation()
nozzle.moveTo(Location(LengthUnit.Millimeters, 0, 0, location.getZ(), 0))

# Turn off backlash
driver = machine.getDriver()
driver.setBacklashOffsetX(0)
driver.setBacklashOffsetY(0)
