#!/usr/bin/env node

//
// This hook copies various resource files from our version control system directories into the appropriate platform specific location
//


// configure all the files to copy.  Key of object is the source file, value is the destination location.  It's fine to put all platforms' icons and splash screen files here, even if we don't build for all platforms on each developer's box.
var filestocopy = [
// android
{ "res/icons/android/icon-36-ldpi.png": "platforms/android/res/drawable-ldpi/icon.png" },
{ "res/icons/android/icon-48-mdpi.png": "platforms/android/res/drawable-mdpi/icon.png" },
{ "res/icons/android/icon-72-hdpi.png": "platforms/android/res/drawable-hdpi/icon.png" },
{ "res/icons/android/icon-96-xhdpi.png": "platforms/android/res/drawable-xhdpi/icon.png" },
{ "res/icons/android/icon-144-xxhdpi.png": "platforms/android/res/drawable-xxhdpi/icon.png" },
{ "res/icons/android/icon-192-xxxhdpi.png": "platforms/android/res/drawable-xxxhdpi/icon.png" },
{ "res/icons/mappointer_small.png": "platforms/android/res/drawable/mappointer_small.png" },
{ "res/icons/mappointer_large.png": "platforms/android/res/drawable/mappointer_large.png" }
];

var fs = require('fs');
var path = require('path');

// no need to configure below
var rootdir = '';//process.argv[2];

if (!fs.existsSync("platforms/android/res/drawable")){
    fs.mkdirSync("platforms/android/res/drawable");
}

filestocopy.forEach(function(obj) {
    Object.keys(obj).forEach(function(key) {
        var val = obj[key];
        var srcfile = path.join(rootdir, key);
        var destfile = path.join(rootdir, val);
        console.log("copying "+srcfile+" to "+destfile);
        var destdir = path.dirname(destfile);
        if (fs.existsSync(srcfile) && fs.existsSync(destdir)) {
            fs.createReadStream(srcfile).pipe(fs.createWriteStream(destfile));
        }
    });
});
