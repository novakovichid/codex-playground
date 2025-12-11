const QUESTIONS_PER_SESSION = 10;
const XP_PER_CORRECT = 12;
const HEART_PENALTY = 1;
const DAILY_GOAL = 120;
const STORAGE_KEY = 'serboLingoState';

const WORD_BANK = [
  { sr: 'zdravo', ru: 'привет', category: 'Приветствия', roman: 'здра́во', note: 'Неформальное приветствие' },
  { sr: 'dobar dan', ru: 'добрый день', category: 'Приветствия', roman: 'до́бар дан', note: 'Дневное приветствие' },
  { sr: 'dobro jutro', ru: 'доброе утро', category: 'Приветствия', roman: 'до́бро ютро', note: 'Утреннее приветствие' },
  { sr: 'laku noć', ru: 'спокойной ночи', category: 'Приветствия', roman: 'ла́ку ноч', note: 'На ночь' },
  { sr: 'doviđenja', ru: 'до свидания', category: 'Приветствия', roman: 'довиде́нья', note: 'Вежливое прощание' },
  { sr: 'izvoli', ru: 'пожалуйста', category: 'Приветствия', roman: 'изво́ли', note: 'Когда что-то дают' },
  { sr: 'hvala', ru: 'спасибо', category: 'Приветствия', roman: 'хва́ла', note: 'Короткое спасибо' },
  { sr: 'izvinite', ru: 'извините', category: 'Приветствия', roman: 'извини́тэ', note: 'Просьба извинить' },
  { sr: 'molim', ru: 'прошу', category: 'Приветствия', roman: 'мо́лим', note: 'Ответ на «спасибо»' },
  { sr: 'kako si?', ru: 'как ты?', category: 'Приветствия', roman: 'ка́ко си', note: 'Дружеский вопрос' },
  { sr: 'šta ima?', ru: 'что нового?', category: 'Приветствия', roman: 'шта и́ма', note: 'Разговорное приветствие' },
  { sr: 'vidimo se', ru: 'увидимся', category: 'Приветствия', roman: 'ви́димо сэ', note: 'На прощание' },
  { sr: 'dobro veče', ru: 'добрый вечер', category: 'Приветствия', roman: 'до́бро ве́чэ', note: 'Вечернее приветствие' },
  { sr: 'nije loše', ru: 'неплохо', category: 'Приветствия', roman: 'ни́е ло́шэ', note: 'Ответ на вопрос «Как дела?»' },
  { sr: 'odlično', ru: 'отлично', category: 'Приветствия', roman: 'о́длично', note: 'Ответ на вопрос «Как дела?»' },
  { sr: 'da', ru: 'да', category: 'Базовые слова', roman: 'да', note: 'Утвердительный ответ' },
  { sr: 'ne', ru: 'нет', category: 'Базовые слова', roman: 'нэ', note: 'Отрицание' },
  { sr: 'možda', ru: 'может быть', category: 'Базовые слова', roman: 'мо́жда', note: 'Неуверенный ответ' },
  { sr: 'ko', ru: 'кто', category: 'Базовые слова', roman: 'ко', note: 'Вопросительное слово' },
  { sr: 'šta', ru: 'что', category: 'Базовые слова', roman: 'шта', note: 'Вопросительное слово' },
  { sr: 'kako', ru: 'как', category: 'Базовые слова', roman: 'ка́ко', note: 'Вопросительное слово' },
  { sr: 'gde', ru: 'где', category: 'Базовые слова', roman: 'гдэ', note: 'Вопросительное слово' },
  { sr: 'kada', ru: 'когда', category: 'Базовые слова', roman: 'ка́да', note: 'Вопросительное слово' },
  { sr: 'koliko', ru: 'сколько', category: 'Базовые слова', roman: 'ко́лико', note: 'Количество' },
  { sr: 'zašto', ru: 'почему', category: 'Базовые слова', roman: 'за́што', note: 'Причина' },
  { sr: 'čovek', ru: 'человек', category: 'Базовые слова', roman: 'чо́вэк', note: 'Существительное' },
  { sr: 'prijatelj', ru: 'друг', category: 'Базовые слова', roman: 'прия́тель', note: 'Дружба' },
  { sr: 'porodica', ru: 'семья', category: 'Семья', roman: 'поро́дица', note: 'Близкие люди' },
  { sr: 'otac', ru: 'отец', category: 'Семья', roman: 'о́тац', note: 'Член семьи' },
  { sr: 'majka', ru: 'мать', category: 'Семья', roman: 'ма́йка', note: 'Член семьи' },
  { sr: 'sestra', ru: 'сестра', category: 'Семья', roman: 'се́стра', note: 'Член семьи' },
  { sr: 'brat', ru: 'брат', category: 'Семья', roman: 'брат', note: 'Член семьи' },
  { sr: 'dete', ru: 'ребенок', category: 'Семья', roman: 'де́тэ', note: 'Член семьи' },
  { sr: 'baka', ru: 'бабушка', category: 'Семья', roman: 'ба́ка', note: 'Член семьи' },
  { sr: 'deka', ru: 'дедушка', category: 'Семья', roman: 'де́ка', note: 'Член семьи' },
  { sr: 'sin', ru: 'сын', category: 'Семья', roman: 'сын', note: 'Член семьи' },
  { sr: 'ćerka', ru: 'дочь', category: 'Семья', roman: 'чёрка', note: 'Член семьи' },
  { sr: 'suprug', ru: 'муж', category: 'Семья', roman: 'супру́г', note: 'Супруг' },
  { sr: 'supruga', ru: 'жена', category: 'Семья', roman: 'супру́га', note: 'Супруга' },
  { sr: 'pas', ru: 'собака', category: 'Семья', roman: 'пас', note: 'Домашнее животное' },
  { sr: 'mačka', ru: 'кошка', category: 'Семья', roman: 'ма́чка', note: 'Домашнее животное' },
  { sr: 'kuća', ru: 'дом', category: 'Быт', roman: 'ку́ча', note: 'Место проживания' },
  { sr: 'stan', ru: 'квартира', category: 'Быт', roman: 'стан', note: 'Место проживания' },
  { sr: 'soba', ru: 'комната', category: 'Быт', roman: 'со́ба', note: 'Часть жилья' },
  { sr: 'sto', ru: 'стол', category: 'Быт', roman: 'сто', note: 'Мебель' },
  { sr: 'stolica', ru: 'стул', category: 'Быт', roman: 'сто́лица', note: 'Мебель' },
  { sr: 'prozor', ru: 'окно', category: 'Быт', roman: 'про́зор', note: 'Часть дома' },
  { sr: 'vrata', ru: 'дверь', category: 'Быт', roman: 'вра́та', note: 'Часть дома' },
  { sr: 'krevet', ru: 'кровать', category: 'Быт', roman: 'крэ́вэт', note: 'Мебель' },
  { sr: 'kupatilo', ru: 'ванная', category: 'Быт', roman: 'купати́ло', note: 'Комната' },
  { sr: 'kuhinja', ru: 'кухня', category: 'Быт', roman: 'ку́хиня', note: 'Комната' },
  { sr: 'hleb', ru: 'хлеб', category: 'Еда', roman: 'хлеб', note: 'Продукт' },
  { sr: 'sir', ru: 'сыр', category: 'Еда', roman: 'сир', note: 'Продукт' },
  { sr: 'mleko', ru: 'молоко', category: 'Еда', roman: 'мле́ко', note: 'Продукт' },
  { sr: 'meso', ru: 'мясо', category: 'Еда', roman: 'ме́со', note: 'Продукт' },
  { sr: 'riba', ru: 'рыба', category: 'Еда', roman: 'ри́ба', note: 'Продукт' },
  { sr: 'voće', ru: 'фрукты', category: 'Еда', roman: 'во́чье', note: 'Категория продуктов' },
  { sr: 'povrće', ru: 'овощи', category: 'Еда', roman: 'по́врчье', note: 'Категория продуктов' },
  { sr: 'jabuka', ru: 'яблоко', category: 'Еда', roman: 'я́бука', note: 'Фрукт' },
  { sr: 'kruška', ru: 'груша', category: 'Еда', roman: 'кру́шка', note: 'Фрукт' },
  { sr: 'trešnja', ru: 'вишня', category: 'Еда', roman: 'тре́шня', note: 'Фрукт' },
  { sr: 'grožđe', ru: 'виноград', category: 'Еда', roman: 'гро́ждье', note: 'Фрукт' },
  { sr: 'piletina', ru: 'курица', category: 'Еда', roman: 'пи́летина', note: 'Мясо' },
  { sr: 'svinjetina', ru: 'свинина', category: 'Еда', roman: 'сви́нйетина', note: 'Мясо' },
  { sr: 'junetina', ru: 'говядина', category: 'Еда', roman: 'ю́нетина', note: 'Мясо' },
  { sr: 'kafa', ru: 'кофе', category: 'Напитки', roman: 'ка́фа', note: 'Напиток' },
  { sr: 'čaj', ru: 'чай', category: 'Напитки', roman: 'чай', note: 'Напиток' },
  { sr: 'voda', ru: 'вода', category: 'Напитки', roman: 'во́да', note: 'Напиток' },
  { sr: 'sok', ru: 'сок', category: 'Напитки', roman: 'сок', note: 'Напиток' },
  { sr: 'pivo', ru: 'пиво', category: 'Напитки', roman: 'пи́во', note: 'Напиток' },
  { sr: 'vino', ru: 'вино', category: 'Напитки', roman: 'ви́но', note: 'Напиток' },
  { sr: 'račun', ru: 'счет', category: 'Путешествия', roman: 'ра́чун', note: 'Ресторан, магазин' },
  { sr: 'koliko košta?', ru: 'сколько стоит?', category: 'Путешествия', roman: 'ко́лико ко́шта', note: 'Покупки' },
  { sr: 'gde je hotel?', ru: 'где гостиница?', category: 'Путешествия', roman: 'гдэ е хоте́л', note: 'Навигация' },
  { sr: 'aerodrom', ru: 'аэропорт', category: 'Путешествия', roman: 'ае́родром', note: 'Транспорт' },
  { sr: 'voz', ru: 'поезд', category: 'Путешествия', roman: 'воз', note: 'Транспорт' },
  { sr: 'autobus', ru: 'автобус', category: 'Путешествия', roman: 'ауто́бус', note: 'Транспорт' },
  { sr: 'karta', ru: 'билет', category: 'Путешествия', roman: 'ка́рта', note: 'Транспорт' },
  { sr: 'polazak', ru: 'отправление', category: 'Путешествия', roman: 'по́лазак', note: 'Транспорт' },
  { sr: 'dolazak', ru: 'прибытие', category: 'Путешествия', roman: 'до́лазак', note: 'Транспорт' },
  { sr: 'kasnim', ru: 'я опаздываю', category: 'Путешествия', roman: 'ка́сним', note: 'Ситуация' },
  { sr: 'rezervacija', ru: 'бронь', category: 'Путешествия', roman: 'резерва́цыя', note: 'Отель' },
  { sr: 'ključevi', ru: 'ключи', category: 'Путешествия', roman: 'клю́чэви', note: 'Отель' },
  { sr: 'plaža', ru: 'пляж', category: 'Путешествия', roman: 'пля́жа', note: 'Отдых' },
  { sr: 'planina', ru: 'гора', category: 'Природа', roman: 'плани́на', note: 'Ландшафт' },
  { sr: 'reka', ru: 'река', category: 'Природа', roman: 'рэ́ка', note: 'Ландшафт' },
  { sr: 'jezero', ru: 'озеро', category: 'Природа', roman: 'е́зеро', note: 'Ландшафт' },
  { sr: 'more', ru: 'море', category: 'Природа', roman: 'мо́рэ', note: 'Ландшафт' },
  { sr: 'šuma', ru: 'лес', category: 'Природа', roman: 'шу́ма', note: 'Ландшафт' },
  { sr: 'vetar', ru: 'ветер', category: 'Природа', roman: 'ве́тар', note: 'Погода' },
  { sr: 'sneg', ru: 'снег', category: 'Природа', roman: 'снег', note: 'Погода' },
  { sr: 'sunce', ru: 'солнце', category: 'Природа', roman: 'су́нцэ', note: 'Погода' },
  { sr: 'oblak', ru: 'облако', category: 'Природа', roman: 'о́блак', note: 'Погода' },
  { sr: 'kiša', ru: 'дождь', category: 'Природа', roman: 'ки́ша', note: 'Погода' },
  { sr: 'radost', ru: 'радость', category: 'Эмоции', roman: 'ра́дост', note: 'Положительное чувство' },
  { sr: 'tuga', ru: 'печаль', category: 'Эмоции', roman: 'ту́га', note: 'Негативное чувство' },
  { sr: 'bes', ru: 'злость', category: 'Эмоции', roman: 'бес', note: 'Негативное чувство' },
  { sr: 'strah', ru: 'страх', category: 'Эмоции', roman: 'страх', note: 'Чувство' },
  { sr: 'ljubav', ru: 'любовь', category: 'Эмоции', roman: 'лю́бав', note: 'Чувство' },
  { sr: 'iznenađenje', ru: 'удивление', category: 'Эмоции', roman: 'изнэнађе́нье', note: 'Чувство' },
  { sr: 'umor', ru: 'усталость', category: 'Эмоции', roman: 'у́мор', note: 'Состояние' },
  { sr: 'glad', ru: 'голод', category: 'Эмоции', roman: 'глад', note: 'Состояние' },
  { sr: 'žeđ', ru: 'жажда', category: 'Эмоции', roman: 'жэджь', note: 'Состояние' },
  { sr: 'posao', ru: 'работа', category: 'Работа', roman: 'по́сао', note: 'Место или процесс' },
  { sr: 'sastanak', ru: 'встреча', category: 'Работа', roman: 'са́станак', note: 'Деловой контекст' },
  { sr: 'ugovor', ru: 'договор', category: 'Работа', roman: 'у́говор', note: 'Документ' },
  { sr: 'tim', ru: 'команда', category: 'Работа', roman: 'тим', note: 'Рабочая группа' },
  { sr: 'kolega', ru: 'коллега', category: 'Работа', roman: 'коле́га', note: 'Работа' },
  { sr: 'pitanje', ru: 'вопрос', category: 'Работа', roman: 'пи́танье', note: 'Рабочий процесс' },
  { sr: 'odgovor', ru: 'ответ', category: 'Работа', roman: 'о́дговор', note: 'Рабочий процесс' },
  { sr: 'računar', ru: 'компьютер', category: 'Работа', roman: 'рачу́нар', note: 'Техника' },
  { sr: 'telefon', ru: 'телефон', category: 'Работа', roman: 'тэле́фон', note: 'Техника' },
  { sr: 'sastanak na mreži', ru: 'онлайн-встреча', category: 'Работа', roman: 'са́станак на мрэ́жи', note: 'Рабочий процесс' },
  { sr: 'utorak', ru: 'вторник', category: 'Время', roman: 'у́торак', note: 'День недели' },
  { sr: 'sreda', ru: 'среда', category: 'Время', roman: 'срэ́да', note: 'День недели' },
  { sr: 'četvrtak', ru: 'четверг', category: 'Время', roman: 'четвы́ртак', note: 'День недели' },
  { sr: 'petak', ru: 'пятница', category: 'Время', roman: 'пе́так', note: 'День недели' },
  { sr: 'subota', ru: 'суббота', category: 'Время', roman: 'су́бота', note: 'День недели' },
  { sr: 'nedelja', ru: 'воскресенье', category: 'Время', roman: 'неде́лья', note: 'День недели' },
  { sr: 'danas', ru: 'сегодня', category: 'Время', roman: 'да́нас', note: 'Время' },
  { sr: 'sutra', ru: 'завтра', category: 'Время', roman: 'су́тра', note: 'Время' },
  { sr: 'juče', ru: 'вчера', category: 'Время', roman: 'ю́чэ', note: 'Время' },
  { sr: 'ponedeljak', ru: 'понедельник', category: 'Время', roman: 'понеде́льяк', note: 'День недели' },
  { sr: 'čas', ru: 'урок', category: 'Время', roman: 'час', note: 'Отрезок времени' },
  { sr: 'minut', ru: 'минута', category: 'Время', roman: 'ми́нут', note: 'Отрезок времени' },
  { sr: 'sat', ru: 'час', category: 'Время', roman: 'сат', note: 'Отрезок времени' },
  { sr: 'sekunda', ru: 'секунда', category: 'Время', roman: 'секу́нда', note: 'Отрезок времени' },
  { sr: 'broj', ru: 'число', category: 'Числа', roman: 'брой', note: 'Числительное' },
  { sr: 'jedan', ru: 'один', category: 'Числа', roman: 'е́дан', note: '1' },
  { sr: 'dva', ru: 'два', category: 'Числа', roman: 'два', note: '2' },
  { sr: 'tri', ru: 'три', category: 'Числа', roman: 'три', note: '3' },
  { sr: 'četiri', ru: 'четыре', category: 'Числа', roman: 'че́тиры', note: '4' },
  { sr: 'pet', ru: 'пять', category: 'Числа', roman: 'пэт', note: '5' },
  { sr: 'šest', ru: 'шесть', category: 'Числа', roman: 'шест', note: '6' },
  { sr: 'sedam', ru: 'семь', category: 'Числа', roman: 'се́дам', note: '7' },
  { sr: 'osam', ru: 'восемь', category: 'Числа', roman: 'о́сам', note: '8' },
  { sr: 'devet', ru: 'девять', category: 'Числа', roman: 'де́вет', note: '9' },
  { sr: 'deset', ru: 'десять', category: 'Числа', roman: 'де́сет', note: '10' },
  { sr: 'sto', ru: 'сто', category: 'Числа', roman: 'сто', note: '100' },
  { sr: 'hiljadu', ru: 'тысяча', category: 'Числа', roman: 'хи́лядy', note: '1000' },
  { sr: 'volim te', ru: 'я тебя люблю', category: 'Фразы', roman: 'во́лим тэ', note: 'Романтическое' },
  { sr: 'nedostaješ mi', ru: 'я скучаю', category: 'Фразы', roman: 'недоста́еш ми', note: 'Скучать по кому-то' },
  { sr: 'pomoć!', ru: 'помогите!', category: 'Фразы', roman: 'по́моч', note: 'Экстренная фраза' },
  { sr: 'polako', ru: 'помедленнее', category: 'Фразы', roman: 'пола́ко', note: 'Просьба говорить медленно' },
  { sr: 'razumem', ru: 'я понимаю', category: 'Фразы', roman: 'разу́мем', note: 'Понимание' },
  { sr: 'ne razumem', ru: 'я не понимаю', category: 'Фразы', roman: 'нэ разу́мем', note: 'Отсутствие понимания' },
  { sr: 'ponovite, molim', ru: 'повторите, пожалуйста', category: 'Фразы', roman: 'поно́вите, мо́лим', note: 'Просьба' },
  { sr: 'koliko je sati?', ru: 'который час?', category: 'Фразы', roman: 'ко́лико е са́ти', note: 'Время' },
  { sr: 'gde je toalет?', ru: 'где туалет?', category: 'Фразы', roman: 'гдэ е тоале́т', note: 'Путешествия' },
  { sr: 'živeli!', ru: 'будьмо!', category: 'Фразы', roman: 'жи́вэли', note: 'Тост' }
];

