/* ============================================
   DOMPET v1.1 — Auto-Save + Edit
   ============================================ */

// ---- Categories ----
const CATEGORIES = [
  { name: 'Food & Dining',    emoji: '🍜', color: '#f97316' },
  { name: 'Groceries',        emoji: '🛒', color: '#22c55e' },
  { name: 'Transport',        emoji: '🚗', color: '#3b82f6' },
  { name: 'Health',           emoji: '💊', color: '#ef4444' },
  { name: 'Shopping',         emoji: '👕', color: '#a855f7' },
  { name: 'Entertainment',    emoji: '🎮', color: '#ec4899' },
  { name: 'Home & Utilities', emoji: '🏠', color: '#14b8a6' },
  { name: 'Tech',             emoji: '📱', color: '#6366f1' },
  { name: 'Education',        emoji: '📚', color: '#eab308' },
  { name: 'Others',           emoji: '💰', color: '#94a3b8' },
];

const MONTH_NAMES = [
  'Januari','Februari','Maret','April','Mei','Juni',
  'Juli','Agustus','September','Oktober','November','Desember'
];

// ---- Keyword Auto-Categorizer (200+ Indonesian keywords) ----
const KEYWORD_MAP = {
  'Food & Dining': [
    'makan','mie','nasi','ayam','bakso','sate','soto','rendang','gado','pecel',
    'warteg','restoran','resto','cafe','kopi','coffee','starbucks','mcd','mcdonald',
    'kfc','burger','pizza','roti','es teh','es jeruk','jus','boba','chatime',
    'janji jiwa','kenangan','fore','tuku','latte','cappuccino','americano',
    'indomie','gorengan','martabak','siomay','batagor','pempek','geprek',
    'lalapan','padang','sushi','ramen','dim sum','shabu','hotpot',
    'makan siang','makan malam','sarapan','breakfast','lunch','dinner',
    'snack','jajan','cemilan','dessert','kue','donat','nasi goreng',
    'nasi padang','nasi uduk','bubur','sop','ikan','seafood','bebek',
    'bakar','goreng','rebus','kuah','sambal','tongseng','gulai','rawon',
    'lontong','ketoprak','kerak telor','seblak','cilok','cireng','cimol',
    'tahu','tempe','sarden','mie ayam','mie goreng','mie rebus',
    'bakmi','kwetiau','bihun','capcay','nasi campur','nasi kuning',
    'ricebowl','rice bowl','salad','sandwich','wrap','kebab','shawarma',
    'takoyaki','okonomiyaki','bibimbap','jajanan','warung','kantin',
    'food court','food','minum','minuman','drink','thai tea','matcha',
    'smoothie','milkshake','es krim','ice cream','gelato','coklat',
    'chocolate','pancake','waffle','croissant','pastry','bakery',
    'breadtalk','tous les jours','holland bakery','dunkin','donuts',
    'jco','kopitiam','kedai','angkringan','lesehan',
    'hokben','yoshinoya','marugame','solaria','es campur','cendol',
    'dawet','kolak','klepon','onde','lumpia','risol','pastel',
    'kroket','tteokbokki','ramyeon','tom yum','somtam','pho',
    'banh mi','tempura','katsu','gyudon','curry','kari',
  ],
  'Groceries': [
    'indomaret','alfamart','alfamidi','supermarket','superindo','hypermart',
    'giant','lottemart','carrefour','ranch market','farmers market','hero',
    'beras','telur','minyak goreng','gula','garam','sayur','buah','daging',
    'susu','roti tawar','sabun','sampo','shampoo','tissue','odol','pasta gigi',
    'detergen','deterjen','grocery','belanja bulanan','sembako','tepung',
    'mentega','margarin','keju','yogurt','sosis','nugget','frozen',
    'bumbu','kecap','saos','saus','cuka','merica','kunyit','bawang',
    'cabai','cabe','tomat','kentang','wortel','kangkung','bayam',
    'brokoli','toge','jamur','jagung','terong','labu','timun','selada',
    'seledri','daun bawang','jahe','lengkuas','sereh','daun salam',
    'santan','kelapa','madu','selai','sereal','oat','granola',
    'snack anak','pampers','popok','susu formula','makanan bayi',
    'kapas','cotton bud','pembalut','pewangi','pelembut','sapu',
    'pel','ember','trash bag','plastik','aluminium foil','cling wrap',
    'tisu basah','hand soap','body wash','conditioner','lotion',
    'sunscreen','deodorant',
  ],
  'Transport': [
    'grab','gojek','gocar','goride','grabcar','grabbike','uber','taxi','taksi',
    'bensin','pertamax','pertalite','solar','shell','pertamina','bp',
    'tol','parkir','toll','angkot','bus','transjakarta','busway',
    'mrt','lrt','krl','commuter','kereta','train','ojek','ojol','maxim',
    'bandara','airport','pesawat','flight','tiket pesawat','boarding',
    'travel','shuttle','damri','bluebird','blue bird','express',
    'tarif','ongkir','ongkos','transport','transportasi',
    'ganti oli','oli','servis motor','servis mobil','service kendaraan',
    'cuci motor','cuci mobil','tune up','ban','tire',
    'sim','stnk','pajak kendaraan','samsat',
    'e-toll','etoll','flazz','brizzi','emoney','e-money',
    'indriver','indrive',
  ],
  'Health': [
    'obat','apotek','apotik','farmasi','pharmacy','dokter','doctor',
    'klinik','clinic','rumah sakit','rs','hospital','vitamin',
    'supplement','suplemen','medical','kesehatan','health',
    'lab','laboratorium','check up','checkup','medical check',
    'pcr','antigen','vaksin','vaccine','gigi','dentist','dental',
    'mata','eye','optik','kacamata minus','terapi','therapy',
    'fisioterapi','physiotherapy','psikolog','psikiater','counseling',
    'konsultasi dokter','rawat','igd','ugd','bpjs','asuransi kesehatan',
    'masker medis','hand sanitizer','antiseptik','perban','plester',
    'thermometer','tensimeter','oximeter','inhaler','nebulizer',
    'paracetamol','ibuprofen','amoxicillin','antibiotik','salep',
    'tetes mata','sirup obat','herbal','jamu','tolak angin',
    'antangin','komix','promag','mylanta','diapet','oralit',
    'betadine','minyak kayu putih','balsem','koyo',
  ],
  'Shopping': [
    'baju','celana','sepatu','sandal','tas','jaket','hoodie','kaos',
    'kemeja','dress','rok','jeans','sneakers','boots','loafer',
    'uniqlo','h&m','hm','zara','pull and bear','pull&bear',
    'cotton on','mango','marks spencer','giordano','eiger',
    'shopee','tokopedia','lazada','blibli','tiktok shop','bukalapak',
    'fashion','pakaian','clothing','aksesoris','accessories',
    'jam tangan','watch','gelang','kalung','anting','cincin',
    'kacamata','sunglass','parfum','perfume','skincare','makeup',
    'cosmetic','kosmetik','bodycare','perawatan','foundation',
    'lipstik','lipstick','mascara','eyeshadow','blush','powder',
    'serum','toner','moisturizer','cleanser','face wash','sunblock',
    'body lotion','hand cream','nail polish','hair oil',
    'dompet','wallet','belt','ikat pinggang','topi','hat','cap',
    'syal','scarf','masker kain','kaus kaki','underwear',
    'oleh oleh','oleh-oleh','souvenir','gift','kado','hadiah',
    'bunga','florist','perhiasan','jewelry',
    'mall','department store','outlet','thrift','preloved','secondhand',
  ],
  'Entertainment': [
    'netflix','spotify','disney','youtube premium','hbo','prime video',
    'apple music','joox','vidio','viu','wetv','iqiyi','amazon prime',
    'bioskop','cinema','xxi','cgv','cinepolis','platinum',
    'game','steam','playstation','ps5','ps4','ps plus','xbox','gamepass',
    'nintendo','switch','mobile legend','ml','pubg','free fire','ff',
    'genshin','valorant','dota','fortnite','roblox','minecraft',
    'konser','concert','festival','tiket event','event','acara',
    'karaoke','bowling','billiard','bilyard','arcade','timezone',
    'nonton','film','movie','series','drakor','anime','manga',
    'museum','taman hiburan','waterpark','ancol','dufan','jungleland',
    'trans studio','kidzania','escape room','paintball','go kart',
    'rafting','diving','snorkeling','surfing','camping','hiking',
    'piknik','picnic','wisata','rekreasi','recreation','liburan',
    'vacation','staycation','hotel','resort','villa','airbnb',
    'traveloka','tiket.com','agoda','booking.com','pegi pegi',
    'gym','fitness','yoga','pilates','swimming','renang',
    'badminton','futsal','basket','tennis','golf','climbing',
    'bouldering','trampoline','ice skating',
    'bar','club','lounge','rooftop','hangout','nongkrong',
    'board game','escape','karting',
  ],
  'Home & Utilities': [
    'listrik','pln','token listrik','pdam','air','iuran air',
    'wifi','internet','indihome','biznet','firstmedia','myrepublic',
    'telkom','cbn','mnc play','xl home','iconnet',
    'gas','lpg','elpiji','tabung gas','bright gas',
    'sewa','kost','kos','kontrakan','kontrak','apartment','apartemen',
    'ipl','maintenance','iuran','rt','rw','sampah','kebersihan',
    'service ac','laundry','dry clean','cuci baju','setrika',
    'cleaning','bersih','cleaning service','asisten rumah tangga','art',
    'renovasi','perbaikan','tukang','plumber','pipa','keran',
    'furniture','ikea','informa','ace hardware','depo bangunan',
    'cat','lampu','bohlam','kasur','bantal','guling','sprei',
    'selimut','handuk','gorden','karpet','rak','lemari','meja','kursi',
    'sofa','cermin','jam dinding','hanger','jemuran',
    'kompor','kulkas','mesin cuci','ac','kipas angin',
    'vacuum','blender','rice cooker','dispenser','microwave','oven',
    'panci','wajan','spatula','pisau dapur','talenan','piring',
    'gelas','mangkok','sendok','garpu','tupperware',
    'pajak bumi','pbb','cicilan rumah','kpr','mortgage',
  ],
  'Tech': [
    'laptop','komputer','computer','pc','desktop','macbook','thinkpad',
    'handphone','hp','smartphone','iphone','samsung','xiaomi','oppo',
    'vivo','realme','poco','pixel','oneplus','nothing','asus','lenovo',
    'gadget','elektronik','electronic','charger','kabel','cable',
    'earphone','headphone','headset','earbuds','airpods','tws',
    'speaker','bluetooth','mouse','keyboard','monitor','webcam',
    'printer','scanner','harddisk','hard disk','ssd','ram','flash disk',
    'flashdisk','memory card','micro sd','usb','hub','dongle',
    'case hp','casing hp','cover hp','adapter','power bank','powerbank',
    'screen protector','tempered glass','anti gores',
    'tripod','gimbal','ring light','mic','microphone',
    'tablet','ipad','tab','smartwatch','smart watch','smart band',
    'router','modem','access point','switch hub',
    'drone','action cam','gopro','kamera','camera','lensa','lens',
    'software','aplikasi','app','subscription','langganan','domain',
    'hosting','cloud','storage','icloud','google one',
    'repair','ganti lcd','ganti baterai','service hp','service laptop',
    'pulsa','paket data','kuota','internet hp',
  ],
  'Education': [
    'kursus','course','les','private','bimbel','bimbingan belajar',
    'buku','book','ebook','e-book','kindle','novel','komik','majalah',
    'udemy','coursera','skillshare','codecademy','linkedin learning',
    'masterclass','ruangguru','zenius','brainly','quipper',
    'seminar','webinar','workshop','training','pelatihan','bootcamp',
    'sertifikasi','certification','exam','ujian','tes','test',
    'sekolah','school','kuliah','university','kampus','universitas',
    'tuition','spp','uang kuliah','uang sekolah','daftar ulang',
    'skripsi','thesis','jurnal','paper','riset','research',
    'print','fotokopi','photocopy','fotocopy','jilid','laminating',
    'alat tulis','stationery','atk','pensil','pulpen','binder',
    'notebook','buku tulis','map','amplop','stabilo','spidol',
    'penggaris','penghapus','tip ex','lem','gunting','stapler',
    'kalkulator','tas sekolah','seragam','perpustakaan','library',
    'tutor','mentor','coaching','konsultasi akademik',
  ],
};

