// cadastro.js
// Controla o formulário de cadastro de aluno novo.
// Página pública — não usa auth.js nem exige login.

document.addEventListener('DOMContentLoaded', () => {

  // ─── Referências aos elementos da tela ──────────────────────
  const form          = document.getElementById('form-cadastro');
  const btnEnviar     = document.getElementById('btn-enviar');
  const mensagemErro  = document.getElementById('mensagem-erro');
  const telaForm      = document.getElementById('form-cadastro');
  const telaSucesso   = document.getElementById('tela-sucesso');
  const botoesModal   = document.querySelectorAll('.modalidade-btn');

  // Guarda qual modalidade está selecionada.
  // Começa com 'pilates' pois o primeiro botão já tem a classe .ativa.
  let modalidadeSelecionada = 'pilates';

  // ─── Seleção de modalidade ───────────────────────────────────
  // Quando o usuário clica num botão de modalidade:
  // 1. Remove a classe .ativa de todos os botões
  // 2. Adiciona .ativa no botão clicado
  // 3. Atualiza a variável modalidadeSelecionada
  botoesModal.forEach(btn => {
    btn.addEventListener('click', () => {
      botoesModal.forEach(b => b.classList.remove('ativa'));
      btn.classList.add('ativa');
      modalidadeSelecionada = btn.dataset.modalidade;
      // dataset.modalidade lê o atributo data-modalidade do HTML
    });
  });

  // ─── Máscara de WhatsApp ─────────────────────────────────────
  // Formata o campo conforme o usuário digita: (11) 99999-9999
  // Isso melhora a experiência e já entrega o dado mais limpo.
  const campoWhatsapp = document.getElementById('whatsapp');
  campoWhatsapp.addEventListener('input', (e) => {
    let valor = e.target.value.replace(/\D/g, ''); // remove tudo que não é número
    if (valor.length > 11) valor = valor.slice(0, 11);

    // Aplica a máscara progressivamente conforme digita
    if (valor.length > 7) {
      valor = `(${valor.slice(0,2)}) ${valor.slice(2,7)}-${valor.slice(7)}`;
    } else if (valor.length > 2) {
      valor = `(${valor.slice(0,2)}) ${valor.slice(2)}`;
    }

    e.target.value = valor;
  });

  // ─── Envio do formulário ─────────────────────────────────────
  form.addEventListener('submit', async (evento) => {
    evento.preventDefault(); // impede o recarregamento da página

    // Coleta os valores dos campos
    const nome        = document.getElementById('nome').value.trim();
    const whatsapp    = document.getElementById('whatsapp').value.trim();
    const email       = document.getElementById('email').value.trim();
    const dia         = document.getElementById('dia').value;
    const periodo     = document.getElementById('periodo').value;
    const observacoes = document.getElementById('observacoes').value.trim();

    // ── Validação no front ────────────────────────────────────
    // Validação básica antes de chamar o backend.
    // Isso evita requisições desnecessárias e dá feedback imediato.
    if (!nome) {
      mostrarErro('Por favor, informe seu nome completo.');
      return;
    }
    if (!whatsapp || whatsapp.length < 14) {
      mostrarErro('Por favor, informe um WhatsApp válido.');
      return;
    }
    if (!email || !email.includes('@')) {
      mostrarErro('Por favor, informe um e-mail válido.');
      return;
    }
    if (!dia) {
      mostrarErro('Por favor, selecione o dia preferido.');
      return;
    }
    if (!periodo) {
      mostrarErro('Por favor, selecione o período preferido.');
      return;
    }

    // ── Monta o objeto de dados ───────────────────────────────
    // Esse objeto será convertido para JSON e enviado ao backend.
    const dadosCadastro = {
      nome,
      whatsapp,
      email,
      modalidade: modalidadeSelecionada,
      dia_preferido: dia,
      periodo_preferido: periodo,
      observacoes: observacoes || null, // null se vazio — mais limpo no banco
    };

    // ── Feedback visual de carregamento ──────────────────────
    setCarregando(true);
    esconderErro();

    try {
      // Chama api.js que faz o fetch para POST /api/pre-cadastro no Railway.
      // Essa rota é pública — não precisa de token JWT.
      await Api.cadastrarAlunoNovo(dadosCadastro);

      // Sucesso: esconde o form e mostra a tela de confirmação
      mostrarSucesso();

    } catch (erro) {
      // Backend retornou algum erro (ex: e-mail já cadastrado)
      mostrarErro(erro.message);
      setCarregando(false);
    }
  });

  // ─── Funções auxiliares ──────────────────────────────────────

  // Esconde o formulário e exibe a mensagem de sucesso.
  function mostrarSucesso() {
    telaForm.classList.add('d-none');
    telaSucesso.classList.remove('d-none');
  }

  function mostrarErro(mensagem) {
    mensagemErro.textContent = mensagem;
    mensagemErro.classList.remove('d-none');
    // Rola a página até a mensagem de erro para garantir que o usuário veja
    mensagemErro.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  function esconderErro() {
    mensagemErro.classList.add('d-none');
  }

  function setCarregando(carregando) {
    btnEnviar.disabled = carregando;
    btnEnviar.textContent = carregando
      ? 'Enviando...'
      : 'Quero minha aula gratuita';
  }

});