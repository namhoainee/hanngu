// Lớp truy cập dữ liệu Ngữ pháp.
// Sau này: GET/POST/PUT/DELETE /api/grammar

function getAllGrammar() {
  return fetch(`${APP_CONFIG.DATA_BASE_PATH}/grammar/all-grammar.json`)
    .then(res => res.json())
    .then(data => data.grammar);
}

function getAllGrammarEffective() {
  return loadLocalCollection(STORAGE_KEYS.GRAMMAR, getAllGrammar);
}
