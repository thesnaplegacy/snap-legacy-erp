import {
  DEMO_USER,
  DEMO_BRANDS,
  DEMO_CLIENTS,
  DEMO_LEADS,
  DEMO_PROJECTS,
  DEMO_EVENTS,
  DEMO_TRANSACTIONS,
  DEMO_PAYMENTS,
  DEMO_ACCOUNTS,
  DEMO_EXPENSES,
  DEMO_EMPLOYEES,
  DEMO_FREELANCERS,
  DEMO_ASSETS,
  DEMO_ROLES,
  DEMO_USERS,
  DEMO_AUDIT_LOGS,
  DEMO_SETTINGS,
  DEMO_FINANCIAL_CATEGORIES,
} from '@/lib/demo-data';

const TABLE_DATA_MAP: Record<string, any[]> = {
  profiles: [DEMO_USER],
  user_roles: DEMO_USER.roles,
  user_brand_access: DEMO_USER.brand_access,
  role_permissions: DEMO_USER.permissions.map((p, i) => {
    const [module, action] = p.split(':');
    return {
      id: `rp-${i + 1}`,
      role_id: 'r-001',
      permission: { module: module || '*', action: action || '*' },
    };
  }),
  brands: DEMO_BRANDS,
  clients: DEMO_CLIENTS,
  leads: DEMO_LEADS,
  projects: DEMO_PROJECTS,
  events: DEMO_EVENTS,
  financial_transactions: DEMO_TRANSACTIONS,
  payments: DEMO_PAYMENTS,
  accounts: DEMO_ACCOUNTS,
  expenses: DEMO_EXPENSES,
  employees: DEMO_EMPLOYEES,
  freelancers: DEMO_FREELANCERS,
  assets: DEMO_ASSETS,
  roles: DEMO_ROLES,
  users: DEMO_USERS,
  audit_logs: DEMO_AUDIT_LOGS,
  settings: DEMO_SETTINGS,
  financial_categories: DEMO_FINANCIAL_CATEGORIES,
  client_brand_associations: DEMO_CLIENTS.flatMap((c) => c.client_brand_associations || []),
  organizations: [
    {
      id: 'org-001',
      name: 'The Snap Legacy',
      slug: 'the-snap-legacy',
      description: 'Parent holding company',
      created_at: '2024-01-01T00:00:00Z',
    },
  ],
};

