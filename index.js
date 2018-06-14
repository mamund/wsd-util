#!/usr/bin/env node

/* 
 * wsd2alps utility
 * 2018-06
 * mamund
 */

"use strict";

var program = require('commander');
var fs = require('fs');

program
  .arguments('<file>')
  .action(function(file){wsd2alps(file)})
  .parse(process.argv);

// main routine
function wsd2alps(file) {
  var wsd;
  var parse = {actions:[], arcs:[], resources:[], lines:[], alps:{}}

  wsd = fs.readFileSync(file, 'utf8');
  parseLines(wsd,parse);
  cleanArcs(parse);
  buildAlps(file, parse);
  writeAlps(file, parse);
}


// write out results
function writeAlps(file, parse) {
  var afile = file.replace(".wsd","-alps.json");
  fs.writeFile(afile,JSON.stringify(parse.alps,null,2), function(err) {
    if(err) {
      console.log(err);
    }
    else {
      console.log(afile + " written.");
    }
  });
}

// compose ALPS doc
function buildAlps(file, parse) {
  var rtn = {};
  var i, x, d, z;
  var actions = parse.actions;
  var resources = parse.resources;

  rtn.alps = {};
  rtn.alps.version = "1.0";
  rtn.alps.title = file;
  rtn.alps.doc = {type : "text", value : "ALPS document for " + file};
  rtn.alps.descriptors = [];

  // handle resources
  for(i=0,x=resources.length;i<x;i++) {
    d = {id: resources[i], type : "group"}
    rtn.alps.descriptors.push(d);
  }

  // handle actions
  for(i=0,x=actions.length;i<x;i++) {
    z = actions[i].indexOf("|");
    d = {id : actions[i].substring(0,z), type : actions[i].substring(z+1), rtn  : ""}
    rtn.alps.descriptors.push(d);
  }
  parse.alps = rtn;
  return parse;
}

// break into lines
function parseLines(wsd, parse) {
  var lines = [];
  var arcs = [];
  var actions = [];
  var i, x, z, tmp;

  // parse the lines
  lines = wsd.split('\n');
  for(i=0,x=lines.length;i<x;i++) {
    z = lines[i].indexOf(':');
    if(z!==-1) {
      tmp = lines[i].substring(0,z).trim();
      arcs.push(tmp);
      actions = pushNew(actions,lines[i].substring(z+1).trim()+"|"+(tmp.indexOf("--")!==-1?"unsafe":"safe"));
    }
  }
  parse.arcs = arcs;
  parse.actions = actions;
  return parse;
}

// clean up arcs as resources
function cleanArcs(parse) {
  var i,x,w,y,z,tmp;
  var blocks = ["-->+","->+","-->-","->-"];
  var resources = [];
  var arcs = parse.arcs;

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
  parse.resources = resources;
}

// unique array member function
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


