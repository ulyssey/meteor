/**
 * Created by yoh on 2/1/16.
 */
OnDemand = {};
OnDemand._loaded = {};



//todo: find where this implantation is from:
function loadjscssfile(fileInfo){
  var fileName = fileInfo.url;
  var fileType = fileInfo.type;
  if (fileType === "js"){ //if fileName is a external JavaScript file
    var fileref = document.createElement('script')
    fileref.setAttribute("type","text/javascript")
    fileref.setAttribute("src", fileName)
  }
  else if (fileType === "css"){ //if fileName is an external CSS file
    var fileref=document.createElement("link")
    fileref.setAttribute("rel", "stylesheet")
    fileref.setAttribute("type", "text/css")
    fileref.setAttribute("href", fileName)
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
      res.forEach(function (fileInfo) {
        loadjscssfile(fileInfo);
      });
      OnDemand._loaded[packageName] = true;
    }
    console.log(packageName + ' loaded');
    //delay for handlebar to take in account a new template
    callback && Meteor.setTimeout(function () {
      callback(err, res);
    },100);
  });
};

OnDemand.loaded = function (packageName) {
  return this._loaded[packageName];
};

