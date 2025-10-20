/*NOTA-entrega 1----Decidi escribir todo el codigo en ingles ya que quiero crear una web 
para el restaurante donde trabajo, vivo en Dinamarca y todos hablan ingles
 asi que me sirve mas para cuando haga la parte de html y css. */

/*NOTA-entrega 2----Tengo 3 avisos en mi consola pero despues de investigarlo veo que el aviso rojo
es mas que nada una advertencia en caso de usar ciertas cosas y los avisos azules tampoco son
importantes ya que no cuento con login y contraseña (ni creo que vaya a agregarlo en un futuro) 
en caso de que algo de esto sea importante y no me di cuenta, por favor dejarme una nota 
en la devolucion, gracias!*/

// Boot de la app
// Carga estado, conecta eventos y hace el primer render de UI
async function initApp() {
  await loadProducts(); // ahora puede traer defaults por JSON
  loadRecipes();

  wireProductUI();
  wireRecipeUI();

  renderProducts(products);
  renderRecipes(recipes);
}

// Defer se esta usando en HTML, asi puedo llamar directamente:
initApp();

// Utilidades DOM rápidas (atajos)
function $(sel) {
  return document.querySelector(sel);
}
function $$(sel) {
  return document.querySelectorAll(sel);
}
// Toast rápido (SweetAlert2) para feedback no bloqueante
function toast(icon, title, ms = 2000) {
  // Comentario: usamos toasts para acciones exitosas (no destructivas)
  Swal.fire({
    icon,
    title,
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: ms,
    timerProgressBar: true,
  });
}

// Templates (clonado de card de producto)
function getProductCardTemplate() {
  const tpl = $("#product-card-template");
  return tpl.content.firstElementChild.cloneNode(true);
}

// Render de productos
// Dibuja la grilla de cards según la lista recibida (filtrada o completa)
// Render de productos
// Dibuja la grilla de cards según la lista recibida (filtrada o completa)
function renderProducts(list) {
  const container = $("#product-list");
  container.innerHTML = "";

  // Si no hay nada que mostrar, dejamos un placeholder amigable
  if (!list || list.length === 0) {
    container.innerHTML = `<p class="empty-message">No products found.</p>`;
    return;
  }

  list.forEach((prod) => {
    const card = getProductCardTemplate();

    // Relleno de datos
    card.querySelector(".p-name").textContent = prod.name;
    card.querySelector(".p-id").textContent = prod.id;
    card.querySelector(".p-stock").textContent = `Stock: ${prod.stock}`;
    card.querySelector(".p-unit").textContent = ` | Unit: ${prod.unit}`;
    card.querySelector(".p-min").textContent = ` | Min: ${prod.minStock}`;

    // Estado visual según stock (alerta/ok)
    const needs = prod.stock <= prod.minStock;
    card.classList.add(needs ? "low-stock" : "ok-stock");
    card.querySelector(".reorder-flag").hidden = !needs;

    // Botones y formulario inline
    const btnUpdate = card.querySelector(".btn-update");
    const btnDelete = card.querySelector(".btn-delete");
    const formInline = card.querySelector(".inline-update");
    const inputNew = card.querySelector(".u-new-stock");
    const btnCancel = card.querySelector(".u-cancel");

    // Mostrar form de actualización con el stock actual precargado
    btnUpdate.addEventListener("click", () => {
      inputNew.value = prod.stock;
      formInline.hidden = false;
    });

    // Cancelar edición inline
    btnCancel.addEventListener("click", () => {
      formInline.hidden = true;
    });

    // Confirmar nueva cantidad y refrescar UI + storage
    formInline.addEventListener("submit", (e) => {
      e.preventDefault();
      const val = Number(inputNew.value);
      if (Number.isFinite(val) && val >= 0) {
        updateStock(prod.name, val);
        saveProducts();
        renderProducts(products);
        toast("success", "Stock updated"); // feedback sutil
      }
      formInline.hidden = true;
    });

    // Eliminar producto, pide confirmación antes de borrar
    btnDelete.addEventListener("click", () => {
      Swal.fire({
        icon: "warning",
        title: "Delete product?",
        text: `This will permanently remove "${prod.name}".`,
        showCancelButton: true,
        confirmButtonText: "Yes, delete",
        cancelButtonText: "Cancel",
      }).then((result) => {
        if (result.isConfirmed) {
          deleteProduct(prod.name);
          saveProducts();
          renderProducts(products);
          populateProductSelect();
          toast("success", "Product deleted");
        }
      });
    });

    container.appendChild(card);
  });
}

// Borrador de ingredientes de receta (estado temporal del form)
let recipeDraftIngredients = [];

