### Versión en español (English below)

## FOOD CLUB — Restaurant Manager

### Descripción  
Aplicación web desarrollada como proyecto final del curso de JavaScript.  
Permite gestionar el stock de productos e ingredientes de un restaurante y asociarlos a recetas, con actualizaciones dinámicas, confirmaciones interactivas y almacenamiento persistente en `localStorage`.

---

### Funcionalidades principales

- Agregar productos con nombre, unidad, stock inicial y stock mínimo.  
- Actualizar el stock directamente desde cada card.  
- Eliminar productos con confirmación para evitar errores.  
- Ver productos que necesitan reabastecerse (Show items to reorder).  
- Agregar recetas con pasos opcionales e ingredientes dinámicos.  
- Cocinar recetas para descontar automáticamente los ingredientes del stock, validando la disponibilidad.  
- Confirmaciones y alertas con SweetAlert2 (interfaz en inglés).  
- Datos persistentes usando `localStorage` con carga inicial desde `products.json`.  
- Interfaz responsive con branding fijo y detalles visuales animados.

---

### Estructura del proyecto

```
project-root
 ├─ CarpetaJS
 │   ├─ main.js        → Render de UI y manejo de eventos
 │   └─ store.js       → Lógica de negocio y persistencia
 ├─ CarpetaCSS
 │   └─ style.css      → Estilos base y responsive
 ├─ data
 │   └─ products.json  → Productos iniciales
 ├─ index.html         → Página principal
 └─ README.md          → Documentación del proyecto
```

---

### Tecnologías utilizadas

- HTML5 — estructura semántica  
- CSS3 — diseño responsive y animaciones simples  
- JavaScript (ES6+) — lógica de negocio y manejo del DOM  
- SweetAlert2 — alertas y toasts personalizados  
- LocalStorage + Fetch (JSON) — persistencia de datos

---

### Cómo usar la aplicación

1. Abrir `index.html` con Live Server o alojar en GitHub Pages.  
2. Agregar productos desde el formulario superior.  
3. Crear recetas seleccionando productos existentes.  
4. Cocinar recetas para actualizar el stock automáticamente.  
5. Usar el botón “Show items to reorder” para ver qué productos faltan.  
6. Si se desea volver al estado inicial, usar el botón “Clear all (storage)”.

---

### Pruebas realizadas

- Reset completo de localStorage y carga desde JSON.  
- Validación de stock insuficiente antes de cocinar recetas.  
- Confirmaciones en eliminación de productos y recetas.  
- Render dinámico en tiempo real al agregar, editar o borrar.  
- Pruebas en desktop y mobile (layout responsive).

---

### Mejoras futuras (posibles)

- Autenticación de usuarios y roles.  
- Dashboard con estadísticas.  
- Integración con APIs de proveedores.  
- Versión PWA o aplicación híbrida.

---

### Autor
Proyecto desarrollado por **Federico** como entrega final del curso de **JavaScript**.  
Dinamarca — 2025.

---

## English version

## FOOD CLUB — Restaurant Manager

### Description  
This web application was developed as the final project of a JavaScript course.  
It allows restaurant staff to manage stock and ingredients, associate them with recipes, and update everything dynamically with interactive confirmations and persistent storage using `localStorage`.

---

### Main features

- Add products with name, unit, initial stock and minimum stock.  
- Update stock directly from each card.  
- Delete products with confirmation to avoid mistakes.  
- View products that need to be reordered (Show items to reorder).  
- Add recipes with optional steps and dynamic ingredients.  
- Cook recipes to automatically subtract ingredients from stock, validating availability.  
- Confirmations and alerts with SweetAlert2 (UI in English).  
- Persistent data using `localStorage` and initial loading from `products.json`.  
- Responsive interface with fixed branding and simple animations.

---

### Project structure

```
project-root
 ├─ CarpetaJS
 │   ├─ main.js        → UI rendering and event handling
 │   └─ store.js       → Business logic and persistence
 ├─ CarpetaCSS
 │   └─ style.css      → Base and responsive styles
 ├─ data
 │   └─ products.json  → Initial products
 ├─ index.html         → Main page
 └─ README.md          → Project documentation
```

---

### Technologies used

- HTML5 — semantic structure  
- CSS3 — responsive design and simple animations  
- JavaScript (ES6+) — business logic and DOM handling  
- SweetAlert2 — alerts and toasts  
- LocalStorage + Fetch (JSON) — data persistence

---

### How to use the app

1. Open `index.html` with Live Server or host it on GitHub Pages.  
2. Add products using the form at the top of the page.  
3. Create recipes by selecting existing products.  
4. Cook recipes to automatically update the stock.  
5. Use the “Show items to reorder” button to view missing products.  
6. If you want to return to the initial state, use the “Clear all (storage)” button.

---

### Tests performed

- Full localStorage reset and load from JSON.  
- Validation of insufficient stock before cooking.  
- Confirmation prompts on product and recipe deletion.  
- Real-time rendering when adding, editing or deleting.  
- Desktop and mobile responsive tests.

---

### Possible future improvements

- User authentication and roles.  
- Statistics dashboard.  
- Integration with supplier APIs.  
- PWA or hybrid app version.

---

### Author
Project developed by **Federico** as the final project of the **JavaScript** course.  
Denmark — 2025.
