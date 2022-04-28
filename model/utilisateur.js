import bcrypt from 'bcrypt';
import connectionPromise from '../connection.js';

//Requête pour créer un utilisateur
export async function addUtilisateur(courriel, motDePasse) {
    let connection = await connectionPromise;

    let motDePasseEncrypte = await bcrypt.hash(motDePasse, 10);

    await connection.run(
        `INSERT INTO utilisateur(id_type_utilisateur, email, password)
        VALUES (1, ?, ?)`,
        [courriel, motDePasseEncrypte]
    )
}

export async function addAdmin(courriel, motDePasse) {
    let connection = await connectionPromise;

    let motDePasseEncrypte = await bcrypt.hash(motDePasse, 10);

    await connection.run(
        `INSERT INTO utilisateur(id_type_utilisateur, email, password)
        VALUES (2, ?, ?)`,
        [courriel, motDePasseEncrypte]
    )
}

//Requête pour chercher un utilisateur par son courriel
export async function getUtilisateurByCourriel(courriel) {
    let connection = await connectionPromise;

    let utilisateur = await connection.get(
        `SELECT * FROM utilisateur WHERE email = ?`,
        [courriel]
    );
    
    
    
    return utilisateur;  
    
}