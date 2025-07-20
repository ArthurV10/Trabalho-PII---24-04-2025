// Função principal para configurar os botões e formulários da seção de posts
function setupPostSection() {
    const overlayInserirPost = document.getElementById('overlay-inserir-post');
    const btnAbrirForm = document.getElementById('btn-abrir-form-post');
    const btnCancelarPost = document.getElementById('btn-cancelar-post');
    const formNovoPost = document.getElementById('form-novo-post');
    const btnFecharPostagens = document.getElementById('fechar-postagens');

    // O botão "Fechar" chama a função `fecharTela` que está no main.js
    if (btnFecharPostagens) {
        btnFecharPostagens.addEventListener('click', () => fecharTela('postagens'));
    }

    // O botão "Inserir Post" abre o formulário
    if (btnAbrirForm) {
        btnAbrirForm.addEventListener('click', () => {
            if (overlayInserirPost) overlayInserirPost.style.display = 'flex';
        });
    }

    // Função para fechar o formulário de inserção
    const fecharFormPost = () => {
        if (overlayInserirPost) {
            overlayInserirPost.style.display = 'none';
            if (formNovoPost) formNovoPost.reset();
        }
    };

    if (btnCancelarPost) {
        btnCancelarPost.addEventListener('click', fecharFormPost);
    }

    // Lógica para enviar o formulário de um novo post para a API
    if (formNovoPost) {
        formNovoPost.addEventListener('submit', async (event) => {
            event.preventDefault();
            const autor = document.getElementById('post-usuario').value;
            const titulo = document.getElementById('post-titulo').value;
            const conteudo = document.getElementById('post-conteudo').value;
            const id_secao = titulo.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

            const postParaSalvar = {
                id_secao: id_secao,
                titulo: titulo,
                conteudoHTML: conteudo,
                autor: autor
            };

            try {
                const response = await fetch('http://localhost:3000/api/posts', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(postParaSalvar),
                });
                if (!response.ok) throw new Error('Falha ao criar o post.');

                alert('Post criado com sucesso!');
                fecharFormPost();
                carregarPostsDaAPI(); // Recarrega os posts para mostrar o novo
            } catch (error) {
                console.error('Erro ao criar o post:', error);
                alert('Não foi possível criar o post.');
            }
        });
    }
}

// Função para carregar os posts da API e exibi-los
async function carregarPostsDaAPI() {
    const postContainer = document.querySelector('.post-container');
    const navList = document.querySelector('.sidebar-nav ul');
    if (!postContainer || !navList) return;

    try {
        const response = await fetch('http://localhost:3000/api/posts');
        if (!response.ok) throw new Error('Falha ao buscar posts da API.');
        const posts = await response.json();

        postContainer.innerHTML = '';
        navList.innerHTML = ''; // Limpa a lista de navegação

        posts.forEach(post => {
            // Adiciona item na navegação
            const navItem = document.createElement('li');
            navItem.innerHTML = `<a href="#${post.id_secao}">${post.titulo}</a>`;
            navList.appendChild(navItem);

            // Adiciona post no container
            let comentariosHTML = '';
            if (post.comentarios) {
                post.comentarios.forEach(comentario => {
                    comentariosHTML += `<div class="comentario"><strong>${comentario.autor}:</strong> ${comentario.texto}</div>`;
                });
            }
            const postElement = document.createElement('div');
            postElement.className = 'post';
            postElement.id = post.id_secao;
            postElement.innerHTML = `
                <h2>${post.titulo}</h2>
                ${post.conteudoHTML}
                <p class="data-autor">${post.data} - por ${post.autor}</p>
                <div class="comentarios">
                    <button class="toggle-comentarios">Mostrar Comentários</button>
                    <div class="area-comentarios" style="display: none;">
                        <div class="lista-comentarios">${comentariosHTML}</div>
                        <form class="form-comentario" data-postid="${post._id}">
                            <input type="text" class="input-autor-comentario" placeholder="Seu nome" required>
                            <input type="text" class="input-comentario" placeholder="Digite um comentário..." required>
                            <button type="submit">Comentar</button>
                        </form>
                    </div>
                </div>`;
            postContainer.appendChild(postElement);
        });

        adicionarEventListenersPosts();
    } catch (error) {
        console.error('Erro ao buscar posts:', error);
        postContainer.innerHTML = `<p style="color:red; text-align: center;">Falha ao carregar posts do servidor.</p>`;
    }
}

// Função para adicionar os eventos aos posts carregados dinamicamente (comentários)
function adicionarEventListenersPosts() {
    document.querySelectorAll('.toggle-comentarios').forEach(toggleBtn => {
        toggleBtn.addEventListener('click', () => {
            const areaComentarios = toggleBtn.nextElementSibling;
            const isHidden = areaComentarios.style.display === 'none';
            areaComentarios.style.display = isHidden ? 'block' : 'none';
            toggleBtn.textContent = isHidden ? 'Ocultar Comentários' : 'Mostrar Comentários';
        });
    });

    document.querySelectorAll('.form-comentario').forEach(formComentario => {
        formComentario.addEventListener('submit', async function(e) {
            e.preventDefault();
            const postId = this.dataset.postid;
            const autor = this.querySelector('.input-autor-comentario').value.trim();
            const texto = this.querySelector('.input-comentario').value.trim();

            if (autor && texto) {
                try {
                    const response = await fetch(`http://localhost:3000/api/posts/${postId}/comments`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ autor, texto })
                    });
                    if (!response.ok) throw new Error('Falha ao enviar comentário');

                    const listaComentarios = this.previousElementSibling;
                    const comentarioDiv = document.createElement('div');
                    comentarioDiv.className = 'comentario';
                    comentarioDiv.innerHTML = `<strong>${autor}:</strong> ${texto}`;
                    listaComentarios.appendChild(comentarioDiv);
                    this.reset();
                } catch (error) {
                    console.error("Erro ao comentar:", error);
                    alert("Não foi possível adicionar o comentário.");
                }
            }
        });
    });
}