function categorize(description) {
  const input = description.toLowerCase().trim();
  let bestMatch = null;
  let bestLength = 0;
  for (const [category, keywords] of Object.entries(KEYWORD_MAP)) {
    for (const keyword of keywords) {
      if (input.includes(keyword) && keyword.length > bestLength) {
        bestMatch = category;
        bestLength = keyword.length;
      }
    }
  }
  return bestMatch || 'Others';
}

// ---- Config ----
const Config = {
  get(key)        { return localStorage.getItem('dompet_' + key) || ''; },
  set(key, value) { localStorage.setItem('dompet_' + key, value); },
  get clientId()  { return this.get('clientId'); },
  get sheetId()   { return this.get('sheetId'); },
};

// ---- State ----
let accessToken = null;
let tokenClient = null;
let allTransactions = [];   // { timestamp, description, amount, category, month, week, sheetRow }
let recentItems = [];       // same shape, max 5
let dashboardMonth = new Date();
let pieChart = null;
let barChart = null;

// ---- Edit state ----
let editTarget = null; // { source: 'recent'|'history', index, sheetRow, ... }

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  loadSettingsUI();
  tryInitGoogle();

  const amtInput = document.getElementById('input-amount');
  amtInput.addEventListener('input', () => {
    let raw = amtInput.value.replace(/[^\d]/g, '');
    if (raw) amtInput.value = Number(raw).toLocaleString('id-ID');
  });
  amtInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') handleSubmit();
  });

  // Also format edit amount field
  const editAmt = document.getElementById('edit-amount');
  editAmt.addEventListener('input', () => {
    let raw = editAmt.value.replace(/[^\d]/g, '');
    if (raw) editAmt.value = Number(raw).toLocaleString('id-ID');
  });
});

