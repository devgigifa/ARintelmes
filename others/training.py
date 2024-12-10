# Calculadora
repetidor = True
while repetidor:
    operacao = input('Qual operação deseja realizar: \n' +
                     '1 - soma \n' +
                     '2 - subtração \n' +
                     '3 - multiplicação \n' +
                     '4 - divisão \n')
    

# Verificação de operação válida
if operacao not in ['1', '2', '3', '4']:
    print('Opção inválida. Tente novamente.')
    continue

num1 = float(input('Digite o primeiro número: '))
num2 = float(input('Digite o segundo número: '))

if operacao == '1':
    print(f'O resultado da soma é: {num1 + num2}')
elif operacao == '2':
    print(f'O resultado da subtração é: {num1 - num2}')
elif operacao == '3':
    print(f'O resultado da multiplicação é: {num1 * num2}')
elif operacao == '4':
    if num2 != 0:
        print(f'O resultado da divisão é: {num1 / num2}')
    else:
        print('Não é possível dividir por zero!')

repetir = input('Deseja realizar outra operação? (s/n): ').lower()
if repetir != 's':
    repetidor = False
    print('Calculadora encerrada.')


# Verifica se o número é par ou ímpar
num = int(input('Digite um número para verificar se é par ou ímpar: '))
if num % 2 == 0:
    print(f'{num} é par')
else:
    print(f'{num} é ímpar')


# Conversor de Celsius para Fahrenheit
celsius = float(input('Digite a temperatura em Celsius: '))
fahrenheit = (celsius * 9/5) + 32
print(f'{celsius} graus Celsius correspondem a {fahrenheit} graus Fahrenheit.')


# Calculando a média aritmética
nota1 = float(input('Digite sua primeira nota: '))
nota2 = float(input('Digite sua segunda nota: '))
nota3 = float(input('Digite sua terceira nota: '))

media = (nota1 + nota2 + nota3) / 3
print(f'A média das notas é: {media:.2f}')


# Verifica o maior número
num1 = float(input('Digite o primeiro número: '))
num2 = float(input('Digite o segundo número: '))
num3 = float(input('Digite o terceiro número: '))

maior = max(num1, num2, num3)
print(f'O maior número é: {maior}')


# Verificador de ano bissexto
ano = int(input('Digite um ano para verificar se é bissexto: '))

if (ano % 4 == 0 and ano % 100 != 0) or (ano % 400 == 0):
    print(f'O ano {ano} é bissexto.')
else:
    print(f'O ano {ano} não é bissexto.')


# Calculadora de fatorial
import math

num = int(input('Digite um número para calcular o fatorial: '))

if num < 0:
    print('Fatorial de número negativo não existe.')
else:
    fatorial = math.factorial(num)
    print(f'O fatorial de {num} é: {fatorial}')


# Conversor de moeda
valor_dolares = float(input('Digite o valor em dólares: '))
valor_reais = valor_dolares * 5.50  # Supondo 1 USD = 5.50 BRL
print(f'{valor_dolares} dólares equivalem a {valor_reais:.2f} reais.')


# Contador de vogais e consoantes
frase = input('Digite uma frase: ').lower()
vogais = 'aeiou'
consoantes = 0
vogais_contadas = 0

for letra in frase:
    if letra in vogais:
        vogais_contadas += 1
    elif letra.isalpha():
        consoantes += 1

print(f'Vogais: {vogais_contadas}, Consoantes: {consoantes}')


# Gerador da sequência Fibonacci
num_terms = 300
a, b = 0, 1
print(f'Primeiros {num_terms} termos da sequência Fibonacci:')
for _ in range(num_terms):
    print(a, end=' ')
    a, b = b, a + b


# Verifica se a palavra é um palíndromo
palavra = input('Digite uma palavra para verificar se é um palíndromo: ').lower()
if palavra == palavra[::-1]:
    print(f'A palavra "{palavra}" é um palíndromo.')
else:
    print(f'A palavra "{palavra}" não é um palíndromo.')


# Calculadora de IMC
peso = float(input('Digite o seu peso (kg): '))
altura = float(input('Digite a sua altura (m): '))

imc = peso / (altura ** 2)
print(f'O seu IMC é: {imc:.2f}')


# Conversor de horas para segundos
horas = int(input('Digite o número de horas: '))
segundos = horas * 3600
print(f'{horas} horas equivalem a {segundos} segundos.')


# Jogo de adivinhação
import random

numero_aleatorio = random.randint(1, 100)
tentativas = 0
adivinhado = False

print('Tente adivinhar o número entre 1 e 100!')

while not adivinhado:
    palpite = int(input('Digite seu palpite: '))
    tentativas += 1
    if palpite < numero_aleatorio:
        print('O número é maior!')
    elif palpite > numero_aleatorio:
        print('O número é menor!')
    else:
        adivinhado = True
        print(f'Parabéns! Você acertou em {tentativas} tentativas.')


# Gerador de tabuada
numero = int(input('Digite um número para gerar sua tabuada: '))
for i in range(1, 11):
    print(f'{numero} x {i} = {numero * i}')


# Verificador de número primo
num = int(input('Digite um número para verificar se é primo: '))
if num < 2:
    print(f'O número {num} não é primo.')
else:
    primo = True
    for i in range(2, int(num ** 0.5) + 1):
        if num % i == 0:
            primo = False
            break
    if primo:
        print(f'O número {num} é primo.')
    else:
        print(f'O número {num} não é primo.')


# Cálculo da área de um círculo
import math

raio = float(input('Digite o raio do círculo: '))
area = math.pi * (raio ** 2)
print(f'A área do círculo com raio {raio} é: {area:.2f}')


# Conversor de minutos para horas e minutos
minutos = int(input('Digite o número de minutos: '))
horas = minutos // 60
minutos_restantes = minutos % 60
print(f'{minutos} minutos equivalem a {horas} horas e {minutos_restantes} minutos.')


# Cálculo de aumento salarial
salario = float(input('Digite o salário do funcionário: '))
porcentagem = float(input('Digite a porcentagem de aumento: '))

aumento = salario * (porcentagem / 100)
novo_salario = salario + aumento
print(f'O aumento será de R${aumento:.2f}, e o novo salário será R${novo_salario:.2f}.')


# Cálculo do preço final com desconto
preco = float(input('Digite o preço do produto: '))
desconto = float(input('Digite a porcentagem de desconto: '))

preco_final = preco - (preco * (desconto / 100))
print(f'O preço com desconto será R${preco_final:.2f}.')


# Calendário

import calendar
year = 2024
print(calendar.calendar(int(year)))
