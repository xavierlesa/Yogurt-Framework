/**
 * Yogurt v1.0
 * https://github.com/ninjaotoko/Yogurt-Framework
 *
 * Ayuda!
 * git@github.com:ninjaotoko/Yogurt-Framework.git
 *
 * Copyright (c) 2011 Xavier Lesa <xavierlesa@gmail.com>
 *
 * Date: Tue Aug 23 12:35:49 ART 2011
 *
 */
(function(){

    /* quick init object window. */
    var window = this, undefined, T = true, F = false, N = null, U = undefined,
    Yogurt = window.Yogurt = function(){ return new Yogurt.api.init() };
    /* prototype */
    Yogurt.api = Yogurt.prototype = {
        iam: "Yogurt v1.0",
        init: function(){
            log(iam);
            return this 
        },

        /* pop()
         * pop(Oject, k[,d]) -> v, remove specified key (or keys into an array) and return the corresponding value.
         * If key is not found, d is returned if given, otherwise KeyError is raised
         */
        pop: function(o,k,d){
            d = d || U;
            k = isa(k) ? k : [k];
            var l = k.length, r=d;
            if(l == 1 && k in o){
                r = o[k]; delete o[k];
            }
            else if(l > 1){
                while(l--){ 
                    r = o[k[l]]; delete o[k[l]];
                }
            }
            return this;
        },

        /* push()
         * push(Object, k, v) -> v, insert specified value for key and return value.
         */
        push: function(o,k,v){
            k = isa(k) ? k : [k];
            v = isa(v) ? v : [v];
            for(i=0;i<=k.length-1;i++){
                o[k[i]] = v[i];
            }
            return this;
        },

        /* map()
         * map(Function, secuence)
         * Return a list of the results of applying the function to the items of the argument 
         */
        map: function(f,s){
            var r = [];
            for(i in s){
                if(tof(s[i]) || iof(s[i])) continue;
                if(isa(s[i]) || ioo(s[i])) { if(s[i].length) r.concat(Yogurt.api.map(f, s[i])) }
                else r.push(f(s[i]));
            }
            return r;
        },

        /* keys()
         * keys(Object)
         * Return a list of keys for Object
         */
        keys: Object.keys,

        /* values()
         * values(Object)
         * Return a list of values for Object
         */
        values: function(o){
            var r = [], k = Yogurt.api.keys(o);
            if(isa(o)) return o;
            for(i in k){
                r.push(k[i])
            }
            return r;
        },

        log:log,
        tou:tou,
        too:too,
        tos:tos,
        ton:ton,
        tof:tof,
        tob:tob,
        to:to,
        ioo:ioo,
        ios:ios,
        iof:iof,
        n:n,
        v:v,
        isa:isa,
        ina:ina,
        sta:sta
    };

    /* extend */
    Yogurt.extend = Yogurt.api.extend = function(obj,prop) {
        if(!prop){ prop = obj; obj = this; }
        for(var i in prop) obj[i] = prop[i];
        return obj;
    };

    /* Controller */
    Yogurt.Controller = Yogurt.api.Controller  = function(f,routes,settings){
        if(!iof(f)) return Yogurt.api.Controller;
        settings = settings || {}
        var config = {
            path:'',
            extension:'',
            interval:100,
            hashstring:'#!/',
            cleanroutes: true,
            debug:false
        }
        Yogurt.extend(config, settings);
        var _w,_h,_path=config.path,_r = N,rx;
        this.watch = function(){
            if(top.location.hash == "") top.location.hash = config.hashstring;
            else if(top.location.hash.length >= 1 && top.location.hash.split(config.hashstring)[1] !== undefined && _w !== top.location.hash) {
                if(config.debug){ console.log('_w:' + _w, top.location.hash); }
                _w = top.location.hash, _h = _w.split(config.hashstring)[1];
                for(i in routes){ 
                    if(config.debug){ console.log(i, _h); }
                    rx = new RegExp(i);
                    _r = rx.test(_h) ? {route:routes[i], data:(rx.exec(_h)).slice(1)} : _r;
                }
                if(_r){
                    if(config.debug) console.log('route:' + _r.route, 'data:' + _r.data);
                    f(_r.route, _r.data, Math.random());
                }
            }
        }
        var s=setInterval(this.watch,config.interval);
    };

    /* Templates */
    Yogurt.Templates = Yogurt.api.Templates = function(){
        this.template = function(t){ if(t) this._template=t; else return this._template; return this; };
        this.context = function(varname){ return new RegExp('\\$\{ '+varname+' \}', 'g'); return this; };
        this.render = function(data_dict){
            template = this.template();
            for(k in data_dict){ template = template.replace(this.context(k), data_dict[k]) }
            return template;
        };

        /* api */
        this.api = this.prototype = { 
            explore: function(o, t){
                var r = '', t = t || '',yt = "<div class=\"${ class }\" id=\"${ id }\">${ data }</div>",ytpl = new Yogurt.Templates(), tpl = new Yogurt.Templates();
                ytpl.template(yt);
                tpl.template(t);

                /* if is array just wrap it */
                if(isa(o)){
                    for(i in o){ 
                        if(tos(o[i]) || ton(o[i])) r += ytpl.render({data: tpl.render({i:o[i]})});
                        else r += tpl.render({data:this.explore(o[i],t)});
                    }
                } else if(ioo(o)){
                    for(i in o){
                        if(tos(o[i]) || ton(o[i])) r += tpl.render({data:o[i]});
                        else r += tpl.render({data:this.explore(o[i],t)});
                    }
                }
                return r;
            }
        }
    };

    /* Queryset */
    Yogurt.Queryset = Yogurt.api.Queryset = function(data){
        this._data = data || []; // list format
        this._objects = []; // store models
        this.fill = function(){
            for(var iter=0; iter <= this._data.length-1; iter++){
                this._objects.push(new Yogurt.Models(this._data[iter]));
            }
        }
        this.count = function(){ return this._objects.length }
        
        /*
         * filter:
         * a == b
         * [field] = val
         *
         * a == b
         * [field]__eq = val
         *
         * a == b (case-insensitive)
         * [field]__ieq = val
         *
         * a != b
         * [field]__noteq = val
         *
         * a != b (case-insensitive)
         * [field]__inoteq = val
         *
         * a <= b
         * [field]__lte = val
         *
         * a >= b
         * [field]__gte = val
         *
         * a < b
         * [field]__lt = val
         *
         * a > b
         * [field]__gt = val
         *
         * a starts with b
         * [field]__startswith = val
         *
         * a starts with b (case-insensitive)
         * [field]__istartswith = val
         *
         * a ends with b
         * [field]__endswith = val
         *
         * a ends with b (case-insensitive)
         * [field]__iendswith = val
         *
         *
         * Making Query:
         *
         * AND reference, (comma splitter)
         *
         * var qs = Yogurt.Queryset(data);
         * qs.filter("country = 'Argentina', year__lte = 2011"); // equal to key == val && key2 == val2
         *
         *
         *
         *
         */
        this.filter = function(filter){
            filter = !tos(filter) ? filter.toString().strip() : filter.strip();
            var filter_and_separator = /,/,
            filter_ops = {
                "AND":      ["=","__eq"],
                "IAND":     ["~=","__ieq"],
                "NOT-AND":  ["!=","__noteq"],
                "NOT-IAND": ["~!=","!~=","__inoteq"],
                "LTE":      ["<=","__lte"],
                "GTE":      [">=","__gte"],
                "LT":       ["<","__lt"],
                "GT":       [">","__gt"],
                "STW":      ["^=","__startswith"],
                "ISTW":     ["~^=","^~=","__istartswith"],
                "EDW":      ["=$","__endswith"],
                "IEDW":     ["~=$","__iendswith"],
                "CONTAINS": ["%=","__contains"],
                "ICONTAINS":["~%=","%~=","__icontains"],
                "REGEX":    ["r=","__regex"]
            },
            filter_ops_regex; 
            // [objects,,,,] 'country', ['__eq','__ieq',,,], 'Argentina' [,prev chain]
            function _filter_chain(obj, key, op, val, qs_chain){
                key = key.strip(), op = op.strip(), val = val.strip();
                //console.log(obj, key, op, val, qs_chain);
                qs_chain = qs_chain || [];
                // equal
                if(ina(filter_ops['AND'],op)) obj.map(function(o){  if(o[key] == val) qs_chain.push(o) });
                // iequal
                if(ina(filter_ops['IAND'],op)) obj.map(function(o){ if((o[key]).toString().toLowerCase() == (val).toString().toLowerCase()) qs_chain.push(o) });
                // not equal
                if(ina(filter_ops['NOT-AND'],op)) obj.map(function(o){  if(o[key] != val) qs_chain.push(o) });
                // not iequal
                if(ina(filter_ops['NOT-IAND'],op)) obj.map(function(o){ if((o[key]).toString().toLowerCase() != (val).toString().toLowerCase()) qs_chain.push(o) });
                // less or equal than
                if(ina(filter_ops['LTE'],op)) obj.map(function(o){  if(o[key] <= val) qs_chain.push(o) });
                // greater or equal than
                if(ina(filter_ops['GTE'],op)) obj.map(function(o){  if(o[key] >= val) qs_chain.push(o) });
                // less than
                if(ina(filter_ops['LT'],op)) obj.map(function(o){  if(o[key] < val) qs_chain.push(o) });
                // greater than
                if(ina(filter_ops['LT'],op)) obj.map(function(o){  if(o[key] > val) qs_chain.push(o) });
                // starts with
                if(ina(filter_ops['STW'],op)) obj.map(function(o){ if( (new RegExp("^"+val)).test(o[key]) ) qs_chain.push(o) });
                // istarts with
                if(ina(filter_ops['ISTW'],op)) obj.map(function(o){ if( (new RegExp("^"+val,"i")).test(o[key]) ) qs_chain.push(o) });
                // ends with
                if(ina(filter_ops['EDW'],op)) obj.map(function(o){ if( (new RegExp(val+"$")).test(o[key]) ) qs_chain.push(o) });
                // iends with
                if(ina(filter_ops['IEDW'],op)) obj.map(function(o){ if( (new RegExp(val+"$","i")).test(o[key]) ) qs_chain.push(o) });
                // contains
                if(ina(filter_ops['CONTAINS'],op)) obj.map(function(o){ if( (new RegExp(val)).test(o[key]) ) qs_chain.push(o) });
                // icontanis
                if(ina(filter_ops['ICONTAINS'],op)) obj.map(function(o){ if( (new RegExp(val,"i")).test(o[key]) ) qs_chain.push(o) });
                // regex
                if(ina(filter_ops['REGEX'],op)) obj.map(function(o){ if( (new RegExp(val)).test(o[key]) ) qs_chain.push(o) });
                return qs_chain;
            }

            // itera entre cada filtro de la cadena
            var qs_chain=[];
            filter = filter.split(filter_and_separator);
            for(var iter=0; iter <= filter.length-1; iter++){
                try{
                    keyval = filter[iter].split(/\=|[\~|\!]+\=|__\w+\s?/g);
                    op = filter[iter].match(/\=|[\~|\!]+\=|__\w+\s?/g);
                    key = keyval[0].strip(), val = keyval[keyval.length-1];
                    _filter_chain(this._objects, key, op[0].strip(), val, qs_chain);
                }
                catch(e){}
            }
            return new Yogurt.Queryset(qs_chain);
        }

        // init
        this.fill();
    };

    /* Models */
    Yogurt.Models = Yogurt.api.Models = function(datastructure){
        this._datastructure = datastructure || {}; // dict
        this._template = "";
        this.toHTML = function(template){
            template = template || this._template;
            tpl = new Yogurt.Templates();
            return tpl.template(template).render(this._datastructure);
        }
        return this._datastructure;
    };





    /* utils and shortcuts */
    function log(v){ console.log(v) }
    /* types */
    function tou(o){ return typeof o == "undefined" }
    function too(o){ return typeof o == "object" }
    function tos(o){ return typeof o == "string" }
    function ton(o){ return typeof o == "number" }
    function tof(o){ return typeof o == "function" }
    function tob(o){ return typeof o == "boolean" }
    function to(o){ return typeof o }
    function ioo(o){ return o instanceof Object }
    function ios(o){ return o instanceof String }
    //function ion(o){ return o instanceof Number }
    function iof(o){ return o instanceof Function }
    //function iob(o){ return o instanceof Boolean }
    /* is null? */
    function n(o){ return o == N }
    /* validate */
    function v(o){return o !== 0 && o !== F && o.length > 0 && !tou(o) && !n(o) && o != -1 }
    /* is array? */
    function isa(o){ return o && !(o.propertyIsEnumerable("length")) && too(o) && ton(o.length) && Object.prototype.toString.call(o) === "[object Array]" }
    /* is in array? */
    function ina(a,v){ for(i=0,l=a.length; i<l; i++){ if(a[i] === v) return T } return F }
    /* string to array */
    function sta(o){ return isa(o) ? o : (tos(o) ? o.split(" "): [o]) }


    /* prototype string */
    // strip, lstrip, rstrip
    if(typeof(String.prototype.strip) === "undefined"){ String.prototype.strip = function() { return String(this).replace(/^\s+|\s+$/g, ''); }; }
    if(typeof(String.prototype.lstrip) === "undefined"){ String.prototype.lstrip = function() { return String(this).replace(/^\s+/g, ''); }; }
    if(typeof(String.prototype.rstrip) === "undefined"){ String.prototype.rstrip = function() { return String(this).replace(/\s+$/g, ''); }; }

})();
