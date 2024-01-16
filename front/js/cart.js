let cartContent = JSON.parse(localStorage.getItem('cartContent')); // On récupère les données du localStorage.
afficherProduits(); // On appelle la fonction d'affichage des produits.
afficherPrixTotal(); // On appelle la fonction d'affichage du prix total.

// ----- Fonction d'affichage des produits ----- \\

function afficherProduits() {
  const itemsContainer = document.getElementById('cart__items'); // On sélectionne la class où seront affichés les produits.
  let itemsHTML = ''; // On crée une variable vide qui stocke le code HTML généré dynamiquement pour chaque produit.
  // On vérifie si le contenu du panier est nul ou vide.
  if (cartContent === null || cartContent.length === 0) {
    // On met à jour le texte.
    document.querySelector('#cartAndFormContainer h1').innerText = 'Votre panier est vide';
    document.querySelector('.cart__price').innerText = "";
    document.querySelector('.cart__order').innerText = "";
    itemsContainer.innerText = "";
  } else {
    document.querySelector('#cartAndFormContainer h1').innerText = 'Votre panier';
    // On parcourt sur chaque élémént du panier.
    for (let i = 0; i < cartContent.length; i++) {
      // On intègre dynamiquement les données dans la page.
      const product = cartContent[i]; // On stocke l'élément actuel dans une variable.
      fetch(`http://localhost:3000/api/products/${product.id}`) // On récupère les données du produit avec l'ID correspondant depuis l'API.
      .then(response => response.json()) // On les transforme en JSON.
      .then(data => {
        let priceProduct = data.price // On récupère le prix du produit.
        const productHTML = `<article class="cart__item" data-id="${product.id}" data-color="${product.color}">
        <div class="cart__item__img">
          <img src="${product.imageUrl}" alt="${product.altTxt}">
        </div>
        <div class="cart__item__content">
          <div class="cart__item__content__description">
            <h2>${product.name}</h2>
            <p>${product.color}</p>
            <p>${priceProduct} €</p>
          </div>
          <div class="cart__item__content__settings">
            <div class="cart__item__content__settings__quantity">
              <p>Qté : </p>
              <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" onchange="handleQuantityChange(this)" value="${product.quantity}" data-item-id="${product.id}">
            </div>
            <div class="cart__item__content__settings__delete">
              <p class="deleteItem">Supprimer</p>
            </div>
          </div>
        </div>
        </article>`;
        itemsHTML += productHTML; // On stocke le résultat final dans la variable créée précedemment.
        itemsContainer.innerHTML = itemsHTML; // On affiche les produits générés dynamiquement à l'écran.
        // On ajoute un gestionnaire d'événement "click" à chaque bouton "Supprimer".
        const deleteButtons = document.querySelectorAll('.deleteItem');
        deleteButtons.forEach(button => {
          button.addEventListener('click', () => {
            const productId = button.closest('.cart__item').dataset.id; // On récupère l'id du produit.
            const color = button.closest('.cart__item').dataset.color; // On récupère la couleur du produit.
            supprimerProduit(productId, color); // On appelle la fonction de suppression d'un produit.
          });
        });
      })
    // En cas d'erreur, on affiche un message d'erreur dans la console et une alerte sur la page.
      .catch(error => {
        console.error(error);
        alert('Une erreur est survenue lors de la récupération des données du produit. Veuillez réessayer plus tard.');
      });  
    }; 
  };
};

// ----- Fonction de suppression d'un produit ----- \\

function supprimerProduit(id, couleur) {
  // On filtre les produits du panier pour enlever celui avec l'identifiant et la couleur donnée.
  cartContent = cartContent.filter(function (product) {
    return product.id !== id || product.color !== couleur;
  });
  // On enregistre les nouvelles données dans le localStorage.
  localStorage.setItem('cartContent', JSON.stringify(cartContent));
  // On réaffiche les produits mis à jour.
  afficherProduits();
  afficherPrixTotal();
};


// ----- Gestion du changement de quantité ----- \\
function handleQuantityChange(e) {
  const newQuantity = parseInt(e.value); // On récupère la nouvelle quantité du produit sous forme de nombre entier
  const productId = e.dataset.itemId; // On récupère l'identifiant du produit
  modifierQuantiteProduit(productId, newQuantity);
};


// ----- Fonction de modification de la quantité d'un produit ----- \\

function modifierQuantiteProduit(id, quantite) {
  // On vérifie que la quantité est un nombre valide compris entre 1 et 100
  if (isNaN(quantite) || quantite < 1 || quantite > 100) {
    alert("La quantité doit être un nombre valide compris entre 1 et 100.");
    return;
  }
  // On recherche le produit correspondant dans le tableau cartContent.
  const productIndex = cartContent.findIndex((product) => product.id === id);
  // On modifie la quantité du produit.
  cartContent[productIndex].quantity = quantite;
  // On enregistre les nouvelles données dans le localStorage.
  localStorage.setItem('cartContent', JSON.stringify(cartContent));
  // On réaffiche les produits mis à jour.
  afficherProduits();
  // On met à jour le prix total et la quantité totale du panier.
  afficherPrixTotal();
};

// ----- Fonction d'affichage du prix total et de la quantité totale ----- \\

