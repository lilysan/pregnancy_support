// Language and UI text
// Split from blood_pressure/index.html. Loaded as a classic script.

const LANG_STORAGE_KEY = "pressure_ui_lang";
const GUIDE_VISIBLE_KEY = "pressure_guide_visible";
const currentPage = "blood_pressure";
const LANGUAGE_OPTIONS = [
  {
    code: "en-US",
    label: "英語編(English)",
  },
  {
    code: "zh",
    label: "中国語編(中文版)",
  },
  {
    code: "fr",
    label: "フランス語編(French)",
  },
  {
    code: "ko",
    label: "韓国語編(Korean)",
  },
  {
    code: "pr",
    label: "ポルトガル語編(Portugues)",
  },
  {
    code: "tl",
    label: "タガログ語編(TAGALOG)",
  },
  {
    code: "ve",
    label: "ベトナム語編(Vietnam)",
  },
  {
    code: "th",
    label: "タイ語編(Thai)",
  },
  {
    code: "de",
    label: "ドイツ語編(German)",
  },
  {
    code: "id",
    label: "インドネシア語(Indonesia)",
  },
  {
    code: "ru",
    label: "ロシア語(Russian)",
  },
  {
    code: "ne",
    label: "ネパール語(Nepali)",
  },
  {
    code: "lo",
    label: "ラオス語(Laotian)",
  },
  {
    code: "uk",
    label: "ウクライナ語(Ukrainian)",
  },
  {
    code: "fa-AF",
    label: "ダリ語(Dari)",
  },
  {
    code: "si",
    label: "シンハラ語(Sinhala)",
  },
  {
    code: "ms",
    label: "マレー語(Malay)",
  },
  {
    code: "my",
    label: "ミャンマー語(Myanmar)",
  },
  {
    code: "bn",
    label: "ベンガル語(Bengali)",
  },
  {
    code: "ur",
    label: "ウルドゥー語(Urdu)",
  },
];
const UI_TEXT = {
  ja: {
    title: "血圧記録",
    settings: "設定",
    settingsTitle: "設定",
    language: "言語設定",
    guide: "ガイド表示",
    on: "表示中",
    off: "非表示",
    date: "日付",
    period: "時間",
    periodCol: "時間帯",
    morning: "朝",
    noon: "昼",
    night: "夜",
    high: "最高血圧",
    low: "最低血圧",
    medicine: "内服",
    medicineNone: "なし",
    medicineYes: "あり",
    add: "データを追加",
    older: "以前の情報をみる",
    noMore: "これ以上ありません",
    loading: "読み込み中...",
    register: "登録",
    chart: "グラフ",
    table: "テーブル",
    edit: "編集",
    save: "保存",
    cancel: "キャンセル",
    del: "削除",
    fillAll: "すべてのフィールドに値を入力してください。",
    systolic: "最高血圧 (mmHg)",
    diastolic: "最低血圧 (mmHg)",
    yAxis: "血圧 (mmHg)",
    xAxis: "日付と時間帯",
  },
  soft: {
    title: "けつあつの きろく",
    settings: "せってい",
    settingsTitle: "せってい",
    language: "ことばを えらぶ",
    guide: "ガイドを みせる",
    on: "みせています",
    off: "みせていません",
    date: "ひづけ",
    period: "じかん",
    periodCol: "じかんたい",
    morning: "あさ",
    noon: "ひる",
    night: "よる",
    high: "うえの けつあつ",
    low: "したの けつあつ",
    medicine: "のみぐすり",
    medicineNone: "なし",
    medicineYes: "あり",
    add: "データを いれる",
    older: "まえの きろくを みる",
    noMore: "これより まえの きろくは ありません",
    loading: "よみこんでいます...",
    register: "とうろく",
    chart: "グラフ",
    table: "ひょう",
    edit: "なおす",
    save: "ほぞん",
    cancel: "やめる",
    del: "けす",
    fillAll: "ぜんぶ いれてください。",
    systolic: "うえの けつあつ (mmHg)",
    diastolic: "したの けつあつ (mmHg)",
    yAxis: "けつあつ (mmHg)",
    xAxis: "ひづけと じかんたい",
  },
  "en-US": {
    title: "Blood Pressure Tracker",
    settings: "Settings",
    settingsTitle: "Settings",
    language: "Language",
    guide: "Guide Overlay",
    on: "On",
    off: "Off",
    date: "Date",
    period: "Time",
    periodCol: "Timing",
    morning: "Morning",
    noon: "Noon",
    night: "Night",
    high: "Systolic",
    low: "Diastolic",
    medicine: "Medication",
    medicineNone: "None",
    medicineYes: "Yes",
    add: "Add Data",
    older: "Show Older Data",
    noMore: "No More Data",
    loading: "Loading...",
    register: "Register",
    chart: "Chart",
    table: "Table",
    edit: "Edit",
    save: "Save",
    cancel: "Cancel",
    del: "Delete",
    fillAll: "Please fill all fields.",
    systolic: "Systolic (mmHg)",
    diastolic: "Diastolic (mmHg)",
    yAxis: "Blood Pressure (mmHg)",
    xAxis: "Date / Timing",
  },
  zh: {
    title: "血压记录",
    settings: "设置",
    settingsTitle: "设置",
    language: "语言设置",
    guide: "显示指南",
    on: "显示",
    off: "隐藏",
    date: "日期",
    period: "时间",
    periodCol: "时段",
    morning: "早上",
    noon: "中午",
    night: "晚上",
    high: "收缩压",
    low: "舒张压",
    medicine: "服药",
    medicineNone: "无",
    medicineYes: "有",
    add: "添加数据",
    older: "查看更早信息",
    noMore: "没有更多数据",
    loading: "加载中...",
    register: "登记",
    chart: "图表",
    table: "表格",
    edit: "编辑",
    save: "保存",
    cancel: "取消",
    del: "删除",
    fillAll: "请填写所有项目。",
    systolic: "收缩压 (mmHg)",
    diastolic: "舒张压 (mmHg)",
    yAxis: "血压 (mmHg)",
    xAxis: "日期 / 时段",
  },
  de: {
    title: "Blutdruckprotokoll",
    settings: "Einstellungen",
    settingsTitle: "Einstellungen",
    language: "Sprache",
    guide: "Leitflaeche",
    on: "An",
    off: "Aus",
    date: "Datum",
    period: "Zeit",
    periodCol: "Zeitfenster",
    morning: "Morgen",
    noon: "Mittag",
    night: "Abend",
    high: "Systolisch",
    low: "Diastolisch",
    medicine: "Medikamente",
    medicineNone: "Keine",
    medicineYes: "Ja",
    add: "Daten hinzufuegen",
    older: "Ältere Daten anzeigen",
    noMore: "Keine weiteren Daten",
    loading: "Wird geladen...",
    register: "Registrieren",
    chart: "Diagramm",
    table: "Tabelle",
    edit: "Bearbeiten",
    save: "Speichern",
    cancel: "Abbrechen",
    del: "Loeschen",
    fillAll: "Bitte alle Felder ausfuellen.",
    systolic: "Systolisch (mmHg)",
    diastolic: "Diastolisch (mmHg)",
    yAxis: "Blutdruck (mmHg)",
    xAxis: "Datum / Zeit",
  },
  ve: {
    title: "Theo doi huyet ap",
    settings: "Cai dat",
    settingsTitle: "Cai dat",
    language: "Ngon ngu",
    guide: "Hien thi huong dan",
    on: "Bat",
    off: "Tat",
    date: "Ngay",
    period: "Thoi gian",
    periodCol: "Khung gio",
    morning: "Sang",
    noon: "Trua",
    night: "Toi",
    high: "Huyet ap toi da",
    low: "Huyet ap toi thieu",
    medicine: "Thuốc uống",
    medicineNone: "Không",
    medicineYes: "Có",
    add: "Them du lieu",
    older: "Xem dữ liệu cũ hơn",
    noMore: "Không còn dữ liệu",
    loading: "Đang tải...",
    register: "Đăng ký",
    chart: "Bieu do",
    table: "Bang",
    edit: "Chinh sua",
    save: "Luu",
    cancel: "Huy",
    del: "Xoa",
    fillAll: "Vui long nhap day du.",
    systolic: "Huyet ap toi da (mmHg)",
    diastolic: "Huyet ap toi thieu (mmHg)",
    yAxis: "Huyet ap (mmHg)",
    xAxis: "Ngay / Thoi gian",
  },
  pr: {
    title: "Registro de pressao",
    settings: "Configuracoes",
    settingsTitle: "Configuracoes",
    language: "Idioma",
    guide: "Mostrar guia",
    on: "Ligado",
    off: "Desligado",
    date: "Data",
    period: "Horario",
    periodCol: "Turno",
    morning: "Manha",
    noon: "Meio-dia",
    night: "Noite",
    high: "Sistolica",
    low: "Diastolica",
    medicine: "Medicação",
    medicineNone: "Nenhuma",
    medicineYes: "Sim",
    add: "Adicionar dados",
    older: "Ver dados anteriores",
    noMore: "Não há mais dados",
    loading: "Carregando...",
    register: "Registrar",
    chart: "Grafico",
    table: "Tabela",
    edit: "Editar",
    save: "Salvar",
    cancel: "Cancelar",
    del: "Excluir",
    fillAll: "Preencha todos os campos.",
    systolic: "Sistolica (mmHg)",
    diastolic: "Diastolica (mmHg)",
    yAxis: "Pressao arterial (mmHg)",
    xAxis: "Data / Horario",
  },
  ko: {
    title: "혈압 기록",
    settings: "설정",
    settingsTitle: "설정",
    language: "언어 설정",
    guide: "가이드 표시",
    on: "표시",
    off: "숨김",
    date: "날짜",
    period: "시간",
    periodCol: "시간대",
    morning: "아침",
    noon: "점심",
    night: "저녁",
    high: "최고 혈압",
    low: "최저 혈압",
    medicine: "복약",
    medicineNone: "없음",
    medicineYes: "있음",
    add: "데이터 추가",
    older: "이전 정보 보기",
    noMore: "더 이상 데이터가 없습니다",
    loading: "불러오는 중...",
    register: "등록",
    chart: "그래프",
    table: "테이블",
    edit: "편집",
    save: "저장",
    cancel: "취소",
    del: "삭제",
    fillAll: "모든 항목을 입력하세요.",
    systolic: "최고 혈압 (mmHg)",
    diastolic: "최저 혈압 (mmHg)",
    yAxis: "혈압 (mmHg)",
    xAxis: "날짜 / 시간대",
  },
  fr: {
    title: "Suivi de la tension",
    settings: "Parametres",
    settingsTitle: "Parametres",
    language: "Langue",
    guide: "Affichage du guide",
    on: "Actif",
    off: "Inactif",
    date: "Date",
    period: "Heure",
    periodCol: "Creneau",
    morning: "Matin",
    noon: "Midi",
    night: "Soir",
    high: "Systolique",
    low: "Diastolique",
    medicine: "Médicaments",
    medicineNone: "Aucun",
    medicineYes: "Oui",
    add: "Ajouter",
    older: "Voir les données précédentes",
    noMore: "Aucune autre donnée",
    loading: "Chargement...",
    register: "Enregistrer",
    chart: "Graphique",
    table: "Tableau",
    edit: "Modifier",
    save: "Enregistrer",
    cancel: "Annuler",
    del: "Supprimer",
    fillAll: "Veuillez remplir tous les champs.",
    systolic: "Systolique (mmHg)",
    diastolic: "Diastolique (mmHg)",
    yAxis: "Tension arterielle (mmHg)",
    xAxis: "Date / Creneau",
  },
  tl: {
    title: "Talaan ng presyon ng dugo",
    settings: "Mga setting",
    settingsTitle: "Mga setting",
    language: "Wika",
    guide: "Ipakita ang gabay",
    on: "Naka-on",
    off: "Naka-off",
    date: "Petsa",
    period: "Oras",
    periodCol: "Panahon",
    morning: "Umaga",
    noon: "Tanghali",
    night: "Gabi",
    high: "Systolic",
    low: "Diastolic",
    medicine: "Gamot",
    medicineNone: "Wala",
    medicineYes: "Meron",
    add: "Magdagdag ng datos",
    older: "Tingnan ang mas lumang datos",
    noMore: "Wala nang ibang datos",
    loading: "Naglo-load...",
    register: "Irehistro",
    chart: "Grap",
    table: "Talahanayan",
    edit: "I-edit",
    save: "I-save",
    cancel: "Kanselahin",
    del: "Burahin",
    fillAll: "Pakilagyan ang lahat ng field.",
    systolic: "Systolic (mmHg)",
    diastolic: "Diastolic (mmHg)",
    yAxis: "Presyon ng dugo (mmHg)",
    xAxis: "Petsa / Panahon",
  },
  th: {
    title: "บันทึกความดันโลหิต",
    settings: "การตั้งค่า",
    settingsTitle: "การตั้งค่า",
    language: "ภาษา",
    guide: "แสดงไกด์",
    on: "เปิด",
    off: "ปิด",
    date: "วันที่",
    period: "เวลา",
    periodCol: "ช่วงเวลา",
    morning: "เช้า",
    noon: "เที่ยง",
    night: "เย็น",
    high: "ความดันตัวบน",
    low: "ความดันตัวล่าง",
    medicine: "ยารับประทาน",
    medicineNone: "ไม่มี",
    medicineYes: "มี",
    add: "เพิ่มข้อมูล",
    older: "ดูข้อมูลก่อนหน้า",
    noMore: "ไม่มีข้อมูลเพิ่มเติม",
    loading: "กำลังโหลด...",
    register: "ลงทะเบียน",
    chart: "กราฟ",
    table: "ตาราง",
    edit: "แก้ไข",
    save: "บันทึก",
    cancel: "ยกเลิก",
    del: "ลบ",
    fillAll: "กรุณากรอกข้อมูลให้ครบ",
    systolic: "ความดันตัวบน (mmHg)",
    diastolic: "ความดันตัวล่าง (mmHg)",
    yAxis: "ความดันโลหิต (mmHg)",
    xAxis: "วันที่ / ช่วงเวลา",
  },
  id: {
    title: "Catatan tekanan darah",
    settings: "Pengaturan",
    settingsTitle: "Pengaturan",
    language: "Bahasa",
    guide: "Tampilkan panduan",
    on: "Aktif",
    off: "Nonaktif",
    date: "Tanggal",
    period: "Waktu",
    periodCol: "Periode",
    morning: "Pagi",
    noon: "Siang",
    night: "Malam",
    high: "Sistolik",
    low: "Diastolik",
    medicine: "Obat",
    medicineNone: "Tidak ada",
    medicineYes: "Ada",
    add: "Tambah data",
    older: "Lihat data sebelumnya",
    noMore: "Tidak ada data lagi",
    loading: "Memuat...",
    register: "Daftar",
    chart: "Grafik",
    table: "Tabel",
    edit: "Edit",
    save: "Simpan",
    cancel: "Batal",
    del: "Hapus",
    fillAll: "Silakan isi semua kolom.",
    systolic: "Sistolik (mmHg)",
    diastolic: "Diastolik (mmHg)",
    yAxis: "Tekanan darah (mmHg)",
    xAxis: "Tanggal / Periode",
  },
  ru: {
    title: "Дневник давления",
    settings: "Настройки",
    settingsTitle: "Настройки",
    language: "Язык",
    guide: "Показывать подсказку",
    on: "Вкл",
    off: "Выкл",
    date: "Дата",
    period: "Время",
    periodCol: "Период",
    morning: "Утро",
    noon: "День",
    night: "Вечер",
    high: "Систолическое",
    low: "Диастолическое",
    medicine: "Лекарства",
    medicineNone: "Нет",
    medicineYes: "Да",
    add: "Добавить данные",
    older: "Посмотреть предыдущие данные",
    noMore: "Больше данных нет",
    loading: "Загрузка...",
    register: "Зарегистрировать",
    chart: "График",
    table: "Таблица",
    edit: "Редактировать",
    save: "Сохранить",
    cancel: "Отмена",
    del: "Удалить",
    fillAll: "Пожалуйста, заполните все поля.",
    systolic: "Систолическое (mmHg)",
    diastolic: "Диастолическое (mmHg)",
    yAxis: "Давление (mmHg)",
    xAxis: "Дата / Период",
  },
  ne: {
    title: "रक्तचाप रेकर्ड",
    settings: "सेटिङ",
    settingsTitle: "सेटिङ",
    language: "भाषा",
    guide: "मार्गदर्शन देखाउने",
    on: "खुला",
    off: "बन्द",
    date: "मिति",
    period: "समय",
    periodCol: "समय भाग",
    morning: "बिहान",
    noon: "दिउँसो",
    night: "साँझ",
    high: "सिस्टोलिक",
    low: "डायस्टोलिक",
    medicine: "औषधि",
    medicineNone: "छैन",
    medicineYes: "छ",
    add: "डाटा थप्नुहोस्",
    older: "पुरानो जानकारी हेर्नुहोस्",
    noMore: "थप जानकारी छैन",
    loading: "लोड हुँदैछ...",
    register: "दर्ता",
    chart: "ग्राफ",
    table: "तालिका",
    edit: "सम्पादन",
    save: "सेभ",
    cancel: "रद्द",
    del: "मेटाउनुहोस्",
    fillAll: "कृपया सबै फिल्ड भर्नुहोस्।",
    systolic: "सिस्टोलिक (mmHg)",
    diastolic: "डायस्टोलिक (mmHg)",
    yAxis: "रक्तचाप (mmHg)",
    xAxis: "मिति / समय",
  },
  lo: {
    title: "ບັນທຶກຄວາມດັນເລືອດ",
    settings: "ຕັ້ງຄ່າ",
    settingsTitle: "ຕັ້ງຄ່າ",
    language: "ພາສາ",
    guide: "ສະແດງແນະນຳ",
    on: "ເປີດ",
    off: "ປິດ",
    date: "ວັນທີ",
    period: "ເວລາ",
    periodCol: "ຊ່ວງເວລາ",
    morning: "ເຊົ້າ",
    noon: "ຕອນທ່ຽງ",
    night: "ແລງ",
    high: "ຄວາມດັນເທິງ",
    low: "ຄວາມດັນລຸ່ມ",
    medicine: "ຢາກິນ",
    medicineNone: "ບໍ່ມີ",
    medicineYes: "ມີ",
    add: "ເພີ່ມຂໍ້ມູນ",
    older: "ເບິ່ງຂໍ້ມູນກ່ອນໜ້າ",
    noMore: "ບໍ່ມີຂໍ້ມູນເພີ່ມແລ້ວ",
    loading: "ກຳລັງໂຫຼດ...",
    register: "ລົງທະບຽນ",
    chart: "ກຣາບ",
    table: "ຕາຕະລາງ",
    edit: "ແກ້ໄຂ",
    save: "ບັນທຶກ",
    cancel: "ຍົກເລີກ",
    del: "ລົບ",
    fillAll: "ກະລຸນາປ້ອນຂໍ້ມູນໃຫ້ຄົບ.",
    systolic: "ຄວາມດັນເທິງ (mmHg)",
    diastolic: "ຄວາມດັນລຸ່ມ (mmHg)",
    yAxis: "ຄວາມດັນເລືອດ (mmHg)",
    xAxis: "ວັນທີ / ຊ່ວງເວລາ",
  },
  uk: {
    title: "Запис артеріального тиску",
    settings: "Налаштування",
    settingsTitle: "Налаштування",
    language: "Мова",
    guide: "Показувати підказку",
    on: "Увімкнено",
    off: "Вимкнено",
    date: "Дата",
    period: "Час",
    periodCol: "Період",
    morning: "Ранок",
    noon: "День",
    night: "Вечір",
    high: "Систолічний",
    low: "Діастолічний",
    medicine: "Ліки",
    medicineNone: "Немає",
    medicineYes: "Є",
    add: "Додати дані",
    older: "Переглянути попередні дані",
    noMore: "Більше даних немає",
    loading: "Завантаження...",
    register: "Зареєструвати",
    chart: "Графік",
    table: "Таблиця",
    edit: "Редагувати",
    save: "Зберегти",
    cancel: "Скасувати",
    del: "Видалити",
    fillAll: "Будь ласка, заповніть усі поля.",
    systolic: "Систолічний (mmHg)",
    diastolic: "Діастолічний (mmHg)",
    yAxis: "Тиск (mmHg)",
    xAxis: "Дата / Період",
  },
  "fa-AF": {
    title: "ثبت فشار خون",
    settings: "تنظیمات",
    settingsTitle: "تنظیمات",
    language: "زبان",
    guide: "نمایش راهنما",
    on: "روشن",
    off: "خاموش",
    date: "تاریخ",
    period: "زمان",
    periodCol: "بازه",
    morning: "صبح",
    noon: "چاشت",
    night: "شب",
    high: "فشار سیستولیک",
    low: "فشار دیاستولیک",
    medicine: "دوا",
    medicineNone: "ندارد",
    medicineYes: "دارد",
    add: "افزودن داده",
    older: "دیدن معلومات قبلی",
    noMore: "معلومات بیشتری وجود ندارد",
    loading: "در حال بارگذاری...",
    register: "ثبت",
    chart: "نمودار",
    table: "جدول",
    edit: "ویرایش",
    save: "ذخیره",
    cancel: "لغو",
    del: "حذف",
    fillAll: "لطفاً همه بخش‌ها را پر کنید.",
    systolic: "فشار سیستولیک (mmHg)",
    diastolic: "فشار دیاستولیک (mmHg)",
    yAxis: "فشار خون (mmHg)",
    xAxis: "تاریخ / بازه",
  },
  si: {
    title: "රුධිර පීඩන සටහන",
    settings: "සැකසුම්",
    settingsTitle: "සැකසුම්",
    language: "භාෂාව",
    guide: "මාර්ගදර්ශකය පෙන්වන්න",
    on: "සක්‍රිය",
    off: "අක්‍රිය",
    date: "දිනය",
    period: "වේලාව",
    periodCol: "කාල පරාසය",
    morning: "උදේ",
    noon: "දහවල්",
    night: "සවස",
    high: "උපරිම පීඩනය",
    low: "අවම පීඩනය",
    medicine: "ඖෂධ",
    medicineNone: "නැත",
    medicineYes: "ඇත",
    add: "දත්ත එක් කරන්න",
    older: "පෙර තොරතුරු බලන්න",
    noMore: "තවත් දත්ත නොමැත",
    loading: "පූරණය වෙමින්...",
    register: "ලියාපදිංචි කරන්න",
    chart: "ප්‍රස්තාරය",
    table: "වගුව",
    edit: "සංස්කරණය",
    save: "සුරකින්න",
    cancel: "අවලංගු",
    del: "මකන්න",
    fillAll: "කරුණාකර සියලු ක්ෂේත්‍ර පුරවන්න.",
    systolic: "උපරිම පීඩනය (mmHg)",
    diastolic: "අවම පීඩනය (mmHg)",
    yAxis: "රුධිර පීඩනය (mmHg)",
    xAxis: "දිනය / කාල පරාසය",
  },
  ms: {
    title: "Rekod tekanan darah",
    settings: "Tetapan",
    settingsTitle: "Tetapan",
    language: "Bahasa",
    guide: "Paparan panduan",
    on: "Aktif",
    off: "Nyahaktif",
    date: "Tarikh",
    period: "Masa",
    periodCol: "Tempoh",
    morning: "Pagi",
    noon: "Tengah hari",
    night: "Malam",
    high: "Sistolik",
    low: "Diastolik",
    medicine: "Ubat",
    medicineNone: "Tiada",
    medicineYes: "Ada",
    add: "Tambah data",
    older: "Lihat data terdahulu",
    noMore: "Tiada lagi data",
    loading: "Memuatkan...",
    register: "Daftar",
    chart: "Graf",
    table: "Jadual",
    edit: "Sunting",
    save: "Simpan",
    cancel: "Batal",
    del: "Padam",
    fillAll: "Sila isi semua medan.",
    systolic: "Sistolik (mmHg)",
    diastolic: "Diastolik (mmHg)",
    yAxis: "Tekanan darah (mmHg)",
    xAxis: "Tarikh / Tempoh",
  },
  my: {
    title: "သွေးပေါင်ချိန် မှတ်တမ်း",
    settings: "ဆက်တင်",
    settingsTitle: "ဆက်တင်",
    language: "ဘာသာစကား",
    guide: "လမ်းညွှန် ပြရန်",
    on: "ဖွင့်",
    off: "ပိတ်",
    date: "ရက်စွဲ",
    period: "အချိန်",
    periodCol: "အချိန်ပိုင်း",
    morning: "မနက်",
    noon: "နေ့လယ်",
    night: "ည",
    high: "အပေါ်သွေးပေါင်",
    low: "အောက်သွေးပေါင်",
    medicine: "သောက်ဆေး",
    medicineNone: "မရှိ",
    medicineYes: "ရှိ",
    add: "ဒေတာထည့်ရန်",
    older: "ယခင်အချက်အလက်ကို ကြည့်ရန်",
    noMore: "နောက်ထပ်အချက်အလက် မရှိပါ",
    loading: "ဖွင့်နေသည်...",
    register: "စာရင်းသွင်းရန်",
    chart: "ဂရပ်",
    table: "ဇယား",
    edit: "ပြင်ဆင်ရန်",
    save: "သိမ်းရန်",
    cancel: "ပယ်ဖျက်",
    del: "ဖျက်ရန်",
    fillAll: "ကျေးဇူးပြု၍ အကွက်အားလုံးဖြည့်ပါ။",
    systolic: "အပေါ်သွေးပေါင် (mmHg)",
    diastolic: "အောက်သွေးပေါင် (mmHg)",
    yAxis: "သွေးပေါင်ချိန် (mmHg)",
    xAxis: "ရက်စွဲ / အချိန်ပိုင်း",
  },
  bn: {
    title: "রক্তচাপ রেকর্ড",
    settings: "সেটিংস",
    settingsTitle: "সেটিংস",
    language: "ভাষা",
    guide: "গাইড দেখান",
    on: "চালু",
    off: "বন্ধ",
    date: "তারিখ",
    period: "সময়",
    periodCol: "সময়কাল",
    morning: "সকাল",
    noon: "দুপুর",
    night: "রাত",
    high: "সিস্টোলিক",
    low: "ডায়াস্টোলিক",
    medicine: "ওষুধ",
    medicineNone: "নেই",
    medicineYes: "আছে",
    add: "ডাটা যোগ করুন",
    older: "আগের তথ্য দেখুন",
    noMore: "আর কোনো তথ্য নেই",
    loading: "লোড হচ্ছে...",
    register: "নিবন্ধন",
    chart: "গ্রাফ",
    table: "টেবিল",
    edit: "সম্পাদনা",
    save: "সংরক্ষণ",
    cancel: "বাতিল",
    del: "মুছুন",
    fillAll: "সব ঘর পূরণ করুন।",
    systolic: "সিস্টোলিক (mmHg)",
    diastolic: "ডায়াস্টোলিক (mmHg)",
    yAxis: "রক্তচাপ (mmHg)",
    xAxis: "তারিখ / সময়কাল",
  },
  ur: {
    title: "بلڈ پریشر ریکارڈ",
    settings: "ترتیبات",
    settingsTitle: "ترتیبات",
    language: "زبان",
    guide: "رہنمائی دکھائیں",
    on: "آن",
    off: "آف",
    date: "تاریخ",
    period: "وقت",
    periodCol: "دورانیہ",
    morning: "صبح",
    noon: "دوپہر",
    night: "رات",
    high: "سسٹولک",
    low: "ڈایاسٹولک",
    medicine: "دوا",
    medicineNone: "نہیں",
    medicineYes: "ہاں",
    add: "ڈیٹا شامل کریں",
    older: "پچھلی معلومات دیکھیں",
    noMore: "مزید معلومات نہیں ہیں",
    loading: "لوڈ ہو رہا ہے...",
    register: "رجسٹر",
    chart: "گراف",
    table: "ٹیبل",
    edit: "ترمیم",
    save: "محفوظ کریں",
    cancel: "منسوخ",
    del: "حذف",
    fillAll: "براہ کرم تمام خانے پُر کریں۔",
    systolic: "سسٹولک (mmHg)",
    diastolic: "ڈایاسٹولک (mmHg)",
    yAxis: "بلڈ پریشر (mmHg)",
    xAxis: "تاریخ / دورانیہ",
  },
};
var allData = [];
var token;
var dataArray = ["", "朝", "昼", "夜"];
var dataArray2 = ["", " 6:00", "18:00"];
let labels = [
  "12/1 朝",
  "12/1 夜",
  "12/2 朝",
  "12/2 夜",
  "12/3 朝",
  "12/3 夜",
];
let highData = [140, 130, 145, 135, 138, 128]; // 最高血圧データ
let lowData = [90, 85, 88, 83, 85, 80]; // 最低血圧データ

