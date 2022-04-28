// Aller chercher les configurations de l'application
import "dotenv/config";

// Importer les fichiers et librairies
import https from "https";
import { readFile } from "fs/promises";
import express, { json, request, response, urlencoded } from "express";
import expressHandlebars from "express-handlebars";
import session from "express-session";
import memorystore from "memorystore";
import helmet from "helmet";
import compression from "compression";
import cors from "cors";
import passport from "passport";
import cspOption from "./csp-options.js";
import middlewareSse from "./middleware-sse.js";
import "./auth.js";
import { getProduit } from "./model/produit.js";
import {
  getPanier,
  addToPanier,
  removeFromPanier,
  emptyPanier,
} from "./model/panier.js";
import {
  getCommande,
  addCommande,
  modifyEtatCommande,
  getEtatCommande,
  getCommandeUser,
} from "./model/commande.js";
import { validateId, validatePanier, valider } from "./validation.js";
import { addAdmin, addUtilisateur } from "./model/utilisateur.js";
import { getUtilisateurByCourriel } from "./model/utilisateur.js";
import redirectToHTTPS from "./redirect-to-https.js";
import Stripe from "stripe";



// Création du serveur
const app = express();
app.engine(
  "handlebars",
  expressHandlebars({
    helpers: {
      equals: (valeur1, valeur2) => valeur1 === valeur2,
      trimString : function(passedString) {
        var theString = passedString.split('@')[0];
        return theString
    }
    },
  })
);

app.set("view engine", "handlebars");
const MemoryStore = memorystore(session);

