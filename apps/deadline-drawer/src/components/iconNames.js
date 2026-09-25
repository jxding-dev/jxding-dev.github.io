export const CATEGORY_ICON = {
  all: 'folder',
  utility: 'bulb',
  subscription: 'repeat',
  hospital: 'hospital',
  document: 'doc',
  delivery: 'package',
  exam: 'pencil',
  appointment: 'handshake',
  etc: 'pin',
}

export const TAB_ICON = {
  today: 'flame',
  week: 'calendar',
  overdue: 'warn',
  all: 'doc',
  stats: 'bars',
}

export function getCategoryIconName(id) {
  return CATEGORY_ICON[id] ?? 'pin'
}

export function getTabIconName(id) {
  return TAB_ICON[id] ?? 'dot'
}
