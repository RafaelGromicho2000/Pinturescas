// Hero slideshow
(function () {
  const slides = document.querySelectorAll('.hero-slideshow .slide');
  if (!slides.length) return;
  let cur = 0;
  setInterval(() => {
    slides[cur].classList.remove('active');
    cur = (cur + 1) % slides.length;
    slides[cur].classList.add('active');
  }, 3500);
})();

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
  pinturas: {
    title: 'Só Pinturas Faciais',
    cols: ['duração', 'valor'],
    rows: [
      ['1h00', '60€'],
      ['1h30', '90€'],
      ['2h00', '115€'],
      ['2h30', '135€'],
    ],
    note: 'Realização serviço · 2 animadoras'
  },
  insuflavel: {
    title: 'Só Insuflável',
    castles: [
      { name: 'Castelo Pequeno', img: 'insuflavel-1.jpeg', price: '60€', extra: '15€' },
      { name: 'Castelo Grande', img: 'insuflavel-4.jpeg', price: '100€', extra: '25€' },
    ],
    note: 'Preço base para 3h · Serviço de montagem e desmontagem incluído'
  },
  jogos: {
    title: 'Jogos Tradicionais',
    cols: ['duração', 'valor'],
    rows: [
      ['1h00', '30€'],
      ['1h30', '45€'],
      ['2h00', '75€'],
      ['2h30', '90€'],
    ],
    note: 'Podem combinar-se vários jogos no mesmo bloco'
  },
  outros: {
    title: 'Outros Serviços',
    cols: ['serviço', 'valor'],
    rows: [
      ['Modelagem de balões\n+\ntatuagens temporárias *', '30€'],
      ['Pinhata pré‑definida *', '50€'],
      ['Pinhata temática **', '70€'],
    ],
    note: '* Requer acompanhamento de outra atividade (jogos ou pinturas) 30 minutos extra.<br>** Temática — pinhata à escolha do cliente'
  },
};

