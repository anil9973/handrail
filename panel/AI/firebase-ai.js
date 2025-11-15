var _e=()=>{};var Se=function(t){let e=[],n=0;for(let s=0;s<t.length;s++){let i=t.charCodeAt(s);i<128?e[n++]=i:i<2048?(e[n++]=i>>6|192,e[n++]=i&63|128):(i&64512)===55296&&s+1<t.length&&(t.charCodeAt(s+1)&64512)===56320?(i=65536+((i&1023)<<10)+(t.charCodeAt(++s)&1023),e[n++]=i>>18|240,e[n++]=i>>12&63|128,e[n++]=i>>6&63|128,e[n++]=i&63|128):(e[n++]=i>>12|224,e[n++]=i>>6&63|128,e[n++]=i&63|128)}return e},lt=function(t){let e=[],n=0,s=0;for(;n<t.length;){let i=t[n++];if(i<128)e[s++]=String.fromCharCode(i);else if(i>191&&i<224){let r=t[n++];e[s++]=String.fromCharCode((i&31)<<6|r&63)}else if(i>239&&i<365){let r=t[n++],o=t[n++],a=t[n++],l=((i&7)<<18|(r&63)<<12|(o&63)<<6|a&63)-65536;e[s++]=String.fromCharCode(55296+(l>>10)),e[s++]=String.fromCharCode(56320+(l&1023))}else{let r=t[n++],o=t[n++];e[s++]=String.fromCharCode((i&15)<<12|(r&63)<<6|o&63)}}return e.join("")},Ce={byteToCharMap_:null,charToByteMap_:null,byteToCharMapWebSafe_:null,charToByteMapWebSafe_:null,ENCODED_VALS_BASE:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",get ENCODED_VALS(){return this.ENCODED_VALS_BASE+"+/="},get ENCODED_VALS_WEBSAFE(){return this.ENCODED_VALS_BASE+"-_."},HAS_NATIVE_SUPPORT:typeof atob=="function",encodeByteArray(t,e){if(!Array.isArray(t))throw Error("encodeByteArray takes an array as a parameter");this.init_();let n=e?this.byteToCharMapWebSafe_:this.byteToCharMap_,s=[];for(let i=0;i<t.length;i+=3){let r=t[i],o=i+1<t.length,a=o?t[i+1]:0,l=i+2<t.length,u=l?t[i+2]:0,E=r>>2,S=(r&3)<<4|a>>4,C=(a&15)<<2|u>>6,p=u&63;l||(p=64,o||(C=64)),s.push(n[E],n[S],n[C],n[p])}return s.join("")},encodeString(t,e){return this.HAS_NATIVE_SUPPORT&&!e?btoa(t):this.encodeByteArray(Se(t),e)},decodeString(t,e){return this.HAS_NATIVE_SUPPORT&&!e?atob(t):lt(this.decodeStringToByteArray(t,e))},decodeStringToByteArray(t,e){this.init_();let n=e?this.charToByteMapWebSafe_:this.charToByteMap_,s=[];for(let i=0;i<t.length;){let r=n[t.charAt(i++)],a=i<t.length?n[t.charAt(i)]:0;++i;let u=i<t.length?n[t.charAt(i)]:64;++i;let S=i<t.length?n[t.charAt(i)]:64;if(++i,r==null||a==null||u==null||S==null)throw new J;let C=r<<2|a>>4;if(s.push(C),u!==64){let p=a<<4&240|u>>2;if(s.push(p),S!==64){let g=u<<6&192|S;s.push(g)}}}return s},init_(){if(!this.byteToCharMap_){this.byteToCharMap_={},this.charToByteMap_={},this.byteToCharMapWebSafe_={},this.charToByteMapWebSafe_={};for(let t=0;t<this.ENCODED_VALS.length;t++)this.byteToCharMap_[t]=this.ENCODED_VALS.charAt(t),this.charToByteMap_[this.byteToCharMap_[t]]=t,this.byteToCharMapWebSafe_[t]=this.ENCODED_VALS_WEBSAFE.charAt(t),this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[t]]=t,t>=this.ENCODED_VALS_BASE.length&&(this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(t)]=t,this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(t)]=t)}}},J=class extends Error{constructor(){super(...arguments),this.name="DecodeBase64StringError"}},dt=function(t){let e=Se(t);return Ce.encodeByteArray(e,!0)},K=function(t){return dt(t).replace(/\./g,"")},Oe=function(t){try{return Ce.decodeString(t,!0)}catch(e){console.error("base64Decode failed: ",e)}return null};function ut(){if(typeof self<"u")return self;if(typeof window<"u")return window;if(typeof global<"u")return global;throw new Error("Unable to locate global object.")}var ft=()=>ut().__FIREBASE_DEFAULTS__,ht=()=>{if(typeof process>"u"||typeof process.env>"u")return;let t=process.env.__FIREBASE_DEFAULTS__;if(t)return JSON.parse(t)},pt=()=>{if(typeof document>"u")return;let t;try{t=document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/)}catch{return}let e=t&&Oe(t[1]);return e&&JSON.parse(e)},gt=()=>{try{return _e()||ft()||ht()||pt()}catch(t){console.info(`Unable to get __FIREBASE_DEFAULTS__ due to: ${t}`);return}};var q=()=>gt()?.config;var P=class{constructor(){this.reject=()=>{},this.resolve=()=>{},this.promise=new Promise((e,n)=>{this.resolve=e,this.reject=n})}wrapCallback(e){return(n,s)=>{n?this.reject(n):this.resolve(s),typeof e=="function"&&(this.promise.catch(()=>{}),e.length===1?e(n):e(n,s))}}};function Re(){try{return typeof indexedDB=="object"}catch{return!1}}function Ae(){return new Promise((t,e)=>{try{let n=!0,s="validate-browser-context-for-indexeddb-analytics-module",i=self.indexedDB.open(s);i.onsuccess=()=>{i.result.close(),n||self.indexedDB.deleteDatabase(s),t(!0)},i.onupgradeneeded=()=>{n=!1},i.onerror=()=>{e(i.error?.message||"")}}catch(n){e(n)}})}var mt="FirebaseError",b=class t extends Error{constructor(e,n,s){super(n),this.code=e,this.customData=s,this.name=mt,Object.setPrototypeOf(this,t.prototype),Error.captureStackTrace&&Error.captureStackTrace(this,M.prototype.create)}},M=class{constructor(e,n,s){this.service=e,this.serviceName=n,this.errors=s}create(e,...n){let s=n[0]||{},i=`${this.service}/${e}`,r=this.errors[e],o=r?Et(r,s):"Error",a=`${this.serviceName}: ${o} (${i}).`;return new b(i,a,s)}};function Et(t,e){return t.replace(bt,(n,s)=>{let i=e[s];return i!=null?String(i):`<${s}?>`})}var bt=/\{\$([^}]+)}/g;function F(t,e){if(t===e)return!0;let n=Object.keys(t),s=Object.keys(e);for(let i of n){if(!s.includes(i))return!1;let r=t[i],o=e[i];if(we(r)&&we(o)){if(!F(r,o))return!1}else if(r!==o)return!1}for(let i of s)if(!n.includes(i))return!1;return!0}function we(t){return t!==null&&typeof t=="object"}var as=14400*1e3;function Ie(t){return t&&t._delegate?t._delegate:t}var y=class{constructor(e,n,s){this.name=e,this.instanceFactory=n,this.type=s,this.multipleInstances=!1,this.serviceProps={},this.instantiationMode="LAZY",this.onInstanceCreated=null}setInstantiationMode(e){return this.instantiationMode=e,this}setMultipleInstances(e){return this.multipleInstances=e,this}setServiceProps(e){return this.serviceProps=e,this}setInstanceCreatedCallback(e){return this.onInstanceCreated=e,this}};var I="[DEFAULT]";var X=class{constructor(e,n){this.name=e,this.container=n,this.component=null,this.instances=new Map,this.instancesDeferred=new Map,this.instancesOptions=new Map,this.onInitCallbacks=new Map}get(e){let n=this.normalizeInstanceIdentifier(e);if(!this.instancesDeferred.has(n)){let s=new P;if(this.instancesDeferred.set(n,s),this.isInitialized(n)||this.shouldAutoInitialize())try{let i=this.getOrInitializeService({instanceIdentifier:n});i&&s.resolve(i)}catch{}}return this.instancesDeferred.get(n).promise}getImmediate(e){let n=this.normalizeInstanceIdentifier(e?.identifier),s=e?.optional??!1;if(this.isInitialized(n)||this.shouldAutoInitialize())try{return this.getOrInitializeService({instanceIdentifier:n})}catch(i){if(s)return null;throw i}else{if(s)return null;throw Error(`Service ${this.name} is not available`)}}getComponent(){return this.component}setComponent(e){if(e.name!==this.name)throw Error(`Mismatching Component ${e.name} for Provider ${this.name}.`);if(this.component)throw Error(`Component for ${this.name} has already been provided`);if(this.component=e,!!this.shouldAutoInitialize()){if(_t(e))try{this.getOrInitializeService({instanceIdentifier:I})}catch{}for(let[n,s]of this.instancesDeferred.entries()){let i=this.normalizeInstanceIdentifier(n);try{let r=this.getOrInitializeService({instanceIdentifier:i});s.resolve(r)}catch{}}}}clearInstance(e=I){this.instancesDeferred.delete(e),this.instancesOptions.delete(e),this.instances.delete(e)}async delete(){let e=Array.from(this.instances.values());await Promise.all([...e.filter(n=>"INTERNAL"in n).map(n=>n.INTERNAL.delete()),...e.filter(n=>"_delete"in n).map(n=>n._delete())])}isComponentSet(){return this.component!=null}isInitialized(e=I){return this.instances.has(e)}getOptions(e=I){return this.instancesOptions.get(e)||{}}initialize(e={}){let{options:n={}}=e,s=this.normalizeInstanceIdentifier(e.instanceIdentifier);if(this.isInitialized(s))throw Error(`${this.name}(${s}) has already been initialized`);if(!this.isComponentSet())throw Error(`Component ${this.name} has not been registered yet`);let i=this.getOrInitializeService({instanceIdentifier:s,options:n});for(let[r,o]of this.instancesDeferred.entries()){let a=this.normalizeInstanceIdentifier(r);s===a&&o.resolve(i)}return i}onInit(e,n){let s=this.normalizeInstanceIdentifier(n),i=this.onInitCallbacks.get(s)??new Set;i.add(e),this.onInitCallbacks.set(s,i);let r=this.instances.get(s);return r&&e(r,s),()=>{i.delete(e)}}invokeOnInitCallbacks(e,n){let s=this.onInitCallbacks.get(n);if(s)for(let i of s)try{i(e,n)}catch{}}getOrInitializeService({instanceIdentifier:e,options:n={}}){let s=this.instances.get(e);if(!s&&this.component&&(s=this.component.instanceFactory(this.container,{instanceIdentifier:yt(e),options:n}),this.instances.set(e,s),this.instancesOptions.set(e,n),this.invokeOnInitCallbacks(s,e),this.component.onInstanceCreated))try{this.component.onInstanceCreated(this.container,e,s)}catch{}return s||null}normalizeInstanceIdentifier(e=I){return this.component?this.component.multipleInstances?e:I:e}shouldAutoInitialize(){return!!this.component&&this.component.instantiationMode!=="EXPLICIT"}};function yt(t){return t===I?void 0:t}function _t(t){return t.instantiationMode==="EAGER"}var $=class{constructor(e){this.name=e,this.providers=new Map}addComponent(e){let n=this.getProvider(e.name);if(n.isComponentSet())throw new Error(`Component ${e.name} has already been registered with ${this.name}`);n.setComponent(e)}addOrOverwriteComponent(e){this.getProvider(e.name).isComponentSet()&&this.providers.delete(e.name),this.addComponent(e)}getProvider(e){if(this.providers.has(e))return this.providers.get(e);let n=new X(e,this);return this.providers.set(e,n),n}getProviders(){return Array.from(this.providers.values())}};var wt=[],f;(function(t){t[t.DEBUG=0]="DEBUG",t[t.VERBOSE=1]="VERBOSE",t[t.INFO=2]="INFO",t[t.WARN=3]="WARN",t[t.ERROR=4]="ERROR",t[t.SILENT=5]="SILENT"})(f||(f={}));var St={debug:f.DEBUG,verbose:f.VERBOSE,info:f.INFO,warn:f.WARN,error:f.ERROR,silent:f.SILENT},Ct=f.INFO,Ot={[f.DEBUG]:"log",[f.VERBOSE]:"log",[f.INFO]:"info",[f.WARN]:"warn",[f.ERROR]:"error"},Rt=(t,e,...n)=>{if(e<t.logLevel)return;let s=new Date().toISOString(),i=Ot[e];if(i)console[i](`[${s}]  ${t.name}:`,...n);else throw new Error(`Attempted to log a message with an invalid logType (value: ${e})`)},N=class{constructor(e){this.name=e,this._logLevel=Ct,this._logHandler=Rt,this._userLogHandler=null,wt.push(this)}get logLevel(){return this._logLevel}set logLevel(e){if(!(e in f))throw new TypeError(`Invalid value "${e}" assigned to \`logLevel\``);this._logLevel=e}setLogLevel(e){this._logLevel=typeof e=="string"?St[e]:e}get logHandler(){return this._logHandler}set logHandler(e){if(typeof e!="function")throw new TypeError("Value assigned to `logHandler` must be a function");this._logHandler=e}get userLogHandler(){return this._userLogHandler}set userLogHandler(e){this._userLogHandler=e}debug(...e){this._userLogHandler&&this._userLogHandler(this,f.DEBUG,...e),this._logHandler(this,f.DEBUG,...e)}log(...e){this._userLogHandler&&this._userLogHandler(this,f.VERBOSE,...e),this._logHandler(this,f.VERBOSE,...e)}info(...e){this._userLogHandler&&this._userLogHandler(this,f.INFO,...e),this._logHandler(this,f.INFO,...e)}warn(...e){this._userLogHandler&&this._userLogHandler(this,f.WARN,...e),this._logHandler(this,f.WARN,...e)}error(...e){this._userLogHandler&&this._userLogHandler(this,f.ERROR,...e),this._logHandler(this,f.ERROR,...e)}};var At=(t,e)=>e.some(n=>t instanceof n),Te,ve;function It(){return Te||(Te=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])}function Tt(){return ve||(ve=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])}var De=new WeakMap,Z=new WeakMap,Ne=new WeakMap,Q=new WeakMap,te=new WeakMap;function vt(t){let e=new Promise((n,s)=>{let i=()=>{t.removeEventListener("success",r),t.removeEventListener("error",o)},r=()=>{n(m(t.result)),i()},o=()=>{s(t.error),i()};t.addEventListener("success",r),t.addEventListener("error",o)});return e.then(n=>{n instanceof IDBCursor&&De.set(n,t)}).catch(()=>{}),te.set(e,t),e}function Dt(t){if(Z.has(t))return;let e=new Promise((n,s)=>{let i=()=>{t.removeEventListener("complete",r),t.removeEventListener("error",o),t.removeEventListener("abort",o)},r=()=>{n(),i()},o=()=>{s(t.error||new DOMException("AbortError","AbortError")),i()};t.addEventListener("complete",r),t.addEventListener("error",o),t.addEventListener("abort",o)});Z.set(t,e)}var ee={get(t,e,n){if(t instanceof IDBTransaction){if(e==="done")return Z.get(t);if(e==="objectStoreNames")return t.objectStoreNames||Ne.get(t);if(e==="store")return n.objectStoreNames[1]?void 0:n.objectStore(n.objectStoreNames[0])}return m(t[e])},set(t,e,n){return t[e]=n,!0},has(t,e){return t instanceof IDBTransaction&&(e==="done"||e==="store")?!0:e in t}};function Le(t){ee=t(ee)}function Nt(t){return t===IDBDatabase.prototype.transaction&&!("objectStoreNames"in IDBTransaction.prototype)?function(e,...n){let s=t.call(H(this),e,...n);return Ne.set(s,e.sort?e.sort():[e]),m(s)}:Tt().includes(t)?function(...e){return t.apply(H(this),e),m(De.get(this))}:function(...e){return m(t.apply(H(this),e))}}function Lt(t){return typeof t=="function"?Nt(t):(t instanceof IDBTransaction&&Dt(t),At(t,It())?new Proxy(t,ee):t)}function m(t){if(t instanceof IDBRequest)return vt(t);if(Q.has(t))return Q.get(t);let e=Lt(t);return e!==t&&(Q.set(t,e),te.set(e,t)),e}var H=t=>te.get(t);function Pe(t,e,{blocked:n,upgrade:s,blocking:i,terminated:r}={}){let o=indexedDB.open(t,e),a=m(o);return s&&o.addEventListener("upgradeneeded",l=>{s(m(o.result),l.oldVersion,l.newVersion,m(o.transaction),l)}),n&&o.addEventListener("blocked",l=>n(l.oldVersion,l.newVersion,l)),a.then(l=>{r&&l.addEventListener("close",()=>r()),i&&l.addEventListener("versionchange",u=>i(u.oldVersion,u.newVersion,u))}).catch(()=>{}),a}var kt=["get","getKey","getAll","getAllKeys","count"],Pt=["put","add","delete","clear"],ne=new Map;function ke(t,e){if(!(t instanceof IDBDatabase&&!(e in t)&&typeof e=="string"))return;if(ne.get(e))return ne.get(e);let n=e.replace(/FromIndex$/,""),s=e!==n,i=Pt.includes(n);if(!(n in(s?IDBIndex:IDBObjectStore).prototype)||!(i||kt.includes(n)))return;let r=async function(o,...a){let l=this.transaction(o,i?"readwrite":"readonly"),u=l.store;return s&&(u=u.index(a.shift())),(await Promise.all([u[n](...a),i&&l.done]))[0]};return ne.set(e,r),r}Le(t=>({...t,get:(e,n,s)=>ke(e,n)||t.get(e,n,s),has:(e,n)=>!!ke(e,n)||t.has(e,n)}));var ie=class{constructor(e){this.container=e}getPlatformInfoString(){return this.container.getProviders().map(n=>{if(Mt(n)){let s=n.getImmediate();return`${s.library}/${s.version}`}else return null}).filter(n=>n).join(" ")}};function Mt(t){return t.getComponent()?.type==="VERSION"}var re="@firebase/app",Me="0.14.4";var _=new N("@firebase/app"),xt="@firebase/app-compat",Bt="@firebase/analytics-compat",Ut="@firebase/analytics",Ft="@firebase/app-check-compat",$t="@firebase/app-check",Ht="@firebase/auth",Vt="@firebase/auth-compat",Gt="@firebase/database",jt="@firebase/data-connect",Wt="@firebase/database-compat",zt="@firebase/functions",Yt="@firebase/functions-compat",Jt="@firebase/installations",Kt="@firebase/installations-compat",qt="@firebase/messaging",Xt="@firebase/messaging-compat",Qt="@firebase/performance",Zt="@firebase/performance-compat",en="@firebase/remote-config",tn="@firebase/remote-config-compat",nn="@firebase/storage",sn="@firebase/storage-compat",rn="@firebase/firestore",on="@firebase/ai",an="@firebase/firestore-compat",cn="firebase";var oe="[DEFAULT]",ln={[re]:"fire-core",[xt]:"fire-core-compat",[Ut]:"fire-analytics",[Bt]:"fire-analytics-compat",[$t]:"fire-app-check",[Ft]:"fire-app-check-compat",[Ht]:"fire-auth",[Vt]:"fire-auth-compat",[Gt]:"fire-rtdb",[jt]:"fire-data-connect",[Wt]:"fire-rtdb-compat",[zt]:"fire-fn",[Yt]:"fire-fn-compat",[Jt]:"fire-iid",[Kt]:"fire-iid-compat",[qt]:"fire-fcm",[Xt]:"fire-fcm-compat",[Qt]:"fire-perf",[Zt]:"fire-perf-compat",[en]:"fire-rc",[tn]:"fire-rc-compat",[nn]:"fire-gcs",[sn]:"fire-gcs-compat",[rn]:"fire-fst",[an]:"fire-fst-compat",[on]:"fire-vertex","fire-js":"fire-js",[cn]:"fire-js-all"};var V=new Map,dn=new Map,ae=new Map;function xe(t,e){try{t.container.addComponent(e)}catch(n){_.debug(`Component ${e.name} failed to register with FirebaseApp ${t.name}`,n)}}function x(t){let e=t.name;if(ae.has(e))return _.debug(`There were multiple attempts to register component ${e}.`),!1;ae.set(e,t);for(let n of V.values())xe(n,t);for(let n of dn.values())xe(n,t);return!0}function $e(t,e){let n=t.container.getProvider("heartbeat").getImmediate({optional:!0});return n&&n.triggerHeartbeat(),t.container.getProvider(e)}function He(t){return t==null?!1:t.settings!==void 0}var un={"no-app":"No Firebase App '{$appName}' has been created - call initializeApp() first","bad-app-name":"Illegal App name: '{$appName}'","duplicate-app":"Firebase App named '{$appName}' already exists with different options or config","app-deleted":"Firebase App named '{$appName}' already deleted","server-app-deleted":"Firebase Server App has been deleted","no-options":"Need to provide options, when not being deployed to hosting via source.","invalid-app-argument":"firebase.{$appName}() takes either no argument or a Firebase App instance.","invalid-log-argument":"First argument to `onLog` must be null or a function.","idb-open":"Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.","idb-get":"Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.","idb-set":"Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.","idb-delete":"Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}.","finalization-registry-not-supported":"FirebaseServerApp deleteOnDeref field defined but the JS runtime does not support FinalizationRegistry.","invalid-server-app-environment":"FirebaseServerApp is not for use in browser environments."},O=new M("app","Firebase",un);var ce=class{constructor(e,n,s){this._isDeleted=!1,this._options={...e},this._config={...n},this._name=n.name,this._automaticDataCollectionEnabled=n.automaticDataCollectionEnabled,this._container=s,this.container.addComponent(new y("app",()=>this,"PUBLIC"))}get automaticDataCollectionEnabled(){return this.checkDestroyed(),this._automaticDataCollectionEnabled}set automaticDataCollectionEnabled(e){this.checkDestroyed(),this._automaticDataCollectionEnabled=e}get name(){return this.checkDestroyed(),this._name}get options(){return this.checkDestroyed(),this._options}get config(){return this.checkDestroyed(),this._config}get container(){return this._container}get isDeleted(){return this._isDeleted}set isDeleted(e){this._isDeleted=e}checkDestroyed(){if(this.isDeleted)throw O.create("app-deleted",{appName:this._name})}};function Ve(t,e={}){let n=t;typeof e!="object"&&(e={name:e});let s={name:oe,automaticDataCollectionEnabled:!0,...e},i=s.name;if(typeof i!="string"||!i)throw O.create("bad-app-name",{appName:String(i)});if(n||(n=q()),!n)throw O.create("no-options");let r=V.get(i);if(r){if(F(n,r.options)&&F(s,r.config))return r;throw O.create("duplicate-app",{appName:i})}let o=new $(i);for(let l of ae.values())o.addComponent(l);let a=new ce(n,s,o);return V.set(i,a),a}function Ge(t=oe){let e=V.get(t);if(!e&&t===oe&&q())return Ve();if(!e)throw O.create("no-app",{appName:t});return e}function R(t,e,n){let s=ln[t]??t;n&&(s+=`-${n}`);let i=s.match(/\s|\//),r=e.match(/\s|\//);if(i||r){let o=[`Unable to register library "${s}" with version "${e}":`];i&&o.push(`library name "${s}" contains illegal characters (whitespace or "/")`),i&&r&&o.push("and"),r&&o.push(`version name "${e}" contains illegal characters (whitespace or "/")`),_.warn(o.join(" "));return}x(new y(`${s}-version`,()=>({library:s,version:e}),"VERSION"))}var fn="firebase-heartbeat-database",hn=1,B="firebase-heartbeat-store",se=null;function je(){return se||(se=Pe(fn,hn,{upgrade:(t,e)=>{switch(e){case 0:try{t.createObjectStore(B)}catch(n){console.warn(n)}}}}).catch(t=>{throw O.create("idb-open",{originalErrorMessage:t.message})})),se}async function pn(t){try{let n=(await je()).transaction(B),s=await n.objectStore(B).get(We(t));return await n.done,s}catch(e){if(e instanceof b)_.warn(e.message);else{let n=O.create("idb-get",{originalErrorMessage:e?.message});_.warn(n.message)}}}async function Be(t,e){try{let s=(await je()).transaction(B,"readwrite");await s.objectStore(B).put(e,We(t)),await s.done}catch(n){if(n instanceof b)_.warn(n.message);else{let s=O.create("idb-set",{originalErrorMessage:n?.message});_.warn(s.message)}}}function We(t){return`${t.name}!${t.options.appId}`}var gn=1024,mn=30,le=class{constructor(e){this.container=e,this._heartbeatsCache=null;let n=this.container.getProvider("app").getImmediate();this._storage=new de(n),this._heartbeatsCachePromise=this._storage.read().then(s=>(this._heartbeatsCache=s,s))}async triggerHeartbeat(){try{let n=this.container.getProvider("platform-logger").getImmediate().getPlatformInfoString(),s=Ue();if(this._heartbeatsCache?.heartbeats==null&&(this._heartbeatsCache=await this._heartbeatsCachePromise,this._heartbeatsCache?.heartbeats==null)||this._heartbeatsCache.lastSentHeartbeatDate===s||this._heartbeatsCache.heartbeats.some(i=>i.date===s))return;if(this._heartbeatsCache.heartbeats.push({date:s,agent:n}),this._heartbeatsCache.heartbeats.length>mn){let i=bn(this._heartbeatsCache.heartbeats);this._heartbeatsCache.heartbeats.splice(i,1)}return this._storage.overwrite(this._heartbeatsCache)}catch(e){_.warn(e)}}async getHeartbeatsHeader(){try{if(this._heartbeatsCache===null&&await this._heartbeatsCachePromise,this._heartbeatsCache?.heartbeats==null||this._heartbeatsCache.heartbeats.length===0)return"";let e=Ue(),{heartbeatsToSend:n,unsentEntries:s}=En(this._heartbeatsCache.heartbeats),i=K(JSON.stringify({version:2,heartbeats:n}));return this._heartbeatsCache.lastSentHeartbeatDate=e,s.length>0?(this._heartbeatsCache.heartbeats=s,await this._storage.overwrite(this._heartbeatsCache)):(this._heartbeatsCache.heartbeats=[],this._storage.overwrite(this._heartbeatsCache)),i}catch(e){return _.warn(e),""}}};function Ue(){return new Date().toISOString().substring(0,10)}function En(t,e=gn){let n=[],s=t.slice();for(let i of t){let r=n.find(o=>o.agent===i.agent);if(r){if(r.dates.push(i.date),Fe(n)>e){r.dates.pop();break}}else if(n.push({agent:i.agent,dates:[i.date]}),Fe(n)>e){n.pop();break}s=s.slice(1)}return{heartbeatsToSend:n,unsentEntries:s}}var de=class{constructor(e){this.app=e,this._canUseIndexedDBPromise=this.runIndexedDBEnvironmentCheck()}async runIndexedDBEnvironmentCheck(){return Re()?Ae().then(()=>!0).catch(()=>!1):!1}async read(){if(await this._canUseIndexedDBPromise){let n=await pn(this.app);return n?.heartbeats?n:{heartbeats:[]}}else return{heartbeats:[]}}async overwrite(e){if(await this._canUseIndexedDBPromise){let s=await this.read();return Be(this.app,{lastSentHeartbeatDate:e.lastSentHeartbeatDate??s.lastSentHeartbeatDate,heartbeats:e.heartbeats})}else return}async add(e){if(await this._canUseIndexedDBPromise){let s=await this.read();return Be(this.app,{lastSentHeartbeatDate:e.lastSentHeartbeatDate??s.lastSentHeartbeatDate,heartbeats:[...s.heartbeats,...e.heartbeats]})}else return}};function Fe(t){return K(JSON.stringify({version:2,heartbeats:t})).length}function bn(t){if(t.length===0)return-1;let e=0,n=t[0].date;for(let s=1;s<t.length;s++)t[s].date<n&&(n=t[s].date,e=s);return e}function yn(t){x(new y("platform-logger",e=>new ie(e),"PRIVATE")),x(new y("heartbeat",e=>new le(e),"PRIVATE")),R(re,Me,t),R(re,Me,"esm2020"),R("fire-js","")}yn("");var ze="@firebase/ai",fe="2.4.0";var L="AI",Ye="us-central1",_n="firebasevertexai.googleapis.com",wn="v1beta",Je=fe,Sn="gl-js",Cn=180*1e3,On="gemini-2.0-flash-lite";var d=class t extends b{constructor(e,n,s){let i=L,r=`${i}/${e}`,o=`${i}: ${n} (${r})`;super(e,o),this.code=e,this.customErrorData=s,Error.captureStackTrace&&Error.captureStackTrace(this,t),Object.setPrototypeOf(this,t.prototype),this.toString=()=>o}};var Ke=["user","model","function","system"];var nt={HARM_SEVERITY_NEGLIGIBLE:"HARM_SEVERITY_NEGLIGIBLE",HARM_SEVERITY_LOW:"HARM_SEVERITY_LOW",HARM_SEVERITY_MEDIUM:"HARM_SEVERITY_MEDIUM",HARM_SEVERITY_HIGH:"HARM_SEVERITY_HIGH",HARM_SEVERITY_UNSUPPORTED:"HARM_SEVERITY_UNSUPPORTED"};var qe={STOP:"STOP",MAX_TOKENS:"MAX_TOKENS",SAFETY:"SAFETY",RECITATION:"RECITATION",OTHER:"OTHER",BLOCKLIST:"BLOCKLIST",PROHIBITED_CONTENT:"PROHIBITED_CONTENT",SPII:"SPII",MALFORMED_FUNCTION_CALL:"MALFORMED_FUNCTION_CALL"};var A={PREFER_ON_DEVICE:"prefer_on_device",ONLY_ON_DEVICE:"only_on_device",ONLY_IN_CLOUD:"only_in_cloud",PREFER_IN_CLOUD:"prefer_in_cloud"};var c={ERROR:"error",REQUEST_ERROR:"request-error",RESPONSE_ERROR:"response-error",FETCH_ERROR:"fetch-error",SESSION_CLOSED:"session-closed",INVALID_CONTENT:"invalid-content",API_NOT_ENABLED:"api-not-enabled",INVALID_SCHEMA:"invalid-schema",NO_API_KEY:"no-api-key",NO_APP_ID:"no-app-id",NO_MODEL:"no-model",NO_PROJECT_ID:"no-project-id",PARSE_FAILED:"parse-failed",UNSUPPORTED:"unsupported"};var w={VERTEX_AI:"VERTEX_AI",GOOGLE_AI:"GOOGLE_AI"};var j=class{constructor(e){this.backendType=e}},D=class extends j{constructor(){super(w.GOOGLE_AI)}},k=class extends j{constructor(e=Ye){super(w.VERTEX_AI),e?this.location=e:this.location=Ye}};function Rn(t){if(t instanceof D)return`${L}/googleai`;if(t instanceof k)return`${L}/vertexai/${t.location}`;throw new d(c.ERROR,`Invalid backend: ${JSON.stringify(t.backendType)}`)}function An(t){let e=t.split("/");if(e[0]!==L)throw new d(c.ERROR,`Invalid instance identifier, unknown prefix '${e[0]}'`);switch(e[1]){case"vertexai":let s=e[2];if(!s)throw new d(c.ERROR,`Invalid instance identifier, unknown location '${t}'`);return new k(s);case"googleai":return new D;default:throw new d(c.ERROR,`Invalid instance identifier string: '${t}'`)}}var h=new N("@firebase/vertexai"),T;(function(t){t.UNAVAILABLE="unavailable",t.DOWNLOADABLE="downloadable",t.DOWNLOADING="downloading",t.AVAILABLE="available"})(T||(T={}));var W=class t{constructor(e,n,s={createOptions:{expectedInputs:[{type:"image"}]}}){this.languageModelProvider=e,this.mode=n,this.onDeviceParams=s,this.isDownloading=!1}async isAvailable(e){if(!this.mode)return h.debug("On-device inference unavailable because mode is undefined."),!1;if(this.mode===A.ONLY_IN_CLOUD)return h.debug('On-device inference unavailable because mode is "only_in_cloud".'),!1;let n=await this.downloadIfAvailable();if(this.mode===A.ONLY_ON_DEVICE){if(n===T.UNAVAILABLE)throw new d(c.API_NOT_ENABLED,"Local LanguageModel API not available in this environment.");return(n===T.DOWNLOADABLE||n===T.DOWNLOADING)&&(h.debug("Waiting for download of LanguageModel to complete."),await this.downloadPromise),!0}return n!==T.AVAILABLE?(h.debug(`On-device inference unavailable because availability is "${n}".`),!1):t.isOnDeviceRequest(e)?!0:(h.debug("On-device inference unavailable because request is incompatible."),!1)}async generateContent(e){let n=await this.createSession(),s=await Promise.all(e.contents.map(t.toLanguageModelMessage)),i=await n.prompt(s,this.onDeviceParams.promptOptions);return t.toResponse(i)}async generateContentStream(e){let n=await this.createSession(),s=await Promise.all(e.contents.map(t.toLanguageModelMessage)),i=n.promptStreaming(s,this.onDeviceParams.promptOptions);return t.toStreamResponse(i)}async countTokens(e){throw new d(c.REQUEST_ERROR,"Count Tokens is not yet available for on-device model.")}static isOnDeviceRequest(e){if(e.contents.length===0)return h.debug("Empty prompt rejected for on-device inference."),!1;for(let n of e.contents){if(n.role==="function")return h.debug('"Function" role rejected for on-device inference.'),!1;for(let s of n.parts)if(s.inlineData&&t.SUPPORTED_MIME_TYPES.indexOf(s.inlineData.mimeType)===-1)return h.debug(`Unsupported mime type "${s.inlineData.mimeType}" rejected for on-device inference.`),!1}return!0}async downloadIfAvailable(){let e=await this.languageModelProvider?.availability(this.onDeviceParams.createOptions);return e===T.DOWNLOADABLE&&this.download(),e}download(){this.isDownloading||(this.isDownloading=!0,this.downloadPromise=this.languageModelProvider?.create(this.onDeviceParams.createOptions).finally(()=>{this.isDownloading=!1}))}static async toLanguageModelMessage(e){let n=await Promise.all(e.parts.map(t.toLanguageModelMessageContent));return{role:t.toLanguageModelMessageRole(e.role),content:n}}static async toLanguageModelMessageContent(e){if(e.text)return{type:"text",value:e.text};if(e.inlineData){let s=await(await fetch(`data:${e.inlineData.mimeType};base64,${e.inlineData.data}`)).blob();return{type:"image",value:await createImageBitmap(s)}}throw new d(c.REQUEST_ERROR,"Processing of this Part type is not currently supported.")}static toLanguageModelMessageRole(e){return e==="model"?"assistant":"user"}async createSession(){if(!this.languageModelProvider)throw new d(c.UNSUPPORTED,"Chrome AI requested for unsupported browser version.");let e=await this.languageModelProvider.create(this.onDeviceParams.createOptions);return this.oldSession&&this.oldSession.destroy(),this.oldSession=e,e}static toResponse(e){return{json:async()=>({candidates:[{content:{parts:[{text:e}]}}]})}}static toStreamResponse(e){let n=new TextEncoder;return{body:e.pipeThrough(new TransformStream({transform(s,i){let r=JSON.stringify({candidates:[{content:{role:"model",parts:[{text:s}]}}]});i.enqueue(n.encode(`data: ${r}

