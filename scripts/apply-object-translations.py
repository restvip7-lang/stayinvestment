"""Кладёт наши переводы объектов каталога (src/content/objects-i18n/<lang>.json: id объекта → title, location, type,
descriptionHtml) в src/content/objects/*.json → i18n.<lang>.
Запуск: python3 scripts/apply-object-translations.py src/content/objects-i18n
После npm run import-legacy переводы нужно применить заново — исходники лежат в src/content/objects-i18n."""
import json, sys, pathlib

src = pathlib.Path(sys.argv[1])
root = pathlib.Path(__file__).resolve().parent.parent / 'src/content/objects'
objects = {json.loads(f.read_text(encoding='utf-8'))['id']: f for f in root.glob('*.json')}
for f in sorted(src.glob('*.json')):
    lang = f.stem
    done = 0
    for oid, tr in json.loads(f.read_text(encoding='utf-8')).items():
        path = objects.get(oid)
        if not path:
            print(f'{lang}: нет объекта {oid}')
            continue
        item = json.loads(path.read_text(encoding='utf-8'))
        item.setdefault('i18n', {})[lang] = {**{k: tr[k] for k in ('title', 'location', 'type', 'descriptionHtml') if tr.get(k)}, 'infrastructure': [], 'translatedBy': 'stayinvestment'}
        path.write_text(json.dumps(item, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
        done += 1
    print(f'{lang}: объектов {done}')
