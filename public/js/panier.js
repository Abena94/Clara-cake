// Liste de tous les boutons de supression du panier
let boutonsDelete = document.querySelectorAll(".panier input[type=button]");

// Bouton de soumission du panier
let boutonSoumettre = document.getElementById("soumettre");

// Bouton pour vider le panier
let boutonVider = document.getElementById("vider");

// Entête du tableau du panier
let thead = document.querySelector(".panier thead");

// Corps du tableau du panier
let tbody = document.querySelector(".panier tbody");

let Prix = document.getElementsByClassName("total");
/**
 * Vide le panier dans l'interface graphique.
 */
const emptyPanierClient = () => {
  // Vider le tableau
  tbody.innerHTML = "";

  // Cacher l'entête du tableau
  thead.classList.add("hidden");

  // Désactiver les boutons de soumission et pour vider
  boutonSoumettre.setAttribute("disabled", "disabled");
  boutonVider.setAttribute("disabled", "disabled");
};

/**
 * Retire un produit du panier sur le serveur.
 * @param {MouseEvent} event Objet d'information sur l'événement.
 */
const removeFromPanier = async (event) => {
  let data = {
    idProduit: parseInt(event.target.parentNode.parentNode.dataset.idProduit),
  };

  let response = await fetch("/panier", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (response.ok) {
    event.target.parentNode.parentNode.remove();
    if (tbody.children.length <= 0) {
      emptyPanierClient();
    }
  }
};
/* */
let modal = document.getElementById("myModal");
/**
 * Soumission du panier sur le serveur.
 */
const addCommande = async () => {

  let response = await fetch("/commande", {
    method: "POST",
  });

  if (response.ok) {
    emptyPanierClient();
  }
}


;

/**
 * Vider le panier sur le serveur.
 */
const emptyPanier = async () => {
 
  let response = await fetch("/panier", {
    method: "DELETE",
  });

  if (response.ok) {
    emptyPanierClient();
  }
};

// Ajoute l'exécution de la fonction "removeFromPanier" pour chaque bouton de
// suppression du panier lorsque l'on clique dessus.
for (let bouton of boutonsDelete) {
  bouton.addEventListener("click", removeFromPanier);
}

// Ajoute l'exécution de la fonction "addCommande" sur le bouton de
// soumission du panier.
boutonSoumettre.addEventListener("click", addCommande);

// Ajoute l'exécution de la fonction "emptyPanier" sur le bouton pour vider le
// panier.
boutonVider.addEventListener("click", emptyPanier);

// This is your test publishable API key.
const stripe = Stripe(
  "pk_test_51KbxMkJHQuFoSWSyqGC6D6SSjH6fuYxPBbdG5VlEgp3UtWvxjkjjZwtAqo9n2QIFdynpgsA3ruGzikPYpmH8QdG000yG55VVHg"
);

// The items the customer wants to buy
const price = document.getElementById("total").textContent;
const items = parseInt(price.substring(0, price.lastIndexOf(" ")));
let elements;

initialize();
checkStatus();
document
  .querySelector("#payment-form")
  .addEventListener("submit", handleSubmit);

// Fetches a payment intent and captures the client secret
async function initialize() {
  const response = await fetch("/create-payment-intent", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ items }),
  });
  const { clientSecret } = await response.json();

  const appearance = {
    theme: "stripe",
  };
  elements = stripe.elements({ appearance, clientSecret });

  const paymentElement = elements.create("payment");
  paymentElement.mount("#payment-element");
}

async function handleSubmit(e) {
  e.preventDefault();
  setLoading(true);

  const { error } = await stripe.confirmPayment({
    elements,
    confirmParams: {
      // Make sure to change this to your payment completion page
      return_url: "https://localhost:5000/panier",
    },
  });

  // This point will only be reached if there is an immediate error when
  // confirming the payment. Otherwise, your customer will be redirected to
  // your `return_url`. For some payment methods like iDEAL, your customer will
  // be redirected to an intermediate site first to authorize the payment, then
  // redirected to the `return_url`.
  if (error.type === "card_error" || error.type === "validation_error") {
    showMessage(error.message);
  } else {
    showMessage("An unexpected error occured.");
  }

  setLoading(false);
}

// Fetches the payment intent status after payment submission
async function checkStatus() {
  const clientSecret = new URLSearchParams(window.location.search).get(
    "payment_intent_client_secret"
  );

  if (!clientSecret) {
    return;
  }

  const { paymentIntent } = await stripe.retrievePaymentIntent(clientSecret);

  switch (paymentIntent.status) {
    case "succeeded":
      showMessage("Payment succeeded!");
      break;
    case "processing":
      showMessage("Your payment is processing.");
      break;
    case "requires_payment_method":
      showMessage("Your payment was not successful, please try again.");
      break;
    default:
      showMessage("Something went wrong.");
      break;
  }
}

// ------- UI helpers -------

function showMessage(messageText) {
  const messageContainer = document.querySelector("#payment-message");

  messageContainer.classList.remove("hidden");
  messageContainer.textContent = messageText;

  setTimeout(function () {
    messageContainer.classList.add("hidden");
    messageText.textContent = "";
  }, 4000);
}

// Show a spinner on payment submission
function setLoading(isLoading) {
  if (isLoading) {
    // Disable the button and show a spinner
    document.querySelector("#submit").disabled = true;
    document.querySelector("#spinner").classList.remove("hidden");
    document.querySelector("#button-text").classList.add("hidden");
  } else {
    document.querySelector("#submit").disabled = false;
    document.querySelector("#spinner").classList.add("hidden");
    document.querySelector("#button-text").classList.remove("hidden");
  }
}
/*var span = document.getElementsByClassName("close")[0];
// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
}*/