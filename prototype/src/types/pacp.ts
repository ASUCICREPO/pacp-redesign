/**
 * PACP entity types.
 *
 * Modelled on `docs/PACP_ERD.pdf`. Two conventions carry the project's
 * philosophy into the type system itself:
 *
 * 1. Almost every descriptive field is nullable. A record with gaps is a valid
 *    record, not a broken one — see "Incremental Contribution" in the vision
 *    statement and Priority 6 of the Phase 1 build spec.
 * 2. Interpretation is never a single value. `alternate_interpretations` sits
 *    alongside the primary attribution rather than replacing it, so competing
 *    readings coexist instead of one overwriting the other.
 */

/* ── Stewardship ────────────────────────────────────────────────────────── */

/** The four visible states from Phase 1, Priority 3 (Stewardship Layer). */
export type StewardshipStatus =
  | 'draft'
  | 'needs_review'
  | 'community_reviewed'
  | 'stewarded';

/** How sure a contributor is — deliberately never "certain". */
export type ConfidenceLevel =
  | 'insufficient evidence'
  | 'tentative'
  | 'possible'
  | 'probable';

export type PrivacyLevel = 'public' | 'restricted' | 'private';

export type ContributorRole =
  | 'crm_archaeologist'
  | 'graduate_student'
  | 'undergraduate_student'
  | 'specialist';

/* ── Provenance ─────────────────────────────────────────────────────────── */

/** One entry in a record's revision history. Prior versions are never erased. */
export interface RecordVersion {
  version: number;
  updated_at: string;
  updated_by: string;
  change_summary: string;
  reviewer_comments: string | null;
}

/**
 * A competing attribution offered by someone other than the original recorder.
 * Held next to the primary attribution, never merged into it.
 */
export interface AlternateInterpretation {
  contributor_id: string;
  suggested_ware: string | null;
  suggested_type: string | null;
  reasoning: string;
  confidence: ConfidenceLevel;
  date_added: string;
}

export interface DiscussionReply {
  contributor_id: string;
  comment: string;
  date: string;
}

export interface DiscussionThread {
  contributor_id: string;
  comment: string;
  date: string;
  replies: DiscussionReply[];
}

/* ── Geography and chronology ───────────────────────────────────────────── */

export interface Region {
  region_id: string;
  country: string;
  name: string;
  subregion: string | null;
  description: string | null;
}

export interface Period {
  period_id: string;
  term: string;
  region_scope: string;
  /** Negative years are BCE. */
  date_range_start: number;
  date_range_end: number;
  description: string | null;
  periodo_id?: string | null;
}

export interface Site {
  site_id: string;
  name: string;
  alt_site_name: string[];
  country: string;
  region_id: string;
  site_type: string | null;
  period_id: string | null;
  date_bce_ce: string | null;
  site_location: { lat: number; lng: number } | null;
  local_geology: string | null;
  description: string | null;
  site_project_website: string | null;
  contributor_id: string | null;
  privacy_level: PrivacyLevel;
}

/* ── Ceramic classification ─────────────────────────────────────────────── */

export interface Ware {
  ware_id: string;
  name: string;
  alt_ware_name: string[];
  region_id: string | null;
  period_id: string | null;
  date_range_start: number;
  date_range_end: number;
  date_bce_ce: string;
  description: string | null;
  type_ids: string[];
  bibliography_ids: string[];
  contributor_id: string | null;
  privacy_level: PrivacyLevel;
  stewardship_status: StewardshipStatus;
}

export interface CeramicType {
  type_id: string;
  name: string;
  ware_id: string | null;
  region_id: string | null;
  period_id: string | null;
  date_range_start: number;
  date_range_end: number;
  date_bce_ce: string;
  description: string | null;
  alt_type_name: string[];
  /** Synthesised from every vessel assigned to the type, per the ERD. */
  morphology_text: string | null;
  technology_text: string | null;
  petrofabric_id: string | null;
  kiln_workshop_id: string | null;
  bibliography_ids: string[];
  contributor_id: string | null;
  discussion: DiscussionThread[];
  acknowledgements: string | null;
  privacy_level: PrivacyLevel;
  stewardship_status: StewardshipStatus;
}

/**
 * A petrographic fabric grouping. Field vocabulary follows
 * `docs/Helpful_definitions_for_Rachel_s_team.docx`.
 */
export interface PetroFabric {
  petro_fabric_id: string;
  name: string;
  region_id: string | null;
  geological_formation: string | null;
  raw_material: string | null;
  description: string | null;
  inclusion_kind: string | null;
  inclusion_amount: string | null;
  inclusion_sorting: string | null;
  inclusion_size: string | null;
  inclusion_shape: string | null;
  matrix_color_ppl: string | null;
  /** Active below ~850 °C, inactive above. */
  matrix_activity: 'Active' | 'Inactive' | null;
  contributor_id: string | null;
}

/* ── Vessel ─────────────────────────────────────────────────────────────── */

