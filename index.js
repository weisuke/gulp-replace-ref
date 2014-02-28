var through = require('through2'),
    gutil = require('gulp-util'),
    vfs = require('vinyl-fs'),
    es = require('event-stream'),
    fs = require('fs'),
    PluginError = gutil.PluginError;

// Consts
const PLUGIN_NAME = 'gulp-replace-ref';

// Plugin level function (dealing with files)
function gulpReplaceRef(opts) {

    opts = opts || {};

    var stream;

    // Creating a stream through which each file will pass
    stream = through.obj(function (srcFile, enc, callback) {
        var self = this;
        if (srcFile.isNull()) {
            self.push(srcFile); // Do nothing if no contents
            return callback();
        }

        if (srcFile.isBuffer()) {

            var strToReplace = srcFile.path.match( opts.srcMatch )[0], stream, targetMatch = opts.targetMatch;

            vfs.src(opts.target).pipe(stream = es.map(function(phpFile, cb){
                //console.log(phpFile.path);
                var content = phpFile.contents.toString();
                if(targetMatch(srcFile.path).test(content)){
                    fs.writeFile(phpFile.path, content.replace(targetMatch(srcFile.path), strToReplace));
                    console.log('php file updated: ' + phpFile.path);
                    stream.destroy();
                }

                cb(null, phpFile);
            }));


            self.push(srcFile);
            return callback();
        }

        if (srcFile.isStream()) {
            this.emit('error', new PluginError(PLUGIN_NAME, 'Streams are not supported!'));
            return callback();
        }
    });

    // returning the file stream
    return stream;
};

// Exporting the plugin main function
module.exports = gulpReplaceRef;
