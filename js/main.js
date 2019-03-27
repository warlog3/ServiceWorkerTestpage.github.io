let deferredPrompt;
let status = document.getElementById("status");
status.innerHTML = "main.js called";

caches.keys().then(function(names) {
  for (let name of names)
      caches.delete(name);
});

window.addEventListener('beforeinstallprompt', (e) => {
  status.innerHTML = "beforeinstallprompt called";

  // Prevent Chrome 67 and earlier from automatically showing the prompt
  e.preventDefault();
  // Stash the event so it can be triggered later.
  deferredPrompt = e;

  btnAdd.style.display = "block";
  // Show the prompt
  /*deferredPrompt.prompt();

  deferredPrompt.userChoice
    .then( (choiceResult) => {
      if(choiceResult.outcome === 'accepted'){

      }
      else{
        console.log("User dismissed the add-to-homescreen-prompt!");
      }
      deferredPrompt = null;
    });
    */
})

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