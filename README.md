# project2-teamKarkerkarkurkur

Repositorio del proyecto **SEL-MAIN**.  
Este README documenta el funcionamiento de la calculadora de **Eliminación de Gauss–Jordan**, describe cada archivo brevemente

---

## Miembros del equipo

| Integrante     | Rol            |
|----------------|----------------|
| Ángel García   | Interfaz       |
| Bruno Tarango  | Gauss–Jordan   |
| Iván Arroyo    | Comprobaciones |

---

## 🌐 Demo (abrir el programa)

> **No se requiere instalación.**  
> Abre la aplicación directamente en tu navegador:
>
> 👉 https://dainty-platypus-bfb8e4.netlify.app/

---

## 📁 Estructura del repositorio

SEL-MAIN/
└─ project2-teamKarkerkarkurkur/
├─ estilomatriz.css
├─ index.html
├─ integrador-python.js
├─ project2-teamKarkerkarkurkur.py
└─ README.md (este archivo)

markdown
Copiar código

---

## ▶️ Cómo abrir/usar

- **Opción recomendada (online):**  
  Abre **https://dainty-platypus-bfb8e4.netlify.app/**
- **Opción local (para desarrollo):**
  1. Clona el repo.
  2. Abre `index.html` en tu navegador (doble clic o con *Live Server*).
  3. Si deseas probar el script de Python localmente:
     ```bash
     python project2-teamKarkerkarkurkur.py
     ```
     *(solo si ese script expone CLI; de lo contrario, ver su sección más abajo).*

---

## 🧠 ¿Qué hace cada archivo? (resumen)

- **index.html**  
  Página principal, contiene HTML, estilos base y **toda la lógica JS embebida** para:
  - generar la matriz aumentada `[A|b]`,
  - calcular el **determinante** de `A`,
  - reducir con **Gauss–Jordan** a **RREF**,
  - **analizar soluciones** (única / infinitas / inconsistente), rango y base del núcleo.

- **integrador-python.js**  
  Módulo de interfaz alterna:
  - genera matrices visuales `A`, vector `b` y etiquetas `x`,
  - valida entradas, carga un **ejemplo 3×3**, hace *debug*,
  - define un `solveSystem()` **placeholder** (punto para enchufar tu método real) y muestra resultados/“pasos”.

- **project2-teamKarkerkarkurkur.py**  
  Implementación en **NumPy** de la misma idea:
  - Gauss–Jordan sobre matriz aumentada, limpieza numérica, impresión de estados,
  - determinante con `np.linalg.det` (con tolerancia),
  - análisis de solución desde la RREF (rango, solución única/infinitas/inconsistente, base del núcleo),
  - `main()` con ejemplo de uso y verificación.

- **estilomatriz.css**  
  Estilos para la versión de interfaz del archivo JS alterno (`integrador-python.js`): *layout*, matrices, vectores, contenedores de pasos, estados de solución, etc.

---