// ============================================
// GOOGLE AUTH
// ============================================

function tryInitGoogle() {
  if (!Config.clientId) return;
  if (typeof google === 'undefined' || !google.accounts) {
    setTimeout(tryInitGoogle, 500);
    return;
  }
  tokenClient = google.accounts.oauth2.initTokenClient({
    client_id: Config.clientId,
    scope: 'https://www.googleapis.com/auth/spreadsheets',
    callback: onTokenResponse,
  });
}

function onTokenResponse(resp) {
  if (resp.error) { showToast('Google auth gagal: ' + resp.error, 'error'); return; }
  accessToken = resp.access_token;
  showToast('Signed in ✓', 'success');
  updateAuthUI(true);
}

function handleSignIn() {
  if (!Config.clientId) { showToast('Isi Google Client ID dulu di Settings', 'error'); return; }
  if (!tokenClient) { tryInitGoogle(); setTimeout(handleSignIn, 800); return; }
  tokenClient.requestAccessToken({ prompt: 'consent' });
}

function handleSignOut() {
  if (accessToken) google.accounts.oauth2.revoke(accessToken);
  accessToken = null;
  updateAuthUI(false);
  showToast('Signed out', 'info');
}

function updateAuthUI(signedIn) {
  document.getElementById('auth-status').textContent = signedIn ? '● Connected' : '';
  document.getElementById('settings-auth').innerHTML = signedIn
    ? '<p class="signed-in-info">Terhubung ke Google Sheets</p><button class="btn-signout" onclick="handleSignOut()">Sign Out</button>'
    : '<button class="btn-google" onclick="handleSignIn()">Sign in with Google</button>';
}

