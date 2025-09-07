(function(){
  const exprEl = document.getElementById('expr');
  const resEl = document.getElementById('result');
  const wordsEl = document.getElementById('words');
  let expression = '';
  let justEvaluated = false;

  function updateDisplay(){
    exprEl.textContent = expression || '\u00A0';
  }

  function append(val){
    if(justEvaluated && /[0-9.]/.test(val)){
      expression = '';
    }
    justEvaluated = false;
    if(val === '.'){
      const lastNum = (expression.match(/([0-9]*\.?[0-9]+)(?!.*[0-9.])/))?.[0] || '';
      if(lastNum.includes('.')) return;
      if(expression === '' || /[+\-*/]$/.test(expression)) expression += '0';
    }
    if(/[+\-*/]/.test(val) && /[+\-*/]$/.test(expression)){
      expression = expression.slice(0,-1) + val;
    } else {
      expression += val;
    }
    updateDisplay();
  }

  function clearAll(){ expression=''; resEl.textContent='0'; wordsEl.textContent='صفر'; updateDisplay(); justEvaluated=false; }
  function del(){ if(justEvaluated){ justEvaluated=false; return; } expression = expression.slice(0,-1); updateDisplay(); }

  function safeEval(expr){
    if(!/^[-+*/().\d\s]+$/.test(expr)) throw new Error('Invalid');
    const fn = new Function('return (' + expr + ')');
    return fn();
  }

  function equals(){
    if(!expression) return;
    try{
      const normalized = expression.replace(/−/g,'-');
      const value = safeEval(normalized);
      const out = Number.isFinite(value) ? value : 0;
      resEl.textContent = formatNumber(out);
      wordsEl.textContent = numberToWords(Math.round(out));
      justEvaluated = true;
    }catch(err){
      resEl.textContent = 'خطأ';
      wordsEl.textContent = '';
      justEvaluated = false;
    }
  }

  function formatNumber(n){
    const s = n.toString();
    return s.length > 14 ? n.toPrecision(12) : s;
  }

  // ===== تعريف الأرقام بالعربية =====
  const ones = ["صفر","واحد","اثنان","ثلاثة","أربعة","خمسة","ستة","سبعة","ثمانية","تسعة"];
  const tens = ["","عشرة","عشرون","ثلاثون","أربعون","خمسون","ستون","سبعون","ثمانون","تسعون"];
  const teens = ["عشرة","أحد عشر","اثنا عشر","ثلاثة عشر","أربعة عشر","خمسة عشر","ستة عشر","سبعة عشر","ثمانية عشر","تسعة عشر"];

  function numberToWords(n){
    if(n===0) return "صفر";
    if(n<0) return "سالب " + numberToWords(-n);
    let words = "";
    if(n>=1000000){ words += numberToWords(Math.floor(n/1000000))+" مليون "; n%=1000000; }
    if(n>=1000){ words += numberToWords(Math.floor(n/1000))+" ألف "; n%=1000; }
    if(n>=100){ words += numberToWords(Math.floor(n/100))+" مائة "; n%=100; }
    if(n>=20){ words += tens[Math.floor(n/10)]+" "; n%=10; }
    if(n>=10){ words += teens[n-10]+" "; n=0; }
    if(n>0){ words += ones[n]+" "; }
    return words.trim();
  }

  // ===== أحداث الأزرار =====
  document.querySelector('.keys').addEventListener('click', (e)=>{
    const btn = e.target.closest('button'); if(!btn) return;
    const val = btn.getAttribute('data-value');
    const action = btn.getAttribute('data-action');
    if(val){ append(val); }
    else if(action === 'clear'){ clearAll(); }
    else if(action === 'del'){ del(); }
    else if(action === 'equals'){ equals(); }
  });

  window.addEventListener('keydown', (e)=>{
    const k = e.key;
    if(/^[0-9]$/.test(k)) append(k);
    else if(['+','-','*','/','.','(',')'].includes(k)) append(k);
    else if(k === 'Enter'){ e.preventDefault(); equals(); }
    else if(k === 'Backspace'){ del(); }
    else if(k === 'Escape'){ clearAll(); }
  });

  updateDisplay();

  // ===== إعدادات الألوان (10 ثيمات تلقائية) =====
  const themes = [
    {bg:"#0f172a", btn:"#1f2937"},
    {bg:"#1a1a2e", btn:"#16213e"},
    {bg:"#222831", btn:"#393e46"},
    {bg:"#2d132c", btn:"#801336"},
    {bg:"#0f3460", btn:"#1a1a40"},
    {bg:"#1e5128", btn:"#4e9f3d"},
    {bg:"#2b2e4a", btn:"#e84545"},
    {bg:"#2f3640", btn:"#353b48"},
    {bg:"#232931", btn:"#393e46"},
    {bg:"#3a0ca3", btn:"#4361ee"},
  ];

  function applyRandomTheme(){
    const t = themes[Math.floor(Math.random()*themes.length)];
    document.documentElement.style.setProperty('--bg', t.bg);
    document.documentElement.style.setProperty('--key', t.btn);
    document.body.style.background = t.bg;
  }

  // عند تحميل الصفحة
  applyRandomTheme();

  // نافذة الإعدادات
  const settingsBtn = document.getElementById('settingsBtn');
  const modal = document.getElementById('settingsModal');
  const closeBtn = document.getElementById('closeSettings');
  const newThemeBtn = document.getElementById('newTheme');

  settingsBtn.addEventListener('click', ()=> modal.style.display = 'flex');
  closeBtn.addEventListener('click', ()=> modal.style.display = 'none');
  newThemeBtn.addEventListener('click', ()=> applyRandomTheme());
  window.addEventListener('click', (e)=>{ if(e.target === modal) modal.style.display = 'none'; });
})();
