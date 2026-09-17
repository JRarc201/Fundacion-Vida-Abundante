const copyBtn = document.getElementById('copyBtn');
const accountNumber = document.getElementById('accountNumber');

copyBtn.addEventListener('click', async () => {
  const text = accountNumber.textContent.trim();

  try {
    // Método moderno: funciona en https y localhost
    await navigator.clipboard.writeText(text);
  } catch (err) {
    // Respaldo: crea un textarea invisible, lo selecciona y copia
    const temp = document.createElement('textarea');
    temp.value = text;
    document.body.appendChild(temp);
    temp.select();
    document.execCommand('copy');
    document.body.removeChild(temp);
  }

  // Feedback visual temporal
  copyBtn.classList.add('copied');
  copyBtn.textContent = '¡Copiado!';

  setTimeout(() => {
    copyBtn.classList.remove('copied');
    copyBtn.textContent = 'Copiar número de cuenta';
  }, 2000);
});