let selectedUiLang = "ja";
let showGuideOverlay = true;
let pressurePage = 1;
let hasOlderPressure = true;
let loadingOlderPressure = false;
let loadedWeekPages = 1;
let chartInstances = [];
var id;
const mockToday = new Date();

const MOCK_PRESSURE_ITEMS = Array.from(
  {
    length: 10,
  },
  function (_, index) {
    const d = new Date(mockToday);
    d.setDate(mockToday.getDate() - index);
    const date = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    return {
      itemId: `mock-${index + 1}`,
      date: date,
      period: (index % 3) + 1,
      high: 118 + (index % 5) * 6,
      low: 68 + (index % 4) * 5,
      medicine: index % 4 === 0 ? 1 : 0,
    };
  },
);

function resolveI18nLang(langCode) {
  if (langCode === "ja") return "ja";
  if (langCode === "zh") return "zh";
  return "en-US";
}

function tx(key, langCode = selectedUiLang) {
  const table =
    UI_TEXT[langCode] || UI_TEXT[resolveI18nLang(langCode)] || UI_TEXT.ja;
  return (table && table[key]) || (UI_TEXT.ja && UI_TEXT.ja[key]) || key;
}

function bt(key) {
  return tx(key, selectedUiLang);
}

function readMedicineRadioValue(name) {
  const checked = document.querySelector(`input[name="${name}"]:checked`);
  const value = checked ? String(checked.value || "").trim() : "なし";
  return value === "あり" ? 1 : 0;
}

