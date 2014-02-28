gulp-replace-ref
======================

Replace the file references in the target fies, it's useful when some external files are renamed, and need to be updated manually in the referenced files.

## Usage

```javascript
var gulp = require('gulp'),
    changed = require('gulp-changed'),
    replaceRef = require('gulp-replace-ref');


var paths = {
    scripts: {
        src: 'js/ctv/dev/modules/**/main*.js',
        dest : 'js/ctv/build'
    }
};

gulp.task('compile', function(){
    // place code for your default task here

    return gulp.src(paths.scripts.src)
        .pipe(changed(paths.scripts.dest + '/modules'))
        .pipe(replaceRef({
            target : [
                'protected/views/*/*.php',
                'protected/modules/*/views/*/*.php',
                'protected/components/*/views/*.php',
                'protected/modules/*/components/*/views/*.php'
            ],
            srcMatch : /modules.*main.*[1-9]/gm,
            targetMatch : function(filePath){
                return new RegExp(filePath.match(/modules.*main_v/gm)[0] + '.*[1-9]', 'gm');
            }
        }))
        .pipe(gulp.dest(paths.scripts.dest))


});
```

## Options

- `target`

	glob expressions that specify on which target files will be scanned for the references matched by `srcMatch`

- `srcMatch`

	The regular expression used to extract the portion from the file path that will be replaced in the target files
	
- `targetMatch`

  The regular expression used to match the string to replace in the target file
