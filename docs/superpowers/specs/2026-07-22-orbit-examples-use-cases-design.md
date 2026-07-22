# Orbit Lab — Examples Use Cases

## Purpose

`/operational-modal` becomes the **Examples** page: a small gallery of realistic
Orbit compositions. It must demonstrate when a component belongs in a modal and
when the work needs a persistent page layout instead.

## Example 1 — Create configuration (modal)

**Use case:** create or adjust one configuration in a bounded, interruptive
task. The user needs to keep context but complete a short set of fields before
returning to the calling screen.

**Why it is a modal:** the task has one primary outcome, a compact scope and a
clear confirm/cancel end. It is the existing mock and remains unchanged.

**Composition:** `orbit-modal`, `orbit-modal-header`, `orbit-form-grid`,
`orbit-form-section`, `orbit-select`, date/time pickers, selectable tiles,
attachment list/dropzone and `orbit-form-action-bar`.

## Example 2 — Portfolio of cases (full page)

**Use case:** an operations team reviews many open cases, scans status and
amounts, sorts by deadline, then opens a case or narrows the queue with filters.

**Why it is not a modal:** it is an ongoing workspace with many records, not a
single bounded decision. Filters must stay available while the list changes and
the user may move repeatedly between rows.

**Composition once the structural components are available:**

- page header with title, status count badge and primary “Nuova pratica” action;
- persistent `orbit-panel` sidebar for status, owner and date filters;
- `orbit-table` for case ID, customer, deadline, amount, status and trailing
  row actions;
- sortable `orbit-table-column` headers, muted `orbitTableRow` for inactive
  cases, and existing `orbit-badge` for visible status.

**Primary interaction:** filtering and sorting keep the user on the same page;
opening or creating a single case may then use Example 1’s modal.

## Example 3 — Case dossier (detail workspace)

**Use case:** a reviewer works through one case over time, switching between its
summary, documents and activity without losing the case identity or actions.

**Why it is not a modal:** documents, notes and audit history can be long and
the user must navigate among independent views. The layout should remain open
while evidence is read or uploaded.

**Composition once the structural components are available:**

- persistent `orbit-panel` sidebar with case metadata, owner, deadline and
  status badge;
- `orbit-tablist` with **Sintesi**, **Documenti** and **Attività** tabs; counts
  use the projected `orbit-badge` slot;
- **Sintesi** tab uses form sections and read-only text inputs;
- **Documenti** tab uses `orbit-attachment-list`, `orbit-attachment-dropzone`
  and a reviewer note field;
- **Attività** tab uses `orbit-table` for timestamped events and row actions.

**Primary interaction:** tab navigation changes the active workspace view while
all tab panels remain mounted, preserving a partially entered note or upload
state. The sidebar remains visible at every step.

## Gallery navigation

The Examples page will use `orbit-tablist` for the three examples rather than
custom card buttons. The selected tab is controlled by the page signal; each
example is rendered inside an `orbit-tab-panel` so its content persists across
switches. The first tab is the preserved modal mock; the second and third are
full-page workspaces.

## Out of scope

- No business data loading, persistence or routing; entries stay static Lab
  fixtures.
- No attempt to emulate a consumer application’s full domain model.
- No replacement of the existing single-configuration modal with a page form.
