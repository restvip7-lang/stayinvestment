// pm2: держит сайт запущенным и поднимает после перезагрузки сервера.
// Запуск: pm2 start deploy/ecosystem.config.cjs && pm2 save   (из корня проекта)
// Секреты (LEAD_WEBHOOK_URL, REVALIDATE_SECRET) — в файле .env рядом с проектом, не здесь.
module.exports = {
  apps: [
    {
      name: 'stayinvestment',
      script: './dist/server/entry.mjs',
      cwd: __dirname + '/..',
      node_args: '--env-file-if-exists=.env',
      instances: 1,
      max_memory_restart: '400M',
      env: {
        NODE_ENV: 'production',
        HOST: '127.0.0.1',
        PORT: '4330',
        STAY_NOINDEX: '1', // тестовый адрес — закрыт от поисковиков; 0 — только при переезде на основной домен
      },
    },
  ],
};
