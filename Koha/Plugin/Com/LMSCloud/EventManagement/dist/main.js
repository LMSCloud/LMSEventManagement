(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.EventManagementBundle = factory());
})(this, (function () { 'use strict';

    /******************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */

    function __decorate(decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    }

    /**
     * @license
     * Copyright 2019 Google LLC
     * SPDX-License-Identifier: BSD-3-Clause
     */
    const t$3=window,e$6=t$3.ShadowRoot&&(void 0===t$3.ShadyCSS||t$3.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,s$3=Symbol(),n$5=new WeakMap;class o$7{constructor(t,e,n){if(this._$cssResult$=!0,n!==s$3)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e;}get styleSheet(){let t=this.o;const s=this.t;if(e$6&&void 0===t){const e=void 0!==s&&1===s.length;e&&(t=n$5.get(s)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),e&&n$5.set(s,t));}return t}toString(){return this.cssText}}const r$2=t=>new o$7("string"==typeof t?t:t+"",void 0,s$3),i$5=(t,...e)=>{const n=1===t.length?t[0]:e.reduce(((e,s,n)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+t[n+1]),t[0]);return new o$7(n,t,s$3)},S$1=(s,n)=>{e$6?s.adoptedStyleSheets=n.map((t=>t instanceof CSSStyleSheet?t:t.styleSheet)):n.forEach((e=>{const n=document.createElement("style"),o=t$3.litNonce;void 0!==o&&n.setAttribute("nonce",o),n.textContent=e.cssText,s.appendChild(n);}));},c$1=e$6?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const s of t.cssRules)e+=s.cssText;return r$2(e)})(t):t;

    /**
     * @license
     * Copyright 2017 Google LLC
     * SPDX-License-Identifier: BSD-3-Clause
     */var s$2;const e$5=window,r$1=e$5.trustedTypes,h$1=r$1?r$1.emptyScript:"",o$6=e$5.reactiveElementPolyfillSupport,n$4={toAttribute(t,i){switch(i){case Boolean:t=t?h$1:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t);}return t},fromAttribute(t,i){let s=t;switch(i){case Boolean:s=null!==t;break;case Number:s=null===t?null:Number(t);break;case Object:case Array:try{s=JSON.parse(t);}catch(t){s=null;}}return s}},a$1=(t,i)=>i!==t&&(i==i||t==t),l$3={attribute:!0,type:String,converter:n$4,reflect:!1,hasChanged:a$1};class d$1 extends HTMLElement{constructor(){super(),this._$Ei=new Map,this.isUpdatePending=!1,this.hasUpdated=!1,this._$El=null,this.u();}static addInitializer(t){var i;this.finalize(),(null!==(i=this.h)&&void 0!==i?i:this.h=[]).push(t);}static get observedAttributes(){this.finalize();const t=[];return this.elementProperties.forEach(((i,s)=>{const e=this._$Ep(s,i);void 0!==e&&(this._$Ev.set(e,s),t.push(e));})),t}static createProperty(t,i=l$3){if(i.state&&(i.attribute=!1),this.finalize(),this.elementProperties.set(t,i),!i.noAccessor&&!this.prototype.hasOwnProperty(t)){const s="symbol"==typeof t?Symbol():"__"+t,e=this.getPropertyDescriptor(t,s,i);void 0!==e&&Object.defineProperty(this.prototype,t,e);}}static getPropertyDescriptor(t,i,s){return {get(){return this[i]},set(e){const r=this[t];this[i]=e,this.requestUpdate(t,r,s);},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)||l$3}static finalize(){if(this.hasOwnProperty("finalized"))return !1;this.finalized=!0;const t=Object.getPrototypeOf(this);if(t.finalize(),void 0!==t.h&&(this.h=[...t.h]),this.elementProperties=new Map(t.elementProperties),this._$Ev=new Map,this.hasOwnProperty("properties")){const t=this.properties,i=[...Object.getOwnPropertyNames(t),...Object.getOwnPropertySymbols(t)];for(const s of i)this.createProperty(s,t[s]);}return this.elementStyles=this.finalizeStyles(this.styles),!0}static finalizeStyles(i){const s=[];if(Array.isArray(i)){const e=new Set(i.flat(1/0).reverse());for(const i of e)s.unshift(c$1(i));}else void 0!==i&&s.push(c$1(i));return s}static _$Ep(t,i){const s=i.attribute;return !1===s?void 0:"string"==typeof s?s:"string"==typeof t?t.toLowerCase():void 0}u(){var t;this._$E_=new Promise((t=>this.enableUpdating=t)),this._$AL=new Map,this._$Eg(),this.requestUpdate(),null===(t=this.constructor.h)||void 0===t||t.forEach((t=>t(this)));}addController(t){var i,s;(null!==(i=this._$ES)&&void 0!==i?i:this._$ES=[]).push(t),void 0!==this.renderRoot&&this.isConnected&&(null===(s=t.hostConnected)||void 0===s||s.call(t));}removeController(t){var i;null===(i=this._$ES)||void 0===i||i.splice(this._$ES.indexOf(t)>>>0,1);}_$Eg(){this.constructor.elementProperties.forEach(((t,i)=>{this.hasOwnProperty(i)&&(this._$Ei.set(i,this[i]),delete this[i]);}));}createRenderRoot(){var t;const s=null!==(t=this.shadowRoot)&&void 0!==t?t:this.attachShadow(this.constructor.shadowRootOptions);return S$1(s,this.constructor.elementStyles),s}connectedCallback(){var t;void 0===this.renderRoot&&(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),null===(t=this._$ES)||void 0===t||t.forEach((t=>{var i;return null===(i=t.hostConnected)||void 0===i?void 0:i.call(t)}));}enableUpdating(t){}disconnectedCallback(){var t;null===(t=this._$ES)||void 0===t||t.forEach((t=>{var i;return null===(i=t.hostDisconnected)||void 0===i?void 0:i.call(t)}));}attributeChangedCallback(t,i,s){this._$AK(t,s);}_$EO(t,i,s=l$3){var e;const r=this.constructor._$Ep(t,s);if(void 0!==r&&!0===s.reflect){const h=(void 0!==(null===(e=s.converter)||void 0===e?void 0:e.toAttribute)?s.converter:n$4).toAttribute(i,s.type);this._$El=t,null==h?this.removeAttribute(r):this.setAttribute(r,h),this._$El=null;}}_$AK(t,i){var s;const e=this.constructor,r=e._$Ev.get(t);if(void 0!==r&&this._$El!==r){const t=e.getPropertyOptions(r),h="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==(null===(s=t.converter)||void 0===s?void 0:s.fromAttribute)?t.converter:n$4;this._$El=r,this[r]=h.fromAttribute(i,t.type),this._$El=null;}}requestUpdate(t,i,s){let e=!0;void 0!==t&&(((s=s||this.constructor.getPropertyOptions(t)).hasChanged||a$1)(this[t],i)?(this._$AL.has(t)||this._$AL.set(t,i),!0===s.reflect&&this._$El!==t&&(void 0===this._$EC&&(this._$EC=new Map),this._$EC.set(t,s))):e=!1),!this.isUpdatePending&&e&&(this._$E_=this._$Ej());}async _$Ej(){this.isUpdatePending=!0;try{await this._$E_;}catch(t){Promise.reject(t);}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var t;if(!this.isUpdatePending)return;this.hasUpdated,this._$Ei&&(this._$Ei.forEach(((t,i)=>this[i]=t)),this._$Ei=void 0);let i=!1;const s=this._$AL;try{i=this.shouldUpdate(s),i?(this.willUpdate(s),null===(t=this._$ES)||void 0===t||t.forEach((t=>{var i;return null===(i=t.hostUpdate)||void 0===i?void 0:i.call(t)})),this.update(s)):this._$Ek();}catch(t){throw i=!1,this._$Ek(),t}i&&this._$AE(s);}willUpdate(t){}_$AE(t){var i;null===(i=this._$ES)||void 0===i||i.forEach((t=>{var i;return null===(i=t.hostUpdated)||void 0===i?void 0:i.call(t)})),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t);}_$Ek(){this._$AL=new Map,this.isUpdatePending=!1;}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$E_}shouldUpdate(t){return !0}update(t){void 0!==this._$EC&&(this._$EC.forEach(((t,i)=>this._$EO(i,this[i],t))),this._$EC=void 0),this._$Ek();}updated(t){}firstUpdated(t){}}d$1.finalized=!0,d$1.elementProperties=new Map,d$1.elementStyles=[],d$1.shadowRootOptions={mode:"open"},null==o$6||o$6({ReactiveElement:d$1}),(null!==(s$2=e$5.reactiveElementVersions)&&void 0!==s$2?s$2:e$5.reactiveElementVersions=[]).push("1.6.1");

    /**
     * @license
     * Copyright 2017 Google LLC
     * SPDX-License-Identifier: BSD-3-Clause
     */
    var t$2;const i$4=window,s$1=i$4.trustedTypes,e$4=s$1?s$1.createPolicy("lit-html",{createHTML:t=>t}):void 0,o$5="$lit$",n$3=`lit$${(Math.random()+"").slice(9)}$`,l$2="?"+n$3,h=`<${l$2}>`,r=document,d=()=>r.createComment(""),u=t=>null===t||"object"!=typeof t&&"function"!=typeof t,c=Array.isArray,v=t=>c(t)||"function"==typeof(null==t?void 0:t[Symbol.iterator]),a="[ \t\n\f\r]",f=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,_=/-->/g,m=/>/g,p=RegExp(`>|${a}(?:([^\\s"'>=/]+)(${a}*=${a}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),g=/'/g,$=/"/g,y=/^(?:script|style|textarea|title)$/i,w=t=>(i,...s)=>({_$litType$:t,strings:i,values:s}),x=w(1),b=w(2),T=Symbol.for("lit-noChange"),A=Symbol.for("lit-nothing"),E=new WeakMap,C=r.createTreeWalker(r,129,null,!1),P=(t,i)=>{const s=t.length-1,l=[];let r,d=2===i?"<svg>":"",u=f;for(let i=0;i<s;i++){const s=t[i];let e,c,v=-1,a=0;for(;a<s.length&&(u.lastIndex=a,c=u.exec(s),null!==c);)a=u.lastIndex,u===f?"!--"===c[1]?u=_:void 0!==c[1]?u=m:void 0!==c[2]?(y.test(c[2])&&(r=RegExp("</"+c[2],"g")),u=p):void 0!==c[3]&&(u=p):u===p?">"===c[0]?(u=null!=r?r:f,v=-1):void 0===c[1]?v=-2:(v=u.lastIndex-c[2].length,e=c[1],u=void 0===c[3]?p:'"'===c[3]?$:g):u===$||u===g?u=p:u===_||u===m?u=f:(u=p,r=void 0);const w=u===p&&t[i+1].startsWith("/>")?" ":"";d+=u===f?s+h:v>=0?(l.push(e),s.slice(0,v)+o$5+s.slice(v)+n$3+w):s+n$3+(-2===v?(l.push(void 0),i):w);}const c=d+(t[s]||"<?>")+(2===i?"</svg>":"");if(!Array.isArray(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return [void 0!==e$4?e$4.createHTML(c):c,l]};class V{constructor({strings:t,_$litType$:i},e){let h;this.parts=[];let r=0,u=0;const c=t.length-1,v=this.parts,[a,f]=P(t,i);if(this.el=V.createElement(a,e),C.currentNode=this.el.content,2===i){const t=this.el.content,i=t.firstChild;i.remove(),t.append(...i.childNodes);}for(;null!==(h=C.nextNode())&&v.length<c;){if(1===h.nodeType){if(h.hasAttributes()){const t=[];for(const i of h.getAttributeNames())if(i.endsWith(o$5)||i.startsWith(n$3)){const s=f[u++];if(t.push(i),void 0!==s){const t=h.getAttribute(s.toLowerCase()+o$5).split(n$3),i=/([.?@])?(.*)/.exec(s);v.push({type:1,index:r,name:i[2],strings:t,ctor:"."===i[1]?k:"?"===i[1]?I:"@"===i[1]?L:R});}else v.push({type:6,index:r});}for(const i of t)h.removeAttribute(i);}if(y.test(h.tagName)){const t=h.textContent.split(n$3),i=t.length-1;if(i>0){h.textContent=s$1?s$1.emptyScript:"";for(let s=0;s<i;s++)h.append(t[s],d()),C.nextNode(),v.push({type:2,index:++r});h.append(t[i],d());}}}else if(8===h.nodeType)if(h.data===l$2)v.push({type:2,index:r});else {let t=-1;for(;-1!==(t=h.data.indexOf(n$3,t+1));)v.push({type:7,index:r}),t+=n$3.length-1;}r++;}}static createElement(t,i){const s=r.createElement("template");return s.innerHTML=t,s}}function N(t,i,s=t,e){var o,n,l,h;if(i===T)return i;let r=void 0!==e?null===(o=s._$Co)||void 0===o?void 0:o[e]:s._$Cl;const d=u(i)?void 0:i._$litDirective$;return (null==r?void 0:r.constructor)!==d&&(null===(n=null==r?void 0:r._$AO)||void 0===n||n.call(r,!1),void 0===d?r=void 0:(r=new d(t),r._$AT(t,s,e)),void 0!==e?(null!==(l=(h=s)._$Co)&&void 0!==l?l:h._$Co=[])[e]=r:s._$Cl=r),void 0!==r&&(i=N(t,r._$AS(t,i.values),r,e)),i}class S{constructor(t,i){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=i;}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){var i;const{el:{content:s},parts:e}=this._$AD,o=(null!==(i=null==t?void 0:t.creationScope)&&void 0!==i?i:r).importNode(s,!0);C.currentNode=o;let n=C.nextNode(),l=0,h=0,d=e[0];for(;void 0!==d;){if(l===d.index){let i;2===d.type?i=new M(n,n.nextSibling,this,t):1===d.type?i=new d.ctor(n,d.name,d.strings,this,t):6===d.type&&(i=new z(n,this,t)),this._$AV.push(i),d=e[++h];}l!==(null==d?void 0:d.index)&&(n=C.nextNode(),l++);}return o}v(t){let i=0;for(const s of this._$AV)void 0!==s&&(void 0!==s.strings?(s._$AI(t,s,i),i+=s.strings.length-2):s._$AI(t[i])),i++;}}class M{constructor(t,i,s,e){var o;this.type=2,this._$AH=A,this._$AN=void 0,this._$AA=t,this._$AB=i,this._$AM=s,this.options=e,this._$Cp=null===(o=null==e?void 0:e.isConnected)||void 0===o||o;}get _$AU(){var t,i;return null!==(i=null===(t=this._$AM)||void 0===t?void 0:t._$AU)&&void 0!==i?i:this._$Cp}get parentNode(){let t=this._$AA.parentNode;const i=this._$AM;return void 0!==i&&11===(null==t?void 0:t.nodeType)&&(t=i.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,i=this){t=N(this,t,i),u(t)?t===A||null==t||""===t?(this._$AH!==A&&this._$AR(),this._$AH=A):t!==this._$AH&&t!==T&&this._(t):void 0!==t._$litType$?this.g(t):void 0!==t.nodeType?this.$(t):v(t)?this.T(t):this._(t);}k(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}$(t){this._$AH!==t&&(this._$AR(),this._$AH=this.k(t));}_(t){this._$AH!==A&&u(this._$AH)?this._$AA.nextSibling.data=t:this.$(r.createTextNode(t)),this._$AH=t;}g(t){var i;const{values:s,_$litType$:e}=t,o="number"==typeof e?this._$AC(t):(void 0===e.el&&(e.el=V.createElement(e.h,this.options)),e);if((null===(i=this._$AH)||void 0===i?void 0:i._$AD)===o)this._$AH.v(s);else {const t=new S(o,this),i=t.u(this.options);t.v(s),this.$(i),this._$AH=t;}}_$AC(t){let i=E.get(t.strings);return void 0===i&&E.set(t.strings,i=new V(t)),i}T(t){c(this._$AH)||(this._$AH=[],this._$AR());const i=this._$AH;let s,e=0;for(const o of t)e===i.length?i.push(s=new M(this.k(d()),this.k(d()),this,this.options)):s=i[e],s._$AI(o),e++;e<i.length&&(this._$AR(s&&s._$AB.nextSibling,e),i.length=e);}_$AR(t=this._$AA.nextSibling,i){var s;for(null===(s=this._$AP)||void 0===s||s.call(this,!1,!0,i);t&&t!==this._$AB;){const i=t.nextSibling;t.remove(),t=i;}}setConnected(t){var i;void 0===this._$AM&&(this._$Cp=t,null===(i=this._$AP)||void 0===i||i.call(this,t));}}class R{constructor(t,i,s,e,o){this.type=1,this._$AH=A,this._$AN=void 0,this.element=t,this.name=i,this._$AM=e,this.options=o,s.length>2||""!==s[0]||""!==s[1]?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=A;}get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}_$AI(t,i=this,s,e){const o=this.strings;let n=!1;if(void 0===o)t=N(this,t,i,0),n=!u(t)||t!==this._$AH&&t!==T,n&&(this._$AH=t);else {const e=t;let l,h;for(t=o[0],l=0;l<o.length-1;l++)h=N(this,e[s+l],i,l),h===T&&(h=this._$AH[l]),n||(n=!u(h)||h!==this._$AH[l]),h===A?t=A:t!==A&&(t+=(null!=h?h:"")+o[l+1]),this._$AH[l]=h;}n&&!e&&this.j(t);}j(t){t===A?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,null!=t?t:"");}}class k extends R{constructor(){super(...arguments),this.type=3;}j(t){this.element[this.name]=t===A?void 0:t;}}const H=s$1?s$1.emptyScript:"";class I extends R{constructor(){super(...arguments),this.type=4;}j(t){t&&t!==A?this.element.setAttribute(this.name,H):this.element.removeAttribute(this.name);}}class L extends R{constructor(t,i,s,e,o){super(t,i,s,e,o),this.type=5;}_$AI(t,i=this){var s;if((t=null!==(s=N(this,t,i,0))&&void 0!==s?s:A)===T)return;const e=this._$AH,o=t===A&&e!==A||t.capture!==e.capture||t.once!==e.once||t.passive!==e.passive,n=t!==A&&(e===A||o);o&&this.element.removeEventListener(this.name,this,e),n&&this.element.addEventListener(this.name,this,t),this._$AH=t;}handleEvent(t){var i,s;"function"==typeof this._$AH?this._$AH.call(null!==(s=null===(i=this.options)||void 0===i?void 0:i.host)&&void 0!==s?s:this.element,t):this._$AH.handleEvent(t);}}class z{constructor(t,i,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=i,this.options=s;}get _$AU(){return this._$AM._$AU}_$AI(t){N(this,t);}}const Z={O:o$5,P:n$3,A:l$2,C:1,M:P,L:S,D:v,R:N,I:M,V:R,H:I,N:L,U:k,F:z},j=i$4.litHtmlPolyfillSupport;null==j||j(V,M),(null!==(t$2=i$4.litHtmlVersions)&&void 0!==t$2?t$2:i$4.litHtmlVersions=[]).push("2.7.2");const B=(t,i,s)=>{var e,o;const n=null!==(e=null==s?void 0:s.renderBefore)&&void 0!==e?e:i;let l=n._$litPart$;if(void 0===l){const t=null!==(o=null==s?void 0:s.renderBefore)&&void 0!==o?o:null;n._$litPart$=l=new M(i.insertBefore(d(),t),t,void 0,null!=s?s:{});}return l._$AI(t),l};

    var litHtml = /*#__PURE__*/Object.freeze({
        __proto__: null,
        _$LH: Z,
        html: x,
        noChange: T,
        nothing: A,
        render: B,
        svg: b
    });

    /**
     * @license
     * Copyright 2017 Google LLC
     * SPDX-License-Identifier: BSD-3-Clause
     */var l$1,o$4;class s extends d$1{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0;}createRenderRoot(){var t,e;const i=super.createRenderRoot();return null!==(t=(e=this.renderOptions).renderBefore)&&void 0!==t||(e.renderBefore=i.firstChild),i}update(t){const i=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=B(i,this.renderRoot,this.renderOptions);}connectedCallback(){var t;super.connectedCallback(),null===(t=this._$Do)||void 0===t||t.setConnected(!0);}disconnectedCallback(){var t;super.disconnectedCallback(),null===(t=this._$Do)||void 0===t||t.setConnected(!1);}render(){return T}}s.finalized=!0,s._$litElement$=!0,null===(l$1=globalThis.litElementHydrateSupport)||void 0===l$1||l$1.call(globalThis,{LitElement:s});const n$2=globalThis.litElementPolyfillSupport;null==n$2||n$2({LitElement:s});(null!==(o$4=globalThis.litElementVersions)&&void 0!==o$4?o$4:globalThis.litElementVersions=[]).push("3.3.1");

    const bootstrapStyles = i$5`
/*!
 * Bootstrap v4.6.0 (https://getbootstrap.com/)
 * Copyright 2011-2021 The Bootstrap Authors
 * Copyright 2011-2021 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 */:root{--blue:#007bff;--indigo:#6610f2;--purple:#6f42c1;--pink:#e83e8c;--red:#dc3545;--orange:#fd7e14;--yellow:#ffc107;--green:#28a745;--teal:#20c997;--cyan:#17a2b8;--white:#fff;--gray:#6c757d;--gray-dark:#343a40;--primary:#007bff;--secondary:#6c757d;--success:#28a745;--info:#17a2b8;--warning:#ffc107;--danger:#dc3545;--light:#f8f9fa;--dark:#343a40;--breakpoint-xs:0;--breakpoint-sm:576px;--breakpoint-md:768px;--breakpoint-lg:992px;--breakpoint-xl:1200px;--font-family-sans-serif:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,"Noto Sans","Liberation Sans",sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji";--font-family-monospace:SFMono-Regular,Menlo,Monaco,Consolas,"Liberation Mono","Courier New",monospace}*,::after,::before{box-sizing:border-box}html{font-family:sans-serif;line-height:1.15;-webkit-text-size-adjust:100%;-webkit-tap-highlight-color:transparent}article,aside,figcaption,figure,footer,header,hgroup,main,nav,section{display:block}body{margin:0;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,"Noto Sans","Liberation Sans",sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji";font-size:1rem;font-weight:400;line-height:1.5;color:#212529;text-align:left;background-color:#fff}[tabindex="-1"]:focus:not(:focus-visible){outline:0!important}hr{box-sizing:content-box;height:0;overflow:visible}h1,h2,h3,h4,h5,h6{margin-top:0;margin-bottom:.5rem}p{margin-top:0;margin-bottom:1rem}abbr[data-original-title],abbr[title]{text-decoration:underline;-webkit-text-decoration:underline dotted;text-decoration:underline dotted;cursor:help;border-bottom:0;-webkit-text-decoration-skip-ink:none;text-decoration-skip-ink:none}address{margin-bottom:1rem;font-style:normal;line-height:inherit}dl,ol,ul{margin-top:0;margin-bottom:1rem}ol ol,ol ul,ul ol,ul ul{margin-bottom:0}dt{font-weight:700}dd{margin-bottom:.5rem;margin-left:0}blockquote{margin:0 0 1rem}b,strong{font-weight:bolder}small{font-size:80%}sub,sup{position:relative;font-size:75%;line-height:0;vertical-align:baseline}sub{bottom:-.25em}sup{top:-.5em}a{color:#007bff;text-decoration:none;background-color:transparent}a:hover{color:#0056b3;text-decoration:underline}a:not([href]):not([class]){color:inherit;text-decoration:none}a:not([href]):not([class]):hover{color:inherit;text-decoration:none}code,kbd,pre,samp{font-family:SFMono-Regular,Menlo,Monaco,Consolas,"Liberation Mono","Courier New",monospace;font-size:1em}pre{margin-top:0;margin-bottom:1rem;overflow:auto;-ms-overflow-style:scrollbar}figure{margin:0 0 1rem}img{vertical-align:middle;border-style:none}svg{overflow:hidden;vertical-align:middle}table{border-collapse:collapse}caption{padding-top:.75rem;padding-bottom:.75rem;color:#6c757d;text-align:left;caption-side:bottom}th{text-align:inherit;text-align:-webkit-match-parent}label{display:inline-block;margin-bottom:.5rem}button{border-radius:0}button:focus:not(:focus-visible){outline:0}button,input,optgroup,select,textarea{margin:0;font-family:inherit;font-size:inherit;line-height:inherit}button,input{overflow:visible}button,select{text-transform:none}[role=button]{cursor:pointer}select{word-wrap:normal}[type=button],[type=reset],[type=submit],button{-webkit-appearance:button}[type=button]:not(:disabled),[type=reset]:not(:disabled),[type=submit]:not(:disabled),button:not(:disabled){cursor:pointer}[type=button]::-moz-focus-inner,[type=reset]::-moz-focus-inner,[type=submit]::-moz-focus-inner,button::-moz-focus-inner{padding:0;border-style:none}input[type=checkbox],input[type=radio]{box-sizing:border-box;padding:0}textarea{overflow:auto;resize:vertical}fieldset{min-width:0;padding:0;margin:0;border:0}legend{display:block;width:100%;max-width:100%;padding:0;margin-bottom:.5rem;font-size:1.5rem;line-height:inherit;color:inherit;white-space:normal}progress{vertical-align:baseline}[type=number]::-webkit-inner-spin-button,[type=number]::-webkit-outer-spin-button{height:auto}[type=search]{outline-offset:-2px;-webkit-appearance:none}[type=search]::-webkit-search-decoration{-webkit-appearance:none}::-webkit-file-upload-button{font:inherit;-webkit-appearance:button}output{display:inline-block}summary{display:list-item;cursor:pointer}template{display:none}[hidden]{display:none!important}.h1,.h2,.h3,.h4,.h5,.h6,h1,h2,h3,h4,h5,h6{margin-bottom:.5rem;font-weight:500;line-height:1.2}.h1,h1{font-size:2.5rem}.h2,h2{font-size:2rem}.h3,h3{font-size:1.75rem}.h4,h4{font-size:1.5rem}.h5,h5{font-size:1.25rem}.h6,h6{font-size:1rem}.lead{font-size:1.25rem;font-weight:300}.display-1{font-size:6rem;font-weight:300;line-height:1.2}.display-2{font-size:5.5rem;font-weight:300;line-height:1.2}.display-3{font-size:4.5rem;font-weight:300;line-height:1.2}.display-4{font-size:3.5rem;font-weight:300;line-height:1.2}hr{margin-top:1rem;margin-bottom:1rem;border:0;border-top:1px solid rgba(0,0,0,.1)}.small,small{font-size:80%;font-weight:400}.mark,mark{padding:.2em;background-color:#fcf8e3}.list-unstyled{padding-left:0;list-style:none}.list-inline{padding-left:0;list-style:none}.list-inline-item{display:inline-block}.list-inline-item:not(:last-child){margin-right:.5rem}.initialism{font-size:90%;text-transform:uppercase}.blockquote{margin-bottom:1rem;font-size:1.25rem}.blockquote-footer{display:block;font-size:80%;color:#6c757d}.blockquote-footer::before{content:"\\2014\\00A0"}.img-fluid{max-width:100%;height:auto}.img-thumbnail{padding:.25rem;background-color:#fff;border:1px solid #dee2e6;border-radius:.25rem;max-width:100%;height:auto}.figure{display:inline-block}.figure-img{margin-bottom:.5rem;line-height:1}.figure-caption{font-size:90%;color:#6c757d}code{font-size:87.5%;color:#e83e8c;word-wrap:break-word}a>code{color:inherit}kbd{padding:.2rem .4rem;font-size:87.5%;color:#fff;background-color:#212529;border-radius:.2rem}kbd kbd{padding:0;font-size:100%;font-weight:700}pre{display:block;font-size:87.5%;color:#212529}pre code{font-size:inherit;color:inherit;word-break:normal}.pre-scrollable{max-height:340px;overflow-y:scroll}.container,.container-fluid,.container-lg,.container-md,.container-sm,.container-xl{width:100%;padding-right:15px;padding-left:15px;margin-right:auto;margin-left:auto}@media (min-width:576px){.container,.container-sm{max-width:540px}}@media (min-width:768px){.container,.container-md,.container-sm{max-width:720px}}@media (min-width:992px){.container,.container-lg,.container-md,.container-sm{max-width:960px}}@media (min-width:1200px){.container,.container-lg,.container-md,.container-sm,.container-xl{max-width:1140px}}.row{display:-ms-flexbox;display:flex;-ms-flex-wrap:wrap;flex-wrap:wrap;margin-right:-15px;margin-left:-15px}.no-gutters{margin-right:0;margin-left:0}.no-gutters>.col,.no-gutters>[class*=col-]{padding-right:0;padding-left:0}.col,.col-1,.col-10,.col-11,.col-12,.col-2,.col-3,.col-4,.col-5,.col-6,.col-7,.col-8,.col-9,.col-auto,.col-lg,.col-lg-1,.col-lg-10,.col-lg-11,.col-lg-12,.col-lg-2,.col-lg-3,.col-lg-4,.col-lg-5,.col-lg-6,.col-lg-7,.col-lg-8,.col-lg-9,.col-lg-auto,.col-md,.col-md-1,.col-md-10,.col-md-11,.col-md-12,.col-md-2,.col-md-3,.col-md-4,.col-md-5,.col-md-6,.col-md-7,.col-md-8,.col-md-9,.col-md-auto,.col-sm,.col-sm-1,.col-sm-10,.col-sm-11,.col-sm-12,.col-sm-2,.col-sm-3,.col-sm-4,.col-sm-5,.col-sm-6,.col-sm-7,.col-sm-8,.col-sm-9,.col-sm-auto,.col-xl,.col-xl-1,.col-xl-10,.col-xl-11,.col-xl-12,.col-xl-2,.col-xl-3,.col-xl-4,.col-xl-5,.col-xl-6,.col-xl-7,.col-xl-8,.col-xl-9,.col-xl-auto{position:relative;width:100%;padding-right:15px;padding-left:15px}.col{-ms-flex-preferred-size:0;flex-basis:0;-ms-flex-positive:1;flex-grow:1;max-width:100%}.row-cols-1>*{-ms-flex:0 0 100%;flex:0 0 100%;max-width:100%}.row-cols-2>*{-ms-flex:0 0 50%;flex:0 0 50%;max-width:50%}.row-cols-3>*{-ms-flex:0 0 33.333333%;flex:0 0 33.333333%;max-width:33.333333%}.row-cols-4>*{-ms-flex:0 0 25%;flex:0 0 25%;max-width:25%}.row-cols-5>*{-ms-flex:0 0 20%;flex:0 0 20%;max-width:20%}.row-cols-6>*{-ms-flex:0 0 16.666667%;flex:0 0 16.666667%;max-width:16.666667%}.col-auto{-ms-flex:0 0 auto;flex:0 0 auto;width:auto;max-width:100%}.col-1{-ms-flex:0 0 8.333333%;flex:0 0 8.333333%;max-width:8.333333%}.col-2{-ms-flex:0 0 16.666667%;flex:0 0 16.666667%;max-width:16.666667%}.col-3{-ms-flex:0 0 25%;flex:0 0 25%;max-width:25%}.col-4{-ms-flex:0 0 33.333333%;flex:0 0 33.333333%;max-width:33.333333%}.col-5{-ms-flex:0 0 41.666667%;flex:0 0 41.666667%;max-width:41.666667%}.col-6{-ms-flex:0 0 50%;flex:0 0 50%;max-width:50%}.col-7{-ms-flex:0 0 58.333333%;flex:0 0 58.333333%;max-width:58.333333%}.col-8{-ms-flex:0 0 66.666667%;flex:0 0 66.666667%;max-width:66.666667%}.col-9{-ms-flex:0 0 75%;flex:0 0 75%;max-width:75%}.col-10{-ms-flex:0 0 83.333333%;flex:0 0 83.333333%;max-width:83.333333%}.col-11{-ms-flex:0 0 91.666667%;flex:0 0 91.666667%;max-width:91.666667%}.col-12{-ms-flex:0 0 100%;flex:0 0 100%;max-width:100%}.order-first{-ms-flex-order:-1;order:-1}.order-last{-ms-flex-order:13;order:13}.order-0{-ms-flex-order:0;order:0}.order-1{-ms-flex-order:1;order:1}.order-2{-ms-flex-order:2;order:2}.order-3{-ms-flex-order:3;order:3}.order-4{-ms-flex-order:4;order:4}.order-5{-ms-flex-order:5;order:5}.order-6{-ms-flex-order:6;order:6}.order-7{-ms-flex-order:7;order:7}.order-8{-ms-flex-order:8;order:8}.order-9{-ms-flex-order:9;order:9}.order-10{-ms-flex-order:10;order:10}.order-11{-ms-flex-order:11;order:11}.order-12{-ms-flex-order:12;order:12}.offset-1{margin-left:8.333333%}.offset-2{margin-left:16.666667%}.offset-3{margin-left:25%}.offset-4{margin-left:33.333333%}.offset-5{margin-left:41.666667%}.offset-6{margin-left:50%}.offset-7{margin-left:58.333333%}.offset-8{margin-left:66.666667%}.offset-9{margin-left:75%}.offset-10{margin-left:83.333333%}.offset-11{margin-left:91.666667%}@media (min-width:576px){.col-sm{-ms-flex-preferred-size:0;flex-basis:0;-ms-flex-positive:1;flex-grow:1;max-width:100%}.row-cols-sm-1>*{-ms-flex:0 0 100%;flex:0 0 100%;max-width:100%}.row-cols-sm-2>*{-ms-flex:0 0 50%;flex:0 0 50%;max-width:50%}.row-cols-sm-3>*{-ms-flex:0 0 33.333333%;flex:0 0 33.333333%;max-width:33.333333%}.row-cols-sm-4>*{-ms-flex:0 0 25%;flex:0 0 25%;max-width:25%}.row-cols-sm-5>*{-ms-flex:0 0 20%;flex:0 0 20%;max-width:20%}.row-cols-sm-6>*{-ms-flex:0 0 16.666667%;flex:0 0 16.666667%;max-width:16.666667%}.col-sm-auto{-ms-flex:0 0 auto;flex:0 0 auto;width:auto;max-width:100%}.col-sm-1{-ms-flex:0 0 8.333333%;flex:0 0 8.333333%;max-width:8.333333%}.col-sm-2{-ms-flex:0 0 16.666667%;flex:0 0 16.666667%;max-width:16.666667%}.col-sm-3{-ms-flex:0 0 25%;flex:0 0 25%;max-width:25%}.col-sm-4{-ms-flex:0 0 33.333333%;flex:0 0 33.333333%;max-width:33.333333%}.col-sm-5{-ms-flex:0 0 41.666667%;flex:0 0 41.666667%;max-width:41.666667%}.col-sm-6{-ms-flex:0 0 50%;flex:0 0 50%;max-width:50%}.col-sm-7{-ms-flex:0 0 58.333333%;flex:0 0 58.333333%;max-width:58.333333%}.col-sm-8{-ms-flex:0 0 66.666667%;flex:0 0 66.666667%;max-width:66.666667%}.col-sm-9{-ms-flex:0 0 75%;flex:0 0 75%;max-width:75%}.col-sm-10{-ms-flex:0 0 83.333333%;flex:0 0 83.333333%;max-width:83.333333%}.col-sm-11{-ms-flex:0 0 91.666667%;flex:0 0 91.666667%;max-width:91.666667%}.col-sm-12{-ms-flex:0 0 100%;flex:0 0 100%;max-width:100%}.order-sm-first{-ms-flex-order:-1;order:-1}.order-sm-last{-ms-flex-order:13;order:13}.order-sm-0{-ms-flex-order:0;order:0}.order-sm-1{-ms-flex-order:1;order:1}.order-sm-2{-ms-flex-order:2;order:2}.order-sm-3{-ms-flex-order:3;order:3}.order-sm-4{-ms-flex-order:4;order:4}.order-sm-5{-ms-flex-order:5;order:5}.order-sm-6{-ms-flex-order:6;order:6}.order-sm-7{-ms-flex-order:7;order:7}.order-sm-8{-ms-flex-order:8;order:8}.order-sm-9{-ms-flex-order:9;order:9}.order-sm-10{-ms-flex-order:10;order:10}.order-sm-11{-ms-flex-order:11;order:11}.order-sm-12{-ms-flex-order:12;order:12}.offset-sm-0{margin-left:0}.offset-sm-1{margin-left:8.333333%}.offset-sm-2{margin-left:16.666667%}.offset-sm-3{margin-left:25%}.offset-sm-4{margin-left:33.333333%}.offset-sm-5{margin-left:41.666667%}.offset-sm-6{margin-left:50%}.offset-sm-7{margin-left:58.333333%}.offset-sm-8{margin-left:66.666667%}.offset-sm-9{margin-left:75%}.offset-sm-10{margin-left:83.333333%}.offset-sm-11{margin-left:91.666667%}}@media (min-width:768px){.col-md{-ms-flex-preferred-size:0;flex-basis:0;-ms-flex-positive:1;flex-grow:1;max-width:100%}.row-cols-md-1>*{-ms-flex:0 0 100%;flex:0 0 100%;max-width:100%}.row-cols-md-2>*{-ms-flex:0 0 50%;flex:0 0 50%;max-width:50%}.row-cols-md-3>*{-ms-flex:0 0 33.333333%;flex:0 0 33.333333%;max-width:33.333333%}.row-cols-md-4>*{-ms-flex:0 0 25%;flex:0 0 25%;max-width:25%}.row-cols-md-5>*{-ms-flex:0 0 20%;flex:0 0 20%;max-width:20%}.row-cols-md-6>*{-ms-flex:0 0 16.666667%;flex:0 0 16.666667%;max-width:16.666667%}.col-md-auto{-ms-flex:0 0 auto;flex:0 0 auto;width:auto;max-width:100%}.col-md-1{-ms-flex:0 0 8.333333%;flex:0 0 8.333333%;max-width:8.333333%}.col-md-2{-ms-flex:0 0 16.666667%;flex:0 0 16.666667%;max-width:16.666667%}.col-md-3{-ms-flex:0 0 25%;flex:0 0 25%;max-width:25%}.col-md-4{-ms-flex:0 0 33.333333%;flex:0 0 33.333333%;max-width:33.333333%}.col-md-5{-ms-flex:0 0 41.666667%;flex:0 0 41.666667%;max-width:41.666667%}.col-md-6{-ms-flex:0 0 50%;flex:0 0 50%;max-width:50%}.col-md-7{-ms-flex:0 0 58.333333%;flex:0 0 58.333333%;max-width:58.333333%}.col-md-8{-ms-flex:0 0 66.666667%;flex:0 0 66.666667%;max-width:66.666667%}.col-md-9{-ms-flex:0 0 75%;flex:0 0 75%;max-width:75%}.col-md-10{-ms-flex:0 0 83.333333%;flex:0 0 83.333333%;max-width:83.333333%}.col-md-11{-ms-flex:0 0 91.666667%;flex:0 0 91.666667%;max-width:91.666667%}.col-md-12{-ms-flex:0 0 100%;flex:0 0 100%;max-width:100%}.order-md-first{-ms-flex-order:-1;order:-1}.order-md-last{-ms-flex-order:13;order:13}.order-md-0{-ms-flex-order:0;order:0}.order-md-1{-ms-flex-order:1;order:1}.order-md-2{-ms-flex-order:2;order:2}.order-md-3{-ms-flex-order:3;order:3}.order-md-4{-ms-flex-order:4;order:4}.order-md-5{-ms-flex-order:5;order:5}.order-md-6{-ms-flex-order:6;order:6}.order-md-7{-ms-flex-order:7;order:7}.order-md-8{-ms-flex-order:8;order:8}.order-md-9{-ms-flex-order:9;order:9}.order-md-10{-ms-flex-order:10;order:10}.order-md-11{-ms-flex-order:11;order:11}.order-md-12{-ms-flex-order:12;order:12}.offset-md-0{margin-left:0}.offset-md-1{margin-left:8.333333%}.offset-md-2{margin-left:16.666667%}.offset-md-3{margin-left:25%}.offset-md-4{margin-left:33.333333%}.offset-md-5{margin-left:41.666667%}.offset-md-6{margin-left:50%}.offset-md-7{margin-left:58.333333%}.offset-md-8{margin-left:66.666667%}.offset-md-9{margin-left:75%}.offset-md-10{margin-left:83.333333%}.offset-md-11{margin-left:91.666667%}}@media (min-width:992px){.col-lg{-ms-flex-preferred-size:0;flex-basis:0;-ms-flex-positive:1;flex-grow:1;max-width:100%}.row-cols-lg-1>*{-ms-flex:0 0 100%;flex:0 0 100%;max-width:100%}.row-cols-lg-2>*{-ms-flex:0 0 50%;flex:0 0 50%;max-width:50%}.row-cols-lg-3>*{-ms-flex:0 0 33.333333%;flex:0 0 33.333333%;max-width:33.333333%}.row-cols-lg-4>*{-ms-flex:0 0 25%;flex:0 0 25%;max-width:25%}.row-cols-lg-5>*{-ms-flex:0 0 20%;flex:0 0 20%;max-width:20%}.row-cols-lg-6>*{-ms-flex:0 0 16.666667%;flex:0 0 16.666667%;max-width:16.666667%}.col-lg-auto{-ms-flex:0 0 auto;flex:0 0 auto;width:auto;max-width:100%}.col-lg-1{-ms-flex:0 0 8.333333%;flex:0 0 8.333333%;max-width:8.333333%}.col-lg-2{-ms-flex:0 0 16.666667%;flex:0 0 16.666667%;max-width:16.666667%}.col-lg-3{-ms-flex:0 0 25%;flex:0 0 25%;max-width:25%}.col-lg-4{-ms-flex:0 0 33.333333%;flex:0 0 33.333333%;max-width:33.333333%}.col-lg-5{-ms-flex:0 0 41.666667%;flex:0 0 41.666667%;max-width:41.666667%}.col-lg-6{-ms-flex:0 0 50%;flex:0 0 50%;max-width:50%}.col-lg-7{-ms-flex:0 0 58.333333%;flex:0 0 58.333333%;max-width:58.333333%}.col-lg-8{-ms-flex:0 0 66.666667%;flex:0 0 66.666667%;max-width:66.666667%}.col-lg-9{-ms-flex:0 0 75%;flex:0 0 75%;max-width:75%}.col-lg-10{-ms-flex:0 0 83.333333%;flex:0 0 83.333333%;max-width:83.333333%}.col-lg-11{-ms-flex:0 0 91.666667%;flex:0 0 91.666667%;max-width:91.666667%}.col-lg-12{-ms-flex:0 0 100%;flex:0 0 100%;max-width:100%}.order-lg-first{-ms-flex-order:-1;order:-1}.order-lg-last{-ms-flex-order:13;order:13}.order-lg-0{-ms-flex-order:0;order:0}.order-lg-1{-ms-flex-order:1;order:1}.order-lg-2{-ms-flex-order:2;order:2}.order-lg-3{-ms-flex-order:3;order:3}.order-lg-4{-ms-flex-order:4;order:4}.order-lg-5{-ms-flex-order:5;order:5}.order-lg-6{-ms-flex-order:6;order:6}.order-lg-7{-ms-flex-order:7;order:7}.order-lg-8{-ms-flex-order:8;order:8}.order-lg-9{-ms-flex-order:9;order:9}.order-lg-10{-ms-flex-order:10;order:10}.order-lg-11{-ms-flex-order:11;order:11}.order-lg-12{-ms-flex-order:12;order:12}.offset-lg-0{margin-left:0}.offset-lg-1{margin-left:8.333333%}.offset-lg-2{margin-left:16.666667%}.offset-lg-3{margin-left:25%}.offset-lg-4{margin-left:33.333333%}.offset-lg-5{margin-left:41.666667%}.offset-lg-6{margin-left:50%}.offset-lg-7{margin-left:58.333333%}.offset-lg-8{margin-left:66.666667%}.offset-lg-9{margin-left:75%}.offset-lg-10{margin-left:83.333333%}.offset-lg-11{margin-left:91.666667%}}@media (min-width:1200px){.col-xl{-ms-flex-preferred-size:0;flex-basis:0;-ms-flex-positive:1;flex-grow:1;max-width:100%}.row-cols-xl-1>*{-ms-flex:0 0 100%;flex:0 0 100%;max-width:100%}.row-cols-xl-2>*{-ms-flex:0 0 50%;flex:0 0 50%;max-width:50%}.row-cols-xl-3>*{-ms-flex:0 0 33.333333%;flex:0 0 33.333333%;max-width:33.333333%}.row-cols-xl-4>*{-ms-flex:0 0 25%;flex:0 0 25%;max-width:25%}.row-cols-xl-5>*{-ms-flex:0 0 20%;flex:0 0 20%;max-width:20%}.row-cols-xl-6>*{-ms-flex:0 0 16.666667%;flex:0 0 16.666667%;max-width:16.666667%}.col-xl-auto{-ms-flex:0 0 auto;flex:0 0 auto;width:auto;max-width:100%}.col-xl-1{-ms-flex:0 0 8.333333%;flex:0 0 8.333333%;max-width:8.333333%}.col-xl-2{-ms-flex:0 0 16.666667%;flex:0 0 16.666667%;max-width:16.666667%}.col-xl-3{-ms-flex:0 0 25%;flex:0 0 25%;max-width:25%}.col-xl-4{-ms-flex:0 0 33.333333%;flex:0 0 33.333333%;max-width:33.333333%}.col-xl-5{-ms-flex:0 0 41.666667%;flex:0 0 41.666667%;max-width:41.666667%}.col-xl-6{-ms-flex:0 0 50%;flex:0 0 50%;max-width:50%}.col-xl-7{-ms-flex:0 0 58.333333%;flex:0 0 58.333333%;max-width:58.333333%}.col-xl-8{-ms-flex:0 0 66.666667%;flex:0 0 66.666667%;max-width:66.666667%}.col-xl-9{-ms-flex:0 0 75%;flex:0 0 75%;max-width:75%}.col-xl-10{-ms-flex:0 0 83.333333%;flex:0 0 83.333333%;max-width:83.333333%}.col-xl-11{-ms-flex:0 0 91.666667%;flex:0 0 91.666667%;max-width:91.666667%}.col-xl-12{-ms-flex:0 0 100%;flex:0 0 100%;max-width:100%}.order-xl-first{-ms-flex-order:-1;order:-1}.order-xl-last{-ms-flex-order:13;order:13}.order-xl-0{-ms-flex-order:0;order:0}.order-xl-1{-ms-flex-order:1;order:1}.order-xl-2{-ms-flex-order:2;order:2}.order-xl-3{-ms-flex-order:3;order:3}.order-xl-4{-ms-flex-order:4;order:4}.order-xl-5{-ms-flex-order:5;order:5}.order-xl-6{-ms-flex-order:6;order:6}.order-xl-7{-ms-flex-order:7;order:7}.order-xl-8{-ms-flex-order:8;order:8}.order-xl-9{-ms-flex-order:9;order:9}.order-xl-10{-ms-flex-order:10;order:10}.order-xl-11{-ms-flex-order:11;order:11}.order-xl-12{-ms-flex-order:12;order:12}.offset-xl-0{margin-left:0}.offset-xl-1{margin-left:8.333333%}.offset-xl-2{margin-left:16.666667%}.offset-xl-3{margin-left:25%}.offset-xl-4{margin-left:33.333333%}.offset-xl-5{margin-left:41.666667%}.offset-xl-6{margin-left:50%}.offset-xl-7{margin-left:58.333333%}.offset-xl-8{margin-left:66.666667%}.offset-xl-9{margin-left:75%}.offset-xl-10{margin-left:83.333333%}.offset-xl-11{margin-left:91.666667%}}.table{width:100%;margin-bottom:1rem;color:#212529}.table td,.table th{padding:.75rem;vertical-align:top;border-top:1px solid #dee2e6}.table thead th{vertical-align:bottom;border-bottom:2px solid #dee2e6}.table tbody+tbody{border-top:2px solid #dee2e6}.table-sm td,.table-sm th{padding:.3rem}.table-bordered{border:1px solid #dee2e6}.table-bordered td,.table-bordered th{border:1px solid #dee2e6}.table-bordered thead td,.table-bordered thead th{border-bottom-width:2px}.table-borderless tbody+tbody,.table-borderless td,.table-borderless th,.table-borderless thead th{border:0}.table-striped tbody tr:nth-of-type(odd){background-color:rgba(0,0,0,.05)}.table-hover tbody tr:hover{color:#212529;background-color:rgba(0,0,0,.075)}.table-primary,.table-primary>td,.table-primary>th{background-color:#b8daff}.table-primary tbody+tbody,.table-primary td,.table-primary th,.table-primary thead th{border-color:#7abaff}.table-hover .table-primary:hover{background-color:#9fcdff}.table-hover .table-primary:hover>td,.table-hover .table-primary:hover>th{background-color:#9fcdff}.table-secondary,.table-secondary>td,.table-secondary>th{background-color:#d6d8db}.table-secondary tbody+tbody,.table-secondary td,.table-secondary th,.table-secondary thead th{border-color:#b3b7bb}.table-hover .table-secondary:hover{background-color:#c8cbcf}.table-hover .table-secondary:hover>td,.table-hover .table-secondary:hover>th{background-color:#c8cbcf}.table-success,.table-success>td,.table-success>th{background-color:#c3e6cb}.table-success tbody+tbody,.table-success td,.table-success th,.table-success thead th{border-color:#8fd19e}.table-hover .table-success:hover{background-color:#b1dfbb}.table-hover .table-success:hover>td,.table-hover .table-success:hover>th{background-color:#b1dfbb}.table-info,.table-info>td,.table-info>th{background-color:#bee5eb}.table-info tbody+tbody,.table-info td,.table-info th,.table-info thead th{border-color:#86cfda}.table-hover .table-info:hover{background-color:#abdde5}.table-hover .table-info:hover>td,.table-hover .table-info:hover>th{background-color:#abdde5}.table-warning,.table-warning>td,.table-warning>th{background-color:#ffeeba}.table-warning tbody+tbody,.table-warning td,.table-warning th,.table-warning thead th{border-color:#ffdf7e}.table-hover .table-warning:hover{background-color:#ffe8a1}.table-hover .table-warning:hover>td,.table-hover .table-warning:hover>th{background-color:#ffe8a1}.table-danger,.table-danger>td,.table-danger>th{background-color:#f5c6cb}.table-danger tbody+tbody,.table-danger td,.table-danger th,.table-danger thead th{border-color:#ed969e}.table-hover .table-danger:hover{background-color:#f1b0b7}.table-hover .table-danger:hover>td,.table-hover .table-danger:hover>th{background-color:#f1b0b7}.table-light,.table-light>td,.table-light>th{background-color:#fdfdfe}.table-light tbody+tbody,.table-light td,.table-light th,.table-light thead th{border-color:#fbfcfc}.table-hover .table-light:hover{background-color:#ececf6}.table-hover .table-light:hover>td,.table-hover .table-light:hover>th{background-color:#ececf6}.table-dark,.table-dark>td,.table-dark>th{background-color:#c6c8ca}.table-dark tbody+tbody,.table-dark td,.table-dark th,.table-dark thead th{border-color:#95999c}.table-hover .table-dark:hover{background-color:#b9bbbe}.table-hover .table-dark:hover>td,.table-hover .table-dark:hover>th{background-color:#b9bbbe}.table-active,.table-active>td,.table-active>th{background-color:rgba(0,0,0,.075)}.table-hover .table-active:hover{background-color:rgba(0,0,0,.075)}.table-hover .table-active:hover>td,.table-hover .table-active:hover>th{background-color:rgba(0,0,0,.075)}.table .thead-dark th{color:#fff;background-color:#343a40;border-color:#454d55}.table .thead-light th{color:#495057;background-color:#e9ecef;border-color:#dee2e6}.table-dark{color:#fff;background-color:#343a40}.table-dark td,.table-dark th,.table-dark thead th{border-color:#454d55}.table-dark.table-bordered{border:0}.table-dark.table-striped tbody tr:nth-of-type(odd){background-color:rgba(255,255,255,.05)}.table-dark.table-hover tbody tr:hover{color:#fff;background-color:rgba(255,255,255,.075)}@media (max-width:575.98px){.table-responsive-sm{display:block;width:100%;overflow-x:auto;-webkit-overflow-scrolling:touch}.table-responsive-sm>.table-bordered{border:0}}@media (max-width:767.98px){.table-responsive-md{display:block;width:100%;overflow-x:auto;-webkit-overflow-scrolling:touch}.table-responsive-md>.table-bordered{border:0}}@media (max-width:991.98px){.table-responsive-lg{display:block;width:100%;overflow-x:auto;-webkit-overflow-scrolling:touch}.table-responsive-lg>.table-bordered{border:0}}@media (max-width:1199.98px){.table-responsive-xl{display:block;width:100%;overflow-x:auto;-webkit-overflow-scrolling:touch}.table-responsive-xl>.table-bordered{border:0}}.table-responsive{display:block;width:100%;overflow-x:auto;-webkit-overflow-scrolling:touch}.table-responsive>.table-bordered{border:0}.form-control{display:block;width:100%;height:calc(1.5em + .75rem + 2px);padding:.375rem .75rem;font-size:1rem;font-weight:400;line-height:1.5;color:#495057;background-color:#fff;background-clip:padding-box;border:1px solid #ced4da;border-radius:.25rem;transition:border-color .15s ease-in-out,box-shadow .15s ease-in-out}@media (prefers-reduced-motion:reduce){.form-control{transition:none}}.form-control::-ms-expand{background-color:transparent;border:0}.form-control:-moz-focusring{color:transparent;text-shadow:0 0 0 #495057}.form-control:focus{color:#495057;background-color:#fff;border-color:#80bdff;outline:0;box-shadow:0 0 0 .2rem rgba(0,123,255,.25)}.form-control::-webkit-input-placeholder{color:#6c757d;opacity:1}.form-control::-moz-placeholder{color:#6c757d;opacity:1}.form-control:-ms-input-placeholder{color:#6c757d;opacity:1}.form-control::-ms-input-placeholder{color:#6c757d;opacity:1}.form-control::placeholder{color:#6c757d;opacity:1}.form-control:disabled,.form-control[readonly]{background-color:#e9ecef;opacity:1}input[type=date].form-control,input[type=datetime-local].form-control,input[type=month].form-control,input[type=time].form-control{-webkit-appearance:none;-moz-appearance:none;appearance:none}select.form-control:focus::-ms-value{color:#495057;background-color:#fff}.form-control-file,.form-control-range{display:block;width:100%}.col-form-label{padding-top:calc(.375rem + 1px);padding-bottom:calc(.375rem + 1px);margin-bottom:0;font-size:inherit;line-height:1.5}.col-form-label-lg{padding-top:calc(.5rem + 1px);padding-bottom:calc(.5rem + 1px);font-size:1.25rem;line-height:1.5}.col-form-label-sm{padding-top:calc(.25rem + 1px);padding-bottom:calc(.25rem + 1px);font-size:.875rem;line-height:1.5}.form-control-plaintext{display:block;width:100%;padding:.375rem 0;margin-bottom:0;font-size:1rem;line-height:1.5;color:#212529;background-color:transparent;border:solid transparent;border-width:1px 0}.form-control-plaintext.form-control-lg,.form-control-plaintext.form-control-sm{padding-right:0;padding-left:0}.form-control-sm{height:calc(1.5em + .5rem + 2px);padding:.25rem .5rem;font-size:.875rem;line-height:1.5;border-radius:.2rem}.form-control-lg{height:calc(1.5em + 1rem + 2px);padding:.5rem 1rem;font-size:1.25rem;line-height:1.5;border-radius:.3rem}select.form-control[multiple],select.form-control[size]{height:auto}textarea.form-control{height:auto}.form-group{margin-bottom:1rem}.form-text{display:block;margin-top:.25rem}.form-row{display:-ms-flexbox;display:flex;-ms-flex-wrap:wrap;flex-wrap:wrap;margin-right:-5px;margin-left:-5px}.form-row>.col,.form-row>[class*=col-]{padding-right:5px;padding-left:5px}.form-check{position:relative;display:block;padding-left:1.25rem}.form-check-input{position:absolute;margin-top:.3rem;margin-left:-1.25rem}.form-check-input:disabled~.form-check-label,.form-check-input[disabled]~.form-check-label{color:#6c757d}.form-check-label{margin-bottom:0}.form-check-inline{display:-ms-inline-flexbox;display:inline-flex;-ms-flex-align:center;align-items:center;padding-left:0;margin-right:.75rem}.form-check-inline .form-check-input{position:static;margin-top:0;margin-right:.3125rem;margin-left:0}.valid-feedback{display:none;width:100%;margin-top:.25rem;font-size:80%;color:#28a745}.valid-tooltip{position:absolute;top:100%;left:0;z-index:5;display:none;max-width:100%;padding:.25rem .5rem;margin-top:.1rem;font-size:.875rem;line-height:1.5;color:#fff;background-color:rgba(40,167,69,.9);border-radius:.25rem}.form-row>.col>.valid-tooltip,.form-row>[class*=col-]>.valid-tooltip{left:5px}.is-valid~.valid-feedback,.is-valid~.valid-tooltip,.was-validated :valid~.valid-feedback,.was-validated :valid~.valid-tooltip{display:block}.form-control.is-valid,.was-validated .form-control:valid{border-color:#28a745;padding-right:calc(1.5em + .75rem);background-image:url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='8' height='8' viewBox='0 0 8 8'%3e%3cpath fill='%2328a745' d='M2.3 6.73L.6 4.53c-.4-1.04.46-1.4 1.1-.8l1.1 1.4 3.4-3.8c.6-.63 1.6-.27 1.2.7l-4 4.6c-.43.5-.8.4-1.1.1z'/%3e%3c/svg%3e");background-repeat:no-repeat;background-position:right calc(.375em + .1875rem) center;background-size:calc(.75em + .375rem) calc(.75em + .375rem)}.form-control.is-valid:focus,.was-validated .form-control:valid:focus{border-color:#28a745;box-shadow:0 0 0 .2rem rgba(40,167,69,.25)}.was-validated textarea.form-control:valid,textarea.form-control.is-valid{padding-right:calc(1.5em + .75rem);background-position:top calc(.375em + .1875rem) right calc(.375em + .1875rem)}.custom-select.is-valid,.was-validated .custom-select:valid{border-color:#28a745;padding-right:calc(.75em + 2.3125rem);background:url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='4' height='5' viewBox='0 0 4 5'%3e%3cpath fill='%23343a40' d='M2 0L0 2h4zm0 5L0 3h4z'/%3e%3c/svg%3e") right .75rem center/8px 10px no-repeat,#fff url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='8' height='8' viewBox='0 0 8 8'%3e%3cpath fill='%2328a745' d='M2.3 6.73L.6 4.53c-.4-1.04.46-1.4 1.1-.8l1.1 1.4 3.4-3.8c.6-.63 1.6-.27 1.2.7l-4 4.6c-.43.5-.8.4-1.1.1z'/%3e%3c/svg%3e") center right 1.75rem/calc(.75em + .375rem) calc(.75em + .375rem) no-repeat}.custom-select.is-valid:focus,.was-validated .custom-select:valid:focus{border-color:#28a745;box-shadow:0 0 0 .2rem rgba(40,167,69,.25)}.form-check-input.is-valid~.form-check-label,.was-validated .form-check-input:valid~.form-check-label{color:#28a745}.form-check-input.is-valid~.valid-feedback,.form-check-input.is-valid~.valid-tooltip,.was-validated .form-check-input:valid~.valid-feedback,.was-validated .form-check-input:valid~.valid-tooltip{display:block}.custom-control-input.is-valid~.custom-control-label,.was-validated .custom-control-input:valid~.custom-control-label{color:#28a745}.custom-control-input.is-valid~.custom-control-label::before,.was-validated .custom-control-input:valid~.custom-control-label::before{border-color:#28a745}.custom-control-input.is-valid:checked~.custom-control-label::before,.was-validated .custom-control-input:valid:checked~.custom-control-label::before{border-color:#34ce57;background-color:#34ce57}.custom-control-input.is-valid:focus~.custom-control-label::before,.was-validated .custom-control-input:valid:focus~.custom-control-label::before{box-shadow:0 0 0 .2rem rgba(40,167,69,.25)}.custom-control-input.is-valid:focus:not(:checked)~.custom-control-label::before,.was-validated .custom-control-input:valid:focus:not(:checked)~.custom-control-label::before{border-color:#28a745}.custom-file-input.is-valid~.custom-file-label,.was-validated .custom-file-input:valid~.custom-file-label{border-color:#28a745}.custom-file-input.is-valid:focus~.custom-file-label,.was-validated .custom-file-input:valid:focus~.custom-file-label{border-color:#28a745;box-shadow:0 0 0 .2rem rgba(40,167,69,.25)}.invalid-feedback{display:none;width:100%;margin-top:.25rem;font-size:80%;color:#dc3545}.invalid-tooltip{position:absolute;top:100%;left:0;z-index:5;display:none;max-width:100%;padding:.25rem .5rem;margin-top:.1rem;font-size:.875rem;line-height:1.5;color:#fff;background-color:rgba(220,53,69,.9);border-radius:.25rem}.form-row>.col>.invalid-tooltip,.form-row>[class*=col-]>.invalid-tooltip{left:5px}.is-invalid~.invalid-feedback,.is-invalid~.invalid-tooltip,.was-validated :invalid~.invalid-feedback,.was-validated :invalid~.invalid-tooltip{display:block}.form-control.is-invalid,.was-validated .form-control:invalid{border-color:#dc3545;padding-right:calc(1.5em + .75rem);background-image:url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='none' stroke='%23dc3545' viewBox='0 0 12 12'%3e%3ccircle cx='6' cy='6' r='4.5'/%3e%3cpath stroke-linejoin='round' d='M5.8 3.6h.4L6 6.5z'/%3e%3ccircle cx='6' cy='8.2' r='.6' fill='%23dc3545' stroke='none'/%3e%3c/svg%3e");background-repeat:no-repeat;background-position:right calc(.375em + .1875rem) center;background-size:calc(.75em + .375rem) calc(.75em + .375rem)}.form-control.is-invalid:focus,.was-validated .form-control:invalid:focus{border-color:#dc3545;box-shadow:0 0 0 .2rem rgba(220,53,69,.25)}.was-validated textarea.form-control:invalid,textarea.form-control.is-invalid{padding-right:calc(1.5em + .75rem);background-position:top calc(.375em + .1875rem) right calc(.375em + .1875rem)}.custom-select.is-invalid,.was-validated .custom-select:invalid{border-color:#dc3545;padding-right:calc(.75em + 2.3125rem);background:url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='4' height='5' viewBox='0 0 4 5'%3e%3cpath fill='%23343a40' d='M2 0L0 2h4zm0 5L0 3h4z'/%3e%3c/svg%3e") right .75rem center/8px 10px no-repeat,#fff url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='none' stroke='%23dc3545' viewBox='0 0 12 12'%3e%3ccircle cx='6' cy='6' r='4.5'/%3e%3cpath stroke-linejoin='round' d='M5.8 3.6h.4L6 6.5z'/%3e%3ccircle cx='6' cy='8.2' r='.6' fill='%23dc3545' stroke='none'/%3e%3c/svg%3e") center right 1.75rem/calc(.75em + .375rem) calc(.75em + .375rem) no-repeat}.custom-select.is-invalid:focus,.was-validated .custom-select:invalid:focus{border-color:#dc3545;box-shadow:0 0 0 .2rem rgba(220,53,69,.25)}.form-check-input.is-invalid~.form-check-label,.was-validated .form-check-input:invalid~.form-check-label{color:#dc3545}.form-check-input.is-invalid~.invalid-feedback,.form-check-input.is-invalid~.invalid-tooltip,.was-validated .form-check-input:invalid~.invalid-feedback,.was-validated .form-check-input:invalid~.invalid-tooltip{display:block}.custom-control-input.is-invalid~.custom-control-label,.was-validated .custom-control-input:invalid~.custom-control-label{color:#dc3545}.custom-control-input.is-invalid~.custom-control-label::before,.was-validated .custom-control-input:invalid~.custom-control-label::before{border-color:#dc3545}.custom-control-input.is-invalid:checked~.custom-control-label::before,.was-validated .custom-control-input:invalid:checked~.custom-control-label::before{border-color:#e4606d;background-color:#e4606d}.custom-control-input.is-invalid:focus~.custom-control-label::before,.was-validated .custom-control-input:invalid:focus~.custom-control-label::before{box-shadow:0 0 0 .2rem rgba(220,53,69,.25)}.custom-control-input.is-invalid:focus:not(:checked)~.custom-control-label::before,.was-validated .custom-control-input:invalid:focus:not(:checked)~.custom-control-label::before{border-color:#dc3545}.custom-file-input.is-invalid~.custom-file-label,.was-validated .custom-file-input:invalid~.custom-file-label{border-color:#dc3545}.custom-file-input.is-invalid:focus~.custom-file-label,.was-validated .custom-file-input:invalid:focus~.custom-file-label{border-color:#dc3545;box-shadow:0 0 0 .2rem rgba(220,53,69,.25)}.form-inline{display:-ms-flexbox;display:flex;-ms-flex-flow:row wrap;flex-flow:row wrap;-ms-flex-align:center;align-items:center}.form-inline .form-check{width:100%}@media (min-width:576px){.form-inline label{display:-ms-flexbox;display:flex;-ms-flex-align:center;align-items:center;-ms-flex-pack:center;justify-content:center;margin-bottom:0}.form-inline .form-group{display:-ms-flexbox;display:flex;-ms-flex:0 0 auto;flex:0 0 auto;-ms-flex-flow:row wrap;flex-flow:row wrap;-ms-flex-align:center;align-items:center;margin-bottom:0}.form-inline .form-control{display:inline-block;width:auto;vertical-align:middle}.form-inline .form-control-plaintext{display:inline-block}.form-inline .custom-select,.form-inline .input-group{width:auto}.form-inline .form-check{display:-ms-flexbox;display:flex;-ms-flex-align:center;align-items:center;-ms-flex-pack:center;justify-content:center;width:auto;padding-left:0}.form-inline .form-check-input{position:relative;-ms-flex-negative:0;flex-shrink:0;margin-top:0;margin-right:.25rem;margin-left:0}.form-inline .custom-control{-ms-flex-align:center;align-items:center;-ms-flex-pack:center;justify-content:center}.form-inline .custom-control-label{margin-bottom:0}}.btn{display:inline-block;font-weight:400;color:#212529;text-align:center;vertical-align:middle;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;background-color:transparent;border:1px solid transparent;padding:.375rem .75rem;font-size:1rem;line-height:1.5;border-radius:.25rem;transition:color .15s ease-in-out,background-color .15s ease-in-out,border-color .15s ease-in-out,box-shadow .15s ease-in-out}@media (prefers-reduced-motion:reduce){.btn{transition:none}}.btn:hover{color:#212529;text-decoration:none}.btn.focus,.btn:focus{outline:0;box-shadow:0 0 0 .2rem rgba(0,123,255,.25)}.btn.disabled,.btn:disabled{opacity:.65}.btn:not(:disabled):not(.disabled){cursor:pointer}a.btn.disabled,fieldset:disabled a.btn{pointer-events:none}.btn-primary{color:#fff;background-color:#007bff;border-color:#007bff}.btn-primary:hover{color:#fff;background-color:#0069d9;border-color:#0062cc}.btn-primary.focus,.btn-primary:focus{color:#fff;background-color:#0069d9;border-color:#0062cc;box-shadow:0 0 0 .2rem rgba(38,143,255,.5)}.btn-primary.disabled,.btn-primary:disabled{color:#fff;background-color:#007bff;border-color:#007bff}.btn-primary:not(:disabled):not(.disabled).active,.btn-primary:not(:disabled):not(.disabled):active,.show>.btn-primary.dropdown-toggle{color:#fff;background-color:#0062cc;border-color:#005cbf}.btn-primary:not(:disabled):not(.disabled).active:focus,.btn-primary:not(:disabled):not(.disabled):active:focus,.show>.btn-primary.dropdown-toggle:focus{box-shadow:0 0 0 .2rem rgba(38,143,255,.5)}.btn-secondary{color:#fff;background-color:#6c757d;border-color:#6c757d}.btn-secondary:hover{color:#fff;background-color:#5a6268;border-color:#545b62}.btn-secondary.focus,.btn-secondary:focus{color:#fff;background-color:#5a6268;border-color:#545b62;box-shadow:0 0 0 .2rem rgba(130,138,145,.5)}.btn-secondary.disabled,.btn-secondary:disabled{color:#fff;background-color:#6c757d;border-color:#6c757d}.btn-secondary:not(:disabled):not(.disabled).active,.btn-secondary:not(:disabled):not(.disabled):active,.show>.btn-secondary.dropdown-toggle{color:#fff;background-color:#545b62;border-color:#4e555b}.btn-secondary:not(:disabled):not(.disabled).active:focus,.btn-secondary:not(:disabled):not(.disabled):active:focus,.show>.btn-secondary.dropdown-toggle:focus{box-shadow:0 0 0 .2rem rgba(130,138,145,.5)}.btn-success{color:#fff;background-color:#28a745;border-color:#28a745}.btn-success:hover{color:#fff;background-color:#218838;border-color:#1e7e34}.btn-success.focus,.btn-success:focus{color:#fff;background-color:#218838;border-color:#1e7e34;box-shadow:0 0 0 .2rem rgba(72,180,97,.5)}.btn-success.disabled,.btn-success:disabled{color:#fff;background-color:#28a745;border-color:#28a745}.btn-success:not(:disabled):not(.disabled).active,.btn-success:not(:disabled):not(.disabled):active,.show>.btn-success.dropdown-toggle{color:#fff;background-color:#1e7e34;border-color:#1c7430}.btn-success:not(:disabled):not(.disabled).active:focus,.btn-success:not(:disabled):not(.disabled):active:focus,.show>.btn-success.dropdown-toggle:focus{box-shadow:0 0 0 .2rem rgba(72,180,97,.5)}.btn-info{color:#fff;background-color:#17a2b8;border-color:#17a2b8}.btn-info:hover{color:#fff;background-color:#138496;border-color:#117a8b}.btn-info.focus,.btn-info:focus{color:#fff;background-color:#138496;border-color:#117a8b;box-shadow:0 0 0 .2rem rgba(58,176,195,.5)}.btn-info.disabled,.btn-info:disabled{color:#fff;background-color:#17a2b8;border-color:#17a2b8}.btn-info:not(:disabled):not(.disabled).active,.btn-info:not(:disabled):not(.disabled):active,.show>.btn-info.dropdown-toggle{color:#fff;background-color:#117a8b;border-color:#10707f}.btn-info:not(:disabled):not(.disabled).active:focus,.btn-info:not(:disabled):not(.disabled):active:focus,.show>.btn-info.dropdown-toggle:focus{box-shadow:0 0 0 .2rem rgba(58,176,195,.5)}.btn-warning{color:#212529;background-color:#ffc107;border-color:#ffc107}.btn-warning:hover{color:#212529;background-color:#e0a800;border-color:#d39e00}.btn-warning.focus,.btn-warning:focus{color:#212529;background-color:#e0a800;border-color:#d39e00;box-shadow:0 0 0 .2rem rgba(222,170,12,.5)}.btn-warning.disabled,.btn-warning:disabled{color:#212529;background-color:#ffc107;border-color:#ffc107}.btn-warning:not(:disabled):not(.disabled).active,.btn-warning:not(:disabled):not(.disabled):active,.show>.btn-warning.dropdown-toggle{color:#212529;background-color:#d39e00;border-color:#c69500}.btn-warning:not(:disabled):not(.disabled).active:focus,.btn-warning:not(:disabled):not(.disabled):active:focus,.show>.btn-warning.dropdown-toggle:focus{box-shadow:0 0 0 .2rem rgba(222,170,12,.5)}.btn-danger{color:#fff;background-color:#dc3545;border-color:#dc3545}.btn-danger:hover{color:#fff;background-color:#c82333;border-color:#bd2130}.btn-danger.focus,.btn-danger:focus{color:#fff;background-color:#c82333;border-color:#bd2130;box-shadow:0 0 0 .2rem rgba(225,83,97,.5)}.btn-danger.disabled,.btn-danger:disabled{color:#fff;background-color:#dc3545;border-color:#dc3545}.btn-danger:not(:disabled):not(.disabled).active,.btn-danger:not(:disabled):not(.disabled):active,.show>.btn-danger.dropdown-toggle{color:#fff;background-color:#bd2130;border-color:#b21f2d}.btn-danger:not(:disabled):not(.disabled).active:focus,.btn-danger:not(:disabled):not(.disabled):active:focus,.show>.btn-danger.dropdown-toggle:focus{box-shadow:0 0 0 .2rem rgba(225,83,97,.5)}.btn-light{color:#212529;background-color:#f8f9fa;border-color:#f8f9fa}.btn-light:hover{color:#212529;background-color:#e2e6ea;border-color:#dae0e5}.btn-light.focus,.btn-light:focus{color:#212529;background-color:#e2e6ea;border-color:#dae0e5;box-shadow:0 0 0 .2rem rgba(216,217,219,.5)}.btn-light.disabled,.btn-light:disabled{color:#212529;background-color:#f8f9fa;border-color:#f8f9fa}.btn-light:not(:disabled):not(.disabled).active,.btn-light:not(:disabled):not(.disabled):active,.show>.btn-light.dropdown-toggle{color:#212529;background-color:#dae0e5;border-color:#d3d9df}.btn-light:not(:disabled):not(.disabled).active:focus,.btn-light:not(:disabled):not(.disabled):active:focus,.show>.btn-light.dropdown-toggle:focus{box-shadow:0 0 0 .2rem rgba(216,217,219,.5)}.btn-dark{color:#fff;background-color:#343a40;border-color:#343a40}.btn-dark:hover{color:#fff;background-color:#23272b;border-color:#1d2124}.btn-dark.focus,.btn-dark:focus{color:#fff;background-color:#23272b;border-color:#1d2124;box-shadow:0 0 0 .2rem rgba(82,88,93,.5)}.btn-dark.disabled,.btn-dark:disabled{color:#fff;background-color:#343a40;border-color:#343a40}.btn-dark:not(:disabled):not(.disabled).active,.btn-dark:not(:disabled):not(.disabled):active,.show>.btn-dark.dropdown-toggle{color:#fff;background-color:#1d2124;border-color:#171a1d}.btn-dark:not(:disabled):not(.disabled).active:focus,.btn-dark:not(:disabled):not(.disabled):active:focus,.show>.btn-dark.dropdown-toggle:focus{box-shadow:0 0 0 .2rem rgba(82,88,93,.5)}.btn-outline-primary{color:#007bff;border-color:#007bff}.btn-outline-primary:hover{color:#fff;background-color:#007bff;border-color:#007bff}.btn-outline-primary.focus,.btn-outline-primary:focus{box-shadow:0 0 0 .2rem rgba(0,123,255,.5)}.btn-outline-primary.disabled,.btn-outline-primary:disabled{color:#007bff;background-color:transparent}.btn-outline-primary:not(:disabled):not(.disabled).active,.btn-outline-primary:not(:disabled):not(.disabled):active,.show>.btn-outline-primary.dropdown-toggle{color:#fff;background-color:#007bff;border-color:#007bff}.btn-outline-primary:not(:disabled):not(.disabled).active:focus,.btn-outline-primary:not(:disabled):not(.disabled):active:focus,.show>.btn-outline-primary.dropdown-toggle:focus{box-shadow:0 0 0 .2rem rgba(0,123,255,.5)}.btn-outline-secondary{color:#6c757d;border-color:#6c757d}.btn-outline-secondary:hover{color:#fff;background-color:#6c757d;border-color:#6c757d}.btn-outline-secondary.focus,.btn-outline-secondary:focus{box-shadow:0 0 0 .2rem rgba(108,117,125,.5)}.btn-outline-secondary.disabled,.btn-outline-secondary:disabled{color:#6c757d;background-color:transparent}.btn-outline-secondary:not(:disabled):not(.disabled).active,.btn-outline-secondary:not(:disabled):not(.disabled):active,.show>.btn-outline-secondary.dropdown-toggle{color:#fff;background-color:#6c757d;border-color:#6c757d}.btn-outline-secondary:not(:disabled):not(.disabled).active:focus,.btn-outline-secondary:not(:disabled):not(.disabled):active:focus,.show>.btn-outline-secondary.dropdown-toggle:focus{box-shadow:0 0 0 .2rem rgba(108,117,125,.5)}.btn-outline-success{color:#28a745;border-color:#28a745}.btn-outline-success:hover{color:#fff;background-color:#28a745;border-color:#28a745}.btn-outline-success.focus,.btn-outline-success:focus{box-shadow:0 0 0 .2rem rgba(40,167,69,.5)}.btn-outline-success.disabled,.btn-outline-success:disabled{color:#28a745;background-color:transparent}.btn-outline-success:not(:disabled):not(.disabled).active,.btn-outline-success:not(:disabled):not(.disabled):active,.show>.btn-outline-success.dropdown-toggle{color:#fff;background-color:#28a745;border-color:#28a745}.btn-outline-success:not(:disabled):not(.disabled).active:focus,.btn-outline-success:not(:disabled):not(.disabled):active:focus,.show>.btn-outline-success.dropdown-toggle:focus{box-shadow:0 0 0 .2rem rgba(40,167,69,.5)}.btn-outline-info{color:#17a2b8;border-color:#17a2b8}.btn-outline-info:hover{color:#fff;background-color:#17a2b8;border-color:#17a2b8}.btn-outline-info.focus,.btn-outline-info:focus{box-shadow:0 0 0 .2rem rgba(23,162,184,.5)}.btn-outline-info.disabled,.btn-outline-info:disabled{color:#17a2b8;background-color:transparent}.btn-outline-info:not(:disabled):not(.disabled).active,.btn-outline-info:not(:disabled):not(.disabled):active,.show>.btn-outline-info.dropdown-toggle{color:#fff;background-color:#17a2b8;border-color:#17a2b8}.btn-outline-info:not(:disabled):not(.disabled).active:focus,.btn-outline-info:not(:disabled):not(.disabled):active:focus,.show>.btn-outline-info.dropdown-toggle:focus{box-shadow:0 0 0 .2rem rgba(23,162,184,.5)}.btn-outline-warning{color:#ffc107;border-color:#ffc107}.btn-outline-warning:hover{color:#212529;background-color:#ffc107;border-color:#ffc107}.btn-outline-warning.focus,.btn-outline-warning:focus{box-shadow:0 0 0 .2rem rgba(255,193,7,.5)}.btn-outline-warning.disabled,.btn-outline-warning:disabled{color:#ffc107;background-color:transparent}.btn-outline-warning:not(:disabled):not(.disabled).active,.btn-outline-warning:not(:disabled):not(.disabled):active,.show>.btn-outline-warning.dropdown-toggle{color:#212529;background-color:#ffc107;border-color:#ffc107}.btn-outline-warning:not(:disabled):not(.disabled).active:focus,.btn-outline-warning:not(:disabled):not(.disabled):active:focus,.show>.btn-outline-warning.dropdown-toggle:focus{box-shadow:0 0 0 .2rem rgba(255,193,7,.5)}.btn-outline-danger{color:#dc3545;border-color:#dc3545}.btn-outline-danger:hover{color:#fff;background-color:#dc3545;border-color:#dc3545}.btn-outline-danger.focus,.btn-outline-danger:focus{box-shadow:0 0 0 .2rem rgba(220,53,69,.5)}.btn-outline-danger.disabled,.btn-outline-danger:disabled{color:#dc3545;background-color:transparent}.btn-outline-danger:not(:disabled):not(.disabled).active,.btn-outline-danger:not(:disabled):not(.disabled):active,.show>.btn-outline-danger.dropdown-toggle{color:#fff;background-color:#dc3545;border-color:#dc3545}.btn-outline-danger:not(:disabled):not(.disabled).active:focus,.btn-outline-danger:not(:disabled):not(.disabled):active:focus,.show>.btn-outline-danger.dropdown-toggle:focus{box-shadow:0 0 0 .2rem rgba(220,53,69,.5)}.btn-outline-light{color:#f8f9fa;border-color:#f8f9fa}.btn-outline-light:hover{color:#212529;background-color:#f8f9fa;border-color:#f8f9fa}.btn-outline-light.focus,.btn-outline-light:focus{box-shadow:0 0 0 .2rem rgba(248,249,250,.5)}.btn-outline-light.disabled,.btn-outline-light:disabled{color:#f8f9fa;background-color:transparent}.btn-outline-light:not(:disabled):not(.disabled).active,.btn-outline-light:not(:disabled):not(.disabled):active,.show>.btn-outline-light.dropdown-toggle{color:#212529;background-color:#f8f9fa;border-color:#f8f9fa}.btn-outline-light:not(:disabled):not(.disabled).active:focus,.btn-outline-light:not(:disabled):not(.disabled):active:focus,.show>.btn-outline-light.dropdown-toggle:focus{box-shadow:0 0 0 .2rem rgba(248,249,250,.5)}.btn-outline-dark{color:#343a40;border-color:#343a40}.btn-outline-dark:hover{color:#fff;background-color:#343a40;border-color:#343a40}.btn-outline-dark.focus,.btn-outline-dark:focus{box-shadow:0 0 0 .2rem rgba(52,58,64,.5)}.btn-outline-dark.disabled,.btn-outline-dark:disabled{color:#343a40;background-color:transparent}.btn-outline-dark:not(:disabled):not(.disabled).active,.btn-outline-dark:not(:disabled):not(.disabled):active,.show>.btn-outline-dark.dropdown-toggle{color:#fff;background-color:#343a40;border-color:#343a40}.btn-outline-dark:not(:disabled):not(.disabled).active:focus,.btn-outline-dark:not(:disabled):not(.disabled):active:focus,.show>.btn-outline-dark.dropdown-toggle:focus{box-shadow:0 0 0 .2rem rgba(52,58,64,.5)}.btn-link{font-weight:400;color:#007bff;text-decoration:none}.btn-link:hover{color:#0056b3;text-decoration:underline}.btn-link.focus,.btn-link:focus{text-decoration:underline}.btn-link.disabled,.btn-link:disabled{color:#6c757d;pointer-events:none}.btn-group-lg>.btn,.btn-lg{padding:.5rem 1rem;font-size:1.25rem;line-height:1.5;border-radius:.3rem}.btn-group-sm>.btn,.btn-sm{padding:.25rem .5rem;font-size:.875rem;line-height:1.5;border-radius:.2rem}.btn-block{display:block;width:100%}.btn-block+.btn-block{margin-top:.5rem}input[type=button].btn-block,input[type=reset].btn-block,input[type=submit].btn-block{width:100%}.fade{transition:opacity .15s linear}@media (prefers-reduced-motion:reduce){.fade{transition:none}}.fade:not(.show){opacity:0}.collapse:not(.show){display:none}.collapsing{position:relative;height:0;overflow:hidden;transition:height .35s ease}@media (prefers-reduced-motion:reduce){.collapsing{transition:none}}.dropdown,.dropleft,.dropright,.dropup{position:relative}.dropdown-toggle{white-space:nowrap}.dropdown-toggle::after{display:inline-block;margin-left:.255em;vertical-align:.255em;content:"";border-top:.3em solid;border-right:.3em solid transparent;border-bottom:0;border-left:.3em solid transparent}.dropdown-toggle:empty::after{margin-left:0}.dropdown-menu{position:absolute;top:100%;left:0;z-index:1000;display:none;float:left;min-width:10rem;padding:.5rem 0;margin:.125rem 0 0;font-size:1rem;color:#212529;text-align:left;list-style:none;background-color:#fff;background-clip:padding-box;border:1px solid rgba(0,0,0,.15);border-radius:.25rem}.dropdown-menu-left{right:auto;left:0}.dropdown-menu-right{right:0;left:auto}@media (min-width:576px){.dropdown-menu-sm-left{right:auto;left:0}.dropdown-menu-sm-right{right:0;left:auto}}@media (min-width:768px){.dropdown-menu-md-left{right:auto;left:0}.dropdown-menu-md-right{right:0;left:auto}}@media (min-width:992px){.dropdown-menu-lg-left{right:auto;left:0}.dropdown-menu-lg-right{right:0;left:auto}}@media (min-width:1200px){.dropdown-menu-xl-left{right:auto;left:0}.dropdown-menu-xl-right{right:0;left:auto}}.dropup .dropdown-menu{top:auto;bottom:100%;margin-top:0;margin-bottom:.125rem}.dropup .dropdown-toggle::after{display:inline-block;margin-left:.255em;vertical-align:.255em;content:"";border-top:0;border-right:.3em solid transparent;border-bottom:.3em solid;border-left:.3em solid transparent}.dropup .dropdown-toggle:empty::after{margin-left:0}.dropright .dropdown-menu{top:0;right:auto;left:100%;margin-top:0;margin-left:.125rem}.dropright .dropdown-toggle::after{display:inline-block;margin-left:.255em;vertical-align:.255em;content:"";border-top:.3em solid transparent;border-right:0;border-bottom:.3em solid transparent;border-left:.3em solid}.dropright .dropdown-toggle:empty::after{margin-left:0}.dropright .dropdown-toggle::after{vertical-align:0}.dropleft .dropdown-menu{top:0;right:100%;left:auto;margin-top:0;margin-right:.125rem}.dropleft .dropdown-toggle::after{display:inline-block;margin-left:.255em;vertical-align:.255em;content:""}.dropleft .dropdown-toggle::after{display:none}.dropleft .dropdown-toggle::before{display:inline-block;margin-right:.255em;vertical-align:.255em;content:"";border-top:.3em solid transparent;border-right:.3em solid;border-bottom:.3em solid transparent}.dropleft .dropdown-toggle:empty::after{margin-left:0}.dropleft .dropdown-toggle::before{vertical-align:0}.dropdown-menu[x-placement^=bottom],.dropdown-menu[x-placement^=left],.dropdown-menu[x-placement^=right],.dropdown-menu[x-placement^=top]{right:auto;bottom:auto}.dropdown-divider{height:0;margin:.5rem 0;overflow:hidden;border-top:1px solid #e9ecef}.dropdown-item{display:block;width:100%;padding:.25rem 1.5rem;clear:both;font-weight:400;color:#212529;text-align:inherit;white-space:nowrap;background-color:transparent;border:0}.dropdown-item:focus,.dropdown-item:hover{color:#16181b;text-decoration:none;background-color:#e9ecef}.dropdown-item.active,.dropdown-item:active{color:#fff;text-decoration:none;background-color:#007bff}.dropdown-item.disabled,.dropdown-item:disabled{color:#adb5bd;pointer-events:none;background-color:transparent}.dropdown-menu.show{display:block}.dropdown-header{display:block;padding:.5rem 1.5rem;margin-bottom:0;font-size:.875rem;color:#6c757d;white-space:nowrap}.dropdown-item-text{display:block;padding:.25rem 1.5rem;color:#212529}.btn-group,.btn-group-vertical{position:relative;display:-ms-inline-flexbox;display:inline-flex;vertical-align:middle}.btn-group-vertical>.btn,.btn-group>.btn{position:relative;-ms-flex:1 1 auto;flex:1 1 auto}.btn-group-vertical>.btn:hover,.btn-group>.btn:hover{z-index:1}.btn-group-vertical>.btn.active,.btn-group-vertical>.btn:active,.btn-group-vertical>.btn:focus,.btn-group>.btn.active,.btn-group>.btn:active,.btn-group>.btn:focus{z-index:1}.btn-toolbar{display:-ms-flexbox;display:flex;-ms-flex-wrap:wrap;flex-wrap:wrap;-ms-flex-pack:start;justify-content:flex-start}.btn-toolbar .input-group{width:auto}.btn-group>.btn-group:not(:first-child),.btn-group>.btn:not(:first-child){margin-left:-1px}.btn-group>.btn-group:not(:last-child)>.btn,.btn-group>.btn:not(:last-child):not(.dropdown-toggle){border-top-right-radius:0;border-bottom-right-radius:0}.btn-group>.btn-group:not(:first-child)>.btn,.btn-group>.btn:not(:first-child){border-top-left-radius:0;border-bottom-left-radius:0}.dropdown-toggle-split{padding-right:.5625rem;padding-left:.5625rem}.dropdown-toggle-split::after,.dropright .dropdown-toggle-split::after,.dropup .dropdown-toggle-split::after{margin-left:0}.dropleft .dropdown-toggle-split::before{margin-right:0}.btn-group-sm>.btn+.dropdown-toggle-split,.btn-sm+.dropdown-toggle-split{padding-right:.375rem;padding-left:.375rem}.btn-group-lg>.btn+.dropdown-toggle-split,.btn-lg+.dropdown-toggle-split{padding-right:.75rem;padding-left:.75rem}.btn-group-vertical{-ms-flex-direction:column;flex-direction:column;-ms-flex-align:start;align-items:flex-start;-ms-flex-pack:center;justify-content:center}.btn-group-vertical>.btn,.btn-group-vertical>.btn-group{width:100%}.btn-group-vertical>.btn-group:not(:first-child),.btn-group-vertical>.btn:not(:first-child){margin-top:-1px}.btn-group-vertical>.btn-group:not(:last-child)>.btn,.btn-group-vertical>.btn:not(:last-child):not(.dropdown-toggle){border-bottom-right-radius:0;border-bottom-left-radius:0}.btn-group-vertical>.btn-group:not(:first-child)>.btn,.btn-group-vertical>.btn:not(:first-child){border-top-left-radius:0;border-top-right-radius:0}.btn-group-toggle>.btn,.btn-group-toggle>.btn-group>.btn{margin-bottom:0}.btn-group-toggle>.btn input[type=checkbox],.btn-group-toggle>.btn input[type=radio],.btn-group-toggle>.btn-group>.btn input[type=checkbox],.btn-group-toggle>.btn-group>.btn input[type=radio]{position:absolute;clip:rect(0,0,0,0);pointer-events:none}.input-group{position:relative;display:-ms-flexbox;display:flex;-ms-flex-wrap:wrap;flex-wrap:wrap;-ms-flex-align:stretch;align-items:stretch;width:100%}.input-group>.custom-file,.input-group>.custom-select,.input-group>.form-control,.input-group>.form-control-plaintext{position:relative;-ms-flex:1 1 auto;flex:1 1 auto;width:1%;min-width:0;margin-bottom:0}.input-group>.custom-file+.custom-file,.input-group>.custom-file+.custom-select,.input-group>.custom-file+.form-control,.input-group>.custom-select+.custom-file,.input-group>.custom-select+.custom-select,.input-group>.custom-select+.form-control,.input-group>.form-control+.custom-file,.input-group>.form-control+.custom-select,.input-group>.form-control+.form-control,.input-group>.form-control-plaintext+.custom-file,.input-group>.form-control-plaintext+.custom-select,.input-group>.form-control-plaintext+.form-control{margin-left:-1px}.input-group>.custom-file .custom-file-input:focus~.custom-file-label,.input-group>.custom-select:focus,.input-group>.form-control:focus{z-index:3}.input-group>.custom-file .custom-file-input:focus{z-index:4}.input-group>.custom-select:not(:first-child),.input-group>.form-control:not(:first-child){border-top-left-radius:0;border-bottom-left-radius:0}.input-group>.custom-file{display:-ms-flexbox;display:flex;-ms-flex-align:center;align-items:center}.input-group>.custom-file:not(:first-child) .custom-file-label,.input-group>.custom-file:not(:last-child) .custom-file-label{border-top-left-radius:0;border-bottom-left-radius:0}.input-group:not(.has-validation)>.custom-file:not(:last-child) .custom-file-label::after,.input-group:not(.has-validation)>.custom-select:not(:last-child),.input-group:not(.has-validation)>.form-control:not(:last-child){border-top-right-radius:0;border-bottom-right-radius:0}.input-group.has-validation>.custom-file:nth-last-child(n+3) .custom-file-label::after,.input-group.has-validation>.custom-select:nth-last-child(n+3),.input-group.has-validation>.form-control:nth-last-child(n+3){border-top-right-radius:0;border-bottom-right-radius:0}.input-group-append,.input-group-prepend{display:-ms-flexbox;display:flex}.input-group-append .btn,.input-group-prepend .btn{position:relative;z-index:2}.input-group-append .btn:focus,.input-group-prepend .btn:focus{z-index:3}.input-group-append .btn+.btn,.input-group-append .btn+.input-group-text,.input-group-append .input-group-text+.btn,.input-group-append .input-group-text+.input-group-text,.input-group-prepend .btn+.btn,.input-group-prepend .btn+.input-group-text,.input-group-prepend .input-group-text+.btn,.input-group-prepend .input-group-text+.input-group-text{margin-left:-1px}.input-group-prepend{margin-right:-1px}.input-group-append{margin-left:-1px}.input-group-text{display:-ms-flexbox;display:flex;-ms-flex-align:center;align-items:center;padding:.375rem .75rem;margin-bottom:0;font-size:1rem;font-weight:400;line-height:1.5;color:#495057;text-align:center;white-space:nowrap;background-color:#e9ecef;border:1px solid #ced4da;border-radius:.25rem}.input-group-text input[type=checkbox],.input-group-text input[type=radio]{margin-top:0}.input-group-lg>.custom-select,.input-group-lg>.form-control:not(textarea){height:calc(1.5em + 1rem + 2px)}.input-group-lg>.custom-select,.input-group-lg>.form-control,.input-group-lg>.input-group-append>.btn,.input-group-lg>.input-group-append>.input-group-text,.input-group-lg>.input-group-prepend>.btn,.input-group-lg>.input-group-prepend>.input-group-text{padding:.5rem 1rem;font-size:1.25rem;line-height:1.5;border-radius:.3rem}.input-group-sm>.custom-select,.input-group-sm>.form-control:not(textarea){height:calc(1.5em + .5rem + 2px)}.input-group-sm>.custom-select,.input-group-sm>.form-control,.input-group-sm>.input-group-append>.btn,.input-group-sm>.input-group-append>.input-group-text,.input-group-sm>.input-group-prepend>.btn,.input-group-sm>.input-group-prepend>.input-group-text{padding:.25rem .5rem;font-size:.875rem;line-height:1.5;border-radius:.2rem}.input-group-lg>.custom-select,.input-group-sm>.custom-select{padding-right:1.75rem}.input-group.has-validation>.input-group-append:nth-last-child(n+3)>.btn,.input-group.has-validation>.input-group-append:nth-last-child(n+3)>.input-group-text,.input-group:not(.has-validation)>.input-group-append:not(:last-child)>.btn,.input-group:not(.has-validation)>.input-group-append:not(:last-child)>.input-group-text,.input-group>.input-group-append:last-child>.btn:not(:last-child):not(.dropdown-toggle),.input-group>.input-group-append:last-child>.input-group-text:not(:last-child),.input-group>.input-group-prepend>.btn,.input-group>.input-group-prepend>.input-group-text{border-top-right-radius:0;border-bottom-right-radius:0}.input-group>.input-group-append>.btn,.input-group>.input-group-append>.input-group-text,.input-group>.input-group-prepend:first-child>.btn:not(:first-child),.input-group>.input-group-prepend:first-child>.input-group-text:not(:first-child),.input-group>.input-group-prepend:not(:first-child)>.btn,.input-group>.input-group-prepend:not(:first-child)>.input-group-text{border-top-left-radius:0;border-bottom-left-radius:0}.custom-control{position:relative;z-index:1;display:block;min-height:1.5rem;padding-left:1.5rem;-webkit-print-color-adjust:exact;color-adjust:exact}.custom-control-inline{display:-ms-inline-flexbox;display:inline-flex;margin-right:1rem}.custom-control-input{position:absolute;left:0;z-index:-1;width:1rem;height:1.25rem;opacity:0}.custom-control-input:checked~.custom-control-label::before{color:#fff;border-color:#007bff;background-color:#007bff}.custom-control-input:focus~.custom-control-label::before{box-shadow:0 0 0 .2rem rgba(0,123,255,.25)}.custom-control-input:focus:not(:checked)~.custom-control-label::before{border-color:#80bdff}.custom-control-input:not(:disabled):active~.custom-control-label::before{color:#fff;background-color:#b3d7ff;border-color:#b3d7ff}.custom-control-input:disabled~.custom-control-label,.custom-control-input[disabled]~.custom-control-label{color:#6c757d}.custom-control-input:disabled~.custom-control-label::before,.custom-control-input[disabled]~.custom-control-label::before{background-color:#e9ecef}.custom-control-label{position:relative;margin-bottom:0;vertical-align:top}.custom-control-label::before{position:absolute;top:.25rem;left:-1.5rem;display:block;width:1rem;height:1rem;pointer-events:none;content:"";background-color:#fff;border:#adb5bd solid 1px}.custom-control-label::after{position:absolute;top:.25rem;left:-1.5rem;display:block;width:1rem;height:1rem;content:"";background:50%/50% 50% no-repeat}.custom-checkbox .custom-control-label::before{border-radius:.25rem}.custom-checkbox .custom-control-input:checked~.custom-control-label::after{background-image:url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='8' height='8' viewBox='0 0 8 8'%3e%3cpath fill='%23fff' d='M6.564.75l-3.59 3.612-1.538-1.55L0 4.26l2.974 2.99L8 2.193z'/%3e%3c/svg%3e")}.custom-checkbox .custom-control-input:indeterminate~.custom-control-label::before{border-color:#007bff;background-color:#007bff}.custom-checkbox .custom-control-input:indeterminate~.custom-control-label::after{background-image:url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='4' height='4' viewBox='0 0 4 4'%3e%3cpath stroke='%23fff' d='M0 2h4'/%3e%3c/svg%3e")}.custom-checkbox .custom-control-input:disabled:checked~.custom-control-label::before{background-color:rgba(0,123,255,.5)}.custom-checkbox .custom-control-input:disabled:indeterminate~.custom-control-label::before{background-color:rgba(0,123,255,.5)}.custom-radio .custom-control-label::before{border-radius:50%}.custom-radio .custom-control-input:checked~.custom-control-label::after{background-image:url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='-4 -4 8 8'%3e%3ccircle r='3' fill='%23fff'/%3e%3c/svg%3e")}.custom-radio .custom-control-input:disabled:checked~.custom-control-label::before{background-color:rgba(0,123,255,.5)}.custom-switch{padding-left:2.25rem}.custom-switch .custom-control-label::before{left:-2.25rem;width:1.75rem;pointer-events:all;border-radius:.5rem}.custom-switch .custom-control-label::after{top:calc(.25rem + 2px);left:calc(-2.25rem + 2px);width:calc(1rem - 4px);height:calc(1rem - 4px);background-color:#adb5bd;border-radius:.5rem;transition:background-color .15s ease-in-out,border-color .15s ease-in-out,box-shadow .15s ease-in-out,-webkit-transform .15s ease-in-out;transition:transform .15s ease-in-out,background-color .15s ease-in-out,border-color .15s ease-in-out,box-shadow .15s ease-in-out;transition:transform .15s ease-in-out,background-color .15s ease-in-out,border-color .15s ease-in-out,box-shadow .15s ease-in-out,-webkit-transform .15s ease-in-out}@media (prefers-reduced-motion:reduce){.custom-switch .custom-control-label::after{transition:none}}.custom-switch .custom-control-input:checked~.custom-control-label::after{background-color:#fff;-webkit-transform:translateX(.75rem);transform:translateX(.75rem)}.custom-switch .custom-control-input:disabled:checked~.custom-control-label::before{background-color:rgba(0,123,255,.5)}.custom-select{display:inline-block;width:100%;height:calc(1.5em + .75rem + 2px);padding:.375rem 1.75rem .375rem .75rem;font-size:1rem;font-weight:400;line-height:1.5;color:#495057;vertical-align:middle;background:#fff url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='4' height='5' viewBox='0 0 4 5'%3e%3cpath fill='%23343a40' d='M2 0L0 2h4zm0 5L0 3h4z'/%3e%3c/svg%3e") right .75rem center/8px 10px no-repeat;border:1px solid #ced4da;border-radius:.25rem;-webkit-appearance:none;-moz-appearance:none;appearance:none}.custom-select:focus{border-color:#80bdff;outline:0;box-shadow:0 0 0 .2rem rgba(0,123,255,.25)}.custom-select:focus::-ms-value{color:#495057;background-color:#fff}.custom-select[multiple],.custom-select[size]:not([size="1"]){height:auto;padding-right:.75rem;background-image:none}.custom-select:disabled{color:#6c757d;background-color:#e9ecef}.custom-select::-ms-expand{display:none}.custom-select:-moz-focusring{color:transparent;text-shadow:0 0 0 #495057}.custom-select-sm{height:calc(1.5em + .5rem + 2px);padding-top:.25rem;padding-bottom:.25rem;padding-left:.5rem;font-size:.875rem}.custom-select-lg{height:calc(1.5em + 1rem + 2px);padding-top:.5rem;padding-bottom:.5rem;padding-left:1rem;font-size:1.25rem}.custom-file{position:relative;display:inline-block;width:100%;height:calc(1.5em + .75rem + 2px);margin-bottom:0}.custom-file-input{position:relative;z-index:2;width:100%;height:calc(1.5em + .75rem + 2px);margin:0;overflow:hidden;opacity:0}.custom-file-input:focus~.custom-file-label{border-color:#80bdff;box-shadow:0 0 0 .2rem rgba(0,123,255,.25)}.custom-file-input:disabled~.custom-file-label,.custom-file-input[disabled]~.custom-file-label{background-color:#e9ecef}.custom-file-input:lang(en)~.custom-file-label::after{content:"Browse"}.custom-file-input~.custom-file-label[data-browse]::after{content:attr(data-browse)}.custom-file-label{position:absolute;top:0;right:0;left:0;z-index:1;height:calc(1.5em + .75rem + 2px);padding:.375rem .75rem;overflow:hidden;font-weight:400;line-height:1.5;color:#495057;background-color:#fff;border:1px solid #ced4da;border-radius:.25rem}.custom-file-label::after{position:absolute;top:0;right:0;bottom:0;z-index:3;display:block;height:calc(1.5em + .75rem);padding:.375rem .75rem;line-height:1.5;color:#495057;content:"Browse";background-color:#e9ecef;border-left:inherit;border-radius:0 .25rem .25rem 0}.custom-range{width:100%;height:1.4rem;padding:0;background-color:transparent;-webkit-appearance:none;-moz-appearance:none;appearance:none}.custom-range:focus{outline:0}.custom-range:focus::-webkit-slider-thumb{box-shadow:0 0 0 1px #fff,0 0 0 .2rem rgba(0,123,255,.25)}.custom-range:focus::-moz-range-thumb{box-shadow:0 0 0 1px #fff,0 0 0 .2rem rgba(0,123,255,.25)}.custom-range:focus::-ms-thumb{box-shadow:0 0 0 1px #fff,0 0 0 .2rem rgba(0,123,255,.25)}.custom-range::-moz-focus-outer{border:0}.custom-range::-webkit-slider-thumb{width:1rem;height:1rem;margin-top:-.25rem;background-color:#007bff;border:0;border-radius:1rem;-webkit-transition:background-color .15s ease-in-out,border-color .15s ease-in-out,box-shadow .15s ease-in-out;transition:background-color .15s ease-in-out,border-color .15s ease-in-out,box-shadow .15s ease-in-out;-webkit-appearance:none;appearance:none}@media (prefers-reduced-motion:reduce){.custom-range::-webkit-slider-thumb{-webkit-transition:none;transition:none}}.custom-range::-webkit-slider-thumb:active{background-color:#b3d7ff}.custom-range::-webkit-slider-runnable-track{width:100%;height:.5rem;color:transparent;cursor:pointer;background-color:#dee2e6;border-color:transparent;border-radius:1rem}.custom-range::-moz-range-thumb{width:1rem;height:1rem;background-color:#007bff;border:0;border-radius:1rem;-moz-transition:background-color .15s ease-in-out,border-color .15s ease-in-out,box-shadow .15s ease-in-out;transition:background-color .15s ease-in-out,border-color .15s ease-in-out,box-shadow .15s ease-in-out;-moz-appearance:none;appearance:none}@media (prefers-reduced-motion:reduce){.custom-range::-moz-range-thumb{-moz-transition:none;transition:none}}.custom-range::-moz-range-thumb:active{background-color:#b3d7ff}.custom-range::-moz-range-track{width:100%;height:.5rem;color:transparent;cursor:pointer;background-color:#dee2e6;border-color:transparent;border-radius:1rem}.custom-range::-ms-thumb{width:1rem;height:1rem;margin-top:0;margin-right:.2rem;margin-left:.2rem;background-color:#007bff;border:0;border-radius:1rem;-ms-transition:background-color .15s ease-in-out,border-color .15s ease-in-out,box-shadow .15s ease-in-out;transition:background-color .15s ease-in-out,border-color .15s ease-in-out,box-shadow .15s ease-in-out;appearance:none}@media (prefers-reduced-motion:reduce){.custom-range::-ms-thumb{-ms-transition:none;transition:none}}.custom-range::-ms-thumb:active{background-color:#b3d7ff}.custom-range::-ms-track{width:100%;height:.5rem;color:transparent;cursor:pointer;background-color:transparent;border-color:transparent;border-width:.5rem}.custom-range::-ms-fill-lower{background-color:#dee2e6;border-radius:1rem}.custom-range::-ms-fill-upper{margin-right:15px;background-color:#dee2e6;border-radius:1rem}.custom-range:disabled::-webkit-slider-thumb{background-color:#adb5bd}.custom-range:disabled::-webkit-slider-runnable-track{cursor:default}.custom-range:disabled::-moz-range-thumb{background-color:#adb5bd}.custom-range:disabled::-moz-range-track{cursor:default}.custom-range:disabled::-ms-thumb{background-color:#adb5bd}.custom-control-label::before,.custom-file-label,.custom-select{transition:background-color .15s ease-in-out,border-color .15s ease-in-out,box-shadow .15s ease-in-out}@media (prefers-reduced-motion:reduce){.custom-control-label::before,.custom-file-label,.custom-select{transition:none}}.nav{display:-ms-flexbox;display:flex;-ms-flex-wrap:wrap;flex-wrap:wrap;padding-left:0;margin-bottom:0;list-style:none}.nav-link{display:block;padding:.5rem 1rem}.nav-link:focus,.nav-link:hover{text-decoration:none}.nav-link.disabled{color:#6c757d;pointer-events:none;cursor:default}.nav-tabs{border-bottom:1px solid #dee2e6}.nav-tabs .nav-link{margin-bottom:-1px;border:1px solid transparent;border-top-left-radius:.25rem;border-top-right-radius:.25rem}.nav-tabs .nav-link:focus,.nav-tabs .nav-link:hover{border-color:#e9ecef #e9ecef #dee2e6}.nav-tabs .nav-link.disabled{color:#6c757d;background-color:transparent;border-color:transparent}.nav-tabs .nav-item.show .nav-link,.nav-tabs .nav-link.active{color:#495057;background-color:#fff;border-color:#dee2e6 #dee2e6 #fff}.nav-tabs .dropdown-menu{margin-top:-1px;border-top-left-radius:0;border-top-right-radius:0}.nav-pills .nav-link{border-radius:.25rem}.nav-pills .nav-link.active,.nav-pills .show>.nav-link{color:#fff;background-color:#007bff}.nav-fill .nav-item,.nav-fill>.nav-link{-ms-flex:1 1 auto;flex:1 1 auto;text-align:center}.nav-justified .nav-item,.nav-justified>.nav-link{-ms-flex-preferred-size:0;flex-basis:0;-ms-flex-positive:1;flex-grow:1;text-align:center}.tab-content>.tab-pane{display:none}.tab-content>.active{display:block}.navbar{position:relative;display:-ms-flexbox;display:flex;-ms-flex-wrap:wrap;flex-wrap:wrap;-ms-flex-align:center;align-items:center;-ms-flex-pack:justify;justify-content:space-between;padding:.5rem 1rem}.navbar .container,.navbar .container-fluid,.navbar .container-lg,.navbar .container-md,.navbar .container-sm,.navbar .container-xl{display:-ms-flexbox;display:flex;-ms-flex-wrap:wrap;flex-wrap:wrap;-ms-flex-align:center;align-items:center;-ms-flex-pack:justify;justify-content:space-between}.navbar-brand{display:inline-block;padding-top:.3125rem;padding-bottom:.3125rem;margin-right:1rem;font-size:1.25rem;line-height:inherit;white-space:nowrap}.navbar-brand:focus,.navbar-brand:hover{text-decoration:none}.navbar-nav{display:-ms-flexbox;display:flex;-ms-flex-direction:column;flex-direction:column;padding-left:0;margin-bottom:0;list-style:none}.navbar-nav .nav-link{padding-right:0;padding-left:0}.navbar-nav .dropdown-menu{position:static;float:none}.navbar-text{display:inline-block;padding-top:.5rem;padding-bottom:.5rem}.navbar-collapse{-ms-flex-preferred-size:100%;flex-basis:100%;-ms-flex-positive:1;flex-grow:1;-ms-flex-align:center;align-items:center}.navbar-toggler{padding:.25rem .75rem;font-size:1.25rem;line-height:1;background-color:transparent;border:1px solid transparent;border-radius:.25rem}.navbar-toggler:focus,.navbar-toggler:hover{text-decoration:none}.navbar-toggler-icon{display:inline-block;width:1.5em;height:1.5em;vertical-align:middle;content:"";background:50%/100% 100% no-repeat}.navbar-nav-scroll{max-height:75vh;overflow-y:auto}@media (max-width:575.98px){.navbar-expand-sm>.container,.navbar-expand-sm>.container-fluid,.navbar-expand-sm>.container-lg,.navbar-expand-sm>.container-md,.navbar-expand-sm>.container-sm,.navbar-expand-sm>.container-xl{padding-right:0;padding-left:0}}@media (min-width:576px){.navbar-expand-sm{-ms-flex-flow:row nowrap;flex-flow:row nowrap;-ms-flex-pack:start;justify-content:flex-start}.navbar-expand-sm .navbar-nav{-ms-flex-direction:row;flex-direction:row}.navbar-expand-sm .navbar-nav .dropdown-menu{position:absolute}.navbar-expand-sm .navbar-nav .nav-link{padding-right:.5rem;padding-left:.5rem}.navbar-expand-sm>.container,.navbar-expand-sm>.container-fluid,.navbar-expand-sm>.container-lg,.navbar-expand-sm>.container-md,.navbar-expand-sm>.container-sm,.navbar-expand-sm>.container-xl{-ms-flex-wrap:nowrap;flex-wrap:nowrap}.navbar-expand-sm .navbar-nav-scroll{overflow:visible}.navbar-expand-sm .navbar-collapse{display:-ms-flexbox!important;display:flex!important;-ms-flex-preferred-size:auto;flex-basis:auto}.navbar-expand-sm .navbar-toggler{display:none}}@media (max-width:767.98px){.navbar-expand-md>.container,.navbar-expand-md>.container-fluid,.navbar-expand-md>.container-lg,.navbar-expand-md>.container-md,.navbar-expand-md>.container-sm,.navbar-expand-md>.container-xl{padding-right:0;padding-left:0}}@media (min-width:768px){.navbar-expand-md{-ms-flex-flow:row nowrap;flex-flow:row nowrap;-ms-flex-pack:start;justify-content:flex-start}.navbar-expand-md .navbar-nav{-ms-flex-direction:row;flex-direction:row}.navbar-expand-md .navbar-nav .dropdown-menu{position:absolute}.navbar-expand-md .navbar-nav .nav-link{padding-right:.5rem;padding-left:.5rem}.navbar-expand-md>.container,.navbar-expand-md>.container-fluid,.navbar-expand-md>.container-lg,.navbar-expand-md>.container-md,.navbar-expand-md>.container-sm,.navbar-expand-md>.container-xl{-ms-flex-wrap:nowrap;flex-wrap:nowrap}.navbar-expand-md .navbar-nav-scroll{overflow:visible}.navbar-expand-md .navbar-collapse{display:-ms-flexbox!important;display:flex!important;-ms-flex-preferred-size:auto;flex-basis:auto}.navbar-expand-md .navbar-toggler{display:none}}@media (max-width:991.98px){.navbar-expand-lg>.container,.navbar-expand-lg>.container-fluid,.navbar-expand-lg>.container-lg,.navbar-expand-lg>.container-md,.navbar-expand-lg>.container-sm,.navbar-expand-lg>.container-xl{padding-right:0;padding-left:0}}@media (min-width:992px){.navbar-expand-lg{-ms-flex-flow:row nowrap;flex-flow:row nowrap;-ms-flex-pack:start;justify-content:flex-start}.navbar-expand-lg .navbar-nav{-ms-flex-direction:row;flex-direction:row}.navbar-expand-lg .navbar-nav .dropdown-menu{position:absolute}.navbar-expand-lg .navbar-nav .nav-link{padding-right:.5rem;padding-left:.5rem}.navbar-expand-lg>.container,.navbar-expand-lg>.container-fluid,.navbar-expand-lg>.container-lg,.navbar-expand-lg>.container-md,.navbar-expand-lg>.container-sm,.navbar-expand-lg>.container-xl{-ms-flex-wrap:nowrap;flex-wrap:nowrap}.navbar-expand-lg .navbar-nav-scroll{overflow:visible}.navbar-expand-lg .navbar-collapse{display:-ms-flexbox!important;display:flex!important;-ms-flex-preferred-size:auto;flex-basis:auto}.navbar-expand-lg .navbar-toggler{display:none}}@media (max-width:1199.98px){.navbar-expand-xl>.container,.navbar-expand-xl>.container-fluid,.navbar-expand-xl>.container-lg,.navbar-expand-xl>.container-md,.navbar-expand-xl>.container-sm,.navbar-expand-xl>.container-xl{padding-right:0;padding-left:0}}@media (min-width:1200px){.navbar-expand-xl{-ms-flex-flow:row nowrap;flex-flow:row nowrap;-ms-flex-pack:start;justify-content:flex-start}.navbar-expand-xl .navbar-nav{-ms-flex-direction:row;flex-direction:row}.navbar-expand-xl .navbar-nav .dropdown-menu{position:absolute}.navbar-expand-xl .navbar-nav .nav-link{padding-right:.5rem;padding-left:.5rem}.navbar-expand-xl>.container,.navbar-expand-xl>.container-fluid,.navbar-expand-xl>.container-lg,.navbar-expand-xl>.container-md,.navbar-expand-xl>.container-sm,.navbar-expand-xl>.container-xl{-ms-flex-wrap:nowrap;flex-wrap:nowrap}.navbar-expand-xl .navbar-nav-scroll{overflow:visible}.navbar-expand-xl .navbar-collapse{display:-ms-flexbox!important;display:flex!important;-ms-flex-preferred-size:auto;flex-basis:auto}.navbar-expand-xl .navbar-toggler{display:none}}.navbar-expand{-ms-flex-flow:row nowrap;flex-flow:row nowrap;-ms-flex-pack:start;justify-content:flex-start}.navbar-expand>.container,.navbar-expand>.container-fluid,.navbar-expand>.container-lg,.navbar-expand>.container-md,.navbar-expand>.container-sm,.navbar-expand>.container-xl{padding-right:0;padding-left:0}.navbar-expand .navbar-nav{-ms-flex-direction:row;flex-direction:row}.navbar-expand .navbar-nav .dropdown-menu{position:absolute}.navbar-expand .navbar-nav .nav-link{padding-right:.5rem;padding-left:.5rem}.navbar-expand>.container,.navbar-expand>.container-fluid,.navbar-expand>.container-lg,.navbar-expand>.container-md,.navbar-expand>.container-sm,.navbar-expand>.container-xl{-ms-flex-wrap:nowrap;flex-wrap:nowrap}.navbar-expand .navbar-nav-scroll{overflow:visible}.navbar-expand .navbar-collapse{display:-ms-flexbox!important;display:flex!important;-ms-flex-preferred-size:auto;flex-basis:auto}.navbar-expand .navbar-toggler{display:none}.navbar-light .navbar-brand{color:rgba(0,0,0,.9)}.navbar-light .navbar-brand:focus,.navbar-light .navbar-brand:hover{color:rgba(0,0,0,.9)}.navbar-light .navbar-nav .nav-link{color:rgba(0,0,0,.5)}.navbar-light .navbar-nav .nav-link:focus,.navbar-light .navbar-nav .nav-link:hover{color:rgba(0,0,0,.7)}.navbar-light .navbar-nav .nav-link.disabled{color:rgba(0,0,0,.3)}.navbar-light .navbar-nav .active>.nav-link,.navbar-light .navbar-nav .nav-link.active,.navbar-light .navbar-nav .nav-link.show,.navbar-light .navbar-nav .show>.nav-link{color:rgba(0,0,0,.9)}.navbar-light .navbar-toggler{color:rgba(0,0,0,.5);border-color:rgba(0,0,0,.1)}.navbar-light .navbar-toggler-icon{background-image:url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='30' height='30' viewBox='0 0 30 30'%3e%3cpath stroke='rgba%280, 0, 0, 0.5%29' stroke-linecap='round' stroke-miterlimit='10' stroke-width='2' d='M4 7h22M4 15h22M4 23h22'/%3e%3c/svg%3e")}.navbar-light .navbar-text{color:rgba(0,0,0,.5)}.navbar-light .navbar-text a{color:rgba(0,0,0,.9)}.navbar-light .navbar-text a:focus,.navbar-light .navbar-text a:hover{color:rgba(0,0,0,.9)}.navbar-dark .navbar-brand{color:#fff}.navbar-dark .navbar-brand:focus,.navbar-dark .navbar-brand:hover{color:#fff}.navbar-dark .navbar-nav .nav-link{color:rgba(255,255,255,.5)}.navbar-dark .navbar-nav .nav-link:focus,.navbar-dark .navbar-nav .nav-link:hover{color:rgba(255,255,255,.75)}.navbar-dark .navbar-nav .nav-link.disabled{color:rgba(255,255,255,.25)}.navbar-dark .navbar-nav .active>.nav-link,.navbar-dark .navbar-nav .nav-link.active,.navbar-dark .navbar-nav .nav-link.show,.navbar-dark .navbar-nav .show>.nav-link{color:#fff}.navbar-dark .navbar-toggler{color:rgba(255,255,255,.5);border-color:rgba(255,255,255,.1)}.navbar-dark .navbar-toggler-icon{background-image:url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='30' height='30' viewBox='0 0 30 30'%3e%3cpath stroke='rgba%28255, 255, 255, 0.5%29' stroke-linecap='round' stroke-miterlimit='10' stroke-width='2' d='M4 7h22M4 15h22M4 23h22'/%3e%3c/svg%3e")}.navbar-dark .navbar-text{color:rgba(255,255,255,.5)}.navbar-dark .navbar-text a{color:#fff}.navbar-dark .navbar-text a:focus,.navbar-dark .navbar-text a:hover{color:#fff}.card{position:relative;display:-ms-flexbox;display:flex;-ms-flex-direction:column;flex-direction:column;min-width:0;word-wrap:break-word;background-color:#fff;background-clip:border-box;border:1px solid rgba(0,0,0,.125);border-radius:.25rem}.card>hr{margin-right:0;margin-left:0}.card>.list-group{border-top:inherit;border-bottom:inherit}.card>.list-group:first-child{border-top-width:0;border-top-left-radius:calc(.25rem - 1px);border-top-right-radius:calc(.25rem - 1px)}.card>.list-group:last-child{border-bottom-width:0;border-bottom-right-radius:calc(.25rem - 1px);border-bottom-left-radius:calc(.25rem - 1px)}.card>.card-header+.list-group,.card>.list-group+.card-footer{border-top:0}.card-body{-ms-flex:1 1 auto;flex:1 1 auto;min-height:1px;padding:1.25rem}.card-title{margin-bottom:.75rem}.card-subtitle{margin-top:-.375rem;margin-bottom:0}.card-text:last-child{margin-bottom:0}.card-link:hover{text-decoration:none}.card-link+.card-link{margin-left:1.25rem}.card-header{padding:.75rem 1.25rem;margin-bottom:0;background-color:rgba(0,0,0,.03);border-bottom:1px solid rgba(0,0,0,.125)}.card-header:first-child{border-radius:calc(.25rem - 1px) calc(.25rem - 1px) 0 0}.card-footer{padding:.75rem 1.25rem;background-color:rgba(0,0,0,.03);border-top:1px solid rgba(0,0,0,.125)}.card-footer:last-child{border-radius:0 0 calc(.25rem - 1px) calc(.25rem - 1px)}.card-header-tabs{margin-right:-.625rem;margin-bottom:-.75rem;margin-left:-.625rem;border-bottom:0}.card-header-pills{margin-right:-.625rem;margin-left:-.625rem}.card-img-overlay{position:absolute;top:0;right:0;bottom:0;left:0;padding:1.25rem;border-radius:calc(.25rem - 1px)}.card-img,.card-img-bottom,.card-img-top{-ms-flex-negative:0;flex-shrink:0;width:100%}.card-img,.card-img-top{border-top-left-radius:calc(.25rem - 1px);border-top-right-radius:calc(.25rem - 1px)}.card-img,.card-img-bottom{border-bottom-right-radius:calc(.25rem - 1px);border-bottom-left-radius:calc(.25rem - 1px)}.card-deck .card{margin-bottom:15px}@media (min-width:576px){.card-deck{display:-ms-flexbox;display:flex;-ms-flex-flow:row wrap;flex-flow:row wrap;margin-right:-15px;margin-left:-15px}.card-deck .card{-ms-flex:1 0 0%;flex:1 0 0%;margin-right:15px;margin-bottom:0;margin-left:15px}}.card-group>.card{margin-bottom:15px}@media (min-width:576px){.card-group{display:-ms-flexbox;display:flex;-ms-flex-flow:row wrap;flex-flow:row wrap}.card-group>.card{-ms-flex:1 0 0%;flex:1 0 0%;margin-bottom:0}.card-group>.card+.card{margin-left:0;border-left:0}.card-group>.card:not(:last-child){border-top-right-radius:0;border-bottom-right-radius:0}.card-group>.card:not(:last-child) .card-header,.card-group>.card:not(:last-child) .card-img-top{border-top-right-radius:0}.card-group>.card:not(:last-child) .card-footer,.card-group>.card:not(:last-child) .card-img-bottom{border-bottom-right-radius:0}.card-group>.card:not(:first-child){border-top-left-radius:0;border-bottom-left-radius:0}.card-group>.card:not(:first-child) .card-header,.card-group>.card:not(:first-child) .card-img-top{border-top-left-radius:0}.card-group>.card:not(:first-child) .card-footer,.card-group>.card:not(:first-child) .card-img-bottom{border-bottom-left-radius:0}}.card-columns .card{margin-bottom:.75rem}@media (min-width:576px){.card-columns{-webkit-column-count:3;-moz-column-count:3;column-count:3;-webkit-column-gap:1.25rem;-moz-column-gap:1.25rem;column-gap:1.25rem;orphans:1;widows:1}.card-columns .card{display:inline-block;width:100%}}.accordion{overflow-anchor:none}.accordion>.card{overflow:hidden}.accordion>.card:not(:last-of-type){border-bottom:0;border-bottom-right-radius:0;border-bottom-left-radius:0}.accordion>.card:not(:first-of-type){border-top-left-radius:0;border-top-right-radius:0}.accordion>.card>.card-header{border-radius:0;margin-bottom:-1px}.breadcrumb{display:-ms-flexbox;display:flex;-ms-flex-wrap:wrap;flex-wrap:wrap;padding:.75rem 1rem;margin-bottom:1rem;list-style:none;background-color:#e9ecef;border-radius:.25rem}.breadcrumb-item+.breadcrumb-item{padding-left:.5rem}.breadcrumb-item+.breadcrumb-item::before{float:left;padding-right:.5rem;color:#6c757d;content:"/"}.breadcrumb-item+.breadcrumb-item:hover::before{text-decoration:underline}.breadcrumb-item+.breadcrumb-item:hover::before{text-decoration:none}.breadcrumb-item.active{color:#6c757d}.pagination{display:-ms-flexbox;display:flex;padding-left:0;list-style:none;border-radius:.25rem}.page-link{position:relative;display:block;padding:.5rem .75rem;margin-left:-1px;line-height:1.25;color:#007bff;background-color:#fff;border:1px solid #dee2e6}.page-link:hover{z-index:2;color:#0056b3;text-decoration:none;background-color:#e9ecef;border-color:#dee2e6}.page-link:focus{z-index:3;outline:0;box-shadow:0 0 0 .2rem rgba(0,123,255,.25)}.page-item:first-child .page-link{margin-left:0;border-top-left-radius:.25rem;border-bottom-left-radius:.25rem}.page-item:last-child .page-link{border-top-right-radius:.25rem;border-bottom-right-radius:.25rem}.page-item.active .page-link{z-index:3;color:#fff;background-color:#007bff;border-color:#007bff}.page-item.disabled .page-link{color:#6c757d;pointer-events:none;cursor:auto;background-color:#fff;border-color:#dee2e6}.pagination-lg .page-link{padding:.75rem 1.5rem;font-size:1.25rem;line-height:1.5}.pagination-lg .page-item:first-child .page-link{border-top-left-radius:.3rem;border-bottom-left-radius:.3rem}.pagination-lg .page-item:last-child .page-link{border-top-right-radius:.3rem;border-bottom-right-radius:.3rem}.pagination-sm .page-link{padding:.25rem .5rem;font-size:.875rem;line-height:1.5}.pagination-sm .page-item:first-child .page-link{border-top-left-radius:.2rem;border-bottom-left-radius:.2rem}.pagination-sm .page-item:last-child .page-link{border-top-right-radius:.2rem;border-bottom-right-radius:.2rem}.badge{display:inline-block;padding:.25em .4em;font-size:75%;font-weight:700;line-height:1;text-align:center;white-space:nowrap;vertical-align:baseline;border-radius:.25rem;transition:color .15s ease-in-out,background-color .15s ease-in-out,border-color .15s ease-in-out,box-shadow .15s ease-in-out}@media (prefers-reduced-motion:reduce){.badge{transition:none}}a.badge:focus,a.badge:hover{text-decoration:none}.badge:empty{display:none}.btn .badge{position:relative;top:-1px}.badge-pill{padding-right:.6em;padding-left:.6em;border-radius:10rem}.badge-primary{color:#fff;background-color:#007bff}a.badge-primary:focus,a.badge-primary:hover{color:#fff;background-color:#0062cc}a.badge-primary.focus,a.badge-primary:focus{outline:0;box-shadow:0 0 0 .2rem rgba(0,123,255,.5)}.badge-secondary{color:#fff;background-color:#6c757d}a.badge-secondary:focus,a.badge-secondary:hover{color:#fff;background-color:#545b62}a.badge-secondary.focus,a.badge-secondary:focus{outline:0;box-shadow:0 0 0 .2rem rgba(108,117,125,.5)}.badge-success{color:#fff;background-color:#28a745}a.badge-success:focus,a.badge-success:hover{color:#fff;background-color:#1e7e34}a.badge-success.focus,a.badge-success:focus{outline:0;box-shadow:0 0 0 .2rem rgba(40,167,69,.5)}.badge-info{color:#fff;background-color:#17a2b8}a.badge-info:focus,a.badge-info:hover{color:#fff;background-color:#117a8b}a.badge-info.focus,a.badge-info:focus{outline:0;box-shadow:0 0 0 .2rem rgba(23,162,184,.5)}.badge-warning{color:#212529;background-color:#ffc107}a.badge-warning:focus,a.badge-warning:hover{color:#212529;background-color:#d39e00}a.badge-warning.focus,a.badge-warning:focus{outline:0;box-shadow:0 0 0 .2rem rgba(255,193,7,.5)}.badge-danger{color:#fff;background-color:#dc3545}a.badge-danger:focus,a.badge-danger:hover{color:#fff;background-color:#bd2130}a.badge-danger.focus,a.badge-danger:focus{outline:0;box-shadow:0 0 0 .2rem rgba(220,53,69,.5)}.badge-light{color:#212529;background-color:#f8f9fa}a.badge-light:focus,a.badge-light:hover{color:#212529;background-color:#dae0e5}a.badge-light.focus,a.badge-light:focus{outline:0;box-shadow:0 0 0 .2rem rgba(248,249,250,.5)}.badge-dark{color:#fff;background-color:#343a40}a.badge-dark:focus,a.badge-dark:hover{color:#fff;background-color:#1d2124}a.badge-dark.focus,a.badge-dark:focus{outline:0;box-shadow:0 0 0 .2rem rgba(52,58,64,.5)}.jumbotron{padding:2rem 1rem;margin-bottom:2rem;background-color:#e9ecef;border-radius:.3rem}@media (min-width:576px){.jumbotron{padding:4rem 2rem}}.jumbotron-fluid{padding-right:0;padding-left:0;border-radius:0}.alert{position:relative;padding:.75rem 1.25rem;margin-bottom:1rem;border:1px solid transparent;border-radius:.25rem}.alert-heading{color:inherit}.alert-link{font-weight:700}.alert-dismissible{padding-right:4rem}.alert-dismissible .close{position:absolute;top:0;right:0;z-index:2;padding:.75rem 1.25rem;color:inherit}.alert-primary{color:#004085;background-color:#cce5ff;border-color:#b8daff}.alert-primary hr{border-top-color:#9fcdff}.alert-primary .alert-link{color:#002752}.alert-secondary{color:#383d41;background-color:#e2e3e5;border-color:#d6d8db}.alert-secondary hr{border-top-color:#c8cbcf}.alert-secondary .alert-link{color:#202326}.alert-success{color:#155724;background-color:#d4edda;border-color:#c3e6cb}.alert-success hr{border-top-color:#b1dfbb}.alert-success .alert-link{color:#0b2e13}.alert-info{color:#0c5460;background-color:#d1ecf1;border-color:#bee5eb}.alert-info hr{border-top-color:#abdde5}.alert-info .alert-link{color:#062c33}.alert-warning{color:#856404;background-color:#fff3cd;border-color:#ffeeba}.alert-warning hr{border-top-color:#ffe8a1}.alert-warning .alert-link{color:#533f03}.alert-danger{color:#721c24;background-color:#f8d7da;border-color:#f5c6cb}.alert-danger hr{border-top-color:#f1b0b7}.alert-danger .alert-link{color:#491217}.alert-light{color:#818182;background-color:#fefefe;border-color:#fdfdfe}.alert-light hr{border-top-color:#ececf6}.alert-light .alert-link{color:#686868}.alert-dark{color:#1b1e21;background-color:#d6d8d9;border-color:#c6c8ca}.alert-dark hr{border-top-color:#b9bbbe}.alert-dark .alert-link{color:#040505}@-webkit-keyframes progress-bar-stripes{from{background-position:1rem 0}to{background-position:0 0}}@keyframes progress-bar-stripes{from{background-position:1rem 0}to{background-position:0 0}}.progress{display:-ms-flexbox;display:flex;height:1rem;overflow:hidden;line-height:0;font-size:.75rem;background-color:#e9ecef;border-radius:.25rem}.progress-bar{display:-ms-flexbox;display:flex;-ms-flex-direction:column;flex-direction:column;-ms-flex-pack:center;justify-content:center;overflow:hidden;color:#fff;text-align:center;white-space:nowrap;background-color:#007bff;transition:width .6s ease}@media (prefers-reduced-motion:reduce){.progress-bar{transition:none}}.progress-bar-striped{background-image:linear-gradient(45deg,rgba(255,255,255,.15) 25%,transparent 25%,transparent 50%,rgba(255,255,255,.15) 50%,rgba(255,255,255,.15) 75%,transparent 75%,transparent);background-size:1rem 1rem}.progress-bar-animated{-webkit-animation:1s linear infinite progress-bar-stripes;animation:1s linear infinite progress-bar-stripes}@media (prefers-reduced-motion:reduce){.progress-bar-animated{-webkit-animation:none;animation:none}}.media{display:-ms-flexbox;display:flex;-ms-flex-align:start;align-items:flex-start}.media-body{-ms-flex:1;flex:1}.list-group{display:-ms-flexbox;display:flex;-ms-flex-direction:column;flex-direction:column;padding-left:0;margin-bottom:0;border-radius:.25rem}.list-group-item-action{width:100%;color:#495057;text-align:inherit}.list-group-item-action:focus,.list-group-item-action:hover{z-index:1;color:#495057;text-decoration:none;background-color:#f8f9fa}.list-group-item-action:active{color:#212529;background-color:#e9ecef}.list-group-item{position:relative;display:block;padding:.75rem 1.25rem;background-color:#fff;border:1px solid rgba(0,0,0,.125)}.list-group-item:first-child{border-top-left-radius:inherit;border-top-right-radius:inherit}.list-group-item:last-child{border-bottom-right-radius:inherit;border-bottom-left-radius:inherit}.list-group-item.disabled,.list-group-item:disabled{color:#6c757d;pointer-events:none;background-color:#fff}.list-group-item.active{z-index:2;color:#fff;background-color:#007bff;border-color:#007bff}.list-group-item+.list-group-item{border-top-width:0}.list-group-item+.list-group-item.active{margin-top:-1px;border-top-width:1px}.list-group-horizontal{-ms-flex-direction:row;flex-direction:row}.list-group-horizontal>.list-group-item:first-child{border-bottom-left-radius:.25rem;border-top-right-radius:0}.list-group-horizontal>.list-group-item:last-child{border-top-right-radius:.25rem;border-bottom-left-radius:0}.list-group-horizontal>.list-group-item.active{margin-top:0}.list-group-horizontal>.list-group-item+.list-group-item{border-top-width:1px;border-left-width:0}.list-group-horizontal>.list-group-item+.list-group-item.active{margin-left:-1px;border-left-width:1px}@media (min-width:576px){.list-group-horizontal-sm{-ms-flex-direction:row;flex-direction:row}.list-group-horizontal-sm>.list-group-item:first-child{border-bottom-left-radius:.25rem;border-top-right-radius:0}.list-group-horizontal-sm>.list-group-item:last-child{border-top-right-radius:.25rem;border-bottom-left-radius:0}.list-group-horizontal-sm>.list-group-item.active{margin-top:0}.list-group-horizontal-sm>.list-group-item+.list-group-item{border-top-width:1px;border-left-width:0}.list-group-horizontal-sm>.list-group-item+.list-group-item.active{margin-left:-1px;border-left-width:1px}}@media (min-width:768px){.list-group-horizontal-md{-ms-flex-direction:row;flex-direction:row}.list-group-horizontal-md>.list-group-item:first-child{border-bottom-left-radius:.25rem;border-top-right-radius:0}.list-group-horizontal-md>.list-group-item:last-child{border-top-right-radius:.25rem;border-bottom-left-radius:0}.list-group-horizontal-md>.list-group-item.active{margin-top:0}.list-group-horizontal-md>.list-group-item+.list-group-item{border-top-width:1px;border-left-width:0}.list-group-horizontal-md>.list-group-item+.list-group-item.active{margin-left:-1px;border-left-width:1px}}@media (min-width:992px){.list-group-horizontal-lg{-ms-flex-direction:row;flex-direction:row}.list-group-horizontal-lg>.list-group-item:first-child{border-bottom-left-radius:.25rem;border-top-right-radius:0}.list-group-horizontal-lg>.list-group-item:last-child{border-top-right-radius:.25rem;border-bottom-left-radius:0}.list-group-horizontal-lg>.list-group-item.active{margin-top:0}.list-group-horizontal-lg>.list-group-item+.list-group-item{border-top-width:1px;border-left-width:0}.list-group-horizontal-lg>.list-group-item+.list-group-item.active{margin-left:-1px;border-left-width:1px}}@media (min-width:1200px){.list-group-horizontal-xl{-ms-flex-direction:row;flex-direction:row}.list-group-horizontal-xl>.list-group-item:first-child{border-bottom-left-radius:.25rem;border-top-right-radius:0}.list-group-horizontal-xl>.list-group-item:last-child{border-top-right-radius:.25rem;border-bottom-left-radius:0}.list-group-horizontal-xl>.list-group-item.active{margin-top:0}.list-group-horizontal-xl>.list-group-item+.list-group-item{border-top-width:1px;border-left-width:0}.list-group-horizontal-xl>.list-group-item+.list-group-item.active{margin-left:-1px;border-left-width:1px}}.list-group-flush{border-radius:0}.list-group-flush>.list-group-item{border-width:0 0 1px}.list-group-flush>.list-group-item:last-child{border-bottom-width:0}.list-group-item-primary{color:#004085;background-color:#b8daff}.list-group-item-primary.list-group-item-action:focus,.list-group-item-primary.list-group-item-action:hover{color:#004085;background-color:#9fcdff}.list-group-item-primary.list-group-item-action.active{color:#fff;background-color:#004085;border-color:#004085}.list-group-item-secondary{color:#383d41;background-color:#d6d8db}.list-group-item-secondary.list-group-item-action:focus,.list-group-item-secondary.list-group-item-action:hover{color:#383d41;background-color:#c8cbcf}.list-group-item-secondary.list-group-item-action.active{color:#fff;background-color:#383d41;border-color:#383d41}.list-group-item-success{color:#155724;background-color:#c3e6cb}.list-group-item-success.list-group-item-action:focus,.list-group-item-success.list-group-item-action:hover{color:#155724;background-color:#b1dfbb}.list-group-item-success.list-group-item-action.active{color:#fff;background-color:#155724;border-color:#155724}.list-group-item-info{color:#0c5460;background-color:#bee5eb}.list-group-item-info.list-group-item-action:focus,.list-group-item-info.list-group-item-action:hover{color:#0c5460;background-color:#abdde5}.list-group-item-info.list-group-item-action.active{color:#fff;background-color:#0c5460;border-color:#0c5460}.list-group-item-warning{color:#856404;background-color:#ffeeba}.list-group-item-warning.list-group-item-action:focus,.list-group-item-warning.list-group-item-action:hover{color:#856404;background-color:#ffe8a1}.list-group-item-warning.list-group-item-action.active{color:#fff;background-color:#856404;border-color:#856404}.list-group-item-danger{color:#721c24;background-color:#f5c6cb}.list-group-item-danger.list-group-item-action:focus,.list-group-item-danger.list-group-item-action:hover{color:#721c24;background-color:#f1b0b7}.list-group-item-danger.list-group-item-action.active{color:#fff;background-color:#721c24;border-color:#721c24}.list-group-item-light{color:#818182;background-color:#fdfdfe}.list-group-item-light.list-group-item-action:focus,.list-group-item-light.list-group-item-action:hover{color:#818182;background-color:#ececf6}.list-group-item-light.list-group-item-action.active{color:#fff;background-color:#818182;border-color:#818182}.list-group-item-dark{color:#1b1e21;background-color:#c6c8ca}.list-group-item-dark.list-group-item-action:focus,.list-group-item-dark.list-group-item-action:hover{color:#1b1e21;background-color:#b9bbbe}.list-group-item-dark.list-group-item-action.active{color:#fff;background-color:#1b1e21;border-color:#1b1e21}.close{float:right;font-size:1.5rem;font-weight:700;line-height:1;color:#000;text-shadow:0 1px 0 #fff;opacity:.5}.close:hover{color:#000;text-decoration:none}.close:not(:disabled):not(.disabled):focus,.close:not(:disabled):not(.disabled):hover{opacity:.75}button.close{padding:0;background-color:transparent;border:0}a.close.disabled{pointer-events:none}.toast{-ms-flex-preferred-size:350px;flex-basis:350px;max-width:350px;font-size:.875rem;background-color:rgba(255,255,255,.85);background-clip:padding-box;border:1px solid rgba(0,0,0,.1);box-shadow:0 .25rem .75rem rgba(0,0,0,.1);opacity:0;border-radius:.25rem}.toast:not(:last-child){margin-bottom:.75rem}.toast.showing{opacity:1}.toast.show{display:block;opacity:1}.toast.hide{display:none}.toast-header{display:-ms-flexbox;display:flex;-ms-flex-align:center;align-items:center;padding:.25rem .75rem;color:#6c757d;background-color:rgba(255,255,255,.85);background-clip:padding-box;border-bottom:1px solid rgba(0,0,0,.05);border-top-left-radius:calc(.25rem - 1px);border-top-right-radius:calc(.25rem - 1px)}.toast-body{padding:.75rem}.modal-open{overflow:hidden}.modal-open .modal{overflow-x:hidden;overflow-y:auto}.modal{position:fixed;top:0;left:0;z-index:1050;display:none;width:100%;height:100%;overflow:hidden;outline:0}.modal-dialog{position:relative;width:auto;margin:.5rem;pointer-events:none}.modal.fade .modal-dialog{transition:-webkit-transform .3s ease-out;transition:transform .3s ease-out;transition:transform .3s ease-out,-webkit-transform .3s ease-out;-webkit-transform:translate(0,-50px);transform:translate(0,-50px)}@media (prefers-reduced-motion:reduce){.modal.fade .modal-dialog{transition:none}}.modal.show .modal-dialog{-webkit-transform:none;transform:none}.modal.modal-static .modal-dialog{-webkit-transform:scale(1.02);transform:scale(1.02)}.modal-dialog-scrollable{display:-ms-flexbox;display:flex;max-height:calc(100% - 1rem)}.modal-dialog-scrollable .modal-content{max-height:calc(100vh - 1rem);overflow:hidden}.modal-dialog-scrollable .modal-footer,.modal-dialog-scrollable .modal-header{-ms-flex-negative:0;flex-shrink:0}.modal-dialog-scrollable .modal-body{overflow-y:auto}.modal-dialog-centered{display:-ms-flexbox;display:flex;-ms-flex-align:center;align-items:center;min-height:calc(100% - 1rem)}.modal-dialog-centered::before{display:block;height:calc(100vh - 1rem);height:-webkit-min-content;height:-moz-min-content;height:min-content;content:""}.modal-dialog-centered.modal-dialog-scrollable{-ms-flex-direction:column;flex-direction:column;-ms-flex-pack:center;justify-content:center;height:100%}.modal-dialog-centered.modal-dialog-scrollable .modal-content{max-height:none}.modal-dialog-centered.modal-dialog-scrollable::before{content:none}.modal-content{position:relative;display:-ms-flexbox;display:flex;-ms-flex-direction:column;flex-direction:column;width:100%;pointer-events:auto;background-color:#fff;background-clip:padding-box;border:1px solid rgba(0,0,0,.2);border-radius:.3rem;outline:0}.modal-backdrop{position:fixed;top:0;left:0;z-index:1040;width:100vw;height:100vh;background-color:#000}.modal-backdrop.fade{opacity:0}.modal-backdrop.show{opacity:.5}.modal-header{display:-ms-flexbox;display:flex;-ms-flex-align:start;align-items:flex-start;-ms-flex-pack:justify;justify-content:space-between;padding:1rem 1rem;border-bottom:1px solid #dee2e6;border-top-left-radius:calc(.3rem - 1px);border-top-right-radius:calc(.3rem - 1px)}.modal-header .close{padding:1rem 1rem;margin:-1rem -1rem -1rem auto}.modal-title{margin-bottom:0;line-height:1.5}.modal-body{position:relative;-ms-flex:1 1 auto;flex:1 1 auto;padding:1rem}.modal-footer{display:-ms-flexbox;display:flex;-ms-flex-wrap:wrap;flex-wrap:wrap;-ms-flex-align:center;align-items:center;-ms-flex-pack:end;justify-content:flex-end;padding:.75rem;border-top:1px solid #dee2e6;border-bottom-right-radius:calc(.3rem - 1px);border-bottom-left-radius:calc(.3rem - 1px)}.modal-footer>*{margin:.25rem}.modal-scrollbar-measure{position:absolute;top:-9999px;width:50px;height:50px;overflow:scroll}@media (min-width:576px){.modal-dialog{max-width:500px;margin:1.75rem auto}.modal-dialog-scrollable{max-height:calc(100% - 3.5rem)}.modal-dialog-scrollable .modal-content{max-height:calc(100vh - 3.5rem)}.modal-dialog-centered{min-height:calc(100% - 3.5rem)}.modal-dialog-centered::before{height:calc(100vh - 3.5rem);height:-webkit-min-content;height:-moz-min-content;height:min-content}.modal-sm{max-width:300px}}@media (min-width:992px){.modal-lg,.modal-xl{max-width:800px}}@media (min-width:1200px){.modal-xl{max-width:1140px}}.tooltip{position:absolute;z-index:1070;display:block;margin:0;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,"Noto Sans","Liberation Sans",sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji";font-style:normal;font-weight:400;line-height:1.5;text-align:left;text-align:start;text-decoration:none;text-shadow:none;text-transform:none;letter-spacing:normal;word-break:normal;word-spacing:normal;white-space:normal;line-break:auto;font-size:.875rem;word-wrap:break-word;opacity:0}.tooltip.show{opacity:.9}.tooltip .arrow{position:absolute;display:block;width:.8rem;height:.4rem}.tooltip .arrow::before{position:absolute;content:"";border-color:transparent;border-style:solid}.bs-tooltip-auto[x-placement^=top],.bs-tooltip-top{padding:.4rem 0}.bs-tooltip-auto[x-placement^=top] .arrow,.bs-tooltip-top .arrow{bottom:0}.bs-tooltip-auto[x-placement^=top] .arrow::before,.bs-tooltip-top .arrow::before{top:0;border-width:.4rem .4rem 0;border-top-color:#000}.bs-tooltip-auto[x-placement^=right],.bs-tooltip-right{padding:0 .4rem}.bs-tooltip-auto[x-placement^=right] .arrow,.bs-tooltip-right .arrow{left:0;width:.4rem;height:.8rem}.bs-tooltip-auto[x-placement^=right] .arrow::before,.bs-tooltip-right .arrow::before{right:0;border-width:.4rem .4rem .4rem 0;border-right-color:#000}.bs-tooltip-auto[x-placement^=bottom],.bs-tooltip-bottom{padding:.4rem 0}.bs-tooltip-auto[x-placement^=bottom] .arrow,.bs-tooltip-bottom .arrow{top:0}.bs-tooltip-auto[x-placement^=bottom] .arrow::before,.bs-tooltip-bottom .arrow::before{bottom:0;border-width:0 .4rem .4rem;border-bottom-color:#000}.bs-tooltip-auto[x-placement^=left],.bs-tooltip-left{padding:0 .4rem}.bs-tooltip-auto[x-placement^=left] .arrow,.bs-tooltip-left .arrow{right:0;width:.4rem;height:.8rem}.bs-tooltip-auto[x-placement^=left] .arrow::before,.bs-tooltip-left .arrow::before{left:0;border-width:.4rem 0 .4rem .4rem;border-left-color:#000}.tooltip-inner{max-width:200px;padding:.25rem .5rem;color:#fff;text-align:center;background-color:#000;border-radius:.25rem}.popover{position:absolute;top:0;left:0;z-index:1060;display:block;max-width:276px;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,"Noto Sans","Liberation Sans",sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji";font-style:normal;font-weight:400;line-height:1.5;text-align:left;text-align:start;text-decoration:none;text-shadow:none;text-transform:none;letter-spacing:normal;word-break:normal;word-spacing:normal;white-space:normal;line-break:auto;font-size:.875rem;word-wrap:break-word;background-color:#fff;background-clip:padding-box;border:1px solid rgba(0,0,0,.2);border-radius:.3rem}.popover .arrow{position:absolute;display:block;width:1rem;height:.5rem;margin:0 .3rem}.popover .arrow::after,.popover .arrow::before{position:absolute;display:block;content:"";border-color:transparent;border-style:solid}.bs-popover-auto[x-placement^=top],.bs-popover-top{margin-bottom:.5rem}.bs-popover-auto[x-placement^=top]>.arrow,.bs-popover-top>.arrow{bottom:calc(-.5rem - 1px)}.bs-popover-auto[x-placement^=top]>.arrow::before,.bs-popover-top>.arrow::before{bottom:0;border-width:.5rem .5rem 0;border-top-color:rgba(0,0,0,.25)}.bs-popover-auto[x-placement^=top]>.arrow::after,.bs-popover-top>.arrow::after{bottom:1px;border-width:.5rem .5rem 0;border-top-color:#fff}.bs-popover-auto[x-placement^=right],.bs-popover-right{margin-left:.5rem}.bs-popover-auto[x-placement^=right]>.arrow,.bs-popover-right>.arrow{left:calc(-.5rem - 1px);width:.5rem;height:1rem;margin:.3rem 0}.bs-popover-auto[x-placement^=right]>.arrow::before,.bs-popover-right>.arrow::before{left:0;border-width:.5rem .5rem .5rem 0;border-right-color:rgba(0,0,0,.25)}.bs-popover-auto[x-placement^=right]>.arrow::after,.bs-popover-right>.arrow::after{left:1px;border-width:.5rem .5rem .5rem 0;border-right-color:#fff}.bs-popover-auto[x-placement^=bottom],.bs-popover-bottom{margin-top:.5rem}.bs-popover-auto[x-placement^=bottom]>.arrow,.bs-popover-bottom>.arrow{top:calc(-.5rem - 1px)}.bs-popover-auto[x-placement^=bottom]>.arrow::before,.bs-popover-bottom>.arrow::before{top:0;border-width:0 .5rem .5rem .5rem;border-bottom-color:rgba(0,0,0,.25)}.bs-popover-auto[x-placement^=bottom]>.arrow::after,.bs-popover-bottom>.arrow::after{top:1px;border-width:0 .5rem .5rem .5rem;border-bottom-color:#fff}.bs-popover-auto[x-placement^=bottom] .popover-header::before,.bs-popover-bottom .popover-header::before{position:absolute;top:0;left:50%;display:block;width:1rem;margin-left:-.5rem;content:"";border-bottom:1px solid #f7f7f7}.bs-popover-auto[x-placement^=left],.bs-popover-left{margin-right:.5rem}.bs-popover-auto[x-placement^=left]>.arrow,.bs-popover-left>.arrow{right:calc(-.5rem - 1px);width:.5rem;height:1rem;margin:.3rem 0}.bs-popover-auto[x-placement^=left]>.arrow::before,.bs-popover-left>.arrow::before{right:0;border-width:.5rem 0 .5rem .5rem;border-left-color:rgba(0,0,0,.25)}.bs-popover-auto[x-placement^=left]>.arrow::after,.bs-popover-left>.arrow::after{right:1px;border-width:.5rem 0 .5rem .5rem;border-left-color:#fff}.popover-header{padding:.5rem .75rem;margin-bottom:0;font-size:1rem;background-color:#f7f7f7;border-bottom:1px solid #ebebeb;border-top-left-radius:calc(.3rem - 1px);border-top-right-radius:calc(.3rem - 1px)}.popover-header:empty{display:none}.popover-body{padding:.5rem .75rem;color:#212529}.carousel{position:relative}.carousel.pointer-event{-ms-touch-action:pan-y;touch-action:pan-y}.carousel-inner{position:relative;width:100%;overflow:hidden}.carousel-inner::after{display:block;clear:both;content:""}.carousel-item{position:relative;display:none;float:left;width:100%;margin-right:-100%;-webkit-backface-visibility:hidden;backface-visibility:hidden;transition:-webkit-transform .6s ease-in-out;transition:transform .6s ease-in-out;transition:transform .6s ease-in-out,-webkit-transform .6s ease-in-out}@media (prefers-reduced-motion:reduce){.carousel-item{transition:none}}.carousel-item-next,.carousel-item-prev,.carousel-item.active{display:block}.active.carousel-item-right,.carousel-item-next:not(.carousel-item-left){-webkit-transform:translateX(100%);transform:translateX(100%)}.active.carousel-item-left,.carousel-item-prev:not(.carousel-item-right){-webkit-transform:translateX(-100%);transform:translateX(-100%)}.carousel-fade .carousel-item{opacity:0;transition-property:opacity;-webkit-transform:none;transform:none}.carousel-fade .carousel-item-next.carousel-item-left,.carousel-fade .carousel-item-prev.carousel-item-right,.carousel-fade .carousel-item.active{z-index:1;opacity:1}.carousel-fade .active.carousel-item-left,.carousel-fade .active.carousel-item-right{z-index:0;opacity:0;transition:opacity 0s .6s}@media (prefers-reduced-motion:reduce){.carousel-fade .active.carousel-item-left,.carousel-fade .active.carousel-item-right{transition:none}}.carousel-control-next,.carousel-control-prev{position:absolute;top:0;bottom:0;z-index:1;display:-ms-flexbox;display:flex;-ms-flex-align:center;align-items:center;-ms-flex-pack:center;justify-content:center;width:15%;color:#fff;text-align:center;opacity:.5;transition:opacity .15s ease}@media (prefers-reduced-motion:reduce){.carousel-control-next,.carousel-control-prev{transition:none}}.carousel-control-next:focus,.carousel-control-next:hover,.carousel-control-prev:focus,.carousel-control-prev:hover{color:#fff;text-decoration:none;outline:0;opacity:.9}.carousel-control-prev{left:0}.carousel-control-next{right:0}.carousel-control-next-icon,.carousel-control-prev-icon{display:inline-block;width:20px;height:20px;background:50%/100% 100% no-repeat}.carousel-control-prev-icon{background-image:url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='%23fff' width='8' height='8' viewBox='0 0 8 8'%3e%3cpath d='M5.25 0l-4 4 4 4 1.5-1.5L4.25 4l2.5-2.5L5.25 0z'/%3e%3c/svg%3e")}.carousel-control-next-icon{background-image:url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='%23fff' width='8' height='8' viewBox='0 0 8 8'%3e%3cpath d='M2.75 0l-1.5 1.5L3.75 4l-2.5 2.5L2.75 8l4-4-4-4z'/%3e%3c/svg%3e")}.carousel-indicators{position:absolute;right:0;bottom:0;left:0;z-index:15;display:-ms-flexbox;display:flex;-ms-flex-pack:center;justify-content:center;padding-left:0;margin-right:15%;margin-left:15%;list-style:none}.carousel-indicators li{box-sizing:content-box;-ms-flex:0 1 auto;flex:0 1 auto;width:30px;height:3px;margin-right:3px;margin-left:3px;text-indent:-999px;cursor:pointer;background-color:#fff;background-clip:padding-box;border-top:10px solid transparent;border-bottom:10px solid transparent;opacity:.5;transition:opacity .6s ease}@media (prefers-reduced-motion:reduce){.carousel-indicators li{transition:none}}.carousel-indicators .active{opacity:1}.carousel-caption{position:absolute;right:15%;bottom:20px;left:15%;z-index:10;padding-top:20px;padding-bottom:20px;color:#fff;text-align:center}@-webkit-keyframes spinner-border{to{-webkit-transform:rotate(360deg);transform:rotate(360deg)}}@keyframes spinner-border{to{-webkit-transform:rotate(360deg);transform:rotate(360deg)}}.spinner-border{display:inline-block;width:2rem;height:2rem;vertical-align:text-bottom;border:.25em solid currentColor;border-right-color:transparent;border-radius:50%;-webkit-animation:.75s linear infinite spinner-border;animation:.75s linear infinite spinner-border}.spinner-border-sm{width:1rem;height:1rem;border-width:.2em}@-webkit-keyframes spinner-grow{0%{-webkit-transform:scale(0);transform:scale(0)}50%{opacity:1;-webkit-transform:none;transform:none}}@keyframes spinner-grow{0%{-webkit-transform:scale(0);transform:scale(0)}50%{opacity:1;-webkit-transform:none;transform:none}}.spinner-grow{display:inline-block;width:2rem;height:2rem;vertical-align:text-bottom;background-color:currentColor;border-radius:50%;opacity:0;-webkit-animation:.75s linear infinite spinner-grow;animation:.75s linear infinite spinner-grow}.spinner-grow-sm{width:1rem;height:1rem}@media (prefers-reduced-motion:reduce){.spinner-border,.spinner-grow{-webkit-animation-duration:1.5s;animation-duration:1.5s}}.align-baseline{vertical-align:baseline!important}.align-top{vertical-align:top!important}.align-middle{vertical-align:middle!important}.align-bottom{vertical-align:bottom!important}.align-text-bottom{vertical-align:text-bottom!important}.align-text-top{vertical-align:text-top!important}.bg-primary{background-color:#007bff!important}a.bg-primary:focus,a.bg-primary:hover,button.bg-primary:focus,button.bg-primary:hover{background-color:#0062cc!important}.bg-secondary{background-color:#6c757d!important}a.bg-secondary:focus,a.bg-secondary:hover,button.bg-secondary:focus,button.bg-secondary:hover{background-color:#545b62!important}.bg-success{background-color:#28a745!important}a.bg-success:focus,a.bg-success:hover,button.bg-success:focus,button.bg-success:hover{background-color:#1e7e34!important}.bg-info{background-color:#17a2b8!important}a.bg-info:focus,a.bg-info:hover,button.bg-info:focus,button.bg-info:hover{background-color:#117a8b!important}.bg-warning{background-color:#ffc107!important}a.bg-warning:focus,a.bg-warning:hover,button.bg-warning:focus,button.bg-warning:hover{background-color:#d39e00!important}.bg-danger{background-color:#dc3545!important}a.bg-danger:focus,a.bg-danger:hover,button.bg-danger:focus,button.bg-danger:hover{background-color:#bd2130!important}.bg-light{background-color:#f8f9fa!important}a.bg-light:focus,a.bg-light:hover,button.bg-light:focus,button.bg-light:hover{background-color:#dae0e5!important}.bg-dark{background-color:#343a40!important}a.bg-dark:focus,a.bg-dark:hover,button.bg-dark:focus,button.bg-dark:hover{background-color:#1d2124!important}.bg-white{background-color:#fff!important}.bg-transparent{background-color:transparent!important}.border{border:1px solid #dee2e6!important}.border-top{border-top:1px solid #dee2e6!important}.border-right{border-right:1px solid #dee2e6!important}.border-bottom{border-bottom:1px solid #dee2e6!important}.border-left{border-left:1px solid #dee2e6!important}.border-0{border:0!important}.border-top-0{border-top:0!important}.border-right-0{border-right:0!important}.border-bottom-0{border-bottom:0!important}.border-left-0{border-left:0!important}.border-primary{border-color:#007bff!important}.border-secondary{border-color:#6c757d!important}.border-success{border-color:#28a745!important}.border-info{border-color:#17a2b8!important}.border-warning{border-color:#ffc107!important}.border-danger{border-color:#dc3545!important}.border-light{border-color:#f8f9fa!important}.border-dark{border-color:#343a40!important}.border-white{border-color:#fff!important}.rounded-sm{border-radius:.2rem!important}.rounded{border-radius:.25rem!important}.rounded-top{border-top-left-radius:.25rem!important;border-top-right-radius:.25rem!important}.rounded-right{border-top-right-radius:.25rem!important;border-bottom-right-radius:.25rem!important}.rounded-bottom{border-bottom-right-radius:.25rem!important;border-bottom-left-radius:.25rem!important}.rounded-left{border-top-left-radius:.25rem!important;border-bottom-left-radius:.25rem!important}.rounded-lg{border-radius:.3rem!important}.rounded-circle{border-radius:50%!important}.rounded-pill{border-radius:50rem!important}.rounded-0{border-radius:0!important}.clearfix::after{display:block;clear:both;content:""}.d-none{display:none!important}.d-inline{display:inline!important}.d-inline-block{display:inline-block!important}.d-block{display:block!important}.d-table{display:table!important}.d-table-row{display:table-row!important}.d-table-cell{display:table-cell!important}.d-flex{display:-ms-flexbox!important;display:flex!important}.d-inline-flex{display:-ms-inline-flexbox!important;display:inline-flex!important}@media (min-width:576px){.d-sm-none{display:none!important}.d-sm-inline{display:inline!important}.d-sm-inline-block{display:inline-block!important}.d-sm-block{display:block!important}.d-sm-table{display:table!important}.d-sm-table-row{display:table-row!important}.d-sm-table-cell{display:table-cell!important}.d-sm-flex{display:-ms-flexbox!important;display:flex!important}.d-sm-inline-flex{display:-ms-inline-flexbox!important;display:inline-flex!important}}@media (min-width:768px){.d-md-none{display:none!important}.d-md-inline{display:inline!important}.d-md-inline-block{display:inline-block!important}.d-md-block{display:block!important}.d-md-table{display:table!important}.d-md-table-row{display:table-row!important}.d-md-table-cell{display:table-cell!important}.d-md-flex{display:-ms-flexbox!important;display:flex!important}.d-md-inline-flex{display:-ms-inline-flexbox!important;display:inline-flex!important}}@media (min-width:992px){.d-lg-none{display:none!important}.d-lg-inline{display:inline!important}.d-lg-inline-block{display:inline-block!important}.d-lg-block{display:block!important}.d-lg-table{display:table!important}.d-lg-table-row{display:table-row!important}.d-lg-table-cell{display:table-cell!important}.d-lg-flex{display:-ms-flexbox!important;display:flex!important}.d-lg-inline-flex{display:-ms-inline-flexbox!important;display:inline-flex!important}}@media (min-width:1200px){.d-xl-none{display:none!important}.d-xl-inline{display:inline!important}.d-xl-inline-block{display:inline-block!important}.d-xl-block{display:block!important}.d-xl-table{display:table!important}.d-xl-table-row{display:table-row!important}.d-xl-table-cell{display:table-cell!important}.d-xl-flex{display:-ms-flexbox!important;display:flex!important}.d-xl-inline-flex{display:-ms-inline-flexbox!important;display:inline-flex!important}}@media print{.d-print-none{display:none!important}.d-print-inline{display:inline!important}.d-print-inline-block{display:inline-block!important}.d-print-block{display:block!important}.d-print-table{display:table!important}.d-print-table-row{display:table-row!important}.d-print-table-cell{display:table-cell!important}.d-print-flex{display:-ms-flexbox!important;display:flex!important}.d-print-inline-flex{display:-ms-inline-flexbox!important;display:inline-flex!important}}.embed-responsive{position:relative;display:block;width:100%;padding:0;overflow:hidden}.embed-responsive::before{display:block;content:""}.embed-responsive .embed-responsive-item,.embed-responsive embed,.embed-responsive iframe,.embed-responsive object,.embed-responsive video{position:absolute;top:0;bottom:0;left:0;width:100%;height:100%;border:0}.embed-responsive-21by9::before{padding-top:42.857143%}.embed-responsive-16by9::before{padding-top:56.25%}.embed-responsive-4by3::before{padding-top:75%}.embed-responsive-1by1::before{padding-top:100%}.flex-row{-ms-flex-direction:row!important;flex-direction:row!important}.flex-column{-ms-flex-direction:column!important;flex-direction:column!important}.flex-row-reverse{-ms-flex-direction:row-reverse!important;flex-direction:row-reverse!important}.flex-column-reverse{-ms-flex-direction:column-reverse!important;flex-direction:column-reverse!important}.flex-wrap{-ms-flex-wrap:wrap!important;flex-wrap:wrap!important}.flex-nowrap{-ms-flex-wrap:nowrap!important;flex-wrap:nowrap!important}.flex-wrap-reverse{-ms-flex-wrap:wrap-reverse!important;flex-wrap:wrap-reverse!important}.flex-fill{-ms-flex:1 1 auto!important;flex:1 1 auto!important}.flex-grow-0{-ms-flex-positive:0!important;flex-grow:0!important}.flex-grow-1{-ms-flex-positive:1!important;flex-grow:1!important}.flex-shrink-0{-ms-flex-negative:0!important;flex-shrink:0!important}.flex-shrink-1{-ms-flex-negative:1!important;flex-shrink:1!important}.justify-content-start{-ms-flex-pack:start!important;justify-content:flex-start!important}.justify-content-end{-ms-flex-pack:end!important;justify-content:flex-end!important}.justify-content-center{-ms-flex-pack:center!important;justify-content:center!important}.justify-content-between{-ms-flex-pack:justify!important;justify-content:space-between!important}.justify-content-around{-ms-flex-pack:distribute!important;justify-content:space-around!important}.align-items-start{-ms-flex-align:start!important;align-items:flex-start!important}.align-items-end{-ms-flex-align:end!important;align-items:flex-end!important}.align-items-center{-ms-flex-align:center!important;align-items:center!important}.align-items-baseline{-ms-flex-align:baseline!important;align-items:baseline!important}.align-items-stretch{-ms-flex-align:stretch!important;align-items:stretch!important}.align-content-start{-ms-flex-line-pack:start!important;align-content:flex-start!important}.align-content-end{-ms-flex-line-pack:end!important;align-content:flex-end!important}.align-content-center{-ms-flex-line-pack:center!important;align-content:center!important}.align-content-between{-ms-flex-line-pack:justify!important;align-content:space-between!important}.align-content-around{-ms-flex-line-pack:distribute!important;align-content:space-around!important}.align-content-stretch{-ms-flex-line-pack:stretch!important;align-content:stretch!important}.align-self-auto{-ms-flex-item-align:auto!important;align-self:auto!important}.align-self-start{-ms-flex-item-align:start!important;align-self:flex-start!important}.align-self-end{-ms-flex-item-align:end!important;align-self:flex-end!important}.align-self-center{-ms-flex-item-align:center!important;align-self:center!important}.align-self-baseline{-ms-flex-item-align:baseline!important;align-self:baseline!important}.align-self-stretch{-ms-flex-item-align:stretch!important;align-self:stretch!important}@media (min-width:576px){.flex-sm-row{-ms-flex-direction:row!important;flex-direction:row!important}.flex-sm-column{-ms-flex-direction:column!important;flex-direction:column!important}.flex-sm-row-reverse{-ms-flex-direction:row-reverse!important;flex-direction:row-reverse!important}.flex-sm-column-reverse{-ms-flex-direction:column-reverse!important;flex-direction:column-reverse!important}.flex-sm-wrap{-ms-flex-wrap:wrap!important;flex-wrap:wrap!important}.flex-sm-nowrap{-ms-flex-wrap:nowrap!important;flex-wrap:nowrap!important}.flex-sm-wrap-reverse{-ms-flex-wrap:wrap-reverse!important;flex-wrap:wrap-reverse!important}.flex-sm-fill{-ms-flex:1 1 auto!important;flex:1 1 auto!important}.flex-sm-grow-0{-ms-flex-positive:0!important;flex-grow:0!important}.flex-sm-grow-1{-ms-flex-positive:1!important;flex-grow:1!important}.flex-sm-shrink-0{-ms-flex-negative:0!important;flex-shrink:0!important}.flex-sm-shrink-1{-ms-flex-negative:1!important;flex-shrink:1!important}.justify-content-sm-start{-ms-flex-pack:start!important;justify-content:flex-start!important}.justify-content-sm-end{-ms-flex-pack:end!important;justify-content:flex-end!important}.justify-content-sm-center{-ms-flex-pack:center!important;justify-content:center!important}.justify-content-sm-between{-ms-flex-pack:justify!important;justify-content:space-between!important}.justify-content-sm-around{-ms-flex-pack:distribute!important;justify-content:space-around!important}.align-items-sm-start{-ms-flex-align:start!important;align-items:flex-start!important}.align-items-sm-end{-ms-flex-align:end!important;align-items:flex-end!important}.align-items-sm-center{-ms-flex-align:center!important;align-items:center!important}.align-items-sm-baseline{-ms-flex-align:baseline!important;align-items:baseline!important}.align-items-sm-stretch{-ms-flex-align:stretch!important;align-items:stretch!important}.align-content-sm-start{-ms-flex-line-pack:start!important;align-content:flex-start!important}.align-content-sm-end{-ms-flex-line-pack:end!important;align-content:flex-end!important}.align-content-sm-center{-ms-flex-line-pack:center!important;align-content:center!important}.align-content-sm-between{-ms-flex-line-pack:justify!important;align-content:space-between!important}.align-content-sm-around{-ms-flex-line-pack:distribute!important;align-content:space-around!important}.align-content-sm-stretch{-ms-flex-line-pack:stretch!important;align-content:stretch!important}.align-self-sm-auto{-ms-flex-item-align:auto!important;align-self:auto!important}.align-self-sm-start{-ms-flex-item-align:start!important;align-self:flex-start!important}.align-self-sm-end{-ms-flex-item-align:end!important;align-self:flex-end!important}.align-self-sm-center{-ms-flex-item-align:center!important;align-self:center!important}.align-self-sm-baseline{-ms-flex-item-align:baseline!important;align-self:baseline!important}.align-self-sm-stretch{-ms-flex-item-align:stretch!important;align-self:stretch!important}}@media (min-width:768px){.flex-md-row{-ms-flex-direction:row!important;flex-direction:row!important}.flex-md-column{-ms-flex-direction:column!important;flex-direction:column!important}.flex-md-row-reverse{-ms-flex-direction:row-reverse!important;flex-direction:row-reverse!important}.flex-md-column-reverse{-ms-flex-direction:column-reverse!important;flex-direction:column-reverse!important}.flex-md-wrap{-ms-flex-wrap:wrap!important;flex-wrap:wrap!important}.flex-md-nowrap{-ms-flex-wrap:nowrap!important;flex-wrap:nowrap!important}.flex-md-wrap-reverse{-ms-flex-wrap:wrap-reverse!important;flex-wrap:wrap-reverse!important}.flex-md-fill{-ms-flex:1 1 auto!important;flex:1 1 auto!important}.flex-md-grow-0{-ms-flex-positive:0!important;flex-grow:0!important}.flex-md-grow-1{-ms-flex-positive:1!important;flex-grow:1!important}.flex-md-shrink-0{-ms-flex-negative:0!important;flex-shrink:0!important}.flex-md-shrink-1{-ms-flex-negative:1!important;flex-shrink:1!important}.justify-content-md-start{-ms-flex-pack:start!important;justify-content:flex-start!important}.justify-content-md-end{-ms-flex-pack:end!important;justify-content:flex-end!important}.justify-content-md-center{-ms-flex-pack:center!important;justify-content:center!important}.justify-content-md-between{-ms-flex-pack:justify!important;justify-content:space-between!important}.justify-content-md-around{-ms-flex-pack:distribute!important;justify-content:space-around!important}.align-items-md-start{-ms-flex-align:start!important;align-items:flex-start!important}.align-items-md-end{-ms-flex-align:end!important;align-items:flex-end!important}.align-items-md-center{-ms-flex-align:center!important;align-items:center!important}.align-items-md-baseline{-ms-flex-align:baseline!important;align-items:baseline!important}.align-items-md-stretch{-ms-flex-align:stretch!important;align-items:stretch!important}.align-content-md-start{-ms-flex-line-pack:start!important;align-content:flex-start!important}.align-content-md-end{-ms-flex-line-pack:end!important;align-content:flex-end!important}.align-content-md-center{-ms-flex-line-pack:center!important;align-content:center!important}.align-content-md-between{-ms-flex-line-pack:justify!important;align-content:space-between!important}.align-content-md-around{-ms-flex-line-pack:distribute!important;align-content:space-around!important}.align-content-md-stretch{-ms-flex-line-pack:stretch!important;align-content:stretch!important}.align-self-md-auto{-ms-flex-item-align:auto!important;align-self:auto!important}.align-self-md-start{-ms-flex-item-align:start!important;align-self:flex-start!important}.align-self-md-end{-ms-flex-item-align:end!important;align-self:flex-end!important}.align-self-md-center{-ms-flex-item-align:center!important;align-self:center!important}.align-self-md-baseline{-ms-flex-item-align:baseline!important;align-self:baseline!important}.align-self-md-stretch{-ms-flex-item-align:stretch!important;align-self:stretch!important}}@media (min-width:992px){.flex-lg-row{-ms-flex-direction:row!important;flex-direction:row!important}.flex-lg-column{-ms-flex-direction:column!important;flex-direction:column!important}.flex-lg-row-reverse{-ms-flex-direction:row-reverse!important;flex-direction:row-reverse!important}.flex-lg-column-reverse{-ms-flex-direction:column-reverse!important;flex-direction:column-reverse!important}.flex-lg-wrap{-ms-flex-wrap:wrap!important;flex-wrap:wrap!important}.flex-lg-nowrap{-ms-flex-wrap:nowrap!important;flex-wrap:nowrap!important}.flex-lg-wrap-reverse{-ms-flex-wrap:wrap-reverse!important;flex-wrap:wrap-reverse!important}.flex-lg-fill{-ms-flex:1 1 auto!important;flex:1 1 auto!important}.flex-lg-grow-0{-ms-flex-positive:0!important;flex-grow:0!important}.flex-lg-grow-1{-ms-flex-positive:1!important;flex-grow:1!important}.flex-lg-shrink-0{-ms-flex-negative:0!important;flex-shrink:0!important}.flex-lg-shrink-1{-ms-flex-negative:1!important;flex-shrink:1!important}.justify-content-lg-start{-ms-flex-pack:start!important;justify-content:flex-start!important}.justify-content-lg-end{-ms-flex-pack:end!important;justify-content:flex-end!important}.justify-content-lg-center{-ms-flex-pack:center!important;justify-content:center!important}.justify-content-lg-between{-ms-flex-pack:justify!important;justify-content:space-between!important}.justify-content-lg-around{-ms-flex-pack:distribute!important;justify-content:space-around!important}.align-items-lg-start{-ms-flex-align:start!important;align-items:flex-start!important}.align-items-lg-end{-ms-flex-align:end!important;align-items:flex-end!important}.align-items-lg-center{-ms-flex-align:center!important;align-items:center!important}.align-items-lg-baseline{-ms-flex-align:baseline!important;align-items:baseline!important}.align-items-lg-stretch{-ms-flex-align:stretch!important;align-items:stretch!important}.align-content-lg-start{-ms-flex-line-pack:start!important;align-content:flex-start!important}.align-content-lg-end{-ms-flex-line-pack:end!important;align-content:flex-end!important}.align-content-lg-center{-ms-flex-line-pack:center!important;align-content:center!important}.align-content-lg-between{-ms-flex-line-pack:justify!important;align-content:space-between!important}.align-content-lg-around{-ms-flex-line-pack:distribute!important;align-content:space-around!important}.align-content-lg-stretch{-ms-flex-line-pack:stretch!important;align-content:stretch!important}.align-self-lg-auto{-ms-flex-item-align:auto!important;align-self:auto!important}.align-self-lg-start{-ms-flex-item-align:start!important;align-self:flex-start!important}.align-self-lg-end{-ms-flex-item-align:end!important;align-self:flex-end!important}.align-self-lg-center{-ms-flex-item-align:center!important;align-self:center!important}.align-self-lg-baseline{-ms-flex-item-align:baseline!important;align-self:baseline!important}.align-self-lg-stretch{-ms-flex-item-align:stretch!important;align-self:stretch!important}}@media (min-width:1200px){.flex-xl-row{-ms-flex-direction:row!important;flex-direction:row!important}.flex-xl-column{-ms-flex-direction:column!important;flex-direction:column!important}.flex-xl-row-reverse{-ms-flex-direction:row-reverse!important;flex-direction:row-reverse!important}.flex-xl-column-reverse{-ms-flex-direction:column-reverse!important;flex-direction:column-reverse!important}.flex-xl-wrap{-ms-flex-wrap:wrap!important;flex-wrap:wrap!important}.flex-xl-nowrap{-ms-flex-wrap:nowrap!important;flex-wrap:nowrap!important}.flex-xl-wrap-reverse{-ms-flex-wrap:wrap-reverse!important;flex-wrap:wrap-reverse!important}.flex-xl-fill{-ms-flex:1 1 auto!important;flex:1 1 auto!important}.flex-xl-grow-0{-ms-flex-positive:0!important;flex-grow:0!important}.flex-xl-grow-1{-ms-flex-positive:1!important;flex-grow:1!important}.flex-xl-shrink-0{-ms-flex-negative:0!important;flex-shrink:0!important}.flex-xl-shrink-1{-ms-flex-negative:1!important;flex-shrink:1!important}.justify-content-xl-start{-ms-flex-pack:start!important;justify-content:flex-start!important}.justify-content-xl-end{-ms-flex-pack:end!important;justify-content:flex-end!important}.justify-content-xl-center{-ms-flex-pack:center!important;justify-content:center!important}.justify-content-xl-between{-ms-flex-pack:justify!important;justify-content:space-between!important}.justify-content-xl-around{-ms-flex-pack:distribute!important;justify-content:space-around!important}.align-items-xl-start{-ms-flex-align:start!important;align-items:flex-start!important}.align-items-xl-end{-ms-flex-align:end!important;align-items:flex-end!important}.align-items-xl-center{-ms-flex-align:center!important;align-items:center!important}.align-items-xl-baseline{-ms-flex-align:baseline!important;align-items:baseline!important}.align-items-xl-stretch{-ms-flex-align:stretch!important;align-items:stretch!important}.align-content-xl-start{-ms-flex-line-pack:start!important;align-content:flex-start!important}.align-content-xl-end{-ms-flex-line-pack:end!important;align-content:flex-end!important}.align-content-xl-center{-ms-flex-line-pack:center!important;align-content:center!important}.align-content-xl-between{-ms-flex-line-pack:justify!important;align-content:space-between!important}.align-content-xl-around{-ms-flex-line-pack:distribute!important;align-content:space-around!important}.align-content-xl-stretch{-ms-flex-line-pack:stretch!important;align-content:stretch!important}.align-self-xl-auto{-ms-flex-item-align:auto!important;align-self:auto!important}.align-self-xl-start{-ms-flex-item-align:start!important;align-self:flex-start!important}.align-self-xl-end{-ms-flex-item-align:end!important;align-self:flex-end!important}.align-self-xl-center{-ms-flex-item-align:center!important;align-self:center!important}.align-self-xl-baseline{-ms-flex-item-align:baseline!important;align-self:baseline!important}.align-self-xl-stretch{-ms-flex-item-align:stretch!important;align-self:stretch!important}}.float-left{float:left!important}.float-right{float:right!important}.float-none{float:none!important}@media (min-width:576px){.float-sm-left{float:left!important}.float-sm-right{float:right!important}.float-sm-none{float:none!important}}@media (min-width:768px){.float-md-left{float:left!important}.float-md-right{float:right!important}.float-md-none{float:none!important}}@media (min-width:992px){.float-lg-left{float:left!important}.float-lg-right{float:right!important}.float-lg-none{float:none!important}}@media (min-width:1200px){.float-xl-left{float:left!important}.float-xl-right{float:right!important}.float-xl-none{float:none!important}}.user-select-all{-webkit-user-select:all!important;-moz-user-select:all!important;user-select:all!important}.user-select-auto{-webkit-user-select:auto!important;-moz-user-select:auto!important;-ms-user-select:auto!important;user-select:auto!important}.user-select-none{-webkit-user-select:none!important;-moz-user-select:none!important;-ms-user-select:none!important;user-select:none!important}.overflow-auto{overflow:auto!important}.overflow-hidden{overflow:hidden!important}.position-static{position:static!important}.position-relative{position:relative!important}.position-absolute{position:absolute!important}.position-fixed{position:fixed!important}.position-sticky{position:-webkit-sticky!important;position:sticky!important}.fixed-top{position:fixed;top:0;right:0;left:0;z-index:1030}.fixed-bottom{position:fixed;right:0;bottom:0;left:0;z-index:1030}@supports ((position:-webkit-sticky) or (position:sticky)){.sticky-top{position:-webkit-sticky;position:sticky;top:0;z-index:1020}}.sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}.sr-only-focusable:active,.sr-only-focusable:focus{position:static;width:auto;height:auto;overflow:visible;clip:auto;white-space:normal}.shadow-sm{box-shadow:0 .125rem .25rem rgba(0,0,0,.075)!important}.shadow{box-shadow:0 .5rem 1rem rgba(0,0,0,.15)!important}.shadow-lg{box-shadow:0 1rem 3rem rgba(0,0,0,.175)!important}.shadow-none{box-shadow:none!important}.w-25{width:25%!important}.w-50{width:50%!important}.w-75{width:75%!important}.w-100{width:100%!important}.w-auto{width:auto!important}.h-25{height:25%!important}.h-50{height:50%!important}.h-75{height:75%!important}.h-100{height:100%!important}.h-auto{height:auto!important}.mw-100{max-width:100%!important}.mh-100{max-height:100%!important}.min-vw-100{min-width:100vw!important}.min-vh-100{min-height:100vh!important}.vw-100{width:100vw!important}.vh-100{height:100vh!important}.m-0{margin:0!important}.mt-0,.my-0{margin-top:0!important}.mr-0,.mx-0{margin-right:0!important}.mb-0,.my-0{margin-bottom:0!important}.ml-0,.mx-0{margin-left:0!important}.m-1{margin:.25rem!important}.mt-1,.my-1{margin-top:.25rem!important}.mr-1,.mx-1{margin-right:.25rem!important}.mb-1,.my-1{margin-bottom:.25rem!important}.ml-1,.mx-1{margin-left:.25rem!important}.m-2{margin:.5rem!important}.mt-2,.my-2{margin-top:.5rem!important}.mr-2,.mx-2{margin-right:.5rem!important}.mb-2,.my-2{margin-bottom:.5rem!important}.ml-2,.mx-2{margin-left:.5rem!important}.m-3{margin:1rem!important}.mt-3,.my-3{margin-top:1rem!important}.mr-3,.mx-3{margin-right:1rem!important}.mb-3,.my-3{margin-bottom:1rem!important}.ml-3,.mx-3{margin-left:1rem!important}.m-4{margin:1.5rem!important}.mt-4,.my-4{margin-top:1.5rem!important}.mr-4,.mx-4{margin-right:1.5rem!important}.mb-4,.my-4{margin-bottom:1.5rem!important}.ml-4,.mx-4{margin-left:1.5rem!important}.m-5{margin:3rem!important}.mt-5,.my-5{margin-top:3rem!important}.mr-5,.mx-5{margin-right:3rem!important}.mb-5,.my-5{margin-bottom:3rem!important}.ml-5,.mx-5{margin-left:3rem!important}.p-0{padding:0!important}.pt-0,.py-0{padding-top:0!important}.pr-0,.px-0{padding-right:0!important}.pb-0,.py-0{padding-bottom:0!important}.pl-0,.px-0{padding-left:0!important}.p-1{padding:.25rem!important}.pt-1,.py-1{padding-top:.25rem!important}.pr-1,.px-1{padding-right:.25rem!important}.pb-1,.py-1{padding-bottom:.25rem!important}.pl-1,.px-1{padding-left:.25rem!important}.p-2{padding:.5rem!important}.pt-2,.py-2{padding-top:.5rem!important}.pr-2,.px-2{padding-right:.5rem!important}.pb-2,.py-2{padding-bottom:.5rem!important}.pl-2,.px-2{padding-left:.5rem!important}.p-3{padding:1rem!important}.pt-3,.py-3{padding-top:1rem!important}.pr-3,.px-3{padding-right:1rem!important}.pb-3,.py-3{padding-bottom:1rem!important}.pl-3,.px-3{padding-left:1rem!important}.p-4{padding:1.5rem!important}.pt-4,.py-4{padding-top:1.5rem!important}.pr-4,.px-4{padding-right:1.5rem!important}.pb-4,.py-4{padding-bottom:1.5rem!important}.pl-4,.px-4{padding-left:1.5rem!important}.p-5{padding:3rem!important}.pt-5,.py-5{padding-top:3rem!important}.pr-5,.px-5{padding-right:3rem!important}.pb-5,.py-5{padding-bottom:3rem!important}.pl-5,.px-5{padding-left:3rem!important}.m-n1{margin:-.25rem!important}.mt-n1,.my-n1{margin-top:-.25rem!important}.mr-n1,.mx-n1{margin-right:-.25rem!important}.mb-n1,.my-n1{margin-bottom:-.25rem!important}.ml-n1,.mx-n1{margin-left:-.25rem!important}.m-n2{margin:-.5rem!important}.mt-n2,.my-n2{margin-top:-.5rem!important}.mr-n2,.mx-n2{margin-right:-.5rem!important}.mb-n2,.my-n2{margin-bottom:-.5rem!important}.ml-n2,.mx-n2{margin-left:-.5rem!important}.m-n3{margin:-1rem!important}.mt-n3,.my-n3{margin-top:-1rem!important}.mr-n3,.mx-n3{margin-right:-1rem!important}.mb-n3,.my-n3{margin-bottom:-1rem!important}.ml-n3,.mx-n3{margin-left:-1rem!important}.m-n4{margin:-1.5rem!important}.mt-n4,.my-n4{margin-top:-1.5rem!important}.mr-n4,.mx-n4{margin-right:-1.5rem!important}.mb-n4,.my-n4{margin-bottom:-1.5rem!important}.ml-n4,.mx-n4{margin-left:-1.5rem!important}.m-n5{margin:-3rem!important}.mt-n5,.my-n5{margin-top:-3rem!important}.mr-n5,.mx-n5{margin-right:-3rem!important}.mb-n5,.my-n5{margin-bottom:-3rem!important}.ml-n5,.mx-n5{margin-left:-3rem!important}.m-auto{margin:auto!important}.mt-auto,.my-auto{margin-top:auto!important}.mr-auto,.mx-auto{margin-right:auto!important}.mb-auto,.my-auto{margin-bottom:auto!important}.ml-auto,.mx-auto{margin-left:auto!important}@media (min-width:576px){.m-sm-0{margin:0!important}.mt-sm-0,.my-sm-0{margin-top:0!important}.mr-sm-0,.mx-sm-0{margin-right:0!important}.mb-sm-0,.my-sm-0{margin-bottom:0!important}.ml-sm-0,.mx-sm-0{margin-left:0!important}.m-sm-1{margin:.25rem!important}.mt-sm-1,.my-sm-1{margin-top:.25rem!important}.mr-sm-1,.mx-sm-1{margin-right:.25rem!important}.mb-sm-1,.my-sm-1{margin-bottom:.25rem!important}.ml-sm-1,.mx-sm-1{margin-left:.25rem!important}.m-sm-2{margin:.5rem!important}.mt-sm-2,.my-sm-2{margin-top:.5rem!important}.mr-sm-2,.mx-sm-2{margin-right:.5rem!important}.mb-sm-2,.my-sm-2{margin-bottom:.5rem!important}.ml-sm-2,.mx-sm-2{margin-left:.5rem!important}.m-sm-3{margin:1rem!important}.mt-sm-3,.my-sm-3{margin-top:1rem!important}.mr-sm-3,.mx-sm-3{margin-right:1rem!important}.mb-sm-3,.my-sm-3{margin-bottom:1rem!important}.ml-sm-3,.mx-sm-3{margin-left:1rem!important}.m-sm-4{margin:1.5rem!important}.mt-sm-4,.my-sm-4{margin-top:1.5rem!important}.mr-sm-4,.mx-sm-4{margin-right:1.5rem!important}.mb-sm-4,.my-sm-4{margin-bottom:1.5rem!important}.ml-sm-4,.mx-sm-4{margin-left:1.5rem!important}.m-sm-5{margin:3rem!important}.mt-sm-5,.my-sm-5{margin-top:3rem!important}.mr-sm-5,.mx-sm-5{margin-right:3rem!important}.mb-sm-5,.my-sm-5{margin-bottom:3rem!important}.ml-sm-5,.mx-sm-5{margin-left:3rem!important}.p-sm-0{padding:0!important}.pt-sm-0,.py-sm-0{padding-top:0!important}.pr-sm-0,.px-sm-0{padding-right:0!important}.pb-sm-0,.py-sm-0{padding-bottom:0!important}.pl-sm-0,.px-sm-0{padding-left:0!important}.p-sm-1{padding:.25rem!important}.pt-sm-1,.py-sm-1{padding-top:.25rem!important}.pr-sm-1,.px-sm-1{padding-right:.25rem!important}.pb-sm-1,.py-sm-1{padding-bottom:.25rem!important}.pl-sm-1,.px-sm-1{padding-left:.25rem!important}.p-sm-2{padding:.5rem!important}.pt-sm-2,.py-sm-2{padding-top:.5rem!important}.pr-sm-2,.px-sm-2{padding-right:.5rem!important}.pb-sm-2,.py-sm-2{padding-bottom:.5rem!important}.pl-sm-2,.px-sm-2{padding-left:.5rem!important}.p-sm-3{padding:1rem!important}.pt-sm-3,.py-sm-3{padding-top:1rem!important}.pr-sm-3,.px-sm-3{padding-right:1rem!important}.pb-sm-3,.py-sm-3{padding-bottom:1rem!important}.pl-sm-3,.px-sm-3{padding-left:1rem!important}.p-sm-4{padding:1.5rem!important}.pt-sm-4,.py-sm-4{padding-top:1.5rem!important}.pr-sm-4,.px-sm-4{padding-right:1.5rem!important}.pb-sm-4,.py-sm-4{padding-bottom:1.5rem!important}.pl-sm-4,.px-sm-4{padding-left:1.5rem!important}.p-sm-5{padding:3rem!important}.pt-sm-5,.py-sm-5{padding-top:3rem!important}.pr-sm-5,.px-sm-5{padding-right:3rem!important}.pb-sm-5,.py-sm-5{padding-bottom:3rem!important}.pl-sm-5,.px-sm-5{padding-left:3rem!important}.m-sm-n1{margin:-.25rem!important}.mt-sm-n1,.my-sm-n1{margin-top:-.25rem!important}.mr-sm-n1,.mx-sm-n1{margin-right:-.25rem!important}.mb-sm-n1,.my-sm-n1{margin-bottom:-.25rem!important}.ml-sm-n1,.mx-sm-n1{margin-left:-.25rem!important}.m-sm-n2{margin:-.5rem!important}.mt-sm-n2,.my-sm-n2{margin-top:-.5rem!important}.mr-sm-n2,.mx-sm-n2{margin-right:-.5rem!important}.mb-sm-n2,.my-sm-n2{margin-bottom:-.5rem!important}.ml-sm-n2,.mx-sm-n2{margin-left:-.5rem!important}.m-sm-n3{margin:-1rem!important}.mt-sm-n3,.my-sm-n3{margin-top:-1rem!important}.mr-sm-n3,.mx-sm-n3{margin-right:-1rem!important}.mb-sm-n3,.my-sm-n3{margin-bottom:-1rem!important}.ml-sm-n3,.mx-sm-n3{margin-left:-1rem!important}.m-sm-n4{margin:-1.5rem!important}.mt-sm-n4,.my-sm-n4{margin-top:-1.5rem!important}.mr-sm-n4,.mx-sm-n4{margin-right:-1.5rem!important}.mb-sm-n4,.my-sm-n4{margin-bottom:-1.5rem!important}.ml-sm-n4,.mx-sm-n4{margin-left:-1.5rem!important}.m-sm-n5{margin:-3rem!important}.mt-sm-n5,.my-sm-n5{margin-top:-3rem!important}.mr-sm-n5,.mx-sm-n5{margin-right:-3rem!important}.mb-sm-n5,.my-sm-n5{margin-bottom:-3rem!important}.ml-sm-n5,.mx-sm-n5{margin-left:-3rem!important}.m-sm-auto{margin:auto!important}.mt-sm-auto,.my-sm-auto{margin-top:auto!important}.mr-sm-auto,.mx-sm-auto{margin-right:auto!important}.mb-sm-auto,.my-sm-auto{margin-bottom:auto!important}.ml-sm-auto,.mx-sm-auto{margin-left:auto!important}}@media (min-width:768px){.m-md-0{margin:0!important}.mt-md-0,.my-md-0{margin-top:0!important}.mr-md-0,.mx-md-0{margin-right:0!important}.mb-md-0,.my-md-0{margin-bottom:0!important}.ml-md-0,.mx-md-0{margin-left:0!important}.m-md-1{margin:.25rem!important}.mt-md-1,.my-md-1{margin-top:.25rem!important}.mr-md-1,.mx-md-1{margin-right:.25rem!important}.mb-md-1,.my-md-1{margin-bottom:.25rem!important}.ml-md-1,.mx-md-1{margin-left:.25rem!important}.m-md-2{margin:.5rem!important}.mt-md-2,.my-md-2{margin-top:.5rem!important}.mr-md-2,.mx-md-2{margin-right:.5rem!important}.mb-md-2,.my-md-2{margin-bottom:.5rem!important}.ml-md-2,.mx-md-2{margin-left:.5rem!important}.m-md-3{margin:1rem!important}.mt-md-3,.my-md-3{margin-top:1rem!important}.mr-md-3,.mx-md-3{margin-right:1rem!important}.mb-md-3,.my-md-3{margin-bottom:1rem!important}.ml-md-3,.mx-md-3{margin-left:1rem!important}.m-md-4{margin:1.5rem!important}.mt-md-4,.my-md-4{margin-top:1.5rem!important}.mr-md-4,.mx-md-4{margin-right:1.5rem!important}.mb-md-4,.my-md-4{margin-bottom:1.5rem!important}.ml-md-4,.mx-md-4{margin-left:1.5rem!important}.m-md-5{margin:3rem!important}.mt-md-5,.my-md-5{margin-top:3rem!important}.mr-md-5,.mx-md-5{margin-right:3rem!important}.mb-md-5,.my-md-5{margin-bottom:3rem!important}.ml-md-5,.mx-md-5{margin-left:3rem!important}.p-md-0{padding:0!important}.pt-md-0,.py-md-0{padding-top:0!important}.pr-md-0,.px-md-0{padding-right:0!important}.pb-md-0,.py-md-0{padding-bottom:0!important}.pl-md-0,.px-md-0{padding-left:0!important}.p-md-1{padding:.25rem!important}.pt-md-1,.py-md-1{padding-top:.25rem!important}.pr-md-1,.px-md-1{padding-right:.25rem!important}.pb-md-1,.py-md-1{padding-bottom:.25rem!important}.pl-md-1,.px-md-1{padding-left:.25rem!important}.p-md-2{padding:.5rem!important}.pt-md-2,.py-md-2{padding-top:.5rem!important}.pr-md-2,.px-md-2{padding-right:.5rem!important}.pb-md-2,.py-md-2{padding-bottom:.5rem!important}.pl-md-2,.px-md-2{padding-left:.5rem!important}.p-md-3{padding:1rem!important}.pt-md-3,.py-md-3{padding-top:1rem!important}.pr-md-3,.px-md-3{padding-right:1rem!important}.pb-md-3,.py-md-3{padding-bottom:1rem!important}.pl-md-3,.px-md-3{padding-left:1rem!important}.p-md-4{padding:1.5rem!important}.pt-md-4,.py-md-4{padding-top:1.5rem!important}.pr-md-4,.px-md-4{padding-right:1.5rem!important}.pb-md-4,.py-md-4{padding-bottom:1.5rem!important}.pl-md-4,.px-md-4{padding-left:1.5rem!important}.p-md-5{padding:3rem!important}.pt-md-5,.py-md-5{padding-top:3rem!important}.pr-md-5,.px-md-5{padding-right:3rem!important}.pb-md-5,.py-md-5{padding-bottom:3rem!important}.pl-md-5,.px-md-5{padding-left:3rem!important}.m-md-n1{margin:-.25rem!important}.mt-md-n1,.my-md-n1{margin-top:-.25rem!important}.mr-md-n1,.mx-md-n1{margin-right:-.25rem!important}.mb-md-n1,.my-md-n1{margin-bottom:-.25rem!important}.ml-md-n1,.mx-md-n1{margin-left:-.25rem!important}.m-md-n2{margin:-.5rem!important}.mt-md-n2,.my-md-n2{margin-top:-.5rem!important}.mr-md-n2,.mx-md-n2{margin-right:-.5rem!important}.mb-md-n2,.my-md-n2{margin-bottom:-.5rem!important}.ml-md-n2,.mx-md-n2{margin-left:-.5rem!important}.m-md-n3{margin:-1rem!important}.mt-md-n3,.my-md-n3{margin-top:-1rem!important}.mr-md-n3,.mx-md-n3{margin-right:-1rem!important}.mb-md-n3,.my-md-n3{margin-bottom:-1rem!important}.ml-md-n3,.mx-md-n3{margin-left:-1rem!important}.m-md-n4{margin:-1.5rem!important}.mt-md-n4,.my-md-n4{margin-top:-1.5rem!important}.mr-md-n4,.mx-md-n4{margin-right:-1.5rem!important}.mb-md-n4,.my-md-n4{margin-bottom:-1.5rem!important}.ml-md-n4,.mx-md-n4{margin-left:-1.5rem!important}.m-md-n5{margin:-3rem!important}.mt-md-n5,.my-md-n5{margin-top:-3rem!important}.mr-md-n5,.mx-md-n5{margin-right:-3rem!important}.mb-md-n5,.my-md-n5{margin-bottom:-3rem!important}.ml-md-n5,.mx-md-n5{margin-left:-3rem!important}.m-md-auto{margin:auto!important}.mt-md-auto,.my-md-auto{margin-top:auto!important}.mr-md-auto,.mx-md-auto{margin-right:auto!important}.mb-md-auto,.my-md-auto{margin-bottom:auto!important}.ml-md-auto,.mx-md-auto{margin-left:auto!important}}@media (min-width:992px){.m-lg-0{margin:0!important}.mt-lg-0,.my-lg-0{margin-top:0!important}.mr-lg-0,.mx-lg-0{margin-right:0!important}.mb-lg-0,.my-lg-0{margin-bottom:0!important}.ml-lg-0,.mx-lg-0{margin-left:0!important}.m-lg-1{margin:.25rem!important}.mt-lg-1,.my-lg-1{margin-top:.25rem!important}.mr-lg-1,.mx-lg-1{margin-right:.25rem!important}.mb-lg-1,.my-lg-1{margin-bottom:.25rem!important}.ml-lg-1,.mx-lg-1{margin-left:.25rem!important}.m-lg-2{margin:.5rem!important}.mt-lg-2,.my-lg-2{margin-top:.5rem!important}.mr-lg-2,.mx-lg-2{margin-right:.5rem!important}.mb-lg-2,.my-lg-2{margin-bottom:.5rem!important}.ml-lg-2,.mx-lg-2{margin-left:.5rem!important}.m-lg-3{margin:1rem!important}.mt-lg-3,.my-lg-3{margin-top:1rem!important}.mr-lg-3,.mx-lg-3{margin-right:1rem!important}.mb-lg-3,.my-lg-3{margin-bottom:1rem!important}.ml-lg-3,.mx-lg-3{margin-left:1rem!important}.m-lg-4{margin:1.5rem!important}.mt-lg-4,.my-lg-4{margin-top:1.5rem!important}.mr-lg-4,.mx-lg-4{margin-right:1.5rem!important}.mb-lg-4,.my-lg-4{margin-bottom:1.5rem!important}.ml-lg-4,.mx-lg-4{margin-left:1.5rem!important}.m-lg-5{margin:3rem!important}.mt-lg-5,.my-lg-5{margin-top:3rem!important}.mr-lg-5,.mx-lg-5{margin-right:3rem!important}.mb-lg-5,.my-lg-5{margin-bottom:3rem!important}.ml-lg-5,.mx-lg-5{margin-left:3rem!important}.p-lg-0{padding:0!important}.pt-lg-0,.py-lg-0{padding-top:0!important}.pr-lg-0,.px-lg-0{padding-right:0!important}.pb-lg-0,.py-lg-0{padding-bottom:0!important}.pl-lg-0,.px-lg-0{padding-left:0!important}.p-lg-1{padding:.25rem!important}.pt-lg-1,.py-lg-1{padding-top:.25rem!important}.pr-lg-1,.px-lg-1{padding-right:.25rem!important}.pb-lg-1,.py-lg-1{padding-bottom:.25rem!important}.pl-lg-1,.px-lg-1{padding-left:.25rem!important}.p-lg-2{padding:.5rem!important}.pt-lg-2,.py-lg-2{padding-top:.5rem!important}.pr-lg-2,.px-lg-2{padding-right:.5rem!important}.pb-lg-2,.py-lg-2{padding-bottom:.5rem!important}.pl-lg-2,.px-lg-2{padding-left:.5rem!important}.p-lg-3{padding:1rem!important}.pt-lg-3,.py-lg-3{padding-top:1rem!important}.pr-lg-3,.px-lg-3{padding-right:1rem!important}.pb-lg-3,.py-lg-3{padding-bottom:1rem!important}.pl-lg-3,.px-lg-3{padding-left:1rem!important}.p-lg-4{padding:1.5rem!important}.pt-lg-4,.py-lg-4{padding-top:1.5rem!important}.pr-lg-4,.px-lg-4{padding-right:1.5rem!important}.pb-lg-4,.py-lg-4{padding-bottom:1.5rem!important}.pl-lg-4,.px-lg-4{padding-left:1.5rem!important}.p-lg-5{padding:3rem!important}.pt-lg-5,.py-lg-5{padding-top:3rem!important}.pr-lg-5,.px-lg-5{padding-right:3rem!important}.pb-lg-5,.py-lg-5{padding-bottom:3rem!important}.pl-lg-5,.px-lg-5{padding-left:3rem!important}.m-lg-n1{margin:-.25rem!important}.mt-lg-n1,.my-lg-n1{margin-top:-.25rem!important}.mr-lg-n1,.mx-lg-n1{margin-right:-.25rem!important}.mb-lg-n1,.my-lg-n1{margin-bottom:-.25rem!important}.ml-lg-n1,.mx-lg-n1{margin-left:-.25rem!important}.m-lg-n2{margin:-.5rem!important}.mt-lg-n2,.my-lg-n2{margin-top:-.5rem!important}.mr-lg-n2,.mx-lg-n2{margin-right:-.5rem!important}.mb-lg-n2,.my-lg-n2{margin-bottom:-.5rem!important}.ml-lg-n2,.mx-lg-n2{margin-left:-.5rem!important}.m-lg-n3{margin:-1rem!important}.mt-lg-n3,.my-lg-n3{margin-top:-1rem!important}.mr-lg-n3,.mx-lg-n3{margin-right:-1rem!important}.mb-lg-n3,.my-lg-n3{margin-bottom:-1rem!important}.ml-lg-n3,.mx-lg-n3{margin-left:-1rem!important}.m-lg-n4{margin:-1.5rem!important}.mt-lg-n4,.my-lg-n4{margin-top:-1.5rem!important}.mr-lg-n4,.mx-lg-n4{margin-right:-1.5rem!important}.mb-lg-n4,.my-lg-n4{margin-bottom:-1.5rem!important}.ml-lg-n4,.mx-lg-n4{margin-left:-1.5rem!important}.m-lg-n5{margin:-3rem!important}.mt-lg-n5,.my-lg-n5{margin-top:-3rem!important}.mr-lg-n5,.mx-lg-n5{margin-right:-3rem!important}.mb-lg-n5,.my-lg-n5{margin-bottom:-3rem!important}.ml-lg-n5,.mx-lg-n5{margin-left:-3rem!important}.m-lg-auto{margin:auto!important}.mt-lg-auto,.my-lg-auto{margin-top:auto!important}.mr-lg-auto,.mx-lg-auto{margin-right:auto!important}.mb-lg-auto,.my-lg-auto{margin-bottom:auto!important}.ml-lg-auto,.mx-lg-auto{margin-left:auto!important}}@media (min-width:1200px){.m-xl-0{margin:0!important}.mt-xl-0,.my-xl-0{margin-top:0!important}.mr-xl-0,.mx-xl-0{margin-right:0!important}.mb-xl-0,.my-xl-0{margin-bottom:0!important}.ml-xl-0,.mx-xl-0{margin-left:0!important}.m-xl-1{margin:.25rem!important}.mt-xl-1,.my-xl-1{margin-top:.25rem!important}.mr-xl-1,.mx-xl-1{margin-right:.25rem!important}.mb-xl-1,.my-xl-1{margin-bottom:.25rem!important}.ml-xl-1,.mx-xl-1{margin-left:.25rem!important}.m-xl-2{margin:.5rem!important}.mt-xl-2,.my-xl-2{margin-top:.5rem!important}.mr-xl-2,.mx-xl-2{margin-right:.5rem!important}.mb-xl-2,.my-xl-2{margin-bottom:.5rem!important}.ml-xl-2,.mx-xl-2{margin-left:.5rem!important}.m-xl-3{margin:1rem!important}.mt-xl-3,.my-xl-3{margin-top:1rem!important}.mr-xl-3,.mx-xl-3{margin-right:1rem!important}.mb-xl-3,.my-xl-3{margin-bottom:1rem!important}.ml-xl-3,.mx-xl-3{margin-left:1rem!important}.m-xl-4{margin:1.5rem!important}.mt-xl-4,.my-xl-4{margin-top:1.5rem!important}.mr-xl-4,.mx-xl-4{margin-right:1.5rem!important}.mb-xl-4,.my-xl-4{margin-bottom:1.5rem!important}.ml-xl-4,.mx-xl-4{margin-left:1.5rem!important}.m-xl-5{margin:3rem!important}.mt-xl-5,.my-xl-5{margin-top:3rem!important}.mr-xl-5,.mx-xl-5{margin-right:3rem!important}.mb-xl-5,.my-xl-5{margin-bottom:3rem!important}.ml-xl-5,.mx-xl-5{margin-left:3rem!important}.p-xl-0{padding:0!important}.pt-xl-0,.py-xl-0{padding-top:0!important}.pr-xl-0,.px-xl-0{padding-right:0!important}.pb-xl-0,.py-xl-0{padding-bottom:0!important}.pl-xl-0,.px-xl-0{padding-left:0!important}.p-xl-1{padding:.25rem!important}.pt-xl-1,.py-xl-1{padding-top:.25rem!important}.pr-xl-1,.px-xl-1{padding-right:.25rem!important}.pb-xl-1,.py-xl-1{padding-bottom:.25rem!important}.pl-xl-1,.px-xl-1{padding-left:.25rem!important}.p-xl-2{padding:.5rem!important}.pt-xl-2,.py-xl-2{padding-top:.5rem!important}.pr-xl-2,.px-xl-2{padding-right:.5rem!important}.pb-xl-2,.py-xl-2{padding-bottom:.5rem!important}.pl-xl-2,.px-xl-2{padding-left:.5rem!important}.p-xl-3{padding:1rem!important}.pt-xl-3,.py-xl-3{padding-top:1rem!important}.pr-xl-3,.px-xl-3{padding-right:1rem!important}.pb-xl-3,.py-xl-3{padding-bottom:1rem!important}.pl-xl-3,.px-xl-3{padding-left:1rem!important}.p-xl-4{padding:1.5rem!important}.pt-xl-4,.py-xl-4{padding-top:1.5rem!important}.pr-xl-4,.px-xl-4{padding-right:1.5rem!important}.pb-xl-4,.py-xl-4{padding-bottom:1.5rem!important}.pl-xl-4,.px-xl-4{padding-left:1.5rem!important}.p-xl-5{padding:3rem!important}.pt-xl-5,.py-xl-5{padding-top:3rem!important}.pr-xl-5,.px-xl-5{padding-right:3rem!important}.pb-xl-5,.py-xl-5{padding-bottom:3rem!important}.pl-xl-5,.px-xl-5{padding-left:3rem!important}.m-xl-n1{margin:-.25rem!important}.mt-xl-n1,.my-xl-n1{margin-top:-.25rem!important}.mr-xl-n1,.mx-xl-n1{margin-right:-.25rem!important}.mb-xl-n1,.my-xl-n1{margin-bottom:-.25rem!important}.ml-xl-n1,.mx-xl-n1{margin-left:-.25rem!important}.m-xl-n2{margin:-.5rem!important}.mt-xl-n2,.my-xl-n2{margin-top:-.5rem!important}.mr-xl-n2,.mx-xl-n2{margin-right:-.5rem!important}.mb-xl-n2,.my-xl-n2{margin-bottom:-.5rem!important}.ml-xl-n2,.mx-xl-n2{margin-left:-.5rem!important}.m-xl-n3{margin:-1rem!important}.mt-xl-n3,.my-xl-n3{margin-top:-1rem!important}.mr-xl-n3,.mx-xl-n3{margin-right:-1rem!important}.mb-xl-n3,.my-xl-n3{margin-bottom:-1rem!important}.ml-xl-n3,.mx-xl-n3{margin-left:-1rem!important}.m-xl-n4{margin:-1.5rem!important}.mt-xl-n4,.my-xl-n4{margin-top:-1.5rem!important}.mr-xl-n4,.mx-xl-n4{margin-right:-1.5rem!important}.mb-xl-n4,.my-xl-n4{margin-bottom:-1.5rem!important}.ml-xl-n4,.mx-xl-n4{margin-left:-1.5rem!important}.m-xl-n5{margin:-3rem!important}.mt-xl-n5,.my-xl-n5{margin-top:-3rem!important}.mr-xl-n5,.mx-xl-n5{margin-right:-3rem!important}.mb-xl-n5,.my-xl-n5{margin-bottom:-3rem!important}.ml-xl-n5,.mx-xl-n5{margin-left:-3rem!important}.m-xl-auto{margin:auto!important}.mt-xl-auto,.my-xl-auto{margin-top:auto!important}.mr-xl-auto,.mx-xl-auto{margin-right:auto!important}.mb-xl-auto,.my-xl-auto{margin-bottom:auto!important}.ml-xl-auto,.mx-xl-auto{margin-left:auto!important}}.stretched-link::after{position:absolute;top:0;right:0;bottom:0;left:0;z-index:1;pointer-events:auto;content:"";background-color:rgba(0,0,0,0)}.text-monospace{font-family:SFMono-Regular,Menlo,Monaco,Consolas,"Liberation Mono","Courier New",monospace!important}.text-justify{text-align:justify!important}.text-wrap{white-space:normal!important}.text-nowrap{white-space:nowrap!important}.text-truncate{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.text-left{text-align:left!important}.text-right{text-align:right!important}.text-center{text-align:center!important}@media (min-width:576px){.text-sm-left{text-align:left!important}.text-sm-right{text-align:right!important}.text-sm-center{text-align:center!important}}@media (min-width:768px){.text-md-left{text-align:left!important}.text-md-right{text-align:right!important}.text-md-center{text-align:center!important}}@media (min-width:992px){.text-lg-left{text-align:left!important}.text-lg-right{text-align:right!important}.text-lg-center{text-align:center!important}}@media (min-width:1200px){.text-xl-left{text-align:left!important}.text-xl-right{text-align:right!important}.text-xl-center{text-align:center!important}}.text-lowercase{text-transform:lowercase!important}.text-uppercase{text-transform:uppercase!important}.text-capitalize{text-transform:capitalize!important}.font-weight-light{font-weight:300!important}.font-weight-lighter{font-weight:lighter!important}.font-weight-normal{font-weight:400!important}.font-weight-bold{font-weight:700!important}.font-weight-bolder{font-weight:bolder!important}.font-italic{font-style:italic!important}.text-white{color:#fff!important}.text-primary{color:#007bff!important}a.text-primary:focus,a.text-primary:hover{color:#0056b3!important}.text-secondary{color:#6c757d!important}a.text-secondary:focus,a.text-secondary:hover{color:#494f54!important}.text-success{color:#28a745!important}a.text-success:focus,a.text-success:hover{color:#19692c!important}.text-info{color:#17a2b8!important}a.text-info:focus,a.text-info:hover{color:#0f6674!important}.text-warning{color:#ffc107!important}a.text-warning:focus,a.text-warning:hover{color:#ba8b00!important}.text-danger{color:#dc3545!important}a.text-danger:focus,a.text-danger:hover{color:#a71d2a!important}.text-light{color:#f8f9fa!important}a.text-light:focus,a.text-light:hover{color:#cbd3da!important}.text-dark{color:#343a40!important}a.text-dark:focus,a.text-dark:hover{color:#121416!important}.text-body{color:#212529!important}.text-muted{color:#6c757d!important}.text-black-50{color:rgba(0,0,0,.5)!important}.text-white-50{color:rgba(255,255,255,.5)!important}.text-hide{font:0/0 a;color:transparent;text-shadow:none;background-color:transparent;border:0}.text-decoration-none{text-decoration:none!important}.text-break{word-break:break-word!important;word-wrap:break-word!important}.text-reset{color:inherit!important}.visible{visibility:visible!important}.invisible{visibility:hidden!important}@media print{*,::after,::before{text-shadow:none!important;box-shadow:none!important}a:not(.btn){text-decoration:underline}abbr[title]::after{content:" (" attr(title) ")"}pre{white-space:pre-wrap!important}blockquote,pre{border:1px solid #adb5bd;page-break-inside:avoid}thead{display:table-header-group}img,tr{page-break-inside:avoid}h2,h3,p{orphans:3;widows:3}h2,h3{page-break-after:avoid}@page{size:a3}body{min-width:992px!important}.container{min-width:992px!important}.navbar{display:none}.badge{border:1px solid #000}.table{border-collapse:collapse!important}.table td,.table th{background-color:#fff!important}.table-bordered td,.table-bordered th{border:1px solid #dee2e6!important}.table-dark{color:inherit}.table-dark tbody+tbody,.table-dark td,.table-dark th,.table-dark thead th{border-color:#dee2e6}.table .thead-dark th{color:inherit;border-color:#dee2e6}}
/*# sourceMappingURL=bootstrap.min.css.map */
`;

    /**
     * @license
     * Copyright 2017 Google LLC
     * SPDX-License-Identifier: BSD-3-Clause
     */
    const e$3=e=>n=>"function"==typeof n?((e,n)=>(customElements.define(e,n),n))(e,n):((e,n)=>{const{kind:t,elements:s}=n;return {kind:t,elements:s,finisher(n){customElements.define(e,n);}}})(e,n);

    /**
     * @license
     * Copyright 2017 Google LLC
     * SPDX-License-Identifier: BSD-3-Clause
     */
    const i$3=(i,e)=>"method"===e.kind&&e.descriptor&&!("value"in e.descriptor)?{...e,finisher(n){n.createProperty(e.key,i);}}:{kind:"field",key:Symbol(),placement:"own",descriptor:{},originalKey:e.key,initializer(){"function"==typeof e.initializer&&(this[e.key]=e.initializer.call(this));},finisher(n){n.createProperty(e.key,i);}};function e$2(e){return (n,t)=>void 0!==t?((i,e,n)=>{e.constructor.createProperty(n,i);})(e,n,t):i$3(e,n)}

    /**
     * @license
     * Copyright 2017 Google LLC
     * SPDX-License-Identifier: BSD-3-Clause
     */function t$1(t){return e$2({...t,state:!0})}

    /**
     * @license
     * Copyright 2017 Google LLC
     * SPDX-License-Identifier: BSD-3-Clause
     */
    const o$3=({finisher:e,descriptor:t})=>(o,n)=>{var r;if(void 0===n){const n=null!==(r=o.originalKey)&&void 0!==r?r:o.key,i=null!=t?{kind:"method",placement:"prototype",key:n,descriptor:t(o.key)}:{...o,key:n};return null!=e&&(i.finisher=function(t){e(t,n);}),i}{const r=o.constructor;void 0!==t&&Object.defineProperty(o,n,t(n)),null==e||e(r,n);}};

    /**
     * @license
     * Copyright 2017 Google LLC
     * SPDX-License-Identifier: BSD-3-Clause
     */function i$2(i,n){return o$3({descriptor:o=>{const t={get(){var o,n;return null!==(n=null===(o=this.renderRoot)||void 0===o?void 0:o.querySelector(i))&&void 0!==n?n:null},enumerable:!0,configurable:!0};if(n){const n="symbol"==typeof o?Symbol():"__"+o;t.get=function(){var o,t;return void 0===this[n]&&(this[n]=null!==(t=null===(o=this.renderRoot)||void 0===o?void 0:o.querySelector(i))&&void 0!==t?t:null),this[n]};}return t}})}

    /**
     * @license
     * Copyright 2017 Google LLC
     * SPDX-License-Identifier: BSD-3-Clause
     */function e$1(e){return o$3({descriptor:r=>({get(){var r,o;return null!==(o=null===(r=this.renderRoot)||void 0===r?void 0:r.querySelectorAll(e))&&void 0!==o?o:[]},enumerable:!0,configurable:!0})})}

    /**
     * @license
     * Copyright 2021 Google LLC
     * SPDX-License-Identifier: BSD-3-Clause
     */var n$1;null!=(null===(n$1=window.HTMLSlotElement)||void 0===n$1?void 0:n$1.prototype.assignedElements)?(o,n)=>o.assignedElements(n):(o,n)=>o.assignedNodes(n).filter((o=>o.nodeType===Node.ELEMENT_NODE));

    let LMSCheckboxInput = class LMSCheckboxInput extends s {
        constructor() {
            super(...arguments);
            this.field = {};
            this.value = "";
        }
        render() {
            var _a;
            const { name, value, desc, required } = this.field;
            return x `
      <div class="form-check">
        <input
          type="checkbox"
          name=${name}
          id=${name}
          value=${(_a = value) !== null && _a !== void 0 ? _a : "1"}
          class="form-check-input"
          @input=${(e) => {
            this.field.value = (e.target.checked ? 1 : 0).toString();
        }}
          ?required=${required}
          ?checked=${[true, "true", "1"].includes(this.value)}
        />
        <label for="${name}">&nbsp;${desc}</label>
      </div>
    `;
        }
    };
    LMSCheckboxInput.styles = [bootstrapStyles];
    __decorate([
        e$2({ type: Object })
    ], LMSCheckboxInput.prototype, "field", void 0);
    __decorate([
        e$2({ type: Object })
    ], LMSCheckboxInput.prototype, "value", void 0);
    LMSCheckboxInput = __decorate([
        e$3("lms-checkbox-input")
    ], LMSCheckboxInput);
    var LMSCheckboxInput$1 = LMSCheckboxInput;

    /**
     * @license
     * Copyright 2018 Google LLC
     * SPDX-License-Identifier: BSD-3-Clause
     */const l=l=>null!=l?l:A;

    /**
     * @license
     * Copyright 2021 Google LLC
     * SPDX-License-Identifier: BSD-3-Clause
     */
    function*o$2(o,f){if(void 0!==o){let i=0;for(const t of o)yield f(t,i++);}}

    let LMSMatrix = class LMSMatrix extends s {
        constructor() {
            super(...arguments);
            this.field = {};
            this.value = [];
        }
        render() {
            const { field } = this;
            return x ` <label for=${field.name}>${field.desc}</label>
      <table class="table table-bordered" id=${field.name}>
        <thead>
          <tr>
            ${o$2(field.headers, ([name]) => x `<th scope="col">${name}</th>`)}
          </tr>
        </thead>
        <tbody>
          ${o$2(field.dbData, (row) => x `<tr>
              <td class="align-middle">${row.name}</td>
              ${o$2(field.headers, (header) => this.getMatrixInputMarkup({ field, row, header }))}
            </tr>`)}
        </tbody>
      </table>`;
        }
        handleInput({ e, id, header }) {
            if (!(e.target instanceof HTMLInputElement))
                return;
            const { field } = this;
            const { type } = e.target;
            const [name] = header;
            const updateOrCreateItem = (value) => {
                /** If there's no Array present in field.value
                 *  we create one and add the item to it. */
                if (!((field === null || field === void 0 ? void 0 : field.value) instanceof Array)) {
                    field.value = [{ id: id.toString(), [name]: value }];
                    return;
                }
                /** Now it must be an array because the guard clause
                 *  didn't return in the previous step. We check if
                 *  the item exists and update it if it does. */
                const item = field.value.find((item) => item.id == id);
                if (item) {
                    item[name] = value;
                    return;
                }
                /** If it is an Array but we didn't find an item  we
                 *  have to add a new one. */
                field.value.push({ id: id.toString(), [name]: value });
            };
            switch (type) {
                case "number": {
                    const { value } = e.target;
                    updateOrCreateItem(value.toString());
                    break;
                }
                case "checkbox": {
                    const { checked } = e.target;
                    updateOrCreateItem((checked ? 1 : 0).toString());
                    break;
                }
            }
        }
        getMatrixInputMarkup({ field, row, header }) {
            var _a, _b, _c, _d, _e;
            const [name, type] = header;
            const inputTypes = new Map([
                [
                    "number",
                    x `<td class="align-middle">
          <input
            type="number"
            name=${row.name}
            id=${row.id}
            .value=${field.value instanceof Array
                    ? (_b = (_a = field.value.find((item) => item.id == row.id)) === null || _a === void 0 ? void 0 : _a[name]) !== null && _b !== void 0 ? _b : ""
                    : ""}
            class="form-control"
            step=${l((_d = (_c = field.attributes) === null || _c === void 0 ? void 0 : _c.find(([attribute]) => attribute === "step")) === null || _d === void 0 ? void 0 : _d.slice(-1)[0])}
            @input=${(e) => this.handleInput({ e, id: row.id, header })}
            ?required=${field.required}
          />
        </td>`,
                ],
                [
                    "checkbox",
                    x ` <td class="align-middle">
          <input
            type="checkbox"
            name=${row.name}
            id=${row.id}
            class="form-control"
            @input=${(e) => this.handleInput({ e, id: row.id, header })}
            ?required=${field.required}
            .checked=${field.value instanceof Array
                    ? ((_e = field.value.find((item) => item.id == row.id)) === null || _e === void 0 ? void 0 : _e[name]) === "1"
                        ? true
                        : false
                    : false}
          />
        </td>`,
                ],
            ]);
            return inputTypes.has(type)
                ? inputTypes.get(type)
                : inputTypes.get("default");
        }
    };
    // @state() private hasTransformedField = false;
    LMSMatrix.styles = [
        bootstrapStyles,
        i$5 `
      input[type="checkbox"].form-control {
        font-size: 0.375rem;
      }
    `,
    ];
    __decorate([
        e$2({ type: Object })
    ], LMSMatrix.prototype, "field", void 0);
    __decorate([
        e$2({ type: Array })
    ], LMSMatrix.prototype, "value", void 0);
    LMSMatrix = __decorate([
        e$3("lms-matrix")
    ], LMSMatrix);
    var LMSMatrix$1 = LMSMatrix;

    let LMSPrimitivesInput = class LMSPrimitivesInput extends s {
        constructor() {
            super(...arguments);
            this.field = {};
            this.value = "";
        }
        render() {
            var _a;
            const { name, value, desc, type, required } = this.field;
            return x ` <div class="form-group">
      <label for=${name}>${desc}</label>
      <input
        type=${l(type)}
        name=${name}
        id=${name}
        value=${l(typeof this.value === "string" ? this.value : (_a = this.value) === null || _a === void 0 ? void 0 : _a.toString())}
        class="form-control"
        @input=${(e) => {
            var _a;
            this.field.value = (_a = e.target.value) !== null && _a !== void 0 ? _a : value;
        }}
        ?required=${required}
      />
    </div>`;
        }
    };
    LMSPrimitivesInput.styles = [bootstrapStyles];
    __decorate([
        e$2({ type: Object })
    ], LMSPrimitivesInput.prototype, "field", void 0);
    __decorate([
        e$2({ type: Object })
    ], LMSPrimitivesInput.prototype, "value", void 0);
    LMSPrimitivesInput = __decorate([
        e$3("lms-primitives-input")
    ], LMSPrimitivesInput);
    var LMSPrimitivesInput$1 = LMSPrimitivesInput;

    let LMSSelect = class LMSSelect extends s {
        constructor() {
            super(...arguments);
            this.defaultOption = {};
            this.field = {};
        }
        firstUpdated() {
            const { dbData } = this.field;
            if (dbData === null || dbData === void 0 ? void 0 : dbData.length) {
                const [defaultOption] = dbData;
                const { id } = defaultOption;
                this.field.value = id.toString();
                this.defaultOption = defaultOption;
            }
        }
        render() {
            const { name, desc, value, required, dbData } = this.field;
            return x `
      <div class="form-group">
        <label for=${name}>${desc}</label>
        <select
          name=${name}
          id=${name}
          class="form-control"
          @change=${(e) => {
            var _a;
            this.field.value = (_a = e.target.value) !== null && _a !== void 0 ? _a : value;
            this.dispatchEvent(new CustomEvent("change", {
                detail: {
                    name,
                    value: this.field.value,
                },
                composed: true,
                bubbles: true,
            }));
        }}
          ?required=${required}
        >
          ${o$2(dbData, ({ id, name }) => x `<option
                value=${id}
                ?selected=${id === this.defaultOption.id}
              >
                ${name}
              </option>`)}
        </select>
      </div>
    `;
        }
    };
    LMSSelect.styles = [bootstrapStyles];
    __decorate([
        e$2({ type: Object })
    ], LMSSelect.prototype, "field", void 0);
    LMSSelect = __decorate([
        e$3("lms-select")
    ], LMSSelect);
    var LMSSelect$1 = LMSSelect;

    /*! gettext.js - Guillaume Potier - MIT Licensed */
    var i18n = function (options) {
     options = options || {};
     this && (this.__version = '1.1.1');

     // default values that could be overriden in i18n() construct
     var defaults = {
       domain: 'messages',
       locale: (typeof document !== 'undefined' ? document.documentElement.getAttribute('lang') : false) || 'en',
       plural_func: function (n) { return { nplurals: 2, plural: (n!=1) ? 1 : 0 }; },
       ctxt_delimiter: String.fromCharCode(4) // \u0004
     };

     // handy mixins taken from underscode.js
     var _ = {
       isObject: function (obj) {
         var type = typeof obj;
         return type === 'function' || type === 'object' && !!obj;
       },
       isArray: function (obj) {
         return toString.call(obj) === '[object Array]';
       }
     };

     var
       _plural_funcs = {},
       _locale = options.locale || defaults.locale,
       _domain = options.domain || defaults.domain,
       _dictionary = {},
       _plural_forms = {},
       _ctxt_delimiter = options.ctxt_delimiter || defaults.ctxt_delimiter;

       if (options.messages) {
         _dictionary[_domain] = {};
         _dictionary[_domain][_locale] = options.messages;
       }

       if (options.plural_forms) {
         _plural_forms[_locale] = options.plural_forms;
       }

       // sprintf equivalent, takes a string and some arguments to make a computed string
       // eg: strfmt("%1 dogs are in %2", 7, "the kitchen"); => "7 dogs are in the kitchen"
       // eg: strfmt("I like %1, bananas and %1", "apples"); => "I like apples, bananas and apples"
       // NB: removes msg context if there is one present
       var strfmt = function (fmt) {
          var args = arguments;

          return fmt
           // put space after double % to prevent placeholder replacement of such matches
           .replace(/%%/g, '%% ')
           // replace placeholders
           .replace(/%(\d+)/g, function (str, p1) {
             return args[p1];
           })
           // replace double % and space with single %
           .replace(/%% /g, '%')
       };

       var removeContext = function(str) {
          // if there is context, remove it
          if (str.indexOf(_ctxt_delimiter) !== -1) {
            var parts = str.split(_ctxt_delimiter);
            return parts[1];
          }

        return str;
       };

       var expand_locale = function(locale) {
           var locales = [locale],
               i = locale.lastIndexOf('-');
           while (i > 0) {
               locale = locale.slice(0, i);
               locales.push(locale);
               i = locale.lastIndexOf('-');
           }
           return locales;
       };

       var normalizeLocale = function (locale) {
          // Convert locale to BCP 47. If the locale is in POSIX format, locale variant and encoding is discarded.
          locale = locale.replace('_', '-');
          var i = locale.search(/[.@]/);
          if (i != -1) locale = locale.slice(0, i);
          return locale;
       };

       var getPluralFunc = function (plural_form) {
         // Plural form string regexp
         // taken from https://github.com/Orange-OpenSource/gettext.js/blob/master/lib.gettext.js
         // plural forms list available here http://localization-guide.readthedocs.org/en/latest/l10n/pluralforms.html
         var pf_re = new RegExp('^\\s*nplurals\\s*=\\s*[0-9]+\\s*;\\s*plural\\s*=\\s*(?:\\s|[-\\?\\|&=!<>+*/%:;n0-9_\(\)])+');

         if (!pf_re.test(plural_form))
           throw new Error(strfmt('The plural form "%1" is not valid', plural_form));

         // Careful here, this is a hidden eval() equivalent..
         // Risk should be reasonable though since we test the plural_form through regex before
         // taken from https://github.com/Orange-OpenSource/gettext.js/blob/master/lib.gettext.js
         // TODO: should test if https://github.com/soney/jsep present and use it if so
         return new Function("n", 'var plural, nplurals; '+ plural_form +' return { nplurals: nplurals, plural: (plural === true ? 1 : (plural ? plural : 0)) };');
       };

       // Proper translation function that handle plurals and directives
       // Contains juicy parts of https://github.com/Orange-OpenSource/gettext.js/blob/master/lib.gettext.js
       var t = function (messages, n, options /* ,extra */) {
         // Singular is very easy, just pass dictionnary message through strfmt
         if (!options.plural_form)
          return strfmt.apply(this, [removeContext(messages[0])].concat(Array.prototype.slice.call(arguments, 3)));

         var plural;

         // if a plural func is given, use that one
         if (options.plural_func) {
           plural = options.plural_func(n);

         // if plural form never interpreted before, do it now and store it
         } else if (!_plural_funcs[_locale]) {
           _plural_funcs[_locale] = getPluralFunc(_plural_forms[_locale]);
           plural = _plural_funcs[_locale](n);

         // we have the plural function, compute the plural result
         } else {
           plural = _plural_funcs[_locale](n);
         }

         // If there is a problem with plurals, fallback to singular one
         if ('undefined' === typeof plural.plural || plural.plural > plural.nplurals || messages.length <= plural.plural)
           plural.plural = 0;

         return strfmt.apply(this, [removeContext(messages[plural.plural]), n].concat(Array.prototype.slice.call(arguments, 3)));
       };

     return {
       strfmt: strfmt, // expose strfmt util
       expand_locale: expand_locale, // expose expand_locale util

       // Declare shortcuts
       __: function () { return this.gettext.apply(this, arguments); },
       _n: function () { return this.ngettext.apply(this, arguments); },
       _p: function () { return this.pgettext.apply(this, arguments); },

       setMessages: function (domain, locale, messages, plural_forms) {
         if (!domain || !locale || !messages)
           throw new Error('You must provide a domain, a locale and messages');

         if ('string' !== typeof domain || 'string' !== typeof locale || !_.isObject(messages))
           throw new Error('Invalid arguments');

         locale = normalizeLocale(locale);

         if (plural_forms)
           _plural_forms[locale] = plural_forms;

         if (!_dictionary[domain])
           _dictionary[domain] = {};

         _dictionary[domain][locale] = messages;

         return this;
       },
       loadJSON: function (jsonData, domain) {
         if (!_.isObject(jsonData))
           jsonData = JSON.parse(jsonData);

         if (!jsonData[''] || !jsonData['']['language'] || !jsonData['']['plural-forms'])
           throw new Error('Wrong JSON, it must have an empty key ("") with "language" and "plural-forms" information');

         var headers = jsonData[''];
         delete jsonData[''];

         return this.setMessages(domain || defaults.domain, headers['language'], jsonData, headers['plural-forms']);
       },
       setLocale: function (locale) {
         _locale = normalizeLocale(locale);
         return this;
       },
       getLocale: function () {
         return _locale;
       },
       // getter/setter for domain
       textdomain: function (domain) {
         if (!domain)
           return _domain;
         _domain = domain;
         return this;
       },
       gettext: function (msgid /* , extra */) {
         return this.dcnpgettext.apply(this, [undefined, undefined, msgid, undefined, undefined].concat(Array.prototype.slice.call(arguments, 1)));
       },
       ngettext: function (msgid, msgid_plural, n /* , extra */) {
         return this.dcnpgettext.apply(this, [undefined, undefined, msgid, msgid_plural, n].concat(Array.prototype.slice.call(arguments, 3)));
       },
       pgettext: function (msgctxt, msgid /* , extra */) {
         return this.dcnpgettext.apply(this, [undefined, msgctxt, msgid, undefined, undefined].concat(Array.prototype.slice.call(arguments, 2)));
       },
       dcnpgettext: function (domain, msgctxt, msgid, msgid_plural, n /* , extra */) {
         domain = domain || _domain;

         if ('string' !== typeof msgid)
           throw new Error(this.strfmt('Msgid "%1" is not a valid translatable string', msgid));

         var
           translation,
           options = { plural_form: false },
           key = msgctxt ? msgctxt + _ctxt_delimiter + msgid : msgid,
           exist,
           locale,
           locales = expand_locale(_locale);

         for (var i in locales) {
            locale = locales[i];
            exist = _dictionary[domain] && _dictionary[domain][locale] && _dictionary[domain][locale][key];

            // because it's not possible to define both a singular and a plural form of the same msgid,
            // we need to check that the stored form is the same as the expected one.
            // if not, we'll just ignore the translation and consider it as not translated.
            if (msgid_plural) {
              exist = exist && "string" !== typeof _dictionary[domain][locale][key];
            } else {
              exist = exist && "string" === typeof _dictionary[domain][locale][key];
            }
            if (exist) {
              break;
            }
         }

         if (!exist) {
           translation = msgid;
           options.plural_func = defaults.plural_func;
         } else {
           translation = _dictionary[domain][locale][key];
         }

         // Singular form
         if (!msgid_plural)
           return t.apply(this, [[translation], n, options].concat(Array.prototype.slice.call(arguments, 5)));

         // Plural one
         options.plural_form = true;
         return t.apply(this, [exist ? translation : [msgid, msgid_plural], n, options].concat(Array.prototype.slice.call(arguments, 5)));
       }
     };
    };

    /**
     * @license
     * Copyright 2017 Google LLC
     * SPDX-License-Identifier: BSD-3-Clause
     */
    const t={ATTRIBUTE:1,CHILD:2,PROPERTY:3,BOOLEAN_ATTRIBUTE:4,EVENT:5,ELEMENT:6},e=t=>(...e)=>({_$litDirective$:t,values:e});class i$1{constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,e,i){this._$Ct=t,this._$AM=e,this._$Ci=i;}_$AS(t,e){return this.update(t,e)}update(t,e){return this.render(...e)}}

    let i18nInstance;
    let translationsLoaded = false;
    const callbacks = [];
    let loadTranslationsCalled = false;
    const locale = document.documentElement.lang.slice(0, 2);
    async function loadTranslations(localeUrl = "/api/v1/contrib/eventmanagement/static/locales") {
        if (locale.startsWith("en") || translationsLoaded) {
            return;
        }
        try {
            const response = await fetch(`${localeUrl}/${locale}/LC_MESSAGES/${locale}.json`);
            if (response.status >= 200 && response.status <= 299) {
                const translations = await response.json();
                const i18n$1 = i18n();
                i18n$1.loadJSON(translations, "messages");
                i18n$1.setLocale(locale);
                i18nInstance = i18n$1;
                translationsLoaded = true;
                callbacks.forEach(({ callback }) => {
                    callback();
                });
            }
            else {
                console.info(`No translations found for locale ${locale}. Using default locale.`);
            }
        }
        catch (error) {
            console.error(`Error loading translations for locale ${locale}:`, error);
        }
    }
    /**
     * TranslateDirective is used for translating text content within Lit templates.
     * It fetches translations from an external source and automatically updates the DOM.
     * Usage: html`<div>${__(text)}</div>`
     */
    class TranslateDirective extends i$1 {
        constructor(partInfo) {
            super(partInfo);
            this._element = null;
            this._textNode = null;
            this._element = document.createElement("span");
            this._element.classList.add("pointer-events-none");
            this._textNode = document.createTextNode("");
            this._element.appendChild(this._textNode);
            this._locale = document.documentElement.lang.slice(0, 2);
            if (!loadTranslationsCalled && !this._locale.startsWith("en")) {
                loadTranslationsCalled = true;
                loadTranslations();
            }
        }
        async updateTranslation(text) {
            if (translationsLoaded && this._textNode) {
                this._textNode.textContent = i18nInstance.gettext(text);
            }
        }
        async ____(text) {
            if (!translationsLoaded) {
                callbacks.push({
                    text,
                    callback: () => {
                        this.updateTranslation(text);
                        if (this._element) {
                            this._element.classList.remove("skeleton", "skeleton-text");
                        }
                    },
                });
                if (this._locale.startsWith("en")) {
                    return text;
                }
                else {
                    return "";
                }
            }
            else {
                const translatedText = i18nInstance.gettext(text);
                return translatedText;
            }
        }
        generatePlaceholder() {
            const rng = Math.floor(Math.random() * 5) + 8;
            return "\u00A0".repeat(rng);
        }
        update(_part, [text]) {
            this.____(text).then((translatedText) => {
                this.updateTranslation(text);
                this.render(translatedText);
            });
            return this.render(text);
        }
        render(_text) {
            if (this._element && this._textNode) {
                if (translationsLoaded || this._locale.startsWith("en")) {
                    this._textNode.textContent = _text;
                }
                else {
                    this._textNode.textContent = this.generatePlaceholder();
                    this._element.classList.add("skeleton", "skeleton-text");
                }
                return this._element;
            }
            return _text;
        }
    }
    /**
     * TranslateAttributeDirective is used for translating attribute values within Lit templates.
     * It fetches translations from an external source and automatically updates the DOM.
     * Usage: html`<div title=${attr__(title)}></div>`
     */
    class TranslateAttributeDirective extends i$1 {
        constructor(partInfo) {
            super(partInfo);
            this._element = null;
            this._name = null;
            this._locale = document.documentElement.lang.slice(0, 2);
            if (partInfo.type !== t.PROPERTY &&
                partInfo.type !== t.ATTRIBUTE) {
                throw new Error("Use of TranslateAttributeDirective on non-attribute/non-property is forbidden.");
            }
        }
        async updateTranslation(text) {
            if (translationsLoaded && this._element && this._name) {
                const translatedText = i18nInstance.gettext(text);
                this._element[this._name] = translatedText;
            }
        }
        async ____(part, text) {
            this._element = part.element;
            this._name = part.name;
            if (!translationsLoaded) {
                callbacks.push({
                    text,
                    callback: () => {
                        this.updateTranslation(text);
                        if (this._element) {
                            this._element.classList.remove("skeleton", "skeleton-text");
                        }
                    },
                });
                if (this._locale.startsWith("en")) {
                    return text;
                }
                else {
                    return "";
                }
            }
            else {
                const translatedText = i18nInstance.gettext(text);
                return translatedText;
            }
        }
        update(part, [text]) {
            this.____(part, text).then((translatedText) => {
                this.updateTranslation(translatedText);
            });
            return this.render(text);
        }
        render(_text) {
            return _text;
        }
    }
    const attr__ = e(TranslateAttributeDirective);
    const __ = e(TranslateDirective);

    const skeletonStyles = i$5 `
  .skeleton {
    opacity: 0.7;
    animation: skeleton-loading 1s linear infinite alternate;
  }

  .skeleton-text {
    color: transparent;
    width: 100%;
    height: 1em;
    margin-bottom: 0.25rem;
    border-radius: 5px;
  }

  .skeleton-text:last-child {
    margin-bottom: 0;
    width: 80%;
  }

  .skeleton-table {
    display: table;
    width: 100%;
    height: 50vh;
    height: 50dvh;
    border-collapse: collapse;
    border-spacing: 0;
    border: 1px solid #dee2e6;
    border-radius: 5px;
  }

  .skeleton-card {
    flex: 0 0 auto;
    margin: 1rem;
    width: calc(20% - 2rem);
    height: 20rem;
    border: 1px solid #dee2e6;
    border-radius: 0.25rem;
  }

  @keyframes skeleton-loading {
    0% {
      background-color: hsl(200, 20%, 70%);
    }

    100% {
      background-color: hsl(200, 20%, 95%);
    }
  }
`;

    let LMSStaffEventCardAttendees = class LMSStaffEventCardAttendees extends s {
        render() {
            return x ` <h1 class="text-center">${__("Not implemented")}!</h1> `;
        }
    };
    LMSStaffEventCardAttendees.styles = [
        bootstrapStyles,
        skeletonStyles,
        i$5 `
      svg {
        display: inline-block;
        width: 1em;
        height: 1em;
        color: #ffffff;
      }

      button {
        white-space: nowrap;
      }
    `,
    ];
    LMSStaffEventCardAttendees = __decorate([
        e$3("lms-staff-event-card-attendees")
    ], LMSStaffEventCardAttendees);
    var LMSStaffEventCardAttendees$1 = LMSStaffEventCardAttendees;

    /**
     * Represents a TemplateResultConverter that can extract values and render strings from a TemplateResult.
     */
    class TemplateResultConverter {
        /**
         * Creates a new instance of TemplateResultConverter.
         * @param templateResult - The TemplateResult to be converted.
         */
        constructor(templateResult) {
            this._templateResult = templateResult;
        }
        /**
         * Sets the TemplateResult to be converted.
         * @param templateResult - The TemplateResult to be set.
         */
        set templateResult(templateResult) {
            this._templateResult = templateResult;
        }
        /**
         * Retrieves the value at the specified index from the TemplateResult.
         * @param templateResult - The TemplateResult to extract the value from.
         * @param index - The index of the value to retrieve.
         * @returns The extracted value as a string.
         */
        getValueByIndex(templateResult, index) {
            this.templateResult = templateResult;
            const renderValue = this.getRenderValues()[index];
            return typeof renderValue === "string"
                ? renderValue
                : renderValue.toString();
        }
        /**
         * Generates the rendered string from the TemplateResult.
         * @param data - The data object to render. Defaults to the stored TemplateResult.
         * @returns The rendered string.
         */
        getRenderString(data = this._templateResult) {
            const { strings, values } = data;
            const v = [...values, ""].map((e) => typeof e === "object" ? this.getRenderString(e) : e);
            return strings.reduce((acc, s, i) => acc + s + v[i], "");
        }
        /**
         * Retrieves all the rendered values from the TemplateResult.
         * @param data - The data object to extract values from. Defaults to the stored TemplateResult.
         * @returns An array of the extracted values.
         */
        getRenderValues(data = this._templateResult) {
            const { values } = data;
            return [...values, ""].map((e) => typeof e === "object" ? this.getRenderValues(e) : e);
        }
    }
    /**
     * Splits a datetime string into date and time components.
     * @param {string} string - The datetime string to split.
     * @param {string} locale - The locale used for formatting the date and time.
     * @returns {string[]} An array containing the date and time components.
     */
    function splitDateTime(string, locale) {
        const datetime = new Date(string);
        const date = datetime.toLocaleDateString(locale, {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
        });
        const time = datetime.toLocaleTimeString(locale, {
            hour: "2-digit",
            minute: "2-digit",
        });
        return [date, time];
    }
    /**
     * Normalizes a datetime string for use in an input field of type "datetime-local".
     * @param string - The datetime string to normalize.
     * @param format - The format of the datetime string.
     * @returns The normalized datetime string.
     */
    function normalizeForInput(string, format) {
        if (format === "datetime-local") {
            const datetime = new Date(string);
            const normalizedDateTime = datetime.toISOString().slice(0, 16);
            return normalizedDateTime;
        }
        return string;
    }
    /**
     * Represents an InputConverter that handles conversion of input fields based on their name.
     */
    class InputConverter {
        /**
         * Creates a new instance of InputConverter.
         */
        constructor() {
            this.conversionMap = {};
            this.conversionMap = {
                name: (value) => x `<input
        class="form-control"
        type="text"
        name="name"
        value=${value}
        disabled
      />`,
                event_type: (value, data) => x `<select
        class="form-control"
        name="event_type"
        disabled
      >
        ${data === null || data === void 0 ? void 0 : data.map(({ id, name }) => x `<option
              value=${id}
              ?selected=${id === parseInt(value, 10)}
            >
              ${name}
            </option>`)};
      </select>`,
                target_groups: (value, data) => x `
        <button
          type="button"
          class="btn btn-link btn-section w-100 text-left"
          data-toggle="collapse"
          data-target="#targetGroups"
          @click=${this.toggleCollapse}
        >
          <h4 class="pointer-events-none">${__("Target Groups")}</h4>
        </button>
        <div class="collapse" id="targetGroups">
          <table
            class="table table-sm table-bordered table-striped mx-3 w-inherit"
          >
            <thead>
              <tr>
                <th scope="col">${__("target_group")}</th>
                <th scope="col">${__("selected")}</th>
                <th scope="col">${__("fee")}</th>
              </tr>
            </thead>
            <tbody>
              ${data.map(({ id, name }) => {
                var _a, _b;
                const targetGroupFee = value.find((targetGroupFee) => targetGroupFee.target_group_id === id);
                const selected = (_a = targetGroupFee === null || targetGroupFee === void 0 ? void 0 : targetGroupFee.selected) !== null && _a !== void 0 ? _a : false;
                const fee = (_b = targetGroupFee === null || targetGroupFee === void 0 ? void 0 : targetGroupFee.fee) !== null && _b !== void 0 ? _b : 0;
                return x `
                    <tr>
                      <td id=${id} class="align-middle">${name}</td>
                      <td class="align-middle">
                        <input
                          type="checkbox"
                          data-group="target_groups"
                          name="selected"
                          id=${id}
                          class="form-control"
                          ?checked=${selected}
                          disabled
                        />
                      </td>
                      <td class="align-middle">
                        <input
                          type="number"
                          data-group="target_groups"
                          name="fee"
                          id=${id}
                          step="0.01"
                          class="form-control"
                          value=${fee}
                          disabled
                        />
                      </td>
                    </tr>
                  `;
            })}
            </tbody>
          </table>
        </div>
      `,
                min_age: (value) => x `<input
        class="form-control"
        type="number"
        name="min_age"
        value=${value}
        disabled
      />`,
                max_age: (value) => x `<input
        class="form-control"
        type="number"
        name="max_age"
        value=${value}
        disabled
      />`,
                max_participants: (value) => x `<input
        class="form-control"
        type="number"
        name="max_participants"
        value=${value}
        disabled
      />`,
                location: (value, data) => x `<select
        class="form-control"
        name="location"
        disabled
      >
        ${data === null || data === void 0 ? void 0 : data.map(({ id, name }) => x `<option value=${id} ?selected=${id == value}>${name}</option>`)}
      </select>`,
                image: (value) => x `<input
        class="form-control"
        type="text"
        name="image"
        value=${value}
        disabled
      />`,
                description: (value) => x `<textarea
        class="form-control"
        name="description"
        disabled
      >
${value}</textarea
      >`,
                open_registration: (value) => x `<input
        class="form-control"
        type="checkbox"
        name="open_registration"
        ?checked=${value}
        disabled
      />`,
                street: (value) => x `<input
        class="form-control"
        type="text"
        name="street"
        value=${value}
        disabled
      />`,
                number: (value) => x `<input
        class="form-control"
        type="text"
        name="number"
        value=${value}
        disabled
      />`,
                city: (value) => x `<input
        class="form-control"
        type="text"
        name="city"
        value=${value}
        disabled
      />`,
                zip: (value) => x `<input
        class="form-control"
        type="text"
        name="zip"
        value=${value}
        disabled
      />`,
                country: (value) => x `<input
        class="form-control"
        type="text"
        name="country"
        value=${value}
        disabled
      />`,
                start_time: (value) => x `<input
        class="form-control"
        type="datetime-local"
        name="start_time"
        value=${normalizeForInput(value, "datetime-local")}
        disabled
      />`,
                end_time: (value) => x `<input
        class="form-control"
        type="datetime-local"
        name="end_time"
        value=${normalizeForInput(value, "datetime-local")}
        disabled
      />`,
                registration_start: (value) => x `<input
        class="form-control"
        type="datetime-local"
        name="registration_start"
        value=${normalizeForInput(value, "datetime-local")}
        disabled
      />`,
                registration_end: (value) => x `<input
        class="form-control"
        type="datetime-local"
        name="registration_end"
        value=${normalizeForInput(value, "datetime-local")}
        disabled
      />`,
                status: (value) => x `<select
        class="form-control"
        name="status"
        disabled
      >
        <option value="pending" ?selected=${value === "pending"}>
          ${__("Pending")}
        </option>
        <option
          value="confirmed"
          ?selected=${value === "confirmed"}
        >
          ${__("Confirmed")}
        </option>
        <option value="canceled" ?selected=${value === "canceled"}>
          ${__("Canceled")}
        </option>
        <option value="sold_out" ?selected=${value === "sold_out"}>
          ${__("Sold Out")}
        </option>
      </select>`,
                registration_link: (value) => x `<input
        class="form-control"
        type="text"
        name="registration_link"
        value=${value}
        disabled
      />`,
            };
        }
        /**
         * Toggles the collapse state of a target element.
         * @param e - The MouseEvent that triggered the toggle.
         */
        toggleCollapse(e) {
            const target = e.target;
            const button = target.closest("button");
            if (!button)
                return;
            const collapse = button.nextElementSibling;
            const parent = collapse.parentElement;
            if (collapse.classList.contains("show")) {
                parent === null || parent === void 0 ? void 0 : parent.classList.remove("pip");
                collapse.classList.remove("show");
            }
            else {
                parent === null || parent === void 0 ? void 0 : parent.classList.add("pip");
                collapse.classList.add("show");
            }
        }
        /**
         * Checks if a particular input template requires data to be rendered correctly.
         * @param name - The name of the input template.
         * @returns A boolean indicating whether the input template requires data.
         */
        needsData(name) {
            return ["target_groups", "event_type", "location"].includes(name);
        }
        /**
         * Retrieves the appropriate input template based on the provided query.
         * @param query - The query object containing the name, value, and optional data for the input template.
         * @returns The TemplateResult representing the input template.
         */
        getInputTemplate({ name, value, data, }) {
            const template = this.conversionMap[name];
            if (!template)
                return this.renderValue(value);
            if (this.needsData(name)) {
                const requiredData = this.findDataByName(name, data);
                if (!requiredData)
                    return this.renderError();
                return template(value, requiredData);
            }
            return template(value);
        }
        /**
         * Finds the required data based on the name from the provided data array.
         * @param name - The name of the required data.
         * @param data - The data array to search in.
         * @returns The found data if available, otherwise undefined.
         */
        findDataByName(name, data) {
            var _a;
            if (!data)
                return undefined;
            const [, foundData] = (_a = data.find(([tag]) => tag === name)) !== null && _a !== void 0 ? _a : new Array(2).fill(undefined);
            return foundData;
        }
        /**
         * Renders the value as a TemplateResult.
         * @param value - The value to be rendered.
         * @returns The rendered value as a TemplateResult.
         */
        renderValue(value) {
            return x `${value}`;
        }
        /**
         * Renders an error message as a TemplateResult.
         * @returns The rendered error message as a TemplateResult.
         */
        renderError() {
            return x `<strong>${__("Error")}!</strong>`;
        }
    }

    let LMSStaffEventCardPreview = class LMSStaffEventCardPreview extends s {
        constructor() {
            super(...arguments);
            this.datum = {};
            this.title = "";
            this.text = "";
            this.templateResultConverter = new TemplateResultConverter(undefined);
        }
        connectedCallback() {
            super.connectedCallback();
            const { name, description } = this.datum;
            this.title = this.templateResultConverter.getValueByIndex(name, 0);
            this.text = this.templateResultConverter.getValueByIndex(description, 0);
        }
        render() {
            return x `<lms-card .title=${this.title} .text=${this.text}> </lms-card>`;
        }
    };
    LMSStaffEventCardPreview.styles = [
        bootstrapStyles,
        skeletonStyles,
        i$5 `
      svg {
        display: inline-block;
        width: 1em;
        height: 1em;
        color: #ffffff;
      }

      button {
        white-space: nowrap;
      }
    `,
    ];
    __decorate([
        e$2({ type: Array })
    ], LMSStaffEventCardPreview.prototype, "datum", void 0);
    __decorate([
        e$2({ type: String })
    ], LMSStaffEventCardPreview.prototype, "title", void 0);
    __decorate([
        e$2({ type: String })
    ], LMSStaffEventCardPreview.prototype, "text", void 0);
    LMSStaffEventCardPreview = __decorate([
        e$3("lms-staff-event-card-preview")
    ], LMSStaffEventCardPreview);
    var LMSStaffEventCardPreview$1 = LMSStaffEventCardPreview;

    /**
     * @license
     * Copyright 2018 Google LLC
     * SPDX-License-Identifier: BSD-3-Clause
     */const o$1=e(class extends i$1{constructor(t$1){var i;if(super(t$1),t$1.type!==t.ATTRIBUTE||"class"!==t$1.name||(null===(i=t$1.strings)||void 0===i?void 0:i.length)>2)throw Error("`classMap()` can only be used in the `class` attribute and must be the only part in the attribute.")}render(t){return " "+Object.keys(t).filter((i=>t[i])).join(" ")+" "}update(i,[s]){var r,o;if(void 0===this.it){this.it=new Set,void 0!==i.strings&&(this.nt=new Set(i.strings.join(" ").split(/\s/).filter((t=>""!==t))));for(const t in s)s[t]&&!(null===(r=this.nt)||void 0===r?void 0:r.has(t))&&this.it.add(t);return this.render(s)}const e=i.element.classList;this.it.forEach((t=>{t in s||(e.remove(t),this.it.delete(t));}));for(const t in s){const i=!!s[t];i===this.it.has(t)||(null===(o=this.nt)||void 0===o?void 0:o.has(t))||(i?(e.add(t),this.it.add(t)):(e.remove(t),this.it.delete(t)));}return T}});

    function getAugmentedNamespace(n) {
      if (n.__esModule) return n;
      var f = n.default;
    	if (typeof f == "function") {
    		var a = function a () {
    			if (this instanceof a) {
    				var args = [null];
    				args.push.apply(args, arguments);
    				var Ctor = Function.bind.apply(f, args);
    				return new Ctor();
    			}
    			return f.apply(this, arguments);
    		};
    		a.prototype = f.prototype;
      } else a = {};
      Object.defineProperty(a, '__esModule', {value: true});
    	Object.keys(n).forEach(function (k) {
    		var d = Object.getOwnPropertyDescriptor(n, k);
    		Object.defineProperty(a, k, d.get ? d : {
    			enumerable: true,
    			get: function () {
    				return n[k];
    			}
    		});
    	});
    	return a;
    }

    var litFontawesome$1 = {};

    var require$$0 = /*@__PURE__*/getAugmentedNamespace(litHtml);

    Object.defineProperty(litFontawesome$1, "__esModule", { value: true });
    litFontawesome$1.urlFontawesome = litFontawesome_2 = litFontawesome$1.litFontawesome = void 0;
    const lit_html_1 = require$$0;
    function litFontawesome(definition, { className, color } = {}) {
        return lit_html_1.svg `
        <svg
            aria-hidden="true"
            focusable="false"
            data-prefix="${definition.prefix}"
            data-icon="${definition.iconName}"
            role="img"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 ${definition.icon[0]} ${definition.icon[1]}"
            class="${className || ''} ${definition.prefix}_${definition.iconName} fa-${definition.iconName}"
            fill="${color || 'currentColor'}"
        >
            ${(Array.isArray(definition.icon[4]) ? definition.icon[4] : [definition.icon[4]]).map((icon) => lit_html_1.svg `<path d="${icon}"></path>`)}
        </svg>
    `;
    }
    var litFontawesome_2 = litFontawesome$1.litFontawesome = litFontawesome;
    function uncachedUrlFontawesome(definition, options) {
        const mount = window.document.createElement('div');
        lit_html_1.render(litFontawesome(definition, options), mount);
        return `data:image/svg+xml;base64,${btoa(mount.innerHTML.replace(/ {4}|<!---->|\n/g, ''))}`;
    }
    const cachedURL = new Map();
    function urlFontawesome(definition, options = {}) {
        let dataUrl;
        const foundDefinition = cachedURL.get(definition);
        let foundClassName;
        if (foundDefinition !== undefined) {
            foundClassName = foundDefinition.get(options.className);
            if (foundClassName !== undefined) {
                const foundColor = foundClassName.get(options.color);
                if (foundColor !== undefined) {
                    dataUrl = foundColor;
                }
            }
        }
        if (dataUrl === undefined) {
            dataUrl = uncachedUrlFontawesome(definition, options);
            if (foundDefinition === undefined) {
                cachedURL.set(definition, new Map([[options.className, new Map([[options.color, dataUrl]])]]));
            }
            else if (foundClassName === undefined) {
                foundDefinition.set(options.className, new Map([[options.color, dataUrl]]));
            }
            else {
                foundClassName.set(options.color, dataUrl);
            }
        }
        return dataUrl;
    }
    litFontawesome$1.urlFontawesome = urlFontawesome;

    const utilityStyles = i$5 `
  .pointer-events-none {
    pointer-events: none;
  }

  .w-inherit {
    width: inherit;
  }
`;

    var faDownLeftAndUpRightToCenter = {
      prefix: 'fas',
      iconName: 'down-left-and-up-right-to-center',
      icon: [512, 512, ["compress-alt"], "f422", "M439 7c9.4-9.4 24.6-9.4 33.9 0l32 32c9.4 9.4 9.4 24.6 0 33.9l-87 87 39 39c6.9 6.9 8.9 17.2 5.2 26.2s-12.5 14.8-22.2 14.8H296c-13.3 0-24-10.7-24-24V72c0-9.7 5.8-18.5 14.8-22.2s19.3-1.7 26.2 5.2l39 39L439 7zM72 272H216c13.3 0 24 10.7 24 24V440c0 9.7-5.8 18.5-14.8 22.2s-19.3 1.7-26.2-5.2l-39-39L73 505c-9.4 9.4-24.6 9.4-33.9 0L7 473c-9.4-9.4-9.4-24.6 0-33.9l87-87L55 313c-6.9-6.9-8.9-17.2-5.2-26.2s12.5-14.8 22.2-14.8z"]
    };
    var faCompressAlt = faDownLeftAndUpRightToCenter;
    var faCalendarDays = {
      prefix: 'fas',
      iconName: 'calendar-days',
      icon: [448, 512, ["calendar-alt"], "f073", "M128 0c17.7 0 32 14.3 32 32V64H288V32c0-17.7 14.3-32 32-32s32 14.3 32 32V64h48c26.5 0 48 21.5 48 48v48H0V112C0 85.5 21.5 64 48 64H96V32c0-17.7 14.3-32 32-32zM0 192H448V464c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V192zm64 80v32c0 8.8 7.2 16 16 16h32c8.8 0 16-7.2 16-16V272c0-8.8-7.2-16-16-16H80c-8.8 0-16 7.2-16 16zm128 0v32c0 8.8 7.2 16 16 16h32c8.8 0 16-7.2 16-16V272c0-8.8-7.2-16-16-16H208c-8.8 0-16 7.2-16 16zm144-16c-8.8 0-16 7.2-16 16v32c0 8.8 7.2 16 16 16h32c8.8 0 16-7.2 16-16V272c0-8.8-7.2-16-16-16H336zM64 400v32c0 8.8 7.2 16 16 16h32c8.8 0 16-7.2 16-16V400c0-8.8-7.2-16-16-16H80c-8.8 0-16 7.2-16 16zm144-16c-8.8 0-16 7.2-16 16v32c0 8.8 7.2 16 16 16h32c8.8 0 16-7.2 16-16V400c0-8.8-7.2-16-16-16H208zm112 16v32c0 8.8 7.2 16 16 16h32c8.8 0 16-7.2 16-16V400c0-8.8-7.2-16-16-16H336c-8.8 0-16 7.2-16 16z"]
    };
    var faCalendarAlt = faCalendarDays;
    var faList = {
      prefix: 'fas',
      iconName: 'list',
      icon: [512, 512, ["list-squares"], "f03a", "M40 48C26.7 48 16 58.7 16 72v48c0 13.3 10.7 24 24 24H88c13.3 0 24-10.7 24-24V72c0-13.3-10.7-24-24-24H40zM192 64c-17.7 0-32 14.3-32 32s14.3 32 32 32H480c17.7 0 32-14.3 32-32s-14.3-32-32-32H192zm0 160c-17.7 0-32 14.3-32 32s14.3 32 32 32H480c17.7 0 32-14.3 32-32s-14.3-32-32-32H192zm0 160c-17.7 0-32 14.3-32 32s14.3 32 32 32H480c17.7 0 32-14.3 32-32s-14.3-32-32-32H192zM16 232v48c0 13.3 10.7 24 24 24H88c13.3 0 24-10.7 24-24V232c0-13.3-10.7-24-24-24H40c-13.3 0-24 10.7-24 24zM40 368c-13.3 0-24 10.7-24 24v48c0 13.3 10.7 24 24 24H88c13.3 0 24-10.7 24-24V392c0-13.3-10.7-24-24-24H40z"]
    };
    var faPenToSquare = {
      prefix: 'fas',
      iconName: 'pen-to-square',
      icon: [512, 512, ["edit"], "f044", "M471.6 21.7c-21.9-21.9-57.3-21.9-79.2 0L362.3 51.7l97.9 97.9 30.1-30.1c21.9-21.9 21.9-57.3 0-79.2L471.6 21.7zm-299.2 220c-6.1 6.1-10.8 13.6-13.5 21.9l-29.6 88.8c-2.9 8.6-.6 18.1 5.8 24.6s15.9 8.7 24.6 5.8l88.8-29.6c8.2-2.7 15.7-7.4 21.9-13.5L437.7 172.3 339.7 74.3 172.4 241.7zM96 64C43 64 0 107 0 160V416c0 53 43 96 96 96H352c53 0 96-43 96-96V320c0-17.7-14.3-32-32-32s-32 14.3-32 32v96c0 17.7-14.3 32-32 32H96c-17.7 0-32-14.3-32-32V160c0-17.7 14.3-32 32-32h96c17.7 0 32-14.3 32-32s-14.3-32-32-32H96z"]
    };
    var faEdit = faPenToSquare;
    var faUsers = {
      prefix: 'fas',
      iconName: 'users',
      icon: [640, 512, [], "f0c0", "M144 0a80 80 0 1 1 0 160A80 80 0 1 1 144 0zM512 0a80 80 0 1 1 0 160A80 80 0 1 1 512 0zM0 298.7C0 239.8 47.8 192 106.7 192h42.7c15.9 0 31 3.5 44.6 9.7c-1.3 7.2-1.9 14.7-1.9 22.3c0 38.2 16.8 72.5 43.3 96c-.2 0-.4 0-.7 0H21.3C9.6 320 0 310.4 0 298.7zM405.3 320c-.2 0-.4 0-.7 0c26.6-23.5 43.3-57.8 43.3-96c0-7.6-.7-15-1.9-22.3c13.6-6.3 28.7-9.7 44.6-9.7h42.7C592.2 192 640 239.8 640 298.7c0 11.8-9.6 21.3-21.3 21.3H405.3zM224 224a96 96 0 1 1 192 0 96 96 0 1 1 -192 0zM128 485.3C128 411.7 187.7 352 261.3 352H378.7C452.3 352 512 411.7 512 485.3c0 14.7-11.9 26.7-26.7 26.7H154.7c-14.7 0-26.7-11.9-26.7-26.7z"]
    };
    var faBullseye = {
      prefix: 'fas',
      iconName: 'bullseye',
      icon: [512, 512, [], "f140", "M448 256A192 192 0 1 0 64 256a192 192 0 1 0 384 0zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256zm256 80a80 80 0 1 0 0-160 80 80 0 1 0 0 160zm0-224a144 144 0 1 1 0 288 144 144 0 1 1 0-288zM224 256a32 32 0 1 1 64 0 32 32 0 1 1 -64 0z"]
    };
    var faImage = {
      prefix: 'fas',
      iconName: 'image',
      icon: [512, 512, [], "f03e", "M0 96C0 60.7 28.7 32 64 32H448c35.3 0 64 28.7 64 64V416c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V96zM323.8 202.5c-4.5-6.6-11.9-10.5-19.8-10.5s-15.4 3.9-19.8 10.5l-87 127.6L170.7 297c-4.6-5.7-11.5-9-18.7-9s-14.2 3.3-18.7 9l-64 80c-5.8 7.2-6.9 17.1-2.9 25.4s12.4 13.6 21.6 13.6h96 32H424c8.9 0 17.1-4.9 21.2-12.8s3.6-17.4-1.4-24.7l-120-176zM112 192a48 48 0 1 0 0-96 48 48 0 1 0 0 96z"]
    };
    var faLocationPin = {
      prefix: 'fas',
      iconName: 'location-pin',
      icon: [384, 512, ["map-marker"], "f041", "M384 192c0 87.4-117 243-168.3 307.2c-12.3 15.3-35.1 15.3-47.4 0C117 435 0 279.4 0 192C0 86 86 0 192 0S384 86 384 192z"]
    };
    var faMapMarker = faLocationPin;
    var faArrowRight = {
      prefix: 'fas',
      iconName: 'arrow-right',
      icon: [448, 512, [8594], "f061", "M438.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L338.8 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l306.7 0L233.4 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160z"]
    };
    var faFloppyDisk = {
      prefix: 'fas',
      iconName: 'floppy-disk',
      icon: [448, 512, [128190, 128426, "save"], "f0c7", "M64 32C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H384c35.3 0 64-28.7 64-64V173.3c0-17-6.7-33.3-18.7-45.3L352 50.7C340 38.7 323.7 32 306.7 32H64zm0 96c0-17.7 14.3-32 32-32H288c17.7 0 32 14.3 32 32v64c0 17.7-14.3 32-32 32H96c-17.7 0-32-14.3-32-32V128zM224 288a64 64 0 1 1 0 128 64 64 0 1 1 0-128z"]
    };
    var faSave = faFloppyDisk;
    var faTrash = {
      prefix: 'fas',
      iconName: 'trash',
      icon: [448, 512, [], "f1f8", "M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"]
    };
    var faTag = {
      prefix: 'fas',
      iconName: 'tag',
      icon: [448, 512, [127991], "f02b", "M0 80V229.5c0 17 6.7 33.3 18.7 45.3l176 176c25 25 65.5 25 90.5 0L418.7 317.3c25-25 25-65.5 0-90.5l-176-176c-12-12-28.3-18.7-45.3-18.7H48C21.5 32 0 53.5 0 80zm112 32a32 32 0 1 1 0 64 32 32 0 1 1 0-64z"]
    };
    var faCircleInfo = {
      prefix: 'fas',
      iconName: 'circle-info',
      icon: [512, 512, ["info-circle"], "f05a", "M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM216 336h24V272H216c-13.3 0-24-10.7-24-24s10.7-24 24-24h48c13.3 0 24 10.7 24 24v88h8c13.3 0 24 10.7 24 24s-10.7 24-24 24H216c-13.3 0-24-10.7-24-24s10.7-24 24-24zm40-208a32 32 0 1 1 0 64 32 32 0 1 1 0-64z"]
    };
    var faInfoCircle = faCircleInfo;
    var faCreditCard = {
      prefix: 'fas',
      iconName: 'credit-card',
      icon: [576, 512, [128179, 62083, "credit-card-alt"], "f09d", "M64 32C28.7 32 0 60.7 0 96v32H576V96c0-35.3-28.7-64-64-64H64zM576 224H0V416c0 35.3 28.7 64 64 64H512c35.3 0 64-28.7 64-64V224zM112 352h64c8.8 0 16 7.2 16 16s-7.2 16-16 16H112c-8.8 0-16-7.2-16-16s7.2-16 16-16zm112 16c0-8.8 7.2-16 16-16H368c8.8 0 16 7.2 16 16s-7.2 16-16 16H240c-8.8 0-16-7.2-16-16z"]
    };
    var faLocationDot = {
      prefix: 'fas',
      iconName: 'location-dot',
      icon: [384, 512, ["map-marker-alt"], "f3c5", "M215.7 499.2C267 435 384 279.4 384 192C384 86 298 0 192 0S0 86 0 192c0 87.4 117 243 168.3 307.2c12.3 15.3 35.1 15.3 47.4 0zM192 128a64 64 0 1 1 0 128 64 64 0 1 1 0-128z"]
    };
    var faMapMarkerAlt = faLocationDot;
    var faMagnifyingGlass = {
      prefix: 'fas',
      iconName: 'magnifying-glass',
      icon: [512, 512, [128269, "search"], "f002", "M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z"]
    };
    var faSearch = faMagnifyingGlass;
    var faCopy = {
      prefix: 'fas',
      iconName: 'copy',
      icon: [512, 512, [], "f0c5", "M272 0H396.1c12.7 0 24.9 5.1 33.9 14.1l67.9 67.9c9 9 14.1 21.2 14.1 33.9V336c0 26.5-21.5 48-48 48H272c-26.5 0-48-21.5-48-48V48c0-26.5 21.5-48 48-48zM48 128H192v64H64V448H256V416h64v48c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V176c0-26.5 21.5-48 48-48z"]
    };
    var faPlus = {
      prefix: 'fas',
      iconName: 'plus',
      icon: [448, 512, [10133, 61543, "add"], "2b", "M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z"]
    };
    var faXmark = {
      prefix: 'fas',
      iconName: 'xmark',
      icon: [384, 512, [128473, 10005, 10006, 10060, 215, "close", "multiply", "remove", "times"], "f00d", "M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"]
    };
    var faClose = faXmark;
    var faTimes = faXmark;
    var faCalendar = {
      prefix: 'fas',
      iconName: 'calendar',
      icon: [448, 512, [128197, 128198], "f133", "M96 32V64H48C21.5 64 0 85.5 0 112v48H448V112c0-26.5-21.5-48-48-48H352V32c0-17.7-14.3-32-32-32s-32 14.3-32 32V64H160V32c0-17.7-14.3-32-32-32S96 14.3 96 32zM448 192H0V464c0 26.5 21.5 48 48 48H400c26.5 0 48-21.5 48-48V192z"]
    };

    /**
     * Custom element representing an event card form for staff members.
     */
    let LMSStaffEventCardForm = class LMSStaffEventCardForm extends s {
        constructor() {
            super(...arguments);
            this.datum = {};
            this._toast = {
                heading: "",
                message: "",
            };
        }
        /**
         * Toggles the edit mode of the form.
         * @param e - The click event.
         */
        toggleEdit(e) {
            var _a, _b, _c, _d;
            e.preventDefault();
            const button = e.target;
            if (!button)
                return;
            if (button.classList.contains("active")) {
                button.classList.remove("active");
                (_a = button.querySelector(".start-edit")) === null || _a === void 0 ? void 0 : _a.classList.remove("d-none");
                (_b = button.querySelector(".abort-edit")) === null || _b === void 0 ? void 0 : _b.classList.add("d-none");
                this.inputs.forEach((input) => {
                    input.setAttribute("disabled", "");
                });
                this.collapseAll();
                return;
            }
            button.classList.add("active");
            (_c = button.querySelector(".start-edit")) === null || _c === void 0 ? void 0 : _c.classList.add("d-none");
            (_d = button.querySelector(".abort-edit")) === null || _d === void 0 ? void 0 : _d.classList.remove("d-none");
            this.inputs.forEach((input) => {
                input.removeAttribute("disabled");
            });
            const hasOpenCollapsibles = Array.from(this.collapsibles).some((collapsible) => collapsible.classList.contains("show"));
            if (!hasOpenCollapsibles) {
                this.expandAll();
            }
        }
        /**
         * Processes the target group elements in the form.
         * We need to assure that the target_groups property is always an array of objects
         * containing all configured target_groups.
         * @param target - The HTMLFormElement containing the target group elements.
         * @returns The processed target group elements.
         */
        processTargetGroupElements(target) {
            const targetGroupElements = Array.from(target.querySelectorAll(`[data-group="target_groups"]`));
            if (!targetGroupElements.length)
                return;
            return targetGroupElements.reduce((target_groups, element) => {
                const { name, id } = element;
                const databaseId = parseInt(id, 10);
                if (!target_groups[databaseId]) {
                    target_groups[databaseId] = {
                        id: databaseId,
                        selected: false,
                        fee: 0,
                    };
                }
                if (element instanceof HTMLInputElement) {
                    switch (name) {
                        case "selected":
                            target_groups[databaseId].selected = element.checked
                                ? true
                                : false;
                            break;
                        case "fee":
                            target_groups[databaseId].fee = parseFloat(element.value);
                            break;
                    }
                }
                return target_groups;
            }, {});
        }
        /**
         * Processes the datetime-local elements in the form.
         * We need to assure they aren't rejected by the api validation.
         * We remove the idiosynchracies from the ISO8601 standard
         * and convert straight into sql writable strings.
         * @param target - The HTMLFormElement containing the datetime-local elements.
         * @returns The processed datetime-local elements.
         */
        processDatetimeLocalElements(target) {
            const datetimeLocalElements = Array.from(target.querySelectorAll(`[type="datetime-local"]`));
            if (!datetimeLocalElements.length)
                return;
            const affected_fields = [
                "start_time",
                "end_time",
                "registration_start",
                "registration_end",
            ];
            // return an array of objects with the updated SQL-formatted datetime values
            return datetimeLocalElements.map((element) => {
                const { name, value } = element;
                if (affected_fields.includes(name) && value) {
                    const [date, time] = value.split("T");
                    const [year, month, day] = date.split("-");
                    const [hour, minute] = time.split(":");
                    const iso8601formattedDate = `${year}-${month}-${day}T${hour}:${minute}:00Z`;
                    return { name, value: iso8601formattedDate };
                }
                return { name, value };
            });
        }
        /**
         * Processes the open_registration element in the form.
         * We need to check the state of the checked attribute instead of using the value.
         * @param target - The HTMLFormElement containing the open_registration element.
         * @returns The processed open_registration element.
         */
        processOpenRegistrationElement(target) {
            var _a;
            const openRegistrationElement = (_a = target === null || target === void 0 ? void 0 : target.querySelector('[name="open_registration"]')) !== null && _a !== void 0 ? _a : undefined;
            if (!openRegistrationElement)
                return;
            return openRegistrationElement.checked ? 1 : 0;
        }
        /**
         * Handles the form submission for saving changes.
         * @param e - The submit event.
         */
        async handleSave(e) {
            e.preventDefault();
            const target = e.target;
            const [id] = new TemplateResultConverter(this.datum.id).getRenderValues();
            if (!(target instanceof HTMLFormElement) || !id)
                return;
            const keys = Object.keys(this.datum).filter((key) => key !== "uuid");
            const target_groups = this.processTargetGroupElements(target);
            if (!target_groups)
                return;
            const datetimeLocalElements = this.processDatetimeLocalElements(target);
            if (!datetimeLocalElements)
                return;
            const openRegistration = this.processOpenRegistrationElement(target);
            if (openRegistration === undefined)
                return;
            const formData = new FormData(target);
            datetimeLocalElements.forEach(({ name, value }) => formData.set(name, value));
            const requestBody = Array.from(formData).reduce((acc, [key, value]) => {
                if (keys.includes(key)) {
                    acc[key] = value;
                }
                return acc;
            }, {});
            requestBody.target_groups = Object.values(target_groups);
            requestBody.open_registration = openRegistration;
            const response = await fetch(`/api/v1/contrib/eventmanagement/events/${id}`, { method: "PUT", body: JSON.stringify(requestBody) });
            if (response.ok) {
                target === null || target === void 0 ? void 0 : target.querySelectorAll("input, select, textarea").forEach((input) => {
                    input.setAttribute("disabled", "");
                });
                this.collapseAll();
                this.dispatchEvent(new CustomEvent("updated", {
                    detail: id,
                    bubbles: true,
                    composed: true,
                }));
                return;
            }
            if (!response.ok) {
                const error = await response.json();
                console.log(error);
            }
        }
        /**
         * Handles the form submission for deleting the event.
         * @param e - The click event.
         */
        async handleDelete(e) {
            e.preventDefault();
            const [id] = new TemplateResultConverter(this.datum.id).getRenderValues();
            if (!id) {
                return;
            }
            const response = await fetch(`/api/v1/contrib/eventmanagement/events/${id}`, { method: "DELETE" });
            if (response.status >= 200 && response.status <= 299) {
                this.dispatchEvent(new CustomEvent("deleted", {
                    detail: id,
                    bubbles: true,
                    composed: true,
                }));
                return;
            }
            if (response.status >= 400) {
                const error = await response.json();
                console.log(error);
            }
        }
        /**
         * Toggles the collapse state of a collapsible section.
         * @param e - The click event.
         */
        toggleCollapse(e) {
            const button = e.target;
            const { target } = button.dataset;
            if (!target)
                return;
            const collapsible = Array.from(this.collapsibles).find((collapsible) => `#${collapsible.id}` === target);
            if (!collapsible)
                return;
            if (collapsible.classList.contains("show")) {
                collapsible.classList.remove("show");
                return;
            }
            collapsible.classList.add("show");
        }
        /**
         * Collapses all the collapsible sections.
         */
        collapseAll() {
            this.collapsibles.forEach((collapsible) => {
                collapsible.classList.remove("show");
            });
        }
        /**
         * Expands all the collapsible sections.
         */
        expandAll() {
            this.collapsibles.forEach((collapsible) => {
                collapsible.classList.add("show");
            });
        }
        /**
         * Renders the element.
         * @returns The rendered template result.
         */
        render() {
            const { datum } = this;
            const shouldFold = window.innerWidth <= 420;
            return x `
      <form @submit=${this.handleSave}>
        <div
          class="mb-3 ${o$1({
            "btn-group": !shouldFold,
            "w-100": !shouldFold,
            "btn-group-vertical": shouldFold,
            "d-flex": shouldFold,
        })}"
          role="group"
          aria-label=${attr__("Event controls")}
        >
          <button
            @click=${this.toggleEdit}
            type="button"
            class="btn btn-outline-secondary"
          >
            <span class="start-edit pointer-events-none"
              >${litFontawesome_2(faEdit)}&nbsp;${__("Edit")}</span
            >
            <span class="abort-edit d-none pointer-events-none"
              >${litFontawesome_2(faTimes)}&nbsp;${__("Abort")}</span
            >
          </button>
          <button type="submit" class="btn btn-outline-secondary">
            ${litFontawesome_2(faSave)}
            <span>&nbsp;${__("Save")}</span>
          </button>
          <button
            @click=${this.handleDelete}
            type="button"
            class="btn btn-outline-secondary"
          >
            ${litFontawesome_2(faTrash)}
            <span>&nbsp;${__("Delete")}</span>
          </button>
          <button
            type="button"
            class="btn btn-outline-secondary"
            data-toggle="collapseAll"
            @click=${this.collapseAll}
          >
            ${litFontawesome_2(faCompressAlt)}
            <span>&nbsp;${__("Collapse All")}</span>
          </button>
        </div>

        <!-- Group 1: Basic Information -->
        <button
          type="button"
          class="btn btn-link btn-section w-100 text-left"
          data-toggle="collapse"
          data-target="#basicInfo"
          @click=${this.toggleCollapse}
        >
          <h4 class="pointer-events-none">${__("Basic Information")}</h4>
        </button>
        <div id="basicInfo" class="collapse px-3">
          <div class="form-row">
            <div class="form-group col">
              <label for="name">${__("Name")}</label>
              ${datum.name}
            </div>
            <div class="form-group col">
              <label for="event_type">${__("Event Type")}</label>
              ${datum.event_type}
            </div>
          </div>

          <label for="target_groups">${__("Target Groups")}</label>
          ${datum.target_groups}
        </div>

        <!-- Group 2: Age and Participants -->
        <button
          type="button"
          class="btn btn-link btn-section w-100 text-left"
          data-toggle="collapse"
          data-target="#ageAndParticipants"
          @click=${this.toggleCollapse}
        >
          <h4 class="pointer-events-none">${__("Age and Participants")}</h4>
        </button>
        <div id="ageAndParticipants" class="collapse px-3">
          <div class="form-row">
            <div class="form-group col">
              <label for="min_age">${__("Min Age")}</label>
              ${datum.min_age}
            </div>
            <div class="form-group col">
              <label for="max_age">${__("Max Age")}</label>
              ${datum.max_age}
            </div>
          </div>

          <div class="form-group">
            <label for="max_participants">${__("Max Participants")}</label>
            ${datum.max_participants}
          </div>
        </div>

        <!-- Group 3: Event Times -->
        <button
          type="button"
          class="btn btn-link btn-section w-100 text-left"
          data-toggle="collapse"
          data-target="#eventTimes"
          @click=${this.toggleCollapse}
        >
          <h4 class="pointer-events-none">${__("Event Times")}</h4>
        </button>
        <div id="eventTimes" class="collapse px-3">
          <div class="form-row">
            <div class="form-group col">
              <label for="start_time">${__("Start Time")}</label>
              ${datum.start_time}
            </div>
            <div class="form-group col">
              <label for="end_time">${__("End Time")}</label>
              ${datum.end_time}
            </div>
          </div>

          <div class="form-row">
            <div class="form-group col">
              <label for="registration_start"
                >${__("Registration Start")}</label
              >
              ${datum.registration_start}
            </div>
            <div class="form-group col">
              <label for="registration_end">${__("Registration End")}</label>
              ${datum.registration_end}
            </div>
          </div>
        </div>

        <!-- Group 4: Additional Information -->
        <button
          type="button"
          class="btn btn-link btn-section w-100 text-left"
          data-toggle="collapse"
          data-target="#additionalInfo"
          @click=${this.toggleCollapse}
        >
          <h4 class="pointer-events-none">${__("Additional Information")}</h4>
        </button>
        <div id="additionalInfo" class="collapse px-3">
          <div class="form-row">
            <div class="col">
              <div class="form-group">
                <label for="location">${__("Location")}</label>
                ${datum.location}
              </div>

              <div class="form-group">
                <label for="image">${__("Image")}</label>
                ${datum.image}
              </div>

              <div class="form-group">
                <label for="status">${__("Status")}</label>
                ${datum.status}
              </div>

              <div class="form-group">
                <label for="registration_link"
                  >${__("Registration Link")}</label
                >
                ${datum.registration_link}
              </div>

              <div class="form-check-inline">
                ${datum.open_registration}
                <label class="form-check-label" for="open_registration"
                  >${__("Open Registration")}</label
                >
              </div>
            </div>

            <div class="col">
              <div class="form-group h-100">
                <label for="description">${__("Description")}</label>
                ${datum.description}
              </div>
            </div>
          </div>
        </div>
      </form>
    `;
        }
    };
    /**
     * The static styles for the element.
     */
    LMSStaffEventCardForm.styles = [
        bootstrapStyles,
        skeletonStyles,
        utilityStyles,
        i$5 `
      svg {
        display: inline-block;
        width: 1em;
        height: 1em;
        color: #6c757d;
      }

      .btn:hover svg,
      .btn.active svg {
        color: #ffffff;
      }

      button {
        white-space: nowrap;
      }

      input[type="checkbox"].form-control {
        font-size: 0.375rem;
      }

      form {
        container-type: inline-size;
      }

      @container (max-width: 360px) {
        form .btn-group {
          flex-direction: column;
        }
      }
    `,
    ];
    __decorate([
        e$2({ type: Array })
    ], LMSStaffEventCardForm.prototype, "datum", void 0);
    __decorate([
        e$2({ state: true })
    ], LMSStaffEventCardForm.prototype, "_toast", void 0);
    __decorate([
        e$1(".collapse")
    ], LMSStaffEventCardForm.prototype, "collapsibles", void 0);
    __decorate([
        e$1("input, select, textarea")
    ], LMSStaffEventCardForm.prototype, "inputs", void 0);
    LMSStaffEventCardForm = __decorate([
        e$3("lms-staff-event-card-form")
    ], LMSStaffEventCardForm);
    var LMSStaffEventCardForm$1 = LMSStaffEventCardForm;

    let LMSStaffEventCardDeck = class LMSStaffEventCardDeck extends s {
        constructor() {
            super();
            this.events = [];
            this.event_types = [];
            this.target_groups = [];
            this.locations = [];
            this.nextPage = undefined;
            this.hasNoResults = false;
            this._page = 1;
            this._per_page = 20;
            this.data = [];
            this.cardStates = new Map();
            this.inputConverter = new InputConverter();
            this.sortableColumns = ["id"];
            this.sortableColumns = [
                ...this.sortableColumns,
                "name",
                "event_type",
                "min_age",
                "max_age",
                "max_participants",
                "start_time",
                "end_time",
                "registration_start",
                "registration_end",
                "location",
                "image",
                "status",
                "registration_link",
                "open_registration",
                "description",
            ];
        }
        connectedCallback() {
            super.connectedCallback();
            this.hydrate();
        }
        *getColumnData(query, data) {
            for (const [name, value] of Object.entries(query)) {
                yield [name, this.inputConverter.getInputTemplate({ name, value, data })];
            }
        }
        hydrate() {
            /** Here we initialize the card states so we can track them
             *  individually going forward. */
            this.events.forEach(() => {
                this.cardStates.set(crypto.getRandomValues(new Uint32Array(2)).join("-"), ["data"]);
            });
            const data = this.events.map((event) => {
                return Object.fromEntries(this.getColumnData(event, [
                    ["target_groups", this.target_groups],
                    ["location", this.locations],
                    ["event_type", this.event_types],
                ]));
            });
            /** Here we tag every datum with the uuid we generated earlier. */
            this.data = data.map((datum, index) => {
                const [uuid] = [...this.cardStates][index];
                return {
                    ...datum,
                    uuid,
                };
            });
        }
        updated(changedProperties) {
            super.updated(changedProperties);
            if (changedProperties.has("events")) {
                this.hydrate();
                this.requestUpdate();
            }
        }
        handleTabClick(event) {
            var _a, _b;
            event.preventDefault();
            const target = event.target;
            const tab = target.closest("li");
            if (!tab)
                return;
            const previousActiveTab = (_a = tab.closest("ul")) === null || _a === void 0 ? void 0 : _a.querySelector(".active");
            if (!previousActiveTab)
                return;
            previousActiveTab.classList.remove("active");
            (_b = tab.firstElementChild) === null || _b === void 0 ? void 0 : _b.classList.add("active");
            const { content, uuid } = tab.dataset;
            if (!content || !uuid)
                return;
            this.cardStates.set(uuid, [content]);
            this.requestUpdate();
        }
        handleSearch(e) {
            const { detail } = e;
            this.dispatchEvent(new CustomEvent("search", {
                detail,
                composed: true,
                bubbles: true,
            }));
        }
        render() {
            return x `
      <div class="container-fluid mx-0">
        <lms-staff-events-filter
          .sortableColumns=${this.sortableColumns}
          .event_types=${this.event_types}
          .target_groups=${this.target_groups}
          .locations=${this.locations}
        >
          <lms-search
            @search=${this.handleSearch}
            .sortableColumns=${this.sortableColumns}
          ></lms-search>
          <lms-pagination
            .nextPage=${this.nextPage}
            ._page=${this._page}
            ._per_page=${this._per_page}
          ></lms-pagination>
        </lms-staff-events-filter>
        <div class="card-deck card-deck-responsive">
          ${o$2(this.data, (datum) => {
            const { name, uuid } = datum;
            const [title] = new TemplateResultConverter(name).getRenderValues();
            const [state] = this.cardStates.get(uuid) || "data";
            return x `
              <div class="card mt-5">
                <div class="card-header">
                  <ul class="nav nav-tabs card-header-tabs">
                    <li
                      class="nav-item"
                      data-content="data"
                      data-uuid=${datum.uuid}
                      @click=${this.handleTabClick}
                    >
                      <a class="nav-link active" href="#">${__("Data")}</a>
                    </li>
                    <li
                      class="nav-item"
                      data-content="attendees"
                      data-uuid=${datum.uuid}
                      @click=${this.handleTabClick}
                    >
                      <a class="nav-link" href="#">${__("Waitlist")}</a>
                    </li>
                    <li
                      class="nav-item"
                      data-content="preview"
                      data-uuid=${datum.uuid}
                      @click=${this.handleTabClick}
                    >
                      <a class="nav-link">${__("Preview")}</a>
                    </li>
                  </ul>
                </div>
                <div class="card-body">
                  <h3 class="card-title">
                    ${x `<span class="badge badge-primary">${title}</span>`}
                  </h3>
                  <lms-staff-event-card-form
                    .datum=${datum}
                    ?hidden=${!(state === "data")}
                  ></lms-staff-event-card-form>
                  <lms-staff-event-card-attendees
                    ?hidden=${!(state === "attendees")}
                  ></lms-staff-event-card-attendees>
                  <lms-staff-event-card-preview
                    ?hidden=${!(state === "preview")}
                    .datum=${datum}
                  ></lms-staff-event-card-preview>
                </div>
              </div>
            `;
        })}
        </div>
      </div>
    `;
        }
    };
    LMSStaffEventCardDeck.styles = [
        bootstrapStyles,
        skeletonStyles,
        i$5 `
      .card-deck {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(100%, 1fr));
      }

      @media (min-width: 992px) {
        .card-deck {
          grid-gap: 1rem;
        }

        .card-deck {
          grid-template-columns: repeat(auto-fill, minmax(33.33%, 1fr));
        }
      }

      @media (min-width: 1200px) {
        .card-deck {
          grid-template-columns: repeat(auto-fill, minmax(25%, 1fr));
        }
      }

      @media (min-width: 1600px) {
        .card-deck {
          grid-template-columns: repeat(auto-fill, minmax(20%, 1fr));
        }
      }

      @media (min-width: 1920px) {
        .card-deck {
          grid-template-columns: repeat(auto-fill, minmax(16.67%, 1fr));
        }
      }
    `,
    ];
    __decorate([
        e$2({ type: Array })
    ], LMSStaffEventCardDeck.prototype, "events", void 0);
    __decorate([
        e$2({ type: Array })
    ], LMSStaffEventCardDeck.prototype, "event_types", void 0);
    __decorate([
        e$2({ type: Array })
    ], LMSStaffEventCardDeck.prototype, "target_groups", void 0);
    __decorate([
        e$2({ type: Array })
    ], LMSStaffEventCardDeck.prototype, "locations", void 0);
    __decorate([
        e$2({ type: Array })
    ], LMSStaffEventCardDeck.prototype, "nextPage", void 0);
    __decorate([
        e$2({ type: Boolean })
    ], LMSStaffEventCardDeck.prototype, "hasNoResults", void 0);
    __decorate([
        e$2({ type: Number })
    ], LMSStaffEventCardDeck.prototype, "_page", void 0);
    __decorate([
        e$2({ type: Number })
    ], LMSStaffEventCardDeck.prototype, "_per_page", void 0);
    LMSStaffEventCardDeck = __decorate([
        e$3("lms-staff-event-card-deck")
    ], LMSStaffEventCardDeck);
    var LMSStaffEventCardsDeck = LMSStaffEventCardDeck;

    let LMSStaffEventsFilter = class LMSStaffEventsFilter extends s {
        constructor() {
            super(...arguments);
            this.sortableColumns = ["id"];
            this.event_types = [];
            this.target_groups = [];
            this.locations = [];
        }
        handleSort(e) {
            const target = e.target;
            this.dispatchEvent(new CustomEvent("sort", {
                detail: { _order_by: target.value },
                bubbles: true,
                composed: true,
            }));
        }
        handleChange() {
            this.dispatchEvent(new CustomEvent("filter", {
                detail: {
                    filters: this.checkboxes,
                },
                bubbles: true,
                composed: true,
            }));
        }
        handleDropdownToggle(e) {
            const target = e.target;
            this.lmsDropdowns.forEach((lmsDropdown) => {
                if (lmsDropdown !== target) {
                    lmsDropdown.isOpen = false;
                }
            });
        }
        render() {
            return x `
      <nav
        class="navbar navbar-light bg-white border rounded sticky-top"
        @toggle=${this.handleDropdownToggle}
      >
        <lms-dropdown .label=${__("Sort by")} @change=${this.handleSort}>
          ${o$2(this.sortableColumns, (column) => x `
              <div class="dropdown-item">
                <input
                  type="radio"
                  name="_order_by"
                  id="_order_by_${column}"
                  value=${column}
                  ?checked=${column === "id"}
                />
                <label for="_order_by_${column}"> ${__(column)} </label>
              </div>
            `)}
        </lms-dropdown>
        <div @change=${this.handleChange}>
          <lms-dropdown .label=${__("Event type")}>
            ${o$2(this.event_types, (event_type) => x `
                <div class="dropdown-item">
                  <input
                    type="checkbox"
                    name="event_type"
                    id="event_types_${event_type.id}"
                    value=${event_type.id}
                  />
                  <label for="event_types_${event_type.id}">
                    ${event_type.name}
                  </label>
                </div>
              `)}
          </lms-dropdown>
          <lms-dropdown .label=${__("Target group")}>
            ${o$2(this.target_groups, (target_group) => x `
                <div class="dropdown-item">
                  <input
                    type="checkbox"
                    name="target_group"
                    id="target_groups_${target_group.id}"
                    value=${target_group.id}
                  />
                  <label for="target_groups_${target_group.id}">
                    ${target_group.name}
                  </label>
                </div>
              `)}
          </lms-dropdown>
          <lms-dropdown .label=${__("Location")}>
            ${o$2(this.locations, (location) => x `
                <div class="dropdown-item">
                  <input
                    type="checkbox"
                    name="location"
                    id="locations_${location.id}"
                    value=${location.id}
                  />
                  <label for="locations_${location.id}">
                    ${location.name}
                  </label>
                </div>
              `)}
          </lms-dropdown>
        </div>
        <slot></slot>
      </nav>
    `;
        }
    };
    LMSStaffEventsFilter.styles = [bootstrapStyles, utilityStyles];
    __decorate([
        e$2({ type: Array })
    ], LMSStaffEventsFilter.prototype, "sortableColumns", void 0);
    __decorate([
        e$2({ type: Array })
    ], LMSStaffEventsFilter.prototype, "event_types", void 0);
    __decorate([
        e$2({ type: Array })
    ], LMSStaffEventsFilter.prototype, "target_groups", void 0);
    __decorate([
        e$2({ type: Array })
    ], LMSStaffEventsFilter.prototype, "locations", void 0);
    __decorate([
        e$1("lms-dropdown")
    ], LMSStaffEventsFilter.prototype, "lmsDropdowns", void 0);
    __decorate([
        e$1("input[type=checkbox]")
    ], LMSStaffEventsFilter.prototype, "checkboxes", void 0);
    LMSStaffEventsFilter = __decorate([
        e$3("lms-staff-events-filter")
    ], LMSStaffEventsFilter);
    var LMSStaffEventsFilter$1 = LMSStaffEventsFilter;

    let LMSTableControls = class LMSTableControls extends s {
        render() {
            return x `
      <nav
        class="navbar navbar-light bg-white border border-bottom-0 sticky-top"
      >
        <slot></slot>
      </nav>
    `;
        }
    };
    LMSTableControls.styles = [bootstrapStyles];
    LMSTableControls = __decorate([
        e$3("lms-table-controls")
    ], LMSTableControls);
    var LMSTableControls$1 = LMSTableControls;

    let LMSAnchor = class LMSAnchor extends s {
        constructor() {
            super(...arguments);
            this.href = {};
            this.target = "_self";
        }
        assembleURI() {
            const { path, query, params, fragment } = this.href;
            let uri = path !== null && path !== void 0 ? path : "";
            if (query) {
                uri += "?";
            }
            if (params) {
                uri += Object.entries(params)
                    .map(([key, value]) => `${key}=${value}`)
                    .join("&");
            }
            if (fragment) {
                uri += `#${fragment}`;
            }
            return uri;
        }
        hasChanged() {
            return (newValues, oldValues) => {
                return Object.keys(newValues).some((key) => newValues.get(key) !== oldValues.get(key));
            };
        }
        handleClick(e) {
            e.preventDefault();
            const assembledURI = this.assembleURI();
            switch (this.target) {
                case "_blank":
                    window.open(assembledURI, "_blank");
                    break;
                case "_parent":
                    if (window.parent) {
                        window.parent.location.href = assembledURI;
                    }
                    break;
                case "_top":
                    if (window.top) {
                        window.top.location.href = assembledURI;
                    }
                    break;
                case "_self":
                default:
                    window.location.href = assembledURI;
            }
        }
        render() {
            if (Object.values(this.href).every((value) => value === undefined)) {
                console.error("href is not a valid URIComponents object");
                return A;
            }
            return x `
      <a
        @click=${this.handleClick}
        .href=${this.assembleURI()}
        .target=${this.target}
      >
        <slot></slot>
      </a>
    `;
        }
    };
    LMSAnchor.styles = [
        bootstrapStyles,
        i$5 `
      :host {
        display: inline-flex;
      }
    `,
    ];
    __decorate([
        e$2({ type: Object, attribute: "data-href" })
    ], LMSAnchor.prototype, "href", void 0);
    __decorate([
        e$2({ type: String })
    ], LMSAnchor.prototype, "target", void 0);
    LMSAnchor = __decorate([
        e$3("lms-anchor")
    ], LMSAnchor);
    var LMSAnchor$1 = LMSAnchor;

    let LMSCard = class LMSCard extends s {
        constructor() {
            super(...arguments);
            this.title = "";
            this.text = "";
            this.image = {};
            this.links = [];
            this.listItems = [];
        }
        render() {
            return x `
      <div class="card">
        <img
          src=${this.image.src}
          class="card-img-top"
          alt=${this.image.alt}
          ?hidden=${!this.image.src}
        />
        <div class="card-body">
          <h5
            class="card-title ${o$1({
            "mb-0": !this.text,
        })}"
            ?hidden=${!this.title}
          >
            ${this.title}
          </h5>
          <p class="card-text" ?hidden=${!this.text}>${this.text}</p>
        </div>
        <ul
          class="list-group list-group-flush"
          ?hidden=${!this.listItems.length}
        >
          ${this.listItems.map((listItem) => x `<li class="list-group-item">${listItem}</li>`)}
        </ul>
        <div class="card-body" ?hidden=${!this.links.length}>
          ${this.links.length
            ? this.links.map((link) => x `<a href=${link.href} class="card-link">${link.text}</a>`)
            : A}
        </div>
      </div>
    `;
        }
    };
    LMSCard.styles = [
        bootstrapStyles,
        i$5 `
      .card:hover {
        cursor: pointer;
        postion: relative;
        top: -3px;
        box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
        border: 1px solid var(--primary);
      }

      .card img {
        aspect-ratio: 4 / 3;
        object-fit: cover;
      }

      svg {
        display: inline-block;
        width: 0.75em;
        height: 0.75em;
        color: #6c757d;
      }
    `,
    ];
    __decorate([
        e$2({ type: String })
    ], LMSCard.prototype, "title", void 0);
    __decorate([
        e$2({ type: String })
    ], LMSCard.prototype, "text", void 0);
    __decorate([
        e$2({ type: Object })
    ], LMSCard.prototype, "image", void 0);
    __decorate([
        e$2({ type: Array })
    ], LMSCard.prototype, "links", void 0);
    __decorate([
        e$2({ type: Array })
    ], LMSCard.prototype, "listItems", void 0);
    LMSCard = __decorate([
        e$3("lms-card")
    ], LMSCard);
    var LMSCard$1 = LMSCard;

    let LMSCardDetailsModal = class LMSCardDetailsModal extends s {
        constructor() {
            super(...arguments);
            this.event = {};
            this.isOpen = false;
            this.event_types = [];
            this.locations = [];
            this.target_groups = [];
            this.locale = "en";
        }
        connectedCallback() {
            super.connectedCallback();
            const event_types = async () => {
                const response = await fetch("/api/v1/contrib/eventmanagement/public/event_types");
                return response.json();
            };
            event_types().then((event_types) => (this.event_types = event_types));
            const locations = async () => {
                const response = await fetch("/api/v1/contrib/eventmanagement/public/locations");
                return response.json();
            };
            locations().then((locations) => (this.locations = locations));
            const target_groups = async () => {
                const response = await fetch("/api/v1/contrib/eventmanagement/public/target_groups");
                return response.json();
            };
            target_groups().then((target_groups) => (this.target_groups = target_groups));
            this.locale = document.documentElement.lang;
        }
        handleSimulatedBackdropClick(event) {
            if (event.target === event.currentTarget) {
                this.toggleModal();
            }
        }
        toggleModal() {
            const { renderRoot } = this;
            this.isOpen = !this.isOpen;
            document.body.style.overflow = this.isOpen ? "hidden" : "auto";
            const lmsModal = renderRoot.getElementById("lms-modal");
            if (lmsModal) {
                lmsModal.style.overflowY = this.isOpen ? "scroll" : "auto";
            }
            if (!this.isOpen) {
                this.dispatchEvent(new CustomEvent("close", {
                    bubbles: true,
                    composed: true,
                }));
            }
        }
        willUpdate() {
            const { event } = this;
            const { event_type, location, target_groups } = event;
            // Resolve event_type and location ids to their state representations
            if (event_type && typeof event_type === "string") {
                const et = this.event_types.find((type) => type.id === parseInt(event_type, 10));
                this.event.event_type = et !== null && et !== void 0 ? et : {};
            }
            if (location && typeof location === "string") {
                const loc = this.locations.find((loc) => loc.id === parseInt(location, 10));
                this.event.location = loc !== null && loc !== void 0 ? loc : {};
            }
            if (target_groups &&
                target_groups.every((tg) => ({}.hasOwnProperty.call(tg, "target_group_id")))) {
                const selectedTargetGroups = this.target_groups.filter((target_group) => target_groups.some((tg) => tg.target_group_id === target_group.id));
                this.event.target_groups = selectedTargetGroups.map((tg) => {
                    var _a, _b;
                    return ({
                        ...tg,
                        fee: (_b = (_a = target_groups.find((etg) => etg.target_group_id === tg.id)) === null || _a === void 0 ? void 0 : _a.fee) !== null && _b !== void 0 ? _b : 0,
                    });
                });
            }
        }
        updated() {
            if (this.isOpen && this.closeButton) {
                this.closeButton.focus();
            }
        }
        renderTargetGroupInfo(targetGroupFees, noFees) {
            var _a;
            const quantity = (_a = targetGroupFees === null || targetGroupFees === void 0 ? void 0 : targetGroupFees.length) !== null && _a !== void 0 ? _a : 0;
            return o$2(targetGroupFees, (targetGroupFee, index) => {
                const hasTargetGroupId = {}.hasOwnProperty.call(targetGroupFee, "target_group_id");
                if (hasTargetGroupId)
                    return A;
                const { name, min_age, max_age, fee } = targetGroupFee;
                return noFees
                    ? x `<span
            >${name}${index - 1 < quantity && !(quantity === 1)
                    ? ", "
                    : ""}</span
          >`
                    : x `
            <tr>
              <td>${name}</td>
              <td>${min_age} - ${max_age}</td>
              <td>${fee}</td>
            </tr>
          `;
            });
        }
        render() {
            var _a;
            const { name, description, location, image, registration_link, start_time, end_time, target_groups, } = this.event;
            const noFees = (_a = target_groups === null || target_groups === void 0 ? void 0 : target_groups.every((target_group) => target_group.fee === 0)) !== null && _a !== void 0 ? _a : true;
            return x `
      <div class="backdrop" ?hidden=${!this.isOpen}></div>
      <div
        class="modal fade ${o$1({
            "d-block": this.isOpen,
            show: this.isOpen,
        })}"
        id="lms-modal"
        tabindex="-1"
        role="dialog"
        aria-labelledby="lms-modal-title"
        aria-hidden="true"
        @click=${this.handleSimulatedBackdropClick}
      >
        <div
          class="modal-dialog modal-xl modal-dialog-centered"
          role="document"
        >
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="lms-modal-title">
                ${name !== null && name !== void 0 ? name : "Event"}
              </h5>
              <button
                @click=${this.toggleModal}
                type="button"
                class="close"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              <div class="row">
                <div class="col">
                  <div>
                    <p class="wrapper">
                      <span>${litFontawesome_2(faCalendar)}</span>
                      <strong>${__("Date and Time")}</strong>
                    </p>
                    <p class="wrapper">
                      ${this.formatDatetimeByLocale(start_time)}
                      <span>${litFontawesome_2(faArrowRight)}</span>
                      ${this.formatDatetimeByLocale(end_time)}
                    </p>
                  </div>

                  <div>
                    <p class="wrapper">
                      <span>${litFontawesome_2(faInfoCircle)}</span>
                      <strong>${__("Description")}</strong>
                    </p>
                    <p>${description}</p>
                  </div>
                </div>
                <div class="col">
                  <img
                    src=${image}
                    ?hidden=${!image}
                    class="w-100 mb-4 rounded"
                  />

                  <div>
                    <p class="wrapper">
                      <span>${litFontawesome_2(faCreditCard)}</span>
                      <strong>${__("Fees")}</strong>
                    </p>
                    <div ?hidden=${!noFees}>
                      <p>${__("No fees")}</p>
                      <p class="wrapper">
                        <span>${litFontawesome_2(faUsers)}</span>
                        <strong>${__("Target Groups")}</strong>
                      </p>
                      <p>
                        ${this.renderTargetGroupInfo(target_groups, noFees)}
                      </p>
                    </div>
                    <table
                      class="table table-sm table-borderless"
                      ?hidden=${noFees}
                    >
                      <thead>
                        <tr>
                          <th scope="col">${__("Target Group")}</th>
                          <th scope="col">${__("Age Range")}</th>
                          <th scope="col">${__("Fee")}</th>
                        </tr>
                      </thead>
                      <tbody>
                        ${this.renderTargetGroupInfo(target_groups, noFees)}
                      </tbody>
                    </table>
                  </div>

                  <div>
                    <p class="wrapper">
                      <span>${litFontawesome_2(faMapMarker)}</span>
                      <strong>${__("Location")}</strong>
                    </p>
                    <p>
                      ${typeof location === "string"
            ? A
            : this.formatAddressByLocale(location)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-secondary"
                data-dismiss="modal"
                @click=${this.toggleModal}
              >
                ${__("Close")}
              </button>
              <a
                role="button"
                class="btn btn-primary"
                ?hidden=${!registration_link}
                href=${registration_link}
              >
                ${__("Register")}
              </a>
            </div>
          </div>
        </div>
      </div>
    `;
        }
        formatDatetimeByLocale(datetime) {
            if (datetime) {
                return new Intl.DateTimeFormat(this.locale, {
                    dateStyle: "full",
                    timeStyle: "short",
                }).format(new Date(datetime));
            }
            return A;
        }
        formatAddressByLocale(address) {
            if (address) {
                const { name, street, number, city, zip, country } = address;
                return x ` <strong>${name}</strong><br />
        ${street} ${number}<br />
        ${zip} ${city}<br />
        ${country}`;
            }
            return A;
        }
    };
    LMSCardDetailsModal.styles = [
        bootstrapStyles,
        skeletonStyles,
        i$5 `
      .backdrop {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgb(0 0 0 / 50%);
        z-index: 1048;
      }

      svg {
        display: inline-block;
        width: 1em;
        height: 1em;
        color: #6c757d;
      }

      .wrapper {
        display: inline-flex;
        align-items: center;
        gap: 0.25em;
      }

      img {
        aspect-ratio: 16 / 9;
        object-fit: cover;
      }
    `,
    ];
    __decorate([
        e$2({ type: Object })
    ], LMSCardDetailsModal.prototype, "event", void 0);
    __decorate([
        e$2({ type: Boolean })
    ], LMSCardDetailsModal.prototype, "isOpen", void 0);
    __decorate([
        t$1()
    ], LMSCardDetailsModal.prototype, "event_types", void 0);
    __decorate([
        t$1()
    ], LMSCardDetailsModal.prototype, "locations", void 0);
    __decorate([
        t$1()
    ], LMSCardDetailsModal.prototype, "target_groups", void 0);
    __decorate([
        t$1()
    ], LMSCardDetailsModal.prototype, "locale", void 0);
    __decorate([
        i$2(".close")
    ], LMSCardDetailsModal.prototype, "closeButton", void 0);
    LMSCardDetailsModal = __decorate([
        e$3("lms-card-details-modal")
    ], LMSCardDetailsModal);
    var LMSCardDetailsModal$1 = LMSCardDetailsModal;

    let LMSDropdown = class LMSDropdown extends s {
        constructor() {
            super(...arguments);
            this.isHidden = false;
            this.shouldFold = false;
            this.isOpen = false;
            this.label = "";
        }
        handleDropdownToggle() {
            this.dispatchEvent(new CustomEvent("toggle", { bubbles: true, composed: true }));
            this.isOpen = !this.isOpen;
        }
        render() {
            return x `
      <div
        class="btn-group ${o$1({
            "d-none": this.isHidden,
            "w-100": this.shouldFold,
        })}"
        dropdown-menu-wrapper
      >
        <button
          type="button"
          class="btn btn-outline-secondary dropdown-toggle ${o$1({
            "btn-sm": this.shouldFold,
        })}"
          aria-haspopup="true"
          aria-expanded=${this.isOpen}
          @click=${this.handleDropdownToggle}
        >
          ${this.label}
        </button>
        <div class="dropdown-menu p-2 ${o$1({ show: this.isOpen })}">
          <slot></slot>
        </div>
      </div>
    `;
        }
    };
    LMSDropdown.styles = [bootstrapStyles];
    __decorate([
        e$2({ type: Boolean })
    ], LMSDropdown.prototype, "isHidden", void 0);
    __decorate([
        e$2({ type: Boolean })
    ], LMSDropdown.prototype, "shouldFold", void 0);
    __decorate([
        e$2({ type: Boolean })
    ], LMSDropdown.prototype, "isOpen", void 0);
    __decorate([
        e$2({ type: String })
    ], LMSDropdown.prototype, "label", void 0);
    __decorate([
        e$1("input")
    ], LMSDropdown.prototype, "inputs", void 0);
    LMSDropdown = __decorate([
        e$3("lms-dropdown")
    ], LMSDropdown);
    var LMSDropdown$1 = LMSDropdown;

    class RequestHandler {
        constructor(endpoints) {
            this.endpoints = {};
            if (endpoints instanceof Map) {
                endpoints.forEach((value, key) => {
                    this.endpoints[key] = value;
                });
            }
            else {
                this.endpoints = endpoints;
            }
        }
        async request(endpoint, queryParams) {
            const endpointData = this.endpoints[endpoint];
            if (!endpointData) {
                throw new Error(`Endpoint not found: ${endpoint}`);
            }
            const requestInfo = endpointData.requestInfo || {};
            let cacheMode;
            const userAgent = navigator.userAgent.toLowerCase();
            if (userAgent.includes("chrome")) {
                cacheMode = endpointData.ignoreCache ? "no-cache" : "no-store";
            }
            else if (userAgent.includes("firefox")) {
                cacheMode = endpointData.ignoreCache ? "no-cache" : "default";
            }
            else {
                // For other browsers, use the default behavior
                cacheMode = endpointData.ignoreCache
                    ? "no-cache"
                    : endpointData.cache
                        ? "default"
                        : "force-cache";
            }
            let url = endpointData.url;
            if (queryParams) {
                const searchParams = new URLSearchParams(queryParams);
                url += `?${searchParams.toString()}`;
            }
            else if (endpointData.queryParams) {
                const searchParams = new URLSearchParams(endpointData.queryParams);
                url += `?${searchParams.toString()}`;
            }
            const response = await fetch(url, {
                cache: cacheMode,
                headers: {
                    ...requestInfo.headers,
                    "Content-Type": "application/json",
                },
                method: requestInfo.method || "GET",
                body: requestInfo.body ? JSON.stringify(requestInfo.body) : undefined,
            });
            return response;
        }
    }
    const endpoints = {
        getEventsPublic: {
            url: "/api/v1/contrib/eventmanagement/public/events",
            cache: false,
        },
        getTargetGroupsPublic: {
            url: "/api/v1/contrib/eventmanagement/public/target_groups",
            cache: true,
        },
        getEventTypesPublic: {
            url: "/api/v1/contrib/eventmanagement/public/event_types",
            cache: true,
        },
        getLocationsPublic: {
            url: "/api/v1/contrib/eventmanagement/public/locations",
            cache: true,
        },
    };
    const requestHandler = new RequestHandler(endpoints);

    function deepCopy(obj) {
        if (obj === null || typeof obj !== "object")
            return obj;
        if (obj instanceof Date)
            return new Date(obj.getTime());
        if (Array.isArray(obj))
            return obj.map((item) => deepCopy(item));
        const newObj = Object.create(Object.getPrototypeOf(obj));
        for (const key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                newObj[key] = deepCopy(obj[key]);
            }
        }
        return newObj;
    }
    function isDeepEqual(obj1, obj2) {
        if (obj1 === obj2) {
            return true;
        }
        if (typeof obj1 !== "object" ||
            obj1 === null ||
            typeof obj2 !== "object" ||
            obj2 === null) {
            return false;
        }
        const keys1 = Object.keys(obj1);
        const keys2 = Object.keys(obj2);
        if (keys1.length !== keys2.length) {
            return false;
        }
        for (const key of keys1) {
            if (!keys2.includes(key)) {
                return false;
            }
            if (typeof obj1[key] === "function" ||
                typeof obj2[key] === "function") {
                if (obj1[key].toString() !== obj2[key].toString()) {
                    return false;
                }
            }
            else if (typeof obj1[key] === "object" &&
                typeof obj2[key] === "object") {
                if (!isDeepEqual(obj1[key], obj2[key])) {
                    return false;
                }
            }
            else if (obj1[key] !== obj2[key]) {
                return false;
            }
        }
        return true;
    }
    function throttle(callback, delay) {
        let previousCall = new Date().getTime();
        return function () {
            const time = new Date().getTime();
            if (time - previousCall >= delay) {
                previousCall = time;
                callback();
            }
        };
    }
    function debounce(func, wait, immediate) {
        let timeout = null;
        return function (...args) {
            const later = function () {
                timeout = null;
                if (!immediate)
                    func.apply(this, args);
            };
            const callNow = immediate && !timeout;
            if (timeout !== null) {
                clearTimeout(timeout);
            }
            timeout = setTimeout(later, wait);
            if (callNow) {
                func.apply(this, args);
            }
        };
    }

    let LMSEventsFilter = class LMSEventsFilter extends s {
        get eventsDeepCopy() {
            return this._eventsDeepCopy;
        }
        set eventsDeepCopy(value) {
            if (this._eventsDeepCopy.length === 0) {
                this._eventsDeepCopy = value;
            }
        }
        facetsStrategyManager() {
            switch (this.facetsStrategy) {
                case "preserve":
                    return this.eventsDeepCopy;
                case "update":
                    return this.events;
                default:
                    throw new Error("Invalid facetsStrategy");
            }
        }
        constructor() {
            super();
            this.shouldFold = window.innerWidth <= 992;
            this.events = [];
            this.facetsStrategy = "preserve";
            this.isHidden = this.shouldFold;
            this.facets = {};
            this.event_types = [];
            this.target_groups = [];
            this.locations = [];
            this.activeFilters = new Map();
            this.inputHandlers = {
                checkbox: (input) => {
                    if (input.id === "open_registration") {
                        return input.checked;
                    }
                    const { value } = input;
                    if (value) {
                        return input.checked ? value : false;
                    }
                    return input.checked ? input.id : false;
                },
                radio: (input) => (input.checked ? input.value : false),
                date: (input) => input.value,
                number: (input) => input.value,
                default: (input) => input.value,
            };
            this.resetHandlers = {
                checkbox: (input) => {
                    if (input.id === "open_registration") {
                        input.checked = true;
                        return;
                    }
                    input.checked = false;
                },
                radio: (input) => {
                    input.checked = false;
                },
                date: (input) => {
                    input.value = "";
                },
                number: (input) => {
                    if (["min_age", "max_age"].includes(input.id)) {
                        input.value = "";
                        return;
                    }
                    input.value = input.min;
                },
                default: (input) => {
                    input.value = "";
                },
            };
            this._eventsDeepCopy = [];
            this.throttledHandleResize = throttle(this.handleResize.bind(this), 250);
        }
        handleResize() {
            this.shouldFold = window.innerWidth <= 992;
            this.isHidden = this.shouldFold;
            this.requestUpdate();
        }
        connectedCallback() {
            super.connectedCallback();
            window.addEventListener("resize", this.throttledHandleResize);
            requestHandler
                .request("getEventTypesPublic")
                .then((response) => response.json())
                .then((event_types) => (this.event_types = event_types));
            requestHandler
                .request("getTargetGroupsPublic")
                .then((response) => response.json())
                .then((target_groups) => (this.target_groups = target_groups));
            requestHandler
                .request("getLocationsPublic")
                .then((response) => response.json())
                .then((locations) => (this.locations = locations));
        }
        disconnectedCallback() {
            super.disconnectedCallback();
            window.removeEventListener("resize", this.throttledHandleResize);
        }
        willUpdate() {
            this.eventsDeepCopy = deepCopy(this.events);
            const events = this.facetsStrategyManager();
            if (!events.length)
                return;
            this.facets = {
                eventTypeIds: [...new Set(events.map((event) => event.event_type))],
                targetGroupIds: [
                    ...new Set(events.flatMap((event) => event.target_groups.map((target_group) => target_group.selected ? target_group.target_group_id : NaN))),
                ].filter(Number.isInteger),
                locationIds: [...new Set(events.map((event) => event.location))],
                ...events
                    .map((event) => {
                    const { event_type, location, target_groups, ...rest } = event; // eslint-disable-line @typescript-eslint/no-unused-vars
                    return rest;
                })
                    .reduce((acc, curr) => ({ ...acc, ...curr }), {}),
            };
        }
        handleReset() {
            this.inputs.forEach((input) => this.resetHandlers[input.type](input));
            this.dispatchEvent(new CustomEvent("filter", {
                detail: "",
                composed: true,
                bubbles: true,
            }));
        }
        isAllowedFilter(name, value, exclude) {
            if (!name)
                return false;
            return !(name && exclude.includes(name.toString()) && value === false);
        }
        getParamsFromActiveFilters() {
            var _a;
            return [...((_a = this.inputs) !== null && _a !== void 0 ? _a : [])]
                .filter((input) => input.value || input.checked)
                .map((input) => {
                var _a;
                const handler = ((_a = this.inputHandlers) === null || _a === void 0 ? void 0 : _a[input.type]) || this.inputHandlers.default;
                if (!handler)
                    return [input.name, undefined];
                const value = handler(input);
                return [input.name, value];
            })
                .filter(([name, value]) => this.isAllowedFilter(name, value, [
                "event_type",
                "target_group",
                "location",
                "_order_by",
            ]));
        }
        handleChange() {
            const query = new URLSearchParams();
            this.getParamsFromActiveFilters().forEach(([name, value]) => {
                if (typeof name === "string" && value !== undefined) {
                    return query.append(name, value === null || value === void 0 ? void 0 : value.toString());
                }
            });
            this.dispatchEvent(new CustomEvent("filter", {
                detail: query.toString(),
                composed: true,
                bubbles: true,
            }));
        }
        handleSearch(e) {
            const { q } = e.detail;
            const query = new URLSearchParams();
            this.getParamsFromActiveFilters().forEach(([name, value]) => {
                if (typeof name === "string" && value !== undefined) {
                    return query.append(name, value === null || value === void 0 ? void 0 : value.toString());
                }
            });
            this.dispatchEvent(new CustomEvent("search", {
                detail: query.toString() + (q ? `&q=${q}` : ""),
                composed: true,
                bubbles: true,
            }));
        }
        emitChange(e) {
            const target = e.target;
            if (target) {
                target.dispatchEvent(new Event("change", { composed: true, bubbles: true }));
            }
        }
        handleHideToggle() {
            this.isHidden = !this.isHidden;
            this.dispatchEvent(new CustomEvent("hide", {
                detail: this.isHidden,
                composed: true,
                bubbles: true,
            }));
        }
        handleDropdownToggle(e) {
            const target = e.target;
            this.lmsDropdowns.forEach((lmsDropdown) => {
                if (lmsDropdown !== target) {
                    lmsDropdown.isOpen = false;
                }
            });
        }
        render() {
            return x `
      <div class="card" @change=${this.handleChange}>
        <div
          class="card-header container-fluid ${o$1({
            "justify-content-between": !this.isHidden,
            "justify-content-center": this.isHidden,
            "flex-column": this.shouldFold,
        })} sticky-top bg-white"
        >
          <div class="row">
            <div
              class="col-1 ${o$1({
            "d-none": this.shouldFold,
        })}"
            >
              <h5
                class="nobr ${o$1({
            "d-inline": !this.shouldFold,
        })}"
              >
                ${__("Filter")}
              </h5>
            </div>

            <div
              class=${o$1({
            "col-3": !this.shouldFold,
            "mb-3": this.shouldFold,
            "col-12": this.shouldFold,
        })}
            >
              <lms-search
                @search=${this.handleSearch}
                .sortableColumns=${["name", "description"]}
              ></lms-search>
            </div>

            <div
              class=${o$1({
            col: !this.shouldFold,
            "col-12": this.shouldFold,
        })}
            >
              <div
                class="btn-group ${o$1({
            "d-none": !this.shouldFold,
            "w-100": this.shouldFold,
        })}"
              >
                <button
                  type="button"
                  class="btn btn-outline-secondary btn-sm"
                  @click=${this.handleHideToggle}
                  aria-label=${this.isHidden
            ? attr__("Show filters")
            : attr__("Hide filters")}
                >
                  ${this.isHidden ? __("Show filters") : __("Hide filters")}
                </button>
                <button
                  type="button"
                  class="btn btn-outline-secondary btn-sm"
                  @click=${this.handleReset}
                >
                  ${__("Reset filters")}
                </button>
              </div>

              <div
                class="dropdowns ${o$1({
            "d-flex": !this.shouldFold,
            "flex-wrap": !this.shouldFold,
            "gap-3": !this.shouldFold,
        })}"
              >
                <lms-dropdown
                  .isHidden=${this.isHidden}
                  .shouldFold=${this.shouldFold}
                  .label=${__("Sort by")}
                  @toggle=${this.handleDropdownToggle}
                >
                  ${o$2(["start_time", "end_time", "event_type", "location"], (value, index) => x `
                      <div class="dropdown-item">
                        <input
                          type="radio"
                          id="_order_by_${value}"
                          name="_order_by"
                          value=${value}
                          ?checked=${index === 0}
                        />
                        <label for="_order_by_${value}">${__(value)}</label>
                      </div>
                    `)}
                </lms-dropdown>

                <lms-dropdown
                  .isHidden=${this.isHidden}
                  .shouldFold=${this.shouldFold}
                  .label=${__("Event Type")}
                  @toggle=${this.handleDropdownToggle}
                >
                  ${o$2(this.facets.eventTypeIds, (eventTypeId) => {
            var _a;
            return x `
                      <div class="dropdown-item">
                        <input
                          type="checkbox"
                          class="form-check-input"
                          name="event_type"
                          id="event_type_${eventTypeId}"
                          value=${eventTypeId}
                        />
                        <label
                          class="form-check-label"
                          for="event_type_${eventTypeId}"
                          >${(_a = this.event_types.find((event_type) => event_type.id === parseInt(eventTypeId, 10))) === null || _a === void 0 ? void 0 : _a.name}</label
                        >
                      </div>
                    `;
        })}
                </lms-dropdown>

                <lms-dropdown
                  .isHidden=${this.isHidden}
                  .shouldFold=${this.shouldFold}
                  .label=${__("Target Group")}
                  @toggle=${this.handleDropdownToggle}
                >
                  ${o$2(this.facets.targetGroupIds, (targetGroupId) => {
            var _a;
            return x `
                      <div class="dropdown-item">
                        <input
                          type="checkbox"
                          class="form-check-input"
                          name="target_group"
                          id="target_group_${targetGroupId}"
                          value=${targetGroupId}
                        />
                        <label
                          class="form-check-label"
                          for="target_group_${targetGroupId}"
                          >${(_a = this.target_groups.find((target_group) => target_group.id === targetGroupId)) === null || _a === void 0 ? void 0 : _a.name}</label
                        >
                      </div>
                    `;
        })}
                </lms-dropdown>

                <lms-dropdown
                  .isHidden=${this.isHidden}
                  .shouldFold=${this.shouldFold}
                  .label=${__("Age")}
                  @toggle=${this.handleDropdownToggle}
                >
                  <div class="dropdown-item">
                    <label for="min_age">${__("Min Age")}</label>
                    <input
                      type="number"
                      class="form-control form-control-sm"
                      id="min_age"
                      name="min_age"
                      min="0"
                      max="120"
                      value=""
                      @input=${this.emitChange}
                    />
                    <label for="max_age">${__("Max Age")}</label>
                    <input
                      type="number"
                      class="form-control form-control-sm"
                      id="max_age"
                      name="max_age"
                      min="0"
                      max="120"
                      value=""
                      @input=${this.emitChange}
                    />
                  </div>
                </lms-dropdown>

                <!-- <lms-dropdown
                  .isHidden=${this.isHidden}
                  .shouldFold=${this.shouldFold}
                  .label=${__("Registration & Dates")}
                  @toggle=${this.handleDropdownToggle}
                >
                  <div class="dropdown-item">
                    <input
                      type="checkbox"
                      class="form-check-input"
                      id="open_registration"
                      name="open_registration"
                      checked
                    />
                    <label for="open_registration"
                      >${__("Open Registration")}</label
                    >
                  </div>
                  <div class="dropdown-item">
                    <label for="start_time">${__("Start Date")}</label>
                    <input
                      type="date"
                      class="form-control form-control-sm"
                      id="start_time"
                      name="start_time"
                    />
                    <label for="end_time">${__("End Date")}</label>
                    <input
                      type="date"
                      class="form-control form-control-sm"
                      id="end_time"
                      name="end_time"
                    /></div
                ></lms-dropdown> -->

                <lms-dropdown
                  .isHidden=${this.isHidden}
                  .shouldFold=${this.shouldFold}
                  .label=${__("Location")}
                  @toggle=${this.handleDropdownToggle}
                >
                  ${o$2(this.facets.locationIds, (locationId) => {
            var _a;
            return x ` <div class="dropdown-item">
                        <input
                          type="checkbox"
                          class="form-check-input"
                          name="location"
                          id="location_${locationId}"
                          value=${locationId}
                        />
                        <label
                          class="form-check-label"
                          for="location_${locationId}"
                          >${(_a = this.locations.find((location) => location.id === parseInt(locationId, 10))) === null || _a === void 0 ? void 0 : _a.name}</label
                        >
                      </div>`;
        })}
                </lms-dropdown>

                <!-- <lms-dropdown
                  .isHidden=${this.isHidden}
                  .shouldFold=${this.shouldFold}
                  .label=${__("Fee")}
                  @toggle=${this.handleDropdownToggle}
                >
                  <div class="dropdown-item">
                    <label for="fee">${__("Fee")}</label>
                    <input
                      type="number"
                      class="form-control form-control-sm"
                      id="fee"
                      name="fee"
                      @input=${this.emitChange}
                    />
                  </div>
                </lms-dropdown> -->
              </div>
            </div>
          </div>
        </div>
        <div class="card-body">
          <slot></slot>
        </div>
      </div>
    `;
        }
    };
    LMSEventsFilter.styles = [
        bootstrapStyles,
        skeletonStyles,
        utilityStyles,
        i$5 `
      .gap-3 {
        gap: 1rem;
      }

      .nobr {
        white-space: nowrap;
      }
    `,
    ];
    __decorate([
        e$2({ type: Array })
    ], LMSEventsFilter.prototype, "events", void 0);
    __decorate([
        e$2({ type: String })
    ], LMSEventsFilter.prototype, "facetsStrategy", void 0);
    __decorate([
        e$2({ type: Boolean })
    ], LMSEventsFilter.prototype, "isHidden", void 0);
    __decorate([
        t$1()
    ], LMSEventsFilter.prototype, "facets", void 0);
    __decorate([
        t$1()
    ], LMSEventsFilter.prototype, "event_types", void 0);
    __decorate([
        t$1()
    ], LMSEventsFilter.prototype, "target_groups", void 0);
    __decorate([
        t$1()
    ], LMSEventsFilter.prototype, "locations", void 0);
    __decorate([
        t$1()
    ], LMSEventsFilter.prototype, "activeFilters", void 0);
    __decorate([
        e$1("input")
    ], LMSEventsFilter.prototype, "inputs", void 0);
    __decorate([
        e$1("lms-dropdown")
    ], LMSEventsFilter.prototype, "lmsDropdowns", void 0);
    LMSEventsFilter = __decorate([
        e$3("lms-events-filter")
    ], LMSEventsFilter);
    var LMSEventsFilter$1 = LMSEventsFilter;

    let LMSFloatingMenu = class LMSFloatingMenu extends s {
        constructor() {
            super(...arguments);
            this.brand = "Navigation";
            this.items = [];
            this._currentUrl = window.location.href;
            this._currentSearchParams = new URLSearchParams(window.location.search);
            this.isOpen = false;
        }
        toggleNavbarCollapse() {
            this.navbarNav.classList.toggle("collapse");
            if (this.navbarNav.classList.contains("show")) {
                this.isOpen = true;
                return;
            }
            this.isOpen = false;
        }
        render() {
            return x ` <nav
      class="navbar navbar-expand-lg navbar-light mx-2 mt-3 mb-5 rounded"
    >
      <a class="navbar-brand" href="#"><strong>${this.brand}</strong></a>
      <button
        @click=${this.toggleNavbarCollapse}
        class="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded=${this.isOpen}
        aria-label=${attr__("Toggle navigation")}
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav">
          ${this.items.map((item) => {
            /** We split the searchParams from the URL and
             *  compare them to the currentSearchParams of
             *  the window.location. If they match, we add
             *  the "active" class to the item. */
            let [, itemSearchParams] = item.url.split("?");
            itemSearchParams = new URLSearchParams(itemSearchParams !== null && itemSearchParams !== void 0 ? itemSearchParams : "");
            const matches = itemSearchParams.toString() ===
                this._currentSearchParams.toString();
            return x ` <li class="nav-item ${matches ? "active" : ""}">
              <a class="nav-link" href="${item.url}"
                >${litFontawesome_2(item.icon)}
                ${item.name}${matches
                ? x ` <span class="sr-only">(${__("current")})</span>`
                : ""}</a
              >
            </li>`;
        })}
        </ul>
      </div>
    </nav>`;
        }
    };
    LMSFloatingMenu.styles = [
        bootstrapStyles,
        skeletonStyles,
        i$5 `
      svg {
        width: 1rem;
        height: 1rem;
      }

      nav {
        background-color: var(--background-color);
        backdrop-filter: blur(5px);
        box-shadow: var(--shadow-hv);
      }
    `,
    ];
    __decorate([
        e$2({ type: String })
    ], LMSFloatingMenu.prototype, "brand", void 0);
    __decorate([
        e$2({
            type: Array,
            converter: (value) => (value ? JSON.parse(value) : []),
        })
    ], LMSFloatingMenu.prototype, "items", void 0);
    __decorate([
        e$2({ type: String, attribute: false })
    ], LMSFloatingMenu.prototype, "_currentUrl", void 0);
    __decorate([
        e$2({ type: String, attribute: false })
    ], LMSFloatingMenu.prototype, "_currentSearchParams", void 0);
    __decorate([
        i$2("#navbarNav")
    ], LMSFloatingMenu.prototype, "navbarNav", void 0);
    LMSFloatingMenu = __decorate([
        e$3("lms-floating-menu")
    ], LMSFloatingMenu);
    var LMSFloatingMenu$1 = LMSFloatingMenu;

    function createWrapper(breakpoints) {
        const [block, none] = breakpoints;
        return x `
    <div
      class="w-100 d-none ${`d-${block}-block`} ${none
        ? `d-${none}-none`
        : `d-none`}"
    ></div>
  `;
    }
    function insertResponsiveWrapper(index) {
        const breakpoints = [
            { n: 2, breakpoints: ["sm", "md"] },
            { n: 3, breakpoints: ["md", "lg"] },
            { n: 4, breakpoints: ["lg", "xl"] },
            { n: 5, breakpoints: ["xl", ""] },
        ];
        const wrappers = breakpoints
            .filter(({ n }) => (index + 1) % n === 0)
            .map(({ breakpoints }) => createWrapper(breakpoints));
        return wrappers;
    }

    let LMSImageBrowser = class LMSImageBrowser extends s {
        constructor() {
            super(...arguments);
            this.uploadedImages = [];
            this.boundEventHandler = () => undefined;
        }
        loadImages() {
            const uploadedImages = async () => await fetch("/api/v1/contrib/eventmanagement/images");
            uploadedImages()
                .then(async (response) => await response.json())
                .then((uploadedImages) => {
                this.uploadedImages = uploadedImages;
            })
                .catch((error) => {
                console.error(error);
            });
        }
        handleClipboardCopy(hashvalue) {
            navigator.clipboard.writeText(`/cgi-bin/koha/opac-retrieve-file.pl?id=${hashvalue}`);
        }
        handleMessageEvent(event) {
            if (event.data === "reloaded") {
                this.loadImages();
            }
        }
        connectedCallback() {
            super.connectedCallback();
            /** This is the counterpart to the script in the intranet_js hook */
            this.boundEventHandler = this.handleMessageEvent.bind(this);
            window.addEventListener("message", this.boundEventHandler);
            /** This loadImages call is independent of the eventListener. */
            this.loadImages();
        }
        disconnectedCallback() {
            super.disconnectedCallback();
            window.removeEventListener("message", this.boundEventHandler);
        }
        updated(changedProperties) {
            const shouldUpdateTooltipTargets = changedProperties.has("uploadedImages") &&
                this.buttonReferences &&
                this.tooltipReferences;
            if (shouldUpdateTooltipTargets) {
                this.tooltipReferences.forEach((tooltipReference) => {
                    const { id } = tooltipReference;
                    const tooltipHashvalue = id.split("-").pop();
                    tooltipReference.target = Array.from(this.buttonReferences).find((buttonReference) => {
                        const { id } = buttonReference;
                        const buttonHashvalue = id.split("-").pop();
                        return buttonHashvalue === tooltipHashvalue
                            ? buttonReference
                            : null;
                    });
                });
            }
        }
        render() {
            return x `
      <div class="container-fluid">
        <div class="card-deck">
          ${o$2(this.uploadedImages, (uploadedImage, index) => {
            const { image, metadata } = uploadedImage;
            const { dtcreated, filename, hashvalue } = metadata;
            const filetype = filename.split(".").pop();
            let isValidFiletype;
            if (filetype) {
                isValidFiletype = [
                    "png",
                    "jpg",
                    "jpeg",
                    "webp",
                    "avif",
                    "gif",
                ].includes(filetype);
            }
            return x `
              <div class="card mb-5">
                <img
                  ?hidden=${!isValidFiletype}
                  src="data:image/${filetype};base64,${image}"
                  class="card-img-top"
                  alt=${filename}
                />
                <div class="card-body">
                  <p
                    data-placement="top"
                    title=${attr__("Link constructed!")}
                    @click=${() => {
                this.handleClipboardCopy(hashvalue);
            }}
                    class="font-weight-bold p-2 border border-secondary rounded text-center"
                  >
                    ${hashvalue}
                  </p>
                  <div class="text-center">
                    <lms-tooltip
                      id="tooltip-${hashvalue}"
                      data-placement="top"
                      data-text="${attr__("Link constructed")}!"
                      data-timeout="1000"
                    >
                      <button
                        id="button-${hashvalue}"
                        data-placement="bottom"
                        title="${attr__("Link constructed")}!"
                        @click=${() => {
                this.handleClipboardCopy(hashvalue);
            }}
                        class="btn btn-primary text-center"
                      >
                        ${litFontawesome_2(faCopy)}
                        <span>${__("Copy to clipboard")}</span>
                      </button>
                    </lms-tooltip>
                  </div>
                </div>
                <div class="card-footer">
                  <p class="font-weight-light text-muted font-size-sm">
                    ${filename}&nbsp;-&nbsp;${dtcreated}
                  </p>
                </div>
              </div>
              ${insertResponsiveWrapper(index)}
            `;
        })}
        </div>
      </div>
    `;
        }
    };
    LMSImageBrowser.styles = [
        bootstrapStyles,
        skeletonStyles,
        i$5 `
      img {
        aspect-ratio: 4 / 3;
        object-fit: cover;
      }

      img,
      .card {
        max-width: 300px;
      }

      .font-size-sm {
        font-size: 1rem;
      }

      svg {
        display: inline-block;
        width: 1em;
        height: 1em;
        color: #ffffff;
      }

      button {
        white-space: nowrap;
      }

      button.btn-modal > svg {
        color: var(--text-color);
      }
    `,
    ];
    __decorate([
        e$2({
            type: Array,
            attribute: "uploaded-images",
            converter: { fromAttribute: (value) => (value ? JSON.parse(value) : []) },
        })
    ], LMSImageBrowser.prototype, "uploadedImages", void 0);
    __decorate([
        e$1('[id^="button-"]')
    ], LMSImageBrowser.prototype, "buttonReferences", void 0);
    __decorate([
        e$1('[id^="tooltip-"]')
    ], LMSImageBrowser.prototype, "tooltipReferences", void 0);
    LMSImageBrowser = __decorate([
        e$3("lms-image-browser")
    ], LMSImageBrowser);
    var LMSImageBrowser$1 = LMSImageBrowser;

    /**
     * @license
     * Copyright 2018 Google LLC
     * SPDX-License-Identifier: BSD-3-Clause
     */const i="important",n=" !"+i,o=e(class extends i$1{constructor(t$1){var e;if(super(t$1),t$1.type!==t.ATTRIBUTE||"style"!==t$1.name||(null===(e=t$1.strings)||void 0===e?void 0:e.length)>2)throw Error("The `styleMap` directive must be used in the `style` attribute and must be the only part in the attribute.")}render(t){return Object.keys(t).reduce(((e,r)=>{const s=t[r];return null==s?e:e+`${r=r.replace(/(?:^(webkit|moz|ms|o)|)(?=[A-Z])/g,"-$&").toLowerCase()}:${s};`}),"")}update(e,[r]){const{style:s}=e.element;if(void 0===this.ut){this.ut=new Set;for(const t in r)this.ut.add(t);return this.render(r)}this.ut.forEach((t=>{null==r[t]&&(this.ut.delete(t),t.includes("-")?s.removeProperty(t):s[t]="");}));for(const t in r){const e=r[t];if(null!=e){this.ut.add(t);const r="string"==typeof e&&e.endsWith(n);t.includes("-")||r?s.setProperty(t,r?e.slice(0,-11):e,r?i:""):s[t]=e;}}return T}});

    class IntersectionObserverHandler {
        constructor({ intersecting, intersected }) {
            this.observer = null;
            this.intersecting = intersecting;
            this.intersected = intersected;
        }
        init() {
            if (this.intersecting.ref instanceof HTMLElement &&
                this.intersected.ref instanceof HTMLElement) {
                this.observer = new IntersectionObserver((entries) => {
                    entries.forEach((entry) => {
                        var _a, _b, _c, _d;
                        if (entry.target === this.intersecting.ref &&
                            entry.isIntersecting &&
                            entry.intersectionRatio > 0) {
                            (_b = (_a = this.intersecting).do) === null || _b === void 0 ? void 0 : _b.call(_a);
                        }
                        else if (entry.target === this.intersected.ref &&
                            entry.isIntersecting &&
                            entry.intersectionRatio > 0) {
                            (_d = (_c = this.intersected).do) === null || _d === void 0 ? void 0 : _d.call(_c);
                        }
                    });
                });
                this.observer.observe(this.intersecting.ref);
                this.observer.observe(this.intersected.ref);
            }
            else {
                throw new Error("Invalid parameters supplied to IntersectionObserverClass. Please ensure both 'intersecting' and 'intersected' are valid Intersectable types.");
            }
        }
    }

    let LMSModal = class LMSModal extends s {
        constructor() {
            var _a;
            super(...arguments);
            this.fields = [];
            this.createOpts = {
                endpoint: "",
            };
            this.editable = false;
            this.isOpen = false;
            this.alert = { active: false, message: undefined };
            this.modalTitle = "";
            /** TODO: Maybe we can find a cleaner way to do the intersection observations than in the base modal component */
            this.footer = (_a = document.getElementById("i18nMenu")) === null || _a === void 0 ? void 0 : _a.parentElement;
            this.intersectionObserverHandler = null;
        }
        toggleModal() {
            this.isOpen = !this.isOpen;
            document.body.style.overflow = this.isOpen ? "hidden" : "auto";
            if (!this.isOpen) {
                this.alert = {
                    active: false,
                    message: undefined,
                };
            }
        }
        getEndpointUrl(endpoint, locale) {
            const _endpoint = new URL(endpoint, window.location.origin);
            if (locale !== "en") {
                _endpoint.searchParams.append("lang", locale);
            }
            return _endpoint.toString();
        }
        async create(e) {
            e.preventDefault();
            const { endpoint, method } = this.createOpts;
            const response = await fetch(this.getEndpointUrl(endpoint, locale), {
                method,
                body: JSON.stringify({
                    ...Object.assign({}, ...this.fields.map((field) => ({
                        [field.name]: field.value,
                    }))),
                }),
            });
            if (response.ok) {
                this.toggleModal();
                const event = new CustomEvent("created", { bubbles: true });
                this.dispatchEvent(event);
            }
            if (!response.ok) {
                const result = await response.json();
                if (result.error) {
                    this.alert = {
                        active: true,
                        message: Array.isArray(result.error)
                            ? x `<span>Sorry!</span>
                <ol>
                  ${o$2(result.error, (message) => x `<li>${message}</li>`)}
                </ol>`
                            : x `<span>Sorry! ${result.error}</span>`,
                    };
                    return;
                }
                if (result.errors) {
                    console.trace(result.errors);
                }
            }
        }
        dismissAlert() {
            this.alert = {
                active: false,
                message: undefined,
            };
        }
        firstUpdated() {
            if (this.footer && this.btnModalWrapper) {
                this.intersectionObserverHandler = new IntersectionObserverHandler({
                    intersecting: {
                        ref: this.btnModalWrapper,
                        do: () => {
                            const bottom = parseFloat(getComputedStyle(this.btnModalWrapper).bottom);
                            this.btnModalWrapper.style.bottom = `${bottom + (this.footer ? this.footer.offsetHeight : 0)}px`;
                        },
                    },
                    intersected: {
                        ref: this.footer,
                    },
                });
                this.intersectionObserverHandler.init();
            }
            const dbDataPopulated = this.fields.map(async (field) => {
                if (field.logic) {
                    return {
                        ...field,
                        dbData: await field.logic(),
                    };
                }
                return field;
            });
            Promise.all(dbDataPopulated).then((fields) => {
                this.fields = fields;
            });
        }
        render() {
            var _a;
            return x `
      <div
        class="btn-modal-wrapper"
        style=${o({
            zIndex: this.isOpen ? "1051" : "1049",
        })}
      >
        <button
          @click=${this.toggleModal}
          class="btn-modal ${o$1({ tilted: this.isOpen })}"
          type="button"
        >
          ${litFontawesome_2(faPlus)}
        </button>
      </div>
      <div
        class="backdrop"
        ?hidden=${!this.isOpen}
        @click=${this.toggleModal}
      ></div>
      <div
        class="modal fade ${o$1({
            "d-block": this.isOpen,
            show: this.isOpen,
        })}"
        id="lms-modal"
        tabindex="-1"
        role="dialog"
        aria-labelledby="lms-modal-title"
        aria-hidden=${!this.isOpen}
        style=${o({
            overflowY: this.isOpen ? "scroll" : "auto",
        })}
      >
        <div class="modal-dialog modal-dialog-centered" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="lms-modal-title">
                ${(_a = this.modalTitle) !== null && _a !== void 0 ? _a : `${__("Add")}`}
              </h5>
              <button
                @click=${this.toggleModal}
                type="button"
                class="close"
                aria-label=${attr__("Close")}
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <form @submit=${this.create}>
              <div class="modal-body">
                <div
                  role="alert"
                  ?hidden=${!this.alert.active}
                  class="alert ${o$1({
            "alert-danger": this.alert.active,
        })} alert-dismissible fade show"
                >
                  ${this.alert.message}
                  <button
                    @click=${this.dismissAlert}
                    type="button"
                    class="close"
                    data-dismiss="alert"
                    aria-label=${attr__("Close")}
                  >
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                ${o$2(this.fields, (value) => this.getFieldMarkup(value))}
              </div>
              <div class="modal-footer">
                <button
                  type="button"
                  class="btn btn-secondary"
                  data-dismiss="modal"
                  @click=${this.toggleModal}
                >
                  ${litFontawesome_2(faClose)}
                  <span>${__("Close")}</span>
                </button>
                <button type="submit" class="btn btn-primary">
                  ${litFontawesome_2(faPlus)}
                  <span>${__("Create")}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    `;
        }
        mediateChange(e) {
            const { name, value } = e.detail;
            this.fields = [
                ...this.fields.map((field) => {
                    if (field.name === name) {
                        return {
                            ...field,
                            value,
                        };
                    }
                    return field;
                }),
            ];
        }
        getFieldMarkup(field) {
            const { type, desc } = field;
            if (!type || !desc)
                return A;
            const { value } = field;
            const fieldTypes = new Map([
                [
                    "select",
                    x `<lms-select
          @change=${this.mediateChange}
          .field=${field}
        ></lms-select>`,
                ],
                [
                    "checkbox",
                    x `<lms-checkbox-input
          .field=${field}
          .value=${value}
        ></lms-checkbox-input>`,
                ],
                ["info", x `<p>${desc}</p>`],
                [
                    "matrix",
                    x `<lms-matrix
          .field=${field}
          .value=${value}
        ></lms-matrix>`,
                ],
                [
                    "default",
                    x `<lms-primitives-input
          .field=${field}
          .value=${value}
        ></lms-primitives-input>`,
                ],
            ]);
            return fieldTypes.has(type)
                ? fieldTypes.get(type)
                : fieldTypes.get("default");
        }
    };
    LMSModal.styles = [
        bootstrapStyles,
        skeletonStyles,
        i$5 `
      .btn-modal-wrapper {
        position: fixed;
        bottom: 1em;
        right: 1em;
        border-radius: 50%;
        background-color: var(--primary-color);
        box-shadow: var(--shadow-hv);
        cursor: pointer;
        z-index: 1049;
      }
      .btn-modal-wrapper > .btn-modal {
        background: none;
        border: none;
        color: var(--text-color);
        font-size: 2em;
        width: 2em;
        height: 2em;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .backdrop {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgb(0 0 0 / 50%);
        z-index: 1048;
      }
      button.btn-modal:not(.tilted) {
        transition: 0.2s;
        transition-timing-function: ease-in-out;
      }
      .tilted {
        transition: 0.2s;
        transition-timing-function: ease-in-out;
        transform: rotate(45deg);
      }
      svg {
        display: inline-block;
        width: 1em;
        height: 1em;
        color: var(--background-color);
      }
      button {
        white-space: nowrap;
      }
      button.btn-modal > svg {
        color: var(--background-color);
      }
    `,
    ];
    __decorate([
        e$2({ type: Array })
    ], LMSModal.prototype, "fields", void 0);
    __decorate([
        e$2({ type: Object })
    ], LMSModal.prototype, "createOpts", void 0);
    __decorate([
        e$2({ type: Boolean })
    ], LMSModal.prototype, "editable", void 0);
    __decorate([
        t$1()
    ], LMSModal.prototype, "isOpen", void 0);
    __decorate([
        t$1()
    ], LMSModal.prototype, "alert", void 0);
    __decorate([
        t$1()
    ], LMSModal.prototype, "modalTitle", void 0);
    __decorate([
        i$2(".btn-modal-wrapper")
    ], LMSModal.prototype, "btnModalWrapper", void 0);
    LMSModal = __decorate([
        e$3("lms-modal")
    ], LMSModal);
    var LMSModal$1 = LMSModal;

    let LMSPagination = class LMSPagination extends s {
        constructor() {
            super(...arguments);
            this.pageSizes = [
                10, 20, 50, 100,
            ];
            this.hasPrevious = false;
            this.hasNext = undefined;
            this.nextPage = undefined;
            this._page = 1;
            this._per_page = 20;
            this.url = new URL(window.location.href);
        }
        connectedCallback() {
            super.connectedCallback();
            this.getPaginationState();
            this.prefetchNextPage();
        }
        prefetchNextPage() {
            this.dispatchEvent(new CustomEvent("prefetch", {
                detail: {
                    _page: this._page + 1,
                    _per_page: this._per_page,
                },
                bubbles: true,
                composed: true,
            }));
        }
        getPaginationState() {
            const { searchParams } = this.url;
            const _page = searchParams.get("_page");
            const _per_page = searchParams.get("_per_page");
            if (_page && _page !== this._page.toString()) {
                this._page = parseInt(_page);
                this.hasPrevious = this._page > 1;
            }
            if (_per_page && _per_page !== this._per_page.toString()) {
                this._per_page = parseInt(_per_page);
            }
        }
        updated(changedProperties) {
            if (changedProperties.has("nextPage") &&
                this.nextPage !== undefined &&
                !isDeepEqual(changedProperties.get("nextPage"), this.nextPage)) {
                this.hasNext = this.nextPage !== undefined && this.nextPage.length > 0;
                if (this.hasNext) {
                    this.prefetchNextPage();
                }
            }
            if (changedProperties.has("_page") || changedProperties.has("_per_page")) {
                this.hasPrevious = this._page > 1;
                this.prefetchNextPage();
            }
        }
        getLinkForPageSize(pageSize) {
            const urlCopy = new URL(this.url.href);
            urlCopy.searchParams.set("_per_page", pageSize.toString());
            return urlCopy.href;
        }
        getLinkForPage(page, direction) {
            const urlCopy = new URL(this.url.href);
            if (direction === "next") {
                urlCopy.searchParams.set("_page", (page + 1).toString());
            }
            if (direction === "previous" && page > 1) {
                urlCopy.searchParams.set("_page", (page - 1).toString());
            }
            return urlCopy.href;
        }
        handlePaginationChange(e) {
            e.preventDefault();
            const target = e.target;
            const anchor = target.closest("a");
            if (!anchor)
                return;
            const url = new URL(anchor.href);
            let _page = url.searchParams.get("_page");
            let _per_page = url.searchParams.get("_per_page");
            if (_page && _per_page) {
                _page = parseInt(_page, 10);
                _per_page = parseInt(_per_page, 10);
                this.dispatchEvent(new CustomEvent("page", {
                    detail: {
                        _page,
                        _per_page,
                    },
                    bubbles: true,
                    composed: true,
                }));
            }
        }
        render() {
            return x `
      <nav aria-label=${attr__("Table navigation")}>
        <ul class="pagination justify-content-end mb-0">
          <li
            class="page-item ${o$1({
            disabled: !this.hasPrevious,
        })}"
          >
            <a
              class="page-link"
              href=${this.getLinkForPage(this._page, "previous")}
              @click=${this.handlePaginationChange}
              >${__("Previous")}</a
            >
          </li>
          ${o$2(this.pageSizes, (pageSize) => x `
              <li
                class="page-item ${o$1({
            active: pageSize === this._per_page,
        })}"
              >
                <a
                  class="page-link"
                  href=${this.getLinkForPageSize(pageSize)}
                  @click=${this.handlePaginationChange}
                  >${pageSize}</a
                >
              </li>
            `)}
          <li
            class="page-item
            ${o$1({
            disabled: !this.hasNext,
        })}"
          >
            <a
              class="page-link"
              href=${this.getLinkForPage(this._page, "next")}
              @click=${this.handlePaginationChange}
              ><span
                class=${o$1({
            "d-none": this.hasNext === undefined,
        })}
                >${__("Next")}</span
              >
              <div
                class="spinner-border spinner-border-sm align-middle text-primary ${o$1({
            "d-none": this.hasNext !== undefined,
        })}"
                role="status"
              >
                <span class="sr-only">${__("Loading")}...</span>
              </div>
            </a>
          </li>
        </ul>
      </nav>
    `;
        }
    };
    LMSPagination.styles = [bootstrapStyles, skeletonStyles];
    __decorate([
        e$2({ type: Array, attribute: "page-sizes" })
    ], LMSPagination.prototype, "pageSizes", void 0);
    __decorate([
        e$2({ type: Boolean })
    ], LMSPagination.prototype, "hasPrevious", void 0);
    __decorate([
        e$2({ type: Boolean })
    ], LMSPagination.prototype, "hasNext", void 0);
    __decorate([
        e$2({ type: Array })
    ], LMSPagination.prototype, "nextPage", void 0);
    __decorate([
        e$2({ type: Number })
    ], LMSPagination.prototype, "_page", void 0);
    __decorate([
        e$2({ type: Number })
    ], LMSPagination.prototype, "_per_page", void 0);
    LMSPagination = __decorate([
        e$3("lms-pagination")
    ], LMSPagination);
    var LMSPagination$1 = LMSPagination;

    let LMSSearch = class LMSSearch extends s {
        constructor() {
            super(...arguments);
            this.sortableColumns = ["id"];
            this.debouncedSearch = debounce((query) => {
                this.dispatchEvent(new CustomEvent("search", {
                    detail: {
                        q: this.getQuery(query),
                    },
                    bubbles: true,
                    composed: false,
                }));
            }, 250, false);
        }
        parseQuery(query) {
            const entries = {};
            const parts = query.split(" AND ");
            const operators = {
                ">=": ">=",
                "<=": "<=",
                ">": ">",
                "<": "<",
                "~": "-like",
                "!~": "-not_like",
            };
            parts.forEach((part) => {
                const [rawKey, rawValue] = part.split(":").map((s) => s.trim());
                if (!rawKey || rawValue === undefined)
                    return;
                let value = rawValue;
                let operator = "=";
                // Handle OR queries
                if (rawValue.includes(" OR ")) {
                    operator = "||";
                    value = rawValue.split("OR").map((s) => s.trim());
                }
                // Handle numeric and quoted values
                else if (!isNaN(parseFloat(rawValue))) {
                    value = parseFloat(rawValue);
                }
                else if (rawValue.startsWith('"') && rawValue.endsWith('"')) {
                    value = rawValue.slice(1, -1);
                }
                // Handle operators
                else {
                    for (const op of Object.keys(operators)) {
                        if (rawValue.includes(op)) {
                            operator = operators[op];
                            [, value] = rawValue.split(op);
                            value = value.trim();
                            break;
                        }
                    }
                }
                entries[rawKey] = { operator, value };
            });
            return entries;
        }
        buildQuery(query) {
            let builtQuery = [];
            for (const [key, { operator, value }] of Object.entries(query)) {
                switch (operator) {
                    case "=":
                        builtQuery.push({ [key]: value });
                        break;
                    case "||":
                        if (Array.isArray(value)) {
                            value.forEach((v) => builtQuery.push({ [key]: v }));
                        }
                        else {
                            builtQuery.push({ [key]: value });
                        }
                        break;
                    default:
                        builtQuery.push({ [key]: { [operator]: value } });
                }
            }
            if (builtQuery.length === 1) {
                [builtQuery] = builtQuery;
            }
            return builtQuery;
        }
        getQuery(query) {
            let q = undefined;
            if (query) {
                if (query.includes(":")) {
                    // It's a structured query
                    const parsedQuery = this.parseQuery(query);
                    const builtQuery = this.buildQuery(parsedQuery);
                    q = JSON.stringify(builtQuery);
                }
                else {
                    // It's a bare search term, build a wildcard query for each field
                    const encoded = {
                        "%": window.encodeURIComponent("%"),
                        query: window.encodeURIComponent(query),
                    };
                    const wildcardQuery = this.sortableColumns.reduce((entries, field) => {
                        entries.push({
                            [field]: {
                                "-like": `${encoded["%"]}${encoded.query}${encoded["%"]}`,
                            },
                        });
                        return entries;
                    }, []);
                    q = JSON.stringify(wildcardQuery);
                }
            }
            else {
                q = JSON.stringify({});
            }
            return q;
        }
        handleInput(e) {
            const inputElement = e.target;
            this.debouncedSearch(inputElement.value);
        }
        render() {
            return x `
      <div class="input-group flex-nowrap">
        <div class="input-group-prepend">
          <span class="input-group-text" id="addon-wrapping" aria
            >${litFontawesome_2(faSearch)}</span
          >
        </div>
        <input
          type="text"
          class="form-control"
          placeholder=${attr__("Search")}
          aria-label=${attr__("Search")}
          aria-describedby="addon-wrapping"
          @input=${this.handleInput}
        />
      </div>
    `;
        }
    };
    LMSSearch.styles = [
        bootstrapStyles,
        i$5 `
      svg {
        color: #000000;
        height: 1rem;
        width: 1rem;
      }
    `,
    ];
    __decorate([
        e$2({ type: Array })
    ], LMSSearch.prototype, "sortableColumns", void 0);
    LMSSearch = __decorate([
        e$3("lms-search")
    ], LMSSearch);
    var LMSSearch$1 = LMSSearch;

    let LMSTooltip = class LMSTooltip extends s {
        constructor() {
            super(...arguments);
            this.text = "";
            this.target = null;
            this.placement = "bottom";
            this.timeout = 3000;
            this.showTooltipBound = this.showTooltip.bind(this);
        }
        willUpdate(changedProperties) {
            if (changedProperties.has("target")) {
                const previousTarget = changedProperties.get("target");
                if (previousTarget) {
                    previousTarget.removeEventListener("click", this.showTooltipBound);
                }
                if (this.target) {
                    this.target.addEventListener("click", this.showTooltipBound);
                }
            }
        }
        showTooltip(event) {
            const target = event.target;
            if (target) {
                const targetElement = target;
                const targetRect = targetElement.getBoundingClientRect();
                switch (this.placement) {
                    case "top":
                        this.tooltip.style.top = `${window.scrollY + targetRect.top - this.tooltip.offsetHeight}px`;
                        this.tooltip.style.left = `${window.scrollX +
                        targetRect.left +
                        (targetRect.width - this.tooltip.offsetWidth) / 2}px`;
                        break;
                    case "bottom":
                        this.tooltip.style.top = `${window.scrollY + targetRect.top + targetRect.height}px`;
                        this.tooltip.style.left = `${window.scrollX +
                        targetRect.left +
                        (targetRect.width - this.tooltip.offsetWidth) / 2}px`;
                        break;
                    case "left":
                        this.tooltip.style.top = `${window.scrollY +
                        targetRect.top +
                        (targetRect.height - this.tooltip.offsetHeight) / 2}px`;
                        this.tooltip.style.left = `${window.scrollX + targetRect.left - this.tooltip.offsetWidth}px`;
                        break;
                    case "right":
                        this.tooltip.style.top = `${window.scrollY +
                        targetRect.top +
                        (targetRect.height - this.tooltip.offsetHeight) / 2}px`;
                        this.tooltip.style.left = `${window.scrollX + targetRect.left + targetRect.width}px`;
                        break;
                }
                this.tooltip.style.visibility = "visible";
                setTimeout(() => this.hideTooltip(), this.timeout);
            }
        }
        hideTooltip() {
            this.tooltip.style.visibility = "hidden";
        }
        handleSlotChange(event) {
            const slot = event.target;
            const assignedElements = slot.assignedElements({ flatten: true });
            if (assignedElements.length > 0) {
                const [assignedElement] = assignedElements;
                this.target = assignedElement;
                return;
            }
            this.target = null;
        }
        render() {
            return x `
      <slot @slotchange=${this.handleSlotChange}></slot>
      <span class="tooltip">${this.text}</span>
    `;
        }
    };
    LMSTooltip.styles = i$5 `
    :host {
      display: inline-block;
    }

    span.tooltip {
      position: fixed;
      background-color: var(--tooltip-background-color, #333);
      color: var(--tooltip-text-color, #fff);
      border-radius: 3px;
      padding: 5px;
      font-size: 14px;
      z-index: 1000;
      visibility: hidden;
    }
  `;
    __decorate([
        e$2({ type: String, attribute: "data-text" })
    ], LMSTooltip.prototype, "text", void 0);
    __decorate([
        e$2({ type: Object })
    ], LMSTooltip.prototype, "target", void 0);
    __decorate([
        e$2({ type: String, attribute: "data-placement" })
    ], LMSTooltip.prototype, "placement", void 0);
    __decorate([
        e$2({ type: Number, attribute: "data-timeout" })
    ], LMSTooltip.prototype, "timeout", void 0);
    __decorate([
        i$2("span.tooltip")
    ], LMSTooltip.prototype, "tooltip", void 0);
    LMSTooltip = __decorate([
        e$3("lms-tooltip")
    ], LMSTooltip);
    var LMSTooltip$1 = LMSTooltip;

    let LMSEventMangementMenu = class LMSEventMangementMenu extends LMSFloatingMenu$1 {
        constructor() {
            super(...arguments);
            this.baseurl = "";
            this.pluginclass = "";
        }
        connectedCallback() {
            super.connectedCallback();
            this.hydrate();
        }
        hydrate() {
            this.items = [
                // {
                //   name: __("Settings"),
                //   icon: faCog,
                //   url: `${this.baseurl}?class=${this.pluginclass}&method=configure`,
                //   method: "configure",
                // },
                {
                    name: __("Target Groups"),
                    icon: faBullseye,
                    url: `${this.baseurl}?class=${this.pluginclass}&method=configure&op=target-groups`,
                    method: "configure",
                },
                {
                    name: __("Locations"),
                    icon: faLocationDot,
                    url: `${this.baseurl}?class=${this.pluginclass}&method=configure&op=locations`,
                    method: "configure",
                },
                {
                    name: __("Event Types"),
                    icon: faTag,
                    url: `${this.baseurl}?class=${this.pluginclass}&method=configure&op=event-types`,
                    method: "configure",
                },
                {
                    name: __("Events"),
                    icon: faList,
                    url: `${this.baseurl}?class=${this.pluginclass}&method=tool`,
                    method: "tool",
                },
                {
                    name: __("Images"),
                    icon: faImage,
                    url: `${this.baseurl}?class=${this.pluginclass}&method=tool&op=images`,
                    method: "tool",
                },
            ];
        }
    };
    __decorate([
        e$2({ type: String })
    ], LMSEventMangementMenu.prototype, "baseurl", void 0);
    __decorate([
        e$2({ type: String })
    ], LMSEventMangementMenu.prototype, "pluginclass", void 0);
    LMSEventMangementMenu = __decorate([
        e$3("lms-event-management-menu")
    ], LMSEventMangementMenu);
    var LMSEventMangementMenu$1 = LMSEventMangementMenu;

    let LMSEventsModal = class LMSEventsModal extends LMSModal$1 {
        constructor() {
            super(...arguments);
            this.createOpts = {
                method: "POST",
                endpoint: "/api/v1/contrib/eventmanagement/events",
            };
            this.selectedEventTypeId = undefined;
        }
        async connectedCallback() {
            super.connectedCallback();
            this.hydrate();
        }
        hydrate() {
            this.modalTitle = __("Create Event");
            this.fields = [
                {
                    name: "name",
                    type: "text",
                    desc: __("Name"),
                    required: true,
                },
                {
                    name: "event_type",
                    type: "select",
                    desc: __("Event Type"),
                    logic: async () => {
                        const response = await fetch("/api/v1/contrib/eventmanagement/event_types");
                        const result = await response.json();
                        return result.map((event_type) => ({
                            id: event_type.id,
                            name: event_type.name,
                        }));
                    },
                },
                {
                    name: "target_groups",
                    type: "matrix",
                    headers: [
                        ["target_group", "default"],
                        ["selected", "checkbox"],
                        ["fee", "number"],
                    ],
                    desc: __("Target Groups"),
                    logic: async () => {
                        const response = await fetch("/api/v1/contrib/eventmanagement/target_groups");
                        const result = await response.json();
                        return result.map((target_group) => ({
                            id: target_group.id,
                            name: target_group.name,
                        }));
                    },
                    required: false,
                },
                {
                    name: "min_age",
                    type: "number",
                    desc: __("Min Age"),
                    required: true,
                },
                {
                    name: "max_age",
                    type: "number",
                    desc: __("Max Age"),
                    required: true,
                },
                {
                    name: "max_participants",
                    type: "number",
                    desc: __("Max Participants"),
                    required: true,
                },
                {
                    name: "start_time",
                    type: "datetime-local",
                    desc: __("Start Time"),
                    required: true,
                },
                {
                    name: "end_time",
                    type: "datetime-local",
                    desc: __("End Time"),
                    required: true,
                },
                {
                    name: "registration_start",
                    type: "datetime-local",
                    desc: __("Registration Start"),
                    required: true,
                },
                {
                    name: "registration_end",
                    type: "datetime-local",
                    desc: __("Registration End"),
                    required: true,
                },
                {
                    name: "location",
                    type: "select",
                    desc: __("Location"),
                    logic: async () => {
                        const response = await fetch("/api/v1/contrib/eventmanagement/locations");
                        const result = await response.json();
                        return result.map((location) => ({
                            id: location.id,
                            name: location.name,
                        }));
                    },
                    required: false,
                },
                {
                    name: "image",
                    type: "text",
                    desc: __("Image"),
                    required: false,
                },
                {
                    name: "description",
                    type: "text",
                    desc: __("Description"),
                    required: false,
                },
                {
                    name: "status",
                    type: "select",
                    desc: __("Status"),
                    logic: async () => {
                        return [
                            { id: "pending", name: __("Pending") },
                            { id: "confirmed", name: __("Confirmed") },
                            { id: "canceled", name: __("Canceled") },
                            { id: "sold_out", name: __("Sold Out") },
                        ];
                    },
                    required: true,
                },
                {
                    name: "registration_link",
                    type: "text",
                    desc: __("Registration Link"),
                    required: false,
                },
                {
                    name: "open_registration",
                    type: "checkbox",
                    desc: __("Open Registration"),
                    required: false,
                },
            ];
        }
        willUpdate() {
            var _a;
            const { fields } = this;
            const eventTypeField = fields.find((field) => field.name === "event_type");
            if (eventTypeField) {
                const { dbData } = eventTypeField;
                if (dbData) {
                    /** We destructure the default event_type out of the dbData array
                     *  to set the selectedEventTypeId state variable. */
                    const [event_type] = dbData;
                    let { id } = event_type;
                    /** If the eventTypeField value has changed due to a select element
                     *  change event, we use it instead of the default. */
                    id = (_a = eventTypeField === null || eventTypeField === void 0 ? void 0 : eventTypeField.value) !== null && _a !== void 0 ? _a : id;
                    const result = async () => {
                        const response = await fetch(`/api/v1/contrib/eventmanagement/event_types/${id}`);
                        if (response.ok) {
                            return response.json();
                        }
                        const error = await response.json();
                        return error;
                    };
                    result()
                        .then((event_type) => {
                        if (event_type instanceof Error) {
                            return;
                        }
                        if (!this.selectedEventTypeId || this.selectedEventTypeId != id) {
                            Object.entries(event_type).forEach(([property, value]) => {
                                const field = fields.find((field) => field.name === property);
                                if (field) {
                                    switch (typeof value) {
                                        case "number":
                                            field.value = value.toString();
                                            break;
                                        case "boolean":
                                            field.value = (value ? 1 : 0).toString();
                                            break;
                                        case "object":
                                            if (value instanceof Array) {
                                                field.value = value.map((item) => ({
                                                    id: item.target_group_id.toString(),
                                                    selected: (item.selected ? 1 : 0).toString(),
                                                    fee: item.fee.toString(),
                                                }));
                                            }
                                            break;
                                        default:
                                            field.value = value;
                                    }
                                }
                            });
                            this.selectedEventTypeId =
                                typeof id === "string" ? parseInt(id, 10) : id;
                        }
                    })
                        .catch((error) => {
                        console.error(error);
                    });
                }
            }
        }
    };
    __decorate([
        e$2({ type: Object })
    ], LMSEventsModal.prototype, "createOpts", void 0);
    __decorate([
        t$1()
    ], LMSEventsModal.prototype, "selectedEventTypeId", void 0);
    LMSEventsModal = __decorate([
        e$3("lms-events-modal")
    ], LMSEventsModal);
    var LMSEventsModal$1 = LMSEventsModal;

    let LMSEventTypesModal = class LMSEventTypesModal extends LMSModal$1 {
        constructor() {
            super(...arguments);
            this.createOpts = {
                method: "POST",
                endpoint: "/api/v1/contrib/eventmanagement/event_types",
            };
        }
        connectedCallback() {
            super.connectedCallback();
            this.hydrate();
        }
        hydrate() {
            this.modalTitle = __("Create Event Type");
            this.fields = [
                {
                    name: "name",
                    type: "text",
                    desc: __("Name"),
                    required: true,
                    value: "",
                },
                {
                    name: "target_groups",
                    type: "matrix",
                    headers: [
                        ["target_group", "default"],
                        ["selected", "checkbox"],
                        ["fee", "number"],
                    ],
                    desc: __("Target Groups"),
                    logic: async () => {
                        const response = await fetch("/api/v1/contrib/eventmanagement/target_groups");
                        const result = await response.json();
                        return result.map((target_group) => ({
                            id: target_group.id,
                            name: target_group.name,
                        }));
                    },
                    required: false,
                    value: [],
                },
                {
                    name: "min_age",
                    type: "number",
                    desc: __("Min Age"),
                    required: true,
                    value: "0",
                },
                {
                    name: "max_age",
                    type: "number",
                    desc: __("Max Age"),
                    required: true,
                    value: "0",
                },
                {
                    name: "max_participants",
                    type: "number",
                    desc: __("Max Participants"),
                    required: true,
                    value: "0",
                },
                {
                    name: "location",
                    type: "select",
                    desc: __("Location"),
                    logic: async () => {
                        const response = await fetch("/api/v1/contrib/eventmanagement/locations");
                        const result = await response.json();
                        return result.map((location) => ({
                            id: location.id,
                            name: location.name,
                        }));
                    },
                    required: false,
                    value: [],
                },
                {
                    name: "image",
                    type: "text",
                    desc: __("Image"),
                    required: false,
                    value: "0",
                },
                {
                    name: "description",
                    type: "text",
                    desc: __("Description"),
                    required: false,
                    value: "",
                },
                {
                    name: "open_registration",
                    type: "checkbox",
                    desc: __("Open Registration"),
                    required: false,
                    value: "0",
                },
            ];
        }
    };
    __decorate([
        e$2({ type: Object })
    ], LMSEventTypesModal.prototype, "createOpts", void 0);
    LMSEventTypesModal = __decorate([
        e$3("lms-event-types-modal")
    ], LMSEventTypesModal);
    var LMSEventTypesModal$1 = LMSEventTypesModal;

    const searchSyntax = x `<h4>${__("Advanced Search Syntax")}</h4><h5>${__("Field Equality Matches")}</h5><p>${__("Syntax: ")}<code>fieldname:value</code></p><p>${__("This will match results where the given field name matches the specified value.")}</p><p><strong>${__("Example:")}</strong>&nbsp;<code>age:25</code>${__(" will return results where the age field equals 25.")}</p><h5>${__("Complex Matching Clauses")}</h5><p>${__("Syntax: ")}<code>fieldname:operator value</code></p><p>${__("This allows the use of various matching clauses including ")}<code>&#x3E;</code>${__(", ")}<code>&#x3C;</code>${__(", ")}<code>&#x3E;=</code>${__(", ")}<code>&#x3C;=</code>${__(", ")}<code>-like</code>${__(", and ")}<code>-not_like</code>${__(".")}</p><p><strong>${__("Example:")}</strong>&nbsp;<code>age:&#x3E;25</code>${__(" will return results where the age field is greater than 25.")}</p><h5>${__("Multi-field Filtering")}</h5><p>${__("Syntax: ")}<code>field1:value1 AND field2:value2</code></p><p>${__("This will filter the response to only those results where both field1 contains value1 AND field2 contains value2.")}</p><p><strong>${__("Example:")}</strong>&nbsp;<code>name:John AND age:25</code>${__(" will return results where the name field is John AND the age field equals 25.")}</p><h5>${__("OR Queries")}</h5><p>${__("Syntax: ")}<code>fieldname:value1 OR value2</code></p><p>${__("This will return results where the fieldname is either value1 OR value2.")}</p><p><strong>${__("Example:")}</strong>&nbsp;<code>surname:Acevedo OR Bernardo</code>${__(" will return any result whose surname is \"Acevedo\" OR \"Bernardo\".")}</p><h5>${__("Exact Matches")}</h5><p>${__("If you quote the search term in double quotes, it will find only exact matches.")}</p><p><strong>${__("Example:")}</strong>&nbsp;<code>name:&#x22;John Doe&#x22;</code>${__(" will return results where the name field is exactly \"John Doe\".")}</p><h5>${__("Wildcard Matches")}</h5><p>${__("If a value is not quoted, it will perform a search with wildcard matches, meaning it will return results where the field contains the specified value.")}</p><p><strong>${__("Example:")}</strong>&nbsp;<code>name:John</code>${__(" will return results where the name field contains \"John\" (such as \"John Doe\", \"Johnny\", etc.).")}</p><h5>${__("Nested Data Query")}</h5><p>${__("If you are requesting related data be embedded into the response one can query on the related data using dot notation in the field names.")}</p><p><strong>${__("Example:")}</strong>&nbsp;<code>extended_attributes.code:internet AND extended_attributes.attribute:1</code>${__(" will return results where the code field of extended")}<em>${__("attributes is \"internet\" AND the attribute field of extended")}</em>${__("attributes is 1.")}</p><h5>${__("Bare Search")}</h5><p>${__("A bare search without keywords will search all fields with forward and backward truncation meaning *SEARCH_TERM*. This can be used for broad queries where the specific field isn't known.")}</p><p><strong>${__("Example:")}</strong>${__(" John will return any result that contains \"John\" in any of the fields.")}</p>`;

    let LMSTable = class LMSTable extends s {
        constructor() {
            super();
            this.data = [];
            this.order = [];
            this.headers = [];
            this.isEditable = false;
            this.isDeletable = false;
            this.nextPage = undefined;
            this.hasNoResults = false;
            this._page = 1;
            this._per_page = 20;
            this.toast = {
                heading: "",
                message: "",
            };
            this.emptyTableMessage = x `${__("No data to display")}.`;
            this.sortableColumns = ["id"];
            this.unsortableColumns = [];
            this.notImplementedInBaseMessage = "Implement this method in your extended LMSTable component.";
            this.inputConverter = new InputConverter();
            this.throttledHandleResize = throttle(this.handleResize.bind(this), 250);
        }
        connectedCallback() {
            super.connectedCallback();
            window.addEventListener("resize", this.throttledHandleResize);
        }
        disconnectedCallback() {
            super.disconnectedCallback();
            window.removeEventListener("resize", this.throttledHandleResize);
        }
        updateButtonState(button, isActive) {
            var _a, _b;
            button.classList.toggle("active", isActive);
            (_a = button.querySelector(".start-edit")) === null || _a === void 0 ? void 0 : _a.classList.toggle("d-none", isActive);
            (_b = button.querySelector(".abort-edit")) === null || _b === void 0 ? void 0 : _b.classList.toggle("d-none", !isActive);
        }
        toggleInputs(tableRow, isEnabled) {
            const inputs = tableRow.querySelectorAll("input, select, textarea");
            inputs.forEach((input) => {
                isEnabled
                    ? input.removeAttribute("disabled")
                    : input.setAttribute("disabled", "");
            });
        }
        toggleCollapse(tableRow, isExpanded) {
            const collapsibles = tableRow.querySelectorAll(".collapse");
            collapsibles.forEach((collapse) => {
                const parent = collapse.parentElement;
                if (isExpanded) {
                    parent === null || parent === void 0 ? void 0 : parent.classList.add("pip");
                    collapse.classList.add("show");
                }
                else {
                    parent === null || parent === void 0 ? void 0 : parent.classList.remove("pip");
                    collapse.classList.remove("show");
                }
            });
        }
        toggleEdit(e) {
            var _a, _b;
            const button = e.target;
            if (!button)
                return;
            (_a = this.inputs) === null || _a === void 0 ? void 0 : _a.forEach((input) => {
                input.setAttribute("disabled", "");
            });
            const tableRow = button.closest("tr");
            if (button.classList.contains("active") && tableRow) {
                this.toggleCollapse(tableRow, false);
                this.updateButtonState(button, false);
                this.toggleInputs(tableRow, false);
                return;
            }
            (_b = this.editButtons) === null || _b === void 0 ? void 0 : _b.forEach((editButton) => {
                this.updateButtonState(editButton, false);
            });
            if (tableRow) {
                this.toggleCollapse(tableRow, true);
                this.updateButtonState(button, true);
                this.toggleInputs(tableRow, true);
            }
        }
        handleSave(e) {
            console.info(e, this.notImplementedInBaseMessage);
        }
        handleDelete(e) {
            console.info(e, this.notImplementedInBaseMessage);
        }
        *getColumnData(query, data) {
            for (const [name, value] of Object.entries(query)) {
                yield [name, this.inputConverter.getInputTemplate({ name, value, data })];
            }
        }
        renderToast(status, result) {
            if (result.error) {
                this.toast = {
                    heading: status,
                    message: result.error,
                };
            }
            if (result.errors) {
                this.toast = {
                    heading: status,
                    message: Object.values(result.errors)
                        .map(({ message, path }) => `Sorry! ${message} → ${path}`)
                        .join("\n"),
                };
            }
            const lmsToast = document.createElement("lms-toast", {
                is: "lms-toast",
            });
            lmsToast.heading = this.toast.heading;
            lmsToast.message = this.toast.message;
            this.renderRoot.appendChild(lmsToast);
        }
        sortByOrder(data, order) {
            if (!(data instanceof Array)) {
                return data;
            }
            return data.sort((a, b) => order.reduce((result, column) => {
                if (result !== 0) {
                    return result;
                }
                const aValue = a[column];
                const bValue = b[column];
                if (aValue < bValue) {
                    return -1;
                }
                if (aValue > bValue) {
                    return 1;
                }
                return 0;
            }, 0));
        }
        sortColumns() {
            var _a;
            const { data } = this;
            const hasData = (_a = (data === null || data === void 0 ? void 0 : data.length) > 0) !== null && _a !== void 0 ? _a : false;
            const [headers] = hasData ? data : [];
            this.headers = this.order.filter((header) => headers && {}.hasOwnProperty.call(headers, header));
            if (hasData) {
                this.data = this.order.length
                    ? this.sortByOrder(data, this.order)
                    : data;
            }
        }
        willUpdate(_changedProperties) {
            super.willUpdate(_changedProperties);
            this.sortColumns();
        }
        firstUpdated(_changedProperties) {
            super.firstUpdated(_changedProperties);
            const preexistingColumns = [
                ...this.sortableColumns,
                ...this.unsortableColumns,
            ];
            this.order.forEach((column) => {
                if (!preexistingColumns.includes(column)) {
                    this.sortableColumns.push(column);
                }
            });
            this.handleResize();
        }
        handleResize() {
            this.table.classList.remove("table-responsive");
            let totalSourroundingWidth = 0;
            let element = this.table;
            const props = [
                "marginLeft",
                "marginRight",
                "paddingLeft",
                "paddingRight",
            ];
            while (element) {
                const style = window.getComputedStyle(element);
                totalSourroundingWidth += props.reduce((total, prop) => total + parseFloat(style[prop]), 0);
                element =
                    element.getRootNode() instanceof ShadowRoot
                        ? element.getRootNode().host
                        : element.parentElement;
            }
            if (this.table.offsetWidth + totalSourroundingWidth > window.innerWidth) {
                this.table.classList.add("table-responsive");
            }
        }
        handleSortChange(e) {
            const target = e.target;
            const tableHeader = target.closest("th");
            if (!tableHeader)
                return;
            const { name } = tableHeader.dataset;
            this.dispatchEvent(new CustomEvent("sort", {
                detail: {
                    _order_by: name,
                },
                bubbles: true,
                composed: true,
            }));
        }
        handleSearch(e) {
            const { detail } = e;
            this.dispatchEvent(new CustomEvent("search", {
                detail,
                composed: true,
                bubbles: true,
            }));
        }
        toggleDoc(e) {
            const target = e.target;
            const doc = target.nextElementSibling;
            if (!doc)
                return;
            doc.classList.toggle("d-none");
        }
        render() {
            if (!this.data.length) {
                x `<h1 class="text-center">${this.emptyTableMessage}</h1>`;
            }
            return x `
      <div class="container-fluid mx-0">
        <lms-table-controls>
          <lms-search
            @search=${this.handleSearch}
            .sortableColumns=${this.sortableColumns}
          ></lms-search>
          <lms-pagination
            .nextPage=${this.nextPage}
            ._page=${this._page}
            ._per_page=${this._per_page}
          ></lms-pagination>
        </lms-table-controls>
        <div
          class="alert alert-info text-center ${o$1({
            "d-none": !this.hasNoResults,
        })}"
          role="alert"
        >
          <h4 class="alert-heading">${__("No matches found")}.</h4>
          <p>${__("Try refining your search.")}</p>
          <button class="btn btn-outline-info" @click=${this.toggleDoc}>
            ${__("Help")}
          </button>
          <div class="text-left d-none">
            <hr />
            ${searchSyntax}
          </div>
        </div>
        <table
          class="table table-striped table-bordered table-hover ${o$1({
            "d-none": this.hasNoResults,
        })}"
        >
          <thead>
            <tr>
              ${o$2(this.headers, (key) => {
            if (!this.sortableColumns.includes(key)) {
                return x `<th scope="col">${__(key)}</th>`;
            }
            return x `<th
                  scope="col"
                  data-name=${key}
                  @click=${this.handleSortChange}
                >
                  ${__(key)}
                </th>`;
        })}
              ${this.isEditable
            ? x `<th scope="col">${__("actions")}</th>`
            : A}
            </tr>
          </thead>
          <tbody>
            ${o$2(this.data, (datum) => x `
                <tr>
                  ${o$2(this.headers, (header) => x `<td class="align-middle">${datum[header]}</td>`)}
                  ${this.isEditable
            ? x `
                        <td class="align-middle">
                          <div class="d-flex justify-content-center">
                            <button
                              @click=${this.toggleEdit}
                              type="button"
                              class="btn btn-dark mx-2 btn-edit"
                              aria-label=${attr__("Edit")}
                            >
                              <span class="start-edit pointer-events-none"
                                >${litFontawesome_2(faEdit)}
                                <span>${__("Edit")}</span></span
                              >
                              <span
                                class="abort-edit d-none pointer-events-none"
                                >${litFontawesome_2(faTimes)}<span
                                  >${__("Abort")}</span
                                ></span
                              >
                            </button>
                            <button
                              @click=${this.handleSave}
                              type="button"
                              class="btn btn-dark mx-2"
                              aria-label=${attr__("Save")}
                            >
                              ${litFontawesome_2(faSave)}
                              <span>${__("Save")}</span>
                            </button>
                            <button
                              @click=${this.handleDelete}
                              ?hidden=${!this.isDeletable}
                              type="button"
                              class="btn btn-danger mx-2"
                              aria-label=${attr__("Delete")}
                            >
                              ${litFontawesome_2(faTrash)}
                              <span>${__("Delete")}</span>
                            </button>
                          </div>
                        </td>
                      `
            : A}
                </tr>
              `)}
          </tbody>
        </table>
      </div>
    `;
        }
    };
    LMSTable.styles = [
        bootstrapStyles,
        skeletonStyles,
        utilityStyles,
        i$5 `
      table {
        background: white;
        padding: 1em;
      }

      svg {
        display: inline-block;
        width: 1em;
        height: 1em;
        color: #ffffff;
      }

      .fa-sort-up,
      .fa-sort-down {
        color: #000000;
      }

      button {
        white-space: nowrap;
      }

      input[type="checkbox"].form-control {
        font-size: 0.375rem;
      }

      .table tr {
        height: 100%;
      }

      input:not([type="checkbox"]),
      select,
      textarea {
        border: none !important;
        border-radius: 0 !important;
        height: inherit !important;
        width: 100%;
        min-width: fit-content;
        padding: 1.5rem 0.75rem;
      }

      .table th {
        cursor: pointer;
      }

      .table td {
        padding: 0;
        text-align: center;
        height: inherit;
      }

      .pip {
        background: #ffffff;
        bottom: 4em;
        box-shadow: var(--shadow-hv);
        height: fit-content;
        left: 1em;
        max-height: 30vh;
        max-height: 30dvh;
        overflow-y: scroll;
        padding: 1em;
        position: absolute;
      }
    `,
    ];
    __decorate([
        e$2({ type: Array })
    ], LMSTable.prototype, "data", void 0);
    __decorate([
        e$2({ type: Array })
    ], LMSTable.prototype, "order", void 0);
    __decorate([
        e$2({ type: Array })
    ], LMSTable.prototype, "headers", void 0);
    __decorate([
        e$2({ type: Boolean, attribute: "is-editable" })
    ], LMSTable.prototype, "isEditable", void 0);
    __decorate([
        e$2({ type: Boolean, attribute: "is-deletable" })
    ], LMSTable.prototype, "isDeletable", void 0);
    __decorate([
        e$2({ type: Object })
    ], LMSTable.prototype, "queryBuilder", void 0);
    __decorate([
        e$2({ type: Array })
    ], LMSTable.prototype, "nextPage", void 0);
    __decorate([
        e$2({ type: Boolean })
    ], LMSTable.prototype, "hasNoResults", void 0);
    __decorate([
        e$2({ type: Number })
    ], LMSTable.prototype, "_page", void 0);
    __decorate([
        e$2({ type: Number })
    ], LMSTable.prototype, "_per_page", void 0);
    __decorate([
        t$1()
    ], LMSTable.prototype, "toast", void 0);
    __decorate([
        e$1("input, select, textarea")
    ], LMSTable.prototype, "inputs", void 0);
    __decorate([
        e$1(".btn-edit")
    ], LMSTable.prototype, "editButtons", void 0);
    __decorate([
        i$2("table")
    ], LMSTable.prototype, "table", void 0);
    LMSTable = __decorate([
        e$3("lms-table")
    ], LMSTable);
    var LMSTable$1 = LMSTable;

    let LMSEventTypesTable$1 = class LMSEventTypesTable extends LMSTable$1 {
        handleInput(input, value) {
            if (input instanceof HTMLInputElement && input.type === "checkbox") {
                return input.checked ? "1" : "0";
            }
            return value;
        }
        async handleSave(e) {
            var _a, _b;
            const target = e.target;
            let parent = target.parentElement;
            while (parent && parent.tagName !== "TR") {
                parent = parent.parentElement;
            }
            let id, inputs = undefined;
            if (parent) {
                id = (_b = (_a = parent.firstElementChild) === null || _a === void 0 ? void 0 : _a.textContent) === null || _b === void 0 ? void 0 : _b.trim();
                inputs = parent.querySelectorAll("input, select, textarea");
            }
            if (!id || !inputs) {
                return;
            }
            const response = await fetch(`/api/v1/contrib/eventmanagement/event_types/${id}`, {
                method: "PUT",
                body: JSON.stringify({
                    ...Array.from(inputs).reduce((acc, input) => {
                        if (input.dataset.group && input instanceof HTMLInputElement) {
                            const group = input.dataset.group;
                            if (!(group in acc)) {
                                acc[group] = [];
                            }
                            const { id, name, value } = input;
                            const groupArray = acc[group];
                            const groupIndex = groupArray.findIndex((item) => item.id === id);
                            if (groupIndex === -1) {
                                groupArray.push({
                                    id,
                                    [name]: this.handleInput(input, value),
                                });
                                return acc;
                            }
                            groupArray[groupIndex][name] = this.handleInput(input, value);
                            return acc;
                        }
                        acc[input.name] = this.handleInput(input, input.value);
                        return acc;
                    }, {}),
                }),
            });
            if (response.status >= 200 && response.status <= 299) {
                inputs.forEach((input) => {
                    input.disabled = true;
                });
                this.dispatchEvent(new CustomEvent("updated", { detail: id }));
                return;
            }
            if (response.status >= 400) {
                const error = await response.json();
                this.renderToast(response.statusText, error);
            }
        }
        async handleDelete(e) {
            var _a, _b;
            const target = e.target;
            let parent = target.parentElement;
            while (parent && parent.tagName !== "TR") {
                parent = parent.parentElement;
            }
            let id = undefined;
            if (parent) {
                id = (_b = (_a = parent.firstElementChild) === null || _a === void 0 ? void 0 : _a.textContent) === null || _b === void 0 ? void 0 : _b.trim();
            }
            if (!id) {
                return;
            }
            const response = await fetch(`/api/v1/contrib/eventmanagement/event_types/${id}`, { method: "DELETE" });
            if (response.status >= 200 && response.status <= 299) {
                this.dispatchEvent(new CustomEvent("deleted", { detail: id }));
                return;
            }
            if (response.status >= 400) {
                const error = await response.json();
                this.renderToast(response.statusText, error);
            }
        }
        constructor() {
            super();
            this.target_groups = [];
            this.locations = [];
            this.event_types = [];
            this.order = [
                "id",
                "name",
                "target_groups",
                "min_age",
                "max_age",
                "max_participants",
                "location",
                "image",
                "description",
                "open_registration",
            ];
            this.unsortableColumns = ["target_groups"];
            this.isEditable = true;
            this.isDeletable = true;
        }
        connectedCallback() {
            super.connectedCallback();
            this.hydrate();
        }
        hydrate() {
            this.data = this.event_types.map((event_type) => {
                return Object.fromEntries(this.getColumnData(event_type, [
                    ["target_groups", this.target_groups],
                    ["location", this.locations],
                ]));
            });
        }
        updated(changedProperties) {
            super.updated(changedProperties);
            if (changedProperties.has("event_types")) {
                this.hydrate();
            }
        }
    };
    __decorate([
        e$2({ type: Array })
    ], LMSEventTypesTable$1.prototype, "target_groups", void 0);
    __decorate([
        e$2({ type: Array })
    ], LMSEventTypesTable$1.prototype, "locations", void 0);
    __decorate([
        e$2({ type: Array })
    ], LMSEventTypesTable$1.prototype, "event_types", void 0);
    LMSEventTypesTable$1 = __decorate([
        e$3("lms-event-types-table")
    ], LMSEventTypesTable$1);
    var LMSEventTypesTable$2 = LMSEventTypesTable$1;

    let LMSLocationsModal = class LMSLocationsModal extends LMSModal$1 {
        constructor() {
            super(...arguments);
            this.createOpts = {
                method: "POST",
                endpoint: "/api/v1/contrib/eventmanagement/locations",
            };
        }
        connectedCallback() {
            super.connectedCallback();
            this.hydrate();
        }
        hydrate() {
            this.modalTitle = __("Create Location");
            this.fields = [
                {
                    name: "name",
                    type: "text",
                    desc: __("Name"),
                    required: true,
                    value: "",
                },
                {
                    name: "street",
                    type: "text",
                    desc: __("Street"),
                    required: true,
                    value: "",
                },
                {
                    name: "number",
                    type: "text",
                    desc: __("Number"),
                    required: false,
                    value: "",
                },
                {
                    name: "city",
                    type: "text",
                    desc: __("City"),
                    required: false,
                    value: "",
                },
                {
                    name: "zip",
                    type: "text",
                    desc: __("Zip"),
                    required: false,
                    value: "0",
                },
                {
                    name: "country",
                    type: "text",
                    desc: __("Country"),
                    required: false,
                    value: "",
                },
            ];
        }
    };
    __decorate([
        e$2({ type: Object })
    ], LMSLocationsModal.prototype, "createOpts", void 0);
    LMSLocationsModal = __decorate([
        e$3("lms-locations-modal")
    ], LMSLocationsModal);
    var LMSLocationsModal$1 = LMSLocationsModal;

    let LMSLocationsTable = class LMSLocationsTable extends LMSTable$1 {
        async handleSave(e) {
            var _a, _b;
            const target = e.target;
            let parent = target.parentElement;
            while (parent && parent.tagName !== "TR") {
                parent = parent.parentElement;
            }
            let id, inputs = undefined;
            if (parent) {
                id = (_b = (_a = parent.firstElementChild) === null || _a === void 0 ? void 0 : _a.textContent) === null || _b === void 0 ? void 0 : _b.trim();
                inputs = parent.querySelectorAll("input");
            }
            if (!id || !inputs) {
                return;
            }
            const response = await fetch(`/api/v1/contrib/eventmanagement/locations/${id}`, {
                method: "PUT",
                body: JSON.stringify({
                    ...Array.from(inputs).reduce((acc, input) => {
                        acc[input.name] = input.value;
                        return acc;
                    }, {}),
                }),
            });
            if (response.status >= 200 && response.status <= 299) {
                inputs.forEach((input) => {
                    input.disabled = true;
                });
                this.dispatchEvent(new CustomEvent("updated", { detail: id }));
                return;
            }
            if (response.status >= 400) {
                const error = await response.json();
                this.renderToast(response.statusText, error);
            }
        }
        async handleDelete(e) {
            var _a, _b;
            const target = e.target;
            let parent = target.parentElement;
            while (parent && parent.tagName !== "TR") {
                parent = parent.parentElement;
            }
            let id = undefined;
            if (parent) {
                id = (_b = (_a = parent.firstElementChild) === null || _a === void 0 ? void 0 : _a.textContent) === null || _b === void 0 ? void 0 : _b.trim();
            }
            if (!id) {
                return;
            }
            const response = await fetch(`/api/v1/contrib/eventmanagement/locations/${id}`, { method: "DELETE" });
            if (response.status >= 200 && response.status <= 299) {
                this.dispatchEvent(new CustomEvent("deleted", { detail: id }));
                return;
            }
            if (response.status >= 400) {
                const error = await response.json();
                this.renderToast(response.statusText, error);
            }
        }
        constructor() {
            super();
            this.locations = [];
            this.order = [
                "id",
                "name",
                "street",
                "number",
                "city",
                "zip",
                "country",
            ];
            this.isEditable = true;
            this.isDeletable = true;
        }
        connectedCallback() {
            super.connectedCallback();
            this.hydrate();
        }
        hydrate() {
            this.data = this.locations.map((location) => {
                return Object.fromEntries(this.getColumnData(location));
            });
        }
        updated(changedProperties) {
            super.updated(changedProperties);
            if (changedProperties.has("locations")) {
                this.hydrate();
            }
        }
    };
    __decorate([
        e$2({ type: Array })
    ], LMSLocationsTable.prototype, "locations", void 0);
    LMSLocationsTable = __decorate([
        e$3("lms-locations-table")
    ], LMSLocationsTable);
    var LMSLocationsTable$1 = LMSLocationsTable;

    let LMSTargetGroupsModal = class LMSTargetGroupsModal extends LMSModal$1 {
        constructor() {
            super(...arguments);
            this.createOpts = {
                method: "POST",
                endpoint: "/api/v1/contrib/eventmanagement/target_groups",
            };
        }
        connectedCallback() {
            super.connectedCallback();
            this.hydrate();
        }
        hydrate() {
            this.modalTitle = __("Create Target Group");
            this.fields = [
                {
                    name: "name",
                    type: "text",
                    desc: __("Name"),
                    required: true,
                    value: "",
                },
                {
                    name: "min_age",
                    type: "number",
                    desc: __("Min Age"),
                    required: true,
                    value: "0",
                },
                {
                    name: "max_age",
                    type: "number",
                    desc: __("Max Age"),
                    required: false,
                    value: "0",
                },
            ];
        }
    };
    __decorate([
        e$2({ type: Object })
    ], LMSTargetGroupsModal.prototype, "createOpts", void 0);
    LMSTargetGroupsModal = __decorate([
        e$3("lms-target-groups-modal")
    ], LMSTargetGroupsModal);
    var LMSTargetGroupsModal$1 = LMSTargetGroupsModal;

    let LMSEventTypesTable = class LMSEventTypesTable extends LMSTable$1 {
        async handleSave(e) {
            var _a, _b;
            const target = e.target;
            let parent = target.parentElement;
            while (parent && parent.tagName !== "TR") {
                parent = parent.parentElement;
            }
            let id, inputs = undefined;
            if (parent) {
                id = (_b = (_a = parent.firstElementChild) === null || _a === void 0 ? void 0 : _a.textContent) === null || _b === void 0 ? void 0 : _b.trim();
                inputs = parent.querySelectorAll("input");
            }
            if (!id || !inputs) {
                return;
            }
            const response = await fetch(`/api/v1/contrib/eventmanagement/target_groups/${id}`, {
                method: "PUT",
                body: JSON.stringify({
                    ...Array.from(inputs).reduce((acc, input) => {
                        acc[input.name] = input.value;
                        return acc;
                    }, {}),
                }),
            });
            if (response.status >= 200 && response.status <= 299) {
                inputs.forEach((input) => {
                    input.disabled = true;
                });
                this.dispatchEvent(new CustomEvent("updated", { detail: id }));
                return;
            }
            if (response.status >= 400) {
                const error = await response.json();
                this.renderToast(response.statusText, error);
            }
        }
        async handleDelete(e) {
            var _a, _b;
            const target = e.target;
            let parent = target.parentElement;
            while (parent && parent.tagName !== "TR") {
                parent = parent.parentElement;
            }
            let id = undefined;
            if (parent) {
                id = (_b = (_a = parent.firstElementChild) === null || _a === void 0 ? void 0 : _a.textContent) === null || _b === void 0 ? void 0 : _b.trim();
            }
            if (!id) {
                return;
            }
            const response = await fetch(`/api/v1/contrib/eventmanagement/target_groups/${id}`, { method: "DELETE" });
            if (response.status >= 200 && response.status <= 299) {
                this.dispatchEvent(new CustomEvent("deleted", { detail: id }));
                return;
            }
            if (response.status >= 400) {
                const error = await response.json();
                this.renderToast(response.statusText, error);
            }
        }
        constructor() {
            super();
            this.target_groups = [];
            this.order = ["id", "name", "min_age", "max_age"];
            this.isEditable = true;
            this.isDeletable = true;
        }
        connectedCallback() {
            super.connectedCallback();
            this.hydrate();
        }
        hydrate() {
            this.data = this.target_groups.map((target_group) => {
                return Object.fromEntries(this.getColumnData(target_group));
            });
        }
        updated(changedProperties) {
            super.updated(changedProperties);
            if (changedProperties.has("target_groups")) {
                this.hydrate();
            }
        }
    };
    __decorate([
        e$2({ type: Array })
    ], LMSEventTypesTable.prototype, "target_groups", void 0);
    LMSEventTypesTable = __decorate([
        e$3("lms-target-groups-table")
    ], LMSEventTypesTable);
    var LMSTargetGroupsTable = LMSEventTypesTable;

    /**
     * QueryBuilder class that manages URL query parameters.
     */
    class QueryBuilder {
        /**
         * Initialize the QueryBuilder with empty parameters.
         */
        constructor() {
            this._query = new URLSearchParams();
            this._reservedParams = [];
            this._disallowedParams = [];
            this._areRepeatable = [];
            this._staticParams = new URLSearchParams();
        }
        /**
         * Set the reserved parameters.
         * @param {string[]} reservedParams - The reserved parameters.
         */
        set reservedParams(reservedParams) {
            this._reservedParams = reservedParams;
        }
        /**
         * Set the disallowed parameters.
         * @param {string[]} disallowedParams - The disallowed parameters.
         */
        set disallowedParams(disallowedParams) {
            this._disallowedParams = disallowedParams;
        }
        /**
         * Set the repeatable parameters.
         * @param {string[]} areRepeatable - The repeatable parameters.
         */
        set areRepeatable(areRepeatable) {
            this._areRepeatable = areRepeatable;
        }
        /**
         * Set the static parameters.
         * @param {string[]} staticParams - The static parameters.
         */
        set staticParams(staticParams) {
            if (!this._query) {
                throw new Error("Cannot set static params before query");
            }
            staticParams.forEach((key) => {
                const value = this._query.get(key);
                if (value) {
                    this._staticParams.set(key, value);
                }
            });
        }
        /**
         * Set the query parameters.
         * @param {URLSearchParams | string} query - The query parameters.
         */
        set query(query) {
            if (typeof query === "string") {
                this._query = new URLSearchParams(query);
            }
            else {
                this._query = query;
            }
        }
        /**
         * Get the query parameters.
         * @return {URLSearchParams} The query parameters.
         */
        get query() {
            return this._query;
        }
        /**
         * Get the value of a query parameter.
         * @param {string} key - The key of the query parameter.
         * @return {string | null} The value of the query parameter.
         */
        getParamValue(key) {
            return this._query.get(key);
        }
        /**
         * Updates the query parameters.
         * @param {URLSearchParams | string} query - The new query parameters.
         */
        updateQuery(query) {
            const newQueryParams = new URLSearchParams(query);
            /** Remove keys that are not in the new query if they are not reserved.
             *  WARNING! Always use Array.from() when iterating over URLSearchParams
             *  because it is a live collection and will be modified during iteration
             *  otherwise. */
            Array.from(this._query).forEach(([key]) => {
                if (this._reservedParams.includes(key)) {
                    return;
                }
                if (!newQueryParams.has(key)) {
                    this._query.delete(key);
                }
            });
            newQueryParams.forEach((value, key) => {
                // If key is disallowed, do nothing
                if (this._disallowedParams.includes(key)) {
                    return;
                }
                // Handle different cases based on key
                switch (true) {
                    // If key is reserved, update its value
                    case this._reservedParams.includes(key):
                        this._query.set(key, value);
                        break;
                    // If key is repeatable, update its values
                    case this._areRepeatable.includes(key): {
                        const existingValues = this._query.getAll(key);
                        const newValues = new Set(newQueryParams.getAll(key));
                        // Create a new URLSearchParams instance to hold the updated parameters
                        const updatedQuery = new URLSearchParams();
                        // Add the values that are present in both existing and new values
                        for (const [k, v] of this._query.entries()) {
                            if (k !== key || (k === key && newValues.has(v))) {
                                updatedQuery.append(k, v);
                            }
                        }
                        // Add new values that are not in the existing values
                        for (const v of newValues) {
                            if (!existingValues.includes(v)) {
                                updatedQuery.append(key, v);
                            }
                        }
                        // Replace the old query parameters with the updated parameters
                        this._query = updatedQuery;
                        break;
                    }
                    // If key is not reserved and not repeatable, set its value
                    default:
                        this._query.set(key, value);
                        break;
                }
            });
        }
        /**
         * Updates the current URL with the current query parameters.
         */
        updateUrl() {
            const url = new URL(window.location.href);
            const updatedUrl = new URLSearchParams(this._query.toString() + "&" + this._staticParams.toString());
            url.search = updatedUrl.toString();
            window.history.pushState({}, "", url.toString());
        }
    }

    let LMSEventsView = class LMSEventsView extends s {
        constructor() {
            super();
            this.borrowernumber = undefined;
            this.events = [];
            this.locations = [];
            this.modalData = {};
            this.hasOpenModal = false;
            this.hasLoaded = false;
            this.queryBuilder = new QueryBuilder();
            this.boundHandlePopState = this.handlePopState.bind(this);
            this.queryBuilder.reservedParams = [
                "_match",
                "_order_by",
                "_page",
                "_per_page",
                "q",
            ];
            this.queryBuilder.areRepeatable = [
                "event_type",
                "target_group",
                "location",
            ];
            this.queryBuilder.query = window.location.search;
            this.queryBuilder.updateQuery("_order_by=start_time&_page=1&_per_page=20&open_registration=true");
        }
        connectedCallback() {
            super.connectedCallback();
            window.addEventListener("popstate", this.boundHandlePopState);
            Promise.all([
                requestHandler.request("getEventsPublic", this.queryBuilder.query.toString()),
                requestHandler.request("getLocationsPublic"),
            ])
                .then((results) => Promise.all(results.map((result) => result.json())))
                .then(([events, locations]) => {
                this.hasLoaded = true;
                this.events = events;
                this.locations = locations;
                this.queryBuilder.updateUrl();
            })
                .catch((error) => {
                console.error(error);
            });
        }
        disconnectedCallback() {
            super.disconnectedCallback();
            window.removeEventListener("popstate", this.boundHandlePopState);
        }
        handlePopState(e) {
            const { state } = e;
            const url = new URL((state === null || state === void 0 ? void 0 : state.url) || window.location.href);
            this.handleQuery(new CustomEvent("query", { detail: url.search }), false);
        }
        handleQuery(e, updateUrl = true) {
            const query = e.detail;
            this.queryBuilder.updateQuery(query);
            const response = async () => await requestHandler.request("getEventsPublic", this.queryBuilder.query.toString());
            response()
                .then((response) => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error("Something went wrong");
            })
                .then((events) => {
                this.events = events;
                if (updateUrl) {
                    this.queryBuilder.updateUrl();
                }
            })
                .catch((error) => {
                console.error(error);
            });
        }
        handleShowDetails({ lmsEvent }) {
            this.modalData = lmsEvent;
            this.hasOpenModal = true;
        }
        handleHideDetails() {
            this.modalData = {};
            this.hasOpenModal = false;
        }
        handleLoadMore() {
            const currentPage = this.queryBuilder.getParamValue("_page");
            if (!currentPage)
                return;
            const nextPage = parseInt(currentPage, 10) + 1;
            this.queryBuilder.updateQuery(`_page=${nextPage}`);
            const response = async () => await requestHandler.request("getEventsPublic", this.queryBuilder.query.toString());
            response()
                .then((response) => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error("Something went wrong");
            })
                .then((events) => {
                var _a, _b;
                if (!events.length) {
                    this.queryBuilder.updateQuery(`_page=${currentPage}`);
                    (_a = this.loadMore.querySelector("button")) === null || _a === void 0 ? void 0 : _a.classList.add("d-none");
                    (_b = this.loadMore.firstElementChild) === null || _b === void 0 ? void 0 : _b.classList.remove("d-none");
                    return;
                }
                this.events = [...this.events, ...events];
            })
                .catch((error) => {
                console.error(error);
            });
        }
        render() {
            var _a;
            return x `
      <div class="container-fluid px-0">
        <div class="row">
          <div class="col-12 mb-3">
            <lms-events-filter
              @filter=${this.handleQuery}
              @search=${this.handleQuery}
              .events=${this.events}
            >
              ${!this.hasLoaded
            ? x `<div class="d-flex justify-content-around flex-wrap">
                    ${o$2([...Array(10)], () => x `<div class="skeleton skeleton-card"></div>`)}
                  </div>`
            : A}
              ${this.hasLoaded && !this.events.length
            ? x `<div class="col-12" ?hidden=${this.events.length > 0}>
                    <div class="alert alert-info" role="alert">
                      ${__("There are no events to display")}
                    </div>
                  </div>`
            : A}
              <div class="col-12" ?hidden=${!this.events.length}>
                <div class="card-deck">
                  ${(_a = o$2(this.events, (event) => {
            var _a;
            const [sDate, sTime] = splitDateTime(event.start_time, locale);
            const [eDate, eTime] = splitDateTime(event.end_time, locale);
            const isSameDay = sDate === eDate;
            return x `
                      <lms-card
                        tabindex="0"
                        @keyup=${(e) => {
                if (e.key === "Enter") {
                    this.handleShowDetails({ lmsEvent: event });
                }
            }}
                        @click=${() => {
                this.handleShowDetails({ lmsEvent: event });
            }}
                        .title=${event.name}
                        .listItems=${[
                x `<span class="text-muted font-weight-light">
                            <small>
                              ${litFontawesome_2(faMapMarkerAlt)}
                              ${((_a = this.locations.find((location) => location.id === parseInt(event.location, 10))) === null || _a === void 0 ? void 0 : _a.name) || __("Location not found")}
                            </small>
                          </span>`,
                x `<span class="text-muted font-weight-light">
                            <small>
                              ${litFontawesome_2(faCalendarAlt)} ${sDate},
                              ${sTime} -
                              ${isSameDay ? eTime : `${eDate}, ${eTime}`}</small
                            ></span
                          >`,
            ]}
                        .image=${{ src: event.image, alt: event.name }}
                      ></lms-card>
                    `;
        })) !== null && _a !== void 0 ? _a : A}
                  <lms-card-details-modal
                    @close=${this.handleHideDetails}
                    .event=${this.modalData}
                    .isOpen=${this.hasOpenModal}
                  ></lms-card-details-modal>
                </div>
                <div class="d-flex justify-content-center load-more">
                  <span class="d-none text-center mt-3"
                    >${__("You've reached the end")}</span
                  >
                  <button
                    class="btn btn-primary btn-block mt-3 w-25"
                    ?hidden=${!this.events.length}
                    @click=${this.handleLoadMore}
                  >
                    ${__("Load more")}
                  </button>
                </div>
              </div>
            </lms-events-filter>
          </div>
        </div>
      </div>
    `;
        }
    };
    LMSEventsView.styles = [
        bootstrapStyles,
        skeletonStyles,
        i$5 `
      .card-deck {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(100%, 1fr));
      }

      @media (min-width: 768px) {
        .card-deck {
          grid-gap: 1rem;
        }

        .card-deck {
          grid-template-columns: repeat(auto-fill, minmax(33.33%, 1fr));
        }
      }

      @media (min-width: 992px) {
        .card-deck {
          grid-template-columns: repeat(auto-fill, minmax(25%, 1fr));
        }
      }

      @media (min-width: 1200px) {
        .card-deck {
          grid-template-columns: repeat(auto-fill, minmax(20%, 1fr));
        }
      }

      @media (min-width: 1600px) {
        .card-deck {
          grid-template-columns: repeat(auto-fill, minmax(16.67%, 1fr));
        }
      }
    `,
    ];
    __decorate([
        e$2({ type: String })
    ], LMSEventsView.prototype, "borrowernumber", void 0);
    __decorate([
        t$1()
    ], LMSEventsView.prototype, "events", void 0);
    __decorate([
        t$1()
    ], LMSEventsView.prototype, "locations", void 0);
    __decorate([
        t$1()
    ], LMSEventsView.prototype, "modalData", void 0);
    __decorate([
        t$1()
    ], LMSEventsView.prototype, "hasOpenModal", void 0);
    __decorate([
        i$2(".load-more")
    ], LMSEventsView.prototype, "loadMore", void 0);
    LMSEventsView = __decorate([
        e$3("lms-events-view")
    ], LMSEventsView);
    var LMSEventsView$1 = LMSEventsView;

    let StaffEventsView = class StaffEventsView extends s {
        constructor() {
            super();
            this.hasLoaded = false;
            this.nextPage = [];
            this._page = 1;
            this._per_page = 10;
            this.isEmpty = false;
            this.hasNoResults = false;
            this.events = [];
            this.event_types = [];
            this.target_groups = [];
            this.locations = [];
            this.queryBuilder = new QueryBuilder();
            this.filters = undefined;
            this.href = {
                path: "/cgi-bin/koha/plugins/run.pl",
                query: true,
                params: {
                    class: "Koha::Plugin::Com::LMSCloud::EventManagement",
                    method: "configure",
                },
            };
            this.queryBuilder.reservedParams = [
                "_match",
                "_order_by",
                "_page",
                "_per_page",
                "q",
            ];
            this.queryBuilder.query = window.location.search;
            this.queryBuilder.staticParams = ["class", "method", "op"];
            this.queryBuilder.areRepeatable = [
                "event_type",
                "target_group",
                "location",
            ];
            this.queryBuilder.updateQuery(`_order_by=id&_page=${this._page}&_per_page=${this._per_page}`);
        }
        connectedCallback() {
            super.connectedCallback();
            Promise.all([
                fetch(`/api/v1/contrib/eventmanagement/events?${this.queryBuilder.query.toString()}`),
                fetch("/api/v1/contrib/eventmanagement/event_types"),
                fetch("/api/v1/contrib/eventmanagement/target_groups"),
                fetch("/api/v1/contrib/eventmanagement/locations"),
            ])
                .then((results) => Promise.all(results.map((result) => result.json())))
                .then(([events, event_types, target_groups, locations]) => {
                this.event_types = event_types;
                this.target_groups = target_groups;
                this.locations = locations;
                this.events = events;
            })
                .then(() => {
                this.queryBuilder.updateUrl();
                this.isEmpty = !this.hasData();
                this.hasLoaded = true;
            });
        }
        hasData() {
            return [
                this.events,
                this.event_types,
                this.target_groups,
                this.locations,
            ].every((data) => data.length > 0);
        }
        async fetchUpdate() {
            const response = await fetch(`/api/v1/contrib/eventmanagement/events?${this.queryBuilder.query.toString()}`);
            this.events = await response.json();
            this.hasNoResults = this.events.length === 0;
            this.queryBuilder.updateUrl();
            this.requestUpdate();
        }
        async prefetchUpdate(e) {
            const { _page, _per_page } = e.detail;
            this.queryBuilder.updateQuery(`_page=${_page}&_per_page=${_per_page}`);
            const response = await fetch(`/api/v1/contrib/eventmanagement/events?${this.queryBuilder.query.toString()}`);
            this.nextPage = await response.json();
            this.queryBuilder.updateQuery(`_page=${this._page}&_per_page=${this._per_page}`);
        }
        handleSort(e) {
            const { _order_by } = e.detail;
            this.queryBuilder.updateQuery(`_order_by=${_order_by}`);
            this.fetchUpdate();
        }
        getParamsFromActiveFilters(filters) {
            const checkboxesArr = Array.from(filters);
            return checkboxesArr
                .filter((checkbox) => checkbox.checked)
                .map((checkbox) => ({ [checkbox.name]: checkbox.value }))
                .reduce((acc, filter, index) => {
                const [entries] = Object.entries(filter);
                const [param, value] = entries;
                acc += `${param}=${value}${index < checkboxesArr.length - 1 ? "&" : ""}`;
                return acc;
            }, "");
        }
        handleFilter(e) {
            const { filters } = e.detail;
            this.filters = filters;
            const activeFilters = this.getParamsFromActiveFilters(filters);
            this.queryBuilder.updateQuery(activeFilters);
            this.fetchUpdate();
        }
        handleSearch(e) {
            const { q } = e.detail;
            if (this.filters) {
                const activeFilters = this.getParamsFromActiveFilters(this.filters);
                this.queryBuilder.updateQuery(`${activeFilters}&q=${q}`);
            }
            else {
                this.queryBuilder.updateQuery(`q=${q}`);
            }
            this.fetchUpdate();
        }
        handlePageChange(e) {
            const { _page, _per_page } = e.detail;
            this._page = _page;
            this._per_page = _per_page;
            this.queryBuilder.updateQuery(`_page=${_page}&_per_page=${_per_page}`);
            this.fetchUpdate();
        }
        render() {
            if (!this.hasLoaded) {
                return x ` <div class="d-flex justify-content-around flex-wrap">
        ${o$2([...Array(10)], () => x `<div class="skeleton skeleton-card"></div>`)}
      </div>`;
            }
            if (this.hasLoaded && this.isEmpty) {
                return x ` <h1 class="text-center">
        ${__("You have to create a")}&nbsp;
        <lms-anchor
          .href=${{
                ...this.href,
                params: {
                    ...this.href.params,
                    op: "target-groups",
                },
            }}
          >${__("target group")}</lms-anchor
        >, ${__("a")}&nbsp;
        <lms-anchor
          .href=${{
                ...this.href,
                params: {
                    ...this.href.params,
                    op: "locations",
                },
            }}
          >${__("location")}</lms-anchor
        >
        &nbsp;${__("and an")}&nbsp;
        <lms-anchor
          .href=${{
                ...this.href,
                params: {
                    ...this.href.params,
                    op: "event-types",
                },
            }}
          >${__("event type")}</lms-anchor
        >
        &nbsp;${__("first")}.
      </h1>`;
            }
            return x `
      <lms-staff-event-card-deck
        .events=${this.events}
        .event_types=${this.event_types}
        .target_groups=${this.target_groups}
        .locations=${this.locations}
        ._page=${this._page}
        ._per_page=${this._per_page}
        .nextPage=${this.nextPage}
        .hasNoResults=${this.hasNoResults}
        @updated=${this.fetchUpdate}
        @deleted=${this.fetchUpdate}
        @sort=${this.handleSort}
        @search=${this.handleSearch}
        @filter=${this.handleFilter}
        @page=${this.handlePageChange}
        @prefetch=${this.prefetchUpdate}
      ></lms-staff-event-card-deck>
      <lms-events-modal @created=${this.fetchUpdate}></lms-events-modal>
    `;
        }
    };
    StaffEventsView.styles = [bootstrapStyles, skeletonStyles];
    __decorate([
        t$1()
    ], StaffEventsView.prototype, "hasLoaded", void 0);
    __decorate([
        t$1()
    ], StaffEventsView.prototype, "nextPage", void 0);
    StaffEventsView = __decorate([
        e$3("lms-staff-events-view")
    ], StaffEventsView);
    var StaffEventsView$1 = StaffEventsView;

    let StaffEventTypesView$1 = class StaffEventTypesView extends s {
        constructor() {
            super();
            this.href = {
                path: "/cgi-bin/koha/plugins/run.pl",
                query: true,
                params: {
                    class: "Koha::Plugin::Com::LMSCloud::EventManagement",
                    method: "configure",
                },
            };
            this.hasLoaded = false;
            this.nextPage = [];
            this._page = 1;
            this._per_page = 10;
            this.isEmpty = false;
            this.hasNoResults = false;
            this.event_types = [];
            this.target_groups = [];
            this.locations = [];
            this.queryBuilder = new QueryBuilder();
            this.queryBuilder.reservedParams = [
                "_match",
                "_order_by",
                "_page",
                "_per_page",
                "q",
            ];
            this.queryBuilder.query = window.location.search;
            this.queryBuilder.staticParams = ["class", "method", "op"];
            this.queryBuilder.updateQuery(`_order_by=id&_page=${this._page}&_per_page=${this._per_page}`);
        }
        connectedCallback() {
            super.connectedCallback();
            Promise.all([
                fetch("/api/v1/contrib/eventmanagement/target_groups"),
                fetch("/api/v1/contrib/eventmanagement/locations"),
                fetch(`/api/v1/contrib/eventmanagement/event_types?${this.queryBuilder.query.toString()}`),
            ])
                .then((results) => Promise.all(results.map((result) => result.json())))
                .then(([target_groups, locations, event_types]) => {
                this.target_groups = target_groups;
                this.locations = locations;
                this.event_types = event_types;
            })
                .then(() => {
                this.queryBuilder.updateUrl();
                this.isEmpty = !this.hasData();
                this.hasLoaded = true;
            });
        }
        async fetchUpdate() {
            const response = await fetch(`/api/v1/contrib/eventmanagement/event_types?${this.queryBuilder.query.toString()}`);
            this.event_types = await response.json();
            this.hasNoResults = this.event_types.length === 0;
            this.queryBuilder.updateUrl();
            this.requestUpdate();
        }
        async prefetchUpdate(e) {
            const { _page, _per_page } = e.detail;
            this.queryBuilder.updateQuery(`_page=${_page}&_per_page=${_per_page}`);
            const response = await fetch(`/api/v1/contrib/eventmanagement/event_types?${this.queryBuilder.query.toString()}`);
            this.nextPage = await response.json();
            this.queryBuilder.updateQuery(`_page=${this._page}&_per_page=${this._per_page}`);
        }
        handleSort(e) {
            const { _order_by } = e.detail;
            this.queryBuilder.updateQuery(`_order_by=${_order_by}`);
            this.fetchUpdate();
        }
        handleSearch(e) {
            const { q } = e.detail;
            this.queryBuilder.updateQuery(`q=${q}`);
            this.fetchUpdate();
        }
        handleFilter(e) {
            console.log(e.detail);
        }
        handlePageChange(e) {
            const { _page, _per_page } = e.detail;
            this._page = _page;
            this._per_page = _per_page;
            this.queryBuilder.updateQuery(`_page=${_page}&_per_page=${_per_page}`);
            this.fetchUpdate();
        }
        hasData() {
            return [this.target_groups, this.locations, this.event_types].every((data) => data.length > 0);
        }
        render() {
            if (!this.hasLoaded) {
                return x ` <div class="container-fluid mx-0">
        <div class="skeleton skeleton-table"></div>
      </div>`;
            }
            if (this.hasLoaded && this.isEmpty) {
                return x ` <h1 class="text-center">
        ${__("You have to create a")}&nbsp;
        <lms-anchor
          .href=${{
                ...this.href,
                params: {
                    ...this.href.params,
                    op: "target-groups",
                },
            }}
          >${__("target group")}</lms-anchor
        >&nbsp;${__("and a")}&nbsp;
        <lms-anchor
          .href=${{
                ...this.href,
                params: {
                    ...this.href.params,
                    op: "locations",
                },
            }}
          >${__("location")}</lms-anchor
        >
        &nbsp;${__("first")}.
      </h1>`;
            }
            return x `
      <lms-event-types-table
        .target_groups=${this.target_groups}
        .locations=${this.locations}
        .event_types=${this.event_types}
        ._page=${this._page}
        ._per_page=${this._per_page}
        .nextPage=${this.nextPage}
        .hasNoResults=${this.hasNoResults}
        @updated=${this.fetchUpdate}
        @deleted=${this.fetchUpdate}
        @sort=${this.handleSort}
        @search=${this.handleSearch}
        @filter=${this.handleFilter}
        @page=${this.handlePageChange}
        @prefetch=${this.prefetchUpdate}
      ></lms-event-types-table>
      <lms-event-types-modal
        @created=${this.fetchUpdate}
      ></lms-event-types-modal>
    `;
        }
    };
    StaffEventTypesView$1.styles = [bootstrapStyles, skeletonStyles];
    __decorate([
        e$2({ type: Object, attribute: false })
    ], StaffEventTypesView$1.prototype, "href", void 0);
    __decorate([
        t$1()
    ], StaffEventTypesView$1.prototype, "hasLoaded", void 0);
    __decorate([
        t$1()
    ], StaffEventTypesView$1.prototype, "nextPage", void 0);
    StaffEventTypesView$1 = __decorate([
        e$3("lms-staff-event-types-view")
    ], StaffEventTypesView$1);
    var StaffEventTypesView$2 = StaffEventTypesView$1;

    let StaffLocationsView = class StaffLocationsView extends s {
        constructor() {
            super();
            this.hasLoaded = false;
            this.nextPage = [];
            this._page = 1;
            this._per_page = 10;
            this.isEmpty = false;
            this.hasNoResults = false;
            this.locations = [];
            this.queryBuilder = new QueryBuilder();
            this.queryBuilder.reservedParams = [
                "_match",
                "_order_by",
                "_page",
                "_per_page",
                "q",
            ];
            this.queryBuilder.query = window.location.search;
            this.queryBuilder.staticParams = ["class", "method", "op"];
            this.queryBuilder.updateQuery(`_order_by=id&_page=${this._page}&_per_page=${this._per_page}`);
        }
        connectedCallback() {
            super.connectedCallback();
            const locations = fetch(`/api/v1/contrib/eventmanagement/locations?${this.queryBuilder.query.toString()}`);
            locations
                .then((response) => response.json())
                .then((result) => {
                this.locations = result;
            })
                .then(() => {
                this.queryBuilder.updateUrl();
                this.isEmpty = this.locations.length === 0;
                this.hasLoaded = true;
            });
        }
        async fetchUpdate() {
            const response = await fetch(`/api/v1/contrib/eventmanagement/locations?${this.queryBuilder.query.toString()}`);
            this.locations = await response.json();
            this.hasNoResults = this.locations.length === 0;
            this.queryBuilder.updateUrl();
            this.requestUpdate();
        }
        async prefetchUpdate(e) {
            const { _page, _per_page } = e.detail;
            this.queryBuilder.updateQuery(`_page=${_page}&_per_page=${_per_page}`);
            const response = await fetch(`/api/v1/contrib/eventmanagement/locations?${this.queryBuilder.query.toString()}`);
            this.nextPage = await response.json();
            this.queryBuilder.updateQuery(`_page=${this._page}&_per_page=${this._per_page}`);
        }
        handleSort(e) {
            const { _order_by } = e.detail;
            this.queryBuilder.updateQuery(`_order_by=${_order_by}`);
            this.fetchUpdate();
        }
        handleSearch(e) {
            const { q } = e.detail;
            this.queryBuilder.updateQuery(`q=${q}`);
            this.fetchUpdate();
        }
        handleFilter(e) {
            console.log(e.detail);
        }
        handlePageChange(e) {
            const { _page, _per_page } = e.detail;
            this._page = _page;
            this._per_page = _per_page;
            this.queryBuilder.updateQuery(`_page=${_page}&_per_page=${_per_page}`);
            this.fetchUpdate();
        }
        render() {
            if (!this.hasLoaded) {
                return x ` <div class="container-fluid mx-0">
        <div class="skeleton skeleton-table"></div>
      </div>`;
            }
            if (this.hasLoaded && this.isEmpty) {
                return x ` <h1 class="text-center">${__("No data to display")}.</h1>`;
            }
            return x `
      <lms-locations-table
        .locations=${this.locations}
        ._page=${this._page}
        ._per_page=${this._per_page}
        .nextPage=${this.nextPage}
        .hasNoResults=${this.hasNoResults}
        @updated=${this.fetchUpdate}
        @deleted=${this.fetchUpdate}
        @sort=${this.handleSort}
        @search=${this.handleSearch}
        @filter=${this.handleFilter}
        @page=${this.handlePageChange}
        @prefetch=${this.prefetchUpdate}
      ></lms-locations-table>
      <lms-locations-modal @created=${this.fetchUpdate}></lms-locations-modal>
    `;
        }
    };
    StaffLocationsView.styles = [bootstrapStyles, skeletonStyles];
    __decorate([
        t$1()
    ], StaffLocationsView.prototype, "hasLoaded", void 0);
    __decorate([
        t$1()
    ], StaffLocationsView.prototype, "nextPage", void 0);
    StaffLocationsView = __decorate([
        e$3("lms-staff-locations-view")
    ], StaffLocationsView);
    var StaffLocationsView$1 = StaffLocationsView;

    let StaffSettingsView = class StaffSettingsView extends s {
        render() {
            return x `<h1 class="text-center">${__("Not implemented")}!</h1>`;
        }
    };
    StaffSettingsView.styles = [bootstrapStyles, skeletonStyles];
    StaffSettingsView = __decorate([
        e$3("lms-staff-settings-view")
    ], StaffSettingsView);
    var StaffSettingsView$1 = StaffSettingsView;

    let StaffEventTypesView = class StaffEventTypesView extends s {
        constructor() {
            super();
            this.hasLoaded = false;
            this.nextPage = [];
            this._page = 1;
            this._per_page = 10;
            this.isEmpty = false;
            this.hasNoResults = false;
            this.target_groups = [];
            this.queryBuilder = new QueryBuilder();
            this.queryBuilder.reservedParams = [
                "_match",
                "_order_by",
                "_page",
                "_per_page",
                "q",
            ];
            this.queryBuilder.query = window.location.search;
            this.queryBuilder.staticParams = ["class", "method", "op"];
            this.queryBuilder.updateQuery(`_order_by=id&_page=${this._page}&_per_page=${this._per_page}`);
        }
        connectedCallback() {
            super.connectedCallback();
            const target_groups = fetch(`/api/v1/contrib/eventmanagement/target_groups?${this.queryBuilder.query.toString()}`);
            target_groups
                .then((response) => response.json())
                .then((result) => {
                this.target_groups = result;
            })
                .then(() => {
                this.queryBuilder.updateUrl();
                this.isEmpty = this.target_groups.length === 0;
                this.hasLoaded = true;
            });
        }
        async fetchUpdate() {
            const response = await fetch(`/api/v1/contrib/eventmanagement/target_groups?${this.queryBuilder.query.toString()}`);
            this.target_groups = await response.json();
            this.hasNoResults = this.target_groups.length === 0;
            this.queryBuilder.updateUrl();
            this.requestUpdate();
        }
        async prefetchUpdate(e) {
            const { _page, _per_page } = e.detail;
            this.queryBuilder.updateQuery(`_page=${_page}&_per_page=${_per_page}`);
            const response = await fetch(`/api/v1/contrib/eventmanagement/target_groups?${this.queryBuilder.query.toString()}`);
            this.nextPage = await response.json();
            this.queryBuilder.updateQuery(`_page=${this._page}&_per_page=${this._per_page}`);
        }
        handleSort(e) {
            const { _order_by } = e.detail;
            this.queryBuilder.updateQuery(`_order_by=${_order_by}`);
            this.fetchUpdate();
        }
        handleSearch(e) {
            const { q } = e.detail;
            this.queryBuilder.updateQuery(`q=${q}`);
            this.fetchUpdate();
        }
        handleFilter(e) {
            console.log(e.detail);
        }
        handlePageChange(e) {
            const { _page, _per_page } = e.detail;
            this._page = _page;
            this._per_page = _per_page;
            this.queryBuilder.updateQuery(`_page=${_page}&_per_page=${_per_page}`);
            this.fetchUpdate();
        }
        render() {
            if (!this.hasLoaded) {
                return x ` <div class="container-fluid mx-0">
        <div class="skeleton skeleton-table"></div>
      </div>`;
            }
            if (this.hasLoaded && this.isEmpty) {
                return x ` <h1 class="text-center">${__("No data to display")}.</h1>`;
            }
            return x `
      <lms-target-groups-table
        .target_groups=${this.target_groups}
        ._page=${this._page}
        ._per_page=${this._per_page}
        .nextPage=${this.nextPage}
        .hasNoResults=${this.hasNoResults}
        @updated=${this.fetchUpdate}
        @deleted=${this.fetchUpdate}
        @sort=${this.handleSort}
        @search=${this.handleSearch}
        @filter=${this.handleFilter}
        @page=${this.handlePageChange}
        @prefetch=${this.prefetchUpdate}
      ></lms-target-groups-table>
      <lms-target-groups-modal
        @created=${this.fetchUpdate}
      ></lms-target-groups-modal>
    `;
        }
    };
    StaffEventTypesView.styles = [bootstrapStyles, skeletonStyles];
    __decorate([
        t$1()
    ], StaffEventTypesView.prototype, "hasLoaded", void 0);
    __decorate([
        t$1()
    ], StaffEventTypesView.prototype, "nextPage", void 0);
    StaffEventTypesView = __decorate([
        e$3("lms-staff-target-groups-view")
    ], StaffEventTypesView);
    var StaffTargetGroupsView = StaffEventTypesView;

    var main = {
        LMSCheckboxInput: LMSCheckboxInput$1,
        LMSMatrix: LMSMatrix$1,
        LMSPrimitivesInput: LMSPrimitivesInput$1,
        LMSSelect: LMSSelect$1,
        LMSStaffEventCardAttendees: LMSStaffEventCardAttendees$1,
        LMSStaffEventCardPreview: LMSStaffEventCardPreview$1,
        LMSStaffEventCardForm: LMSStaffEventCardForm$1,
        LMSStaffEventCardsDeck,
        LMSStaffEventsFilter: LMSStaffEventsFilter$1,
        LMSTableControls: LMSTableControls$1,
        LMSAnchor: LMSAnchor$1,
        LMSCard: LMSCard$1,
        LMSCardDetailsModal: LMSCardDetailsModal$1,
        LMSDropdown: LMSDropdown$1,
        LMSEventsFilter: LMSEventsFilter$1,
        LMSFloatingMenu: LMSFloatingMenu$1,
        LMSImageBrowser: LMSImageBrowser$1,
        LMSModal: LMSModal$1,
        LMSPagination: LMSPagination$1,
        LMSSearch: LMSSearch$1,
        LMSTooltip: LMSTooltip$1,
        LMSEventMangementMenu: LMSEventMangementMenu$1,
        LMSEventsModal: LMSEventsModal$1,
        LMSEventTypesModal: LMSEventTypesModal$1,
        LMSEventTypesTable: LMSEventTypesTable$2,
        LMSLocationsModal: LMSLocationsModal$1,
        LMSLocationsTable: LMSLocationsTable$1,
        LMSTargetGroupsModal: LMSTargetGroupsModal$1,
        LMSTargetGroupsTable,
        LMSEventsView: LMSEventsView$1,
        StaffEventsView: StaffEventsView$1,
        StaffEventTypesView: StaffEventTypesView$2,
        StaffLocationsView: StaffLocationsView$1,
        StaffSettingsView: StaffSettingsView$1,
        StaffTargetGroupsView,
    };

    return main;

}));
//# sourceMappingURL=main.js.map