const state = loadState();
let currentMode = null;
let currentQuestionIndex = 0;
let currentWord = null;
let sessionScore = 0;
let sessionAnswered = false;

const elements = {
  xp: document.getElementById('xp-value'),
  streak: document.getElementById('streak-value'),
  hearts: document.getElementById('heart-value'),
  goalProgress: document.getElementById('goal-progress'),
  goalValue: document.getElementById('goal-value'),
  sessionMode: document.getElementById('session-mode'),
  sessionScore: document.getElementById('session-score'),
  sessionProgress: document.getElementById('session-progress'),
  questionIndex: document.getElementById('question-index'),
  prompt: document.getElementById('prompt'),
  options: document.getElementById('options'),
  typingForm: document.getElementById('typing-form'),
  typingInput: document.getElementById('typing-input'),
  hint: document.getElementById('hint'),
  feedback: document.getElementById('feedback'),
  next: document.getElementById('next'),
  skip: document.getElementById('skip'),
  vocabGrid: document.getElementById('vocab-grid')
};

document.querySelectorAll('[data-start-mode]').forEach((btn) => {
  btn.addEventListener('click', () => startSession(btn.dataset.startMode));
});

elements.typingForm.addEventListener('submit', (event) => {
  event.preventDefault();
  if (currentMode !== 'typing' || sessionAnswered) return;
  const answer = normalize(elements.typingInput.value);
  if (!answer) return;
  const isCorrect = matchesAnswer(answer, currentWord.ru);
  showResult(isCorrect, 'typing');
});

