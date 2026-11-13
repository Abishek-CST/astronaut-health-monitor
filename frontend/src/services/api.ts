import { Subject, Observation, ReviewFlag, QueuedOperation, AuditEvent, RuleDefinition } from '../types';
import { SEED_SUBJECTS, SEED_RULES, generateSeedObservations, SEED_FLAGS, SEED_AUDITS } from './seed';

const API_BASE = '/api/v1';
const QUEUE_STORAGE_KEY = 'astronaut_offline_sync_queue';
const OFFLINE_OVERRIDE_KEY = 'astronaut_simulated_offline';

export class ApiService {
  // Check simulated or real offline status
  public static isOffline(): boolean {
    const override = localStorage.getItem(OFFLINE_OVERRIDE_KEY);
    if (override === 'true') return true;
    return !navigator.onLine;
  }

  public static setSimulatedOffline(offline: boolean) {
    localStorage.setItem(OFFLINE_OVERRIDE_KEY, offline ? 'true' : 'false');
  }

  // Get queued operations from local storage
  public static getQueuedOperations(): QueuedOperation[] {
    try {
      const stored = localStorage.getItem(QUEUE_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  // Save queued operations to local storage
  public static saveQueuedOperations(queue: QueuedOperation[]) {
    localStorage.setItem(QUEUE_STORAGE_KEY, JSON.stringify(queue));
  }

  // Add an operation to the local offline queue
  public static queueOperation(payload: QueuedOperation['payload']): QueuedOperation {
    const queue = this.getQueuedOperations();
    const newOp: QueuedOperation = {
      operation_id: 'op-' + crypto.randomUUID(),
      operation_type: 'observation.create',
      created_at: new Date().toISOString(),
      payload,
      status: 'pending',
      client_attempt_count: 0
    };
    queue.push(newOp);
    this.saveQueuedOperations(queue);
    return newOp;
  }

  // Fetch subjects
  public static async getSubjects(): Promise<Subject[]> {
    try {
      const res = await fetch(`${API_BASE}/subjects`);
      if (!res.ok) throw new Error('API unreachable');
      const data = await res.json();
      localStorage.setItem('cached_subjects', JSON.stringify(data));
      return data;
    } catch {
      const cached = localStorage.getItem('cached_subjects');
      if (cached) return JSON.parse(cached);
      localStorage.setItem('cached_subjects', JSON.stringify(SEED_SUBJECTS));
      return SEED_SUBJECTS;
    }
  }

  // Fetch observations
  public static async getObservations(subjectId?: string, metric?: string): Promise<Observation[]> {
    try {
      let url = `${API_BASE}/observations?limit=400`;
      if (subjectId) url += `&subject_id=${encodeURIComponent(subjectId)}`;
      if (metric) url += `&measurement_type=${encodeURIComponent(metric)}`;
      
      const res = await fetch(url);
      if (!res.ok) throw new Error('API unreachable');
      const data = await res.json();
      localStorage.setItem(`cached_obs_${subjectId || 'all'}`, JSON.stringify(data));
      return data;
    } catch {
      const cached = localStorage.getItem(`cached_obs_${subjectId || 'all'}`);
      if (cached) return JSON.parse(cached);
      
      const seed = generateSeedObservations();
      localStorage.setItem(`cached_obs_${subjectId || 'all'}`, JSON.stringify(seed));
      return seed;
    }
  }

  // Create observation (offline-aware)
  public static async createObservation(obs: Omit<Observation, 'id' | 'recorded_at'>): Promise<{ observation?: Observation; queued?: QueuedOperation }> {
    if (this.isOffline()) {
      const queuedOp = this.queueOperation({
        subject_id: obs.subject_id,
        measurement_type: obs.measurement_type,
        value_numeric: obs.value_numeric,
        unit: obs.unit,
        observed_at: obs.observed_at,
        source: obs.source,
        is_simulated: true,
        note: obs.note || undefined
      });
      return { queued: queuedOp };
    }

    try {
      const res = await fetch(`${API_BASE}/observations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(obs)
      });

      if (res.ok) {
        const created = await res.json();
        return { observation: created };
      }
    } catch {
      // Fallback for purely static deployment: create client record
    }

    const fallbackRecord: Observation = {
      ...obs,
      id: 'local-' + crypto.randomUUID(),
      recorded_at: new Date().toISOString()
    };
    return { observation: fallbackRecord };
  }

  // Fetch review flags
  public static async getReviewFlags(subjectId?: string): Promise<ReviewFlag[]> {
    try {
      let url = `${API_BASE}/review-flags`;
      if (subjectId) url += `?subject_id=${encodeURIComponent(subjectId)}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('API unreachable');
      const data = await res.json();
      localStorage.setItem('cached_review_flags', JSON.stringify(data));
      return data;
    } catch {
      const cached = localStorage.getItem('cached_review_flags');
      if (cached) return JSON.parse(cached);
      localStorage.setItem('cached_review_flags', JSON.stringify(SEED_FLAGS));
      return SEED_FLAGS;
    }
  }

  // Acknowledge review flag
  public static async acknowledgeFlag(flagId: string, acknowledgedBy: string, notes?: string): Promise<ReviewFlag> {
    try {
      const res = await fetch(`${API_BASE}/review-flags/${flagId}/acknowledge`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ acknowledged_by: acknowledgedBy, notes })
      });
      if (res.ok) return await res.json();
    } catch {
      // Static fallback
    }

    return {
      id: flagId,
      subject_id: 'c3-marcus-vance',
      rule_code: 'R-101',
      severity: 'MEDIUM',
      reason: 'Flag acknowledged locally in demo mode.',
      created_at: new Date().toISOString(),
      acknowledged_by: acknowledgedBy,
      acknowledged_at: new Date().toISOString(),
      notes: notes || undefined
    };
  }

  // Sync queued operations batch
  public static async syncQueue(): Promise<{
    synced: number;
    duplicates: number;
    failed: number;
    results: any[];
  }> {
    const queue = this.getQueuedOperations();
    const pending = queue.filter(op => op.status === 'pending' || op.status === 'failed');

    if (pending.length === 0) {
      return { synced: 0, duplicates: 0, failed: 0, results: [] };
    }

    // Mark as syncing and increment attempt
    pending.forEach(op => {
      op.status = 'syncing';
      op.client_attempt_count += 1;
    });
    this.saveQueuedOperations(queue);

    try {
      const res = await fetch(`${API_BASE}/sync`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ operations: pending })
      });

