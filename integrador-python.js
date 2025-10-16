// Variables globales
let pyodide;
let pythonLoaded = false;

// Función para generar la interfaz de matrices
function generateMatrix() {
    const size = parseInt(document.getElementById('matrixSize').value);
    
    if (isNaN(size) || size < 1 || size > 10) {
        alert('Por favor, ingresa un tamaño válido entre 1 y 10');
        return;
    }
    
    const matrixA = document.getElementById('matrixA');
    const vectorX = document.getElementById('vectorX');
    const vectorB = document.getElementById('vectorB');
    
    // Limpiar matrices existentes
    matrixA.innerHTML = '';
    vectorX.innerHTML = '';
    vectorB.innerHTML = '';
    
    // Generar matriz A (coeficientes)
    const matrixContainer = document.createElement('div');
    matrixContainer.className = 'matrix-container';
    
    for (let i = 0; i < size; i++) {
        const row = document.createElement('div');
        row.className = 'matrix-row';
        
        for (let j = 0; j < size; j++) {
            const input = document.createElement('input');
            input.type = 'number';
            input.step = 'any';
            input.className = 'matrix-cell';
            input.placeholder = '0';
            input.id = `a${i}${j}`;
            // Valor por defecto para pruebas
            if (i === j) input.value = '1';
            row.appendChild(input);
        }
        
        matrixContainer.appendChild(row);
    }
    
    matrixA.appendChild(matrixContainer);
    
    // Generar vector X (incógnitas - solo visual)
    const vectorXContainer = document.createElement('div');
    vectorXContainer.className = 'matrix-container';
    
    for (let i = 0; i < size; i++) {
        const row = document.createElement('div');
        row.className = 'matrix-row';
        
        const label = document.createElement('div');
        label.className = 'matrix-cell';
        label.textContent = `x${i+1}`;
        label.style.border = 'none';
        label.style.fontWeight = 'bold';
        label.style.backgroundColor = 'transparent';
        row.appendChild(label);
        
        vectorXContainer.appendChild(row);
    }
    
    vectorX.appendChild(vectorXContainer);
    
    // Generar vector B (términos independientes)
    const vectorBContainer = document.createElement('div');
    vectorBContainer.className = 'matrix-container';
    
    for (let i = 0; i < size; i++) {
        const row = document.createElement('div');
        row.className = 'matrix-row';
        
        const input = document.createElement('input');
        input.type = 'number';
        input.step = 'any';
        input.className = 'vector-cell';
        input.placeholder = '0';
        input.id = `b${i}`;
        // Valor por defecto para pruebas
        input.value = (i + 1).toString();
        row.appendChild(input);
        
        vectorBContainer.appendChild(row);
    }
    
    vectorB.appendChild(vectorBContainer);
    
    // Mostrar la sección de matrices
    document.getElementById('matrixSection').style.display = 'block';
    document.getElementById('outputSection').style.display = 'none';
    document.getElementById('stepsContainer').style.display = 'none';
}

// Función para obtener los datos de las matrices
function getMatrixData() {
    const size = parseInt(document.getElementById('matrixSize').value);
    
    // Obtener valores de la matriz A
    const A = [];
    for (let i = 0; i < size; i++) {
        const row = [];
        for (let j = 0; j < size; j++) {
            const input = document.getElementById(`a${i}${j}`);
            const value = parseFloat(input.value);
            row.push(isNaN(value) ? 0 : value);
        }
        A.push(row);
    }
    
    // Obtener valores del vector b
    const b = [];
    for (let i = 0; i < size; i++) {
        const input = document.getElementById(`b${i}`);
        const value = parseFloat(input.value);
        b.push(isNaN(value) ? 0 : value);
    }
    
    return { A, b, size };
}

// Función para validar que todos los campos estén llenos
function validateInputs() {
    const size = parseInt(document.getElementById('matrixSize').value);
    let isValid = true;
    let emptyFields = [];
    
    // Validar matriz A
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            const input = document.getElementById(`a${i}${j}`);
            if (input.value.trim() === '') {
                isValid = false;
                emptyFields.push(`A[${i+1}][${j+1}]`);
                input.style.borderColor = '#e74c3c';
            } else {
                input.style.borderColor = '#ddd';
            }
        }
    }
    
    // Validar vector b
    for (let i = 0; i < size; i++) {
        const input = document.getElementById(`b${i}`);
        if (input.value.trim() === '') {
            isValid = false;
            emptyFields.push(`b[${i+1}]`);
            input.style.borderColor = '#e74c3c';
        } else {
            input.style.borderColor = '#ddd';
        }
    }
    
    if (!isValid) {
        alert(`Por favor, completa todos los campos:\n${emptyFields.join(', ')}`);
    }
    
    return isValid;
}

// Función para limpiar todos los campos
function clearAllInputs() {
    const size = parseInt(document.getElementById('matrixSize').value);
    
    // Limpiar matriz A
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            const input = document.getElementById(`a${i}${j}`);
            if (input) {
                input.value = '';
                input.style.borderColor = '#ddd';
            }
        }
    }
    
    // Limpiar vector b
    for (let i = 0; i < size; i++) {
        const input = document.getElementById(`b${i}`);
        if (input) {
            input.value = '';
            input.style.borderColor = '#ddd';
        }
    }
    
    // Ocultar resultados
    document.getElementById('outputSection').style.display = 'none';
    document.getElementById('stepsContainer').style.display = 'none';
}

