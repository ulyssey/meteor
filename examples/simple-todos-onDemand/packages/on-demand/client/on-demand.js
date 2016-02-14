/**
 * Created by yoh on 2/1/16.
 */
OnDemand = {};
OnDemand._loaded = {};

//todo: find where this implantation is from:
function loadjscssfile(fileInfo){
  var fileref;
  var fileName = fileInfo.url;
  var fileType = fileInfo.type;
  if (fileType === "js"){ //if fileName is a external JavaScript file
    fileref = document.createElement('script');
    fileref.setAttribute("type","text/javascript");
    fileref.setAttribute("src", fileName);
  }
  else if (fileType === "css"){ //if fileName is an external CSS file
    fileref = document.createElement("link");
    fileref.setAttribute("rel", "stylesheet");
    fileref.setAttribute("type", "text/css");
    fileref.setAttribute("href", fileName);
  }
  if (typeof fileref!="undefined")
    document.getElementsByTagName("head")[0].appendChild(fileref)
}

OnDemand.load = function (packageName, callback) {
  Meteor.call("onDemandLoadPackage", packageName, function (err, res) {

    if(err){
      console.log("error when trying loading onDemand package");
    }
    else{
      res.forEach(function (fileInfo) {
        loadjscssfile(fileInfo);
      });
      OnDemand._loaded[packageName] = true;
    }

    //delay for handlebar to take in account a new template
    callback && Meteor.setTimeout(function () {
      callback(err, res);
    },500);
  });
};

OnDemand.loaded = function (packageName) {
  return this._loaded[packageName];
};