`))}}))}}};W.SUPPORTED_MIME_TYPES=["image/jpeg","image/png"];function In(t,e,n){if(typeof e<"u"&&t)return new W(e.LanguageModel,t,n)}var he=class{constructor(e,n,s,i,r){this.app=e,this.backend=n,this.chromeAdapterFactory=r;let o=i?.getImmediate({optional:!0}),a=s?.getImmediate({optional:!0});this.auth=a||null,this.appCheck=o||null,n instanceof k?this.location=n.location:this.location=""}_delete(){return Promise.resolve()}set options(e){this._options=e}get options(){return this._options}};function Tn(t,{instanceIdentifier:e}){if(!e)throw new d(c.ERROR,"AIService instance identifier is undefined.");let n=An(e),s=t.getProvider("app").getImmediate(),i=t.getProvider("auth-internal"),r=t.getProvider("app-check-internal");return new he(s,n,i,r,In)}var pe=class t{constructor(e,n){if(e.app?.options?.apiKey)if(e.app?.options?.projectId)if(e.app?.options?.appId){if(this._apiSettings={apiKey:e.app.options.apiKey,project:e.app.options.projectId,appId:e.app.options.appId,automaticDataCollectionEnabled:e.app.automaticDataCollectionEnabled,location:e.location,backend:e.backend},He(e.app)&&e.app.settings.appCheckToken){let s=e.app.settings.appCheckToken;this._apiSettings.getAppCheckToken=()=>Promise.resolve({token:s})}else e.appCheck&&(e.options?.useLimitedUseAppCheckTokens?this._apiSettings.getAppCheckToken=()=>e.appCheck.getLimitedUseToken():this._apiSettings.getAppCheckToken=()=>e.appCheck.getToken());e.auth&&(this._apiSettings.getAuthToken=()=>e.auth.getToken()),this.model=t.normalizeModelName(n,this._apiSettings.backend.backendType)}else throw new d(c.NO_APP_ID,'The "appId" field is empty in the local Firebase config. Firebase AI requires this field to contain a valid app ID.');else throw new d(c.NO_PROJECT_ID,'The "projectId" field is empty in the local Firebase config. Firebase AI requires this field to contain a valid project ID.');else throw new d(c.NO_API_KEY,'The "apiKey" field is empty in the local Firebase config. Firebase AI requires this field to contain a valid API key.')}static normalizeModelName(e,n){return n===w.GOOGLE_AI?t.normalizeGoogleAIModelName(e):t.normalizeVertexAIModelName(e)}static normalizeGoogleAIModelName(e){return`models/${e}`}static normalizeVertexAIModelName(e){let n;return e.includes("/")?e.startsWith("models/")?n=`publishers/google/${e}`:n=e:n=`publishers/google/models/${e}`,n}};var U;(function(t){t.GENERATE_CONTENT="generateContent",t.STREAM_GENERATE_CONTENT="streamGenerateContent",t.COUNT_TOKENS="countTokens",t.PREDICT="predict"})(U||(U={}));var z=class{constructor(e,n,s,i,r){this.model=e,this.task=n,this.apiSettings=s,this.stream=i,this.requestOptions=r}toString(){let e=new URL(this.baseUrl);return e.pathname=`/${this.apiVersion}/${this.modelPath}:${this.task}`,e.search=this.queryParams.toString(),e.toString()}get baseUrl(){return this.requestOptions?.baseUrl||`https://${_n}`}get apiVersion(){return wn}get modelPath(){if(this.apiSettings.backend instanceof D)return`projects/${this.apiSettings.project}/${this.model}`;if(this.apiSettings.backend instanceof k)return`projects/${this.apiSettings.project}/locations/${this.apiSettings.backend.location}/${this.model}`;throw new d(c.ERROR,`Invalid backend: ${JSON.stringify(this.apiSettings.backend)}`)}get queryParams(){let e=new URLSearchParams;return this.stream&&e.set("alt","sse"),e}};function vn(){let t=[];return t.push(`${Sn}/${Je}`),t.push(`fire/${Je}`),t.join(" ")}async function Dn(t){let e=new Headers;if(e.append("Content-Type","application/json"),e.append("x-goog-api-client",vn()),e.append("x-goog-api-key",t.apiSettings.apiKey),t.apiSettings.automaticDataCollectionEnabled&&e.append("X-Firebase-Appid",t.apiSettings.appId),t.apiSettings.getAppCheckToken){let n=await t.apiSettings.getAppCheckToken();n&&(e.append("X-Firebase-AppCheck",n.token),n.error&&h.warn(`Unable to obtain a valid App Check token: ${n.error.message}`))}if(t.apiSettings.getAuthToken){let n=await t.apiSettings.getAuthToken();n&&e.append("Authorization",`Firebase ${n.accessToken}`)}return e}async function Nn(t,e,n,s,i,r){let o=new z(t,e,n,s,r);return{url:o.toString(),fetchOptions:{method:"POST",headers:await Dn(o),body:i}}}async function be(t,e,n,s,i,r){let o=new z(t,e,n,s,r),a,l;try{let u=await Nn(t,e,n,s,i,r),E=r?.timeout!=null&&r.timeout>=0?r.timeout:Cn,S=new AbortController;if(l=setTimeout(()=>S.abort(),E),u.fetchOptions.signal=S.signal,a=await fetch(u.url,u.fetchOptions),!a.ok){let C="",p;try{let g=await a.json();C=g.error.message,g.error.details&&(C+=` ${JSON.stringify(g.error.details)}`,p=g.error.details)}catch{}throw a.status===403&&p&&p.some(g=>g.reason==="SERVICE_DISABLED")&&p.some(g=>g.links?.[0]?.description.includes("Google developers console API activation"))?new d(c.API_NOT_ENABLED,`The Firebase AI SDK requires the Firebase AI API ('firebasevertexai.googleapis.com') to be enabled in your Firebase project. Enable this API by visiting the Firebase Console at https://console.firebase.google.com/project/${o.apiSettings.project}/genai/ and clicking "Get started". If you enabled this API recently, wait a few minutes for the action to propagate to our systems and then retry.`,{status:a.status,statusText:a.statusText,errorDetails:p}):new d(c.FETCH_ERROR,`Error fetching from ${o}: [${a.status} ${a.statusText}] ${C}`,{status:a.status,statusText:a.statusText,errorDetails:p})}}catch(u){let E=u;throw u.code!==c.FETCH_ERROR&&u.code!==c.API_NOT_ENABLED&&u instanceof Error&&(E=new d(c.ERROR,`Error fetching from ${o.toString()}: ${u.message}`),E.stack=u.stack),E}finally{l&&clearTimeout(l)}return a}function G(t){if(t.candidates&&t.candidates.length>0){if(t.candidates.length>1&&h.warn(`This response had ${t.candidates.length} candidates. Returning text from the first candidate only. Access response.candidates directly to use the other candidates.`),st(t.candidates[0]))throw new d(c.RESPONSE_ERROR,`Response error: ${v(t)}. Response body stored in error.response`,{response:t});return!0}else return!1}function Y(t){return t.candidates&&!t.candidates[0].hasOwnProperty("index")&&(t.candidates[0].index=0),Ln(t)}function Ln(t){return t.text=()=>{if(G(t))return Xe(t,e=>!e.thought);if(t.promptFeedback)throw new d(c.RESPONSE_ERROR,`Text not available. ${v(t)}`,{response:t});return""},t.thoughtSummary=()=>{if(G(t)){let e=Xe(t,n=>!!n.thought);return e===""?void 0:e}else if(t.promptFeedback)throw new d(c.RESPONSE_ERROR,`Thought summary not available. ${v(t)}`,{response:t})},t.inlineDataParts=()=>{if(G(t))return Pn(t);if(t.promptFeedback)throw new d(c.RESPONSE_ERROR,`Data not available. ${v(t)}`,{response:t})},t.functionCalls=()=>{if(G(t))return kn(t);if(t.promptFeedback)throw new d(c.RESPONSE_ERROR,`Function call not available. ${v(t)}`,{response:t})},t}function Xe(t,e){let n=[];if(t.candidates?.[0].content?.parts)for(let s of t.candidates?.[0].content?.parts)s.text&&e(s)&&n.push(s.text);return n.length>0?n.join(""):""}function kn(t){let e=[];if(t.candidates?.[0].content?.parts)for(let n of t.candidates?.[0].content?.parts)n.functionCall&&e.push(n.functionCall);if(e.length>0)return e}function Pn(t){let e=[];if(t.candidates?.[0].content?.parts)for(let n of t.candidates?.[0].content?.parts)n.inlineData&&e.push(n);if(e.length>0)return e}var Mn=[qe.RECITATION,qe.SAFETY];function st(t){return!!t.finishReason&&Mn.some(e=>e===t.finishReason)}function v(t){let e="";if((!t.candidates||t.candidates.length===0)&&t.promptFeedback)e+="Response was blocked",t.promptFeedback?.blockReason&&(e+=` due to ${t.promptFeedback.blockReason}`),t.promptFeedback?.blockReasonMessage&&(e+=`: ${t.promptFeedback.blockReasonMessage}`);else if(t.candidates?.[0]){let n=t.candidates[0];st(n)&&(e+=`Candidate was blocked due to ${n.finishReason}`,n.finishMessage&&(e+=`: ${n.finishMessage}`))}return e}function it(t){if(t.safetySettings?.forEach(e=>{if(e.method)throw new d(c.UNSUPPORTED,"SafetySetting.method is not supported in the the Gemini Developer API. Please remove this property.")}),t.generationConfig?.topK){let e=Math.round(t.generationConfig.topK);e!==t.generationConfig.topK&&(h.warn("topK in GenerationConfig has been rounded to the nearest integer to match the format for requests to the Gemini Developer API."),t.generationConfig.topK=e)}return t}function ye(t){return{candidates:t.candidates?Bn(t.candidates):void 0,prompt:t.promptFeedback?Un(t.promptFeedback):void 0,usageMetadata:t.usageMetadata}}function xn(t,e){return{generateContentRequest:{model:e,...t}}}function Bn(t){let e=[],n;return e&&t.forEach(s=>{let i;if(s.citationMetadata&&(i={citations:s.citationMetadata.citationSources}),s.safetyRatings&&(n=s.safetyRatings.map(o=>({...o,severity:o.severity??nt.HARM_SEVERITY_UNSUPPORTED,probabilityScore:o.probabilityScore??0,severityScore:o.severityScore??0}))),s.content?.parts?.some(o=>o?.videoMetadata))throw new d(c.UNSUPPORTED,"Part.videoMetadata is not supported in the Gemini Developer API. Please remove this property.");let r={index:s.index,content:s.content,finishReason:s.finishReason,finishMessage:s.finishMessage,safetyRatings:n,citationMetadata:i,groundingMetadata:s.groundingMetadata,urlContextMetadata:s.urlContextMetadata};e.push(r)}),e}function Un(t){let e=[];return t.safetyRatings.forEach(s=>{e.push({category:s.category,probability:s.probability,severity:s.severity??nt.HARM_SEVERITY_UNSUPPORTED,probabilityScore:s.probabilityScore??0,severityScore:s.severityScore??0,blocked:s.blocked})}),{blockReason:t.blockReason,safetyRatings:e,blockReasonMessage:t.blockReasonMessage}}var Qe=/^data\: (.*)(?:\n\n|\r\r|\r\n\r\n)/;function Fn(t,e){let n=t.body.pipeThrough(new TextDecoderStream("utf8",{fatal:!0})),s=Vn(n),[i,r]=s.tee();return{stream:Hn(i,e),response:$n(r,e)}}async function $n(t,e){let n=[],s=t.getReader();for(;;){let{done:i,value:r}=await s.read();if(i){let o=Gn(n);return e.backend.backendType===w.GOOGLE_AI&&(o=ye(o)),Y(o)}n.push(r)}}async function*Hn(t,e){let n=t.getReader();for(;;){let{value:s,done:i}=await n.read();if(i)break;let r;e.backend.backendType===w.GOOGLE_AI?r=Y(ye(s)):r=Y(s);let o=r.candidates?.[0];!o?.content?.parts&&!o?.finishReason&&!o?.citationMetadata&&!o?.urlContextMetadata||(yield r)}}function Vn(t){let e=t.getReader();return new ReadableStream({start(s){let i="";return r();function r(){return e.read().then(({value:o,done:a})=>{if(a){if(i.trim()){s.error(new d(c.PARSE_FAILED,"Failed to parse stream"));return}s.close();return}i+=o;let l=i.match(Qe),u;for(;l;){try{u=JSON.parse(l[1])}catch{s.error(new d(c.PARSE_FAILED,`Error parsing JSON response: "${l[1]}`));return}s.enqueue(u),i=i.substring(l[0].length),l=i.match(Qe)}return r()})}}})}function Gn(t){let n={promptFeedback:t[t.length-1]?.promptFeedback};for(let s of t)if(s.candidates)for(let i of s.candidates){let r=i.index||0;n.candidates||(n.candidates=[]),n.candidates[r]||(n.candidates[r]={index:i.index}),n.candidates[r].citationMetadata=i.citationMetadata,n.candidates[r].finishReason=i.finishReason,n.candidates[r].finishMessage=i.finishMessage,n.candidates[r].safetyRatings=i.safetyRatings,n.candidates[r].groundingMetadata=i.groundingMetadata;let o=i.urlContextMetadata;if(typeof o=="object"&&o!==null&&Object.keys(o).length>0&&(n.candidates[r].urlContextMetadata=o),i.content){if(!i.content.parts)continue;n.candidates[r].content||(n.candidates[r].content={role:i.content.role||"user",parts:[]});for(let a of i.content.parts){let l={...a};a.text!==""&&Object.keys(l).length>0&&n.candidates[r].content.parts.push(l)}}}return n}var jn=[c.FETCH_ERROR,c.ERROR,c.API_NOT_ENABLED];async function rt(t,e,n,s){if(!e)return s();switch(e.mode){case A.ONLY_ON_DEVICE:if(await e.isAvailable(t))return n();throw new d(c.UNSUPPORTED,"Inference mode is ONLY_ON_DEVICE, but an on-device model is not available.");case A.ONLY_IN_CLOUD:return s();case A.PREFER_IN_CLOUD:try{return await s()}catch(i){if(i instanceof d&&jn.includes(i.code))return n();throw i}case A.PREFER_ON_DEVICE:return await e.isAvailable(t)?n():s();default:throw new d(c.ERROR,`Unexpected infererence mode: ${e.mode}`)}}async function Wn(t,e,n,s){return t.backend.backendType===w.GOOGLE_AI&&(n=it(n)),be(e,U.STREAM_GENERATE_CONTENT,t,!0,JSON.stringify(n),s)}async function ot(t,e,n,s,i){let r=await rt(n,s,()=>s.generateContentStream(n),()=>Wn(t,e,n,i));return Fn(r,t)}async function zn(t,e,n,s){return t.backend.backendType===w.GOOGLE_AI&&(n=it(n)),be(e,U.GENERATE_CONTENT,t,!1,JSON.stringify(n),s)}async function at(t,e,n,s,i){let r=await rt(n,s,()=>s.generateContent(n),()=>zn(t,e,n,i)),o=await Yn(r,t);return{response:Y(o)}}async function Yn(t,e){let n=await t.json();return e.backend.backendType===w.GOOGLE_AI?ye(n):n}function ct(t){if(t!=null){if(typeof t=="string")return{role:"system",parts:[{text:t}]};if(t.text)return{role:"system",parts:[t]};if(t.parts)return t.role?t:{role:"system",parts:t.parts}}}function ge(t){let e=[];if(typeof t=="string")e=[{text:t}];else for(let n of t)typeof n=="string"?e.push({text:n}):e.push(n);return Jn(e)}function Jn(t){let e={role:"user",parts:[]},n={role:"function",parts:[]},s=!1,i=!1;for(let r of t)"functionResponse"in r?(n.parts.push(r),i=!0):(e.parts.push(r),s=!0);if(s&&i)throw new d(c.INVALID_CONTENT,"Within a single message, FunctionResponse cannot be mixed with other type of Part in the request for sending chat message.");if(!s&&!i)throw new d(c.INVALID_CONTENT,"No Content is provided for sending chat message.");return s?e:n}function ue(t){let e;return t.contents?e=t:e={contents:[ge(t)]},t.systemInstruction&&(e.systemInstruction=ct(t.systemInstruction)),e}var Ze=["text","inlineData","functionCall","functionResponse","thought","thoughtSignature"],Kn={user:["text","inlineData"],function:["functionResponse"],model:["text","functionCall","thought","thoughtSignature"],system:["text"]},et={user:["model"],function:["model"],model:["user","function"],system:[]};function qn(t){let e=null;for(let n of t){let{role:s,parts:i}=n;if(!e&&s!=="user")throw new d(c.INVALID_CONTENT,`First Content should be with role 'user', got ${s}`);if(!Ke.includes(s))throw new d(c.INVALID_CONTENT,`Each item should include role field. Got ${s} but valid roles are: ${JSON.stringify(Ke)}`);if(!Array.isArray(i))throw new d(c.INVALID_CONTENT,"Content should have 'parts' property with an array of Parts");if(i.length===0)throw new d(c.INVALID_CONTENT,"Each Content should have at least one part");let r={text:0,inlineData:0,functionCall:0,functionResponse:0,thought:0,thoughtSignature:0,executableCode:0,codeExecutionResult:0};for(let a of i)for(let l of Ze)l in a&&(r[l]+=1);let o=Kn[s];for(let a of Ze)if(!o.includes(a)&&r[a]>0)throw new d(c.INVALID_CONTENT,`Content with role '${s}' can't contain '${a}' part`);if(e&&!et[s].includes(e.role))throw new d(c.INVALID_CONTENT,`Content with role '${s}' can't follow '${e.role}'. Valid previous roles: ${JSON.stringify(et)}`);e=n}}var tt="SILENT_ERROR",me=class{constructor(e,n,s,i,r){this.model=n,this.chromeAdapter=s,this.params=i,this.requestOptions=r,this._history=[],this._sendPromise=Promise.resolve(),this._apiSettings=e,i?.history&&(qn(i.history),this._history=i.history)}async getHistory(){return await this._sendPromise,this._history}async sendMessage(e){await this._sendPromise;let n=ge(e),s={safetySettings:this.params?.safetySettings,generationConfig:this.params?.generationConfig,tools:this.params?.tools,toolConfig:this.params?.toolConfig,systemInstruction:this.params?.systemInstruction,contents:[...this._history,n]},i={};return this._sendPromise=this._sendPromise.then(()=>at(this._apiSettings,this.model,s,this.chromeAdapter,this.requestOptions)).then(r=>{if(r.response.candidates&&r.response.candidates.length>0){this._history.push(n);let o={parts:r.response.candidates?.[0].content.parts||[],role:r.response.candidates?.[0].content.role||"model"};this._history.push(o)}else{let o=v(r.response);o&&h.warn(`sendMessage() was unsuccessful. ${o}. Inspect response object for details.`)}i=r}),await this._sendPromise,i}async sendMessageStream(e){await this._sendPromise;let n=ge(e),s={safetySettings:this.params?.safetySettings,generationConfig:this.params?.generationConfig,tools:this.params?.tools,toolConfig:this.params?.toolConfig,systemInstruction:this.params?.systemInstruction,contents:[...this._history,n]},i=ot(this._apiSettings,this.model,s,this.chromeAdapter,this.requestOptions);return this._sendPromise=this._sendPromise.then(()=>i).catch(r=>{throw new Error(tt)}).then(r=>r.response).then(r=>{if(r.candidates&&r.candidates.length>0){this._history.push(n);let o={...r.candidates[0].content};o.role||(o.role="model"),this._history.push(o)}else{let o=v(r);o&&h.warn(`sendMessageStream() was unsuccessful. ${o}. Inspect response object for details.`)}}).catch(r=>{r.message!==tt&&h.error(r)}),i}};async function Xn(t,e,n,s){let i="";if(t.backend.backendType===w.GOOGLE_AI){let o=xn(n,e);i=JSON.stringify(o)}else i=JSON.stringify(n);return(await be(e,U.COUNT_TOKENS,t,!1,i,s)).json()}async function Qn(t,e,n,s,i){if(s?.mode===A.ONLY_ON_DEVICE)throw new d(c.UNSUPPORTED,"countTokens() is not supported for on-device models.");return Xn(t,e,n,i)}var Ee=class extends pe{constructor(e,n,s,i){super(e,n.model),this.chromeAdapter=i,this.generationConfig=n.generationConfig||{},this.safetySettings=n.safetySettings||[],this.tools=n.tools,this.toolConfig=n.toolConfig,this.systemInstruction=ct(n.systemInstruction),this.requestOptions=s||{}}async generateContent(e){let n=ue(e);return at(this._apiSettings,this.model,{generationConfig:this.generationConfig,safetySettings:this.safetySettings,tools:this.tools,toolConfig:this.toolConfig,systemInstruction:this.systemInstruction,...n},this.chromeAdapter,this.requestOptions)}async generateContentStream(e){let n=ue(e);return ot(this._apiSettings,this.model,{generationConfig:this.generationConfig,safetySettings:this.safetySettings,tools:this.tools,toolConfig:this.toolConfig,systemInstruction:this.systemInstruction,...n},this.chromeAdapter,this.requestOptions)}startChat(e){return new me(this._apiSettings,this.model,this.chromeAdapter,{tools:this.tools,toolConfig:this.toolConfig,systemInstruction:this.systemInstruction,generationConfig:this.generationConfig,safetySettings:this.safetySettings,...e},this.requestOptions)}async countTokens(e){let n=ue(e);return Qn(this._apiSettings,this.model,n,this.chromeAdapter)}};var Zn="audio-processor",Ds=`
  class AudioProcessor extends AudioWorkletProcessor {
    constructor(options) {
      super();
      this.targetSampleRate = options.processorOptions.targetSampleRate;
      // 'sampleRate' is a global variable available inside the AudioWorkletGlobalScope,
      // representing the native sample rate of the AudioContext.
      this.inputSampleRate = sampleRate;
    }

    /**
     * This method is called by the browser's audio engine for each block of audio data.
     * Input is a single input, with a single channel (input[0][0]).
     */
    process(inputs) {
      const input = inputs[0];
      if (input && input.length > 0 && input[0].length > 0) {
        const pcmData = input[0]; // Float32Array of raw audio samples.
        
        // Simple linear interpolation for resampling.
        const resampled = new Float32Array(Math.round(pcmData.length * this.targetSampleRate / this.inputSampleRate));
        const ratio = pcmData.length / resampled.length;
        for (let i = 0; i < resampled.length; i++) {
          resampled[i] = pcmData[Math.floor(i * ratio)];
        }

        // Convert Float32 (-1, 1) samples to Int16 (-32768, 32767)
        const resampledInt16 = new Int16Array(resampled.length);
        for (let i = 0; i < resampled.length; i++) {
          const sample = Math.max(-1, Math.min(1, resampled[i]));
          if (sample < 0) {
            resampledInt16[i] = sample * 32768;
          } else {
            resampledInt16[i] = sample * 32767;
          }
        }
        
        this.port.postMessage(resampledInt16);
      }
      // Return true to keep the processor alive and processing the next audio block.
      return true;
    }
  }

  // Register the processor with a name that can be used to instantiate it from the main thread.
  registerProcessor('${Zn}', AudioProcessor);
