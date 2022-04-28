// Liste de tous les <select> pour les commandes
let selects = document.querySelectorAll('.commande select');
let email= document.getElementById('form-email');
let subject=document.getElementById('form_subject');
let content=document.getElementById('form_message');
let select = document.getElementById("select");
/**
 * Modifie l'état d'une commande sur le serveur.
 * @param {InputEvent} event Objet d'information sur l'événement.
 */
const modifyEtatCommande = async (event) => {
    let data = {
        idCommande: parseInt(event.target.parentNode.parentNode.dataset.idCommande),
        idEtatCommande: parseInt(event.target.value)
        
    };
    

    await fetch('/commande', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
}

// Ajoute l'exécution de la fonction "modifyEtatCommande" pour chaque <select> 
// lorsque son état change.
for (let select of selects) {
    select.addEventListener('change', modifyEtatCommande)  
}


//Affichage de l'etat de commande modifié pour le client en temps reel
let source = new EventSource('/CommandeCh');
source.addEventListener('ChangerCmnd', (event) =>{
   
    let data =JSON.parse(event.data);
    
    selects[data.idcommandea-1].value=data.idetatcommande;
       
});