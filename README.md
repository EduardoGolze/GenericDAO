-O que é?
Um sistema simples para gerenciar informações em um banco de dados, como se fosse uma agenda digital. Você pode:

Cadastrar novos itens (ex: usuários, produtos)

Buscar informações salvas

Atualizar dados

Apagar registros

-------------------------------------------------------

-Como funciona?

Usa uma classe única que funciona para qualquer tipo de dado (não precisa reescrever código para cada tabela).

As datas são convertidas automaticamente (ex: quando você cadastra uma data, o sistema entende ela como um calendário).

Tem testes automáticos para garantir que tudo funciona corretamente.
-------------------------------------------------------

-Tecnologias usadas:

TypeScript (linguagem para organizar o código)

SQLite (banco de dados simples, salvo em um arquivo)

Jest (ferramenta para testar automaticamente)
-------------------------------------------------------

-Como testar?

Clone o projeto

Instale as dependências: npm install

Popule o banco de dados: npm run seed

Rode os testes: npm test
-------------------------------------------------------

-Decisões importantes:

Datas são salvas como texto e convertidas automaticamente para evitar erros.

O mesmo código funciona para diferentes tabelas (usuários, produtos, pedidos), evitando repetição.

Testes verificam apenas o essencial para garantir simplicidade.
-------------------------------------------------------

-Estrutura do projeto:
├── src/       # Código principal  
├── tests/     # Testes automáticos  
└── scripts/   # Configuração do banco de dados  
