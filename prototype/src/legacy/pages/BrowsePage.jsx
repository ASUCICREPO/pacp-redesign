import { ArrowDown, ArrowUp, ArrowUpDown, Pencil, Search } from 'lucide-react';
import { useMemo, useState } from 'react';

import { ceramicTypes, getPeriod, getRegion, getWare, wares } from '@/lib/data';
import { useDrafts } from '@/lib/extraction/drafts';
import { useReviewState } from '@/lib/extraction/review-state';

import { Link, useSearchParams } from '../router.jsx';
import { ArtifactCard } from '../components/ArtifactCard.jsx';
import { StatusBadge } from '../components/StatusBadge.jsx';
import { SAMPLE_ARTIFACTS } from '../data/SAMPLE_ARTIFACTS.js';

/**
 * Browse (FR-6).
 *
 * The prototype already had per-column search boxes (FR-6.2) and clickable
 * rows (FR-6.3); the boxes were decorative, so they now actually filter, and
 * column headers sort (FR-6.1). Markup and classes are unchanged — the sort
 * control is the existing column label turned into a button.
 */

/** FR-6.a. The last five were missing from the prototype's tab row. */
export const BROWSE_CATEGORIES = [
  'Wares',
  'Types',
  'Vessels',
  'Sites',
  'Regions',
  'Traditions',
  'Techniques',
  'Materials',
  'Kilns',
  'Workshops',
  'Chronology',
  'Petro-fabrics',
  'Petrographic Samples',
  'Figurines',
  'Master Bibliography',
  'Contributors',
];

const VESSEL_COLUMNS = [
  { key: 'name', label: 'Vessel Name' },
  { key: 'shape', label: 'Shape' },
  { key: 'period', label: 'Period' },
  { key: 'ware', label: 'Ware' },
  { key: 'location', label: 'Location' },
  { key: 'tradition', label: 'Tradition' },
];

/** Wares and types get their own columns so a link to one lands on the record. */
const LIBRARY_COLUMNS = [
  { key: 'name', label: 'Name' },
  { key: 'shape', label: 'Ware Family' },
  { key: 'period', label: 'Period' },
  { key: 'ware', label: 'Dates' },
  { key: 'location', label: 'Region' },
  { key: 'tradition', label: 'Also Known As' },
];

const STEWARDSHIP_CYCLE = ['draft', 'needs-review', 'community-reviewed', 'stewarded'];

const STATUS_LABELS = {
  draft: 'Draft',
  'needs-review': 'Needs Review',
  'community-reviewed': 'Community Reviewed',
  stewarded: 'Stewarded',
};

const BADGE_STATUS = {
  draft: 'draft',
  needs_review: 'needs-review',
  community_reviewed: 'community-reviewed',
  stewarded: 'stewarded',
};

const EMPTY_FILTERS = { name: '', shape: '', period: '', ware: '', location: '', tradition: '' };

/** Whichever extracted field best fills a column, or an em dash. */
const fieldValue = (item, ...labels) => {
  for (const label of labels) {
    const hit = item.fields.find((f) => f.label.toLowerCase().includes(label));
    if (hit) return hit.value;
  }
  return '—';
};

/**
 * Rows for one Browse category.
 *
 * Drafts accepted from a PDF are listed beside published vessels rather than
 * on a page of their own — stakeholder feedback was explicit that the work
 * table should be Browse with filters, not somewhere new to learn.
 */
