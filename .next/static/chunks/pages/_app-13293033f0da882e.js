(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[636],{12099:(e,t,r)=>{"use strict";r.d(t,{A:()=>l,n:()=>n});var i=r(37876),a=r(89099),o=r(14232);let s=(0,o.createContext)();function n(e){let{children:t}=e,[r,n]=(0,o.useState)(null),[l,u]=(0,o.useState)(null),[c,d]=(0,o.useState)(!0),[f,p]=(0,o.useState)(!1),[m,g]=(0,o.useState)(!1);(0,o.useEffect)(()=>{let e=localStorage.getItem("user"),t=localStorage.getItem("token");t&&u(t),e&&n(JSON.parse(e)),d(!1)},[]);let h=async(e,t)=>{n(e),u(t),g(!0),p(!0),localStorage.setItem("user",JSON.stringify(e)),localStorage.setItem("token",t)},b=async()=>{if(f)return m;try{if(!l)return g(!1),p(!0),!1;let e=await fetch("https://apis.manuscripthq.com/api/user/authenticate-token",{method:"POST",headers:{"Content-Type":"application/json","auth-token":l}}),t=await e.json(),r="success"===t.status&&!0===t.data.isValid;return g(r),p(!0),r}catch(e){return console.error("Authentication check failed:",e),g(!1),p(!0),!1}};return(0,i.jsx)(s.Provider,{value:{user:r,loading:c,login:h,logout:()=>{n(null),u(null),g(!1),p(!0),localStorage.removeItem("user"),localStorage.removeItem("token"),a.router.push("/")},updateUser:e=>{n(e),localStorage.setItem("user",JSON.stringify(e))},token:l,isAuthenticated:b,authChecked:f,isAuthValid:m},children:t})}let l=()=>(0,o.useContext)(s)},31026:(e,t,r)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),Object.defineProperty(t,"useMergedRef",{enumerable:!0,get:function(){return a}});let i=r(14232);function a(e,t){let r=(0,i.useRef)(null),a=(0,i.useRef)(null);return(0,i.useCallback)(i=>{if(null===i){let e=r.current;e&&(r.current=null,e());let t=a.current;t&&(a.current=null,t())}else e&&(r.current=o(e,i)),t&&(a.current=o(t,i))},[e,t])}function o(e,t){if("function"!=typeof e)return e.current=t,()=>{e.current=null};{let r=e(t);return"function"==typeof r?r:()=>e(null)}}("function"==typeof t.default||"object"==typeof t.default&&null!==t.default)&&void 0===t.default.__esModule&&(Object.defineProperty(t.default,"__esModule",{value:!0}),Object.assign(t.default,t),e.exports=t.default)},32439:(e,t,r)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),Object.defineProperty(t,"Image",{enumerable:!0,get:function(){return x}});let i=r(64252),a=r(88365),o=r(37876),s=a._(r(14232)),n=i._(r(98477)),l=i._(r(89836)),u=r(84915),c=r(26904),d=r(90072);r(60546);let f=r(98265),p=i._(r(83829)),m=r(31026),g={deviceSizes:[640,750,828,1080,1200,1920,2048,3840],imageSizes:[16,32,48,64,96,128,256,384],path:"/_next/image",loader:"default",dangerouslyAllowSVG:!1,unoptimized:!1};function h(e,t,r,i,a,o,s){let n=null==e?void 0:e.src;e&&e["data-loaded-src"]!==n&&(e["data-loaded-src"]=n,("decode"in e?e.decode():Promise.resolve()).catch(()=>{}).then(()=>{if(e.parentElement&&e.isConnected){if("empty"!==t&&a(!0),null==r?void 0:r.current){let t=new Event("load");Object.defineProperty(t,"target",{writable:!1,value:e});let i=!1,a=!1;r.current({...t,nativeEvent:t,currentTarget:e,target:e,isDefaultPrevented:()=>i,isPropagationStopped:()=>a,persist:()=>{},preventDefault:()=>{i=!0,t.preventDefault()},stopPropagation:()=>{a=!0,t.stopPropagation()}})}(null==i?void 0:i.current)&&i.current(e)}}))}function b(e){return s.use?{fetchPriority:e}:{fetchpriority:e}}let v=(0,s.forwardRef)((e,t)=>{let{src:r,srcSet:i,sizes:a,height:n,width:l,decoding:u,className:c,style:d,fetchPriority:f,placeholder:p,loading:g,unoptimized:v,fill:y,onLoadRef:x,onLoadingCompleteRef:w,setBlurComplete:j,setShowAltText:_,sizesInput:E,onLoad:C,onError:S,...O}=e,k=(0,s.useCallback)(e=>{e&&(S&&(e.src=e.src),e.complete&&h(e,p,x,w,j,v,E))},[r,p,x,w,j,S,v,E]),P=(0,m.useMergedRef)(t,k);return(0,o.jsx)("img",{...O,...b(f),loading:g,width:l,height:n,decoding:u,"data-nimg":y?"fill":"1",className:c,style:d,sizes:a,srcSet:i,src:r,ref:P,onLoad:e=>{h(e.currentTarget,p,x,w,j,v,E)},onError:e=>{_(!0),"empty"!==p&&j(!0),S&&S(e)}})});function y(e){let{isAppRouter:t,imgAttributes:r}=e,i={as:"image",imageSrcSet:r.srcSet,imageSizes:r.sizes,crossOrigin:r.crossOrigin,referrerPolicy:r.referrerPolicy,...b(r.fetchPriority)};return t&&n.default.preload?(n.default.preload(r.src,i),null):(0,o.jsx)(l.default,{children:(0,o.jsx)("link",{rel:"preload",href:r.srcSet?void 0:r.src,...i},"__nimg-"+r.src+r.srcSet+r.sizes)})}let x=(0,s.forwardRef)((e,t)=>{let r=(0,s.useContext)(f.RouterContext),i=(0,s.useContext)(d.ImageConfigContext),a=(0,s.useMemo)(()=>{var e;let t=g||i||c.imageConfigDefault,r=[...t.deviceSizes,...t.imageSizes].sort((e,t)=>e-t),a=t.deviceSizes.sort((e,t)=>e-t),o=null==(e=t.qualities)?void 0:e.sort((e,t)=>e-t);return{...t,allSizes:r,deviceSizes:a,qualities:o}},[i]),{onLoad:n,onLoadingComplete:l}=e,m=(0,s.useRef)(n);(0,s.useEffect)(()=>{m.current=n},[n]);let h=(0,s.useRef)(l);(0,s.useEffect)(()=>{h.current=l},[l]);let[b,x]=(0,s.useState)(!1),[w,j]=(0,s.useState)(!1),{props:_,meta:E}=(0,u.getImgProps)(e,{defaultLoader:p.default,imgConf:a,blurComplete:b,showAltText:w});return(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)(v,{..._,unoptimized:E.unoptimized,placeholder:E.placeholder,fill:E.fill,onLoadRef:m,onLoadingCompleteRef:h,setBlurComplete:x,setShowAltText:j,sizesInput:e.sizes,ref:t}),E.priority?(0,o.jsx)(y,{isAppRouter:!r,imgAttributes:_}):null]})});("function"==typeof t.default||"object"==typeof t.default&&null!==t.default)&&void 0===t.default.__esModule&&(Object.defineProperty(t.default,"__esModule",{value:!0}),Object.assign(t.default,t),e.exports=t.default)},34042:(e,t,r)=>{"use strict";r.r(t),r.d(t,{default:()=>g});var i=r(37876),a=r(12099);r(53021);var o=r(89099),s=r(14232),n=r(97685),l=r(75719);let u=e=>{let{message:t="Checking authentication..."}=e;return(0,i.jsx)("div",{className:"flex items-center justify-center min-h-screen bg-background",children:(0,i.jsxs)("div",{className:"flex flex-col items-center justify-center gap-6",children:[(0,i.jsx)(l.N3,{size:"large",text:t,showLogo:!0}),(0,i.jsx)("div",{className:"text-center",children:(0,i.jsx)("p",{className:"text-xs text-muted-foreground",children:"Please wait while we verify your credentials"})})]})})};var c=r(85515);let d=["/dashboard/manuscript","/dashboard/editor","/dashboard/formatting-wizard","/dashboard/marketing","/dashboard/distribution"];function f(e){let{children:t}=e,r=(0,o.useRouter)(),{user:n,loading:l}=(0,a.A)(),u=r.pathname;return((0,s.useEffect)(()=>{if(!l&&d.some(e=>u.startsWith(e))&&(null==n?void 0:n.subscription)!=="Premium")return void r.replace("/dashboard/subscription?upgrade=required")},[u,n,l,r]),l)?(0,i.jsx)(c.Gw,{}):d.some(e=>u.startsWith(e))&&(null==n?void 0:n.subscription)!=="Premium"?(0,i.jsx)(c.Gw,{message:"Redirecting to subscription..."}):t}var p=r(57776);function m(e){let{children:t}=e,r=(0,o.useRouter)(),{isAuthenticated:n,loading:l,user:c}=(0,a.A)(),[d,f]=(0,s.useState)(!0),[p,m]=(0,s.useState)(!1),g=["/","/register","/forgot-password","/reset-password","/otp","/checklistpremium/[token]"];if((0,s.useEffect)(()=>{(async()=>{if(!l){let e=g.includes(r.pathname),t=await n();if(m(t),t&&c&&!1===c.isManuscript&&"/create-manuscripthq"!==r.pathname){r.replace("/create-manuscripthq"),f(!1);return}if(t&&"/register"===r.pathname||t&&e&&"/register"!==r.pathname&&"/checklistpremium/[token]"!==r.pathname){r.replace("/dashboard"),f(!1);return}if("/checklistpremium/[token]"===r.pathname)return f(!1);if(!t&&!e){r.replace("/"),f(!1);return}f(!1)}})()},[l,r.pathname,c]),l||d)return(0,i.jsx)(u,{message:"Checking authentication..."});let h=g.includes(r.pathname);return"/checklistpremium/[token]"===r.pathname||h||p||"/create-manuscripthq"===r.pathname?t:(0,i.jsx)(u,{message:"Authentication required..."})}function g(e){let{Component:t,pageProps:r}=e;return(0,i.jsx)(p.G_,{clientId:"898663677077-egb65e9bvlgvlbn6ubpbhaee3ovqjtmn.apps.googleusercontent.com",children:(0,i.jsx)(a.n,{children:(0,i.jsx)(m,{children:(0,i.jsxs)(f,{children:[(0,i.jsx)(t,{...r}),(0,i.jsx)(n.l$,{position:"top-right"})]})})})})}},45284:(e,t)=>{"use strict";function r(e){let{widthInt:t,heightInt:r,blurWidth:i,blurHeight:a,blurDataURL:o,objectFit:s}=e,n=i?40*i:t,l=a?40*a:r,u=n&&l?"viewBox='0 0 "+n+" "+l+"'":"";return"%3Csvg xmlns='http://www.w3.org/2000/svg' "+u+"%3E%3Cfilter id='b' color-interpolation-filters='sRGB'%3E%3CfeGaussianBlur stdDeviation='20'/%3E%3CfeColorMatrix values='1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 100 -1' result='s'/%3E%3CfeFlood x='0' y='0' width='100%25' height='100%25'/%3E%3CfeComposite operator='out' in='s'/%3E%3CfeComposite in2='SourceGraphic'/%3E%3CfeGaussianBlur stdDeviation='20'/%3E%3C/filter%3E%3Cimage width='100%25' height='100%25' x='0' y='0' preserveAspectRatio='"+(u?"none":"contain"===s?"xMidYMid":"cover"===s?"xMidYMid slice":"none")+"' style='filter: url(%23b);' href='"+o+"'/%3E%3C/svg%3E"}Object.defineProperty(t,"__esModule",{value:!0}),Object.defineProperty(t,"getImageBlurSvg",{enumerable:!0,get:function(){return r}})},53021:()=>{},53657:(e,t,r)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),!function(e,t){for(var r in t)Object.defineProperty(e,r,{enumerable:!0,get:t[r]})}(t,{default:function(){return l},getImageProps:function(){return n}});let i=r(64252),a=r(84915),o=r(32439),s=i._(r(83829));function n(e){let{props:t}=(0,a.getImgProps)(e,{defaultLoader:s.default,imgConf:{deviceSizes:[640,750,828,1080,1200,1920,2048,3840],imageSizes:[16,32,48,64,96,128,256,384],path:"/_next/image",loader:"default",dangerouslyAllowSVG:!1,unoptimized:!1}});for(let[e,r]of Object.entries(t))void 0===r&&delete t[e];return{props:t}}let l=o.Image},54587:(e,t,r)=>{e.exports=r(53657)},56556:(e,t,r)=>{(window.__NEXT_P=window.__NEXT_P||[]).push(["/_app",function(){return r(34042)}])},57776:(e,t,r)=>{"use strict";r.d(t,{G_:()=>o,mg:()=>s});var i=r(14232);let a=(0,i.createContext)(null);function o({clientId:e,nonce:t,onScriptLoadSuccess:r,onScriptLoadError:o,children:s}){let n=function(e={}){let{nonce:t,onScriptLoadSuccess:r,onScriptLoadError:a}=e,[o,s]=(0,i.useState)(!1),n=(0,i.useRef)(r);n.current=r;let l=(0,i.useRef)(a);return l.current=a,(0,i.useEffect)(()=>{let e=document.createElement("script");return e.src="https://accounts.google.com/gsi/client",e.async=!0,e.defer=!0,e.nonce=t,e.onload=()=>{var e;s(!0),null==(e=n.current)||e.call(n)},e.onerror=()=>{var e;s(!1),null==(e=l.current)||e.call(l)},document.body.appendChild(e),()=>{document.body.removeChild(e)}},[t]),o}({nonce:t,onScriptLoadSuccess:r,onScriptLoadError:o}),l=(0,i.useMemo)(()=>({clientId:e,scriptLoadedSuccessfully:n}),[e,n]);return i.createElement(a.Provider,{value:l},s)}function s({flow:e="implicit",scope:t="",onSuccess:r,onError:o,onNonOAuthError:s,overrideScope:n,state:l,...u}){let{clientId:c,scriptLoadedSuccessfully:d}=function(){let e=(0,i.useContext)(a);if(!e)throw Error("Google OAuth components must be used within GoogleOAuthProvider");return e}(),f=(0,i.useRef)(),p=(0,i.useRef)(r);p.current=r;let m=(0,i.useRef)(o);m.current=o;let g=(0,i.useRef)(s);g.current=s,(0,i.useEffect)(()=>{var r,i;if(!d)return;let a="implicit"===e?"initTokenClient":"initCodeClient";f.current=null==(i=null==(r=null==window?void 0:window.google)?void 0:r.accounts)?void 0:i.oauth2[a]({client_id:c,scope:n?t:`openid profile email ${t}`,callback:e=>{var t,r;if(e.error)return null==(t=m.current)?void 0:t.call(m,e);null==(r=p.current)||r.call(p,e)},error_callback:e=>{var t;null==(t=g.current)||t.call(g,e)},state:l,...u})},[c,d,e,t,l]);let h=(0,i.useCallback)(e=>{var t;return null==(t=f.current)?void 0:t.requestAccessToken(e)},[]),b=(0,i.useCallback)(()=>{var e;return null==(e=f.current)?void 0:e.requestCode()},[]);return"implicit"===e?h:b}},75719:(e,t,r)=>{"use strict";r.d(t,{N3:()=>n});var i=r(37876);r(14232);var a=r(54587),o=r.n(a);let s=e=>{let{size:t="default",className:r="",showLogo:a=!0}=e;return(0,i.jsxs)("div",{className:"flex flex-col items-center justify-center gap-4 ".concat(r),children:[a&&(0,i.jsx)("div",{className:"relative ".concat({small:"h-6 w-6",default:"h-12 w-12",large:"h-24 w-24"}[t]),children:(0,i.jsx)(o(),{src:"/images/home/logo.png",alt:"ManuscriptHQ Logo",fill:!0,className:"object-contain",priority:!0})}),(0,i.jsx)("div",{className:"animate-spin rounded-full border-b-2 border-primary ".concat({small:"h-4 w-4",default:"h-8 w-8",large:"h-32 w-32"}[t])})]})},n=e=>{let{size:t="default",className:r="",text:a="Loading...",showLogo:o=!0}=e;return(0,i.jsxs)("div",{className:"flex flex-col items-center justify-center gap-4 ".concat(r),children:[(0,i.jsx)(s,{size:t,showLogo:o}),(0,i.jsx)("p",{className:"text-sm text-muted-foreground animate-pulse",children:a})]})}},83829:(e,t)=>{"use strict";function r(e){var t;let{config:r,src:i,width:a,quality:o}=e,s=o||(null==(t=r.qualities)?void 0:t.reduce((e,t)=>Math.abs(t-75)<Math.abs(e-75)?t:e))||75;return r.path+"?url="+encodeURIComponent(i)+"&w="+a+"&q="+s+(i.startsWith("/_next/static/media/"),"")}Object.defineProperty(t,"__esModule",{value:!0}),Object.defineProperty(t,"default",{enumerable:!0,get:function(){return i}}),r.__next_img_default=!0;let i=r},84915:(e,t,r)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),Object.defineProperty(t,"getImgProps",{enumerable:!0,get:function(){return l}}),r(60546);let i=r(45284),a=r(26904),o=["-moz-initial","fill","none","scale-down",void 0];function s(e){return void 0!==e.default}function n(e){return void 0===e?e:"number"==typeof e?Number.isFinite(e)?e:NaN:"string"==typeof e&&/^[0-9]+$/.test(e)?parseInt(e,10):NaN}function l(e,t){var r,l;let u,c,d,{src:f,sizes:p,unoptimized:m=!1,priority:g=!1,loading:h,className:b,quality:v,width:y,height:x,fill:w=!1,style:j,overrideSrc:_,onLoad:E,onLoadingComplete:C,placeholder:S="empty",blurDataURL:O,fetchPriority:k,decoding:P="async",layout:R,objectFit:N,objectPosition:z,lazyBoundary:I,lazyRoot:M,...A}=e,{imgConf:D,showAltText:$,blurComplete:T,defaultLoader:L}=t,q=D||a.imageConfigDefault;if("allSizes"in q)u=q;else{let e=[...q.deviceSizes,...q.imageSizes].sort((e,t)=>e-t),t=q.deviceSizes.sort((e,t)=>e-t),i=null==(r=q.qualities)?void 0:r.sort((e,t)=>e-t);u={...q,allSizes:e,deviceSizes:t,qualities:i}}if(void 0===L)throw Object.defineProperty(Error("images.loaderFile detected but the file is missing default export.\nRead more: https://nextjs.org/docs/messages/invalid-images-config"),"__NEXT_ERROR_CODE",{value:"E163",enumerable:!1,configurable:!0});let F=A.loader||L;delete A.loader,delete A.srcSet;let G="__next_img_default"in F;if(G){if("custom"===u.loader)throw Object.defineProperty(Error('Image with src "'+f+'" is missing "loader" prop.\nRead more: https://nextjs.org/docs/messages/next-image-missing-loader'),"__NEXT_ERROR_CODE",{value:"E252",enumerable:!1,configurable:!0})}else{let e=F;F=t=>{let{config:r,...i}=t;return e(i)}}if(R){"fill"===R&&(w=!0);let e={intrinsic:{maxWidth:"100%",height:"auto"},responsive:{width:"100%",height:"auto"}}[R];e&&(j={...j,...e});let t={responsive:"100vw",fill:"100vw"}[R];t&&!p&&(p=t)}let B="",W=n(y),H=n(x);if((l=f)&&"object"==typeof l&&(s(l)||void 0!==l.src)){let e=s(f)?f.default:f;if(!e.src)throw Object.defineProperty(Error("An object should only be passed to the image component src parameter if it comes from a static image import. It must include src. Received "+JSON.stringify(e)),"__NEXT_ERROR_CODE",{value:"E460",enumerable:!1,configurable:!0});if(!e.height||!e.width)throw Object.defineProperty(Error("An object should only be passed to the image component src parameter if it comes from a static image import. It must include height and width. Received "+JSON.stringify(e)),"__NEXT_ERROR_CODE",{value:"E48",enumerable:!1,configurable:!0});if(c=e.blurWidth,d=e.blurHeight,O=O||e.blurDataURL,B=e.src,!w)if(W||H){if(W&&!H){let t=W/e.width;H=Math.round(e.height*t)}else if(!W&&H){let t=H/e.height;W=Math.round(e.width*t)}}else W=e.width,H=e.height}let U=!g&&("lazy"===h||void 0===h);(!(f="string"==typeof f?f:B)||f.startsWith("data:")||f.startsWith("blob:"))&&(m=!0,U=!1),u.unoptimized&&(m=!0),G&&!u.dangerouslyAllowSVG&&f.split("?",1)[0].endsWith(".svg")&&(m=!0);let X=n(v),J=Object.assign(w?{position:"absolute",height:"100%",width:"100%",left:0,top:0,right:0,bottom:0,objectFit:N,objectPosition:z}:{},$?{}:{color:"transparent"},j),V=T||"empty"===S?null:"blur"===S?'url("data:image/svg+xml;charset=utf-8,'+(0,i.getImageBlurSvg)({widthInt:W,heightInt:H,blurWidth:c,blurHeight:d,blurDataURL:O||"",objectFit:J.objectFit})+'")':'url("'+S+'")',Y=o.includes(J.objectFit)?"fill"===J.objectFit?"100% 100%":"cover":J.objectFit,Q=V?{backgroundSize:Y,backgroundPosition:J.objectPosition||"50% 50%",backgroundRepeat:"no-repeat",backgroundImage:V}:{},Z=function(e){let{config:t,src:r,unoptimized:i,width:a,quality:o,sizes:s,loader:n}=e;if(i)return{src:r,srcSet:void 0,sizes:void 0};let{widths:l,kind:u}=function(e,t,r){let{deviceSizes:i,allSizes:a}=e;if(r){let e=/(^|\s)(1?\d?\d)vw/g,t=[];for(let i;i=e.exec(r);)t.push(parseInt(i[2]));if(t.length){let e=.01*Math.min(...t);return{widths:a.filter(t=>t>=i[0]*e),kind:"w"}}return{widths:a,kind:"w"}}return"number"!=typeof t?{widths:i,kind:"w"}:{widths:[...new Set([t,2*t].map(e=>a.find(t=>t>=e)||a[a.length-1]))],kind:"x"}}(t,a,s),c=l.length-1;return{sizes:s||"w"!==u?s:"100vw",srcSet:l.map((e,i)=>n({config:t,src:r,quality:o,width:e})+" "+("w"===u?e:i+1)+u).join(", "),src:n({config:t,src:r,quality:o,width:l[c]})}}({config:u,src:f,unoptimized:m,width:W,quality:X,sizes:p,loader:F});return{props:{...A,loading:U?"lazy":h,fetchPriority:k,width:W,height:H,decoding:P,className:b,style:{...J,...Q},sizes:Z.sizes,srcSet:Z.srcSet,src:_||Z.src},meta:{unoptimized:m,priority:g,placeholder:S,fill:w}}}},85515:(e,t,r)=>{"use strict";r.d(t,{Gw:()=>o});var i=r(37876);r(14232);var a=r(75719);let o=e=>{let{message:t="Loading...",showLogo:r=!1,className:o=""}=e;return(0,i.jsx)("div",{className:"flex items-center justify-center py-8 ".concat(o),children:(0,i.jsx)(a.N3,{size:"small",text:t,showLogo:r})})}},89099:(e,t,r)=>{e.exports=r(48253)},97685:(e,t,r)=>{"use strict";r.d(t,{l$:()=>eu,Ay:()=>ec,oR:()=>I});var i,a=r(14232);let o={data:""},s=e=>"object"==typeof window?((e?e.querySelector("#_goober"):window._goober)||Object.assign((e||document.head).appendChild(document.createElement("style")),{innerHTML:" ",id:"_goober"})).firstChild:e||o,n=/(?:([\u0080-\uFFFF\w-%@]+) *:? *([^{;]+?);|([^;}{]*?) *{)|(}\s*)/g,l=/\/\*[^]*?\*\/|  +/g,u=/\n+/g,c=(e,t)=>{let r="",i="",a="";for(let o in e){let s=e[o];"@"==o[0]?"i"==o[1]?r=o+" "+s+";":i+="f"==o[1]?c(s,o):o+"{"+c(s,"k"==o[1]?"":t)+"}":"object"==typeof s?i+=c(s,t?t.replace(/([^,])+/g,e=>o.replace(/([^,]*:\S+\([^)]*\))|([^,])+/g,t=>/&/.test(t)?t.replace(/&/g,e):e?e+" "+t:t)):o):null!=s&&(o=/^--/.test(o)?o:o.replace(/[A-Z]/g,"-$&").toLowerCase(),a+=c.p?c.p(o,s):o+":"+s+";")}return r+(t&&a?t+"{"+a+"}":a)+i},d={},f=e=>{if("object"==typeof e){let t="";for(let r in e)t+=r+f(e[r]);return t}return e},p=(e,t,r,i,a)=>{let o=f(e),s=d[o]||(d[o]=(e=>{let t=0,r=11;for(;t<e.length;)r=101*r+e.charCodeAt(t++)>>>0;return"go"+r})(o));if(!d[s]){let t=o!==e?e:(e=>{let t,r,i=[{}];for(;t=n.exec(e.replace(l,""));)t[4]?i.shift():t[3]?(r=t[3].replace(u," ").trim(),i.unshift(i[0][r]=i[0][r]||{})):i[0][t[1]]=t[2].replace(u," ").trim();return i[0]})(e);d[s]=c(a?{["@keyframes "+s]:t}:t,r?"":"."+s)}let p=r&&d.g?d.g:null;return r&&(d.g=d[s]),((e,t,r,i)=>{i?t.data=t.data.replace(i,e):-1===t.data.indexOf(e)&&(t.data=r?e+t.data:t.data+e)})(d[s],t,i,p),s},m=(e,t,r)=>e.reduce((e,i,a)=>{let o=t[a];if(o&&o.call){let e=o(r),t=e&&e.props&&e.props.className||/^go/.test(e)&&e;o=t?"."+t:e&&"object"==typeof e?e.props?"":c(e,""):!1===e?"":e}return e+i+(null==o?"":o)},"");function g(e){let t=this||{},r=e.call?e(t.p):e;return p(r.unshift?r.raw?m(r,[].slice.call(arguments,1),t.p):r.reduce((e,r)=>Object.assign(e,r&&r.call?r(t.p):r),{}):r,s(t.target),t.g,t.o,t.k)}g.bind({g:1});let h,b,v,y=g.bind({k:1});function x(e,t){let r=this||{};return function(){let i=arguments;function a(o,s){let n=Object.assign({},o),l=n.className||a.className;r.p=Object.assign({theme:b&&b()},n),r.o=/ *go\d+/.test(l),n.className=g.apply(r,i)+(l?" "+l:""),t&&(n.ref=s);let u=e;return e[0]&&(u=n.as||e,delete n.as),v&&u[0]&&v(n),h(u,n)}return t?t(a):a}}var w=e=>"function"==typeof e,j=(e,t)=>w(e)?e(t):e,_=(()=>{let e=0;return()=>(++e).toString()})(),E=(()=>{let e;return()=>{if(void 0===e&&"u">typeof window){let t=matchMedia("(prefers-reduced-motion: reduce)");e=!t||t.matches}return e}})(),C=(e,t)=>{switch(t.type){case 0:return{...e,toasts:[t.toast,...e.toasts].slice(0,20)};case 1:return{...e,toasts:e.toasts.map(e=>e.id===t.toast.id?{...e,...t.toast}:e)};case 2:let{toast:r}=t;return C(e,{type:+!!e.toasts.find(e=>e.id===r.id),toast:r});case 3:let{toastId:i}=t;return{...e,toasts:e.toasts.map(e=>e.id===i||void 0===i?{...e,dismissed:!0,visible:!1}:e)};case 4:return void 0===t.toastId?{...e,toasts:[]}:{...e,toasts:e.toasts.filter(e=>e.id!==t.toastId)};case 5:return{...e,pausedAt:t.time};case 6:let a=t.time-(e.pausedAt||0);return{...e,pausedAt:void 0,toasts:e.toasts.map(e=>({...e,pauseDuration:e.pauseDuration+a}))}}},S=[],O={toasts:[],pausedAt:void 0},k=e=>{O=C(O,e),S.forEach(e=>{e(O)})},P={blank:4e3,error:4e3,success:2e3,loading:1/0,custom:4e3},R=(e={})=>{let[t,r]=(0,a.useState)(O),i=(0,a.useRef)(O);(0,a.useEffect)(()=>(i.current!==O&&r(O),S.push(r),()=>{let e=S.indexOf(r);e>-1&&S.splice(e,1)}),[]);let o=t.toasts.map(t=>{var r,i,a;return{...e,...e[t.type],...t,removeDelay:t.removeDelay||(null==(r=e[t.type])?void 0:r.removeDelay)||(null==e?void 0:e.removeDelay),duration:t.duration||(null==(i=e[t.type])?void 0:i.duration)||(null==e?void 0:e.duration)||P[t.type],style:{...e.style,...null==(a=e[t.type])?void 0:a.style,...t.style}}});return{...t,toasts:o}},N=(e,t="blank",r)=>({createdAt:Date.now(),visible:!0,dismissed:!1,type:t,ariaProps:{role:"status","aria-live":"polite"},message:e,pauseDuration:0,...r,id:(null==r?void 0:r.id)||_()}),z=e=>(t,r)=>{let i=N(t,e,r);return k({type:2,toast:i}),i.id},I=(e,t)=>z("blank")(e,t);I.error=z("error"),I.success=z("success"),I.loading=z("loading"),I.custom=z("custom"),I.dismiss=e=>{k({type:3,toastId:e})},I.remove=e=>k({type:4,toastId:e}),I.promise=(e,t,r)=>{let i=I.loading(t.loading,{...r,...null==r?void 0:r.loading});return"function"==typeof e&&(e=e()),e.then(e=>{let a=t.success?j(t.success,e):void 0;return a?I.success(a,{id:i,...r,...null==r?void 0:r.success}):I.dismiss(i),e}).catch(e=>{let a=t.error?j(t.error,e):void 0;a?I.error(a,{id:i,...r,...null==r?void 0:r.error}):I.dismiss(i)}),e};var M=(e,t)=>{k({type:1,toast:{id:e,height:t}})},A=()=>{k({type:5,time:Date.now()})},D=new Map,$=1e3,T=(e,t=$)=>{if(D.has(e))return;let r=setTimeout(()=>{D.delete(e),k({type:4,toastId:e})},t);D.set(e,r)},L=e=>{let{toasts:t,pausedAt:r}=R(e);(0,a.useEffect)(()=>{if(r)return;let e=Date.now(),i=t.map(t=>{if(t.duration===1/0)return;let r=(t.duration||0)+t.pauseDuration-(e-t.createdAt);if(r<0){t.visible&&I.dismiss(t.id);return}return setTimeout(()=>I.dismiss(t.id),r)});return()=>{i.forEach(e=>e&&clearTimeout(e))}},[t,r]);let i=(0,a.useCallback)(()=>{r&&k({type:6,time:Date.now()})},[r]),o=(0,a.useCallback)((e,r)=>{let{reverseOrder:i=!1,gutter:a=8,defaultPosition:o}=r||{},s=t.filter(t=>(t.position||o)===(e.position||o)&&t.height),n=s.findIndex(t=>t.id===e.id),l=s.filter((e,t)=>t<n&&e.visible).length;return s.filter(e=>e.visible).slice(...i?[l+1]:[0,l]).reduce((e,t)=>e+(t.height||0)+a,0)},[t]);return(0,a.useEffect)(()=>{t.forEach(e=>{if(e.dismissed)T(e.id,e.removeDelay);else{let t=D.get(e.id);t&&(clearTimeout(t),D.delete(e.id))}})},[t]),{toasts:t,handlers:{updateHeight:M,startPause:A,endPause:i,calculateOffset:o}}},q=y`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
 transform: scale(1) rotate(45deg);
  opacity: 1;
}`,F=y`
from {
  transform: scale(0);
  opacity: 0;
}
to {
  transform: scale(1);
  opacity: 1;
}`,G=y`
from {
  transform: scale(0) rotate(90deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(90deg);
	opacity: 1;
}`,B=x("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${e=>e.primary||"#ff4b4b"};
  position: relative;
  transform: rotate(45deg);

  animation: ${q} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;

  &:after,
  &:before {
    content: '';
    animation: ${F} 0.15s ease-out forwards;
    animation-delay: 150ms;
    position: absolute;
    border-radius: 3px;
    opacity: 0;
    background: ${e=>e.secondary||"#fff"};
    bottom: 9px;
    left: 4px;
    height: 2px;
    width: 12px;
  }

  &:before {
    animation: ${G} 0.15s ease-out forwards;
    animation-delay: 180ms;
    transform: rotate(90deg);
  }
`,W=y`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`,H=x("div")`
  width: 12px;
  height: 12px;
  box-sizing: border-box;
  border: 2px solid;
  border-radius: 100%;
  border-color: ${e=>e.secondary||"#e0e0e0"};
  border-right-color: ${e=>e.primary||"#616161"};
  animation: ${W} 1s linear infinite;
`,U=y`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(45deg);
	opacity: 1;
}`,X=y`
0% {
	height: 0;
	width: 0;
	opacity: 0;
}
40% {
  height: 0;
	width: 6px;
	opacity: 1;
}
100% {
  opacity: 1;
  height: 10px;
}`,J=x("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${e=>e.primary||"#61d345"};
  position: relative;
  transform: rotate(45deg);

  animation: ${U} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;
  &:after {
    content: '';
    box-sizing: border-box;
    animation: ${X} 0.2s ease-out forwards;
    opacity: 0;
    animation-delay: 200ms;
    position: absolute;
    border-right: 2px solid;
    border-bottom: 2px solid;
    border-color: ${e=>e.secondary||"#fff"};
    bottom: 6px;
    left: 6px;
    height: 10px;
    width: 6px;
  }
`,V=x("div")`
  position: absolute;
`,Y=x("div")`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 20px;
  min-height: 20px;
`,Q=y`
from {
  transform: scale(0.6);
  opacity: 0.4;
}
to {
  transform: scale(1);
  opacity: 1;
}`,Z=x("div")`
  position: relative;
  transform: scale(0.6);
  opacity: 0.4;
  min-width: 20px;
  animation: ${Q} 0.3s 0.12s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
`,K=({toast:e})=>{let{icon:t,type:r,iconTheme:i}=e;return void 0!==t?"string"==typeof t?a.createElement(Z,null,t):t:"blank"===r?null:a.createElement(Y,null,a.createElement(H,{...i}),"loading"!==r&&a.createElement(V,null,"error"===r?a.createElement(B,{...i}):a.createElement(J,{...i})))},ee=e=>`
0% {transform: translate3d(0,${-200*e}%,0) scale(.6); opacity:.5;}
100% {transform: translate3d(0,0,0) scale(1); opacity:1;}
`,et=e=>`
0% {transform: translate3d(0,0,-1px) scale(1); opacity:1;}
100% {transform: translate3d(0,${-150*e}%,-1px) scale(.6); opacity:0;}
`,er=x("div")`
  display: flex;
  align-items: center;
  background: #fff;
  color: #363636;
  line-height: 1.3;
  will-change: transform;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1), 0 3px 3px rgba(0, 0, 0, 0.05);
  max-width: 350px;
  pointer-events: auto;
  padding: 8px 10px;
  border-radius: 8px;
`,ei=x("div")`
  display: flex;
  justify-content: center;
  margin: 4px 10px;
  color: inherit;
  flex: 1 1 auto;
  white-space: pre-line;
`,ea=(e,t)=>{let r=e.includes("top")?1:-1,[i,a]=E()?["0%{opacity:0;} 100%{opacity:1;}","0%{opacity:1;} 100%{opacity:0;}"]:[ee(r),et(r)];return{animation:t?`${y(i)} 0.35s cubic-bezier(.21,1.02,.73,1) forwards`:`${y(a)} 0.4s forwards cubic-bezier(.06,.71,.55,1)`}},eo=a.memo(({toast:e,position:t,style:r,children:i})=>{let o=e.height?ea(e.position||t||"top-center",e.visible):{opacity:0},s=a.createElement(K,{toast:e}),n=a.createElement(ei,{...e.ariaProps},j(e.message,e));return a.createElement(er,{className:e.className,style:{...o,...r,...e.style}},"function"==typeof i?i({icon:s,message:n}):a.createElement(a.Fragment,null,s,n))});i=a.createElement,c.p=void 0,h=i,b=void 0,v=void 0;var es=({id:e,className:t,style:r,onHeightUpdate:i,children:o})=>{let s=a.useCallback(t=>{if(t){let r=()=>{i(e,t.getBoundingClientRect().height)};r(),new MutationObserver(r).observe(t,{subtree:!0,childList:!0,characterData:!0})}},[e,i]);return a.createElement("div",{ref:s,className:t,style:r},o)},en=(e,t)=>{let r=e.includes("top"),i=e.includes("center")?{justifyContent:"center"}:e.includes("right")?{justifyContent:"flex-end"}:{};return{left:0,right:0,display:"flex",position:"absolute",transition:E()?void 0:"all 230ms cubic-bezier(.21,1.02,.73,1)",transform:`translateY(${t*(r?1:-1)}px)`,...r?{top:0}:{bottom:0},...i}},el=g`
  z-index: 9999;
  > * {
    pointer-events: auto;
  }
`,eu=({reverseOrder:e,position:t="top-center",toastOptions:r,gutter:i,children:o,containerStyle:s,containerClassName:n})=>{let{toasts:l,handlers:u}=L(r);return a.createElement("div",{id:"_rht_toaster",style:{position:"fixed",zIndex:9999,top:16,left:16,right:16,bottom:16,pointerEvents:"none",...s},className:n,onMouseEnter:u.startPause,onMouseLeave:u.endPause},l.map(r=>{let s=r.position||t,n=en(s,u.calculateOffset(r,{reverseOrder:e,gutter:i,defaultPosition:t}));return a.createElement(es,{id:r.id,key:r.id,onHeightUpdate:u.updateHeight,className:r.visible?el:"",style:n},"custom"===r.type?j(r.message,r):o?o(r):a.createElement(eo,{toast:r,position:s}))}))},ec=I}},e=>{var t=t=>e(e.s=t);e.O(0,[593,792],()=>(t(56556),t(48253))),_N_E=e.O()}]);