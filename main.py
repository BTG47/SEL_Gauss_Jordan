import numpy as np


def moverFilas(matriz_aumentada, indice_del_pivote, indice_de_la_matriz):
    fila_temporal = matriz_aumentada[indice_de_la_matriz].copy()
    matriz_aumentada[indice_de_la_matriz] = matriz_aumentada[indice_del_pivote]
    matriz_aumentada[indice_del_pivote] = fila_temporal
    print("Fila tras ser movida:")
    print(matriz_aumentada)
    return matriz_aumentada


def generar_columna_actual(matriz_aumentada, columna, tamano):
    columna_actual = []  # Declarar la columna de forma vacía
    for i in range(tamano):  # filas
        columna_actual.append(matriz_aumentada[i][columna])

    print("\nColumna actual:")
    print(columna_actual)
    return columna_actual

# Entre candidatos para el pivot, preferir el de mayor magnitud PERO con penalización por ser muy pequeño


def puntaje(valor_abs):
    if valor_abs < 0.1:
        return valor_abs * 0.1  # Penalizar valores muy pequeños
    elif valor_abs > 100:
        return valor_abs * 0.5  # Penalizar valores muy grandes ligeramente
    else:
        return valor_abs

# Función para obtener el pivote, tabmién usa puntaje(valor_abs)


def obtener_pivote(columna, fila_actual, tolerancia):
    # Para cubrir todos los casos de pivote, se deben de consdierar 3 clave, el caso donde todos son decimales,
    # todos son enteros, y hay tanto enteros como decimales. Se tendrá siempre preferencia a los enteros
    # para evitar carry, aunque en casos extremos, se tendrá como referencia cual es más cercan a uno.

    # Obtener la columna donde se va a obtener el pivote
    # De esta manear considera los valores en esa fila y las de abajo
    sub_columna = columna[fila_actual:]

    # El primer paso es obtener un 1 para el pivote, siendo el caso ideal, ya que pueden haber elementos tras decimales muy cercanos a uno
    # Como 0.9999 o 1.0001 debido a una división o multiplicación, se tomará un umbral de error (la variable de tolerancia)

    # Caso 1: hay un 1 ideal
    for i, valor in enumerate(sub_columna):
        valor_actual = abs(valor) - 1.0  # En teoría si es 1, debe de dar 0
        if abs(valor_actual) < tolerancia:  # Si es menor, encontramos nuestro 1 ideal
            return fila_actual + i, valor  # Regresamos el indice y valor

    # Si no hay un 1 ideal, obtener cuales son los números enteros más cercanos a 1, para ello se usó un rango, de 0.5 a 10
    enteros_seguros = []
    for i, valor in enumerate(sub_columna):
        if abs(valor) > tolerancia:  # no es igual a 0
            if int(valor) and 0.5 < abs(valor) < 10:
                enteros_seguros.append((fila_actual + i, valor, abs(valor)))

    # Caso 2: si hay enteros seguros (no mayores a 10)
    if enteros_seguros:
        # Elegir el mínimo
        # lambda x: x[2] eligé la tercera columna (la de valores absolutos)
        indice, valor_minimo, abs_minimo = min(
            enteros_seguros, key=lambda x: x[2])
        return indice, valor_minimo

    # Caso 3: Si solo quedan números mayores a 10 y decimales pequeños: usar un sistema de puntajes
    # Cada uno tiene un puntaje con base a que tan cercano están del 1

    # Primer obtener los candidatos confirmando que no son igual a 0
    candidatos = []
    for i, valor in enumerate(sub_columna):
        if abs(valor) > tolerancia:
            candidatos.append((fila_actual + i, valor, abs(valor)))
    # Si no hay candidatos, la columna es de puros ceros
    if not candidatos:
        print("No hay un uno en la posición")
        return None, None

    # Entre los candidatos, elegir el más cercano a uno, usar un sistema de puntaje para evaluar
    candidatos.sort(key=lambda x: puntaje(x[2]), reverse=True)
    return candidatos[0][0], candidatos[0][1]


