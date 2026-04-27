// Proteção anti-clickjacking via JavaScript (complemento ao header X-Frame-Options)
// Nota: proteção definitiva requer configurar o header HTTP no servidor (Netlify/_headers, etc.)
if (window.self !== window.top) {
  window.top.location = window.self.location;
}

// Escapa caracteres HTML para prevenir XSS — nunca inserir input do utilizador em innerHTML diretamente
function escapeHtml(str) {
  const el = document.createElement('div');
  el.textContent = String(str);
  return el.innerHTML;
}

// Modais — ativados por data-modal e data-modal-close (sem inline onclick no HTML)
function openModal(id) {
  const modal = document.getElementById(id);
  if (modal) {
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
}
function closeModal(id) {
  const modal = document.getElementById(id);
  if (modal) {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }
}

document.querySelectorAll('[data-modal]').forEach(el => {
  el.addEventListener('click', (e) => {
    e.preventDefault();
    openModal(el.dataset.modal);
  });
});
document.querySelectorAll('[data-modal-close]').forEach(el => {
  el.addEventListener('click', () => closeModal(el.dataset.modalClose));
});
document.querySelectorAll('.modal-overlay').forEach(overlay => {
  overlay.addEventListener('click', e => {
    if (e.target === overlay) closeModal(overlay.id);
  });
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal-overlay.open').forEach(m => closeModal(m.id));
  }
});

// Nav scroll
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 20);
});

// Menu mobile
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
navToggle.addEventListener('click', () => navLinks.classList.toggle('open'));
navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => navLinks.classList.remove('open'));
});

// Reveal ao scroll
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('in');
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// Tabela de preços — dados estáticos hardcoded
const PRICE_DATA = {
  combo6: {
    title: 'Pinturas + Insuflável 6h',
    cols: ['pinturas faciais', 'insuflável', 'valor'],
    rows: [
      ['1h00', '6h00', '150€'],
      ['1h30', '6h00', '180€'],
      ['2h00', '6h00', '200€'],
      ['2h30', '6h00', '220€'],
    ],
    note: 'Realização serviço · 2 animadoras'
  },
  combo3: {
    title: 'Pinturas + Insuflável 3h',
    cols: ['pinturas faciais', 'insuflável', 'valor'],
    rows: [
      ['1h00', '3h00', '120€'],
      ['1h30', '3h00', '140€'],
      ['2h00', '3h00', '175€'],
      ['2h30', '3h00', '195€'],
    ],
    note: 'Realização serviço · 2 animadoras'
  },
  pinturas: {
    title: 'Só Pinturas Faciais',
    cols: ['pinturas faciais', '', 'valor'],
    rows: [
      ['1h00', '—', '60€'],
      ['1h30', '—', '90€'],
      ['2h00', '—', '115€'],
      ['2h30', '—', '135€'],
    ],
    note: 'Realização serviço · 2 animadoras'
  },
  insuflavel: {
    title: 'Só Insuflável',
    cols: ['', 'insuflável', 'valor'],
    rows: [
      ['—', '3h00', '60€'],
      ['—', '6h00', '100€'],
    ],
    note: 'Realização serviço · 2 animadoras'
  },
  jogos: {
    title: 'Jogos Tradicionais',
    cols: ['jogo', 'duração', 'valor'],
    rows: [
      ['Cadeiras', '—', '30€'],
      ['Galo dinâmico', '—', '30€'],
      ['Raposa', '—', '30€'],
      ['Estafetas', '—', '30€'],
    ],
    note: 'Podem combinar-se vários jogos no mesmo bloco'
  },
  outros: {
    title: 'Outros Serviços',
    cols: ['serviço', '', 'valor'],
    rows: [
      ['Modelagem de balões *', '—', '30€'],
      ['Pinhata pré-definida *', '—', '50€'],
      ['Pinhata temática **', '—', '70€'],
    ],
    note: '* Pré-definida · ** Temática — pinhata à escolha do cliente<br>* Modelagem de balões requer acompanhamento de outra atividade (jogos ou pinturas)'
  },
};

// renderPriceTable usa DOM methods (não innerHTML com dados variáveis)
function renderPriceTable(key) {
  const d = PRICE_DATA[key];
  const table = document.getElementById('priceTable');
  table.innerHTML = '';

  const titleEl = document.createElement('h3');
  titleEl.textContent = d.title;
  table.appendChild(titleEl);

  const headerRow = document.createElement('div');
  headerRow.className = 'price-row header';
  d.cols.forEach(c => {
    const col = document.createElement('div');
    col.className = 'price-col';
    col.textContent = c;
    headerRow.appendChild(col);
  });
  table.appendChild(headerRow);

  d.rows.forEach(r => {
    const row = document.createElement('div');
    row.className = 'price-row';
    r.forEach((v, i) => {
      const col = document.createElement('div');
      col.className = i === 2 ? 'price-col valor' : 'price-col';
      col.textContent = v;
      row.appendChild(col);
    });
    table.appendChild(row);
  });

  // note é dados hardcoded (contém <br>) — seguro usar innerHTML aqui
  const footer = document.createElement('div');
  footer.className = 'price-footer';
  footer.innerHTML = d.note;
  table.appendChild(footer);
}

renderPriceTable('combo3');
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderPriceTable(btn.dataset.tab);
  });
});

// FAQ accordion
document.querySelectorAll('.faq-item').forEach(item => {
  item.querySelector('.faq-q').addEventListener('click', () => {
    item.classList.toggle('open');
  });
});

// Chips serviços (multi-seleção)
document.querySelectorAll('#chipGroup .chip').forEach(chip => {
  chip.addEventListener('click', () => chip.classList.toggle('selected'));
});

