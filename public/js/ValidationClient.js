 
//////////////////////////Validation Pour la page isncription

//Recupérer les valeurs des champs
const formIns = document.getElementById('form-inscription');
const Courriel = document.getElementById('input-courriel');
const MotDePasse = document.getElementById('input-mot-de-passe');

const CourrielErreur = document.getElementById('Erreuremail');

//La methode pour valider le champs courriel
const validerCourriel = () =>{
    if (Courriel.validity.valid){
   CourrielErreur.classList.remove('active');
    }
   else 
   {CourrielErreur.classList.add('active');
       if(Courriel.validity.valueMissing){CourrielErreur.innerText='Veuillez saisir votre adresse courriel';}
       else {CourrielErreur.innerText='Veuillez saisir une adresse courriel valide';}
    }
}

formIns.addEventListener('submit',validerCourriel);
Courriel.addEventListener('blur',validerCourriel);


const motdepasseErreur = document.getElementById('Erreurpassword');

//La methode pour valider le champs mot de passe
const validermotdepasse = () =>{
    if (MotDePasse.validity.valid){
        motdepasseErreur.classList.remove('active');
    }
   else 
   {motdepasseErreur.classList.add('active');
       if(MotDePasse.validity.valueMissing){motdepasseErreur.innerText='Veuillez saisir votre mot de passe';}
       else {if(MotDePasse.validity.tooShort){motdepasseErreur.innerText='Veuillez mot de passe est trop court';}
    else {motdepasseErreur.innerText='Veuillez mot de passe est trop long';}
    }
           
    }
}

formIns.addEventListener('submit',validermotdepasse);
MotDePasse.addEventListener('blur',validermotdepasse);

