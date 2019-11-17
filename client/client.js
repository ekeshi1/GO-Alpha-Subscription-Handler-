const publicVapidKey = "BF_boLUPcf7FyCwOKohFf2yI8he_tNVQLU0HjknY87SswjsMi8R1ybXqlOsBh3P6P\n" +
    "AjgEBaRI3XN16H_UhhNnqw";
const PROJECTID = '1'
//Check for service worker

if("serviceWorker" in navigator){
    send().catch(err => console.log(err));
}

    function getBroswer(){
        var isOpera = (!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;
        if(isOpera){
            return "Opera"
        }
        // Firefox 1.0+
        var isFirefox = typeof InstallTrigger !== 'undefined';
        if(isFirefox){
            return "Firefox"
        }
// Safari 3.0+ "[object HTMLElementConstructor]"
        var isSafari = /constructor/i.test(window.HTMLElement) || (function (p) { return p.toString() === "[object SafariRemoteNotification]"; })(!window['safari'] || (typeof safari !== 'undefined' && safari.pushNotification));
        if(isSafari){
            return "Safari"
        }
// Internet Explorer 6-11
        var isIE = /*@cc_on!@*/false || !!document.documentMode;
        if(isIE){
            return "IE";
        }

// Edge 20+
        var isEdge = !isIE && !!window.StyleMedia;
        if(isEdge) {
            return  'Edge'
        }

// Chrome 1 - 71
        var isChrome = !!window.chrome && (!!window.chrome.webstore || !!window.chrome.runtime);
        if(isChrome)
        {return "Google Chrome"}



        var output = 'Detecting browsers by ducktyping:<hr>';
        output += 'isFirefox: ' + isFirefox + '<br>';
        output += 'isChrome: ' + isChrome + '<br>';
        output += 'isSafari: ' + isSafari + '<br>';
        output += 'isOpera: ' + isOpera + '<br>';
        output += 'isIE: ' + isIE + '<br>';
        output += 'isEdge: ' + isEdge + '<br>';
        document.body.innerHTML = output;

    }
console.log(getBroswer());




async function digestMessage(message) {
    const msgUint8 = new TextEncoder().encode(message);                           // encode as (utf-8) Uint8Array
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);           // hash the message
    const hashArray = Array.from(new Uint8Array(hashBuffer));                     // convert buffer to byte array
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join(''); // convert bytes to hex string
    return hashHex;
}

//Register Service worker, Register Push, Send Push
let globalDigest;
async function send() {
    console.log("Registering service worker...");
    const register = await navigator.serviceWorker.register("/worker.js", {
        scope: "/"
    });
    console.log("Service worker Registered");

    //Register Push
    console.log("Registering Push...");
    const subscription = await register.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicVapidKey),
    });
    console.log("Push registered...");
    subscription["browser"]= getBroswer();

    //Get hashed value;

    const digest=  await digestMessage(JSON.stringify(subscription))
    globalDigest = digest;
    console.log(digest)

    //Send Push Notification
    console.log("Sending push");
    const id =
    await fetch(`/subscribe/${digest}`, {
        method: "POST",
        body: JSON.stringify({subscription:subscription, browser: getBroswer(), projectId: PROJECTID}),
        headers: {
            "content-type": "application/json",
        }
    });
    console.log("Push sent");
}

function urlBase64ToUint8Array(base64String) {
    const padding = "=".repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/\-/g, "+")
        .replace(/_/g, "/");

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}


var Notification = window.Notification || window.mozNotification || window.webkitNotification;

var was_questioned = false;
if (Notification.permission == 'default') {
    was_questioned = true;
}

Notification.requestPermission(function (permission) {
    if (was_questioned) {
        console.log("User was asked. New permission is: " + permission);
    }
    if ('permissions' in navigator) {
        navigator.permissions.query({name:'notifications'}).then(function(notificationPerm) {
            notificationPerm.onchange = function() {
                console.log("User decided to change his seettings. New permission: " + notificationPerm.state);

                //here delete should be send
                 fetch(`/subscribe/${globalDigest}`, {
                    method: "DELETE",
                    body: JSON.stringify({projectId: PROJECTID}),
                    headers: {
                        "content-type": "application/json",
                    }
                }).then(()=>{
                     console.log("Deleted from server");
                 });
            };
        });
    }
});
