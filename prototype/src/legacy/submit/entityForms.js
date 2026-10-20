/**
 * Field definitions for the entity submission pages.
 *
 * The Submit page offered ten entry types but only "Submit a Vessel" led
 * anywhere — the other nine 404'd. Fields follow the categories the live site
 * records (panamericanceramics.org) and the project's Functional Requirements
 * §6.a/§6.b; placeholders use real PACP examples.
 *
 * Every field is optional except where marked, per FR-7.2: submissions can be
 * partial, and a record with gaps is still worth having.
 */

import {
  CONTRIBUTOR_OPTIONS,
  KILN_WORKSHOP_OPTIONS,
  PERIOD_OPTIONS,
  PETRO_FABRIC_OPTIONS,
  SITE_COUNTRIES,
  SITE_NAMES,
  TYPE_OPTIONS,
  WARE_OPTIONS,
} from './VesselSubmissionForm.jsx';

const COUNTRY_OPTIONS = [...new Set(Object.values(SITE_COUNTRIES))];

/** Sections shared by most entity types. */
const bibliographySection = (what) => ({
  id: 'bibliography',
  label: 'Bibliography & Credit',
  fields: [
    {
      key: 'bibliography',
      label: 'Bibliography',
      type: 'textarea',
      placeholder: 'One reference per line, or search the Master Bibliography after saving a draft',
      helper: `Published sources that define or discuss this ${what}.`,
    },
    {
      key: 'contributors',
      label: 'Contributors',
      type: 'multiselect',
      options: CONTRIBUTOR_OPTIONS,
      // The list of known contributors is never complete; let people add one.
      allowAdd: 'Contributor',
      addLabel: 'Add a person not listed',
      helper:
        'People credited with creating or collecting these data. If someone is missing, add them — attribution is how contributions stay citable.',
    },
    {
      key: 'acknowledgements',
      label: 'Discussion & acknowledgements',
      type: 'richtext',
      helper: 'Open questions, disagreements, and people or institutions to thank.',
    },
  ],
});

const privacySection = {
  id: 'privacy',
  label: 'Privacy',
  fields: [{ key: 'privacy', label: 'Who can see this entry', type: 'privacy' }],
};

