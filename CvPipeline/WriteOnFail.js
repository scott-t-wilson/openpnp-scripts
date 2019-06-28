var imports = new JavaImporter(org.opencv.imgcodecs.Imgcodecs);

var message = "If result stage returns null, save the first and last image of the pipeline. The scripts argument is the filename prefix.\n\n";

// Check both 'result' and 'results', since they're both valid
var result_stage = pipeline.getResult("result");
if (result_stage == null){
    result_stage = pipeline.getResult("results")
}
if (result_stage == null || result_stage.getModel() == null ){
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
}else{
    message += "Result stage was successful. No images saved.\n";
}

// Final object is returned
new Packages.org.openpnp.vision.pipeline.CvStage.Result(pipeline.getWorkingImage(), message);