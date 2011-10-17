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
    var window = this, undefined, T = true, F = false, N = null, U = undefined, Fn = Function, Obj = Object, Str = String, Num = Number, Bool = Boolean,
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
        keys: Obj.keys,

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
        ion:ion,
        ios:ios,
        iof:iof,
        iob:iob,
        ioi:ioi,
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
            cleanroutes: T,
            debug:F
        }
        Yogurt.extend(config, settings);
        var _w,_h,_path=config.path,_r = N,rx;
        this.watch = function(){
            if(top.location.hash == "") top.location.hash = config.hashstring;
            else if(top.location.hash.length >= 1 && top.location.hash.split(config.hashstring)[1] !== U && _w !== top.location.hash) {
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
            data_dict = isa(data_dict) ? data_dict : [data_dict];
            for(var i=0;i<=data_dict.length-1;i++){
                for(k in data_dict[i]){ template = template.replace(this.context(k), data_dict[i][k]) }
            }
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
    Yogurt.Queryset = Yogurt.api.Queryset = function(data, Model){
        var Model = Model || Yogurt.Models;
        this._data = data || []; // list format
        this.objects = []; // store models
        this._fill = function(){
            for(var iter=0; iter <= this._data.length-1; iter++){
                this.objects.push( this._data[iter] instanceof Yogurt.Models ? this._data[iter] : new Model(this._data[iter]) );
            }
        }
        this.iter = function(f,i,o){ return this.objects.map(f,i,o); }
        this.count = function(){ return this.objects.length }
        
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
            var filter_and_separator = /\s?[,|&|&&]+\s?/g,
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
            filter_ops_regex, qs_chain = this.objects;
            // [objects,,,,] 'country', ['__eq','__ieq',,,], 'Argentina' [,prev chain]
            function _normalize(o){ return isNaN(o) ? o.strip() : Num(o) }
            function _filter_chain(obj, key, op, val){
                key = key.strip(), 
                op = op.strip(), 
                val = isNaN(val) ? val.strip() : Num(val.strip());

                //console.log(obj.length, key, op, val);

                var qs_chain = [];
                // equal
                if(ina(filter_ops['AND'],op)) obj.map(function(o){  if( _normalize(o.data[key]) == val) qs_chain.push(o) });
                // iequal
                if(ina(filter_ops['IAND'],op)) obj.map(function(o){ if((o.data[key]).toString().toLowerCase() == (val).toString().toLowerCase()) qs_chain.push(o) });
                // not equal
                if(ina(filter_ops['NOT-AND'],op)) obj.map(function(o){  if( _normalize(o.data[key]) != val) qs_chain.push(o) });
                // not iequal
                if(ina(filter_ops['NOT-IAND'],op)) obj.map(function(o){ if((o.data[key]).toString().toLowerCase() != (val).toString().toLowerCase()) qs_chain.push(o) });
                // less or equal than
                if(ina(filter_ops['LTE'],op)) obj.map(function(o,i){ if( _normalize(o.data[key]) <= val) qs_chain.push(o) });
                // greater or equal than
                if(ina(filter_ops['GTE'],op)) obj.map(function(o){  if( _normalize(o.data[key]) >= val) qs_chain.push(o) });
                // less than
                if(ina(filter_ops['LT'],op)) obj.map(function(o){  if( _normalize(o.data[key]) < val) qs_chain.push(o) });
                // greater than
                if(ina(filter_ops['LT'],op)) obj.map(function(o){  if( _normalize(o.data[key]) > val) qs_chain.push(o) });
                // starts with
                if(ina(filter_ops['STW'],op)) obj.map(function(o){ if( (new RegExp("^"+val)).test(o.data[key]) ) qs_chain.push(o) });
                // istarts with
                if(ina(filter_ops['ISTW'],op)) obj.map(function(o){ if( (new RegExp("^"+val,"i")).test(o.data[key]) ) qs_chain.push(o) });
                // ends with
                if(ina(filter_ops['EDW'],op)) obj.map(function(o){ if( (new RegExp(val+"$")).test(o.data[key]) ) qs_chain.push(o) });
                // iends with
                if(ina(filter_ops['IEDW'],op)) obj.map(function(o){ if( (new RegExp(val+"$","i")).test(o.data[key]) ) qs_chain.push(o) });
                // contains
                if(ina(filter_ops['CONTAINS'],op)) obj.map(function(o){ if( (new RegExp(val)).test(o.data[key]) ) qs_chain.push(o) });
                // icontanis
                if(ina(filter_ops['ICONTAINS'],op)) obj.map(function(o){ if( (new RegExp(val,"i")).test(o.data[key]) ) qs_chain.push(o) });
                // regex
                if(ina(filter_ops['REGEX'],op)) obj.map(function(o){ if( (new RegExp(val)).test(o.data[key]) ) qs_chain.push(o) });
                return qs_chain;
            }

            // itera entre cada filtro de la cadena
            filter = filter.split(filter_and_separator);
            console.log(filter);

            for(var iter=0; iter <= filter.length-1; iter++){
                keyval = filter[iter].split(/\=|[\~|\!|\<|\>]+\=|__\w+\s?/g),
                op = filter[iter].match(/\=|[\~|\!|\<|\>]+\=|__\w+\s?/g),
                key = _normalize(keyval[0]),
                val = keyval[keyval.length-1];
                qs_chain = _filter_chain(qs_chain, key, _normalize(op[0]), val);
            }
            //console.log(qs_chain);
            return new Yogurt.Queryset(qs_chain);
        }

        /*
         * group by
         *
         * return an Object withing Arrays of Queryset
         *
         */
        this.group_by = function(field){
            var grp = {};
            this.objects.map(function(o){ 
                grp[o.data[field]] = [];
            });
            for(iter in grp){
                if(!tou(iter) && iter!=U) grp[iter] = this.filter( field+"__ieq = "+iter );
            }
            return grp;
        }

        // init
        this._fill();
    };

    /* Models */
    Yogurt.Models = Yogurt.api.Models = function(data, Model){
        var Model = Model || Yogurt.Models;
        this.data = data || {}; // dict
        this.extend = Yogurt.extend;
        this._template = "";
        this.toHTML = function(template, extra_context){
            template = template || this._template;
            extra_context = extra_context || {}
            tpl = new Yogurt.Templates();
            return tpl.template(template).render(Yogurt.api.extend(this.data, extra_context));
        };

        // setter, getter
        this._setget = function(k,v){
            if(k&&v&&this[k]){ this[k] = v; return this }
            else if(k&&this[k]) return this[k];
            else for(var key in this.data){
                if(!this.hasOwnProperty('get'+key)) this['get'+key] = function(){ return this.data[key] }
                if(!this.hasOwnProperty('set'+key)) this['set'+key] = function(d){ this.data[key] = d; return this.data[key] }
            }
        };

        // set data
        this._setdata = function(){
            for(key in this.data){
                // itera buscando relaciones (todo lo que es objeto es relacionado)
                Model = this.hasOwnProperty('_'+key+'_model') ? this['_'+key+'_model'] : Model;
                //console.log(key, this.hasOwnProperty('_'+key+'_model'));
                if(ioo(this.data[key])) this.data[key] = isa(this.data[key]) ? new Yogurt.Queryset(this.data[key], Model) : new Model(this.data[key]);
            }
            this._setget();
        };
        
        this.toString = function(){ 
            keys = Object.keys(this.data); 
            vals = []; 
            for(i in this.data) vals.push(this.data[i]);
            return ""+[keys, vals];
        };

        // init model data
        this._setdata();
        //this._setget();

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
    function ioo(o){ return o instanceof Obj }
    function ios(o){ return o instanceof Str }
    function ion(o){ return o instanceof Num }
    function iof(o){ return o instanceof Fn }
    function iob(o){ return o instanceof Bool }
    function ioi(o,i){ return o instanceof i }
    /* is null? */
    function n(o){ return o == N }
    /* validate */
    function v(o){return o !== 0 && o !== F && o.length > 0 && !tou(o) && !n(o) && o != -1 }
    /* is array? */
    function isa(o){ return o && !(o.propertyIsEnumerable("length")) && too(o) && ton(o.length) && Obj.prototype.toString.call(o) === "[object Array]" }
    /* is in array? */
    function ina(a,v){ for(i=0,l=a.length; i<l; i++){ if(a[i] === v) return T } return F }
    /* string to array */
    function sta(o){ return isa(o) ? o : (tos(o) ? o.split(" "): [o]) }
    function _safe_str(input){
        function _s(s){
            var l = s.length;
            if (l == 0) return '0000';
            if (l == 1) return '000' + s;
            if (l == 2) return '00' + s;
            if (l == 3) return '0' + s;
            return s;
        }
        var o = '';
        for (var i=0, l=input.length; i<l; i++) o +=  (new RegExp(/\w|\d|\s/)).test(input[i]) ? input[i] : '\\u' + _s(input.charCodeAt(i).toString(16));
        return o;
    }


    /* prototype string */
    // strip, lstrip, rstrip, safe
    if(typeof(Str.prototype.strip) === "undefined"){ Str.prototype.strip = function(){ return Str(this).replace(/^\s+|\s+$/g, ''); } }
    if(typeof(Str.prototype.lstrip) === "undefined"){ Str.prototype.lstrip = function(){ return Str(this).replace(/^\s+/g, ''); } }
    if(typeof(Str.prototype.rstrip) === "undefined"){ Str.prototype.rstrip = function(){ return Str(this).replace(/\s+$/g, ''); } }
    if(typeof(Str.prototype.safe) == "undefined"){ Str.prototype.safe = function(){ return _safe_str(Str(this)); } }

})();