function setMedicineRadioValue(name, value) {
  const targetValue = hasMedicineFlag(value) ? "あり" : "なし";
  const target = document.querySelector(
    `input[name="${name}"][value="${targetValue}"]`,
  );
  if (target) target.checked = true;
}

function hasMedicineFlag(value) {
  const normalized = String(value || "").trim();
  return (
    normalized !== "" &&
    normalized !== "なし" &&
    normalized !== "-" &&
    normalized !== "0" &&
    normalized !== "false" &&
    normalized !== "null" &&
    normalized !== "undefined"
  );
}

function medicineMark(value) {
  return hasMedicineFlag(value) ? "○" : "-";
}

function periodLabel(periodValue) {
  if (Number(periodValue) === 1) return bt("morning");
  if (Number(periodValue) === 2) return bt("noon");
  return bt("night");
}

function chartPeriodLabelLines(periodValue) {
  let key = "night";
  if (Number(periodValue) === 1) key = "morning";
  if (Number(periodValue) === 2) key = "noon";
  return [tx(key, selectedUiLang)];
}

function formatChartDateShort(dateStr) {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return String(dateStr || "");
  return `${d.getMonth() + 1}/${d.getDate()}`;
}

function parsePressureDateValue(value) {
  if (value instanceof Date && !isNaN(value.getTime())) return value;
  const raw = String(value || "").trim();
  if (!raw) return null;
  const normalized = raw.replace(/\./g, "/").replace(/-/g, "/");
  const d = new Date(normalized);
  if (isNaN(d.getTime())) return null;
  return d;
}

