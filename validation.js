import { getPanier } from "./model/panier.js";


/**
 * Valide un identifiant (ID) reçu par le serveur.
 * @param {*} id L'identifiant à valider.
 * @returns Une valeur booléenne indiquant si l'identifiant est valide ou non.
 */
export const validateId = (id) => {
    return !!id &&
        typeof id === 'number' &&
        Number.isInteger(id) &&
        id > 0;
}

/**
 * Valide le panier dans la base de données du serveur.
 * @returns Une valeur booléenne indiquant si le panier est valide ou non.
 */
export const validatePanier = async (iduser) => {
    let panier = await getPanier(iduser);
    return panier.length > 0;
}

//Valider un courriel
const valierCourielSrvr = (Courriel) =>{
return !!Courriel && typeof Courriel =='string' &&
Courriel.match(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
} 

//Valider un mot de passe
const valierMotdepasseSrvr = (Motdepasse) =>{
    return !!Motdepasse && typeof Motdepasse =='string' &&
    Motdepasse.length >= 5 && Motdepasse.length <60;
}

//Valider le body de la requete envoyée au serveur (Courriel et mot de passe)
export const valider = (body) => {
     return valierCourielSrvr(body.courriel) && valierMotdepasseSrvr(body.motDePasse);
      
    }