async function ensureToken() {
  if (!accessToken) { showToast('Sign in ke Google dulu', 'error'); throw new Error('Not authenticated'); }
  return accessToken;
}

// ============================================
// GOOGLE SHEETS API
// ============================================

const SHEET_NAME = 'Transactions';
const SHEET_RANGE = `${SHEET_NAME}!A:F`;

async function sheetsAPI(method, range, body, queryParams) {
  const token = await ensureToken();
  let url = `https://sheets.googleapis.com/v4/spreadsheets/${Config.sheetId}/values/${range}`;
  if (queryParams) url += '?' + new URLSearchParams(queryParams).toString();

  const opts = { method, headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' } };
  if (body) opts.body = JSON.stringify(body);

  const res = await fetch(url, opts);

  if (res.status === 401) {
    accessToken = null; updateAuthUI(false);
    showToast('Sesi habis, silakan sign in ulang', 'error');
    throw new Error('Token expired');
  }
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || `Sheets API error ${res.status}`);
  }
  return res.json();
}

async function appendRow(row) {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${Config.sheetId}/values/${SHEET_RANGE}:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`;
  const token = await ensureToken();
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ values: [row] }),
  });
  if (res.status === 401) { accessToken = null; updateAuthUI(false); showToast('Sesi habis', 'error'); throw new Error('Token expired'); }
  if (!res.ok) { const err = await res.json().catch(() => ({})); throw new Error(err.error?.message || 'Sheets error'); }
  const data = await res.json();
  // Extract row number from updatedRange like "Transactions!A5:F5"
  const match = data.updates?.updatedRange?.match(/!A(\d+):/);
  return match ? parseInt(match[1], 10) : null;
}

async function updateRow(sheetRow, row) {
  const range = `${SHEET_NAME}!A${sheetRow}:F${sheetRow}`;
  return sheetsAPI('PUT', range, { values: [row] }, { valueInputOption: 'USER_ENTERED' });
}

async function readAllRows() {
  const data = await sheetsAPI('GET', SHEET_RANGE);
  return data.values || [];
}

async function initSheetHeaders() {
  try {
    await ensureToken();
    const token = accessToken;
    const checkUrl = `https://sheets.googleapis.com/v4/spreadsheets/${Config.sheetId}`;
    const metaRes = await fetch(checkUrl, { headers: { 'Authorization': `Bearer ${token}` } });
    if (!metaRes.ok) { showToast('Gagal akses Sheet. Cek Sheet ID.', 'error'); return; }

    const meta = await metaRes.json();
    if (!meta.sheets?.some(s => s.properties?.title === SHEET_NAME)) {
      await fetch(`${checkUrl}:batchUpdate`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ requests: [{ addSheet: { properties: { title: SHEET_NAME } } }] }),
      });
    }

    const headerUrl = `https://sheets.googleapis.com/v4/spreadsheets/${Config.sheetId}/values/${SHEET_NAME}!A1:F1?valueInputOption=USER_ENTERED`;
    await fetch(headerUrl, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ values: [['Timestamp', 'Description', 'Amount', 'Category', 'Month', 'Week']] }),
    });
    showToast('Headers berhasil dibuat ✓', 'success');
  } catch (e) { showToast('Error: ' + e.message, 'error'); }
}