`;function es(t=Ge(),e){t=Ie(t);let n=$e(t,L),s=e?.backend??new D,i={useLimitedUseAppCheckTokens:e?.useLimitedUseAppCheckTokens??!1},r=Rn(s),o=n.getImmediate({identifier:r});return o.options=i,o}function ts(t,e,n){let s=e,i;if(s.mode?i=s.inCloudParams||{model:On}:i=e,!i.model)throw new d(c.NO_MODEL,"Must provide a model name. Example: getGenerativeModel({ model: 'my-model-name' })");let r=t.chromeAdapterFactory?.(s.mode,typeof window>"u"?void 0:window,s.onDeviceParams);return new Ee(t,i,n,r)}function ns(){x(new y(L,Tn,"PUBLIC").setMultipleInstances(!0)),R(ze,fe),R(ze,fe,"esm2020")}ns();var ss="firebase",is="12.4.0";R(ss,is,"app");export{D as GoogleAIBackend,A as InferenceMode,es as getAI,ts as getGenerativeModel,Ve as initializeApp};
/*! Bundled license information:

@firebase/util/dist/postinstall.mjs:
@firebase/ai/dist/esm/index.esm.js:
@firebase/ai/dist/esm/index.esm.js:
@firebase/ai/dist/esm/index.esm.js:
@firebase/ai/dist/esm/index.esm.js:
@firebase/ai/dist/esm/index.esm.js:
@firebase/ai/dist/esm/index.esm.js:
  (**
   * @license
   * Copyright 2025 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/util/dist/index.esm.js:
@firebase/util/dist/index.esm.js:
@firebase/util/dist/index.esm.js:
@firebase/util/dist/index.esm.js:
@firebase/util/dist/index.esm.js:
@firebase/util/dist/index.esm.js:
@firebase/util/dist/index.esm.js:
@firebase/util/dist/index.esm.js:
@firebase/util/dist/index.esm.js:
@firebase/util/dist/index.esm.js:
@firebase/util/dist/index.esm.js:
@firebase/logger/dist/esm/index.esm.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/util/dist/index.esm.js:
@firebase/util/dist/index.esm.js:
  (**
   * @license
   * Copyright 2022 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/util/dist/index.esm.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2025 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/util/dist/index.esm.js:
@firebase/util/dist/index.esm.js:
  (**
   * @license
   * Copyright 2021 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/util/dist/index.esm.js:
@firebase/component/dist/esm/index.esm.js:
@firebase/app/dist/esm/index.esm.js:
@firebase/app/dist/esm/index.esm.js:
@firebase/app/dist/esm/index.esm.js:
  (**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/util/dist/index.esm.js:
firebase/app/dist/esm/index.esm.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/app/dist/esm/index.esm.js:
  (**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2023 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/app/dist/esm/index.esm.js:
  (**
   * @license
   * Copyright 2021 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/ai/dist/esm/index.esm.js:
@firebase/ai/dist/esm/index.esm.js:
@firebase/ai/dist/esm/index.esm.js:
@firebase/ai/dist/esm/index.esm.js:
@firebase/ai/dist/esm/index.esm.js:
@firebase/ai/dist/esm/index.esm.js:
  (**
   * @license
   * Copyright 2024 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/ai/dist/esm/index.esm.js:
@firebase/ai/dist/esm/index.esm.js:
  (**
   * @license
   * Copyright 2024 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2025 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/ai/dist/esm/index.esm.js:
  (**
   * @license
   * Copyright 2025 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2024 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
*/
