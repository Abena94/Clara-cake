let inputCourriel = document.getElementById('input-courriel');
let inputMotDePasse = document.getElementById('input-mot-de-passe');
let formInscription = document.getElementById('form-inscription');

const CourrielErreur = document.getElementById('Erreuremail');

//Appel de la route inscription
formInscription.addEventListener('submit', async (event) => {
    event.preventDefault();
    { if(formInscription.checkValidity()){
        const data = {
            courriel: inputCourriel.value.toLowerCase(),
           motDePasse: inputMotDePasse.value
           };
  
           let response = await fetch('/inscription', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)});
  
            if (response.ok) {window.location.replace('/connexion');
           
            CourrielErreur.classList.remove('active');
            alert("Utilisateur ajoute")
             }
           
            else{ if(response.status === 409) {let data = await response.json(); }
            else {if(response.status === 400){CourrielErreur.classList.add('active');
            CourrielErreur.innerText="Cette adresse courriel existe deja";}
           else{alert("Informations invalide !!!")}
            
            }

            }
        }
    
    }
    
});

