// récupérer l'URL actuelle de la page
const currentUrl = window.location.href;
// rechercher l'orderId dans l'URL
const orderId = currentUrl.split("=")[1];
// afficher l'orderId dans la page HTML
document.getElementById("orderId").textContent = orderId;
// Vider le localStorage
localStorage.clear();