// ============================================
// INPUT — Auto-Save (No Confirmation Step)
// ============================================

async function handleSubmit() {
  const descEl = document.getElementById('input-desc');
  const amtEl  = document.getElementById('input-amount');
  const btn    = document.getElementById('btn-submit');
  const btnText = document.getElementById('btn-submit-text');
  const btnLoader = document.getElementById('btn-submit-loader');

  const description = descEl.value.trim();
  const amount = parseInt(amtEl.value.replace(/[^\d]/g, ''), 10);

  if (!description) { showToast('Isi deskripsi dulu', 'error'); descEl.focus(); return; }
  if (!amount || amount <= 0) { showToast('Isi jumlah yang valid', 'error'); amtEl.focus(); return; }
  if (!accessToken) { showToast('Sign in ke Google dulu di Settings', 'error'); return; }
  if (!Config.sheetId) { showToast('Isi Sheet ID dulu di Settings', 'error'); return; }

  // Auto-categorize instantly
  const category = categorize(description);

  btn.disabled = true;
  btnText.textContent = 'Menyimpan...';
  btnLoader.classList.remove('hidden');

  try {
    const now = new Date();
    const timestamp = now.toLocaleString('id-ID', {
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit', second: '2-digit',
    });
    const monthStr = MONTH_NAMES[now.getMonth()] + ' ' + now.getFullYear();
    const weekStr  = `Week ${getWeekNumber(now)}`;

    const row = [timestamp, description, amount, category, monthStr, weekStr];
    const sheetRow = await appendRow(row);

    const cat = CATEGORIES.find(c => c.name === category) || CATEGORIES[9];
    showToast(`${cat.emoji} ${category} — Rp ${amount.toLocaleString('id-ID')} ✓`, 'success');

    // Add to recent with sheetRow for editing
    recentItems.unshift({ timestamp, description, amount, category, month: monthStr, week: weekStr, sheetRow });
    if (recentItems.length > 5) recentItems.pop();
    renderRecent();

    // Clear form
    descEl.value = '';
    amtEl.value = '';
    descEl.focus();

  } catch (e) {
    showToast('Gagal simpan: ' + e.message, 'error');
  } finally {
    btn.disabled = false;
    btnText.textContent = 'Tambah Pengeluaran';
    btnLoader.classList.add('hidden');
  }
}

// ============================================
// RECENT LIST (Input Tab)
// ============================================

