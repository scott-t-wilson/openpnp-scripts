from __future__ import absolute_import, division
from time import sleep

from javax.swing.JOptionPane import showMessageDialog
from org.openpnp.model import LengthUnit, Location
from org.openpnp.machine.reference.driver.GcodeDriver import CommandType
from org.openpnp.util.MovableUtils import moveToLocationAtSafeZ


vacSensor = machine.defaultHead.getActuatorByName("Vacuum_Sense_0")
nozzle = machine.defaultHead.defaultNozzle
probe_location = Location(LengthUnit.Millimeters, -2.5, 15, -0.5, 0)


def move_z(distance):
    nozzle.moveTo(
        nozzle.location.add(Location(LengthUnit.Millimeters, 0, 0, distance, 0))
    )


def print_location(location):
    print("Location: {}".format(location.toString()))


def probe_contact(travel, vac_threshold=900, settle_time=1, max_moves=11):
    move_count = 0
    sleep(settle_time)  # Allow vac to settle
    vac_level = int(vacSensor.read())
    print(
        "Starting %.2f probe at Z:%.2f, Vac: %d"
        % (travel, nozzle.location.z, vac_level)
    )
    while vac_level > vac_threshold and move_count < max_moves:
        move_count += 1
        move_z(travel)
        sleep(settle_time)  # Allow vac to settle
        vac_level = int(vacSensor.read())
        print("Z: %.2f, Vac: %d" % (nozzle.location.z, vac_level))
    return nozzle.location.z


def home_z():
    """
    Uses the vacuum sensor to probe z-height at the current location.
    """
    nozzle.moveToSafeZ()
    nozzle.moveTo(probe_location.derive(None, None, float("nan"), None))
    nozzle.moveTo(probe_location)

    # Enable vacuum
    machine.driver.sendCommand(
        machine.driver.getCommand(nozzle, CommandType.PUMP_ON_COMMAND)
    )
    machine.driver.sendCommand(
        machine.driver.getCommand(nozzle, CommandType.PICK_COMMAND)
    )

    # Start our 1mm probe
    print("Starting 1mm down probe")
    probe_contact(-1, settle_time=0)
    print("Moving up 1.1mm")
    move_z(1.1)

    # Start our 0.1mm probe
    probe_contact(-0.1, settle_time=0.25)
    print("Moving up 0.11mm")
    move_z(0.11)

    # Start our 0.01mm probe
    # This is pretty slow, particularly if you end up moving 10x.
    final_height = probe_contact(-0.01, settle_time=1)
    print("Final height found!")
    print("Z: %.2f, Vac: %d" % (final_height, int(vacSensor.read())))

    # Disable vacuum
    machine.driver.sendCommand(
        machine.driver.getCommand(nozzle, CommandType.PLACE_COMMAND)
    )
    machine.driver.sendCommand(
        machine.driver.getCommand(nozzle, CommandType.PUMP_OFF_COMMAND)
    )

    # Return safe height
    machine.driver.sendCommand("G28.3 Z-25.0")
    nozzle.moveToSafeZ()
    return final_height


final_height = home_z()