// Función para cargar ejemplo predefinido
function loadExample() {
    const size = 3;
    document.getElementById('matrixSize').value = size;
    
    // Generar la matriz primero
    generateMatrix();
    
    // Datos de ejemplo para un sistema 3x3
    const exampleA = [
        [2, 1, -1],
        [-3, -1, 2],
        [-2, 1, 2]
    ];
    
    const exampleB = [8, -11, -3];
    
    // Llenar matriz A
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            const input = document.getElementById(`a${i}${j}`);
            if (input) input.value = exampleA[i][j];
        }
    }
    
    // Llenar vector b
    for (let i = 0; i < size; i++) {
        const input = document.getElementById(`b${i}`);
        if (input) input.value = exampleB[i];
    }
    
    alert('Ejemplo de sistema 3x3 cargado:\n2x + y - z = 8\n-3x - y + 2z = -11\n-2x + y + 2z = -3');
}

// Función para mostrar los datos en consola (para debugging)
function debugMatrixData() {
    const { A, b, size } = getMatrixData();
    
    console.log('=== DATOS DE LAS MATRICES ===');
    console.log('Matriz A:');
    console.table(A);
    console.log('Vector b:', b);
    console.log('Tamaño:', size);
    
    // Mostrar en alerta también
    let alertText = `Matriz A (${size}x${size}):\n`;
    A.forEach(row => {
        alertText += row.join('\t') + '\n';
    });
    alertText += `\nVector b:\n${b.join('\n')}`;
    
    alert(alertText);
}

// Inicializar event listeners cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    // Botón principal para generar matrices
    document.getElementById('generateBtn').addEventListener('click', generateMatrix);
    
    // Botón para resolver el sistema
    document.getElementById('solveBtn').addEventListener('click', function() {
        if (validateInputs()) {
            solveSystem();
        }
    });
    
    // Botón para limpiar (si existe)
    const clearBtn = document.getElementById('clearBtn');
    if (clearBtn) {
        clearBtn.addEventListener('click', clearAllInputs);
    }
    
    // Botón para cargar ejemplo (si existe)
    const exampleBtn = document.getElementById('exampleBtn');
    if (exampleBtn) {
        exampleBtn.addEventListener('click', loadExample);
    }
    
    // Botón para debug (si existe)
    const debugBtn = document.getElementById('debugBtn');
    if (debugBtn) {
        debugBtn.addEventListener('click', debugMatrixData);
    }
    
    // Permitir generar con Enter en el input de tamaño
    document.getElementById('matrixSize').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            generateMatrix();
        }
    });
});

// Función para resolver el sistema (a implementar según tu método)
function solveSystem() {
    if (!validateInputs()) return;
    
    const { A, b, size } = getMatrixData();
    
    // Aquí va tu lógica para resolver el sistema
    // Puede ser con Gauss-Jordan, numpy, etc.
    
    console.log('Resolviendo sistema con:', { A, b, size });
    
    // Ejemplo de resultado (esto lo cambiarás por tu implementación real)
    const result = {
        solutionType: 'unique', // 'unique', 'infinite', 'none'
        solution: [1, 2, 3], // Ejemplo de solución
        steps: ['Paso 1: ...', 'Paso 2: ...'] // Pasos del algoritmo
    };
    
    displayResults(result);
}

// Función para mostrar resultados
function displayResults(result) {
    const outputSection = document.getElementById('outputSection');
    const solutionText = document.getElementById('solutionText');
    const stepsContainer = document.getElementById('stepsContainer');
    const stepsContent = document.getElementById('stepsContent');
    
    // Mostrar tipo de solución
    solutionText.className = 'solution';
    
    switch(result.solutionType) {
        case 'unique':
            solutionText.textContent = '✅ El sistema tiene una solución única.';
            solutionText.classList.add('unique');
            break;
        case 'infinite':
            solutionText.textContent = '∞ El sistema tiene infinitas soluciones.';
            solutionText.classList.add('infinite');
            break;
        case 'none':
            solutionText.textContent = '❌ El sistema no tiene solución.';
            solutionText.classList.add('none');
            break;
    }
    
    // Mostrar pasos si existen
    if (result.steps && result.steps.length > 0) {
        stepsContent.innerHTML = '';
        result.steps.forEach((step, index) => {
            const stepElement = document.createElement('div');
            stepElement.className = 'step';
            stepElement.innerHTML = `<strong>Paso ${index + 1}:</strong> ${step}`;
            stepsContent.appendChild(stepElement);
        });
        stepsContainer.style.display = 'block';
    }
    
    // Mostrar solución si existe
    if (result.solution) {
        const solutionDiv = document.createElement('div');
        solutionDiv.style.marginTop = '15px';
        solutionDiv.innerHTML = `<strong>Solución:</strong><br>${result.solution.map((val, idx) => `x${idx+1} = ${val}`).join('<br>')}`;
        solutionText.appendChild(solutionDiv);
    }
    
    outputSection.style.display = 'block';
}