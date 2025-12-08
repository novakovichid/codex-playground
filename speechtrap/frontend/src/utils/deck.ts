export type TabooCard = {
  id: number
  term: string
  taboo: string[]
  difficulty: 'base' | 'medium' | 'hard'
}

export const tabooDeck: TabooCard[] = [
  { id: 1, term: 'Робот', taboo: ['машина', 'железо', 'болты', 'программа', 'андроид'], difficulty: 'base' },
  { id: 2, term: 'Космос', taboo: ['звёзды', 'ракета', 'планета', 'астронавт', 'галактика'], difficulty: 'base' },
  { id: 3, term: 'Гроза', taboo: ['молния', 'дождь', 'гром', 'облака', 'буря'], difficulty: 'base' },
  { id: 4, term: 'Алхимия', taboo: ['золото', 'свинец', 'философский камень', 'колба', 'эликсир'], difficulty: 'medium' },
  { id: 5, term: 'Дрон', taboo: ['квадрокоптер', 'летать', 'пульт', 'камера', 'пропеллер'], difficulty: 'medium' },
  { id: 6, term: 'Пиксель', taboo: ['изображение', 'экран', 'точка', 'разрешение', 'графика'], difficulty: 'medium' },
  { id: 7, term: 'Глитч', taboo: ['ошибка', 'артефакт', 'сбой', 'картинка', 'эффект'], difficulty: 'medium' },
  { id: 8, term: 'Суперновая', taboo: ['звезда', 'взрыв', 'свет', 'галактика', 'энергия'], difficulty: 'hard' },
  { id: 9, term: 'Квант', taboo: ['физика', 'частица', 'энергия', 'атом', 'фотон'], difficulty: 'hard' },
  { id: 10, term: 'Синестезия', taboo: ['чувства', 'цвет', 'звук', 'ощущения', 'восприятие'], difficulty: 'hard' },
  { id: 11, term: 'Киберпанк', taboo: ['неон', 'корпорация', 'имплант', 'город', 'будущее'], difficulty: 'medium' },
  { id: 12, term: 'Песочные часы', taboo: ['время', 'песок', 'стекло', 'таймер', 'обратный отсчёт'], difficulty: 'base' },
  { id: 13, term: 'Биолюминесценция', taboo: ['свет', 'морской', 'медуза', 'организм', 'сияние'], difficulty: 'hard' },
  { id: 14, term: 'Шифрование', taboo: ['код', 'ключ', 'сообщение', 'защита', 'данные'], difficulty: 'medium' },
  { id: 15, term: 'Лабиринт', taboo: ['выход', 'поворот', 'стены', 'карта', 'путь'], difficulty: 'base' },
]
