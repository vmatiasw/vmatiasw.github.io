#!/bin/bash
if [ -z "$1" ]; then
  echo "Error: se requiere un argumento de tipo string"
  exit 1
fi
if [[ (! "$1" =~ ^\'[^\']*\'$) && (! "$1" =~ ^\"[^\"]*\"$) ]]; then
  echo "Error: El argumento $1 debe empezar y terminar con comillas simples (') o dobles (\")."
  exit 1
fi

npm run build
if [ $? -ne 0 ]; then
  # Si falla, salir
  exit 1
fi
rm -rf ./dist

npx prettier --write .

git commit -m "${1:1:-1}"
git push
