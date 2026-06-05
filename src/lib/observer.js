const STORAGE_KEYS = {
  visitCount: 'rwa_visit_count',
  readRecordIds: 'rwa_read_record_ids',
  lastVisitAt: 'rwa_last_visit_at',
  pageStaySeconds: 'rwa_page_stay_seconds',
  lostEntryCount: 'rwa_lost_entry_count',
  searchActionCount: 'rwa_search_action_count',
  observationLevel: 'rwa_observation_level',
};

const LEVEL_LABELS = [
  { min: 80, label: '식별 완료' },
  { min: 45, label: '관찰 진행 중' },
  { min: 25, label: '기록 진행 중' },
  { min: 10, label: '열람자 확인됨' },
  { min: 0, label: '열람자 감지됨' },
];

function canUseStorage() {
  return typeof window !== 'undefined' && Boolean(window.localStorage);
}

function readNumber(key) {
  if (!canUseStorage()) {
    return 0;
  }

  return Number(window.localStorage.getItem(key) || 0);
}

function writeNumber(key, value) {
  if (canUseStorage()) {
    window.localStorage.setItem(key, String(value));
  }
}

function readJson(key, fallback) {
  if (!canUseStorage()) {
    return fallback;
  }

  try {
    return JSON.parse(window.localStorage.getItem(key)) || fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key, value) {
  if (canUseStorage()) {
    window.localStorage.setItem(key, JSON.stringify(value));
  }
}

export function addObservationLevel(points) {
  const nextLevel = readNumber(STORAGE_KEYS.observationLevel) + points;
  writeNumber(STORAGE_KEYS.observationLevel, nextLevel);
  return nextLevel;
}

export function registerVisit() {
  const visitCount = readNumber(STORAGE_KEYS.visitCount) + 1;
  writeNumber(STORAGE_KEYS.visitCount, visitCount);

  if (canUseStorage()) {
    window.localStorage.setItem(STORAGE_KEYS.lastVisitAt, new Date().toISOString());
  }

  addObservationLevel(1);
  return getObservationSnapshot();
}

export function registerRecordRead(recordId) {
  const readRecordIds = readJson(STORAGE_KEYS.readRecordIds, []);
  const hasReadBefore = readRecordIds.includes(recordId);
  const nextReadRecordIds = hasReadBefore ? readRecordIds : [...readRecordIds, recordId];

  writeJson(STORAGE_KEYS.readRecordIds, nextReadRecordIds);
  addObservationLevel(hasReadBefore ? 5 : 2);

  return {
    hasReadBefore,
    snapshot: getObservationSnapshot(),
  };
}

export function registerSearchAction() {
  writeNumber(STORAGE_KEYS.searchActionCount, readNumber(STORAGE_KEYS.searchActionCount) + 1);
  addObservationLevel(3);
  return getObservationSnapshot();
}

export function registerLostEntry() {
  writeNumber(STORAGE_KEYS.lostEntryCount, readNumber(STORAGE_KEYS.lostEntryCount) + 1);
  addObservationLevel(10);
  return getObservationSnapshot();
}

export function registerHiddenEntry(recordId) {
  if (recordId) {
    const readRecordIds = readJson(STORAGE_KEYS.readRecordIds, []);
    if (!readRecordIds.includes(recordId)) {
      writeJson(STORAGE_KEYS.readRecordIds, [...readRecordIds, recordId]);
    }
  }

  addObservationLevel(15);
  return getObservationSnapshot();
}

export function startPageStayTimer() {
  const startedAt = Date.now();

  return () => {
    const stayedSeconds = Math.max(1, Math.round((Date.now() - startedAt) / 1000));
    writeNumber(
      STORAGE_KEYS.pageStaySeconds,
      readNumber(STORAGE_KEYS.pageStaySeconds) + stayedSeconds
    );
  };
}

export function getObservationLabel(level) {
  return LEVEL_LABELS.find((item) => level >= item.min)?.label || LEVEL_LABELS.at(-1).label;
}

export function getVisitMessage(visitCount) {
  if (visitCount >= 10) {
    return '익숙한 접속입니다.';
  }

  if (visitCount >= 5) {
    return '이전에 열렸던 창입니다.';
  }

  if (visitCount >= 2) {
    return '다시 돌아왔습니다.';
  }

  return '첫 열람이 기록되었습니다.';
}

export function getObservationSnapshot() {
  const observationLevel = readNumber(STORAGE_KEYS.observationLevel);
  const readRecordIds = readJson(STORAGE_KEYS.readRecordIds, []);

  return {
    visitCount: readNumber(STORAGE_KEYS.visitCount),
    readRecordIds,
    lastVisitAt: canUseStorage() ? window.localStorage.getItem(STORAGE_KEYS.lastVisitAt) : null,
    pageStaySeconds: readNumber(STORAGE_KEYS.pageStaySeconds),
    lostEntryCount: readNumber(STORAGE_KEYS.lostEntryCount),
    searchActionCount: readNumber(STORAGE_KEYS.searchActionCount),
    observationLevel,
    observationLabel: getObservationLabel(observationLevel),
  };
}

export function canAccessHiddenRecords() {
  const snapshot = getObservationSnapshot();

  return (
    snapshot.lostEntryCount >= 3 ||
    snapshot.observationLevel >= 45 ||
    snapshot.readRecordIds.length >= 2
  );
}

export function getHiddenAccessReason() {
  const snapshot = getObservationSnapshot();

  if (snapshot.lostEntryCount >= 3) {
    return '분실 경로가 충분히 쌓였습니다.';
  }

  if (snapshot.observationLevel >= 45) {
    return '관찰 단계가 기준을 넘었습니다.';
  }

  if (snapshot.readRecordIds.length >= 2) {
    return '두 개 이상의 기록을 열람했습니다.';
  }

  return '아직 이 기록은 열리지 않았습니다.';
}

export function resetObservation() {
  if (!canUseStorage()) {
    return;
  }

  Object.values(STORAGE_KEYS).forEach((key) => window.localStorage.removeItem(key));
}

export { STORAGE_KEYS };
