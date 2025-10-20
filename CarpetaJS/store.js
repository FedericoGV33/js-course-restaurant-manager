/* store.js — estado, persistencia y lógica de negocio */

/* Estado en memoria */
const products = [];
const recipes = [];

/* Productos por defecto (si no hay nada en storage, los buscaremos por JSON) */
const defaultProducts = [
  { id: generateId(), name: "Flour", unit: "kg", stock: 12, minStock: 5 },
  {
    id: generateId(),
    name: "Sunflower Oil",
    unit: "lt",
    stock: 3,
    minStock: 6,
  },
  { id: generateId(), name: "Tomato", unit: "kg", stock: 8, minStock: 4 },
];

/* Claves de localStorage */
const STORAGE_KEYS = {
  products: "rm_products",
  recipes: "rm_recipes",
};

/* Persistencia */
function saveProducts() {
  localStorage.setItem(STORAGE_KEYS.products, JSON.stringify(products));
}

async function loadProducts() {
  const raw = localStorage.getItem(STORAGE_KEYS.products);
  const data = raw ? JSON.parse(raw) : null;

  products.length = 0;

  if (Array.isArray(data) && data.length) {
    // caso A: ya había productos guardados
    for (const p of data) products.push(p);
    return;
  }

  // caso B: no hay nada guardado → intento cargar defaults desde JSON
  try {
    const resp = await fetch("./data/products.json"); // path relativo
    if (!resp.ok) throw new Error("fetch defaults failed");
    const defaultsFromJson = await resp.json();
    for (const p of defaultsFromJson) products.push(p);
    saveProducts(); // persisto la base inicial
  } catch (e) {
    // si por algún motivo no pude traer el JSON, uso los hardcoded
    for (const p of defaultProducts) products.push(p);
    saveProducts();
  }
}

function saveRecipes() {
  localStorage.setItem(STORAGE_KEYS.recipes, JSON.stringify(recipes));
}

function loadRecipes() {
  const raw = localStorage.getItem(STORAGE_KEYS.recipes);
  const data = raw ? JSON.parse(raw) : null;
  recipes.length = 0;
  if (Array.isArray(data) && data.length) {
    for (const r of data) recipes.push(r);
  } else {
    saveRecipes();
  }
}

/* IDs y utilidades */
function generateRandomNumber() {
  // (fix para usar todo el alfabeto)
  return Math.floor(Math.random() * 26); // 0..25
}
function generateId() {
  const letters = "abcdefghijklmnopqrstuvwxyz";
  const idLength = 16;
  let id = "";
  for (let i = 0; i < idLength; i++) {
    const position = generateRandomNumber();
    id = id + letters[position];
  }
  return id;
}

function findProductByName(name) {
  const myName = (name ?? "").trim().toLowerCase();
  for (let i = 0; i < products.length; i++) {
    const myProduct = products[i];
    if (myProduct.name.toLowerCase() === myName) return myProduct;
  }
  return null;
}

/* Lógica de negocio (productos) */
function addProduct(name, unit, stock, minStock) {
  const myName = (name ?? "").trim();
  const myUnit = (unit ?? "").trim();

  if (myName.length < 2) return false;
  if (myUnit.length === 0) return false;

  const myStock = Number(stock);
  const myMinStock = Number(minStock);
  if (isNaN(myStock) || myStock < 0 || isNaN(myMinStock) || myMinStock < 0)
    return false;

  if (findProductByName(myName)) return false;

  const newProduct = {
    id: generateId(),
    name: myName,
    unit: myUnit,
    stock: myStock,
    minStock: myMinStock,
  };
  products.push(newProduct);
  return true;
}

function updateStock(name, newStock) {
  const myName = (name ?? "").trim();
  const myProduct = findProductByName(myName);
  if (!myProduct) return false;

  const myStock = Number(newStock);
  if (isNaN(myStock) || myStock < 0) return false;

  myProduct.stock = myStock;
  return true;
}

function getProductsToOrder() {
  const productsToOrder = [];
  for (let i = 0; i < products.length; i++) {
    const myProduct = products[i];
    if (myProduct.stock <= myProduct.minStock) productsToOrder.push(myProduct);
  }
  return productsToOrder;
}

function deleteProduct(name) {
  const myName = (name ?? "").trim().toLowerCase();
  let position = -1;
  for (let i = 0; i < products.length; i++) {
    if (products[i].name.trim().toLowerCase() === myName) {
      position = i;
      break;
    }
  }
  if (position !== -1) {
    products.splice(position, 1);
    return true;
  }
  return false;
}

/* Lógica de negocio (recetas) */
function addRecipe(name, steps, ingredients) {
  const myName = (name ?? "").trim();
  const mySteps = (steps ?? "").trim();

  if (myName.length < 2) return false;
  if (!Array.isArray(ingredients) || ingredients.length === 0) return false;

  for (let i = 0; i < ingredients.length; i++) {
    const myIngredient = ingredients[i];
    if (!findProductByName(myIngredient.productName)) return false;
    if (isNaN(myIngredient.quantity) || myIngredient.quantity <= 0)
      return false;
  }

  const myRecipe = {
    id: generateId(),
    name: myName,
    steps: mySteps,
    ingredients,
  };
  recipes.push(myRecipe);
  return true;
}

function deleteRecipe(id) {
  const idx = recipes.findIndex((r) => r.id === id);
  if (idx !== -1) {
    recipes.splice(idx, 1);
    return true;
  }
  return false;
}
