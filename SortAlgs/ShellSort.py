def shell_sort(A, n):
    gap = n // 2

    while gap > 0:

        for i in range(gap, n):
            valor = A[i]
            j = i

            while j >= gap and A[j - gap] > valor:
                A[j] = A[j - gap]
                j -= gap

            A[j] = valor

        gap //= 2
    return A


A = [8, 3, 7, 4, 6, 2, 5, 1]
print(shell_sort(A, len(A)))
