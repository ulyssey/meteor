/**
 * Created by yoh on 2/1/16.
 */
OnDemand = {};
OnDemand.loaded = {};



//todo: find where this implantation is from:
function loadjscssfile(filename, filetype){
  if (filetype=="js"){ //if filename is a external JavaScript file
    var fileref = document.createElement('script')
    fileref.setAttribute("type","text/javascript")
    fileref.setAttribute("src", filename)
  }
  else if (filetype=="css"){ //if filename is an external CSS file
    var fileref=document.createElement("link")
    fileref.setAttribute("rel", "stylesheet")
    fileref.setAttribute("type", "text/css")
    fileref.setAttribute("href", filename)
  }
  if (typeof fileref!="undefined")
    document.getElementsByTagName("head")[0].appendChild(fileref)
}

OnDemand.load = function (packageName, callback) {
  Meteor.call("onDemandLoadPackage", packageName, function (err, res) {
    console.log(packageName + ' loading');
    if(err){
      console.log(res);
    }
    else{
      console.log(res);
      loadjscssfile(res.url, res.type);
      OnDemand.loaded[packageName] = true;
    }
    console.log(packageName + ' loaded');
    callback(err, res);
  });
};
