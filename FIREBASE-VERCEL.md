# Mise en ligne Firebase + Vercel

## 1. Firebase

1. Créer un projet sur https://console.firebase.google.com.
2. Ajouter une application Web et copier sa configuration.
3. Dans **Authentication > Sign-in method**, activer **Email/Password** et **Google**.
4. Créer une base **Firestore**.
5. Déployer les règles du fichier `firestore.rules` depuis Firebase CLI :

```bash
firebase login
firebase use <PROJECT_ID>
firebase deploy --only firestore:rules
```

## 2. Variables locales

Copier `.env.example` vers `.env`, puis renseigner les valeurs de l’application Web Firebase :

```bash
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

## 3. Vercel

1. Importer le dépôt dans Vercel.
2. Choisir le framework **Vite**.
3. Ajouter les six variables `VITE_FIREBASE_*` dans les variables d’environnement de production, preview et développement.
4. Lancer le déploiement.

Le fichier `vercel.json` redirige les routes SPA vers `index.html`, afin que les QR codes et leurs URLs fonctionnent après rechargement.

## 4. Vérification professionnelle

- Ne jamais publier le fichier `.env` ou les clés privées Firebase Admin.
- Les variables `VITE_FIREBASE_*` peuvent être ajoutées dans Vercel : elles servent uniquement à identifier l’application Web Firebase.
- Si la configuration Firebase est absente, l’application reste en mode local de démonstration et affiche le dashboard sans synchronisation distante.
- En production, tester les règles Firestore avec un compte gestionnaire avant d’ouvrir le service aux centres.
