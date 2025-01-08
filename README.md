# ARintelmes

Projeto em realidade aumentada para exibir informações de máquina de forma rápida e interativa.

- index.html → Página principal, elementos A-FRAME em realidade aumentada na camera com AR.js
- index.js → Script com endpoints

## Objetivos:
- [x] Ler o QR Code pela câmera do celular e redirecionar para o site.
- [ ] Inserir caracteres especiais no texto.
- [x] Ao abrir o site, aparecer aplicação (a-scene) em realidade aumentada, com fundo da câmera do celular via navegador.
- [x] Redimensionar a a-scene corretamente.
- [x] Conectar a aplicação com a API.
- [x] Criar endpoints.
- [x] Transformar as informações da máquina em realidade aumentada.
- [ ] Testes no Glitch.
- [x] Endpoint dos gauges.
- [x] Endpoint das horas de funcionamento.
- [ ] Criar link para o AR de cada máquina.
- [ ] Gerar QR Code.

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
- main3 → aplicação com câmera fazendo requisições, com endpoints e formatação dos elementos ajustada, e casos específicos da máquina, código aprimorado

### testes
- checkpoint → última versão com tudo funcionando
- totest → versão para teste
- workarea → editando o código, arquivo para o desenvolvimento


