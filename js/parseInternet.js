// Utility to convert worldbank it.net.user.p2_Indicator_en_csv_v2.csv   to JSON
//
// Author: Jan van der Meiden
// Copyright (c) 2015 Jan van der Meiden
// Copying and distribution of this file, with or without modification,
// are permitted in any medium without royalty provided the copyright
// notice and this notice are preserved.
//
// Fields 
// 0 "Country Name"
// 1 "Country Code"
// 2 "Indicator Name"
// 3 "Indicator Code"
// 4 "1960"
// .....
// 
// 44 "2010"
// 45 "2011"
// 46 "2012"
// 47 "2013"
// 48 "2014"
// 49 "2015"

var    path = require('path'),
  fs = require('fs');
var filename = path.join(process.cwd(), process.argv[2]);
fs.readFile( filename, 'utf8', function (err,data) {
  var list = new Object();
  lines=data.split('\n');
  attr0=lines[0].split(',');
  for( var i=1 ; i < lines.length; i++){
    attr=lines[i].split(',');    
    list[attr[1]]={"name": attr[0]};
    for( var j=4 ; j < attr.length; j++){
      list[attr[1]][attr0[j]]=parseFloat(attr[j]);
    }
  }
  console.log(JSON.stringify(list));
});