// renderPriceTable usa DOM methods (não innerHTML com dados variáveis)
function renderPriceTable(key) {
  const d = PRICE_DATA[key];
  const table = document.getElementById('priceTable');
  table.innerHTML = '';

  // Layout especial em cartões (usado pelo insuflável: fotos + preço por castelo)
  if (d.castles) {
    table.className = 'price-table castles-table';

    const titleEl = document.createElement('h3');
    titleEl.textContent = d.title;
    table.appendChild(titleEl);

    const grid = document.createElement('div');
    grid.className = 'castle-cards';
    d.castles.forEach(c => {
      const card = document.createElement('div');
      card.className = 'castle-card';

      const photo = document.createElement('div');
      photo.className = 'castle-photo';
      const img = document.createElement('img');
      img.src = c.img;
      img.alt = c.name;
      photo.appendChild(img);
      card.appendChild(photo);

      const name = document.createElement('h4');
      name.textContent = c.name;
      card.appendChild(name);

      const price = document.createElement('div');
      price.className = 'castle-price';
      price.append('3h — ');
      const strong = document.createElement('strong');
      strong.textContent = c.price;
      price.appendChild(strong);
      card.appendChild(price);

      const extra = document.createElement('div');
      extra.className = 'castle-extra';
      extra.textContent = `+ hora extra — ${c.extra}`;
      card.appendChild(extra);

      grid.appendChild(card);
    });
    table.appendChild(grid);

    const footer = document.createElement('div');
    footer.className = 'price-footer';
    footer.textContent = d.note;
    table.appendChild(footer);
    return;
  }

  table.className = d.cols.length === 2 ? 'price-table two-col' : 'price-table';

  const colsStyle = d.cols.length === 2 ? '3fr 1fr' : `repeat(${d.cols.length}, 1fr)`;

  const titleEl = document.createElement('h3');
  titleEl.textContent = d.title;
  table.appendChild(titleEl);

  const headerRow = document.createElement('div');
  headerRow.className = 'price-row header';
  headerRow.style.gridTemplateColumns = colsStyle;
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
    row.style.gridTemplateColumns = colsStyle;
    r.forEach((v, i) => {
      const col = document.createElement('div');
      col.className = i === r.length - 1 ? 'price-col valor' : 'price-col';
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

renderPriceTable('pinturas');
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

// Configuração das sub-opções por serviço
const SERVICE_OPTIONS = {
  pinturas:   { label: 'Pinturas', sections: [
    { id: 'dur', label: 'Duração', multi: false, opts: ['1h00','1h30','2h00','2h30'] }
  ]},
  insuflavel: { label: 'Insuflável', sections: [
    { id: 'castelo', label: 'Castelo', multi: false, opts: ['Castelo Pequeno','Castelo Grande'] },
    { id: 'extra', label: 'Duração', type: 'stepper', dependsOn: 'castelo', extraPrices: { 'Castelo Pequeno': 15, 'Castelo Grande': 25 }, min: 0, max: 6 }
  ]},
  jogos:      { label: 'Jogos', sections: [
    { id: 'dur', label: 'Duração', multi: false, opts: ['1h00','1h30','2h00'] }
  ]},
  eventos:    { label: 'Eventos personalizados', sections: [
    { id: 'tipo', label: 'Tipo de evento', multi: false, opts: ['Casamento','Batizado','Outro evento'] }
  ]},
  outros:     { label: 'Outros Serviços', sections: [
    { id: 'tipo', label: 'Serviço pretendido', multi: true, opts: ['Modelagem de balões + tatuagens temporárias','Pinhata pré-definida','Pinhata temática'] }
  ]}
};

// Guarda as seleções das sub-opções em memória
const serviceSelections = {};

function renderServiceOptions() {
  const panel = document.getElementById('serviceOptions');
  panel.innerHTML = '';
  const selected = [...document.querySelectorAll('#chipGroup .chip.selected')];
  if (!selected.length) return;

  selected.forEach(chip => {
    const key = chip.dataset.value;
    const cfg = SERVICE_OPTIONS[key];
    if (!cfg) return;
    if (!serviceSelections[key]) serviceSelections[key] = {};

    const block = document.createElement('div');
    block.className = 'svc-block';

    const title = document.createElement('div');
    title.className = 'svc-block-title';
    title.textContent = cfg.label;
    block.appendChild(title);

    cfg.sections.forEach(sec => {
      const lbl = document.createElement('div');
      lbl.className = 'svc-section-label';
      lbl.textContent = sec.label;
      block.appendChild(lbl);

      // Stepper dinâmico (horas extra) — usado no insuflável
      if (sec.type === 'stepper') {
        if (typeof serviceSelections[key][sec.id] !== 'number') {
          serviceSelections[key][sec.id] = 0;
        }
        const count = serviceSelections[key][sec.id];
        const min = sec.min ?? 0;
        const max = sec.max ?? 6;

        const card = document.createElement('div');
        card.className = 'stepper-card';

        const base = document.createElement('div');
        base.className = 'stepper-base';
        base.textContent = '3h incluídas';
        card.appendChild(base);

        const controls = document.createElement('div');
        controls.className = 'stepper-controls';

        const minusBtn = document.createElement('button');
        minusBtn.type = 'button';
        minusBtn.className = 'stepper-btn';
        minusBtn.textContent = '−';
        minusBtn.disabled = count <= min;
        minusBtn.setAttribute('aria-label', 'Remover hora extra');
        minusBtn.addEventListener('click', () => {
          serviceSelections[key][sec.id] = Math.max(min, count - 1);
          renderServiceOptions();
        });
        controls.appendChild(minusBtn);

        const countEl = document.createElement('div');
        countEl.className = 'stepper-count';
        countEl.textContent = count === 0 ? 'Sem horas extra' : `+${count}h extra`;
        controls.appendChild(countEl);

        const plusBtn = document.createElement('button');
        plusBtn.type = 'button';
        plusBtn.className = 'stepper-btn';
        plusBtn.textContent = '+';
        plusBtn.disabled = count >= max;
        plusBtn.setAttribute('aria-label', 'Adicionar hora extra');
        plusBtn.addEventListener('click', () => {
          serviceSelections[key][sec.id] = Math.min(max, count + 1);
          renderServiceOptions();
        });
        controls.appendChild(plusBtn);

        card.appendChild(controls);

        const castelo = sec.dependsOn ? serviceSelections[key][sec.dependsOn] : null;
        const priceEl = document.createElement('div');
        priceEl.className = 'stepper-price';
        if (!castelo) {
          priceEl.textContent = 'Escolhe o castelo ↑';
        } else if (count > 0) {
          priceEl.textContent = `+ ${count * sec.extraPrices[castelo]}€`;
        } else {
          priceEl.textContent = `${sec.extraPrices[castelo]}€/hora extra`;
        }
        card.appendChild(priceEl);

        block.appendChild(card);
        return;
      }

      const grp = document.createElement('div');
      grp.className = 'opt-group';

      if (!serviceSelections[key][sec.id]) {
        serviceSelections[key][sec.id] = sec.multi ? new Set() : null;
      }

      sec.opts.forEach(opt => {
        const pill = document.createElement('div');
        pill.className = 'opt-pill';
        pill.textContent = opt;

        const isSel = sec.multi
          ? serviceSelections[key][sec.id].has(opt)
          : serviceSelections[key][sec.id] === opt;
        if (isSel) pill.classList.add('selected');

        pill.addEventListener('click', () => {
          if (sec.multi) {
            if (serviceSelections[key][sec.id].has(opt)) {
              serviceSelections[key][sec.id].delete(opt);
            } else {
              serviceSelections[key][sec.id].add(opt);
            }
          } else {
            serviceSelections[key][sec.id] = opt;
          }
          renderServiceOptions();
        });
        grp.appendChild(pill);
      });
      block.appendChild(grp);
    });
    panel.appendChild(block);
  });
}

function buildServiceSummary() {
  const lines = [];
  document.querySelectorAll('#chipGroup .chip.selected').forEach(chip => {
    const key = chip.dataset.value;
    const cfg = SERVICE_OPTIONS[key];
    if (!cfg) return;
    const parts = [cfg.label];
    const sel = serviceSelections[key] || {};
    cfg.sections.forEach(sec => {
      if (sec.type === 'stepper') {
        const count = sel[sec.id] || 0;
        const castelo = sec.dependsOn ? sel[sec.dependsOn] : null;
        const priceTxt = (count > 0 && castelo) ? ` (+${count * sec.extraPrices[castelo]}€)` : '';
        parts.push(`${sec.label}: 3h${count > 0 ? ' + ' + count + 'h extra' : ''}${priceTxt}`);
        return;
      }
      const val = sel[sec.id];
      if (!val) return;
      const vals = sec.multi ? [...val] : [val];
      if (vals.length) parts.push(sec.label + ': ' + vals.join(', '));
    });
    lines.push(parts.join(' — '));
  });
  return lines.join('\n') || 'Não especificado';
}

// Chips serviços (multi-seleção com sub-opções)
document.querySelectorAll('#chipGroup .chip').forEach(chip => {
  chip.addEventListener('click', () => {
    chip.classList.toggle('selected');
    renderServiceOptions();
  });
});

// Termo de responsabilidade — toggle expand/collapse
document.getElementById('termoToggle').addEventListener('click', () => {
  const wrap = document.getElementById('termoWrap');
  const body = document.getElementById('termoBody');
  const isOpen = wrap.classList.contains('open');
  if (isOpen) {
    body.style.maxHeight = '0';
    wrap.classList.remove('open');
  } else {
    wrap.classList.add('open');
    body.style.maxHeight = body.scrollHeight + 'px';
  }
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

  // Serviços selecionados com sub-opções
  const selectedServices = buildServiceSummary();

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
        hora_festa:  form.hora.value   || 'Não indicado',
        criancas:    form.kids.value   || 'Não indicado',
        servicos:    selectedServices,
        local:       form.location.value.trim() || 'Não indicado',
        mensagem:    form.message.value.trim()  || 'Sem mensagem adicional',
      })
    });
    const data = await res.json();
    if (!data.success) throw new Error('Web3Forms error');

    // 2. Notificação WhatsApp via CallMeBot (no-cors para evitar bloqueio do browser)
    const CALLMEBOT_PHONE  = '351931370285';
    const CALLMEBOT_APIKEY = '4878364';
    try {
      const msg = encodeURIComponent(
        `Novo pedido Pinturescas! Nome: ${name} | Tel: ${phone} | Data: ${form.date.value || '?'} | Hora: ${form.hora.value || '?'} | Servicos: ${selectedServices}`
      );
      await fetch(`https://api.callmebot.com/whatsapp.php?phone=${CALLMEBOT_PHONE}&text=${msg}&apikey=${CALLMEBOT_APIKEY}`, { mode: 'no-cors' });
    } catch {
      // falha silenciosa — o email já foi enviado com sucesso
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