elements.skip.addEventListener('click', () => {
  if (!currentMode) return;
  feedback('Вопрос пропущен. XP не начислены.', 'muted');
  sessionAnswered = true;
  elements.next.disabled = false;
});

elements.next.addEventListener('click', () => {
  if (!currentMode) return;
  nextQuestion();
});

init();

function init() {
  updateStreak();
  renderStats();
  renderVocabulary();
  updateGoal();
  elements.options.innerHTML = '';
  elements.typingForm.style.display = 'none';
}

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (saved) return saved;
  } catch (error) {
    console.warn('Не удалось загрузить состояние, используем дефолтное', error);
  }
  return {
    xp: 0,
    hearts: 5,
    streak: 1,
    lastSessionDate: new Date().toISOString().slice(0, 10),
    mastered: {}
  };
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function updateStreak() {
  const today = new Date().toISOString().slice(0, 10);
  if (!state.lastSessionDate) {
    state.lastSessionDate = today;
    return;
  }
  if (state.lastSessionDate === today) return;

  const last = new Date(state.lastSessionDate);
  const diff = Math.floor((new Date(today) - last) / (1000 * 60 * 60 * 24));
  state.streak = diff === 1 ? state.streak + 1 : 1;
  state.lastSessionDate = today;
  saveState();
}

