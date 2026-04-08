// api.js
// Centraliza TODAS as chamadas ao backend (Railway).
// As páginas nunca chamam fetch() diretamente — elas usam este arquivo.
// Vantagem: se a URL mudar ou precisar adicionar um cabeçalho, muda aqui só.

const Api = {

  // Método base que todos os outros usam.
  // Monta a requisição com o token JWT no cabeçalho automaticamente.
  async _request(endpoint, opcoes = {}) {
    const token = Auth.getToken();

    // O cabeçalho 'Authorization' é como o backend reconhece quem está fazendo
    // a requisição. O padrão é "Bearer " + o token.
    const cabecalhos = {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...opcoes.headers,
    };

    try {
      const resposta = await fetch(`${CONFIG.API_URL}${endpoint}`, {
        ...opcoes,
        headers: cabecalhos,
      });

      // Se o backend retornar 401, o token expirou ou é inválido.
      // Desloga o usuário automaticamente.
      if (resposta.status === 401) {
        Auth.logout();
        return;
      }

      // Converte a resposta de JSON para objeto JavaScript.
      const dados = await resposta.json();

      // Se o backend indicar erro (ex: senha errada), lança uma exceção
      // com a mensagem que o backend enviou.
      if (!resposta.ok) {
        throw new Error(dados.mensagem || 'Erro ao comunicar com o servidor.');
      }

      return dados;

    } catch (erro) {
      // Relança o erro para que a página que chamou possa tratar.
      throw erro;
    }
  },

  // ─── Autenticação ───────────────────────────────────────────

  // Envia email e senha para o backend, recebe o token de volta.
  async login(email, senha) {
    return this._request('/api/login', {
      method: 'POST',
      body: JSON.stringify({ email, senha }),
    });
  },

  // ─── Aulas ─────────────────────────────────────────────────

  // Busca todas as aulas da semana (para a administradora).
  async getAulasSemana() {
    return this._request('/api/aulas/semana');
  },

  // Busca apenas as aulas do aluno logado.
  async getMinhasAulas() {
    return this._request('/api/aulas/minhas');
  },

  // ─── Agendamentos ───────────────────────────────────────────

  // Cria um novo agendamento para o aluno.
  async criarAgendamento(dadosAgendamento) {
    return this._request('/api/agendamentos', {
      method: 'POST',
      body: JSON.stringify(dadosAgendamento),
    });
  },

  // Solicita remarcação de uma aula.
  async solicitarRemarcacao(agendamentoId, novoHorario, motivo) {
    return this._request(`/api/agendamentos/${agendamentoId}/remarcar`, {
      method: 'PUT',
      body: JSON.stringify({ novoHorario, motivo }),
    });
  },

  // ─── Pré-cadastro (aluno novo) ──────────────────────────────

  // Envia os dados do formulário de aula experimental.
  // Essa rota não precisa de token — é pública.
  async cadastrarAlunNovo(dados) {
    return this._request('/api/pre-cadastro', {
      method: 'POST',
      body: JSON.stringify(dados),
    });
  },
};