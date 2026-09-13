# Architecture Deep Dive

This document describes the proposed AWS architecture for the Pan-American Ceramics Project (PACP) platform. It explains what each part of the system does, how the parts work together, and why the main design choices were made.

It is written for both technical and non-technical readers. Technical detail is kept to what is needed to understand and build the system.

---

## 1. What the platform needs to do

PACP brings together ceramic artifact data that is currently spread across CRM reports, museum collections, academic publications, theses, and private databases. The platform must let archaeologists, CRM professionals, and students:

- Store structured records for vessels, wares, types, sites, petro-fabrics, workshops, periods, contributors, and bibliography, with the links between them.
- Search those records by exact terms, partial or misspelled terms, filters, and free-text descriptions.
- Upload a photo of a sherd and find records that look similar.
- Contribute new or partial records, attach images, and save drafts.
- Review contributions before they become visible to the public.
- Keep a full history of who changed what, and when.
- Hold several interpretations of the same object side by side.
- Extract records from PDF reports and theses with AI help, for human review.
- Ask questions in plain language through an assistant that answers from the database.
- Prepare report material (typology summaries, chronology, bibliography, image credits) for export.

The platform is being designed as a proof of concept. It must be inexpensive to run, simple to operate, and easy to grow later.

---

## 2. Architecture diagram

![Architecture Diagram](./media/architecture.png)

---

## 3. The architecture in one paragraph

Users open the PACP web application, which is hosted on AWS Amplify. They sign in through Amazon Cognito. Every action in the application is sent to Amazon API Gateway, which checks the user's identity and passes the request to one of two AWS Lambda functions: `API` for all normal operations, or `Assistant` for the chat feature. Both functions read and write a single Amazon RDS for PostgreSQL database. Files (images, PDFs, CSVs, exports) live in one Amazon S3 bucket. When a file lands in the bucket, S3 automatically starts one of two background Lambda functions: `Media` for images, or `Doc` for documents. AI features use Amazon Bedrock, with Amazon Nova Multimodal Embeddings for image fingerprints and Anthropic Claude Sonnet 4.6 for all language tasks. Users never talk to S3, the database, or Bedrock directly. Everything goes through a Lambda function.

---

## 4. Components

### Web application: AWS Amplify Hosting

The redesigned PACP website is a Next.js application. Amplify builds it from this repository and serves it to users over HTTPS. Amplify handles the content delivery network, certificates, and deployments. There are no web servers to manage.

### Identity: Amazon Cognito

Cognito holds user accounts and handles sign-up, sign-in, and password reset. Each user belongs to a group that defines what they may do:

| Group | Can do |
|---|---|
| public (not signed in) | Browse and search published records |
| student | Everything public, plus save collections and add interpretations |
| contributor | Everything student, plus create records and upload files |
| reviewer | Everything contributor, plus review and change record status |
| admin | Everything, plus data imports and user management |

When a user signs in, Cognito issues a signed token that carries the user's group. The web application sends this token with every request.

### Front door: Amazon API Gateway

API Gateway is the single entry point for all requests from the web application. It verifies the Cognito token before anything else runs, rejects requests that are not allowed, and forwards valid requests to the right Lambda function. It also enforces a 10 MB limit on any single request, which is enough for web-size images, CSV files, and PDF reports uploaded through the application.

### Compute: four AWS Lambda functions

Lambda runs code only when there is work to do. There are no servers running idle. The platform uses four functions, each with one job:

| Function | Started by | What it does |
|---|---|---|
| `API` | API Gateway, on every user request | Search, browse, record pages, uploads, drafts, review actions, reports, exports, serving images. Reads and writes the database and S3. Calls Bedrock for image search and report text. |
| `Assistant` | API Gateway, on `/chat` requests | Runs the conversation with Claude. Claude answers by calling a small set of database tools. Kept separate because conversations run longer than normal requests. |
| `Media` | S3, when an image lands in `originals/` | Makes a web-size copy and a thumbnail, creates the image fingerprint with Nova Multimodal Embeddings, and stores paths and fingerprint in the database. |
| `Doc` | S3, when a PDF or CSV lands in `docs/` | For PDFs, reads the text (or the page image when the PDF is scanned) and asks Claude to return records in the PACP schema. For CSVs, validates rows. Writes results as draft records. Writes row errors to `exports/`. |

