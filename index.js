#!/usr/bin/env node

/* 
 * wsd2alps utility
 * 2018-06
 * mamund
 */

var program = require('commander');
var fs = require('fs');

program
  .arguments('<file>')
  .action(function(file){wsd2alps(file)})
  .parse(process.argv);


function wsd2alps(file) {
  var wsd, lines;
  var actions = [];
  var resources = [];
  var i,x,z;

  // read the file
  wsd = fs.readFileSync(file, 'utf8');

  // parse the lines
  lines = wsd.split('\n');
  for(i=0,x=lines.length;i<x;i++) {
    z = lines[i].indexOf(':');
    if(z!==-1) {
      resources.push(lines[i].substring(0,z).trim());
      actions.push(lines[i].substring(z+1).trim());
    }
  }

  // echo for debugging
  for(i=0,x=resources.length;i<x;i++) {
    console.log(resources[i]);
  }
  for(i=0,x=actions.length;i<x;i++) {
    console.log(actions[i]);
  }
}