function renderRecent() {
  const el = document.getElementById('recent-list');
  if (recentItems.length === 0) {
    el.innerHTML = '<p class="empty-state">Belum ada pengeluaran hari ini</p>';
    return;
  }
  el.innerHTML = recentItems.map((tx, i) => {
    const cat = CATEGORIES.find(c => c.name === tx.category) || CATEGORIES[9];
    return `<div class="transaction-item" onclick="openEdit('recent', ${i})">
      <span class="tx-emoji">${cat.emoji}</span>
      <div class="tx-details">
        <div class="tx-desc">${escHtml(tx.description)}</div>
        <div class="tx-cat">${tx.category}</div>
      </div>
      <div class="tx-right">
        <div class="tx-amount">Rp ${tx.amount.toLocaleString('id-ID')}</div>
      </div>
      <span class="tx-edit-hint">✎</span>
    </div>`;
  }).join('');
}

// ============================================
// EDIT MODAL
// ============================================

function openEdit(source, index) {
  const tx = source === 'recent' ? recentItems[index] : allTransactions[index];
  if (!tx) return;

  editTarget = { source, index, sheetRow: tx.sheetRow, original: { ...tx } };

  document.getElementById('edit-desc').value = tx.description;
  document.getElementById('edit-amount').value = tx.amount.toLocaleString('id-ID');

  // Render category chips
  const chipsEl = document.getElementById('edit-category-chips');
  chipsEl.innerHTML = CATEGORIES.map(cat => {
    const sel = cat.name === tx.category;
    return `<button class="cat-chip ${sel ? 'selected' : ''}"
              style="${sel ? `background:${cat.color};border-color:${cat.color}` : ''}"
              data-cat="${cat.name}"
              onclick="selectEditCategory(this, '${cat.name}')">
              ${cat.emoji} ${cat.name}
            </button>`;
  }).join('');

  document.getElementById('edit-modal').classList.remove('hidden');
}

function selectEditCategory(el, name) {
  document.querySelectorAll('#edit-category-chips .cat-chip').forEach(chip => {
    const cat = CATEGORIES.find(c => c.name === chip.dataset.cat);
    if (cat && cat.name === name) {
      chip.classList.add('selected');
      chip.style.background = cat.color;
      chip.style.borderColor = cat.color;
    } else {
      chip.classList.remove('selected');
      chip.style.background = '';
      chip.style.borderColor = '';
    }
  });
}

function getSelectedEditCategory() {
  const sel = document.querySelector('#edit-category-chips .cat-chip.selected');
  return sel ? sel.dataset.cat : 'Others';
}

async function saveEdit() {
  if (!editTarget) return;

  const newDesc = document.getElementById('edit-desc').value.trim();
  const newAmount = parseInt(document.getElementById('edit-amount').value.replace(/[^\d]/g, ''), 10);
  const newCategory = getSelectedEditCategory();

  if (!newDesc) { showToast('Deskripsi tidak boleh kosong', 'error'); return; }
  if (!newAmount || newAmount <= 0) { showToast('Jumlah tidak valid', 'error'); return; }

  const tx = editTarget.source === 'recent' ? recentItems[editTarget.index] : allTransactions[editTarget.index];

  // Update the row in Google Sheet
  if (editTarget.sheetRow) {
    try {
      const row = [tx.timestamp, newDesc, newAmount, newCategory, tx.month, tx.week];
      await updateRow(editTarget.sheetRow, row);
      showToast('Berhasil diupdate ✓', 'success');
    } catch (e) {
      showToast('Gagal update: ' + e.message, 'error');
      return;
    }
  }

  // Update local state
  tx.description = newDesc;
  tx.amount = newAmount;
  tx.category = newCategory;

  // Re-render
  if (editTarget.source === 'recent') {
    renderRecent();
  } else {
    renderHistoryList(document.getElementById('history-list'));
  }

  closeEdit();
}

function closeEdit() {
  document.getElementById('edit-modal').classList.add('hidden');
  editTarget = null;
}

function closeEditIfOverlay(event) {
  if (event.target === document.getElementById('edit-modal')) closeEdit();
}

// ============================================
// HISTORY TAB
// ============================================

