# Guia do Projeto: MotoSync

## Descrição do Projeto

O MotoSync é um aplicativo para gestão de pátios, vagas e motos, permitindo o controle de alocação de motos em vagas, visualização de status, cadastro e edição de entidades. O app foi desenvolvido em React Native com Expo Router, utilizando armazenamento local (AsyncStorage) e mocks para dados iniciais.

---

## Estrutura do Projeto

```
src/
  app/
    Home.tsx
    Motos.tsx
    Participantes.tsx
    index.tsx
    Filial/
      [id_patio].tsx
      _layout.tsx
    _layout.tsx
  components/
    AddPatioButton.tsx
    AddVagaButton.tsx
    AddMotoButton.tsx
    DeletePatioButton.tsx
    Footer.tsx
    FormLogin.tsx
    Hamburger.tsx
    InputLogin.tsx
    MenuBar.tsx
    MotoDetailsModal.tsx
    MotoInfoModal.tsx
    SearchBarMoto.tsx
    SearchHome.tsx
    SearchVaga.tsx
    VagaInfoModal.tsx
  data/
    motosMock.json
    patiosMock.json
    vagasMock.json
  hooks/
    useColorScheme.ts
  global.css
```

---

## Páginas do App

### 0. `Ressalvas`

- **Função:** Todas as páginas possuem suporte para tema claro e escuro usando o hook `useColorScheme.ts`.

### 1. `index.tsx`

- **Função:** Tela de login do app.
- **Funcionalidades:**
  - Formulário de login com validação de e-mail e senha.
  - Exibição do logo.
  - Rodapé com link para a página de participantes.
  - Navegação para a página inicial após login.

### 2. `Home.tsx`

- **Função:** Tela inicial após login, exibe todos os pátios cadastrados, total de vagas e vagas disponíveis em cada pátio.
- **Funcionalidades:**
  - Busca por nome de pátio.
  - Botão para adicionar novo pátio.
  - Botão para deletar pátio (somente se o pátio não possui vagas).
  - Navegação para detalhes do pátio (vagas).
  - Atualização automática dos dados ao voltar para a tela.
  - Disponibilidade de usar o menu "Hamburger" para navegação.

### 3. `Motos.tsx`

- **Função:** Lista todas as motos cadastradas no sistema.
- **Funcionalidades:**
  - Busca por placa e modelo.
  - Visualização de detalhes da moto.
  - Edição e exclusão de motos.
  - Cadastro de novas motos (com validação em todos os campos).
  - Modal para detalhes e edição.

### 4. `Filial/[id_patio].tsx`

- **Função:** Exibe as vagas de um pátio específico.
- **Funcionalidades:**
  - Lista de vagas, filtragem por código e status (ocupada/disponível baseado em motos alocadas).
  - Cadastro de novas vagas (com validação de campos).
  - Visualização de detalhes da vaga (incluindo moto alocada caso tenha).
  - Exclusão de vagas (somente se a vaga não possui motos alocadas).
  - Atualização automática ao adicionar/excluir vagas ou motos.

### 5. `Participantes.tsx`

- **Função:** Exibe os participantes do projeto.
- **Funcionalidades:**
  - Lista com nome, RM, GitHub e LinkedIn dos integrantes.
  - Imagens e links clicáveis.
  - Botão para voltar à tela anterior.

---

## Componentes em `components/`

### - `AddPatioButton.tsx`

- Botão flutuante para abrir modal de cadastro de novo pátio.
- Validação de nome/endereço e duplicidade.

### - `AddVagaButton.tsx`

- Botão para adicionar nova vaga em um pátio.
- Modal com validação de código e duplicidade.

### - `AddMotoButton.tsx`

- Botão para cadastrar nova moto.
- Modal com validação de modelo, placa, pátio e vaga.
- Garante que o ID da moto seja sequencial.
- Atualização automática da lista de motos.
- Opção de colocar a moto em manutenção quando patio e vaga estão ocupadas.

### - `DeletePatioButton.tsx`

- Botão para deletar pátio (somente se o pátio não possui vagas).
- Modal de confirmação e validação se o pátio possui vagas.

