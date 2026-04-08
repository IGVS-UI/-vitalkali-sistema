// auth.js
// Este arquivo é o "guardião da sessão".
// NENHUMA outra parte do sistema mexe no token diretamente —
// tudo passa por aqui. Isso evita bugs difíceis de achar.

const Auth = {

  // Salva o token e os dados do usuário após o login bem-sucedido.
  // O token é uma "chave" que o backend gera para identificar você.
  salvarSessao(token, usuario) {
    localStorage.setItem(CONFIG.TOKEN_KEY, token);
    localStorage.setItem(CONFIG.USER_KEY, JSON.stringify(usuario));
  },

  // Lê o token salvo. Retorna null se não existir (usuário não logado).
  getToken() {
    return localStorage.getItem(CONFIG.TOKEN_KEY);
  },

  // Lê os dados do usuário logado (nome, perfil, email).
  getUsuario() {
    const dados = localStorage.getItem(CONFIG.USER_KEY);
    // JSON.parse converte o texto salvo de volta para um objeto JavaScript.
    return dados ? JSON.parse(dados) : null;
  },

  // Verifica se existe um token salvo — ou seja, se o usuário está logado.
  estaLogado() {
    return this.getToken() !== null;
  },

  // Apaga tudo e redireciona para o login.
  // Chamado quando o usuário clica em "Sair" ou o token expira.
  logout() {
    localStorage.removeItem(CONFIG.TOKEN_KEY);
    localStorage.removeItem(CONFIG.USER_KEY);
    window.location.href = '/login.html';
  },

  // Protege uma página: se o usuário não estiver logado, manda para o login.
  // Chame essa função no topo de cada página protegida (painel, agenda, etc).
  exigirLogin() {
    if (!this.estaLogado()) {
      window.location.href = '/login.html';
    }
  },

  // Verifica se o usuário logado tem o perfil necessário.
  // Exemplo: exigirPerfil('admin') redireciona se não for administradora.
  exigirPerfil(perfilNecessario) {
    const usuario = this.getUsuario();
    if (!usuario || usuario.perfil !== perfilNecessario) {
      window.location.href = '/login.html';
    }
  },
};
