import {
  getAuth,
  getFirestore
} from "../lib/fabrica.js";
import {
  getString,
  muestraError
} from "../lib/util.js";
import {
  muestraRegistro
} from "./navegacion.js";
import {
  tieneRol
} from "./seguridad.js";

const daoAlumno =
  getFirestore().
    collection("Registro");
/** @type {HTMLFormElement} */
const forma = document["forma"];
getAuth().onAuthStateChanged(
  protege, muestraError);

/** @param {import(
    "../lib/tiposFire.js").User}
    usuario */
async function protege(usuario) {
  if (tieneRol(usuario,
    ["Administrador"])) {
    forma.addEventListener(
      "submit", guarda);
  }
}

/** @param {Event} evt */
async function guarda(evt) {
  try {
    evt.preventDefault();
    const formData =
      new FormData(forma);
    const nombre = getString(
        formData, "nombre").trim();  
    const apellidos = getString(formData, "apellidos").trim();
    const telefono = getString(formData, "telefono").trim();
    const malestar = getString(formData, "malestar").trim();
    const fechacita = getString(formData, "fechacita").trim();
    /**
     * @type {
        import("./tipos.js").
                Registro de citas médicas} */
    const modelo = {
      nombre,
      apellidos,
      telefono,
      malestar,
      fechacita 
    };
    await daoRegistro.
      add(modelo);
    muestraRegistro();
  } catch (e) {
    muestraError(e);
  }
}

