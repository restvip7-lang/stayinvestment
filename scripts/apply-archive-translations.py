"""Кладёт переводы архивных статей (папка с файлами <slug>.<lang>.html) в src/content/legacy-news/<slug>.json → i18n.<lang>.
Формат файла: первые строки <!--title: …--> и <!--desc: …-->, дальше HTML статьи.
Запуск: python3 scripts/apply-archive-translations.py src/content/legacy-news-i18n
Исходники переводов лежат в src/content/legacy-news-i18n — после npm run import-legacy их нужно применить заново."""
import json, re, sys, pathlib

src = pathlib.Path(sys.argv[1])
root = pathlib.Path(__file__).resolve().parent.parent / 'src/content/legacy-news'
for f in sorted(src.glob('*.html')):
    slug, lang = f.stem.rsplit('.', 1)
    text = f.read_text(encoding='utf-8')
    title = re.search(r'<!--title: (.*?)-->', text).group(1).strip()
    desc = re.search(r'<!--desc: (.*?)-->', text).group(1).strip()
    html = re.sub(r'<!--(title|desc): .*?-->\n?', '', text).strip()
    path = root / f'{slug}.json'
    item = json.loads(path.read_text(encoding='utf-8'))
    item.setdefault('i18n', {})[lang] = {'legacyPath': None, 'title': title, 'seoTitle': title, 'seoDescription': desc, 'contentHtml': html, 'translatedBy': 'stayinvestment'}
    path.write_text(json.dumps(item, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    print(lang, slug)
