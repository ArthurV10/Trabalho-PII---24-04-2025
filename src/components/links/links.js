document.addEventListener('DOMContentLoaded', () => {
    const cartas = document.querySelectorAll('.carta-interativa');
    const popup = document.getElementById('popup');
    const popupConteudo = document.getElementById('popup-conteudo');

    function destacarTexto(texto, palavras) {
        palavras.forEach(palavra => {
            const regex = new RegExp(`(${palavra})`, 'gi');
            texto = texto.replace(regex, '<span class="destaque">$1</span>');
        });
        return texto;
    }

    cartas.forEach(carta => {
        carta.addEventListener('mouseenter', (e) => {
            popup.style.display = 'block';
            const palavrasParaDestacar = ['HTML', 'CSS', 'performance', 'compatibilidade'];
            const textoComDestaque = destacarTexto(carta.dataset.info, palavrasParaDestacar);
            popupConteudo.innerHTML = `<p>${textoComDestaque}</p>`;
        });

        carta.addEventListener('mousemove', (e) => {
            popup.style.top = (e.clientY + 10) + 'px';
            popup.style.left = (e.clientX + 10) + 'px';
        });

        carta.addEventListener('mouseleave', () => {
            popup.style.display = 'none';
        });

        carta.addEventListener('mousemove', (e) => {
            const rect = carta.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -25;
            const rotateY = ((x - centerX) / centerX) * 30;

            carta.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
            carta.style.animation = 'none';
        });

        carta.addEventListener('mouseleave', () => {
            carta.style.transform = 'rotateX(0deg) rotateY(0deg)';
            carta.style.transition = 'transform 0.3s ease';
            carta.style.animation = 'flutuar 3s ease-in-out infinite';
        });
    });

    document.querySelector('#botão-voltar').addEventListener('click', () => {
        const overlay = document.getElementById('overlay');
        overlay.style.visibility = 'visible';
        overlay.style.opacity = '1';

        setTimeout(() => {
            window.location.replace('../../../index.html');
        }, 1000);
    });
});