# Cashflow Campus

SaaS de gestion de tresorerie pour les centres de formation.

Le gestionnaire peut creer ses formations, definir les frais, inscrire les etudiants, generer des cartes QR, enregistrer les paiements, produire des recus et suivre les soldes. Les etudiants peuvent s'inscrire avec un QR public et consulter leur statut depuis leur QR personnel.

## Fonctionnalites

- Connexion gestionnaire par email/mot de passe ou Google avec Firebase Authentication.
- Creation du catalogue de formations propre a chaque centre.
- Nom, frais et description pour chaque formation.
- Inscription manuelle des etudiants.
- Inscription publique via QR code.
- Generation de QR codes individuels.
- Export PDF groupe des cartes QR, pret a imprimer et decouper.
- Scanner QR avec la camera du gestionnaire.
- Paiements avec historique Firestore.
- Mise a jour automatique du montant paye, du reste et de la progression.
- Generation d'un recu PDF apres chaque paiement.
- Rapports CSV.
- Tableau de bord, notifications, centre d'aide et gestion des parametres.
- Error Boundary et messages d'erreur Firebase.
- Deploiement Vercel avec routes SPA.

## Prerequis

Installer les outils suivants :

- Node.js 20 ou plus recent recommande.
- npm.
- Un compte Firebase.
- Un compte Vercel.
- Git si le projet doit etre deploye depuis GitHub.

Verifier l'installation :

```bash
node --version
npm --version
```

## 1. Installer le projet en local

Depuis un terminal :

```bash
cd C:\Users\USE\Desktop\SaaS
npm install
```

Lancer le projet :

```bash
npm run dev
```

Vite affiche une adresse locale, generalement :

```text
http://localhost:5173
```

Tester la compilation de production :

```bash
npm run build
```

Tester le build localement :

```bash
npm run preview
```

## 2. Creer le projet Firebase

