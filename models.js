/*
 * modelos json
 */

// modelo abstracto
var Model = function(datastructure){
    this._datastructure = datastructure || {};
    this.render = function(){  }
}

// modelo para galeria de imagenes
var gallery_model = {
    _template : "<img src=\"${ src }\" alt=\"${ alt }\" title=\"${ title }\" />",
    title : "",
    alt : "",
    src : ""
}

// modelo para objeto
var object_model = {
    _template : "<div class=\"item\"><div class=\"title\">${ title }</div><div class=\"content\">${ content }</div></div>",
    name : "",
    title : "",
    content : "",
    images : [gallery_model]
}


