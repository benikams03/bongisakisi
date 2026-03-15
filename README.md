## Optimiser sont application
Supprime les packages inutiles :
```sh
    npm prune
```

## Vérifier ce qui pèse lourd
```sh
    npx cost-of-modules
```

Juste avant de build avec electron-builder,
```sh
    npm install --omit=dev
```