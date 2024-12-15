console.log("Content script injecté avec succès.");

// Variables pour suivre l'état
let adProcessing = false;

function clickButtonOnce(selector, context = document) {
  const button = context.querySelector(selector);
  if (button && !button.dataset.clicked) {
    button.click();
    button.dataset.clicked = "true"; // Marque le bouton comme cliqué
    console.log(`Bouton cliqué : ${selector}`);
    return true;
  }
  return false;
}

function processIframe() {
  const iframe = document.querySelector('iframe');
  if (iframe) {
    console.log("Iframe détecté, tentative d'accès...");
    const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;

    if (!iframeDocument) {
      console.error("Impossible d'accéder au contenu de l'iframe.");
      adProcessing = false; // Réinitialise si échec
      return;
    }

    // Étape 2 : Clique sur le premier bouton dans l'iframe
    if (clickButtonOnce('span[jsname="V67aGc"].mUIrbf-vQzf8d', iframeDocument)) {
      setTimeout(() => {
        // Étape 3 : Clique sur le deuxième bouton
        if (clickButtonOnce('.WvipBf-LgbsSe-LoDsGd', iframeDocument)) {
          setTimeout(() => {
            // Étape 4 : Clique sur le bouton "Fermer"
            if (clickButtonOnce('[aria-label="Fermer"].VfPpkd-Bz112c-LgbsSe', iframeDocument)) {
              console.log("Processus terminé, tous les boutons cliqués.");
              adProcessing = false; // Réinitialise le flag
            }
          }, 1000);
        } else {
          console.log("Bouton .WvipBf-LgbsSe-LoDsGd introuvable, tentative de fermeture directe.");
          if (clickButtonOnce('[aria-label="Fermer"].VfPpkd-Bz112c-LgbsSe', iframeDocument)) {
            console.log("Bouton 'Fermer' cliqué directement.");
            setTimeout(() => {
              adProcessing = false; // Réinitialise après 30 secondes
            }, 30000);
          }
        }
      }, 500);
    }
  } else {
    console.log("Aucun iframe trouvé.");
    adProcessing = false; // Réinitialise si aucun iframe n'est trouvé
  }
}

function handleAds() {
  if (adProcessing) {
    return; // Ne fait rien si un processus est déjà en cours
  }

  console.log("Recherche des publicités...");
  const adButton = document.querySelector('.ytp-ad-button-icon');
  if (adButton) {
    adProcessing = true; // Déclare qu'un processus est en cours
    adButton.click();
    console.log("Bouton de publicité cliqué.");

    setTimeout(() => {
      processIframe(); // Passe aux étapes suivantes
    }, 1000);
  } else {
    console.log("Aucune publicité détectée.");
  }
}

// Surveille les changements dans le DOM
const observer = new MutationObserver(() => {
  handleAds();
});

observer.observe(document.body, {
  childList: true,
  subtree: true
});

console.log("Extension YouTube Ad Skipper en cours d'exécution.");