function formatDisplayDate(value) {
  const d = parsePressureDateValue(value);
  if (!d) return String(value || "");
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function getSortedPressureData() {
  const items = Array.isArray(allData) ? allData.slice() : [];
  return items.sort((a, b) => {
    const da = parsePressureDateValue(a && a.date);
    const db = parsePressureDateValue(b && b.date);
    const ta = da ? da.getTime() : 0;
    const tb = db ? db.getTime() : 0;
    if (ta !== tb) return ta - tb;
    return Number((a && a.period) || 0) - Number((b && b.period) || 0);
  });
}

function formatYmd(dateObj) {
  const m = dateObj.getMonth() + 1;
  const d = dateObj.getDate();
  return `${m}/${d}`;
}

function updateChartRangeTitle() {
  const titleEl = document.getElementById("chartRangeTitle");
  if (!titleEl) return;
  const today = new Date();
  const weekAgo = new Date(today);
  weekAgo.setDate(today.getDate() - 7);
  titleEl.textContent = `${formatYmd(weekAgo)}　ー　${formatYmd(today)}`;
}

function isSupportedLang(code) {
  return (
    code === "ja" ||
    code === "soft" ||
    LANGUAGE_OPTIONS.some((item) => item.code === code)
  );
}

function normalizeLangToUi(lang) {
  const raw = String(lang || "ja").toLowerCase();
  if (raw === "soft") return "soft";
  if (raw.startsWith("ja")) return "ja";
  if (raw.startsWith("zh")) return "zh";
  if (raw.startsWith("fr")) return "fr";
  if (raw.startsWith("ko")) return "ko";
  if (raw.startsWith("pt") || raw === "pr") return "pr";
  if (raw.startsWith("tl")) return "tl";
  if (raw.startsWith("vi") || raw === "ve") return "ve";
  if (raw.startsWith("th")) return "th";
  if (raw.startsWith("de")) return "de";
  if (raw.startsWith("id")) return "id";
  if (raw.startsWith("ru")) return "ru";
  if (raw.startsWith("ne")) return "ne";
  if (raw.startsWith("lo")) return "lo";
  if (raw.startsWith("uk")) return "uk";
  if (raw.startsWith("fa") || raw.startsWith("prs")) return "fa-AF";
  if (raw.startsWith("si")) return "si";
  if (raw.startsWith("ms")) return "ms";
  if (raw.startsWith("my")) return "my";
  if (raw.startsWith("bn")) return "bn";
  if (raw.startsWith("ur")) return "ur";
  return "en-US";
}

function renderLanguageOptions() {
  const list = document.getElementById("languageOptionList");
  if (!list) return;
  list.innerHTML = "";
  const jaBtn = document.createElement("button");
  jaBtn.type = "button";
  jaBtn.className =
    "language-option-btn" + (selectedUiLang === "ja" ? " active" : "");
  jaBtn.textContent = "やさしい日本語 / Japanese";
  jaBtn.onclick = () => setLanguage("ja");
  list.appendChild(jaBtn);
  LANGUAGE_OPTIONS.forEach((lang) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className =
      "language-option-btn" +
      (selectedUiLang === lang.code ? " active" : "");
    btn.textContent = lang.label;
    btn.onclick = () => setLanguage(lang.code);
    list.appendChild(btn);
  });
}

