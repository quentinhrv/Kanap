// ----- Récupération des données de l'API et affichage des produits sur la page d'accueil ----- \\

fetch('http://localhost:3000/api/products') // On récupère les données de l'API.
  .then(response => response.json()) // On les transforme en JSON.
  .then(data => {
    console.log(data); // On affiche les données récupérées dans la console.
    afficherProduits(data); // On appelle la fonction d'affichage des produits.   
  })
  // En cas d'erreur, on affiche un message d'erreur dans la console et une alerte sur la page.
  .catch(error => {
    console.error(error);
    alert('Une erreur est survenue lors de la récupération des produits. Veuillez réessayer plus tard.');
});


// ----- Fonction d'affichage des produits ----- \\

function afficherProduits(kanap) {
  const itemsContainer = document.getElementById('items'); // On récupère le conteneur d'affichage des produits.
  // On itère sur chaque produit du tableau kanap à l'aide de forEach().
  kanap.forEach(product => {
    // On génère le code HTML pour chaque produit.
    const productHTML = `<a href="./product.html?id=${product._id}">
      <article>
        <img src="${product.imageUrl}" alt="${product.altTxt}">
        <h3 class="productName">${product.name}</h3>
        <p class="productDescription">${product.description}</p>
        </article>
      </a>`;
    itemsContainer.innerHTML += productHTML; // On ajoute le code HTML au conteneur d'affichage des produits.
  });
};