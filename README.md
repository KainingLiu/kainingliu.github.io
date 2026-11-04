# kainingliu.github.io

Source of [kainingliu.com](https://kainingliu.com), the personal homepage of Kaining Liu (刘铠宁).

- `index.html` — single-page bilingual homepage (中文 / English toggle; `?lang=en` or `?lang=zh` picks a language)
- `projects/<name>/` — bilingual detail pages for each project (`memocat`, `uniforest`, `tuantuan`), with their own `img/`
- `assets/css/site.css`, `assets/js/site.js` — styles and behaviour shared by every page (language toggle, BibTeX boxes, click-to-load embeds)
- `assets/img/` — project card images; `assets/favicon.svg`
- `ai-talk/` — slides: 对 AI 与 AI 时代大学生活的看法

Plain static HTML/CSS/JS, no build step. Preview locally with `python -m http.server` and open http://localhost:8000.