### - `Footer.tsx`

- Rodapé com botão para acessar a página de participantes.

### - `FormLogin.tsx`

- Formulário de login com campos de e-mail e senha.
- Usa o componente `InputLogin` e botão de login.

### - `Hamburger.tsx`

- Menu lateral animado.
- Navegação entre páginas principais e logout.

### - `InputLogin.tsx`

- Campo de input customizado para o formulário de login.
- Validação de campos.
- Botão de visualização de senha.

### - `MenuBar.tsx`

- Barra superior com título e botão para abrir o menu lateral.

### - `MotoDetailsModal.tsx`

- Modal para visualizar e editar detalhes de uma moto específica.
- Validação de campos e status dinâmico (manutenção/disponível).

### - `MotoInfoModal.tsx`

- Modal para exibir informações detalhadas de uma moto específica.

### - `SearchBarMoto.tsx`

- Barra de busca para filtrar motos por placa ou modelo e botões de filtragem (alugada/disponível/manutenção).

### - `SearchHome.tsx`

- Barra de busca para filtrar pátios por nome.

### - `SearchVaga.tsx`

- Barra de busca por código da vaga e botões de filtragem de status para vagas (ocupada/disponível).

### - `VagaInfoModal.tsx`

- Modal para exibir informações detalhadas de uma vaga e da moto alocada (se houver).

---

## Hooks em `hooks/`

### - `useColorScheme.ts`

- Hook customizado para detectar o tema do sistema operacional (claro/escuro).
- Usado para adaptar cores e estilos em todo o app.

---

## Dados Mock em `data/`

### - `patiosMock.json`

- Lista inicial de pátios para popular o app na primeira execução.

### - `vagasMock.json`

- Lista inicial de vagas, associadas a pátios para popular o app na primeira execução.

### - `motosMock.json`

- Lista inicial de motos, associadas a vagas e pátios para popular o app na primeira execução.

---

## Observações

- O app utiliza **AsyncStorage** para persistência local dos dados de pátios, vagas e motos.
- Sempre que uma entidade é adicionada, editada ou removida, os dados são recarregados automaticamente para garantir atualização em tempo real.
- O layout é responsivo e adaptado para tema claro e escuro.
- O código segue boas práticas de separação de responsabilidades e reutilização de componentes.

## Implementações de Futuras

- **Autenticação:** Implementar sistema de login com autenticação de usuário com o uso de Auth na API.
- **API:** Utilizar uma API para persistência de dados, permitindo acesso remoto e sincronização entre dispositivos.
- **Usuários:** Implementar sistema de usuários com permissões e controle de acesso (sendo a aplicação mostrada agora apenas para administradores do Software. Futuramente incluiremos administradores de pátios sem funções administrativas, como adicionar e remover pátios, vagas e motos. Apenas gerenciar vagas e motos).

---

## Como rodar o projeto

1. Instale as dependências:

   ```bash
   npm install
   ```

2. Inicie o app:

   ```bash
   npx expo start
   ```

3. Siga as instruções do Expo para rodar no emulador ou dispositivo.

4. Ao iniciar o app, você verá a tela de login.

5. Antes de fazer o login, você pode entrar na página de participantes para ver os integrantes do projeto, tendo como disponível abaixo das fotos dos integrantes os links para os seus respectivos perfis no GitHub e LinkedIn.

6. Faça login com as credenciais de administrador (email: `user123@mottu.com` e senha: `12345@`), perfil para ter visão do app como administrador do software.

7. Você cairá na tela inicial do app, onde poderá ver e gerenciar os pátios. Coisas que você pode reparar nessa página é a barra de pesquisa na parte superior da tela que permite você buscar um pátio pelo seu nome. No container dos pátios, ele mostra o nome, o endereço, a quantidade total de vagas e quantas vagas estão disponíveis naquele pátio. Primeiro, tente adicionar um pátio e seu endereço (Pode caçar excessão, aqui nós pensamos em tudo).

8. Agora que você adicionou um pátio, você pode clicar nele e adicionar uma vaga a ele clicando em "Adicionar Vaga" (Se você reparar, na hora que você criou o pátio, ele veio com 0 vagas e 0 vagas disponíveis). No "Código da Vaga", o sistema reconhece uma letrar seguida por dois números, como "A01".