// Select de ingredientes (productos existentes)
// Rellena el <select> con todos los productos actuales
function populateProductSelect() {
  const sel = $("#r-prod");
  if (!sel) return;
  sel.innerHTML = '<option value="">Select product…</option>';
  products.forEach((p) => {
    const opt = document.createElement("option");
    opt.value = p.name;
    opt.textContent = `${p.name} (${p.unit})`;
    sel.appendChild(opt);
  });
}

// Dibuja la lista temporal de ingredientes del borrador (antes de crear receta)
function renderDraftIngredients() {
  const ul = $("#ingredient-list");
  if (!ul) return;
  ul.innerHTML = "";
  recipeDraftIngredients.forEach((ing, idx) => {
    const li = document.createElement("li");
    const prod = findProductByName(ing.productName);
    li.textContent = `${ing.productName} — ${ing.quantity} ${prod?.unit ?? ""}`;
    const del = document.createElement("button");
    del.type = "button";
    del.textContent = "Remove";
    // Quita un ingrediente del borrador por índice
    del.addEventListener("click", () => {
      recipeDraftIngredients.splice(idx, 1);
      renderDraftIngredients();
    });
    li.appendChild(del);
    ul.appendChild(li);
  });
}

// Template de receta
function getRecipeCardTemplate() {
  return $("#recipe-card-template").content.firstElementChild.cloneNode(true);
}

// Render de recetas
// Dibuja cada receta con su lista de ingredientes y botón de borrar
function renderRecipes(list) {
  const container = $("#recipe-list");
  container.innerHTML = "";

  list.forEach((r) => {
    const card = getRecipeCardTemplate();
    card.querySelector(".r-name").textContent = r.name;
    card.querySelector(".r-id").textContent = r.id;
    card.querySelector(".r-steps").textContent = r.steps || "";

    const ul = card.querySelector(".r-ingredients");
    if (ul && Array.isArray(r.ingredients)) {
      r.ingredients.forEach((ing) => {
        const li = document.createElement("li");
        const prod = findProductByName(ing.productName);
        li.textContent = `${ing.productName}: ${ing.quantity} ${
          prod?.unit ?? ""
        }`;
        ul.appendChild(li);
      });
    }

    // Eliminar receta, pide confirmación antes de borrar
    const delBtn = card.querySelector(".btn-delete-recipe");
    if (delBtn) {
      delBtn.addEventListener("click", () => {
        // Confirmación visual antes de eliminar
        Swal.fire({
          icon: "warning",
          title: "Delete recipe?",
          text: `This will permanently remove "${r.name}".`,
          showCancelButton: true,
          confirmButtonText: "Yes, delete",
          cancelButtonText: "Cancel",
        }).then((result) => {
          if (!result.isConfirmed) return; // si cancela, no hace nada

          // Si confirma, borro la receta y actualizo la UI
          deleteRecipe(r.id);
          saveRecipes();
          renderRecipes(recipes);

          // Notificación de éxito
          Swal.fire({
            icon: "success",
            title: "Recipe deleted",
            timer: 1800,
            showConfirmButton: false,
          });
        });
      });
    }

    // Cocinar / usar receta, antes de descontar stock, se pide confirmación
    card.querySelector(".btn-cook-recipe").addEventListener("click", () => {
      let falta = [];

      // Primero revisa si todos los ingredientes tienen stock suficiente
      for (const ing of r.ingredients) {
        const prod = findProductByName(ing.productName);
        if (!prod || prod.stock < ing.quantity) {
          const faltante = prod ? ing.quantity - prod.stock : ing.quantity;
          falta.push(
            `${ing.productName} (missing ${faltante} ${prod?.unit ?? ""})`
          );
        }
      }

      // Si falta stock de alguno, se muestra alerta de error
      if (falta.length > 0) {
        Swal.fire({
          icon: "error",
          title: "Not enough stock",
          html: `
        Cannot cook this recipe. Not enough stock for:<br>
        <ul style="text-align:left;margin-top:10px">
          ${falta.map((item) => `<li>${item}</li>`).join("")}
        </ul>
      `,
        });
        return;
      }

      // Si todo está OK, muestra alerta de confirmación antes de descontar stock
      Swal.fire({
        icon: "question",
        title: "Are you sure?",
        text: "This action will consume the required ingredients.",
        showCancelButton: true,
        confirmButtonText: "Yes, cook it",
        cancelButtonText: "Cancel",
      }).then((result) => {
        if (result.isConfirmed) {
          // Si el usuario confirma, descontamos el stock de cada ingrediente
          for (const ing of r.ingredients) {
            const prod = findProductByName(ing.productName);
            if (prod) prod.stock -= ing.quantity;
          }
          saveProducts();
          renderProducts(products);

          // Alerta de éxito una vez aplicado el cambio
          Swal.fire({
            icon: "success",
            title: "Recipe cooked",
            text: `Stock of ${r.ingredients.length} ingredients has been updated.`,
            timer: 2500,
            showConfirmButton: false,
          });
        }
      });
    });

    container.appendChild(card);
  });
}

