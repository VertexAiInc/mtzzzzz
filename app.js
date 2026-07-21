// Captura de elementos DOM principais
const loginBtn = document.getElementById('login-btn');
const getKeyBtn = document.getElementById('get-key-btn'); // Novo elemento
const keyInput = document.getElementById('key-input');
const loginScreen = document.getElementById('login-screen');
const mainMenu = document.getElementById('main-menu');

const EXPECTED_KEY = "KEYINJECTOR1";

// Ação do novo botão Get Key
getKeyBtn.addEventListener('click', function() {
    // Substitua a URL abaixo pelo link de redirecionamento desejado
    const urlDoEncurtador = "https://linkvertise.com/7671760/lfKtpqWvlY9B?o=sharing"; 
    window.open(urlDoEncurtador, '_blank');
});

// Gerenciador do sistema de login por chave
loginBtn.addEventListener('click', function() {
    if (keyInput.value.trim() === EXPECTED_KEY) {
        loginScreen.classList.add('hidden');
        mainMenu.classList.remove('hidden');
        showNotification("Acesso Autorizado!");
    } else {
        showNotification("Erro: Chave inválida.");
    }
});

// Mecanismo de troca de abas (Tabs)
const tabButtons = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

tabButtons.forEach(button => {
    button.addEventListener('click', function() {
        tabButtons.forEach(btn => btn.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));

        this.classList.add('active');
        const targetTab = this.getAttribute('data-tab');
        document.getElementById(targetTab).classList.add('active');
    });
});

// Eventos de ativação para as opções
const switches = document.querySelectorAll('.toggle-switch');
switches.forEach(item => {
    item.addEventListener('change', function() {
        const featureName = this.getAttribute('data-name');
        
        if (this.checked) {
            showNotification(`Injetando ${featureName}...`);
            
            setTimeout(() => {
                showNotification(`Injetado em com.dts.freefireth`);
            }, 1200);
        } else {
            showNotification(`${featureName}: Desativado.`);
        }
    });
});

// Função centralizada para exibir os Toasts flutuantes
function showNotification(message) {
    const container = document.getElementById('notification-container');
    const toast = document.createElement('div');
    toast.classList.add('toast');
    toast.innerText = message;
    
    container.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 2500);
}
