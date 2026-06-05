import { mockRecords } from '../data/mockRecords.js';
import { supabase } from '../lib/supabase.js';

const MOCK_STORAGE_KEY = 'rwa_mock_records';
const allowUnsafeClientAdmin = import.meta.env.VITE_ENABLE_UNSAFE_CLIENT_ADMIN === 'true';

const RECORD_FIELDS = `
  id,
  record_code,
  title,
  category,
  type,
  danger,
  corruption,
  discovered_at,
  location,
  summary,
  content,
  image_url,
  tags,
  hidden_message,
  glitch_level,
  visibility,
  is_hidden,
  created_at,
  updated_at
`;

function canUseStorage() {
  return typeof window !== 'undefined' && Boolean(window.localStorage);
}

function getMockRecords() {
  if (!canUseStorage()) {
    return [...mockRecords];
  }

  const stored = window.localStorage.getItem(MOCK_STORAGE_KEY);

  if (!stored) {
    window.localStorage.setItem(MOCK_STORAGE_KEY, JSON.stringify(mockRecords));
    return [...mockRecords];
  }

  try {
    return JSON.parse(stored);
  } catch {
    window.localStorage.setItem(MOCK_STORAGE_KEY, JSON.stringify(mockRecords));
    return [...mockRecords];
  }
}

function setMockRecords(records) {
  if (canUseStorage()) {
    window.localStorage.setItem(MOCK_STORAGE_KEY, JSON.stringify(records));
  }
}

function sortByCreatedAt(records) {
  return [...records].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
}

function getClient() {
  if (!supabase) {
    return null;
  }

  return supabase;
}

function assertClientAdminWriteAllowed() {
  if (getClient() && !allowUnsafeClientAdmin) {
    throw new Error(
      'Real Supabase write is disabled in the browser. Use a server-side admin endpoint or set VITE_ENABLE_UNSAFE_CLIENT_ADMIN=true only for private testing.'
    );
  }
}

function publicRecordQuery() {
  return getClient()
    .from('records')
    .select(RECORD_FIELDS)
    .eq('visibility', 'public')
    .eq('is_hidden', false);
}

function publicHiddenRecordQuery() {
  return getClient()
    .from('records')
    .select(RECORD_FIELDS)
    .eq('visibility', 'public')
    .eq('is_hidden', true);
}

function isUuid(value) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{12}$/i.test(
    value
  );
}

export async function getPublicRecords() {
  if (!getClient()) {
    return sortByCreatedAt(
      getMockRecords().filter((record) => record.visibility === 'public' && !record.is_hidden)
    );
  }

  const { data, error } = await publicRecordQuery().order('created_at', { ascending: false });

  if (error) {
    throw error;
  }

  return data || [];
}

export async function getRecentPublicRecords(limit = 6) {
  if (!getClient()) {
    return (await getPublicRecords()).slice(0, limit);
  }

  const { data, error } = await publicRecordQuery()
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    throw error;
  }

  return data || [];
}

export async function getVisibleRecordsForHome() {
  const records = await getRecentPublicRecords(12);
  const today = new Date().toDateString();
  const todayRecord =
    records.find((record) => {
      const dateSource = record.discovered_at || record.created_at;
      return dateSource ? new Date(dateSource).toDateString() === today : false;
    }) || records[0] || null;
  const randomRecord = records.length
    ? records[Math.floor(Math.random() * records.length)]
    : null;

  return {
    recentRecords: records.slice(0, 6),
    todayRecord,
    randomRecord,
  };
}

export async function searchPublicRecords(keyword) {
  const normalizedKeyword = keyword.trim().toLowerCase();
  const records = await getPublicRecords();

  if (!normalizedKeyword) {
    return records;
  }

  return records.filter((record) => {
    const searchableText = [
      record.title,
      record.summary,
      record.content,
      Array.isArray(record.tags) ? record.tags.join(' ') : '',
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();

    return searchableText.includes(normalizedKeyword);
  });
}

export async function getPublicRecordByIdOrCode(idOrCode) {
  if (!getClient()) {
    return getMockRecords().find(
      (record) =>
        record.visibility === 'public' &&
        !record.is_hidden &&
        (record.id === idOrCode || record.record_code === idOrCode)
    ) || null;
  }

  const query = publicRecordQuery();
  const { data, error } = await (isUuid(idOrCode)
    ? query.eq('id', idOrCode)
    : query.eq('record_code', idOrCode)
  ).maybeSingle();

  if (error) {
    throw error;
  }

  return data;
}

export async function getPublicHiddenRecordByIdOrCode(idOrCode) {
  if (!getClient()) {
    return getMockRecords().find(
      (record) =>
        record.visibility === 'public' &&
        record.is_hidden &&
        (record.id === idOrCode || record.record_code === idOrCode)
    ) || null;
  }

  const query = publicHiddenRecordQuery();
  const { data, error } = await (isUuid(idOrCode)
    ? query.eq('id', idOrCode)
    : query.eq('record_code', idOrCode)
  ).maybeSingle();

  if (error) {
    throw error;
  }

  return data;
}

export async function getRecordById(id) {
  return getPublicRecordByIdOrCode(id);
}

export async function getHiddenRecordById(id) {
  return getPublicHiddenRecordByIdOrCode(id);
}

export async function getAdminRecords() {
  if (!getClient()) {
    return sortByCreatedAt(getMockRecords());
  }

  const { data, error } = await getClient()
    .from('records')
    .select(RECORD_FIELDS)
    .order('created_at', { ascending: false });

  if (error) {
    throw error;
  }

  return data || [];
}

export async function createRecord(record) {
  if (!getClient()) {
    const now = new Date().toISOString();
    const createdRecord = {
      id: `mock-${crypto.randomUUID()}`,
      created_at: now,
      updated_at: now,
      ...record,
    };
    const records = [createdRecord, ...getMockRecords()];
    setMockRecords(records);
    return createdRecord;
  }

  assertClientAdminWriteAllowed();

  const { data, error } = await getClient()
    .from('records')
    .insert(record)
    .select(RECORD_FIELDS)
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function updateRecord(id, updates) {
  if (!getClient()) {
    const records = getMockRecords();
    const updatedAt = new Date().toISOString();
    const nextRecords = records.map((record) =>
      record.id === id ? { ...record, ...updates, updated_at: updatedAt } : record
    );
    setMockRecords(nextRecords);
    return nextRecords.find((record) => record.id === id) || null;
  }

  assertClientAdminWriteAllowed();

  const { data, error } = await getClient()
    .from('records')
    .update(updates)
    .eq('id', id)
    .select(RECORD_FIELDS)
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function deleteRecord(id) {
  if (!getClient()) {
    setMockRecords(getMockRecords().filter((record) => record.id !== id));
    return true;
  }

  assertClientAdminWriteAllowed();

  const { error } = await getClient().from('records').delete().eq('id', id);

  if (error) {
    throw error;
  }

  return true;
}