// Wiring de UI: Productos
// Conecta el formulario, el buscador, el filtro y el botón de reset
function wireProductUI() {
  // Formulario para añadir productos
  const form = $("#product-form");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = $("#p-name").value.trim();
    const unit = $("#p-unit").value.trim();
    const stock = Number($("#p-stock").value);
    const minStock = Number($("#p-min").value);

    const ok = addProduct(name, unit, stock, minStock);
    if (ok) {
      saveProducts();
      form.reset();
      renderProducts(products);
      populateProductSelect();
      toast("success", "Product added");
    } else {
      Swal.fire({
        icon: "error",
        title: "No se pudo agregar",
        text: "Revisá los campos (nombre repetido o datos inválidos).",
      });
    }
  });

  // Buscador por nombre (filtro en vivo)
  const search = $("#p-search");
  if (search) {
    search.addEventListener("input", () => {
      const q = search.value.trim().toLowerCase();
      if (!q) return renderProducts(products);
      const filtered = products.filter((p) => p.name.toLowerCase().includes(q));
      renderProducts(filtered);
    });
  }

  // Mostrar solo productos que necesitan reposición (stock <= min)
  const btnReorder = $("#btn-show-reorder");
  if (btnReorder) {
    btnReorder.addEventListener("click", () => {
      const toOrder = getProductsToOrder();
      renderProducts(toOrder.length ? toOrder : []);
    });
  }
  // Mostrar todos los productos (reset de filtros)
  const btnShowAll = $("#btn-show-all");
  if (btnShowAll) {
    btnShowAll.addEventListener("click", () => {
      renderProducts(products);
      // simple reset visual, no cambia datos
      toast("success", "Showing all products", 1200);
    });
  }

  // Referencia al botón "Clear all (storage)"
  const btnClear = $("#btn-clear-products"); // ← esta línea faltaba

  // Vaciar storage de productos → limpia localStorage y recarga defaults desde JSON
  if (btnClear) {
    // guardia para no romper si el botón no existe
    btnClear.addEventListener("click", async () => {
      Swal.fire({
        icon: "warning",
        title: "Clear all products?",
        text: "⚠️ This action is irreversible. Are you sure?",
        showCancelButton: true,
        confirmButtonText: "Yes, clear all",
        cancelButtonText: "Cancel",
      }).then(async (result) => {
        if (!result.isConfirmed) return;

        try {
          // 1) limpiar solo la clave de productos (no tocamos recetas)
          localStorage.removeItem("rm_products");

          // 2) vaciar array en memoria y volver a cargar defaults (trae JSON)
          products.length = 0;
          await loadProducts(); // fetch('./data/products.json') si no hay storage

          // 3) refrescar UI dependiente de productos
          renderProducts(products);
          populateProductSelect();

          toast("success", "All products cleared");
        } catch (err) {
          console.error(err);
          Swal.fire({
            icon: "error",
            title: "Unexpected error",
            text: "Could not clear and reload default products.",
          });
        }
      });
    });
  }
}

// Wiring de UI: Recetas
// Maneja el constructor de ingredientes y el submit de la receta
function wireRecipeUI() {
  const form = $("#recipe-form");
  const addIngBtn = $("#btn-add-ingredient");
  const sel = $("#r-prod");
  const qty = $("#r-qty");

  // Llenar el select con productos existentes
  populateProductSelect();

  // Agregar ingrediente al borrador
  addIngBtn.addEventListener("click", () => {
    const productName = sel.value.trim();
    const quantity = Number(qty.value);

    if (!productName) return;
    if (!Number.isFinite(quantity) || quantity <= 0) return;
    if (!findProductByName(productName)) return;

    recipeDraftIngredients.push({ productName, quantity });
    qty.value = "";
    renderDraftIngredients();
  });

  // Crear receta desde el formulario
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = $("#r-name").value.trim();
    const steps = $("#r-steps").value.trim();

    const ok = addRecipe(name, steps, recipeDraftIngredients);
    if (ok) {
      saveRecipes();
      renderRecipes(recipes);

      // reset del borrador y formulario
      recipeDraftIngredients = [];
      renderDraftIngredients();
      form.reset();
    }
  });
}
