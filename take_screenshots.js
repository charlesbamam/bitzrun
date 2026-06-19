const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const PRINTS_DIR = path.join(__dirname, 'prints');
if (!fs.existsSync(PRINTS_DIR)) {
  fs.mkdirSync(PRINTS_DIR, { recursive: true });
}

function delay(time) {
  return new Promise(resolve => setTimeout(resolve, time));
}

async function clickByText(page, text) {
  console.log(`Buscando elemento com texto: "${text}" para clicar por coordenadas...`);
  const coords = await page.evaluate((txt) => {
    const elements = Array.from(document.querySelectorAll('*'));
    const targetTxt = txt.trim().toLowerCase();
    
    const candidates = elements.filter(el => {
      if (el.tagName === 'SCRIPT' || el.tagName === 'STYLE') return false;
      if (!el.textContent) return false;
      const t = el.textContent.trim().toLowerCase();
      return t === targetTxt || t.includes(targetTxt);
    });
    
    if (candidates.length > 0) {
      candidates.sort((a, b) => a.textContent.length - b.textContent.length);
      
      for (const target of candidates) {
        const rect = target.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0 && rect.top >= 0 && rect.left >= 0) {
          return {
            x: rect.left + rect.width / 2,
            y: rect.top + rect.height / 2
          };
        }
      }
    }
    return null;
  }, text);
  
  if (!coords) {
    throw new Error(`Não foi possível encontrar o elemento ou obter coordenadas válidas para: "${text}"`);
  }
  
  console.log(`Clicando fisicamente em: x=${coords.x}, y=${coords.y} (${text})`);
  await page.mouse.move(coords.x, coords.y);
  await page.mouse.click(coords.x, coords.y);
}

(async () => {
  console.log('Iniciando o navegador...');
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  
  page.on('dialog', async dialog => {
    console.log('Dialog detectado e aceito:', dialog.message());
    await dialog.accept();
  });

  await page.setViewport({
    width: 390,
    height: 844,
    deviceScaleFactor: 2
  });

  console.log('Acessando Bitzrun local...');
  try {
    await page.goto('http://localhost:8081/', { waitUntil: 'networkidle2', timeout: 30000 });
  } catch (err) {
    console.error('Erro ao acessar localhost:8081. Verifique se o Metro Bundler está ativo.', err);
    await browser.close();
    process.exit(1);
  }

  // 1. Tela de Login
  console.log('1. Capturando Tela de Login...');
  await delay(3500);
  await page.screenshot({ path: path.join(PRINTS_DIR, '01_login.png') });

  // 2. Tela de Cadastro
  console.log('2. Indo para Tela de Cadastro...');
  await clickByText(page, 'Cadastre-se aqui');
  await delay(1500);
  await page.screenshot({ path: path.join(PRINTS_DIR, '02_register.png') });

  // Voltar para Login
  console.log('Voltando para Login...');
  await clickByText(page, 'Entrar na conta');
  await delay(1500);

  // 3. Tela de Transição de Login
  console.log('3. Iniciando Login como Visitante...');
  await clickByText(page, 'Entrar como Visitante');
  await delay(250); // Captura rápida do Splash/Transição
  await page.screenshot({ path: path.join(PRINTS_DIR, '03_login_transition.png') });

  // Esperar a transição concluir (dura 1.8s)
  await delay(2500);

  // 4. Tela de Dashboard
  console.log('4. Capturando Dashboard (Hoje)...');
  await page.screenshot({ path: path.join(PRINTS_DIR, '04_dashboard.png') });

  // 12. Tela de Perfil (aberta a partir do Dashboard)
  console.log('12. Abrindo tela de Perfil (clique no avatar)...');
  // Clicando no avatar no canto superior direito (x=350, y=115)
  await page.mouse.click(350, 115);
  await delay(1500);
  await page.screenshot({ path: path.join(PRINTS_DIR, '12_profile.png') });

  // Voltando do Perfil para o Dashboard
  console.log('Voltando do Perfil para o Dashboard...');
  // Clicando na seta voltar no canto superior esquerdo (x=35, y=75)
  await page.mouse.click(35, 75);
  await delay(1500);

  // 5. Tela de Conquistas (Achievements)
  console.log('5. Navegando para Conquistas...');
  await clickByText(page, 'Conquistas');
  await delay(1500);
  await page.screenshot({ path: path.join(PRINTS_DIR, '05_achievements.png') });

  // 6. Tela de Evolução (Journey)
  console.log('6. Navegando para Evolução...');
  await clickByText(page, 'Jornada');
  await delay(1500);
  await page.screenshot({ path: path.join(PRINTS_DIR, '06_journey.png') });

  // Voltar para Dashboard
  console.log('Voltando para o Dashboard...');
  await clickByText(page, 'Hoje');
  await delay(1500);

  // 7. Tela de Configuração da Corrida (Setup)
  console.log('7. Clicando em Iniciar Corrida...');
  await clickByText(page, 'INICIAR CORRIDA');
  await delay(1500);
  await page.screenshot({ path: path.join(PRINTS_DIR, '07_start_run_setup.png') });

  // 8. Começar a Corrida
  console.log('8. Começando a atividade...');
  await clickByText(page, 'COMEÇAR');
  console.log('Aguardando a atividade progredir...');
  await delay(6500);
  await page.screenshot({ path: path.join(PRINTS_DIR, '08_running.png') });

  // 9. Encerrar Corrida
  console.log('9. Encerrando a corrida...');
  await clickByText(page, 'Encerrar');
  await delay(2000);
  await page.screenshot({ path: path.join(PRINTS_DIR, '09_end_run.png') });

  // 10. Tela de Feedback de Humor (Mood Feedback)
  console.log('10. Registrando como se sente...');
  await clickByText(page, 'REGISTRAR COMO ME SINTO AGORA');
  await delay(1500);
  await page.screenshot({ path: path.join(PRINTS_DIR, '10_mood_feedback.png') });

  // 11. Selecionar Humor "Excelente" e concluir
  console.log('Selecionando humor e salvando...');
  await clickByText(page, 'Excelente');
  await delay(800);
  
  await clickByText(page, 'SALVAR E CONCLUIR');
  await delay(3000); // dar tempo do loading e transição de sucesso
  console.log('11. Capturando conquistas desbloqueadas...');
  await page.screenshot({ path: path.join(PRINTS_DIR, '11_success_achievements.png') });

  // Voltar para o Dashboard
  console.log('Finalizando e voltando ao Dashboard...');
  await clickByText(page, 'VOLTAR PARA O INÍCIO');
  await delay(1500);

  console.log('Fechando navegador...');
  await browser.close();
  console.log('Concluído! Todos os prints foram salvos na pasta prints/.');
})();
