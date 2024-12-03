# ARintelmes

Projeto em realidade aumentada para exibir informações de máquina de forma rápida e interativa.

- index.html → Página principal, elementos A-FRAME em realidade aumentada na camera com AR.js
- index.js → Script com endpoints

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
- testes no glitch
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
- main4 → aplicação com câmera fazendo requisições, com endpoints e formatação dos elementos ajustada

### testes
- teste2 → teste com javascript para mudar o tamanho da grandbox para se adaptar ao alongamento do modo vr e assim não prejudicar a exibição sem camera inicial
- teste6 → versão anterior da main4 sem gauges
- teste8 → versão de modificação da main4
- testServer → teste para aplicar o proxy de segurança (axios, JSON)

<!-- ## Bibliotecas:

- npm i express
- npm init -y
- npm config set strict-ssl false
- npm install express axios
- node proxy.js -->

<!-- api numero
fetch("https://www.random.org/integers/?num=1&min=0&max=1000&col=1&base=10&format=plain&rnd=new")
 -->


D0:EF:76:44:87:5F
D0:EF:76:44:88:EB
D0:EF:76:44:93:E7
D0:EF:76:44:94:D3
D0:EF:76:44:9F:87
D0:EF:76:44:A6:6F
D0:EF:76:44:A8:5B
D0:EF:76:44:A8:A7
D0:EF:76:44:AE:73
D0:EF:76:44:C1:13
D0:EF:76:44:C4:EF
D0:EF:76:44:C8:87
D0:EF:76:44:CC:DF
D0:EF:76:44:CD:C7
D0:EF:76:44:D4:3F
D0:EF:76:45:37:67
D0:EF:76:45:38:2B
D0:EF:76:45:39:67
D0:EF:76:45:39:8F
D0:EF:76:45:3A:97
D0:EF:76:45:3F:27
D0:EF:76:45:42:1B
D0:EF:76:45:4B:13
D0:EF:76:45:52:5F
D0:EF:76:45:53:EB
D0:EF:76:45:54:37
D0:EF:76:45:6F:03
D0:EF:76:45:71:2F
D0:EF:76:45:79:6B
D0:EF:76:45:A1:DF
D0:EF:76:45:A8:07
D0:EF:76:45:AC:C7
D0:EF:76:45:AC:D3
D0:EF:76:45:B8:6B
D0:EF:76:45:BB:2F
D0:EF:76:45:BE:97
D0:EF:76:45:E8:FB
D0:EF:76:45:EA:A3
D0:EF:76:45:EA:DF
D0:EF:76:45:ED:DF
D0:EF:76:46:72:0B
D0:EF:76:46:72:3F
D0:EF:76:46:76:BB
D0:EF:76:46:79:9B
D0:EF:76:46:80:8F