export const ENTITY_FORMS = {
  ware: {
    slug: 'ware',
    title: 'Submit a Ware or Ware Family',
    description:
      'A ware groups pottery that shares paste, technology and surface treatment. 108 wares are currently on the PACP.',
    sections: [
      {
        id: 'identity',
        label: 'Name, Origin & Date',
        fields: [
          { key: 'name', label: 'Ware name', type: 'text', placeholder: 'e.g., Resist', required: true },
          {
            key: 'alt_names',
            label: 'Earlier or alternative names',
            type: 'text',
            placeholder: 'Other names this ware has been published under',
          },
          { key: 'family', label: 'Ware family', type: 'text', placeholder: 'e.g., Fine wares' },
          { key: 'country', label: 'Country / region', type: 'select', options: COUNTRY_OPTIONS },
          { key: 'subregion', label: 'Subregion', type: 'text', placeholder: 'e.g., Malpaso Valley' },
          { key: 'period', label: 'Period', type: 'select', options: PERIOD_OPTIONS },
          { key: 'date_bce_ce', label: 'Date BCE/CE', type: 'text', placeholder: 'e.g., 600–900 CE' },
        ],
      },
      {
        id: 'description',
        label: 'Description',
        fields: [
          {
            key: 'general_information',
            label: 'General information',
            type: 'richtext',
            helper: 'How the ware is defined, and by whom.',
          },
          {
            key: 'description',
            label: 'Description',
            type: 'richtext',
            helper: 'Paste, temper, surface treatment, firing and decoration as your sources describe them.',
          },
        ],
      },
      {
        id: 'associations',
        label: 'Associations',
        fields: [
          { key: 'types', label: 'Associated types', type: 'multiselect', options: TYPE_OPTIONS },
          { key: 'petrofabrics', label: 'Associated petro-fabrics', type: 'multiselect', options: PETRO_FABRIC_OPTIONS },
          { key: 'kilns', label: 'Associated kilns / workshops', type: 'multiselect', options: KILN_WORKSHOP_OPTIONS },
          { key: 'sites', label: 'Site distribution', type: 'multiselect', options: SITE_NAMES },
        ],
      },
      bibliographySection('ware'),
      privacySection,
    ],
  },

  type: {
    slug: 'type',
    title: 'Submit a Ceramic Type',
    description:
      'A type is a named grouping within a ware, usually defined by decoration and form. 451 types are currently on the PACP.',
    sections: [
      {
        id: 'identity',
        label: 'Name, Origin & Date',
        fields: [
          {
            key: 'name',
            label: 'Type name',
            type: 'text',
            placeholder: 'e.g., Tepozan Resist Polychrome',
            required: true,
          },
          { key: 'alt_names', label: 'Earlier or alternative names', type: 'text' },
          { key: 'ware', label: 'Ware', type: 'select', options: WARE_OPTIONS, helper: 'The ware this type belongs to.' },
          { key: 'country', label: 'Country / region', type: 'select', options: COUNTRY_OPTIONS },
          { key: 'period', label: 'Period', type: 'select', options: PERIOD_OPTIONS },
          { key: 'date_bce_ce', label: 'Date BCE/CE', type: 'text', placeholder: 'e.g., 700–900 CE' },
        ],
      },
      {
        id: 'definition',
        label: 'Definition',
        fields: [
          { key: 'general_information', label: 'General information', type: 'richtext' },
          {
            key: 'type_definition',
            label: 'Type definition',
            type: 'richtext',
            helper:
              'Definitions differ between scholars. Give the one you are following and cite it; competing definitions can be added as separate entries.',
          },
        ],
      },
      {
        id: 'attributes',
        label: 'Detail Attributes',
        fields: [
          { key: 'shape', label: 'Shape', type: 'text', placeholder: 'e.g., Bowl' },
          { key: 'shape_type', label: 'Shape type', type: 'text', placeholder: 'e.g., Hemispherical' },
          { key: 'shape_family', label: 'Shape family', type: 'text', placeholder: 'e.g., Open forms' },
          { key: 'functional_category', label: 'Functional category', type: 'text', placeholder: 'e.g., Serving' },
          { key: 'fabric_description', label: 'Fabric description', type: 'textarea' },
          { key: 'technological_description', label: 'Technological description', type: 'textarea' },
          { key: 'firing', label: 'Firing', type: 'text', placeholder: 'e.g., Oxidising, 750–850 °C' },
        ],
      },
      {
        id: 'associations',
        label: 'Associations',
        fields: [
          { key: 'petrofabrics', label: 'Associated petro-fabrics', type: 'multiselect', options: PETRO_FABRIC_OPTIONS },
          { key: 'kilns', label: 'Associated kilns / workshops', type: 'multiselect', options: KILN_WORKSHOP_OPTIONS },
          { key: 'sites', label: 'Site distribution', type: 'multiselect', options: SITE_NAMES },
        ],
      },
      bibliographySection('type'),
      privacySection,
    ],
  },

  'petro-fabric': {
    slug: 'petro-fabric',
    title: 'Submit Petro-fabric Data',
    description:
      'A petro-fabric groups pottery by the mineralogy and texture of its paste. 4 petro-fabrics are currently on the PACP.',
    sections: [
      {
        id: 'identity',
        label: 'Name, Origin & Material',
        fields: [
          {
            key: 'name',
            label: 'Petro-fabric name',
            type: 'text',
            placeholder: 'e.g., Altered sand in fine-grained (AS-F) matrix',
            required: true,
          },
          { key: 'raw_material', label: 'Raw material', type: 'text', placeholder: 'e.g., Alluvial clay with added river sand' },
          { key: 'country', label: 'Country / region', type: 'select', options: COUNTRY_OPTIONS },
          { key: 'subregion', label: 'Subregion', type: 'text' },
          {
            key: 'geological_formation',
            label: 'Geological formation',
            type: 'text',
            placeholder: 'e.g., Weathered rhyolitic tuff, Malpaso Valley',
          },
        ],
      },
      {
        id: 'description',
        label: 'Description',
        fields: [
          { key: 'general_information', label: 'General information', type: 'richtext' },
          {
            key: 'description',
            label: 'Petrographic description',
            type: 'richtext',
            helper:
              'Inclusion kind, amount, sorting, size and shape; matrix colour and optical activity; voids and textural concentration features.',
          },
        ],
      },
      {
        id: 'associations',
        label: 'Associations',
        fields: [
          { key: 'wares', label: 'Associated wares', type: 'multiselect', options: WARE_OPTIONS },
          { key: 'types', label: 'Associated types', type: 'multiselect', options: TYPE_OPTIONS },
          { key: 'kilns', label: 'Associated kilns / workshops', type: 'multiselect', options: KILN_WORKSHOP_OPTIONS },
          { key: 'sites', label: 'Site distribution', type: 'multiselect', options: SITE_NAMES },
        ],
      },
      bibliographySection('petro-fabric'),
      privacySection,
    ],
  },

  site: {
    slug: 'site',
    title: 'Submit a Site',
    description:
      'An archaeological site with its location, chronology and geology. 6 sites are currently on the PACP.',
    sections: [
      {
        id: 'identity',
        label: 'Site Information',
        fields: [
          { key: 'name', label: 'Site name, primary', type: 'text', placeholder: 'e.g., La Quemada', required: true },
          {
            key: 'alt_names',
            label: 'Alternate names & spellings',
            type: 'text',
            placeholder: 'e.g., Chicomóztoc',
          },
          { key: 'country', label: 'Country / region', type: 'select', options: COUNTRY_OPTIONS },
          { key: 'subregion', label: 'Subregion', type: 'text', placeholder: 'e.g., Zacatecas' },
          { key: 'site_type', label: 'Site type', type: 'text', placeholder: 'e.g., Fortified civic-ceremonial centre' },
          { key: 'period', label: 'Period', type: 'select', options: PERIOD_OPTIONS },
          { key: 'date_bce_ce', label: 'Date BCE/CE', type: 'text', placeholder: 'e.g., 600–900 CE' },
          {
            key: 'location',
            label: 'Site location description',
            type: 'textarea',
            helper: 'Describe the location as precisely as is appropriate to share. Omit coordinates for sensitive sites.',
          },
          { key: 'urls', label: 'Site / project URLs', type: 'text', placeholder: 'https://' },
        ],
      },
      {
        id: 'geology',
        label: 'Local Geology',
        fields: [
          {
            key: 'local_geology',
            label: 'Local geology',
            type: 'richtext',
            helper: 'Parent material and clay or temper sources available near the site.',
          },
        ],
      },
      {
        id: 'assemblages',
        label: 'Site Assemblages',
        fields: [
          {
            key: 'assemblages',
            label: 'Type frequencies by context',
            type: 'textarea',
            placeholder: 'Type name · site context · count · reference (one per line)',
            helper: 'FR-7.10: assemblages are recorded as type frequencies from excavation contexts within the site.',
          },
        ],
      },
      bibliographySection('site'),
      privacySection,
    ],
  },

  kiln: {
    slug: 'kiln',
    title: 'Submit a Kiln',
    description: 'A firing installation and what was made in it. No kilns are on the PACP yet.',
    sections: [
      {
        id: 'identity',
        label: 'Kiln Information',
        fields: [
          { key: 'name', label: 'Kiln name', type: 'text', placeholder: 'e.g., La Quemada Kiln 1', required: true },
          { key: 'site', label: 'Site', type: 'select', options: SITE_NAMES },
          { key: 'country', label: 'Country / region', type: 'select', options: COUNTRY_OPTIONS },
          { key: 'shapes_made', label: 'Shapes made', type: 'text', placeholder: 'e.g., Ollas, bowls' },
          { key: 'period', label: 'Period', type: 'select', options: PERIOD_OPTIONS },
          { key: 'date_bce_ce', label: 'Date BCE/CE', type: 'text' },
          { key: 'description', label: 'Description', type: 'richtext', helper: 'Structure, firing evidence and excavation context.' },
        ],
      },
      {
        id: 'associations',
        label: 'Associations',
        fields: [
          { key: 'wares', label: 'Associated wares', type: 'multiselect', options: WARE_OPTIONS },
          { key: 'types', label: 'Associated types', type: 'multiselect', options: TYPE_OPTIONS },
          { key: 'petrofabrics', label: 'Associated petro-fabrics', type: 'multiselect', options: PETRO_FABRIC_OPTIONS },
        ],
      },
      bibliographySection('kiln'),
      privacySection,
    ],
  },

  workshop: {
    slug: 'workshop',
    title: 'Submit a Workshop',
    description: 'A production locus and what was made there. No workshops are on the PACP yet.',
    sections: [
      {
        id: 'identity',
        label: 'Workshop Information',
        fields: [
          {
            key: 'name',
            label: 'Workshop name',
            type: 'text',
            placeholder: 'e.g., Teotihuacan Workshop Complex',
            required: true,
          },
          { key: 'site', label: 'Site', type: 'select', options: SITE_NAMES },
          { key: 'country', label: 'Country / region', type: 'select', options: COUNTRY_OPTIONS },
          { key: 'shapes_made', label: 'Shapes made', type: 'text' },
          { key: 'period', label: 'Period', type: 'select', options: PERIOD_OPTIONS },
          { key: 'date_bce_ce', label: 'Date BCE/CE', type: 'text' },
          { key: 'description', label: 'Description', type: 'richtext' },
        ],
      },
      {
        id: 'associations',
        label: 'Associations',
        fields: [
          { key: 'wares', label: 'Associated wares', type: 'multiselect', options: WARE_OPTIONS },
          { key: 'types', label: 'Associated types', type: 'multiselect', options: TYPE_OPTIONS },
          { key: 'petrofabrics', label: 'Associated petro-fabrics', type: 'multiselect', options: PETRO_FABRIC_OPTIONS },
        ],
      },
      bibliographySection('workshop'),
      privacySection,
    ],
  },

  sample: {
    slug: 'sample',
    title: 'Submit a Petrographic Sample',
    description:
      'A thin section taken from a vessel already on the PACP. 9 petrographic samples are currently on the PACP.',
    sections: [
      {
        id: 'identity',
        label: 'Sample & Vessel',
        fields: [
          {
            key: 'sample_no',
            label: 'Petrographic sample number',
            type: 'text',
            placeholder: 'e.g., PP-206',
            required: true,
          },
          {
            key: 'vessel_registration',
            label: 'Vessel registration number',
            type: 'text',
            placeholder: 'e.g., La Quemada V-112',
            required: true,
            helper: 'FR-7.7: a sample must be linked to an existing vessel by its unique identifier.',
          },
          { key: 'site', label: 'Site name', type: 'select', options: SITE_NAMES },
          { key: 'country', label: 'Country / region', type: 'select', options: COUNTRY_OPTIONS },
          { key: 'period', label: 'Period', type: 'select', options: PERIOD_OPTIONS },
          { key: 'date_bce_ce', label: 'Date BCE/CE', type: 'text' },
        ],
      },
      {
        id: 'analysis',
        label: 'Analysis',
        fields: [
          { key: 'raw_material', label: 'Raw material', type: 'text' },
          { key: 'geological_formation', label: 'Geological formation', type: 'text' },
          { key: 'clay_provenance', label: 'Suggested clay provenance', type: 'text' },
          {
            key: 'inclusions',
            label: 'Inclusions',
            type: 'textarea',
            helper: 'Kind, amount, sorting, size and shape — the attributes that let fabrics be compared.',
          },
          { key: 'local_group', label: 'Local petrographic group', type: 'text' },
          { key: 'description', label: 'Description', type: 'richtext' },
          { key: 'petrofabric', label: 'Petro-fabric', type: 'select', options: PETRO_FABRIC_OPTIONS },
        ],
      },
      {
        id: 'images',
        label: 'Images',
        fields: [
          {
            key: 'thin_section_photos',
            label: 'Thin section photographs',
            type: 'files',
            helper: 'Accepted formats: .jpg, .tiff, .gif, .png. Note magnification and polarisation in the caption.',
          },
          { key: 'break_photos', label: 'Break photographs', type: 'files' },
        ],
      },
      bibliographySection('sample'),
      privacySection,
    ],
  },

  bibliography: {
    slug: 'bibliography',
    title: 'Submit Bibliography',
    description:
      'A published source that other entries can cite. 447 references are currently in the Master Bibliography.',
    sections: [
      {
        id: 'reference',
        label: 'Reference',
        fields: [
          {
            key: 'reference_type',
            label: 'Reference type',
            type: 'select',
            options: ['Book', 'Journal article', 'Chapter', 'Report', 'Thesis', 'Conference paper', 'Manuscript', 'Web page'],
            required: true,
          },
          {
            key: 'title',
            label: 'Title',
            type: 'text',
            placeholder: 'e.g., Pottery Analysis: A Sourcebook',
            required: true,
          },
          { key: 'authors', label: 'Authors', type: 'text', placeholder: 'Surname, First; Surname, First' },
          { key: 'year', label: 'Year', type: 'text', placeholder: 'e.g., 1987' },
          { key: 'publisher', label: 'Publisher', type: 'text', placeholder: 'e.g., University of Chicago Press' },
          { key: 'place_published', label: 'Place published', type: 'text', placeholder: 'e.g., Chicago' },
          { key: 'series_title', label: 'Series title', type: 'text' },
          { key: 'volume', label: 'Volume', type: 'text' },
          { key: 'translator', label: 'Translator', type: 'text' },
          { key: 'external_link', label: 'External link or DOI', type: 'text', placeholder: 'https:// or doi:' },
          { key: 'notes', label: 'Notes', type: 'textarea' },
        ],
      },
      {
        id: 'locator',
        label: 'Where in the Source',
        fields: [
          { key: 'pages', label: 'Pages', type: 'text', placeholder: 'e.g., 199–256' },
          { key: 'figure', label: 'Figure', type: 'text' },
          { key: 'plate', label: 'Plate', type: 'text' },
          {
            key: 'locator_note',
            label: 'Note',
            type: 'textarea',
            helper: 'Used when this reference is attached to a specific entry.',
          },
        ],
      },
      privacySection,
    ],
  },

  contributor: {
    slug: 'contributor',
    title: 'Submit a Contributor Profile',
    description:
      'A profile so data can be attributed and cited correctly. 31 contributors are currently on the PACP.',
    sections: [
      {
        id: 'person',
        label: 'Contributor',
        fields: [
          { key: 'first_name', label: 'First name', type: 'text', required: true },
          { key: 'last_name', label: 'Last name', type: 'text', required: true },
          { key: 'title', label: 'Title', type: 'text', placeholder: 'e.g., Dr., Prof.' },
          {
            key: 'affiliation',
            label: 'Affiliation',
            type: 'text',
            placeholder: 'e.g., School of Human Evolution and Social Change, Arizona State University',
          },
          { key: 'email', label: 'Email', type: 'text', placeholder: 'name@institution.edu' },
          { key: 'website', label: 'Website', type: 'text', placeholder: 'https://' },
          {
            key: 'orcid',
            label: 'ORCID',
            type: 'text',
            placeholder: 'https://orcid.org/0000-0000-0000-0000',
            helper: 'Links PACP contributions to a public research record.',
          },
        ],
      },
      {
        id: 'profile',
        label: 'Profile',
        fields: [
          { key: 'avatar', label: 'Profile image', type: 'files' },
          { key: 'expertise', label: 'Research interests', type: 'text', placeholder: 'Comma separated' },
          { key: 'bio', label: 'Personal information', type: 'richtext' },
        ],
      },
      privacySection,
    ],
  },
};

export const ENTITY_SLUGS = Object.keys(ENTITY_FORMS);