/** Measurements follow the forming section of the definitions document. */
export interface VesselMorphology {
  shape: string;
  shape_type: string | null;
  shape_family: string | null;
  functional_category: string | null;
  vessel_height_cm: number | null;
  max_diameter_cm: number | null;
  rim_diameter_cm: number | null;
  /** Below 10 %, a rim-diameter estimate should be treated as unreliable. */
  rim_percent_preserved: number | null;
  base_diameter_cm: number | null;
  base_percent_preserved: number | null;
  wall_thickness_mm: number | null;
  rim_thickness_mm: number | null;
  rim_direction: 'In' | 'Up' | 'Out' | null;
  rim_angle_deg: number | null;
  rim_shape: string | null;
  base_shape: string | null;
  parts_present: string[];
}

/** Raw material, forming, finishing and firing observations. */
export interface VesselTechnology {
  fabric_description_color: string | null;
  forming_method: string | null;
  primary_finish: string | null;
  secondary_finish: string | null;
  decorative_technique: string | null;
  firing_atmosphere: string | null;
  exterior_color: string | null;
  interior_color: string | null;
  core_color: string | null;
  multiple_cores: boolean | null;
  estimated_firing_temp: string | null;
  hardness: string | null;
  pitch: string | null;
  cooling: string | null;
  surface_core_boundary: string | null;
  inclusion_orientation: string | null;
  drying_cracks: string | null;
}

export interface VesselImage {
  vessel_image_id: string;
  image_type: string;
  media_url: string | null;
  caption: string | null;
  credit: string | null;
  created_at: string;
}

export interface Vessel {
  vessel_id: string;
  registration_number: string;
  name_or_label: string;
  site_id: string;
  assemblage_id: string | null;
  archaeological_context: string | null;
  region_id: string;
  country: string;
  period_id: string | null;
  date_bce_ce: string | null;
  date_range_start: number;
  date_range_end: number;
  ware_id: string | null;
  type_id: string | null;
  petro_fabric_id: string | null;
  kiln_workshop_id: string | null;
  morphology: VesselMorphology;
  technology: VesselTechnology;
  images: VesselImage[];
  bibliography_ids: string[];
  contributor_id: string;
  housing_location: string | null;
  external_data: string | null;
  acknowledgements: string | null;
  privacy_level: PrivacyLevel;
  doi_ark_id: string | null;
  stewardship_status: StewardshipStatus;
  /** Rough share of fields filled. Shown as progress, never as a gate. */
  completeness_percent: number;
  versions: RecordVersion[];
  alternate_interpretations: AlternateInterpretation[];
  discussion: DiscussionThread[];
  created_at: string;
  updated_at: string;
}

/* ── People, references, groupings ──────────────────────────────────────── */

export interface ContributionStats {
  vessels_contributed: number;
  reviews_given: number;
  discussion_posts: number;
  alternate_interpretations_offered: number;
}

export interface Contributor {
  contributor_id: string;
  first_name: string;
  last_name: string;
  title: string;
  affiliation: string;
  orcid: string | null;
  email: string | null;
  role: ContributorRole;
  expertise_tags: string[];
  bio: string | null;
  contribution_stats: ContributionStats;
  joined_at: string;
}

export interface BibliographyEntry {
  bibliography_id: string;
  reference_type: 'book' | 'article' | 'report' | 'thesis' | 'chapter';
  title: string;
  authors: string[];
  year: number;
  publisher: string | null;
  place_published: string | null;
  series_title: string | null;
  pages: string | null;
  citation_text: string;
  external_link: string | null;
  notes: string | null;
}

export interface Assemblage {
  assemblage_id: string;
  name: string;
  site_id: string;
  type_ids: string[];
  site_context: string | null;
  count: number;
  reference: string | null;
  contributor_id: string | null;
  notes: string | null;
}

/* ── Search and retrieval ───────────────────────────────────────────────── */

export type EntityType =
  | 'vessel'
  | 'site'
  | 'ware'
  | 'type'
  | 'petrofabric'
  | 'contributor'
  | 'assemblage'
  | 'bibliography';

export interface VesselFilters {
  query?: string;
  site_id?: string;
  ware_id?: string;
  type_id?: string;
  petro_fabric_id?: string;
  period_id?: string;
  region_id?: string;
  country?: string;
  shape?: string;
  functional_category?: string;
  stewardship_status?: StewardshipStatus | StewardshipStatus[];
  /** Records still missing a type attribution — a task-queue filter. */
  missing_type?: boolean;
  missing_petrofabric?: boolean;
  missing_images?: boolean;
  has_alternate_interpretations?: boolean;
}

export interface SearchResult<T = unknown> {
  entity_type: EntityType;
  id: string;
  title: string;
  subtitle: string | null;
  /** Why this result came back — shown to the user, never hidden. */
  matched_fields: string[];
  score: number;
  record: T;
}

export type StewardshipCounts = Record<StewardshipStatus, number>;
