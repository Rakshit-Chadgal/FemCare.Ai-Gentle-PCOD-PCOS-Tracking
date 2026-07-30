const { createClient } = require('@supabase/supabase-js');
const crypto = require('crypto');
const config = require('./index');

let supabaseUrl = (config.supabaseUrl || '').trim().replace(/\/+$/, '');
const supabaseKey = config.supabaseServiceRoleKey || '';

let realSupabase = null;
if (supabaseUrl && supabaseKey && supabaseUrl.startsWith('http')) {
  try {
    realSupabase = createClient(supabaseUrl, supabaseKey, {
      auth: { persistSession: false },
    });
    console.log('[supabase] Initialized client for:', supabaseUrl);
  } catch (e) {
    console.warn('[supabase] Failed to initialize client, using in-memory mock:', e.message);
  }
} else {
  console.log('[supabase] Supabase credentials not supplied — using in-memory mock database');
}

// In-memory store fallback
const memoryStore = {
  users: [],
  profiles: [],
  symptom_logs: [],
  log_templates: [],
  ai_insights: [],
};

const failedTables = new Set();

function createMockQuery(tableName) {
  if (!memoryStore[tableName]) {
    memoryStore[tableName] = [];
  }

  let table = memoryStore[tableName];
  let action = 'select'; // 'select' | 'insert' | 'update' | 'upsert' | 'delete'
  let filters = [];
  let pendingData = null;
  let upsertOptions = {};
  let sortColumn = null;
  let sortAscending = true;
  let limitNum = null;
  let isSingle = false;
  let isMaybeSingle = false;

  const builder = {
    select() {
      return builder;
    },
    insert(data) {
      action = 'insert';
      pendingData = data;
      return builder;
    },
    update(data) {
      action = 'update';
      pendingData = data;
      return builder;
    },
    upsert(data, opts = {}) {
      action = 'upsert';
      pendingData = data;
      upsertOptions = opts;
      return builder;
    },
    delete() {
      action = 'delete';
      return builder;
    },
    eq(column, value) {
      filters.push((row) => String(row[column]) === String(value));
      return builder;
    },
    order(column, { ascending = true } = {}) {
      sortColumn = column;
      sortAscending = ascending;
      return builder;
    },
    limit(n) {
      limitNum = n;
      return builder;
    },
    single() {
      isSingle = true;
      return builder;
    },
    maybeSingle() {
      isMaybeSingle = true;
      return builder;
    },
    then(onFulfilled, onRejected) {
      return execute().then(onFulfilled, onRejected);
    },
    catch(onRejected) {
      return execute().catch(onRejected);
    },
  };

  async function execute() {
    if (action === 'insert') {
      const rows = Array.isArray(pendingData) ? pendingData : [pendingData];
      const inserted = rows.map((r) => {
        const row = {
          id: r.id || crypto.randomUUID(),
          created_at: r.created_at || new Date().toISOString(),
          updated_at: new Date().toISOString(),
          ...r,
        };
        table.push(row);
        return row;
      });

      const res = Array.isArray(pendingData) ? inserted : inserted[0];
      return { data: res, error: null };
    }

    if (action === 'upsert') {
      const conflicts = (upsertOptions.onConflict || '').split(',').map((s) => s.trim()).filter(Boolean);
      const rows = Array.isArray(pendingData) ? pendingData : [pendingData];
      const results = [];

      for (const item of rows) {
        let existingIndex = -1;
        if (conflicts.length > 0) {
          existingIndex = table.findIndex((row) =>
            conflicts.every((col) => String(row[col]) === String(item[col]))
          );
        }

        let row;
        if (existingIndex >= 0) {
          table[existingIndex] = {
            ...table[existingIndex],
            ...item,
            updated_at: new Date().toISOString(),
          };
          row = table[existingIndex];
        } else {
          row = {
            id: item.id || crypto.randomUUID(),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            ...item,
          };
          table.push(row);
        }
        results.push(row);
      }

      const res = Array.isArray(pendingData) ? (isSingle ? results[0] : results) : results[0];
      return { data: res || null, error: null };
    }

    if (action === 'update') {
      const matched = table.filter((row) => filters.every((fn) => fn(row)));
      matched.forEach((row) => {
        Object.assign(row, pendingData);
        row.updated_at = new Date().toISOString();
      });

      if (isSingle) {
        if (matched.length === 0) {
          return { data: null, error: { message: 'Row not found', code: 'PGRST116' } };
        }
        return { data: matched[0], error: null };
      }
      return { data: matched.length === 1 ? matched[0] : matched, error: null };
    }

    if (action === 'delete') {
      const matched = table.filter((row) => filters.every((fn) => fn(row)));
      memoryStore[tableName] = table.filter((row) => !filters.every((fn) => fn(row)));
      return { data: matched, error: null };
    }

    // action === 'select'
    let rows = table.filter((row) => filters.every((fn) => fn(row)));

    if (sortColumn) {
      rows.sort((a, b) => {
        if (a[sortColumn] < b[sortColumn]) return sortAscending ? -1 : 1;
        if (a[sortColumn] > b[sortColumn]) return sortAscending ? 1 : -1;
        return 0;
      });
    }

    if (limitNum !== null) {
      rows = rows.slice(0, limitNum);
    }

    if (isSingle) {
      if (rows.length === 0) {
        return { data: null, error: { message: 'Row not found', code: 'PGRST116' } };
      }
      return { data: rows[0], error: null };
    }

    if (isMaybeSingle) {
      return { data: rows[0] || null, error: null };
    }

    return { data: rows, error: null };
  }

  return builder;
}