function datasetFor(category, drafts, links) {
  if (category === 'Wares' || category === 'Types') {
    const records = category === 'Wares' ? wares : ceramicTypes;
    // A type carries its ware's id too, so the record's own id has to be
    // chosen by category — not by whichever field happens to be set.
    const idOf = (record) => (category === 'Wares' ? record.ware_id : record.type_id);
    // Extractions a reviewer judged to be this record. The passage travels
    // with the link, so the reason for the decision stays on the record.
    const notesFor = (id) => Object.values(links).filter((link) => link.targetId === id);
    return {
      columns: LIBRARY_COLUMNS,
      rows: records.map((record) => {
        const region = record.region_id ? getRegion(record.region_id) : null;
        const period = record.period_id ? getPeriod(record.period_id) : null;
        const family = category === 'Wares' ? record.name : (record.ware_id ? getWare(record.ware_id)?.name : null);
        const alts = category === 'Wares' ? record.alt_ware_name : record.alt_type_name;
        return {
          id: idOf(record),
          cells: {
            name: record.name,
            shape: family ?? 'No ware family',
            period: period?.term ?? '—',
            ware: record.date_bce_ce ?? '—',
            location: region ? `${region.name}, ${region.country}` : '—',
            tradition: (alts ?? []).join(', ') || '—',
          },
          status: BADGE_STATUS[record.stewardship_status] ?? 'needs-review',
          owner: null,
          href: null,
          isDraft: false,
          notes: notesFor(idOf(record)),
        };
      }),
    };
  }

  const vessels = SAMPLE_ARTIFACTS.map((artifact, index) => ({
    id: artifact.id,
    cells: {
      name: artifact.name,
      shape: 'Jar',
      period: artifact.period,
      ware: artifact.type,
      location: artifact.location,
      tradition: artifact.tradition,
    },
    status: STEWARDSHIP_CYCLE[index % STEWARDSHIP_CYCLE.length],
    owner: 'Dr. Sarah Chen',
    href: `/vessel/${artifact.id}`,
    isDraft: false,
    notes: [],
  }));

  const draftRows = drafts.map((draft) => ({
    id: draft.item.id,
    cells: {
      name: draft.item.title,
      shape: fieldValue(draft.item, 'shape', 'form', 'category'),
      period: fieldValue(draft.item, 'date', 'phase', 'period'),
      ware: fieldValue(draft.item, 'belongs to', 'ware'),
      // The report title is a paragraph long; the file is what identifies it here.
      location: (() => {
        const site = fieldValue(draft.item, 'site', 'provenience', 'county', 'region');
        return site === '—' ? draft.source.document.fileName : site;
      })(),
      tradition: fieldValue(draft.item, 'diagnostic', 'trait'),
    },
    // A promoted record has to stop reading as a draft here too, or the work
    // table disagrees with the record's own page.
    status: BADGE_STATUS[draft.stewardship_status] ?? 'draft',
    owner: draft.reviewed_by,
    href: `/vessel/${draft.item.id}`,
    isDraft: true,
    notes: [],
  }));

  return { columns: VESSEL_COLUMNS, rows: [...draftRows, ...vessels] };
}

