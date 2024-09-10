document.addEventListener('DOMContentLoaded', () => {
    const progressBar = document.getElementById('progressBar');
    const form = document.getElementById('uploadForm');
    let eventSource;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const fileInput = document.getElementById('fileInput');
        const file = fileInput.files[0];

        if (!file) {
            alert('Por favor, selecione um arquivo antes de enviar.');
            return;
        }

        // Reinicializar a barra de progresso
        progressBar.style.width = '0%';
        progressBar.textContent = '0%';

        // Fecha o EventSource anterior se estiver aberto
        if (eventSource) {
            eventSource.close();
        }

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch('/tracking-correios/import', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Erro ao enviar o arquivo');
            }

            eventSource = new EventSource('/tracking-correios/progress');
            console.log('comecou a contar o progresso');

            eventSource.onmessage = (event) => {
                const data = JSON.parse(event.data);
                const progress = data.progress || 0;
                progressBar.style.width = `${progress}%`;
                progressBar.textContent = `${progress}%`;

                if (progress === 100) {
                    eventSource.close();
                }
            };

            eventSource.onerror = (error) => {
                console.error('Erro de conexão SSE', error);
                eventSource.close();
            };
        } catch (error) {
            console.error('Erro ao enviar o arquivo', error);
            alert('Ocorreu um erro ao enviar o arquivo. Por favor, tente novamente.');
        }
    });
});
