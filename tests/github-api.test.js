import assert from 'node:assert/strict';
import { test } from 'node:test';
import { getGitHubContributions } from '../src/lib/github-api.js';

const calendar = { contributions: [{ date: '2026-10-19', count: 7 }, { date: '2026-10-20', count: 3 }] };
const empty = { contributions: [{ date: '2026-10-19', count: 0 }] };

function requests(t, replies) {
  const original = globalThis.fetch;
  const urls = [];
  t.after(() => { globalThis.fetch = original; });
  globalThis.fetch = async (url) => {
    urls.push(url);
    const reply = replies[urls.length - 1];
    if (reply instanceof Error) throw reply;
    if (!reply) throw new Error('Unexpected extra source request');
    return { ok: reply.status !== 503, status: reply.status || 200, json: async () => reply };
  };
  return urls;
}

test('a working primary preserves daily history and skips other sources', async (t) => {
  const urls = requests(t, [calendar]);
  const result = await getGitHubContributions('wrestle-R');
  assert.deepEqual(result, { contributions: calendar.contributions, kind: 'contributions' });
  assert.equal(urls.length, 1);
});

test('an unavailable, timed-out, malformed, or empty primary tries the calendar fallback', async () => {
  for (const failure of [{ status: 503 }, new DOMException('Timed out', 'TimeoutError'), { contributions: [{ date: 'invalid', count: 7 }] }, empty]) {
    const original = globalThis.fetch;
    const urls = [];
    globalThis.fetch = async (url) => {
      urls.push(url);
      if (urls.length === 1 && failure instanceof Error) throw failure;
      const reply = urls.length === 1 ? failure : calendar;
      return { ok: reply.status !== 503, json: async () => reply };
    };
    try {
      const result = await getGitHubContributions('wrestle-R');
      assert.deepEqual(result.contributions, calendar.contributions);
      assert.equal(result.kind, 'contributions');
      assert.equal(urls.length, 2);
    } finally { globalThis.fetch = original; }
  }
});

test('zero calendars never become a sampled public-events history', async (t) => {
  const urls = requests(t, [empty, empty]);
  const result = await getGitHubContributions('wrestle-R');
  assert.equal(result.kind, 'empty');
  assert.equal(urls.length, 2);
  assert.ok(urls.every(url => !url.includes('/events')));
});

test('complete source failure rejects instead of reporting zero activity', async (t) => {
  const urls = requests(t, [new Error('Offline'), new Error('Offline')]);
  await assert.rejects(() => getGitHubContributions('wrestle-R'));
  assert.equal(urls.length, 2);
});

test('cancellation stops the fallback chain', async (t) => {
  const urls = requests(t, [new DOMException('Aborted', 'AbortError')]);
  const controller = new AbortController();
  controller.abort();
  await assert.rejects(() => getGitHubContributions('wrestle-R', { signal: controller.signal }));
  assert.equal(urls.length, 1);
});