`API` and `Assistant` respond to users and are sized for speed. `Media` and `Doc` run in the background and are sized for long files. Splitting them means a large PDF can take several minutes to process without slowing down anyone browsing the site.

### Database: Amazon RDS for PostgreSQL

One PostgreSQL database holds all structured data. Two PostgreSQL extensions are enabled:

- `pgvector` stores image fingerprints and finds the closest matches to a query fingerprint. This is what powers "find similar sherds".
- `pg_trgm` matches misspelled or partial words. "Panama Plian" finds "Panama Plain".

Everything else the platform needs from a database (joins across related tables, counts for search filters, date ranges, version history, full-text search with synonyms) is standard PostgreSQL.

### File storage: one Amazon S3 bucket

All files live in one bucket, organized by folder:

| Folder | Contents | Written by | Read by |
|---|---|---|---|
| `originals/{entity}/{id}/` | Full-resolution uploaded images | `API`, one-time bulk load | `Media`, `API` (for signed-in users with access) |
| `derivatives/{entity}/{id}/` | Web-size image and thumbnail | `Media` | `API` (serving pages) |
| `docs/` | Uploaded PDFs and CSVs | `API` | `Doc` |
| `exports/{user}/` | Generated reports, citation files, CSV error reports | `API`, `Doc` | `API` (downloads) |

`{entity}` is the type of record the image belongs to (vessel, type, ware, site, workshop, petrofabric, sample). The bucket is private. Files are only reached through the `API` function, which checks the user's permissions and the record's privacy level first.

### AI: Amazon Bedrock

Two models are used, both through Bedrock. No model is trained or hosted by PACP.

| Model | Used for | Called by |
|---|---|---|
| Amazon Nova Multimodal Embeddings | Turning an image or a text description into a fingerprint (a list of numbers) so that similar items can be found | `Media` (every stored image), `API` (each search query) |
| Anthropic Claude Sonnet 4.6 | Reading documents into structured records, answering assistant questions, writing report text, describing images | `Doc`, `Assistant`, `API` |

The model used by each function is a configuration setting, so a model can be changed without changing code.

---

## 5. How a request moves through the system

### A user request

1. The user does something in the web application, for example runs a search.
2. The application sends the request to API Gateway with the user's Cognito token.
3. API Gateway checks the token and passes the request to `API` (or `Assistant` for chat).
4. The function reads or writes the database, and S3 or Bedrock if needed.
5. The result goes back through API Gateway to the application.

The user waits for steps 2 to 5. They take well under a second for most operations.

### A background job

1. `API` writes an uploaded file to S3.
2. S3 notices the new object and starts `Media` or `Doc`, depending on the folder.
3. The function processes the file and writes results to the database and S3.
4. The user is not waiting. When they next open the record, the results are there.

Background jobs are the only way images get fingerprints and documents get turned into records. The same path handles the one-time load of PACP's existing image collection: files are copied into `originals/` with the AWS command line, and `Media` processes each one.

---

## 6. Networking and access

### Virtual Private Cloud

The four Lambda functions and the database run inside a private network (an Amazon VPC). The database has no public address and accepts connections only from the Lambda functions.

Because the functions are inside the private network, they need a controlled path to the AWS services outside it. This is done with two VPC endpoints:

| Endpoint | Type | Reaches |
|---|---|---|
| S3 gateway endpoint | Gateway (no charge) | The S3 bucket |
| Bedrock runtime endpoint | Interface (hourly charge) | Both Bedrock models |

A NAT Gateway is not used. It would cost more and is not needed because the functions only call S3 and Bedrock.

### Who can reach what

| From | To | Allowed |
|---|---|---|
| Browser | Amplify, API Gateway | Yes |
| Browser | S3, RDS, Bedrock, Lambda | No |
| API Gateway | `API`, `Assistant` | Yes, after token check |
| S3 events | `Media`, `Doc` | Yes |
| Any Lambda | RDS, S3, Bedrock | Yes, through the VPC |
| Anything else | RDS | No |

