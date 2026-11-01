# Сборка Electron

Используйте Node.js 22 LTS или новее (проверено с Node.js 24). Версия Electron задаётся в package.json; Babel настроен на Electron 38.

```sh
npm ci
npm run build
npm start
```

`npm ci` запускает production-сборку через существующий postinstall. `npm run build` нужен для повторной сборки после изменений.

- `npm run build:dev` — сборка для разработки с source maps, без минификации CSS.
- `npm run watch` — пересборка при изменениях исходников.
- `npm run build` — production-сборка с минификацией, без source maps.

Webpack создаёт `dist/main`, `dist/preload` и `dist/renderer`. В renderer копируется HTML, в main — файлы локализации. Пути Electron к HTML и preload вычисляются от каталога собранного main.js.

У каждого процесса и режима свой дисковый кеш в `node_modules/.cache/webpack`. Изменения webpack, Babel, PostCSS и lock-файла инвалидируют кеш. Для диагностической сборки без кеша: `npm run build-app -- --no-cache`.

Зависимости main-процесса загружаются Node.js из `node_modules`, а не включаются в JS-бандл. При переносе или упаковке приложения нужно включать production-зависимости из package.json; одного каталога dist недостаточно. Нативные бинарники Oracle загружаются из установленного пакета oracledb. Для существующего вызова initOracleClient по-прежнему нужен настроенный Oracle Instant Client.

Сборка не проверяет доступность Oracle или облачного хранилища. Запуск приложения включает существующую синхронизацию данных.

`npm start` автоматически выполняет production-сборку через prestart перед запуском Electron. После обновления исходников перезапустите приложение этой командой, чтобы не запускать устаревший dist.