function applySettingsUi() {
  const toggleBtn = document.getElementById("guideToggleBtn");
  if (!toggleBtn) return;
  toggleBtn.textContent = showGuideOverlay ? bt("on") : bt("off");
  toggleBtn.classList.toggle("off", !showGuideOverlay);
}

function syncOlderButtons() {
  const label = loadingOlderPressure
    ? bt("loading")
    : hasOlderPressure
      ? bt("older")
      : bt("noMore");
  ["loadOlderChartBtn", "loadOlderTableBtn", "loadOlderEditBtn"].forEach(
    (id) => {
      const btn = document.getElementById(id);
      if (!btn) return;
      btn.textContent = label;
      btn.disabled = loadingOlderPressure || !hasOlderPressure;
    },
  );
}

function dedupePressureItems(items) {
  const map = new Map();
  (items || []).forEach((item) => {
    if (!item) return;
    const key = `${String(item.date || "")}|${Number(item.period || 0)}`;
    map.set(key, item);
  });
  return Array.from(map.values());
}

function fetchPressurePage(page, mergeMode) {
  const query = {
    unit: "date",
    limit: 7,
    page: page,
  };
  const req = loadData(token, "myPressure", query, mergeMode || "replace");
  return Promise.resolve(req).then((items) =>
    Array.isArray(items) ? items : [],
  );
}