### Data privacy

Every record type in the PACP schema carries a privacy level. `API` applies it on every read: a record or image is returned only if its privacy level allows the requesting user's group. Sensitive site locations therefore stay hidden from public users even when the site appears in search results.

### Proof of concept shortcuts

Two choices are made to keep the proof of concept simple. Both should be revisited before production use:

- Database credentials are stored as encrypted environment variables on the Lambda functions, rather than in AWS Secrets Manager. Using Secrets Manager from inside the VPC would need a third endpoint.
- User role changes (for example, promoting a contributor to reviewer) are done by an administrator in the Cognito console, not through the application.

---

## 7. Data model

The database follows the PACP entity relationship diagram supplied by the project team. The main entities are Vessel, Type, Ware, Petro-Fabric, Site, Region, Country, Kiln/Workshop, Assemblage, Period, Contributor, Bibliography, Vessel Technology, Vessel Morphology, Vessel Part, and Petrographic Sample. Many of these link to each other in both directions, and Bibliography, Contributor, and images can attach to several different entity types.

The following are added on top of that diagram to support the platform features:

| Table | Purpose |
|---|---|
| `record_versions` | One row per saved version of any record, never overwritten. Holds the full record as saved, who saved it, when, and a change note. |
| `review_events` | Each review action: reviewer, record version, review type, note, timestamp. |
| `status` on each record | Draft, Needs Review, Under Review, Revision Submitted, Community Reviewed, Stewarded. |
| `interpretations` | Multiple identifications for one record, each with author, confidence, and notes. |
| `annotations` | Comments on records or interpretations. |
| `media` and `media_links` | One table for all images, with the S3 paths, caption, credit, and fingerprint. `media_links` connects an image to any entity with a role (primary, gallery, profile, plate). One image can serve several records. |
| `synonyms` | Alternate names and spellings used by search. |
| `saved_sets` | Comparison sets and collections saved by users. |
| `persistent_ids` | Persistent identifiers (ARK or DOI) assigned when a record is first reviewed. |

Contributor profiles (ORCID, affiliation, biography) live in the Contributor table and are linked to the Cognito account by the Cognito user ID.

---

## 8. Key architectural decisions

### Decision 1: One PostgreSQL database instead of DynamoDB and OpenSearch

**Status:** Accepted

**Context.** The platform needs a database that can hold deeply linked records, keep version history, run fuzzy and filtered searches, and find similar images. Three options were evaluated.

**Options considered.**

1. *Amazon DynamoDB with Amazon OpenSearch.* DynamoDB is a key-value store. It returns one item per key and cannot join tables or search text. Each relationship in the PACP schema would have to be maintained by application code, and each new question the platform needs to answer would need an index designed in advance. DynamoDB added native vector search in August 2026, which covers image similarity, but its filters support only exact matches and it still has no fuzzy or faceted search. Those would still need OpenSearch as a second copy of the data, kept in sync by a pipeline. The smallest OpenSearch domain costs more per month than the whole PostgreSQL option.

2. *Amazon Aurora Serverless v2 for PostgreSQL.* Same engine and extensions as the chosen option, with automatic scaling and an HTTPS Data API that would remove the need for a VPC. Its minimum cost is around 44 dollars per month even when idle, and automatic scaling is not needed at proof of concept traffic.

3. *Amazon RDS for PostgreSQL with pgvector and pg_trgm.* Standard PostgreSQL. Joins, version history, counts, date ranges, full-text search, fuzzy matching, and vector similarity all run in the same database with standard SQL. The smallest instance is free for twelve months on a new AWS account and about 15 dollars per month after that.

**Decision.** Option 3.

**Rationale.** The PACP entity relationship diagram has about twenty linked tables with many-to-many and polymorphic relationships. This is exactly what a relational database is built for. One database with no synchronization is simpler to build, cheaper to run, and easier to hand over. If the platform ever outgrows the instance, it can be resized or moved to Aurora with no change to the schema or code.

**Consequences.** Lambda functions must run inside a VPC to reach the database, which adds the two VPC endpoints described in section 6. The database runs in a single availability zone for the proof of concept.