// Termo de responsabilidade — toggle expand/collapse
document.getElementById('termoToggle').addEventListener('click', () => {
  document.getElementById('termoWrap').classList.toggle('open');
});

// Ativar botão só quando nome + telefone preenchidos E checkbox aceite
const termoCheck = document.getElementById('termoCheck');
const submitBtn = document.getElementById('submitBtn');

function updateSubmitBtn() {
  const nameOk  = document.getElementById('name').value.trim().length >= 2;
  const phoneOk = document.getElementById('phone').value.trim().length >= 9;
  const ready   = termoCheck.checked && nameOk && phoneOk;
  submitBtn.disabled     = !ready;
  submitBtn.style.opacity = ready ? '1' : '0.5';
  submitBtn.style.cursor  = ready ? 'pointer' : 'not-allowed';
}

termoCheck.addEventListener('change', updateSubmitBtn);
document.getElementById('name').addEventListener('input', updateSubmitBtn);
document.getElementById('phone').addEventListener('input', updateSubmitBtn);

// Erros inline nos campos (usa textContent — nunca innerHTML)
function setFieldError(errId, message) {
  const el = document.getElementById(errId);
  if (el) {
    el.textContent = message;
    if (message) {
      el.previousElementSibling.style.borderColor = 'var(--pink)';
    }
  }
}
function clearFieldError(errId) {
  const el = document.getElementById(errId);
  if (el) {
    el.textContent = '';
    if (el.previousElementSibling) {
      el.previousElementSibling.style.borderColor = '';
    }
  }
}

// Submissão do formulário com Web3Forms (email) + CallMeBot (WhatsApp)
document.getElementById('bookingForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const form = e.target;

  // Honeypot: se o campo oculto estiver preenchido é um bot — rejeitar silenciosamente
  if (form.hp_website && form.hp_website.value) return;

  const name  = form.name.value.trim();
  const phone = form.phone.value.trim();
  const email = form.email.value.trim();

  clearFieldError('err-name');
  clearFieldError('err-phone');
  clearFieldError('err-email');

  let valid = true;

  if (!name || name.length < 2) {
    setFieldError('err-name', 'O nome é obrigatório (mínimo 2 caracteres).');
    valid = false;
  }
  if (!phone) {
    setFieldError('err-phone', 'O telefone é obrigatório.');
    valid = false;
  } else if (!/^[+]?[\d\s\-()]{9,15}$/.test(phone)) {
    setFieldError('err-phone', 'Número de telefone inválido.');
    valid = false;
  }
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    setFieldError('err-email', 'Endereço de email inválido.');
    valid = false;
  }

  if (!termoCheck.checked) {
    document.getElementById('termoWrap').scrollIntoView({ behavior: 'smooth', block: 'center' });
    return;
  }

  if (!valid) return;

  // Serviços selecionados via chips
  const selectedServices = [...document.querySelectorAll('#chipGroup .chip.selected')]
    .map(c => c.dataset.value).join(', ') || 'Não especificado';

  // Desativar botão durante envio
  submitBtn.disabled = true;
  submitBtn.textContent = 'A enviar...';

  try {
    // 1. Enviar email via Web3Forms
    const res = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({
        access_key: '6973b680-92f0-42e4-90a8-fa31446fdcf5',
        subject: 'Novo pedido de informações — Pinturescas',
        from_name: 'Pinturescas Website',
        name:     name,
        phone:    phone,
        email:    email || 'Não indicado',
        data_festa:  form.date.value   || 'Não indicado',
        criancas:    form.kids.value   || 'Não indicado',
        servicos:    selectedServices,
        local:       form.location.value.trim() || 'Não indicado',
        mensagem:    form.message.value.trim()  || 'Sem mensagem adicional',
      })
    });
    const data = await res.json();
    if (!data.success) throw new Error('Web3Forms error');

    // 2. Notificação WhatsApp via CallMeBot (configurar chave abaixo)
    const CALLMEBOT_PHONE  = '351931370285';
    const CALLMEBOT_APIKEY = '4878364';
    if (CALLMEBOT_PHONE !== 'SEU_NUMERO') {
      const msg = encodeURIComponent(
        `🎉 Novo pedido Pinturescas!\nNome: ${name}\nTel: ${phone}\nData: ${form.date.value || '?'}\nServiços: ${selectedServices}`
      );
      await fetch(`https://api.callmebot.com/whatsapp.php?phone=${CALLMEBOT_PHONE}&text=${msg}&apikey=${CALLMEBOT_APIKEY}`);
    }

    // Mensagem de sucesso construída via DOM (textContent) — sem XSS
    const formContent = document.getElementById('formContent');
    formContent.innerHTML = '';

    const successDiv = document.createElement('div');
    successDiv.className = 'form-success';

    const iconDiv = document.createElement('div');
    iconDiv.className = 'form-success-icon';
    iconDiv.textContent = '✓';

    const titleEl = document.createElement('h4');
    titleEl.textContent = 'Pedido recebido, ' + name + '!';

    const msgEl = document.createElement('p');
    msgEl.textContent = 'Vamos responder o mais rápido possível com uma proposta para a vossa festa. Entretanto, já podes ir treinando o parabéns.';

    successDiv.appendChild(iconDiv);
    successDiv.appendChild(titleEl);
    successDiv.appendChild(msgEl);
    formContent.appendChild(successDiv);

  } catch {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Enviar pedido';
    submitBtn.style.opacity = '1';
    submitBtn.style.cursor = 'pointer';
    alert('Ocorreu um erro ao enviar. Por favor tenta novamente ou contacta-nos diretamente pelo telefone.');
  }
});
