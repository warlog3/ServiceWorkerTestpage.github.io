let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
  let headerColor = document.getElementById("headerColor");
  headerColor.style.color = 'white';
  /*
  // Prevent Chrome 67 and earlier from automatically showing the prompt
  e.preventDefault();
  // Stash the event so it can be triggered later.
  deferredPrompt = e;

  // Update UI notify the user they can add to home screen
  btnAdd.style.display = 'block';
  */
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