# Deploying the PACP prototype

For whoever puts this on a public URL for the 20 October meeting.

## What the stakeholders need to be able to do

Click through the PDF upload feature without an API key. The demo path
(`/submit/report?example=1`) uses 29 records prepared by hand from the Pueblo
Grande report and makes no model calls, so **a deploy with no secrets works for
the whole walkthrough**.

Live extraction (uploading your own PDF) is the only thing that needs a key.

## Deploy

```bash
cd pacp && npm ci && npm run build
```

Then, from `pacp/`:

```bash
npx vercel login && npx vercel deploy --prod
```

Vercel detects Next.js; no build settings to change. The repo has no `.env`
file — only `.env.local.example` — so nothing secret is in the tree.

To enable live extraction as well, set one environment variable in the Vercel
project (Settings → Environment Variables), then redeploy:

| Variable | Value |
| --- | --- |
| `ANTHROPIC_API_KEY` | an Anthropic API key |

Without it the upload screen still loads and says live extraction is
unavailable; the example report is unaffected.

## Walkthrough to send with the link

1. **`/onboarding`** — pick *CRM Archaeologist* (or *Graduate Student*). This
   decides which review layout the upload screen opens in.
2. **Submit → Upload a Report → Try the Example Report.** 29 proposed records
   from the Pueblo Grande report, each tied to the page it came from.
3. **Read the line above the list**: accepting creates a Draft, not a
   published record.
4. **Switch to the Graduate Student tab.** Scroll to *Gila Plain, Gila
   variety*, *Sacaton Red* or *Salado Polychrome* — each shows **Possible match
   in PACP** with the existing record, its ware family, its stewardship badge
   and how strong the match is. *View existing record* opens it in a new tab.
   *Link to this existing record* attaches the extracted passage to the
   existing record as a note instead of creating a duplicate.
5. **Accept all as Drafts.** Nothing is published; *Reject all* asks first.
6. **Home** now shows *N drafts awaiting review*. It opens Browse filtered to
   Status = Draft, assigned to me — the work table is Browse, not a new page.
7. **Review draft →** on any row opens the normal record detail page, which
   now carries a **Source** panel (PDF, page, who, when) and a **⋯ → Move to…**
   menu on every extracted field. A moved field leaves a struck-through
   placeholder saying where it went, undoable in one click. Promote the record
   through Draft → Community Reviewed → Stewarded; the source trail stays.

## Two things to flag when you share it

- **State is per-browser.** Drafts, links and field moves are saved in
  `localStorage`, so each reviewer sees only their own and nothing is shared
  between them. That is the prototype standing in for a backend.
- **The Southwest type records are new mock data.** Gila Plain, Sacaton Red,
  Salado Polychrome, Hohokam Plainware and Hohokam Redware were added to the
  mock type library so the duplicate-detection callout has something real to
  match against — the library was previously all Mesoamerican, and nothing in a
  Phoenix Basin report could ever have matched it.

## Draft message for Costellina and Andrea

> Subject: PACP prototype — the PDF upload changes from 3 October
>
> Hi Costellina, Hi Andrea,
>
> The prototype is updated with what you asked for on 3 October, and it is
> online so you can click through it before the 20th: [LINK]
>
> What changed:
>
> - **Accept all / Reject all** at the top of the extraction list. Rejecting
>   in bulk asks first. Accepting never publishes — see the next point.
> - **"Accept as Draft"** is now the button label, with a line above the list
>   saying what that means: a Draft in your work table, not a published record.
> - **Possible match in PACP.** When an extracted ware or type looks like
>   something already in the database, the record shows up to three candidates
>   with their ware family, stewardship status and how strong the match is.
>   You can link to the existing record — which keeps the extracted passage on
>   it as a note — or create a new record anyway.
> - **A work table.** The home page shows how many drafts are waiting; it
>   opens Browse filtered to your drafts. It is the Browse view you already
>   know, not a new screen.
> - **Rerouting fields.** On a draft record, every field from the PDF has a ⋯
>   menu with "Move to…". The original spot keeps a struck-through note saying
>   where it went, and one click undoes it.
> - **The source trail.** Every draft says which PDF and page it came from,
>   who uploaded it and when, and each field can show the passage it was read
>   from. That stays on the record after it is promoted to Community Reviewed
>   or Stewarded.
>
> Two things to know while you click: the example report runs on records we
> prepared by hand, so nothing is being sent to an AI as you browse; and
> anything you accept is saved only in your own browser, so you cannot disturb
> anyone else's copy.
>
> Any reactions before the 20th are welcome — including "this is the wrong
> shape", which is easier to act on now than after.
