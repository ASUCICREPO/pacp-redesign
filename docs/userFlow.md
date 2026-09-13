# User Flows

This document lists the user stories the PACP platform is designed to support and shows, for each one, what happens in the system step by step. It is intended for anyone who wants to understand what the platform does for its users and how the architecture delivers it.

Component names match the [Architecture Deep Dive](./architectureDeepDive.md): the `API`, `Assistant`, `Media`, and `Doc` Lambda functions; the S3 folders `originals/`, `derivatives/`, `docs/`, and `exports/`; the RDS for PostgreSQL database; and the two Bedrock models, Amazon Nova Multimodal Embeddings and Anthropic Claude Sonnet 4.6.

---

## Who uses the platform

| User | What they need |
|---|---|
| CRM archaeologist | Identify sherds quickly, find regional parallels, generate report text, upload project data under deadline pressure |
| Graduate student | Guided identification with visible reasoning, comparative access, debate and revision history, building a thesis dataset |
| Undergraduate student | Visual exploration, comparing forms and decoration, saving examples |
| Reviewer or steward | See what needs review, approve or return contributions, keep records trustworthy |
| Administrator | Load existing data, import documents, manage users |
| Public visitor | Browse and search published records without an account |

---

## Flow 1: Opening the site and signing in

**Who:** Everyone.

1. The user opens the PACP website. The browser loads the application from Amplify Hosting.
2. Public records and search work without signing in.
3. To do more, the user signs in. The application sends them to Cognito, which checks their credentials and returns a signed token containing their group (student, contributor, reviewer, or admin).
4. From then on, every request to API Gateway carries that token. API Gateway rejects requests without a valid token for protected routes, and the `API` function uses the group to decide what the user may see and do.
5. On first sign-in, the user completes a profile (name, affiliation, ORCID if they have one). This is stored in the Contributor table in the database and linked to their Cognito account.

**Architecture used:** Amplify, Cognito, API Gateway, `API`, RDS.

---

## Flow 2: Searching by words and filters

**Who:** Everyone.

1. The user types a term such as "Salado polychrome jar" and optionally sets filters: ware, form, region, period, site, review status.
2. The application sends the search to API Gateway, which passes it to `API`.
3. `API` runs one database query. Exact and partial words are matched with PostgreSQL full-text search; misspellings and alternate names are matched with `pg_trgm` and the synonyms table. Filters become conditions in the same query.
4. The database returns the matching records and, in the same query, the counts for each filter value (for example, Hohokam 12, Salado 4). The counts are shown in the filter sidebar.
5. Records that the user's group may not see are excluded by their privacy level.
6. Thumbnails are requested from `API`, which reads them from `derivatives/` and returns them.

Search works across record types. A search for a site name returns the site, its vessels, and its assemblages.

**Architecture used:** API Gateway, `API`, RDS (`pg_trgm`, full-text search), S3 `derivatives/`.

---

## Flow 3: Identifying a sherd from a photo or a description

**Who:** CRM archaeologists, students.

1. The user chooses Identify a Sherd, uploads a photo or types a description, and optionally selects observable traits: form, surface treatment, temper, region.
2. `API` receives the request. It sends the photo (or the description text) to Nova Multimodal Embeddings, which returns a fingerprint.
3. `API` asks the database for the twenty stored records whose fingerprints are closest to the query, restricted by any selected traits. This uses `pgvector`.
4. `API` then counts, for each of the twenty, how many catalogued attributes match the traits the user selected, and ranks by that count.
5. The results show each candidate with its image, chronology, and a line such as "Matched: form, temper, region". The user sees why each match is there.
6. The user compares candidates side by side and can save a tentative interpretation on their own record, with a confidence level. This is stored in the interpretations table.
7. The user can download citation-ready references for the matched types. `API` builds these from the bibliography and version tables.

The query photo is used once and is not stored.

**Architecture used:** API Gateway, `API`, Nova Multimodal Embeddings, RDS (`pgvector`), S3 `derivatives/`.

---

## Flow 4: Viewing a record

**Who:** Everyone, subject to privacy level.

1. The user opens a vessel, type, ware, site, petro-fabric, workshop, or sample page.
2. `API` reads the record and everything linked to it in one query: attributes, related records, images, bibliography, contributors, interpretations, annotations, review status, and version history.
3. The page shows the current version, all interpretations side by side with their authors, the review status and recent review activity, and a link to the full version history.
4. Images are served by `API` from `derivatives/`. Full-resolution originals from `originals/` are available only to signed-in users whose group is allowed by the record's privacy level.
5. Related records are links, so the user can move from a vessel to its type, to the ware, to other vessels of that ware.

**Architecture used:** API Gateway, `API`, RDS, S3 `derivatives/` and `originals/`.

---

## Flow 5: Contributing a record, including drafts and partial records

**Who:** Contributors, reviewers, administrators.