async function loadHistory() {
  if (!accessToken || !Config.sheetId) { showToast('Sign in dan isi Sheet ID dulu', 'error'); return; }

  const listEl = document.getElementById('history-list');
  listEl.innerHTML = '<p class="empty-state">Memuat...</p>';

  try {
    const rows = await readAllRows();
    if (rows.length <= 1) { listEl.innerHTML = '<p class="empty-state">Belum ada data</p>'; return; }

    allTransactions = rows.slice(1).map((r, i) => ({
      timestamp: r[0] || '',
      description: r[1] || '',
      amount: parseInt((r[2] || '0').toString().replace(/[^\d]/g, ''), 10),
      category: r[3] || 'Others',
      month: r[4] || '',
      week: r[5] || '',
      sheetRow: i + 2, // row 1 is header, data starts at row 2
    })).reverse();

    renderHistoryList(listEl);
  } catch (e) {
    listEl.innerHTML = `<p class="empty-state">Error: ${e.message}</p>`;
  }
}

function renderHistoryList(el) {
  if (allTransactions.length === 0) { el.innerHTML = '<p class="empty-state">Belum ada data</p>'; return; }

  let html = '';
  let lastDate = '';

  allTransactions.forEach((tx, i) => {
    const dateStr = tx.timestamp.split(',')[0] || tx.timestamp.split(' ')[0] || '';
    if (dateStr !== lastDate) {
      html += `<div class="history-date-group">${dateStr}</div>`;
      lastDate = dateStr;
    }
    const cat = CATEGORIES.find(c => c.name === tx.category) || CATEGORIES[9];
    html += `<div class="transaction-item" onclick="openEdit('history', ${i})">
      <span class="tx-emoji">${cat.emoji}</span>
      <div class="tx-details">
        <div class="tx-desc">${escHtml(tx.description)}</div>
        <div class="tx-cat">${tx.category}</div>
      </div>
      <div class="tx-right">
        <div class="tx-amount">Rp ${tx.amount.toLocaleString('id-ID')}</div>
      </div>
      <span class="tx-edit-hint">✎</span>
    </div>`;
  });

  el.innerHTML = html;
}

// ============================================
// DASHBOARD
// ============================================

function changeMonth(delta) {
  dashboardMonth.setMonth(dashboardMonth.getMonth() + delta);
  updateMonthLabel();
  renderDashboardData();
}

function updateMonthLabel() {
  document.getElementById('dashboard-month').textContent =
    MONTH_NAMES[dashboardMonth.getMonth()] + ' ' + dashboardMonth.getFullYear();
}

async function loadDashboard() {
  if (!accessToken || !Config.sheetId) { showToast('Sign in dan isi Sheet ID dulu', 'error'); return; }
  showToast('Memuat dashboard...', 'info');
  try {
    const rows = await readAllRows();
    allTransactions = rows.slice(1).map((r, i) => ({
      timestamp: r[0] || '', description: r[1] || '',
      amount: parseInt((r[2] || '0').toString().replace(/[^\d]/g, ''), 10),
      category: r[3] || 'Others', month: r[4] || '', week: r[5] || '',
      sheetRow: i + 2,
    })).reverse();
    renderDashboardData();
  } catch (e) { showToast('Error: ' + e.message, 'error'); }
}

function renderDashboardData() {
  updateMonthLabel();
  const targetMonth = MONTH_NAMES[dashboardMonth.getMonth()] + ' ' + dashboardMonth.getFullYear();
  const filtered = allTransactions.filter(tx => tx.month === targetMonth);

  const total = filtered.reduce((s, tx) => s + tx.amount, 0);
  const daysInMonth = new Date(dashboardMonth.getFullYear(), dashboardMonth.getMonth() + 1, 0).getDate();
  const today = new Date();
  const daysSoFar = (dashboardMonth.getFullYear() === today.getFullYear() && dashboardMonth.getMonth() === today.getMonth())
    ? today.getDate() : daysInMonth;
  const avg = daysSoFar > 0 ? Math.round(total / daysSoFar) : 0;

  const catTotals = {};
  filtered.forEach(tx => { catTotals[tx.category] = (catTotals[tx.category] || 0) + tx.amount; });
  const topCat = Object.entries(catTotals).sort((a, b) => b[1] - a[1])[0];

  document.getElementById('sum-total').textContent = 'Rp ' + total.toLocaleString('id-ID');
  document.getElementById('sum-avg').textContent = 'Rp ' + avg.toLocaleString('id-ID');
  document.getElementById('sum-top').textContent = topCat
    ? `${(CATEGORIES.find(c => c.name === topCat[0]) || {}).emoji || ''} ${topCat[0]}` : '-';

  renderPieChart(catTotals);

  const dailyTotals = {};
  filtered.forEach(tx => {
    const day = tx.timestamp.split(',')[0] || tx.timestamp.split(' ')[0] || 'unknown';
    dailyTotals[day] = (dailyTotals[day] || 0) + tx.amount;
  });
  renderBarChart(dailyTotals);
}

