// Lớp truy cập dữ liệu Hội thoại.
// Sau này: GET/POST/PUT/DELETE /api/dialogues

function getAllDialogues() {
  return fetch(`${APP_CONFIG.DATA_BASE_PATH}/dialogues/all-dialogues.json`)
    .then(res => res.json())
    .then(data => data.dialogues);
}

function getAllDialoguesEffective() {
  return loadLocalCollection(STORAGE_KEYS.DIALOGUES, getAllDialogues);
}
