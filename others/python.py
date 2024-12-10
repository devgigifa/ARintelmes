# Exemplo de comentário de uma linha
"""Exemplo de
Comentário de
muitas linhas"""

# Atribuição de váriavel primitiva
nome = "João"
cargo = 'Programador'
idade = 30
peso = 75.5
esta_ligado = True
VARIAVEL_CONSTANTE = "Exemplo de variavel"

# Atribuição de váriavel composta
# Dict {chave : valor}
endereco = {
    "rua": "Rua das Flores",
    "numero": 123,
    "cidade": "São Paulo",
    "estado": "SP",
    "possui_morador" : True
}

compras = ['maçã', 'banana', 'pão', 'leite']  #Lista mutável
exemplo_tupla = ('maçã', 'banana', 'pão', 'leite')  #Tupla imutável

conjunto_a = {1, 2, 3, 4, 5}  #Set
conjunto_b = {3, 4, 5, 6, 7}  #Set

# Saída de dados
print(compras)
print(endereco)
print(nome)

# Entrada de dados
nome = input("Digite seu nome: ")
print(nome)

# Operadores aritméticos
soma = 10 + 5
subtracao = 10 - 5
multiplicacao = 10 * 5
divisao = 10 / 5
divisao_inteira = 10 // 5
modulo = 10 % 5
exponenciacao = 10**5

# Operadores relacionais
maior_que = 10 > 5
menor_que = 10 < 5
maior_ou_igual = 10 >= 5
menor_ou_igual = 10 <= 5
igual = 10 == 5
diferente = 10 != 5

# Operadores lógicos
and_operador = True and False
or_operador = True or False
not_operador = not True

# Operadores de atribuição
x = 5
x += 3  # x = x + 3
x -= 3  # x = x - 3
x *= 3  # x = x * 3
x /= 3  # x = x / 3
x %= 3  # x = x % 3
x //= 3  # x = x // 3
x **= 3  # x = x ** 3

# Operadores de pertencimento
in_operador = 'banana' in compras
not_in_operador = 'banana' not in compras

# Condicionais simples
if idade >= 0:
  print("Idade válida")

# Condicionais compostas
if idade >= 18:
  print("Maior de idade")
else:
  print("Menor de idade")

# Condicionais aninhadas
if idade >= 0:
  if peso >= 18:
     print("Maior de idade")
  else:
    print("Menor de idade")
else:
  print("Idade inválida")

# Condicionais encadeadas
if idade >= 18:
  print("Maior de idade")
elif idade >= 12:
  print("Você é adolecente")
else:
  print("Você é criança")

# Condicionais encadeadas com operadores lógicos
if (idade >= 18) and (peso >= 60):
  print("Maior de idade e peso ideal")
elif idade >= 18 and peso < 60:
  print("Maior de idade e peso abaixo do ideal")
elif idade < 18 and peso >= 60:
  print("Menor de idade e peso ideal")
else:
  print("Menor de idade e peso abaixo do ideal")

# Repetição com for
for item in compras:
  print(item)

# Repetição com while
contador = 0
while contador < 5:
  print(contador)
  contador += 1


##########################


# Função sem parâmetros
def saudacao():
  print("Olá, mundo!")

# Função com parâmetros
def soma(a, b):
  print(a + b)

# Função com retorno e parâmetros
def multiplicacao(a, b):
  return a * b

# Função com retorno e sem parâmetros
def divisao():
  numero = int(input("Digite um número: "))
  return numero / 2

# Função recursiva
def fibonacci(n1, n2=0):
  resultado = n1 + n2
  print(resultado)
  if resultado > 300:
    return resultado
  else:
    fibonacci(n2, resultado)


# Chamando as funções
saudacao()

soma(10, 5)

resultado = multiplicacao(10, 5)

print(resultado)

resultado = divisao()

print(resultado)

fibonacci(1)


