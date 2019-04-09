'use strict';

let deferredPrompt;
let status = document.getElementById("status");
status.innerHTML = "main.js called";


const applicationServerPublicKey = 'BOLVnljkkcqNKfi9myheLDtUlcbpmPkWIZkYtuHS054KCJHd_fWBPonOH832JqYFJY9AjzBzkJQwxUVs7ep1hwY';
const pushButton = document.getElementById('subscribe');
let isSubscribed = false;
let swRegistration = null;

caches.keys().then(function(names) {
  for (let name of names)
      caches.delete(name);
});

/*Install Prompt*/
window.addEventListener('beforeinstallprompt', (e) => {
  status.innerHTML = "beforeinstallprompt called";

  // Prevent Chrome 67 and earlier from automatically showing the prompt
  e.preventDefault();
  // Stash the event so it can be triggered later.
  deferredPrompt = e;

  btnAdd.style.display = "block";
})

function urlB64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

//Public Key in subscribe-method used for VAPID 
function subscribeUser() {
  const applicationServerKey = urlB64ToUint8Array(applicationServerPublicKey);
  swRegistration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: applicationServerKey
  })
  .then(function(subscription) {
    console.log('User is subscribed.');

    isSubscribed = true;

    updateBtn();
  })
  .catch(function(err) {
    console.log('Failed to subscribe the user: ', err);
    updateBtn();
  });
}

function displayNotification() {
  if (Notification.permission == 'granted') {
    navigator.serviceWorker.getRegistration().then(function(reg) {
      reg.showNotification('Hello world!');
    });
  }
  else{
    console.log("Permission has not yet been granted!");
  }
}

function initializeUI() {
  //Can be used to automatically ask for notification permissions
  Notification.requestPermission(function(status) {
    console.log('Notification permission status:', status);
  });
  // End


  /*
  pushButton.addEventListener('click', function() {
    pushButton.disabled = true;
    if (isSubscribed) {
      // TODO: Unsubscribe user
    } else {
      subscribeUser();
    }
  });
  */

  pushButton.addEventListener('click', function(){
    displayNotification();
  });


  // Set the initial subscription value
  swRegistration.pushManager.getSubscription()
  .then(function(subscription) {
    isSubscribed = !(subscription === null);

    if (isSubscribed) {
      console.log('User IS subscribed.');
    } else {
      console.log('User is NOT subscribed.');
    }

    updateBtn();
  });
}

btnAdd.addEventListener('click', (e) => {
  // hide our user interface that shows our A2HS button
  btnAdd.style.display = 'none';
  // Show the prompt
  deferredPrompt.prompt();
  // Wait for the user to respond to the prompt
  deferredPrompt.userChoice
    .then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the A2HS prompt');
      } else {
        console.log('User dismissed the A2HS prompt');
      }
      deferredPrompt = null;
    });
});

function updateBtn() {
if (Notification.permission === 'denied') {
    pushButton.disabled = true;
    return;
  }

  if (isSubscribed) {
    console.log("Push ausschalten");
  } else {
    console.log("Push einschalten");
  }
}

//Make sure SW are supported
if('serviceWorker' in navigator){
  console.log('Service Worker supported!');

  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('../sw_cached_pages.js')
      .then(reg => console.log("Service Worker registered"))
      .catch(err => console.log(`Error + ${err}`));
  });

  //Add service worker responsible for push-messages
  
  if('PushManager' in window){
    navigator.serviceWorker.register('sw_push.js')
      .then(function(swReg) {
        console.log('Service Worker is registered', swReg);

        swRegistration = swReg;
        initializeUI();
      })

    console.log('Push notifications supported');
      pushButton.style.display = "block";
  }
}