function renderStats() {
  elements.xp.textContent = state.xp;
  elements.streak.textContent = state.streak;
  elements.hearts.textContent = state.hearts;
  updateGoal();
}

function updateGoal() {
  const progress = Math.min(100, Math.round((state.xp % DAILY_GOAL) / DAILY_GOAL * 100));
  elements.goalProgress.style.width = `${progress}%`;
  elements.goalValue.textContent = `${DAILY_GOAL} XP`;
}

function startSession(mode) {
  currentMode = mode;
  sessionScore = 0;
  currentQuestionIndex = 0;
  elements.sessionScore.textContent = sessionScore;
  elements.sessionMode.textContent = mode === 'choice' ? 'Режим: выбор ответа' : 'Режим: ввод перевода';
  elements.feedback.textContent = '';
  elements.next.disabled = true;
  sessionAnswered = false;
  elements.questionIndex.textContent = 0;
  elements.sessionProgress.style.width = '0%';
  elements.typingForm.style.display = mode === 'typing' ? 'flex' : 'none';
  nextQuestion();
}

function nextQuestion() {
  if (currentQuestionIndex >= QUESTIONS_PER_SESSION) {
    elements.prompt.textContent = 'Сессия завершена! Начните новую, чтобы продолжить.';
    elements.options.innerHTML = '';
    elements.typingForm.reset();
    elements.typingInput.blur();
    elements.feedback.textContent = '';
    return;
  }

  currentWord = pickWord();
  currentQuestionIndex += 1;
  sessionAnswered = false;
  elements.next.disabled = true;
  elements.questionIndex.textContent = currentQuestionIndex;
  elements.sessionProgress.style.width = `${(currentQuestionIndex / QUESTIONS_PER_SESSION) * 100}%`;
  elements.feedback.textContent = '';

  if (currentMode === 'choice') {
    renderChoiceQuestion();
  } else {
    renderTypingQuestion();
  }
}