9. Agora que você adicionou uma vaga, você pode ver que ela apresenta a cor verde e o status "Disponível". Ao clicar nela, você verá que ela apresenta mais informações, como o seu código, o id da vaga, o status da vaga, a mensagem "Nenhuma moto nessa vaga" e a possibilidade de excluir ela (mas no momento não nos interessa excluir a vaga).

10. Agora que você adicionou uma vaga, você pode adicionar uma moto a ela. -Beleza, mas como faço isso? -Bem, você clica nas três barrinhas no canto superior esquerdo da tela que em seguida ele abrirá um menu lateral, onde você pode clicar em "Patios", "Motos" ou "Sair". Nesse momento, você deverá clicar em "Motos" e você será redirecionado para a tela de motos.

11. Agora que você está na tela de motos, você pode visualizar por cima as motos que temos, vendo o id, a placa e identificando pela borda da moto se ela está disponível (borda verde), alugada (borda vermelha) ou em manutenção (borda laranja), podendo filtra-las por placa e modelo na barra de pesquisa ou filtrar pelo status pelos botões que aparecem abaixo da barra de pesquisa.

12. Clique em uma moto para ver mais informações sobre ela. Você verá o id, a placa, o status (disponível, alugada ou em manutenção), o pátio, o código da vaga e o modelo. Se não estiver mostrando o código da vaga e nem o pátio, é porque ela não está alocada em nenhuma vaga e em nenhum pátio, com isso, presumimos que ela está alugada por algum cliente da mottu. Por isso o status da moto será "alugada".

13. Ainda nesse menuzinho aberto, você pode clicar em "Editar" para editar as informações da moto, como o modelo, a placa, pátio e o código da vaga (O status da moto será atualizado de acordo com as informações preenchidas. Enquanto pátio e vaga estiverem vazios "manutenção" e "disponível" não viram opções de status).

14. Saindo das informações da moto, você pode clicar em "Adicionar Moto" na parte inferior da tela para adicionar uma moto. Preencha os campos modelo ("pop", "sport" ou "e"), placa (modelo antigo:"AAA0000" ou modelo mercosul:AAA0A00), pátio (caso ela esteja em algum pátio preencha com os nomes existentes) e vaga (caso esteja em uma vaga preencha com uma letra e dois números "A01"). Clique em "Salvar" (Lembrando, pode caçar excessão, aqui nós pensamos em tudo).

15. Após adicionar uma moto, você pode ver que ela tem um icone de lixeira no seu canto direito, que ao clicar nela, você pode excluir a moto a partir de uma janela de confirmação.

16. Se você cadastrou uma moto numa vaga, imagino que você queira ver se essa moto realmente está naquela vaga, certo? Para isso, você deve voltar para a tela de pátios abrindo o menu pelas 3 barrinhas no canto superior esquerdo novamente e clicando em "Patios". Agora que está na tela de pátios deve clicar no pátio da vaga que você cadastrou a moto. Você verá que a vaga que antes aparecia como disponível, agora está como alugada e vermelha.

17. Ao clicar na vaga, você verá as informações da vaga, como o código, o status e as informações da moto que está na vaga (id, placa, modelo e status). Um detalhe é que você não pode excluir essa vaga, pois ela está sendo occupada por uma moto.

18. Voltando para o menu, você pode observar que o pátio que você havia adicionado a moto aparece com o campo "Vagas Disponíveis" preenchido com 1 número a menos do que antes de adicionar a moto, pois agora você ocupou uma vaga naquele pátio.

19. Após isso, você pode clicar nas três barrinhas no canto superior esquerdo que abre o menu e clicar em "Sair" para sair desta conta e voltar para a tela de login.

20. Pronto, aqui você teve uma dimenção sobre todas as funcionalidades do app. Deixe seu feedback e nos ajude a melhorar o app!

---

## Créditos

Desenvolvido por:

- Guilherme Britto -RM558475
- Thiago Mendes -RM555352
- Vinicius Banciela -RM558117

---