### Decision 2: Claude Sonnet 4.6 for all language tasks

**Status:** Accepted

**Context.** The platform has four language tasks: turning document text into structured records, answering assistant questions using database tools, writing report text, and describing images. Amazon Nova Pro and the Claude Haiku, Sonnet, and Opus families on Bedrock were considered.

**Decision.** One model, Claude Sonnet 4.6, for all four tasks.

**Rationale.** Document extraction is the task where quality is most visible, because errors reach reviewers. Sonnet handles page images from scanned reports and returns structured output reliably. Using one model everywhere keeps configuration and testing simple. At PACP's expected usage the total cost of language models is a few dollars per month, so the price difference between models does not change the outcome. Larger Claude models cost five to ten times more and offer no visible benefit for these tasks.

**Consequences.** The model ID is one setting per Lambda function. It can be changed without code changes if a better or cheaper option appears.

### Decision 3: No Amazon Textract

**Status:** Accepted

**Context.** Textract converts PDF pages to text and tables before a language model reads them. It is accurate on dense tables but adds a service, a VPC endpoint, and a per-page charge.

**Decision.** Read PDFs inside the `Doc` function with the PyMuPDF library. When a page has a text layer, send the text to Claude. When a page is a scanned image, send the page image to Claude, which reads it directly.

**Rationale.** Claude Sonnet reads page images itself, so a separate reading step is not needed. The cost per page is lower. All extracted records go to the review queue as drafts, so a reviewer catches any misread cell before it is published.

**Consequences.** Very dense tables may occasionally lose a cell alignment. If reviewers correct these often, Textract can be added back as one extra call inside `Doc`.

### Decision 4: Lambda inside the VPC with endpoints, no NAT Gateway

**Status:** Accepted

**Context.** The database has no public address, so the functions that use it must be in the same private network. Functions inside a private network need a path to S3 and Bedrock.

**Decision.** Use one S3 gateway endpoint (no charge) and one Bedrock interface endpoint (about 7 dollars per month). Do not use a NAT Gateway (about 32 dollars per month).

**Rationale.** The functions call only S3 and Bedrock. Endpoints cover both at lower cost and keep traffic off the public internet.

**Consequences.** The functions cannot reach other external services. Cognito administration and external identifier services (PeriodO, gazetteers, ARK resolvers) are therefore handled outside the functions in the proof of concept.

### Decision 5: Human review on every AI output

**Status:** Accepted

**Context.** The project scope excludes automated interpretation and moderation without human review.

**Decision.** No AI output is published directly. Records extracted from documents, records suggested from images, and assistant answers are either drafts awaiting review or displayed to the user as suggestions with the source shown. Moderation of community content is done by reviewers without AI scoring.

**Rationale.** This matches the project scope and keeps the platform's stance clear: the system narrows possibilities and shows its reasoning, people decide.

### Decision 6: Similarity ranking by counted attributes

**Status:** Accepted

**Context.** Users need to understand why a match was suggested. A single similarity score from a model does not explain itself.

**Decision.** Image and description similarity is used to find candidate records. The displayed ranking then counts how many catalogued attributes (form, surface treatment, temper, region, period) each candidate shares with the query, and the interface shows which ones matched.

**Rationale.** "Four of five attributes align" is a statement a user can check. It supports defensible narrowing rather than forced certainty, which the scope document asks for.

---

## 9. Known limits of this design

- Single database instance in one availability zone. Suitable for a proof of concept, not for production uptime requirements.
- Uploads through the application are limited to 10 MB per file. Larger files, and the initial bulk load of the existing image collection, go directly to S3 with the AWS command line.
- Newly uploaded images are searchable by similarity only after `Media` has processed them, usually within a minute.
- The Lambda functions cannot call services outside AWS. Live synchronization with external identifier registries is deferred.
- Role changes require an administrator to use the Cognito console.

---

## 10. Related documents

- [User Flows](./userFlow.md) describes each user story and how the architecture supports it.
- [Cost Estimation](./costEstimation.md) gives the expected monthly and one-time costs.
- [Deployment Guide](./deploymentGuide.md) covers how to deploy the stack.