function withTimeout(promise, ms) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error("Request timed out"));
    }, ms);
    Promise.resolve(promise).then(
      (value) => {
        clearTimeout(timer);
        resolve(value);
      },
      (error) => {
        clearTimeout(timer);
        reject(error);
      },
    );
  });
}

function loadOlderPressureData() {
  if (loadingOlderPressure || !hasOlderPressure) return;
  loadingOlderPressure = true;
  syncOlderButtons();
  const nextPage = loadedWeekPages + 1;
  const finishLoading = () => {
    loadingOlderPressure = false;
    syncOlderButtons();
  };
  withTimeout(fetchPressurePage(nextPage, "append"), 20000)
    .then((items) => {
      if (items.length > 0) {
        pressurePage = nextPage;
        loadedWeekPages = nextPage;
        allData = dedupePressureItems(allData);
        updateChart(allData);
        createTablePage();
        populateTable();
        return;
      }
      hasOlderPressure = false;
    })
    .catch((e) => {
      console.error("load older error:", e);
      alert(bt("loading") + "に失敗しました。もう一度お試しください。");
    })
    .then(finishLoading, finishLoading);
}

function applyI18n() {
  const setText = (id, key) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.textContent = bt(key);
    if (el.tagName === "BUTTON") {
      el.setAttribute("aria-label", bt(key));
    }
  };
  setText("titleBp", "title");
  setText("openAddFormBtn", "add");
  setText("labelDate", "date");
  setText("labelPeriod", "period");
  setText("labelHigh", "high");
  setText("labelLow", "low");
  setText("labelMedicine", "medicine");
  setText("medicineNoneLabel", "medicineNone");
  setText("medicineYesLabel", "medicineYes");
  setText("adddata", "register");
  setText("closeAddFormBtn", "cancel");
  setText("thDate", "date");
  setText("thPeriod", "periodCol");
  setText("thHigh", "high");
  setText("thLow", "low");
  setText("thMedicine", "medicine");
  setText("ethDate", "date");
  setText("ethPeriod", "periodCol");
  setText("ethHigh", "high");
  setText("ethLow", "low");
  setText("ethMedicine", "medicine");
  setText("ethEdit", "edit");
  setText("editDateLabel", "date");
  setText("editPeriodLabel", "period");
  setText("editHighLabel", "high");
  setText("editLowLabel", "low");
  setText("editMedicineLabel", "medicine");
  setText("editMedicineNoneLabel", "medicineNone");
  setText("editMedicineYesLabel", "medicineYes");
  setText("saveButton", "save");
  setText("cancelButton", "cancel");
  setText("deleteButton", "del");
  setText("tabChart", "chart");
  setText("tabTable", "table");
  setText("tabEdit", "edit");
  setText("periodMorning", "morning");
  setText("periodNoon", "noon");
  setText("periodNight", "night");
  setText("editPeriodMorning", "morning");
  setText("editPeriodNoon", "noon");
  setText("editPeriodNight", "night");
  dataArray = ["", periodLabel(1), periodLabel(2), periodLabel(3)];
  if (typeof bloodPressureChart !== "undefined" && bloodPressureChart) {
    bloodPressureChart.data.datasets[0].label = bt("systolic");
    bloodPressureChart.data.datasets[1].label = bt("diastolic");
    bloodPressureChart.options.scales.y.title.text = bt("yAxis");
    bloodPressureChart.options.scales.x.title.text = bt("xAxis");
  }
  applySettingsUi();
  syncOlderButtons();
  updateChartRangeTitle();
}

async function setLanguage(langCode) {
  selectedUiLang = isSupportedLang(langCode) ? langCode : "ja";
  localStorage.setItem(LANG_STORAGE_KEY, selectedUiLang);
  renderLanguageOptions();
  applyI18n();
  updateChart(allData);
  createTablePage();
  populateTable();
}

showGuideOverlay = localStorage.getItem(GUIDE_VISIBLE_KEY) !== "0";
renderLanguageOptions();

document.addEventListener("i18n-initialized", () => {
  setLanguage(normalizeLangToUi(window.normalizedLanguageCode));
});

window.addEventListener("load", () => {
  const currentLanguage =
    window.normalizedLanguageCode ||
    localStorage.getItem("i18nextLng") ||
    navigator.language;
  setLanguage(normalizeLangToUi(currentLanguage));
});