def normalizar_pivote(matriz_aumentada, indice_del_pivote, valor_del_pivote):

    matriz_aumentada[indice_del_pivote] = matriz_aumentada[indice_del_pivote] * \
        (1/valor_del_pivote)
    return matriz_aumentada


def confirmar_posicion_del_pivote(matriz_aumentada, indice_del_pivote, columna_actual, numero_de_fila_o_columna_actual):

    # En este punto se conoce el pivote
    # Saber si este pivote esta de forma escalonada
    matriz_base = matriz_aumentada
    if indice_del_pivote != numero_de_fila_o_columna_actual:  # NO se encuentra en su posición adecuada
        print("Moviendo fila...")
        matriz_base = moverFilas(
            matriz_aumentada, indice_del_pivote, numero_de_fila_o_columna_actual)
    return matriz_base


def eliminar_el_resto_de_valores_tanto_arriba_como_abajo_del_pivote(matriz_aumentada, indice_del_pivote, numero_de_fila_o_columna_actual, tamano):
    fila_del_pivote = matriz_aumentada[indice_del_pivote]
    for i in range(tamano):
        if i != indice_del_pivote:  # Asegurar que no se elimné a sí misma la fila
            valor_indice_de_esa_fila = matriz_aumentada[i][numero_de_fila_o_columna_actual]
            matriz_aumentada[i] = matriz_aumentada[i] + \
                (-valor_indice_de_esa_fila)*fila_del_pivote
    return matriz_aumentada


def limpiar_errores_numericos(matriz, tolerancia=1e-10):
    # Convierte valores muy cercanos a cero en cero exacto
    return np.where(np.abs(matriz) < tolerancia, 0, matriz)


def gaussJordan(matriz_base, matriz_resultados, tamano, tolerancia=1e-10):

    # Convertir a float explícitamente
    matriz_base = matriz_base.astype(float)
    matriz_resultados = matriz_resultados.astype(float)
    # Generar matriz aumentada para hacer los cambios de filas
    matriz_aumentada = np.column_stack((matriz_base, matriz_resultados))

    for n in range(tamano):
        print(f"Iteración {n}:\n")
        columna_actual = generar_columna_actual(matriz_aumentada, n, tamano)
        indice_del_pivote, pivote_actual = obtener_pivote(
            columna_actual, n, tolerancia=tolerancia)
        print("Pivote actual:")
        print(pivote_actual)
        print("Indice del pivote:")
        print(indice_del_pivote)
        if (pivote_actual == None):
            continue
        matriz_confirmada = confirmar_posicion_del_pivote(
            matriz_aumentada, indice_del_pivote, columna_actual, n)
        print("Normalizando Matriz...")
        matriz_normalizada = normalizar_pivote(
            matriz_confirmada, n, pivote_actual)
        print(matriz_normalizada)
        print("Eliminando...")
        matriz_tras_eliminacion = eliminar_el_resto_de_valores_tanto_arriba_como_abajo_del_pivote(
            matriz_normalizada, n, n, tamano)
        print(matriz_tras_eliminacion)
        matriz_aumentada = matriz_tras_eliminacion
        print("Matriz aumentada tras los cambios")
        print(matriz_aumentada)
        print("Matriz tras eliminar los valores más cercanos a cero")
        matriz_aumentada = limpiar_errores_numericos(
            matriz_aumentada, tolerancia=tolerancia)
        print(matriz_aumentada)

    return matriz_aumentada


def main():
    tamano = 4
    matriz_base = np.array(
        [[-0.35, 0.3, 0.3, 0.2], [0.1, -0.9, 0.15, 0.1], [0.25, 0.35, -0.85, 0.3], [0, 0.25, 0.4, -0.6]], dtype=float)
    matriz_con_los_valores_de_resultado = np.array([0, 0, 0, 0], dtype=float)
    matriz_aumentada = np.column_stack(
        (matriz_base, matriz_con_los_valores_de_resultado))
    print(matriz_aumentada)
    matriz_final = gaussJordan(
        matriz_base, matriz_con_los_valores_de_resultado, tamano, 1e-10)
    print("Matriz final:")
    print(matriz_final)


if __name__ == "__main__":
    main()