function pickWord() {
  const index = Math.floor(Math.random() * WORD_BANK.length);
  return WORD_BANK[index];
}

function renderChoiceQuestion() {
  elements.options.innerHTML = '';
  elements.typingForm.reset();
  elements.prompt.textContent = `Выберите перевод на сербский: ${currentWord.ru}`;
  elements.typingForm.style.display = 'none';

  const options = shuffle([
    currentWord,
    ...getRandomWords(3, currentWord)
  ]);

  options.forEach((word) => {
    const button = document.createElement('button');
    button.className = 'option';
    button.type = 'button';
    button.dataset.sr = word.sr;
    button.innerHTML = `<div>${word.sr}</div><div class="muted">${word.roman}</div>`;
    button.addEventListener('click', () => handleChoice(word));
    elements.options.appendChild(button);
  });
}

function renderTypingQuestion() {
  elements.options.innerHTML = '';
  elements.typingForm.style.display = 'flex';
  elements.prompt.textContent = `Введите перевод на русский: ${currentWord.sr}`;
  elements.typingInput.value = '';
  elements.typingInput.disabled = false;
  elements.typingInput.focus();
  elements.hint.textContent = `Подсказка: ${currentWord.roman} · ${currentWord.note}`;
}

function handleChoice(selected) {
  if (sessionAnswered) return;
  const correct = selected.sr === currentWord.sr;
  showResult(correct, 'choice', selected);
}