1. The user opens the contribution form. The form is split into sections; only a small set of fields is required to save a draft.
2. The user fills in what they know and attaches one or more photos. Save Draft is the default action.
3. `API` writes the record to the database with status Draft and writes each photo to `originals/vessel/{id}/`. It records who created it and when, and creates the first row in the version history.
4. S3 notices each new image and starts `Media`. `Media` makes a web-size copy and a thumbnail in `derivatives/vessel/{id}/`, sends the web-size copy to Nova Multimodal Embeddings, and stores the fingerprint and file paths on the record. The user does not wait for this.
5. The user can return later, complete more sections, and save again. Each save creates a new version. Nothing is overwritten.
6. When ready, the user submits the record for review. Its status becomes Needs Review and it appears in the review queue.
7. The user's profile shows their contribution activity: uploads, edits, annotations, reviews.

Partial records are valid records. The system rewards incremental contribution rather than demanding complete ones.

**Architecture used:** API Gateway, `API`, RDS, S3 `originals/` and `derivatives/`, `Media`, Nova Multimodal Embeddings.

---

## Flow 6: Extracting records from reports and theses

**Who:** Administrators, contributors with document access.

1. The user uploads a PDF (a CRM report or thesis) through Upload Project Data.
2. `API` writes the file to `docs/` and creates an import job row in the database.
3. S3 notices the new file and starts `Doc`.
4. `Doc` opens the PDF. For each page with a text layer, it takes the text. For each scanned page, it renders the page as an image.
5. `Doc` sends the text or page image to Claude Sonnet 4.6 together with the PACP schema and asks for every ceramic record described on the page, with the page number for each fact and null for anything not stated.
6. Each returned record is written to the database with status Draft and a source such as "Smith 2019, p. 14". Extracted records never bypass review.
7. The import job shows progress and finishes with a count of records created.
8. Reviewers see the new drafts in the review queue (Flow 8), each with its source page reference for checking.

**Architecture used:** API Gateway, `API`, S3 `docs/`, `Doc`, Claude Sonnet 4.6, RDS.

---

## Flow 7: Importing structured data from spreadsheets

**Who:** Administrators, contributors with data access.

1. The user uploads a CSV file through Upload Project Data.
2. `API` writes it to `docs/` and creates an import job.
3. S3 starts `Doc`. `Doc` reads the file, validates each row against the schema, and writes valid rows to the database as Draft records.
4. Rows that fail validation are written to an error file in `exports/{user}/` with the reason for each failure. The user downloads it, fixes the rows, and uploads again.
5. Valid rows appear in the review queue.

This is also the path for migrating PACP's existing database into the new schema. No AI is used for CSV import.

**Architecture used:** API Gateway, `API`, S3 `docs/` and `exports/`, `Doc`, RDS.

---

## Flow 8: Reviewing contributions and keeping records trustworthy

**Who:** Reviewers, administrators.

1. The reviewer opens the review queue. `API` lists records by status: Needs Review, Under Review, Revision Submitted.
2. The reviewer opens a record and sees the submitted version, its images, the contributor, the source (manual entry, document page, or import job), and any earlier review notes.
3. The reviewer takes one action: mark as Under Review, request revision with a note, or mark as Community Reviewed. Administrators can also mark a record as Stewarded.
4. `API` updates the status and writes a review event with the reviewer's identity, the action, the note, and the timestamp. The event is attached to the specific version reviewed.
5. Records that reach Community Reviewed or Stewarded become visible to the public according to their privacy level. Draft and Needs Review records are visible only to their contributor and to reviewers.
6. The record page shows the review history openly: who reviewed, when, and what they said.

Review is done by people. The system provides the queue, the status model, and the audit trail. It does not approve or reject anything on its own.

**Architecture used:** API Gateway, `API`, RDS.

---

## Flow 9: Multiple interpretations, annotations, and debate

**Who:** Contributors, students, reviewers.

1. On any record, a signed-in user can add an interpretation (for example, an alternative type identification) with a confidence level and a note.
2. `API` stores it in the interpretations table. A record can hold any number of interpretations. None is marked as the single correct one.
3. Users can annotate a record or an interpretation with a comment. Comments are attributed and timestamped.
4. The record page shows all interpretations side by side, the annotations under each, and the version history, so a student can follow how a classification was debated and revised over time.
5. Comments flagged by users go to the review queue for a reviewer to look at.

**Architecture used:** API Gateway, `API`, RDS.

---

## Flow 10: Version history and provenance

**Who:** Everyone, on every record.

1. Every save of a record creates a new row in the version history with the full record as saved, the author, the time, and an optional change note.
2. The record page has a View History action. `API` returns the list of versions.
3. The user can open any earlier version, or select two versions and see what changed between them.
4. Citations point to a specific version. A citation for version 3 of a record stays correct even after version 4 is saved.
5. Reviews and annotations are attached to the version they were made on, so the context of each comment is preserved.

**Architecture used:** API Gateway, `API`, RDS.

---

## Flow 11: Asking the assistant

**Who:** Signed-in users.