export function BrowsePage() {
  const [params] = useSearchParams();
  const drafts = useDrafts();
  const links = useReviewState().links;

  // The home page's "N drafts awaiting review" card and the "View existing
  // record" links from extraction both arrive here with filters in the URL.
  const [category, setCategory] = useState(() => params.get('category') ?? 'Vessels');
  const [filters, setFilters] = useState(() => ({ ...EMPTY_FILTERS, name: params.get('name') ?? '' }));
  const [status, setStatus] = useState(() => params.get('status') ?? 'all');
  const [mine, setMine] = useState(() => params.get('owner') === 'me');
  const [sort, setSort] = useState({ key: null, direction: 'asc' });

  const setFilter = (key, value) => setFilters((prev) => ({ ...prev, [key]: value }));
  const clearAll = () => {
    setFilters(EMPTY_FILTERS);
    setStatus('all');
    setMine(false);
  };
  const narrowed = status !== 'all' || mine || Object.values(filters).some((v) => v.trim());


  const { columns, rows: allRows } = useMemo(
    () => datasetFor(category, drafts, links),
    [category, drafts, links],
  );
  /**
   * How much work is in each state.
   *
   * Asked for on 29 September: the work table should show at a glance what is
   * waiting and what has been through review. Counts ignore the status filter
   * so the row keeps its shape as you move between states.
   */
  const statusCounts = useMemo(() => {
    const base = allRows.filter(
      (row) =>
        columns.every((column) => {
          const term = filters[column.key].trim().toLowerCase();
          return !term || String(row.cells[column.key]).toLowerCase().includes(term);
        }) && (!mine || row.isDraft),
    );
    return {
      total: base.length,
      byStatus: STEWARDSHIP_CYCLE.map((value) => ({
        value,
        count: base.filter((row) => row.status === value).length,
      })),
    };
  }, [allRows, columns, filters, mine]);

  const toggleSort = (key) =>
    setSort((prev) =>
      prev.key === key
        ? { key: prev.direction === 'asc' ? key : null, direction: prev.direction === 'asc' ? 'desc' : 'asc' }
        : { key, direction: 'asc' },
    );

  const rows = useMemo(() => {
    const filtered = allRows.filter(
      (row) =>
        columns.every((column) => {
          const term = filters[column.key].trim().toLowerCase();
          return !term || String(row.cells[column.key]).toLowerCase().includes(term);
        }) &&
        (status === 'all' || row.status === status) &&
        // "Assigned to me" in a prototype with no accounts means the records
        // this browser accepted — which is exactly the reviewer's own queue.
        (!mine || row.isDraft),
    );

    if (!sort.key) return filtered;
    return [...filtered].sort((a, b) => {
      const result = String(a.cells[sort.key]).localeCompare(String(b.cells[sort.key]), undefined, { numeric: true });
      return sort.direction === 'asc' ? result : -result;
    });
  }, [allRows, columns, filters, status, mine, sort]);

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-4">
          <div className="py-6">
            <h1 className="font-serif text-foreground mb-2">Browse Database</h1>
            <p className="text-muted-foreground">
              {rows.length.toLocaleString()}
              {' results in '}
              {category}
              {narrowed && (
                <>
                  {' · '}
                  <span className="text-foreground">
                    {[status !== 'all' ? STATUS_LABELS[status] : null, mine ? 'assigned to me' : null]
                      .filter(Boolean)
                      .join(', ') || 'filtered'}
                  </span>{' '}
                  <button type="button" onClick={clearAll} className="text-primary hover:underline">
                    Show everything
                  </button>
                </>
              )}
            </p>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {BROWSE_CATEGORIES.map((name) => (
              <button
                onClick={() => setCategory(name)}
                className={`px-4 py-2 rounded-t-lg border-b-2 whitespace-nowrap transition-colors ${
                  category === name
                    ? 'border-primary text-primary bg-primary/5'
                    : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
                key={name}
              >
                {name}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <span className="text-sm text-muted-foreground">Status</span>
          <button
            type="button"
            onClick={() => setStatus('all')}
            className={`px-3 py-1 rounded-full text-sm border transition-colors ${
              status === 'all'
                ? 'bg-primary/10 text-primary border-primary/20 font-medium'
                : 'border-border text-muted-foreground hover:text-foreground hover:bg-muted'
            }`}
          >
            All {statusCounts.total}
          </button>
          {statusCounts.byStatus.map(({ value, count }) => (
            <button
              type="button"
              key={value}
              onClick={() => setStatus(status === value ? 'all' : value)}
              aria-pressed={status === value}
              className={`inline-flex items-center gap-2 rounded-full transition-opacity ${
                status === value ? '' : 'opacity-70 hover:opacity-100'
              } ${count === 0 ? 'opacity-35' : ''}`}
            >
              <StatusBadge status={value} size="sm" />
              <span className="text-sm text-muted-foreground pr-1">{count}</span>
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between gap-4 mb-6">
          <label className="inline-flex items-center gap-2 text-sm text-foreground">
            <input
              type="checkbox"
              checked={mine}
              onChange={(e) => setMine(e.target.checked)}
              className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
            />
            Assigned to me
          </label>
          <Link
            to="/submit"
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors inline-flex items-center gap-2"
          >
            <Pencil className="w-4 h-4" />
            Add New Entry
          </Link>
        </div>

        <div className="bg-card border border-border rounded-lg overflow-hidden mb-6">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                {columns.map((column) => {
                  const active = sort.key === column.key;
                  return (
                    <th className="text-left px-4 py-3" key={column.key}>
                      <button
                        type="button"
                        onClick={() => toggleSort(column.key)}
                        title={`Sort by ${column.label}`}
                        aria-sort={active ? (sort.direction === 'asc' ? 'ascending' : 'descending') : 'none'}
                        className={`text-sm mb-2 inline-flex items-center gap-1.5 transition-colors ${
                          active ? 'text-primary' : 'text-foreground hover:text-primary'
                        }`}
                      >
                        {column.label}
                        {active ? (
                          sort.direction === 'asc' ? (
                            <ArrowUp className="w-3 h-3" />
                          ) : (
                            <ArrowDown className="w-3 h-3" />
                          )
                        ) : (
                          <ArrowUpDown className="w-3 h-3 opacity-40" />
                        )}
                      </button>
                      <div className="relative">
                        <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground" />
                        <input
                          type="text"
                          value={filters[column.key]}
                          onChange={(e) => setFilter(column.key, e.target.value)}
                          placeholder="Search..."
                          aria-label={`Filter by ${column.label}`}
                          className="w-full pl-7 pr-2 py-1 text-sm bg-input-background border border-border rounded focus:outline-none focus:ring-1 focus:ring-ring"
                        />
                      </div>
                    </th>
                  );
                })}
                <th className="text-left px-4 py-3">
                  <div className="text-sm mb-2">Status</div>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    aria-label="Filter by status"
                    className="w-full px-2 py-1 text-sm bg-input-background border border-border rounded focus:outline-none focus:ring-1 focus:ring-ring"
                  >
                    <option value="all">All statuses</option>
                    {STEWARDSHIP_CYCLE.map((value) => (
                      <option key={value} value={value}>
                        {STATUS_LABELS[value]}
                      </option>
                    ))}
                  </select>
                </th>
                <th className="w-12 px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr className="border-t border-border hover:bg-muted/30" key={row.id}>
                  {columns.map((column, index) => (
                    <td
                      className={`px-4 py-3 text-sm ${index === 0 ? '' : index === columns.length - 1 ? 'text-primary' : 'text-muted-foreground'}`}
                      key={column.key}
                    >
                      {index === 0 && row.href ? (
                        <Link to={row.href} className="text-primary hover:underline">
                          {row.cells[column.key]}
                        </Link>
                      ) : index === 0 ? (
                        <span className="text-foreground">{row.cells[column.key]}</span>
                      ) : (
                        row.cells[column.key]
                      )}
                      {index === 0 && (row.notes?.length ?? 0) > 0 && (
                        <div className="mt-1.5 space-y-1">
                          {row.notes.map((note) => (
                            <p
                              key={note.linkedAt}
                              title={note.note}
                              className="text-xs text-muted-foreground border-l-2 border-primary/40 pl-2"
                            >
                              {/* The passage can run long; the cell shows the
                                  start and the title carries all of it. */}
                              <span className="line-clamp-3">
                                <span className="text-primary font-medium">Linked extraction</span> — {note.note}
                              </span>
                              <span className="block opacity-80">
                                {note.matchLabel}; linked by {note.linkedBy}
                              </span>
                            </p>
                          ))}
                        </div>
                      )}
                    </td>
                  ))}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <StatusBadge status={row.status} size="sm" />
                      {row.isDraft && row.href && (
                        <Link to={row.href} className="text-sm text-primary hover:underline whitespace-nowrap">
                          Review draft →
                        </Link>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {/* The pencil was decorative. It opens the record, which is
                        where the prototype does its editing. Wares and types
                        have no record page yet, so it is not offered there. */}
                    {row.href ? (
                      <Link
                        to={row.href}
                        title={`Edit ${row.cells.name}`}
                        aria-label={`Edit ${row.cells.name}`}
                        className="inline-flex text-muted-foreground hover:text-primary transition-colors"
                      >
                        <Pencil className="w-4 h-4" />
                      </Link>
                    ) : (
                      <span
                        title="This record type does not have an editable page yet"
                        className="inline-flex text-muted-foreground/30"
                      >
                        <Pencil className="w-4 h-4" />
                      </span>
                    )}
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr className="border-t border-border">
                  <td colSpan={columns.length + 2} className="px-4 py-8 text-center text-sm text-muted-foreground">
                    No records match these filters.{' '}
                    <button type="button" onClick={clearAll} className="text-primary hover:underline">
                      Clear filters
                    </button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div>
          <h2 className="font-serif text-foreground mb-4">Featured Vessels</h2>
          <div className="grid grid-cols-3 gap-6">
            {SAMPLE_ARTIFACTS.map((artifact) => (
              <ArtifactCard artifact={artifact} key={artifact.id} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default BrowsePage;
