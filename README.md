# ARintelmes
teste requisição CORS: https://cors-anywhere.herokuapp.com/corsdemo

# AR com A-frame
Projeto em realidade aumentada para exibir informações de máquina de forma rápida e interativa.

## Objetivos:
- ler o qr code pela câmera do celular e redirecionar para o site.
- botões de status e manutenção clicáveis
- inserir caracteres especiais no texto
- ao abrir o site, aparecer aplicação (a-scene) em realidade aumentada, com fundo da câmera do celular via navegador
- redimensionar a a-scene corretamente
- ao clicar em status, aparecerá as informações de status da máquina direto da API
- ao clicar em maintenance, aparecerá as informações de manutenção da máquina direto da API
- conectar a aplicação com a API
- transformar as informações da máquina em realidade aumentada
- armazena no glitch cada um
- criar link pro AR de cada máquina
- gerar qr code

## Tecnologias:
- Javascript
- HTML
- A-FRAME
- AR.js

## Pastas

### path
É o caminho desenvolvido até a versão final.
- main9 → aplicação sem câmera pegando direto da API
- main8 → aplicação sem câmera fazendo uma requisição CORS temporária
- main7 → aplicação com/sem câmera pegando direto da API
- main6 → aplicação com/sem câmera fazendo uma requisição CORS temporária
- main5 → atual código, aplicação com câmera fazendo uma requisição CORS temporária, com estrutura quase pronta

### testes
- comentado → código comentado
- teste1 → fundo de foto
- teste2 → teste com javascript para mudar o tamanho da grandbox para se adaptar ao alongamento do modo vr e assim não prejudicar a exibição sem camera inicial
- teste3 → TESTANDO APLICAÇÃO COM O GAUGE não ta aparecendo os gauges o objetivo é aparecer os gauges
- teste4 → TESTANDO APLICAÇÃO COM O GAUGE não ta aparecendo os gauges o objetivo é no botão status aparecer a blackbox com os gauges
- testServer → teste para aplicar o proxy de segurança (axios, JSON)

<!-- ## Bibliotecas:

- npm i express
- npm init -y
- npm config set strict-ssl false
- npm install express axios
- node proxy.js -->