1. Aller sur [Firebase Console](https://console.firebase.google.com/).
2. Cliquer sur **Create a project**.
3. Donner un nom au projet, par exemple `cashflow-campus-prod`.
4. Activer Google Analytics uniquement si necessaire.
5. Attendre la creation du projet.

Conserver le **Project ID** Firebase : il sera utilise pour les regles et le deploiement.

## 3. Ajouter l'application Web Firebase

Dans le projet Firebase :

1. Ouvrir **Project settings**.
2. Dans **Your apps**, cliquer sur l'icone Web `</>`.
3. Donner un nom comme `Cashflow Campus Web`.
4. Ne pas activer Firebase Hosting si Vercel est utilise.
5. Enregistrer l'application.
6. Copier les valeurs de `firebaseConfig`.

Ne jamais copier une cle Firebase Admin dans le frontend. Le projet utilise uniquement la configuration Web `VITE_FIREBASE_*`.

## 4. Activer l'authentification

Dans Firebase Console :

1. Ouvrir **Build > Authentication**.
2. Cliquer sur **Get started**.
3. Dans **Sign-in providers**, activer **Email/Password**.
4. Activer ensuite **Google**.
5. Choisir une adresse email de support pour Google.
6. Enregistrer.

Ajouter les domaines autorises :

1. Ouvrir **Authentication > Settings > Authorized domains**.
2. Verifier que `localhost` est present pour le developpement.
3. Ajouter le domaine Vercel apres le premier deploiement, par exemple :

```text
cashflow-campus.vercel.app
```

Si un domaine personnalise est utilise, l'ajouter aussi.

## 5. Creer Firestore

Dans Firebase Console :

1. Ouvrir **Build > Firestore Database**.
2. Cliquer sur **Create database**.
3. Choisir une region proche des utilisateurs.
4. Commencer en mode production.
5. Attendre la creation de la base.

Les collections utilisees par l'application sont notamment :

```text
centres/{centreId}
centres/{centreId}/members/{userId}
centres/{centreId}/students/{studentId}
centres/{centreId}/payments/{paymentId}
centres/{centreId}/courses/{courseId}
```

Il n'y a pas de collection `publicStudents` séparée : la fiche d'un étudiant (`centres/{centreId}/students/{studentId}`) est directement consultable sans connexion par son identifiant exact (lecture "get"), mais la liste complète des étudiants d'un centre reste réservée aux membres connectés (lecture "list"). Voir `firestore.rules`.

## 6. Configurer les regles Firestore

Installer Firebase CLI si necessaire :

```bash
npm install -g firebase-tools
```

Se connecter :

```bash
firebase login
```

Depuis le dossier du projet, associer le projet Firebase :

```bash
cd C:\Users\USE\Desktop\SaaS
firebase use --add
```

Selectionner le projet Firebase cree precedemment.

Si Firebase demande d'initialiser Firestore :

```bash
firebase init firestore
```

Choisir :

- **Use an existing project**.
- Le projet Firebase existant.
- `firestore.rules` comme fichier de regles.
- Le fichier d'index par defaut si Firebase le demande.

Deployer les regles :

```bash
firebase deploy --only firestore:rules
```

Les regles du fichier [firestore.rules](firestore.rules) limitent les donnees privees aux membres actifs du centre et donnent un acces public limite aux fiches QR etudiantes.

## 7. Configurer les variables locales

Creer le fichier `.env` a partir de `.env.example` :

```bash
copy .env.example .env
```

Sous macOS ou Linux :

```bash
cp .env.example .env
```

Remplir `.env` avec la configuration Web Firebase :

```env
VITE_FIREBASE_API_KEY=xxxxxxxx
VITE_FIREBASE_AUTH_DOMAIN=cashflow-campus-prod.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=cashflow-campus-prod
VITE_FIREBASE_STORAGE_BUCKET=cashflow-campus-prod.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=xxxxxxxx
VITE_FIREBASE_APP_ID=1:xxxxxxxx:web:xxxxxxxx
```

Ne jamais committer `.env`. Il est deja ignore par `.gitignore`.

Relancer le serveur apres toute modification de `.env` :

```bash
npm run dev
```

## 8. Tester en local

Tester dans cet ordre :

1. Creer un compte gestionnaire avec Email/Password.
2. Se deconnecter puis se reconnecter.
3. Tester la connexion Google.
4. Ouvrir **Parametres**.
5. Creer une formation avec un nom, une description et des frais.
6. Inscrire un etudiant et verifier que le montant total vient de la formation.
7. Ouvrir le QR public d'inscription.
8. Inscrire un etudiant depuis ce QR.
9. Generer le PDF groupe des cartes.
10. Scanner une carte avec la camera.
11. Enregistrer un paiement inferieur ou egal au solde.
12. Verifier le recu PDF.
13. Ouvrir **Tresorerie** et verifier l'historique.
14. Telecharger le rapport CSV.
15. Recharger la page et verifier que les donnees sont toujours presentes.

La camera QR necessite `localhost` ou HTTPS. Elle ne fonctionne generalement pas depuis une page HTTP non securisee.

## 9. Deployer sur Vercel

### Option A : depuis GitHub

1. Creer un depot GitHub prive ou public.
2. Depuis le dossier du projet :

```bash
git init
git add .
git commit -m "Initial Cashflow Campus SaaS"
git branch -M main
git remote add origin https://github.com/VOTRE_COMPTE/VOTRE_DEPOT.git
git push -u origin main
```

3. Aller sur [Vercel](https://vercel.com/).
4. Cliquer sur **Add New > Project**.
5. Importer le depot GitHub.
6. Laisser Vercel detecter **Vite**.
7. Verifier les parametres :

```text
Build command: npm run build
Output directory: dist
Install command: npm install
```

8. Avant de deployer, ouvrir **Settings > Environment Variables**.
9. Ajouter les six variables suivantes pour **Production**, **Preview** et **Development** :

```text
VITE_FIREBASE_API_KEY
VITE_FIREBASE_AUTH_DOMAIN
VITE_FIREBASE_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET
VITE_FIREBASE_MESSAGING_SENDER_ID
VITE_FIREBASE_APP_ID
```

10. Cliquer sur **Deploy**.

Le fichier [vercel.json](vercel.json) redirige les routes SPA vers `index.html`, ce qui permet aux liens QR de fonctionner apres rechargement.

### Option B : avec Vercel CLI

Installer Vercel CLI :

```bash
npm install -g vercel
```

Se connecter et deployer :

```bash
cd C:\Users\USE\Desktop\SaaS
vercel login
vercel
```

Pour la production :

```bash
vercel --prod
```

Les variables Firebase peuvent etre ajoutees dans le dashboard Vercel ou avec la CLI. Le dashboard est recommande pour eviter les erreurs de saisie.

## 10. Configurer le domaine Vercel dans Firebase

Apres le premier deploiement :

1. Copier le domaine Vercel.
2. Retourner dans Firebase Console.
3. Ouvrir **Authentication > Settings > Authorized domains**.
4. Ajouter le domaine Vercel.
5. Tester Email/Password et Google sur le domaine de production.
6. Scanner un QR depuis un vrai telephone.

## 11. Mise a jour apres modification

Avec GitHub et Vercel :

```bash
git add .
git commit -m "Description de la modification"
git push
```

Vercel lance automatiquement un nouveau build.

Pour les regles Firebase :

```bash
firebase deploy --only firestore:rules
```

## Depannage

### L'application affiche le mode local

Verifier que les six variables `VITE_FIREBASE_*` existent dans Vercel et redployer. Les variables Vite sont integrees au build : un simple rafraichissement ne suffit pas.

### La connexion Google est refusee

Verifier :

- que Google est active dans Firebase Authentication ;
- que le domaine Vercel est dans les domaines autorises ;
- que le domaine utilise est exactement le bon ;
- que les cookies et popups ne sont pas bloques.

### Permission Firestore denied

Deployer les regles :

```bash
firebase deploy --only firestore:rules
```

Puis verifier que le gestionnaire est authentifie et que son document `members/{userId}` existe avec :

```text
active: true
role: owner
```

### Le QR etudiant ne s'ouvre pas sur telephone

Verifier que :

- le deploiement Vercel est public ;
- le domaine est autorise dans Firebase ;
- le QR a ete genere apres le deploiement ;
- la camera du telephone a l'autorisation d'acceder au navigateur.

### Le scanner camera ne demarre pas

Utiliser HTTPS ou `localhost`, autoriser la camera et essayer Chrome ou Safari a jour.

### Le build echoue

Supprimer les dependances puis reinstaller :

```bash
rmdir /s /q node_modules
 del package-lock.json
 npm install
 npm run build
```

Sous macOS ou Linux :

```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

## Securite avant commercialisation

- Ne jamais publier `.env`.
- Ne jamais utiliser une cle Firebase Admin dans le frontend.
- Deployer les regles Firestore avant de partager le lien.
- Tester avec deux comptes gestionnaires differents.
- Verifier qu'un gestionnaire ne peut pas lire les donnees d'un autre centre.
- Sauvegarder regulierement Firestore.
- Tester les paiements et recus avec de vrais montants de test avant la mise en production.

## Scripts disponibles

```bash
npm run dev       # serveur de developpement
npm run build     # build de production
npm run preview   # apercu du build de production
```