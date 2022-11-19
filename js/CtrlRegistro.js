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

const daoRegistro =
  getFirestore().
    collection("Registro");
const params =
  new URL(location.href).
    searchParams;
const id = params.get("id");
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
    busca();
  }
}

/** Busca y muestra los datos que
 * corresponden al id recibido. */
async function busca() {
  try {
    const doc =
      await daoRegistro.
        doc(id).
        get();
    if (doc.exists) {
      /**
       * @type {
          import("./tipos.js").
                  Alumno} */
      const data = doc.data();
      forma.nombre.value = data.nombre;
      forma.apellidos.value = data.apellidos || "";
      forma.telefono.value = data.telefono || "";
      forma.malestar.value = data.malestar || "";
      forma.fechacita.value = data.fechacita || "";
      forma.addEventListener(
        "submit", guarda);
      forma.eliminar.
        addEventListener(
          "click", elimina);
    } else {
      throw new Error(
        "No se encontró.");
    }
  } catch (e) {
    muestraError(e);
    muestraRegistro();
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
                Alumno} */
    const modelo = {
      nombre, 
      apellidos,
      telefono,
      malestar,
      fechacita
    };
    await daoRegistro.
      doc(id).
      set(modelo);
    muestraRegistro();
  } catch (e) {
    muestraError(e);
  }
}

async function elimina() {
  try {
    if (confirm("Confirmar la " +
      "eliminación")) {
      await daoRegistro.
        doc(id).
        delete();
      muestraRegistro();
    }
  } catch (e) {
    muestraError(e);
  }
}