const mockSupabase = {
  from(tableName) {
    return createMockQuery(tableName);
  },
};

function wrapRealQueryChain(realBuilder, tableName, mockBuilder) {
  return new Proxy(realBuilder, {
    get(target, prop, receiver) {
      if (prop === 'then') {
        return function (onFulfilled, onRejected) {
          const originalThen = target.then.bind(target);
          return originalThen(
            async (result) => {
              if (result && result.error) {
                console.debug(
                  `[supabase] Real Supabase query fallback on '${tableName}': ${result.error.message}`
                );
                failedTables.add(tableName);
                return mockBuilder.then(onFulfilled, onRejected);
              }

              // If real Supabase returned null/empty data for a query, check if in-memory store has data for this query
              if (
                (!result.data || (Array.isArray(result.data) && result.data.length === 0)) &&
                memoryStore[tableName] &&
                memoryStore[tableName].length > 0
              ) {
                const mockRes = await mockBuilder;
                if (mockRes.data && (!Array.isArray(mockRes.data) || mockRes.data.length > 0)) {
                  return onFulfilled ? onFulfilled(mockRes) : mockRes;
                }
              }

              return onFulfilled ? onFulfilled(result) : result;
            },
            (err) => {
              console.debug(
                `[supabase] Real Supabase exception fallback on '${tableName}': ${err.message}`
              );
              failedTables.add(tableName);
              return mockBuilder.then(onFulfilled, onRejected);
            }
          );
        };
      }

      const orig = Reflect.get(target, prop, receiver);
      if (typeof orig === 'function') {
        return function (...args) {
          const nextReal = orig.apply(target, args);

          let nextMock = mockBuilder;
          if (mockBuilder && typeof mockBuilder[prop] === 'function') {
            nextMock = mockBuilder[prop](...args);
          }

          if (nextReal && typeof nextReal === 'object') {
            return wrapRealQueryChain(nextReal, tableName, nextMock);
          }
          return nextReal;
        };
      }

      return orig;
    },
  });
}

const supabaseProxy = {
  from(tableName) {
    const mockBuilder = mockSupabase.from(tableName);
    if (!realSupabase || failedTables.has(tableName)) {
      return mockBuilder;
    }
    const realBuilder = realSupabase.from(tableName);
    return wrapRealQueryChain(realBuilder, tableName, mockBuilder);
  },
};

module.exports = supabaseProxy;
