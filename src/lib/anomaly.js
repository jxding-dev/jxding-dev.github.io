export const LOST_SENTENCES = [
  '기록 번호가 비어 있습니다.',
  '방금 지나온 페이지가 목록에서 빠졌습니다.',
  '닫힌 창이 아직 열려 있습니다.',
  '누군가 같은 기록을 다시 요청했습니다.',
  '돌아가는 경로가 늦게 도착했습니다.',
];

export const OBSERVATION_PHRASES = [
  '열람 위치가 흔들렸습니다.',
  '기록이 잠시 다른 순서로 정렬되었습니다.',
  '같은 문장이 한 번 더 읽혔습니다.',
  '목록 밖에서 접근이 감지되었습니다.',
  '응답하지 않는 기록이 있습니다.',
];

export const FAKE_SYSTEM_LOGS = [
  'RWA-SYS 00:13 reader state synced',
  'RWA-SYS 00:27 archive index delayed',
  'RWA-SYS 00:41 hidden route pending',
  'RWA-SYS 00:58 observer note appended',
];

export function pickRandom(items) {
  return items[Math.floor(Math.random() * items.length)];
}

export function shouldRevealLostPath(chance = 0.07) {
  return Math.random() < chance;
}

export function shouldShowNoise(chance = 0.08) {
  return Math.random() < chance;
}