function afficherPrixTotal() {
  let prixTotal = 0; // Initialisation du prix total à 0.
  let quantiteTotal = 0; // Initialisation de la quantité totale à 0.
  for (let i = 0; i < cartContent.length; i++) { // Boucle sur chaque produit dans le panier.
    const product = cartContent[i]; // On récupère les informations du produit courant.
    fetch(`http://localhost:3000/api/products/${product.id}`) // Requête à l'API pour récupérer les informations complètes du produit.
    .then(response => response.json()) // On transforme la réponse en objet JSON.
    .then(data => {
      let priceProduct = data.price; // On récupère le prix du produit courant.
      let quantityProduct = product.quantity; // On récupère la quantité du produit courant.
      prixTotal += priceProduct * quantityProduct; // On calcule le sous-total pour le produit courant.
      quantiteTotal += quantityProduct; // On incrémente la quantité totale.
      const totalQuantityElement = document.getElementById('totalQuantity'); // On récupère l'élément HTML qui affiche la quantité totale.
      const totalPriceElement = document.getElementById('totalPrice'); // On récupère l'élément HTML qui affiche le prix total.
      totalQuantityElement.innerText = quantiteTotal; // On met à jour l'affichage de la quantité totale.
      totalPriceElement.innerText = prixTotal.toFixed(2); // On met à jour l'affichage du prix total en arrondissant à 2 décimales.
    });
  };
};

const form = document.querySelector('.cart__order__form'); // On sélectionne l'élément HTML du formulaire de commande
form.addEventListener('submit', function(event) { // On ajoute un écouteur d'événements sur l'événement de soumission du formulaire
  event.preventDefault(); // On empêche le comportement par défaut de l'événement de soumission
  validateForm();  // On appelle la fonction validateForm() pour valider les données du formulaire
});


// ----- Fonction de vérification de la validité du formulaire et envoi du formulaire----- \\

function validateForm() {
  // On récupère le contenu de chaque champ du forulaire.
  const firstName = document.getElementById("firstName").value;
  const lastName = document.getElementById("lastName").value;
  const address = document.getElementById("address").value;
  const city = document.getElementById("city").value;
  const email = document.getElementById("email").value;
  // On définit les caractères valides pour remplir le formulaire.
  const nameRegex = /^[a-zA-Z\s]+$/;
  const addressRegex = /^[a-zA-Z0-9\s,'-]*$/;
  const cityRegex = /^[a-zA-Z\u00C0-\u024F\u1E00-\u1EFF-]+(?:\s[a-zA-Z\u00C0-\u024F\u1E00-\u1EFF-]+)*$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  let valid = true;
  // Pour chaque champ du formulaire on affiche un message si les caractères ne sont pas valides.
  if (!nameRegex.test(firstName)) {
    document.getElementById("firstNameErrorMsg").innerHTML = "Le prénom n'est pas valide";
    valid = false;
  } else {
    document.getElementById("firstNameErrorMsg").innerHTML = "";
  }
  if (!nameRegex.test(lastName)) {
    document.getElementById("lastNameErrorMsg").innerHTML = "Le nom n'est pas valide";
    valid = false;
  } else {
    document.getElementById("lastNameErrorMsg").innerHTML = "";
  }
  if (!addressRegex.test(address)) {
    document.getElementById("addressErrorMsg").innerHTML = "L'adresse n'est pas valide";
    valid = false;
  } else {
    document.getElementById("addressErrorMsg").innerHTML = "";
  }
  if (!cityRegex.test(city)) {
    document.getElementById("cityErrorMsg").innerHTML = "La ville n'est pas valide";
    valid = false;
  } else {
    document.getElementById("cityErrorMsg").innerHTML = "";
  }
  if (!emailRegex.test(email)) {
    document.getElementById("emailErrorMsg").innerHTML = "L'email n'est pas valide";
    valid = false;
  } else {
    document.getElementById("emailErrorMsg").innerHTML = "";
  }
  if (valid) {
    let productIdsInCart = getCartProductIds(); // On récupère un tableau contenant les identifiants des produits présents dans le panier.
    let commandeFinale = { // on crée un objet contact.
      contact: {
        firstName: firstName,
        lastName: lastName,
        address: address,
        city: city,
        email: email
      },
      products: productIdsInCart,
    };   
    fetch("http://localhost:3000/api/products/order", {
      method: "POST", // Envoi de la requête POST pour passer la commande
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(commandeFinale), // Le corps de la requête contient les informations de la commande
    })
    .then((res) => res.json()) // On transforme la réponse en objet JSON
    .then((data) => {
      window.location.href = `/front/html/confirmation.html?commande=${data.orderId}`; // On redirige l'utilisateur vers la page de confirmation avec l'identifiant de la commande
    })
    .catch(function (err) {
      console.log(err); // En cas d'erreur, on affiche le message dans la console
      alert("erreur"); // On affiche également une alerte à l'utilisateur
    });
// Si le formulaire n'est pas valide, on retourne false pour empêcher la soumission du formulaire
  } else {
    return false;
  }
};

// ----- Fonction de récupération des ID des produits du panier ----- \\
function getCartProductIds() {
  let productIds = [];
  // On parcourt tous les produits dans le panier et on ajoute leur ID à un tableau.
  for (let i = 0; i < cartContent.length; i++) {
    productIds.push(cartContent[i].id);
  }
  return productIds;// On retourne le tableau contenant les IDs des produits dans le panier.
};