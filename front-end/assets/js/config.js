const API_URL = 'https://vitalkali-sistema.up.railway.app';

// config.js
// Centraliza as configurações do sistema.
// Quando você subir o backend no Railway, troca a URL aqui — um lugar só.
 
const CONFIG = {
  // Durante o desenvolvimento, aponta para o servidor local.
  // Quando fizer o deploy no Railway, troca para a URL real.
  API_URL: 'http://localhost:3000',
 
  // Nome da chave onde o token JWT será salvo no navegador.
  // O token fica no localStorage — uma memória do navegador que persiste
  // mesmo depois de fechar a aba.
  TOKEN_KEY: 'vitalkali_token',
 
  // Nome da chave onde os dados do usuário logado ficam salvos.
  USER_KEY: 'vitalkali_user',
};
 