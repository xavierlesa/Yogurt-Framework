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
            log('Yogurt.api.init...');
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

    /* controller */
    Yogurt.controller = Yogurt.api.controller  = function(f,routes,settings){
        if(!iof(f)) return Yogurt.api.controller;

        settings = settings || {}
        var config = {
            path:'',
            extension:'.html',
            interval:100,
            hashstring:'#!/',
            debug:false
        }
        Yogurt.extend(config, settings);
        var _w,_path=config.path;
        this.watch = function(){
            if(top.location.hash.length >= 1 && top.location.hash.split(config.hashstring)[1] != undefined && _w != top.location.hash) {
                _w = top.location.hash; var _h = _w.split(config.hashstring)[1]; var route = N;
                for(i in routes){ 
                if(config.debug){ log(i); log(_h); }
                    var rx = new RegExp(i);
                    route = rx.test(_h) ? [routes[i], (rx.exec(_h)).slice(1)] : N;
                }
                if(route) f(route,Math.random());
            }
        }
        var s=setInterval(this.watch,config.interval);
    };

    Yogurt.templates = Yogurt.api.templates = function(){
        this.template = function(t){ if(t) this._template=t; else return this._template; return this; };
        this.context = function(varname){ return new RegExp('\\$\{ '+varname+' \}', 'g'); return this; };
        this.render = function(data_dict){
            template = this.template();
            for(k in data_dict){ template = template.replace(this.context(k), data_dict[k]) }
            return template;
        };
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
    function v(o){return o !== 0 && o !== F && o.length > 0 && ((isa(o) && o.length > 0) || ( !tou(o) && !n(o) && o != -1)) }
    /* is array? */
    function isa(o){ return o && !(o.propertyIsEnumerable("length")) && too(o) && ton(o.length) && Object.prototype.toString.call(o) === "[object Array]" }
    /* is in array? */
    function ina(a,v){ for(i=0,l=a.length; i<l; i++){ if(a[i] === v) return T } return F }
    /* string to array */
    function sta(o){ return isa(o) ? o : (tos(o) ? o.split(" "): [o]) }
})();