function renderPieChart(catTotals) {
  const ctx = document.getElementById('chart-pie');
  const labels = [], data = [], colors = [];
  Object.entries(catTotals).sort((a, b) => b[1] - a[1]).forEach(([name, amount]) => {
    const cat = CATEGORIES.find(c => c.name === name);
    labels.push((cat?.emoji || '') + ' ' + name);
    data.push(amount);
    colors.push(cat?.color || '#94a3b8');
  });
  if (pieChart) pieChart.destroy();
  if (data.length === 0) { pieChart = null; return; }
  pieChart = new Chart(ctx, {
    type: 'doughnut',
    data: { labels, datasets: [{ data, backgroundColor: colors, borderWidth: 0 }] },
    options: {
      responsive: true,
      plugins: {
        legend: { position: 'bottom', labels: { font: { family: 'Inter', size: 11 }, padding: 12 } },
        tooltip: { callbacks: { label: (item) => `Rp ${item.raw.toLocaleString('id-ID')}` } },
      },
    },
  });
}

function renderBarChart(dailyTotals) {
  const ctx = document.getElementById('chart-bar');
  const sorted = Object.entries(dailyTotals).sort((a, b) => a[0].localeCompare(b[0]));
  const labels = sorted.map(([d]) => d);
  const data = sorted.map(([, v]) => v);
  if (barChart) barChart.destroy();
  if (data.length === 0) { barChart = null; return; }
  barChart = new Chart(ctx, {
    type: 'bar',
    data: { labels, datasets: [{ data, backgroundColor: '#1e3a5f', borderRadius: 4 }] },
    options: {
      responsive: true,
      plugins: { legend: { display: false }, tooltip: { callbacks: { label: (item) => `Rp ${item.raw.toLocaleString('id-ID')}` } } },
      scales: {
        x: { ticks: { font: { family: 'Inter', size: 10 }, maxRotation: 45 }, grid: { display: false } },
        y: { ticks: { font: { family: 'Inter', size: 10 }, callback: (v) => v >= 1000000 ? (v/1000000).toFixed(1)+'jt' : v >= 1000 ? (v/1000)+'rb' : v } },
      },
    },
  });
}

// ============================================
// TAB NAVIGATION
// ============================================

function switchTab(tab) {
  document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(el => el.classList.remove('active'));
  document.getElementById('tab-' + tab).classList.add('active');
  document.querySelector(`.nav-btn[data-tab="${tab}"]`).classList.add('active');

  if (tab === 'history' && allTransactions.length === 0 && accessToken) loadHistory();
  if (tab === 'dashboard' && allTransactions.length === 0 && accessToken) loadDashboard();
  if (tab === 'dashboard') { updateMonthLabel(); if (allTransactions.length > 0) renderDashboardData(); }
}

// ============================================
// SETTINGS
// ============================================

function loadSettingsUI() {
  document.getElementById('set-client-id').value = Config.clientId;
  document.getElementById('set-sheet-id').value = Config.sheetId;
}

function saveGoogleSettings() {
  const clientId = document.getElementById('set-client-id').value.trim();
  const sheetId  = document.getElementById('set-sheet-id').value.trim();
  if (!clientId) { showToast('Client ID tidak boleh kosong', 'error'); return; }
  if (!sheetId)  { showToast('Sheet ID tidak boleh kosong', 'error'); return; }
  Config.set('clientId', clientId);
  Config.set('sheetId', sheetId);
  tryInitGoogle();
  showToast('Google settings tersimpan ✓', 'success');
}

// ============================================
// UTILITIES
// ============================================

function showToast(message, type = 'info') {
  const el = document.getElementById('toast');
  el.textContent = message;
  el.className = `toast ${type} show`;
  clearTimeout(el._timer);
  el._timer = setTimeout(() => el.classList.remove('show'), 2500);
}

function escHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function getWeekNumber(date) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
}
