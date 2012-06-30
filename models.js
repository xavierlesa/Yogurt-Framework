/*
Un modelo es un conjunto de datos "encapsulados".
tien un grupo de metodos para acceder a estos datos
*/

var Model = function(data) {
    var _data = { /* mappedo de datos key:val */ };
    
    return ({
        init: function() { 
            if (data) _data = data; 
            return this ;
        },
        get: function(k) {
            return _data[k];
        },
        set: function(k, v) {
            return _data[k] = v;
        },
        fields: function() {
            return Object.keys(_data);
        },
        toString: function() {
            for(var d=[],f=0; f<this.fields().length; d[f]=_data[this.fields()[f]], f++);
            return d;
        },
        valueOf: function(){ 
            return this.toString();
        }
    }).init();
}


var modelo = new Model({
    band: 'Devin Towsend',
    album: 'Deconstruction',
    year: 2010
});

console.log(modelo.toString());
