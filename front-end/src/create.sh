#!/bin/bash

# Base directory
BASE_DIR="app"

# Crear estructura de directorios
mkdir -p $BASE_DIR/components/clients-table
mkdir -p $BASE_DIR/guards
mkdir -p $BASE_DIR/interceptors
mkdir -p $BASE_DIR/interface
mkdir -p $BASE_DIR/pages/home
mkdir -p $BASE_DIR/service
mkdir -p $BASE_DIR/state
mkdir -p enviroment

# Crear archivos en app
touch $BASE_DIR/app.config.ts
touch $BASE_DIR/app.html
touch $BASE_DIR/app.routes.ts
touch $BASE_DIR/app.scss
touch $BASE_DIR/app.spec.ts
touch $BASE_DIR/app.ts

# Crear archivos en components/clients-table
touch $BASE_DIR/components/clients-table/clients-table.component.html
touch $BASE_DIR/components/clients-table/clients-table.component.scss
touch $BASE_DIR/components/clients-table/clients-table.component.spec.ts
touch $BASE_DIR/components/clients-table/clients-table.component.ts

# Crear archivos en interface
touch $BASE_DIR/interface/response.ts

# Crear archivos en pages/home
touch $BASE_DIR/pages/home/home.html
touch $BASE_DIR/pages/home/home.scss
touch $BASE_DIR/pages/home/home.spec.ts
touch $BASE_DIR/pages/home/home.ts

# Crear archivos en service
touch $BASE_DIR/service/api.service.ts

# Crear archivos en enviroment
touch enviroment/enviroment.ts

# Crear archivos en la raíz de src
touch index.html
touch main.ts
touch styles.scss

echo "Estructura de archivos creada correctamente."