      if (res.ok) {
        const syncRes = await res.json();
        const resultsMap = new Map<string, any>(syncRes.results.map((r: any) => [r.operation_id, r]));

        const updatedQueue = queue.map(op => {
          const r = resultsMap.get(op.operation_id);
          if (r) {
            if (r.status === 'success' || r.status === 'duplicate_ignored') {
              return { ...op, status: 'synced' as const };
            } else {
              return { ...op, status: 'failed' as const, error: r.error };
            }
          }
          return op;
        });

        this.saveQueuedOperations(updatedQueue);
        return {
          synced: syncRes.synced_count,
          duplicates: syncRes.duplicates_ignored,
          failed: syncRes.failed_count,
          results: syncRes.results
        };
      }
    } catch {
      // Static fallback sync
    }

    // In static mode, simulate successful sync
    const simulatedResults = pending.map(op => ({
      operation_id: op.operation_id,
      status: 'success'
    }));

    const updatedQueue = queue.map(op => {
      if (op.status === 'syncing') {
        return { ...op, status: 'synced' as const };
      }
      return op;
    });

    this.saveQueuedOperations(updatedQueue);
    return {
      synced: pending.length,
      duplicates: 0,
      failed: 0,
      results: simulatedResults
    };
  }

  // Fetch audit events
  public static async getAuditEvents(): Promise<AuditEvent[]> {
    try {
      const res = await fetch(`${API_BASE}/audit-events`);
      if (!res.ok) throw new Error('API unreachable');
      return await res.json();
    } catch {
      return SEED_AUDITS;
    }
  }

  // Fetch rules manifest
  public static async getRules(): Promise<{ disclaimer: string; rules: RuleDefinition[] }> {
    try {
      const res = await fetch(`${API_BASE}/rules`);
      if (!res.ok) throw new Error('API unreachable');
      return await res.json();
    } catch {
      return {
        disclaimer: "Experimental review rules for decision support. NOT clinical diagnostic criteria.",
        rules: SEED_RULES
      };
    }
  }
}