// Ajout de middlewares
app.use(redirectToHTTPS);
//app.use(helmet(cspOption));
app.use(compression());
app.use(cors());
app.use(json());
app.use(urlencoded({ extended: false }));
app.use(middlewareSse());
app.use(
  session({
    //Le middleware des sessions et sa configurer
    cookie: { maxAge: 3600000 },
    name: process.env.npm_package_name,
    store: new MemoryStore({ checkPeriod: 3600000 }),
    resave: false,
    saveUninitialized: false,
    secret: process.env.SESSION_SECRET,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static("public"));

const stripe = new Stripe("sk_test_51KbxMkJHQuFoSWSyYnwgJVVUoc0IuYqjDlJ4okVLlcl8uyOkShUy7XPZOeZXPpqe6vboCkB69z9Cd5M75dc39i8I00B9XslOGi")

// Routes
//Route de la page d'acceuil
app.get("/", async (request, response) => {
  response.render("accueil", {
    user: request.user,
    title: "Acceuil",
    produit: await getProduit(),
    admin: request.user?.id_type_utilisateur >= 2,
    idusr: request.user?.id_utilisateur,
  });
});
//Route de la page d'acceuil
app.get("/cordonnee", async (request, response) => {
  response.render("cordonnee", {
    user: request.user,
    title: "Cordonnee",
    produit: await getProduit(),
    admin: request.user?.id_type_utilisateur >= 2,
    idusr: request.user?.id_utilisateur,
  });
});

// Route de la page  menu
app.get("/menu", async (request, response) => {
  response.render("menu", {
    user: request.user,
    title: "Menu",
    produit: await getProduit(),
    admin: request.user?.id_type_utilisateur >= 2,
    idusr: request.user?.id_utilisateur,
  });
});

app.get("/menu", async (request, response) => {
  response.render("menu", {
    user: request.user,
    title: "Menu",
    produit: await getProduit(),
    admin: request.user?.id_type_utilisateur >= 2,
    idusr: request.user?.id_utilisateur,
  });
});

// Route de la page  panier (De l'utilisateur connecté)
app.get("/panier", async (request, response) => {
  if (!request.user) {
    response.sendStatus(401);
  } else {
    let panier = await getPanier(request.user?.id_utilisateur);
    response.render("panier", {
      title: "Panier",
      produit: panier,
      estVide: panier.length <= 0,
      user: request.user,
      admin: request.user?.id_type_utilisateur >= 2,
      key: process.env.Publishable_Key, 
    });
  }
});

// Route pour ajouter un élément au panier (De l'utilisateur connecté)
app.post("/panier", async (request, response) => {
  if (validateId(request.body.idProduit)) {
    addToPanier(request.body.idProduit, 1, request.user?.id_utilisateur);
    response.sendStatus(201);
  } else {
    response.sendStatus(400);
  }
});

// Route pour supprimer un élément du panier   (De l'utilisateur connecté)
app.patch("/panier", async (request, response) => {
  if (validateId(request.body.idProduit)) {
    removeFromPanier(request.body.idProduit, request.user?.id_utilisateur);
    response.sendStatus(200);
  } else {
    response.sendStatus(400);
  }
});

// Route pour vider le panier   (De l'utilisateur connecté)
app.delete("/panier", async (request, response) => {
  if (await validatePanier(request.user?.id_utilisateur)) {
    emptyPanier(request.user?.id_utilisateur);
    response.sendStatus(200);
  } else {
    response.sendStatus(400);
  }
});

//La fonctionne initStream de SSE
app.get("/CommandeCh", (request, response) => {
  response.initStream();
});

// Route de la page des commandes
app.get("/commande", async (request, response) => {
  if (!request.user) {
    response.sendStatus(401);

  } else if(request.user.id_type_utilisateur >1)  {
    response.render("commande", {
      title: "Commandes",
      commande: await getCommande(),
      etatCommande: await getEtatCommande(),
      user: request.user,
      admin: request.user?.id_type_utilisateur >= 2,
    });
  }
else  {
  response.render("commandeuser", {
    title: "Commandes",
    commande: await getCommandeUser(request.user?.id_utilisateur),
    etatCommande: await getEtatCommande(),
    user: request.user,
    admin: request.user?.id_type_utilisateur >= 2,
  });
} 
});


// Route pour modifier l'état d'une commande
app.patch("/commande", async (request, response) => {
  if (
    (await validateId(request.body.idCommande)) &&
    (await validateId(request.body.idEtatCommande))
  ) {
    modifyEtatCommande(request.body.idCommande, request.body.idEtatCommande);

    //La fonctionne pushJson de SSE
    response.pushJson(
      {
        idetatcommande: request.body.idEtatCommande,
        idcommandea: request.body.idCommande,
      },
      "ChangerCmnd"
    );

    response.sendStatus(200);
  } else {
    response.sendStatus(400);
  }
});




app.post("/create-payment-intent", async (req, res) => {
  const { items } = req.body;

  // Create a PaymentIntent with the order amount and currency
  const paymentIntent = await stripe.paymentIntents.create({
    amount: items*1000,
    currency: "cad",
    
    payment_method_types : [
      "card"
    ],
  });

  res.send({
    clientSecret: paymentIntent.client_secret,
  });
});




// Route de la page inscription
app.get("/inscription", (request, response) => {
  response.render("inscription", {
    title: "Inscription",
    user: request.user,
    admin: request.user?.id_type_utilisateur >= 2,
  });
});

// Route de la page Connexion
app.get("/connexion", (request, response) => {
  response.render("connexion", {
    title: "Connexion",
    user: request.user,
    admin: request.user?.id_type_utilisateur >= 2,
  });
});
// Route de la page inscription
app.get("/inscriptionadmin", (request, response) => {
  response.render("inscriptionAdmin", {
    title: "Inscription",
    user: request.user,
    admin: request.user?.id_type_utilisateur >= 2,
  });
});

// Requête pour creer un compteAdmin (inscription)
app.post("/inscriptionadmin", async (request, response, next) => {
  if (valider(request.body)) {
    let utilisateur = await getUtilisateurByCourriel(
      request.body.courriel.toLowerCase()
    );

    if (!utilisateur) {
      try {
        await addAdmin(request.body.courriel, request.body.motDePasse);
        response.sendStatus(201);
      } catch (error) {
        if (error.code === "SQLITE_CONSTRAINT") {
          response.sendStatus(409);
        } else {
          next(error);
        }
      }
    } else {
      response.sendStatus(400);
    }
  } else {
    response.sendStatus(406);
  }
});

// Requête pour creer un utilisateur (inscription)
app.post("/inscription", async (request, response, next) => {
  if (valider(request.body)) {
    let utilisateur = await getUtilisateurByCourriel(
      request.body.courriel.toLowerCase()
    );

    if (!utilisateur) {
      try {
        await addUtilisateur(request.body.courriel, request.body.motDePasse);
        response.sendStatus(201);
      } catch (error) {
        if (error.code === "SQLITE_CONSTRAINT") {
          response.sendStatus(409);
        } else {
          next(error);
        }
      }
    } else {
      response.sendStatus(400);
    }
  } else {
    response.sendStatus(406);
  }
});

//Requête pour connecté un utilisateur (connexion)
app.post("/connexion", (request, response, next) => {
  if (valider(request.body)) {
    passport.authenticate("local", (error, utilisateur, info) => {
      if (error) {
        next(error);
      } else if (!utilisateur) {
        response.status(401).json(info);
      } else {
        request.logIn(utilisateur, (error) => {
          if (error) {
            next(error);
          }

          response.sendStatus(200);
        });
      }
    })(request, response, next);
  } else {
    response.sendStatus(406);
  }
});

//Route déconnecté l'utilisateur
app.post("/deconnexion", (request, response) => {
  request.logout();
  response.redirect("/connexion");
});

// Route pour soumettre le panier
app.post("/commande", async (request, response) => {
  if (await validatePanier(request.user?.id_utilisateur)) {
    addCommande(request.user?.id_utilisateur);
    response.sendStatus(201);
  } else {
    response.sendStatus(400);
  }
});

// Renvoyer une erreur 404 pour les routes non définies
app.use(function (request, response) {
  // Renvoyer simplement une chaîne de caractère indiquant que la page n'existe pas
  response.status(404).send(request.originalUrl + " not found.");
});

//Demmarage du serveur ---Sécurisé----
if (process.env.NODE_ENV === "production") {
  app.listen(process.env.PORT);
  console.info(`Serveurs démarré:`);
  console.info(`http://localhost:${process.env.PORT}`);
} else {
  const credentials = {
    key: await readFile("./security/localhost.key"),
    cert: await readFile("./security/localhost.cert"),
  };

  https.createServer(credentials, app).listen(process.env.PORT);
  console.info(`Serveurs démarré:`);
  console.info(`https://localhost:${process.env.PORT}`);
}
