def counting_sort(A, n, exp):
    saida = [0] * n
    contagem = [0] * 10

    for i in range(n):
        digito = (A[i] // exp) % 10
        contagem[digito] += 1

    for i in range(1, 10):
        contagem[i] += contagem[i - 1]

    i = n - 1

    while i >= 0:
        digito = (A[i] // exp) % 10
        posicao = contagem[digito] - 1

        saida[posicao] = A[i]
        contagem[digito] -= 1

        i -= 1

    for i in range(n):
        A[i] = saida[i]


# Assume que todos os valores em A sao inteiros não negativos.
def radix_sort(A, n):
    if n <= 1:
        return A

    maior = A[0]

    for i in range(1, n):
        if A[i] > maior:
            maior = A[i]

    exp = 1

    while maior // exp > 0:
        counting_sort(A, n, exp)
        exp *= 10

    return A


A = [329, 45, 7, 839, 1436, 72, 20355]
print(radix_sort(A, len(A)))
