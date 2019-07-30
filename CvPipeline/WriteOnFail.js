var imports = new JavaImporter(org.opencv.imgcodecs.Imgcodecs, org.pmw.tinylog.Logger);

imports.Logger.info("Test log");

var message = "If result stage returns null, save the first and last image of the pipeline. The scripts argument is the filename prefix.\n\n";

// Check both 'result' and 'results', since they're both valid
var result_stage = pipeline.getResult("result");
if (result_stage == null) {
    result_stage = pipeline.getResult("results")
}
if (result_stage == null || result_stage.getModel() == null) {
    var file_prefix = args + Date.now();
    var source_file = file_prefix + "_src.png";
    var result_file = file_prefix + "_res.png";
    message += "Result stage was null, writing images:\n"
    message += "  Source Image: '" + source_file + "'\n";
    message += "  Result Image: '" + result_file + "'\n";
    var source_stage = pipeline.getResult(pipeline.stages[0]);
    with (imports) {
        Imgcodecs.imwrite(source_file, source_stage.getImage());
        Imgcodecs.imwrite(result_file, pipeline.getWorkingImage());
    }
} else {
    message += "Result stage was successful. No images saved.\n\n";
    message += result_stage.getModel();
    message += "\n";
    try {
        var config_imports = new JavaImporter(org.openpnp.model.Configuration);
        var config = config_imports.Configuration.get();
        var machine = config.getMachine();
        var nozzle = machine.defaultHead.defaultNozzle;


        // INFO: id C_0603-18pF, name null, heightUnits Millimeters, height 0.700000, packageId (C_0603)
        // INFO: (-53.721066, 36.463526, 0.700000, -179.846174 mm)
        // INFO: { {635.7432861328125, 549.2435913085938} 113x59 * -1.5074357986450195 }

        imports.Logger.info("STW: " + nozzle.getPart());
        imports.Logger.info("STW: " + nozzle.getLocation());
        imports.Logger.info("STW: " + result_stage.getModel());

        imports.Logger.debug(typeof nozzle.getPart().getId())
        imports.Logger.debug(typeof nozzle.getLocation().getRotation())
        imports.Logger.debug(typeof result_stage.getModel())

        imports.Logger.debug(nozzle.getPart().getId())
        imports.Logger.debug(nozzle.getLocation().getRotation())
    } catch (err) {
        message += "Fail.\n";
        message += err;
        imports.Logger.info(err);
    }
}

// Final object is returned
new Packages.org.openpnp.vision.pipeline.CvStage.Result(pipeline.getWorkingImage(), message);

