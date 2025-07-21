// Funções Globais de Controle de Tela
function abrirTela(telaId) {
    const tela = document.getElementById('tela-' + telaId);
    const botaoFechar = document.getElementById('fechar-' + telaId);
    const tela_principal = document.getElementById('principal');
    const cabeçalho_blog = document.getElementById('cabeçalho_blog');
    const rodape_blog = document.getElementById('rodape');

    if (botaoFechar) botaoFechar.disabled = true;
    document.body.style.overflow = 'hidden';

    tela.style.display = 'block';

    tela.style.animation = 'none';
    void tela.offsetWidth;
    if (tela.id !== 'tela-postagens') {
        tela.style.animation = 'subirTela 0.4s ease-out forwards';
    }

    tela_principal.style.transition = 'opacity 0.4s';
    tela_principal.style.opacity = '0';
    cabeçalho_blog.style.transition = 'opacity 0.4s';
    cabeçalho_blog.style.opacity = '0';
    rodape_blog.style.transition = 'opacity 0.4s';
    rodape_blog.style.opacity = '0';

    setTimeout(() => {
        tela_principal.style.display = 'none';
        cabeçalho_blog.style.display = 'none';
        tela.classList.add("abrindo");
    }, 400);

    tela.addEventListener('animationend', function handleAnimAbrir() {
        if (botaoFechar) botaoFechar.disabled = false;
        tela.removeEventListener('animationend', handleAnimAbrir);
    });
}

function fecharTela(telaId) {
    const tela = document.getElementById('tela-' + telaId);
    const botaoFechar = document.getElementById('fechar-' + telaId);

    if (botaoFechar) botaoFechar.disabled = true;

    if (tela.id !== 'tela-postagens') {
        tela.style.top = '50%';
        tela.style.left = '50%';
        tela.style.transform = 'translate(-50%, -50%)';
        tela.style.animation = 'descerTela 0.4s ease-out forwards';
        tela.addEventListener('animationend', () => handleAnim(tela));
    } else {
        handleAnim(tela);
    }
};

function handleAnim(tela) {
    tela.style.display = 'none';
    document.body.style.overflow = 'auto';
    tela.scrollTop = 0;
    tela.classList.remove("abrindo");
    void tela.offsetWidth;

    const tela_principal = document.getElementById('principal');
    const cabeçalho_blog = document.getElementById('cabeçalho_blog');
    const rodape_blog = document.getElementById('rodape');

    tela_principal.style.display = 'flex';
    cabeçalho_blog.style.display = 'block';
    rodape_blog.style.display = 'block';

    void tela_principal.offsetWidth;

    tela_principal.style.opacity = '1';
    cabeçalho_blog.style.opacity = '1';
    rodape_blog.style.opacity = '1';

    tela.removeEventListener('animationend', handleAnim);
}

// EVENT LISTENERS DO MENU PRINCIPAL

document.getElementById('botao_postagens').addEventListener('click', async () => {
    abrirTela('postagens');
    const conteudoPostagens = document.getElementById('conteudo-postagens');

    try {
        const response = await fetch('src/components/posts/posts.html');
        if (!response.ok) throw new Error('Falha ao carregar o HTML das postagens.');
        const html = await response.text();
        conteudoPostagens.innerHTML = html;

        // Agora, apenas chamamos as funções que foram importadas do posts.js
        setupPostSection();
        carregarPostsDaAPI();
        const filtroAutor = document.getElementById('filtro-autor');
        if (filtroAutor) {
            filtroAutor.addEventListener('change', function() {
                carregarPostsDaAPI(this.value);
            });
            carregarAutoresNoFiltro();
        }

    } catch (error) {
        console.error('Erro ao carregar postagens:', error);
        conteudoPostagens.innerHTML = '<p style="color:red;">Erro ao carregar a seção de postagens.</p>';
    }
});

document.getElementById('botao_autores').addEventListener('click', () => {
    abrirTela('autores');
    const conteudoAutores = document.getElementById('conteudo-autores');

    fetch('src/components/authors/authors.html')
        .then(response => response.text())
        .then(html => {
            conteudoAutores.innerHTML = html;
        })
        .catch(error => console.error('Erro ao carregar os autores:', error));

    document.getElementById('fechar-autores').addEventListener('click', () => fecharTela('autores'));
});

document.getElementById('botao_links').addEventListener('click', () => {
    const telaPreta = document.getElementById('tela-preta');
    telaPreta.classList.add('ativo');

    setTimeout(() => {
        window.location.href = "src/components/links/links.html";
    }, 500);
});