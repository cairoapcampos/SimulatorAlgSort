def heapify(A, n, i):
    maior = i

    esquerda = 2 * i + 1
    direita = 2 * i + 2

    if esquerda < n and A[esquerda] > A[maior]:
        maior = esquerda

    if direita < n and A[direita] > A[maior]:
        maior = direita

    if maior != i:
        A[i], A[maior] = A[maior], A[i]

        heapify(A, n, maior)


def heap_sort(A, n):
    for i in range(n // 2 - 1, -1, -1):
        heapify(A, n, i)

    for i in range(n - 1, 0, -1):
        A[0], A[i] = A[i], A[0]

        heapify(A, i, 0)

    return A


A = [8, 3, 7, 4, 6, 2, 5, 1]
print(heap_sort(A, len(A)))
