// Expandir/collapse Electivos
document.querySelectorAll(".materia.desplegable").forEach((bloque) => {
  const titulo = bloque.querySelector(".titulo-electivos");

  if (titulo) {
    titulo.addEventListener("click", (e) => {
      bloque.classList.toggle("activo");
      e.stopPropagation();
    });
  }
});

// --- GUARDAR Y RESTAURAR ESTADO DE MATERIAS ---
// Genera un ID único para cada materia según su posición en la malla
function getMateriaId(materia) {
  // Usa el texto y el índice dentro de su semestre para mayor unicidad
  const semestre = materia.closest(".semestre");
  const year = materia.closest(".year");
  const yearIndex = Array.from(document.querySelectorAll(".year")).indexOf(
    year
  );
  const semestreIndex = Array.from(year.querySelectorAll(".semestre")).indexOf(
    semestre
  );
  const materiaIndex = Array.from(
    semestre.querySelectorAll(
      ".materia, .materia.desplegable, .materia.electivo"
    )
  ).indexOf(materia);
  return `materia-${yearIndex}-${semestreIndex}-${materiaIndex}`;
}

// Cargar estado guardado
function restaurarMaterias() {
  document
    .querySelectorAll(".materia, .materia.electivo")
    .forEach((materia) => {
      const id = getMateriaId(materia);
      const estado = localStorage.getItem(id);
      if (estado === "tachada") materia.classList.add("tachada");
      if (estado === "inhabilitado") materia.classList.add("inhabilitado");
    });
}

// Guardar estado al marcar/desmarcar
function guardarMaterias() {
  document
    .querySelectorAll(".materia, .materia.electivo")
    .forEach((materia) => {
      const id = getMateriaId(materia);
      if (materia.classList.contains("tachada")) {
        localStorage.setItem(id, "tachada");
      } else if (materia.classList.contains("inhabilitado")) {
        localStorage.setItem(id, "inhabilitado");
      } else {
        localStorage.removeItem(id);
      }
    });
}

// Listener para tachar/destachar materias y guardar estado
document.querySelectorAll(".materia").forEach((materia) => {
  if (materia.classList.contains("desplegable")) return;

  materia.addEventListener("click", (e) => {
    const esElectivo = materia.classList.contains("electivo");

    if (esElectivo) {
      const sublista = materia.closest(".submaterias");
      const electivos = sublista.querySelectorAll(".materia.electivo");

      if (materia.classList.contains("tachada")) {
        materia.classList.remove("tachada");
        electivos.forEach((el) => el.classList.remove("inhabilitado"));
      } else {
        materia.classList.add("tachada");
        electivos.forEach((el) => {
          if (el !== materia) {
            el.classList.add("inhabilitado");
          }
        });
      }
    } else {
      materia.classList.toggle("tachada");
    }

    guardarMaterias(); // Guarda el estado después de cada cambio
    e.stopPropagation();
  });
});

// Expandir/collapse Electivos
document.querySelectorAll(".materia.desplegable").forEach((bloque) => {
  const titulo = bloque.querySelector(".titulo-electivos");

  if (titulo) {
    titulo.addEventListener("click", (e) => {
      bloque.classList.toggle("activo");
      e.stopPropagation();
    });
  }
});

// Restaura el estado al cargar la página
window.addEventListener("DOMContentLoaded", () => {
  restaurarMaterias();
  // Espera un tick para quitar la clase y permitir transiciones normales después
  setTimeout(() => {
    document.body.classList.remove("restaurando");
  }, 50);
});
