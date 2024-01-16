// On récupère l'id du produit depuis l'url de la page actuelle.
const currentUrl = new URL(window.location.href); // On récupère l'url actuelle de la page.
const searchParams = new URLSearchParams(currentUrl.search); // On extrait les paramètres de recherche de l'url.
const productId = searchParams.get("id"); // On extrait la valeur de l'id.


// ----- Récupération des données de l'API et affichage du produit sur la page produit ----- \\

fetch(`http://localhost:3000/api/products/${productId}`) // On récupère les données du produit avec l'ID correspondant depuis l'API.
    .then(response => response.json()) // On les transforme en JSON.
    .then(data => {
        console.log(data); // On affiche les données récupérées dans la console.
        afficherProduit(data); // On appelle la fonction d'affichage du produit.
    })
    // En cas d'erreur, on affiche un message d'erreur dans la console et une alerte sur la page.
    .catch(error => {
        console.error(error);
        alert('Une erreur est survenue lors de la récupération des données du produit. Veuillez réessayer plus tard.');
});


// ----- Fonction d'affichage du produit ----- \\

function afficherProduit(productData) {
    // On récupère les éléments HTML où afficher les données.
    const itemImg = document.querySelector('article div.item__img');
    const titleElement = document.getElementById('title');
    const priceElement = document.getElementById('price');
    const descriptionElement = document.getElementById('description');
    const colorsElement = document.getElementById('colors');
    // On intègre dynamiquement les données dans la page.
    itemImg.innerHTML = `<img src="${productData.imageUrl}" alt="${productData.altTxt}">`;
    titleElement.textContent = productData.name;
    priceElement.textContent = productData.price;
    descriptionElement.textContent = productData.description;
    // On itère sur chaque couleur du tableau de couleurs du produit à l'aide de forEach().
    productData.colors.forEach(color => {
        const optionElement = document.createElement('option');
        optionElement.value = color;
        optionElement.textContent = color;
        colorsElement.appendChild(optionElement);
    });
};

// Récupération des éléments HTML représentant la couleur, la quantité et le bouton "Ajouter au panier"
const colorsElement = document.getElementById('colors');
const quantityElement = document.getElementById('quantity');
const addToCartButton = document.getElementById('addToCart');
// On ajoute un écouteur d'événement sur le clic du bouton "Ajouter au panier".
addToCartButton.addEventListener('click', (ajouterAuPanier))


// ----- Fonction d'ajout au panier ----- \\

function ajouterAuPanier() {
    // Récupération de la couleur et de la quantité sélectionnées par l'utilisateur.
    const selectedColor = colorsElement.value;
    const selectedQuantity = parseInt(quantityElement.value);  
    // On vérifie que l'utilisateur a bien sélectionné une couleur et une quantité comprise entre 1 et 100.
    if (selectedColor !== "" && selectedQuantity >= 1 && selectedQuantity <= 100) {
        // Récupération du contenu actuel du panier depuis le localStorage.
        let cartContent = JSON.parse(localStorage.getItem('cartContent'));
        // Si le panier est vide ou non défini, on initialise un tableau vide.
        if (!cartContent) {
            cartContent = [];
        }
        // On récupère les données du produit depuis l'API.
        fetch(`http://localhost:3000/api/products/${productId}`)
            .then(response => response.json())
            .then(productData => {
                // Recherche si le produit est déjà dans le panier.
                const existingProductIndex = cartContent.findIndex(product => product.id === productId && product.color === selectedColor);
                if (existingProductIndex >= 0) {
                    // Si le produit est déjà dans le panier, on ajoute la quantité sélectionnée à la quantité existante.
                    cartContent[existingProductIndex].quantity += selectedQuantity;
                } else {
                    // Sinon, on crée un nouvel objet représentant le produit sélectionné et on l'ajoute au panier.
                    const selectedProduct = {
                        id: productId,
                        name: productData.name,
                        color: selectedColor,
                        quantity: selectedQuantity,
                        imageUrl: productData.imageUrl,
                        altTxt: productData.altTxt
                    };
                    cartContent.push(selectedProduct); // On ajoute le produit dans notre tableau de produits.
                }
                // On stocke le nouveau contenu du panier dans le localStorage.
                localStorage.setItem('cartContent', JSON.stringify(cartContent));
                // On affiche un message de confirmation.
                alert("Le produit a été ajouté au panier !");
            })
            .catch(error => {
                console.error(error);
                alert('Une erreur est survenue lors de la récupération des données du produit. Veuillez réessayer plus tard.');
            });
    } else {
        // Affichage d'un message d'erreur si la couleur ou la quantité sélectionnée est invalide.
        alert("Veuillez sélectionner une couleur et une quantité comprise entre 1 et 100.");
    }
}