function showResult(isCorrect, mode, selectedOption) {
  sessionAnswered = true;
  elements.next.disabled = false;

  if (mode === 'choice') {
    Array.from(elements.options.children).forEach((node) => {
      const word = node.dataset.sr;
      if (word === currentWord.sr) {
        node.classList.add('correct');
      }
      if (selectedOption && word === selectedOption.sr && !isCorrect) {
        node.classList.add('wrong');
      }
    });
  }

  if (isCorrect) {
    state.xp += XP_PER_CORRECT;
    sessionScore += XP_PER_CORRECT;
    incrementMastery(currentWord.sr);
    feedback(`Верно! «${currentWord.sr}» = ${currentWord.ru}. +${XP_PER_CORRECT} XP`);
  } else {
    state.hearts = Math.max(0, state.hearts - HEART_PENALTY);
    feedback(`Неверно. Верный ответ: «${currentWord.sr}» — ${currentWord.ru}.`, 'error');
  }

  state.lastSessionDate = new Date().toISOString().slice(0, 10);
  saveState();
  renderStats();
  elements.sessionScore.textContent = sessionScore;

  if (mode === 'typing') {
    elements.typingInput.disabled = true;
    elements.typingInput.blur();
  }
}

function incrementMastery(key) {
  const current = state.mastered[key] || 0;
  state.mastered[key] = Math.min(current + 1, 5);
}

