# Cost Estimation

> **Disclaimer.** This estimate reflects the architecture and decisions as of 14 September 2026. AWS prices, model prices, free tiers, and service availability change over time, and the architecture itself may change as the project progresses. Figures here are planning estimates, not quotes. Actual costs depend on usage and should be tracked in AWS Cost Explorer once the platform is deployed.

---

## 1. How the estimate was produced

Unit prices for AWS services were retrieved with the AWS Pricing MCP server, which reads the AWS Price List API. Prices for Anthropic Claude models on Amazon Bedrock were taken from the published Bedrock price list, since they are not exposed through that API. Usage quantities are project assumptions, listed in section 2.

All prices are for the US East (N. Virginia) region, on-demand, in US dollars.

---

## 2. Assumptions

### Users and traffic

PACP has a large data collection and a small, specialist user base. The estimate assumes:

| Item | Assumption |
|---|---|
| Monthly active users | 100 |
| Daily active users | 10 |
| API requests per month | 50,000 |
| Lambda invocations per month | 100,000 |
| Data served to browsers per month | 60 GB |
| Assistant conversations per month | 1,000 |
| Image similarity searches per month | 1,500 |
| Reports generated per month | 30 |
| New record submissions per month | 100 |
| New document pages processed per month | 500 |

### Data

| Item | Assumption |
|---|---|
| Existing images | 100,000 images at about 40 MB each, 4 TB total |
| Web-size copy and thumbnail per image | About 330 KB per image, 33 GB total |
| Database records | About 100,000 rows across all entities |
| Image fingerprints | 100,000 vectors, about 400 MB |
| Existing document backlog | 50,000 PDF pages, one time |

### Infrastructure choices

| Item | Assumption |
|---|---|
| Database | RDS for PostgreSQL, `db.t4g.micro`, single availability zone, 20 GB gp3 storage |
| Original images storage class | S3 Intelligent-Tiering. Files that are not opened move to cheaper tiers automatically. |
| VPC endpoints | One S3 gateway endpoint (no charge), one Bedrock interface endpoint |
| Language model | Claude Sonnet 4.6, on-demand for user-facing calls, batch mode for document processing |
| Embedding model | Amazon Nova Multimodal Embeddings |
| Fingerprints | Created from the web-size copy, never from the 40 MB original |

### Not included

- Staff and development time
- Domain name registration
- Data transfer into AWS (no charge)
- Costs during development and testing before the platform is live

---

## 3. Recurring monthly cost

| Line | Monthly | Notes |
|---|---|---|
| S3, 4 TB originals | $17 | Intelligent-Tiering steady state. About $51 during the first 90 days while files settle into tiers. S3 Standard would be about $94. |
| S3, derivatives, requests, data out | $1 | Within or near free tier at this traffic |
| RDS for PostgreSQL `db.t4g.micro` with 20 GB storage | $14 | Free for the first 12 months on a new AWS account. `db.t4g.small` would be $26. |
| Bedrock VPC interface endpoint | $8 | Hourly charge plus data processing |
| Lambda, API Gateway, Amplify Hosting, Cognito | $2 | All within or near free tier at this traffic |
| Claude Sonnet 4.6, assistant | $27 | 1,000 conversations, about 6,000 input and 600 output tokens each |
| Claude Sonnet 4.6, document processing | $4 | 500 pages, batch mode |
| Claude Sonnet 4.6 and Nova Embeddings, reports, image searches, descriptions | $4 | |
| **Total** | **about $77** | |

Notes on the total:

- Fixed infrastructure (S3, RDS, endpoint) is about $39 per month and does not change with traffic.
- AI usage is about $35 per month at the assumed traffic and grows roughly in proportion to use.
- In the first 12 months on a new account, with the RDS free tier, the total is about $63.
- In the first 90 days, while S3 Intelligent-Tiering settles, the total is about $111.

---

## 4. One-time costs for loading existing data

| Task | Cost | Notes |
|---|---|---|
| Upload 4 TB and create derivatives and thumbnails | $20 | S3 requests and 100,000 `Media` function runs |
| Fingerprint 100,000 images with Nova Multimodal Embeddings | $10 to $17 | Depends on batch availability |
| Read 50,000 document pages with Claude Sonnet 4.6, batch mode | $410 | About $825 if run on-demand instead |
| **Total** | **about $440 to $450** | |

---

## 5. Calculation detail

**S3 originals.** 4,096 GB in Intelligent-Tiering. Files not accessed for 90 days move to Archive Instant Access at $0.004 per GB-month. Steady state assumes most files are there: 4,096 × $0.004 ≈ $16.40, plus monitoring at $0.0025 per 1,000 objects. Standard tier for comparison: 4,096 × $0.023 ≈ $94.

**RDS.** `db.t4g.micro` at about $0.016 per hour × 730 hours ≈ $12, plus 20 GB gp3 at $0.115 per GB-month ≈ $2.

**VPC interface endpoint.** $0.01 per hour × 730 ≈ $7.30, plus $0.01 per GB processed.

**Claude Sonnet 4.6.** $3.00 per million input tokens, $15.00 per million output tokens. Batch mode is half price.

- Assistant: 1,000 × (6,000 × $3 + 600 × $15) ÷ 1,000,000 ≈ $27.
- Document page: about 1,500 input tokens (text or page image) and 800 output tokens ≈ $0.0165 per page on-demand, $0.0083 in batch. 500 pages ≈ $4 in batch. 50,000 pages ≈ $410 in batch.

**Media function.** 100,000 runs at about 10 seconds and 1 GB memory = 1,000,000 GB-seconds × $0.0000166667 ≈ $17.

---

## 6. Where the cost can move

| Lever | Effect |
|---|---|
| S3 storage class | Intelligent-Tiering vs Standard is about $77 per month at 4 TB. Intelligent-Tiering is the right default for an archive that is rarely opened. |
| Database size | `db.t4g.micro` to `db.t4g.small` adds $12 per month. Start small, resize only if needed. |
| Assistant usage | Roughly $0.027 per conversation. Doubling usage doubles this line. |
| Document processing mode | Batch mode halves the cost. Use it for everything that is not user-facing. |
| Prompt caching | Caching the assistant's fixed instructions and tool definitions cuts its input cost by up to 90 percent on repeated turns. Not included in the estimate above. |
| Removing the VPC | Running the functions outside the VPC with a publicly reachable database would remove the $8 endpoint charge. Not recommended once the platform holds project data. |

---

## 7. Summary

At the assumed usage the platform costs about **$77 per month** to run, or about **$63 per month** during the first year on a new AWS account. Loading the existing 4 TB image collection and 50,000 pages of documents is a one-time cost of about **$450**. The largest recurring line is the assistant, and the largest fixed line is image storage. Both scale gradually rather than in steps.
