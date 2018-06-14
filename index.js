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
  var arcs = []
  var i,x,z,w,y;
  var tmp;

  // read the file
  console.log("wsd:");
  wsd = fs.readFileSync(file, 'utf8');

  console.log(wsd);

  // parse the lines
  lines = wsd.split('\n');
  for(i=0,x=lines.length;i<x;i++) {
    z = lines[i].indexOf(':');
    if(z!==-1) {
      arcs.push(lines[i].substring(0,z).trim());
      actions = pushNew(actions,lines[i].substring(z+1).trim());
    }
  }

  // clean up arcs as resources
  blocks = ["-->+","->+","-->-","->-"];
  for(i=0,x=arcs.length;i<x;i++) {
    tmp = arcs[i].trim();
    if(tmp.length!==0)  {
      for(w=0,y=blocks.length;w<y;w++) {
        z = tmp.indexOf(blocks[w]);
        if(z!==-1) {
          resources = pushNew(resources,tmp.substring(0,z).trim());
          resources = pushNew(resources,tmp.substring(z+blocks[w].length).trim());
          arcs[i] = "";
          tmp = "";
        }
      }
    }
  }

  // echo for debugging
  console.log("resources:");
  for(i=0,x=resources.length;i<x;i++) {
    console.log(resources[i]);
  }
  console.log("actions:");
  for(i=0,x=actions.length;i<x;i++) {
    console.log(actions[i]);
  }
}

// utility function
function pushNew(array,value) {
  var i,x;
  var exists = false;

  for(i=0,x=array.length;i<x;i++) {
    if(array[i]===value) {
      exists = true;
    }
  }
  if(!exists) {
    array.push(value);
  }
  return array;
}