function getRandomWords(count, excludeWord) {
  const pool = WORD_BANK.filter((word) => word.sr !== excludeWord.sr);
  const shuffled = shuffle(pool);
  return shuffled.slice(0, count);
}

function shuffle(array) {
  return [...array].sort(() => Math.random() - 0.5);
}

function normalize(value) {
  if (!value) return '';
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase();
}

function matchesAnswer(answer, target) {
  return normalize(target) === normalize(answer);
}

function feedback(message, tone = 'success') {
  elements.feedback.textContent = message;
  elements.feedback.style.color = tone === 'success' ? '#2f855a' : tone === 'error' ? '#c53030' : '#5f6570';
}

function renderVocabulary() {
  const grouped = WORD_BANK.reduce((acc, word) => {
    if (!acc[word.category]) acc[word.category] = [];
    acc[word.category].push(word);
    return acc;
  }, {});

  elements.vocabGrid.innerHTML = '';
  Object.entries(grouped).forEach(([category, words]) => {
    const wrapper = document.createElement('div');
    wrapper.className = 'vocab-item';
    wrapper.innerHTML = `
      <div class="vocab-title">${category}</div>
      <div class="muted">${words.length} слов</div>
      <div class="vocab-meta"><span>Топ: ${words[0].sr}</span><span>${words[0].ru}</span></div>
    `;
    wrapper.addEventListener('click', () => openCategory(category, words, wrapper));
    elements.vocabGrid.appendChild(wrapper);
  });
}

function openCategory(category, words, node) {
  const learnedCount = words.filter((w) => (state.mastered[w.sr] || 0) > 0).length;
  node.classList.toggle('learned', learnedCount >= Math.ceil(words.length / 2));
  const detail = words
    .map((word) => {
      const level = state.mastered[word.sr] || 0;
      return `<div><strong>${word.sr}</strong> — ${word.ru} <span class="muted">${word.roman}</span> · уровень ${level}</div>`;
    })
    .join('');
  node.innerHTML = `
    <div class="vocab-title">${category}</div>
    <div class="muted">${words.length} слов · изучено ${learnedCount}</div>
    <div class="vocab-list">${detail}</div>
  `;
}
