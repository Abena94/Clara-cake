let inputCourriel = document.getElementById('input-courriel');
let inputMotDePasse = document.getElementById('input-mot-de-passe');
let formConnexion = document.getElementById('form-connexion');

const CourrielErreur = document.getElementById('ErreurCouriel'); 
const motdepasseErreur = document.getElementById('Erreurpassword');

//Appel de la route connexion
formConnexion.addEventListener('submit', async (event) => {
    event.preventDefault();
    if(formConnexion.checkValidity()){const data = {
        courriel: inputCourriel.value.toLowerCase(),
        motDePasse: inputMotDePasse.value
    };

    let response = await fetch('/connexion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });

    if (response.ok) {
        localStorage.setItem('username',inputCourriel.value.split('@')[0]);
        window.location.replace('/');
        CourrielErreur.classList.remove('active');
        motdepasseErreur.classList.remove('active');
        alert("vous êtes connecté")

    }
    else 
    {
      if(response.status === 401) {
        let data = await response.json();
        
        if(data.error=='mauvais_utilisateur')
        {CourrielErreur.classList.add('active');
        CourrielErreur.innerText="Courriel non valide";}

        else { motdepasseErreur.classList.add('active');motdepasseErreur.innerText="Mot de passe incorrect";} }
        
      else {
                 if(response.status === 406){alert("Information invalide !!!");}
                
        }

    }


}
    
});

