let deferredPrompt;

let status = document.getElementById("status");
status.innerHTML = "main.js called";

window.addEventListener('beforeinstallprompt', (e) => {
  status.innerHTML = "beforeinstallprompt called";
  
  // Prevent Chrome 67 and earlier from automatically showing the prompt
  e.preventDefault();
  // Stash the event so it can be triggered later.
  deferredPrompt = e;

  // Show the prompt
  deferredPrompt.prompt();

  deferredPrompt.userChoice
    .then( (choiceResult) => {
      if(choiceResult.outcome === 'accepted'){

      }
      else{
        console.log("User dismissed the add-to-homescreen-prompt!");
      }
      deferredPrompt = null;
    });
})

//Make sure SW are supported
if('serviceWorker' in navigator){
  console.log('Service Worker supported!');

  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('../sw_cached_pages.js')
      .then(reg => console.log("Service Worker registered"))
      .catch(err => console.log(`Error + ${err}`));
  });
}