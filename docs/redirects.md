# Редиректы со старого stayinvestment.com

Все адреса живых страниц старого сайта сохранены 1:1 (главная, разделы, карточки объектов, новости).
Редиректы срабатывают в `src/middleware.ts` → `src/lib/redirects.ts`. Переезды объектов генерирует `npm run import-legacy`
(`src/content/legacy-redirects.json`), остальное задано вручную в `src/lib/redirects.ts`.

Также: адреса без слеша и с заглавными буквами → 301 на канонический вид; `/en/*`, `/sr/*` → 302 на `/` (временно, до перевода).

## Служебные и удалённые страницы (301)

| Старый адрес | Куда |
|---|---|
| `/glavnaya-2/` | `/` |
| `/main-test/` | `/` |
| `/test2/` | `/` |
| `/test3/` | `/` |
| `/investiranje-u-nekretnine-u-turskoj/` | `/` |
| `/individualnyj-podbor/` | `/investment-directory/` |
| `/trade-in/` | `/investment-directory/` |
| `/investment-directory/bronzovyj/` | `/investment-directory/rental/` |
| `/proektnaya-dokumentatsiya/` | `/kontrol-investitsij/` |
| `/o-kompanii/dokumenty-kompanii/` | `/o-kompanii/` |
| `/obzor-rynka-turetskoj-nedvizhimosti-za-poslednie-15-let/` | `/news/` |

## Объекты каталога (301)

Объект переехал в свой пакет по префиксу ID или карточки больше нет на старом сайте (404) → раздел пакета.

| Старый адрес | Куда |
|---|---|
| `/investment-directory/partnerskye/blue-city-1/` | `/investment-directory/partnerskye/` |
| `/investment-directory/partnerskye/blue-city-2/` | `/investment-directory/partnerskye/` |
| `/investment-directory/partnerskye/blue-lagoon-residence/` | `/investment-directory/partnerskye/` |
| `/investment-directory/partnerskye/blue-sunlight/` | `/investment-directory/rental/rezidenciya-blue-sunlight-2-v-okruzhenii-sovremennyh-novostroek-ryadom-s-centrom-mahmutlara/` |
| `/investment-directory/partnerskye/exodus-palace/` | `/investment-directory/partnerskye/` |
| `/investment-directory/partnerskye/prizm-one/` | `/investment-directory/partnerskye/` |
| `/investment-directory/rental/cebeci-vista-2/` | `/investment-directory/rental/` |
| `/investment-directory/rental/exodus-aqua-residence-2/` | `/investment-directory/rental/` |
| `/investment-directory/rental/exodus-riverside-2/` | `/investment-directory/rental/` |
| `/investment-directory/rental/exodus-twins-2/` | `/investment-directory/rental/` |
| `/investment-directory/rental/gem-stone-residence-2/` | `/investment-directory/rental/` |
| `/investment-directory/rental/sereniti-grang-kaptan-2/` | `/investment-directory/rental/` |
| `/investment-directory/startovye/azeroth/` | `/investment-directory/partnerskye/rezidenciya-azeroth-residence-v-150-metrah-ot-morya-v-turisticheskom-rayone-alani/` |
| `/investment-directory/startovye/cebeci-vista/` | `/investment-directory/startovye/` |
| `/investment-directory/startovye/element-2-residence/` | `/investment-directory/startovye/` |
| `/investment-directory/startovye/exodus-aqua-residence/` | `/investment-directory/startovye/` |
| `/investment-directory/startovye/exodus-panorama/` | `/investment-directory/startovye/` |
| `/investment-directory/startovye/exodus-premium-town/` | `/investment-directory/startovye/rezidenciya-exodus-premium-town-v-gorah-vozle-morya/` |
| `/investment-directory/startovye/exodus-riverside/` | `/investment-directory/startovye/rezidenciya-exodus-riverside-s-koncepciey-gorod-v-gorode/` |
| `/investment-directory/startovye/exodus-twins/` | `/investment-directory/startovye/rezidenciya-exodus-twins-na-pervoy-linii-morya-v-rayone-mahmutlar/` |
| `/investment-directory/startovye/gold-diamond/` | `/investment-directory/startovye/` |
| `/investment-directory/startovye/hills-residence-mahmutlar/` | `/investment-directory/startovye/` |
| `/investment-directory/startovye/lake-terrace/` | `/investment-directory/startovye/` |
| `/investment-directory/startovye/mevacity-residence/` | `/investment-directory/startovye/` |
| `/investment-directory/startovye/nirvana-seaside/` | `/investment-directory/startovye/` |
| `/investment-directory/startovye/novus-sky/` | `/investment-directory/startovye/` |
| `/investment-directory/startovye/oba-blue-diamond/` | `/investment-directory/startovye/` |
| `/investment-directory/startovye/oba-sol/` | `/investment-directory/startovye/` |
| `/investment-directory/startovye/prive-luxury/` | `/investment-directory/startovye/` |
| `/investment-directory/startovye/sereniti-grang-kaptan/` | `/investment-directory/startovye/` |
| `/investment-directory/startovye/soho-res/` | `/investment-directory/startovye/` |
| `/investment-directory/startovye/via-concept/` | `/investment-directory/startovye/` |