1. The user types a question in the chat panel, for example "What Salado types are found at sites in the Tonto Basin dated after 1300?"
2. API Gateway routes the request to `Assistant`.
3. `Assistant` loads the conversation so far and sends it to Claude Sonnet 4.6 along with a small set of tools: search records, get a record, list sites, compare records.
4. Claude decides it needs data and asks to run a tool. `Assistant` runs the matching database query and returns the result to Claude. This may happen more than once.
5. Claude writes an answer. `Assistant` returns it with the records it used as cards the user can open.
6. The conversation is saved so the user can continue it later.

Claude never reads the database directly. It only gets what the tools return, and the tools apply the same privacy rules as the rest of the platform.

**Architecture used:** API Gateway, `Assistant`, Claude Sonnet 4.6, RDS.

---

## Flow 12: Preparing report material

**Who:** CRM archaeologists, graduate students.

1. The user selects the records they have identified and chooses Generate Report Text.
2. `API` gathers the data from the database: typology attributes, chronology ranges, bibliography entries, and image credits from the media table.
3. `API` sends the gathered data to Claude Sonnet 4.6 and asks for a draft typology summary in a neutral archaeological register. The model writes only from the data it is given.
4. `API` assembles the package: summary text, chronology table, bibliography, image credits, and a citation file. It produces PDF, Word, and citation formats and writes them to `exports/{user}/`.
5. The user downloads the files through `API`. The text is a draft for the user to edit, not a finished report.

**Architecture used:** API Gateway, `API`, RDS, Claude Sonnet 4.6, S3 `exports/`.

---

## Flow 13: Visual exploration and saving examples

**Who:** Undergraduate students, public visitors.

1. The user browses galleries by ceramic tradition, vessel form, slip, or decoration.
2. `API` returns records with thumbnails from `derivatives/`, filtered by the chosen facet and by privacy level.
3. The user compares forms and decoration visually and saves examples to a personal collection.
4. Collections are stored in the database and can be reopened, compared, or exported as a citation list.

**Architecture used:** API Gateway, `API`, RDS, S3 `derivatives/`.

---

## Flow 14: Task-based homepage

**Who:** Everyone, tailored by group.

1. After sign-in, the homepage shows task cards suited to the user's group: Identify a Sherd, Find Regional Parallels, Generate Report Text, Upload Project Data, Review Records, Learn Typology, Explore Ceramic Traditions.
2. Some cards are live. Records Needing Review shows the current count. Records Missing Chronology and Records Without Images list work that contributors can pick up.
3. Each live card is a saved database query. `API` runs it when the homepage loads.

**Architecture used:** Amplify, API Gateway, `API`, RDS.

---

## Flow 15: Loading the existing collection

**Who:** Administrators, once.

1. The existing PACP database is exported to CSV files matching the new schema and imported through Flow 7.
2. The existing image collection (about 100,000 files) is copied directly into `originals/` with the AWS command line, bypassing the 10 MB upload limit of the application.
3. S3 starts `Media` for each file. `Media` creates derivatives and fingerprints and links each image to its record.
4. Once complete, every existing image is searchable by similarity and every record is browsable.

**Architecture used:** S3 `originals/` and `derivatives/`, `Media`, Nova Multimodal Embeddings, RDS.

---

## Summary table

| Flow | User-facing function | Background function | Database | S3 folders | AI model |
|---|---|---|---|---|---|
| 1 Sign in | `API` | | RDS | | |
| 2 Word search | `API` | | RDS | `derivatives/` | |
| 3 Identify a sherd | `API` | | RDS (pgvector) | `derivatives/` | Nova Embeddings |
| 4 View record | `API` | | RDS | `derivatives/`, `originals/` | |
| 5 Contribute | `API` | `Media` | RDS | `originals/`, `derivatives/` | Nova Embeddings |
| 6 Extract from PDF | `API` | `Doc` | RDS | `docs/` | Claude Sonnet 4.6 |
| 7 Import CSV | `API` | `Doc` | RDS | `docs/`, `exports/` | |
| 8 Review | `API` | | RDS | | |
| 9 Interpretations | `API` | | RDS | | |
| 10 Version history | `API` | | RDS | | |
| 11 Assistant | `Assistant` | | RDS | | Claude Sonnet 4.6 |
| 12 Report material | `API` | | RDS | `exports/` | Claude Sonnet 4.6 |
| 13 Visual exploration | `API` | | RDS | `derivatives/` | |
| 14 Homepage tasks | `API` | | RDS | | |
| 15 Initial load | | `Media`, `Doc` | RDS | `originals/`, `derivatives/`, `docs/` | Nova Embeddings |

---

## Deferred to a later phase

The following appear in project discussions but are not part of this design:

- Instructor-assigned coursework with student submissions and instructor review.
- Live synchronization with external identifier registries (PeriodO, site gazetteers). Identifiers are stored as links in this phase.
- Minting DOIs. ARK identifiers can be assigned by the platform once PACP registers a Name Assigning Authority Number.
- Role changes from within the application. These are done in the Cognito console in this phase.
- Reputation systems and community endorsement workflows.
