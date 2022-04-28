//Les imports
import bcrypt from 'bcrypt';
import passport from "passport";
import { Strategy } from "passport-local";
import { getUtilisateurByCourriel } from "./model/utilisateur.js";



//Configuration de la stratégie.
const config = {
    usernameField: 'courriel',
    passwordField: 'motDePasse'
};

// Configuration de quoi faire avec l'identifiant et le mot de passe pour les valider
passport.use(new Strategy(config, async (courriel, motDePasse, done) => {
  try {
        let utilisateur = await getUtilisateurByCourriel(courriel);

        if (!utilisateur) {
            
            return done(null, false, { error: 'mauvais_utilisateur' });
            
        }
        
        let valide = await bcrypt.compare(motDePasse, utilisateur.password);

            if (!valide) {
                return done(null, false, { error: 'mauvais_mot_de_passe' });
                
            }
    
            return done(null, utilisateur);
           
        
        
    }
    catch (error) {
        return done(error);
        
    }
}));

//Sérialisation des données
passport.serializeUser((utilisateur, done) => {
    done(null, utilisateur.email);
});

//Désérialisation des données
passport.deserializeUser(async (email, done) => {
    try {
        let  utilisateur = await getUtilisateurByCourriel(email);
        done(null, utilisateur);
    }
    catch (error) {
        done(error);
    }
})