export function createMockSupabaseClient(): any {
  function createQueryBuilder(table: string) {
    const raw = TABLE_DATA_MAP[table] || [];
    let data = Array.isArray(raw) ? [...raw] : [];
    let isSingle = false;
    let countResult: number | null = null;

    const builder: any = {
      select(_columns?: string, options?: { count?: string; head?: boolean }) {
        if (options?.count) {
          countResult = data.length;
        }
        return builder;
      },
      insert(rows: any) {
        const inserted = Array.isArray(rows) ? rows : [rows];
        data = [...inserted, ...data];
        return builder;
      },
      update(updates: any) {
        data = data.map((item) => ({ ...item, ...updates }));
        return builder;
      },
      delete() {
        return builder;
      },
      upsert(rows: any) {
        const inserted = Array.isArray(rows) ? rows : [rows];
        data = [...inserted, ...data];
        return builder;
      },
      eq(column: string, value: any) {
        data = data.filter((item) => {
          if (item && typeof item === 'object' && column in item) {
            return item[column] === value;
          }
          return true;
        });
        return builder;
      },
      neq(column: string, value: any) {
        data = data.filter((item) => {
          if (item && typeof item === 'object' && column in item) {
            return item[column] !== value;
          }
          return true;
        });
        return builder;
      },
      in(column: string, values: any[]) {
        if (!values || values.length === 0) return builder;
        data = data.filter((item) => {
          if (item && typeof item === 'object' && column in item) {
            return values.includes(item[column]);
          }
          return true;
        });
        return builder;
      },
      order(column: string, options?: { ascending?: boolean }) {
        const asc = options?.ascending !== false;
        data.sort((a, b) => {
          if (!a || !b) return 0;
          if (a[column] < b[column]) return asc ? -1 : 1;
          if (a[column] > b[column]) return asc ? 1 : -1;
          return 0;
        });
        return builder;
      },
      limit(n: number) {
        data = data.slice(0, n);
        return builder;
      },
      range(from: number, to: number) {
        data = data.slice(from, to + 1);
        return builder;
      },
      single() {
        isSingle = true;
        return builder;
      },
      maybeSingle() {
        isSingle = true;
        return builder;
      },
      gte(column: string, value: any) {
        data = data.filter((item) => {
          if (item && typeof item === 'object' && column in item) {
            return item[column] >= value;
          }
          return true;
        });
        return builder;
      },
      lte(column: string, value: any) {
        data = data.filter((item) => {
          if (item && typeof item === 'object' && column in item) {
            return item[column] <= value;
          }
          return true;
        });
        return builder;
      },
      gt(column: string, value: any) {
        data = data.filter((item) => {
          if (item && typeof item === 'object' && column in item) {
            return item[column] > value;
          }
          return true;
        });
        return builder;
      },
      lt(column: string, value: any) {
        data = data.filter((item) => {
          if (item && typeof item === 'object' && column in item) {
            return item[column] < value;
          }
          return true;
        });
        return builder;
      },
      like(column: string, _pattern: string) {
        return builder;
      },
      ilike(column: string, _pattern: string) {
        return builder;
      },
      contains(column: string, _value: any) {
        return builder;
      },
      containedBy(column: string, _value: any) {
        return builder;
      },
      not(column: string, _operator: string, _value: any) {
        return builder;
      },
      is(column: string, value: any) {
        data = data.filter((item) => {
          if (item && typeof item === 'object' && column in item) {
            return item[column] === value;
          }
          return true;
        });
        return builder;
      },
      textSearch(_column: string, _query: string) {
        return builder;
      },
      filter() {
        return builder;
      },
      match() {
        return builder;
      },
      or() {
        return builder;
      },
      then(onfulfilled: (res: any) => any, onrejected?: (err: any) => any) {
        const result = {
          data: isSingle ? (data[0] || null) : data,
          error: null,
          count: countResult !== null ? countResult : data.length,
        };
        return Promise.resolve(result).then(onfulfilled, onrejected);
      },
    };

    return builder;
  }

  return {
    from(table: string) {
      return createQueryBuilder(table);
    },
    auth: {
      getUser: async () => ({
        data: {
          user: {
            id: DEMO_USER.id,
            email: DEMO_USER.email,
            user_metadata: { full_name: DEMO_USER.full_name },
          },
        },
        error: null,
      }),
      getSession: async () => ({
        data: {
          session: {
            user: {
              id: DEMO_USER.id,
              email: DEMO_USER.email,
            },
          },
        },
        error: null,
      }),
      signInWithPassword: async () => ({
        data: {
          user: {
            id: DEMO_USER.id,
            email: DEMO_USER.email,
          },
          session: {
            user: {
              id: DEMO_USER.id,
              email: DEMO_USER.email,
            },
          },
        },
        error: null,
      }),
      signUp: async () => ({
        data: {
          user: {
            id: DEMO_USER.id,
            email: DEMO_USER.email,
          },
          session: {},
        },
        error: null,
      }),
      signOut: async () => ({ error: null }),
      onAuthStateChange: () => ({
        data: { subscription: { unsubscribe: () => {} } },
      }),
    },
    rpc: async () => ({ data: null, error: null }),
    storage: {
      from: () => ({
        upload: async () => ({ data: { path: 'demo' }, error: null }),
        getPublicUrl: () => ({ data: { publicUrl: '' } }),
      }),
    },
  };
}
