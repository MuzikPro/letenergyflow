/**
 * What a shared build looks like on screen.
 *
 * `shared-build.test.ts` holds the data invariants and
 * `scripts/verify-shared-build.ts` greps the artifact. Neither answers the
 * question a tester's first minute asks: with 609 of 722 fields gone, does the
 * app still read as finished, or as gutted?
 *
 * Mocking the model module empty reproduces exactly what the Vite alias does —
 * same module, same export, no entries — so this renders the shared build
 * without needing to build it. The mock is hoisted above the imports, which
 * matters here more than usual: `indications.ts` derives INDICATION_CHANNELS at
 * module load, and a mock applied later would leave the derivation reading the
 * real table.
 */
import { cleanup, render, screen, within } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('../data/indications.model', () => ({ modelWritten: {} }));

// `globals: false`, so Testing Library's auto-cleanup is never registered.
afterEach(cleanup);

/**
 * Everything is imported here, after the reset, and nothing at the top of the
 * file.
 *
 * `vi.resetModules()` gives each test a fresh graph so the derivation in
 * `indications.ts` re-runs against the mocked table. A statically imported
 * StoreProvider would survive that reset and end up being a DIFFERENT module
 * instance from the one AboutView's `useStore` reaches — two React contexts
 * with the same name, and a provider that provides nothing to the tree under
 * it. Pulling the provider through the same dynamic import is what keeps them
 * the same object.
 */
const load = async () => {
  const [{ dataset }, { INDICATION_CHANNELS, MODEL_SOURCE_ID }, about, progress, store] =
    await Promise.all([
      import('../data/index'),
      import('../data/indications'),
      import('./AboutView'),
      import('../state/progress'),
      import('../state/store'),
    ]);
  const AboutView = about.default;
  const { memoryStorage } = progress;
  const { StoreProvider } = store;
  const renderAbout = () =>
    render(
      <StoreProvider storage={memoryStorage()}>
        <AboutView />
      </StoreProvider>,
    );
  return { dataset, INDICATION_CHANNELS, MODEL_SOURCE_ID, renderAbout };
};

describe('the shared build, rendered', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it('carries no field citing the model source', async () => {
    const { dataset, MODEL_SOURCE_ID } = await load();
    const offenders = dataset.acupoints
      .flatMap((p) => [p.actions, p.indications])
      .filter((f) => f && f.sourceIds.includes(MODEL_SOURCE_ID));
    expect(offenders).toEqual([]);
  });

  it('keeps every file-sourced 功效 it had', async () => {
    const { dataset } = await load();
    /* LU2 is file-sourced from the index table. If the strip reached it, the
       strip is wrong — it is supposed to remove the written table only. */
    const lu2 = dataset.acupoints.find((p) => p.code === 'LU2');
    expect(lu2?.actions?.value).toEqual({
      zhHant: '宣肺止咳、瀉胸中熱邪',
      en: 'Diffuses the lung and stops cough; drains heat from the chest',
    });
  });

  it('still has the anatomical layer whole', async () => {
    const { dataset } = await load();
    /* 362 points, every one located and source-checked. The strip touches two
       fields; a build that lost a marker is a different bug wearing this one's
       clothes. */
    expect(dataset.acupoints.length).toBe(362);
    expect(dataset.acupoints.every((p) => p.location && p.reviewStatus === 'source_checked')).toBe(
      true,
    );
  });

  it('narrows the claimed coverage to the four sourced channels', async () => {
    const { INDICATION_CHANNELS } = await load();
    expect([...INDICATION_CHANNELS].sort()).toEqual(['mer_li', 'mer_lu', 'mer_sp', 'mer_st']);
  });

  it('does not raise the subject of unsourced content at all', async () => {
    const { renderAbout } = await load();
    const { container } = renderAbout();
    /*
     * Not merely "the chip is absent" — the explanation of the chip is absent
     * too. Left in, it would explain a mark the reader never meets and read as
     * an announcement that something had been taken out.
     */
    expect(container.querySelector('#no-source')).toBeNull();
    expect(screen.queryByText('無出處')).toBeNull();
    expect(screen.queryByText('No source')).toBeNull();
  });

  it('still states the educational-only boundary', async () => {
    const { renderAbout } = await load();
    renderAbout();
    /* The disclaimer is not part of what gets stripped, and a shared build is
       precisely the build where it has to be present. */
    const notice = document.querySelector('.notice');
    expect(notice).not.toBeNull();
    expect(within(notice as HTMLElement).getByText(/Teaching and illustration only|教學與示意用途/))
      .toBeTruthy();
  });
});
