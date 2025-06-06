// Configura troca de tema (claro/escuro)
function setupThemeSwitcher() {
  const themeButtons = document.querySelectorAll('.theme-btn');
  
  themeButtons.forEach(button => {
    button.addEventListener('click', function() {
      const theme = this.getAttribute('data-theme');
      changeTheme(theme);
      
      // Atualiza botão ativo
      themeButtons.forEach(btn => btn.classList.remove('active'));
      this.classList.add('active');
    });
  });
  
  // Define tema padrão como ativo
  document.querySelector('[data-theme="default"]').classList.add('active');
}

// Altera o tema do site
function changeTheme(theme) {
  const body = document.body;
  
  // Remove classes de tema existentes
  body.classList.remove('theme-dark', 'theme-light');
  
  // Adiciona nova classe de tema, se não for o padrão
  if (theme !== 'default') {
    body.classList.add('theme-' + theme);
  }
}