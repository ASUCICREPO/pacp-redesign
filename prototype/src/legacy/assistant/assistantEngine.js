import { localize } from '../data/localize.js';
import { dataAnswer, siteAnswer } from './assistantData.js';

export function assistantEngine(i, n, o) {
  const s = i.toLowerCase();
  if (s.includes("petro-fabric") || s.includes("petrofabric")) return {
    role: "assistant",
    text: localize(n, "A petro-fabric (or petrographic fabric) describes the mineralogical and textural composition of a ceramic paste as seen under thin-section microscopy — the clay matrix, temper type, and firing indicators. A ware, by contrast, is a broader typological grouping based on shared paste, surface treatment, and manufacturing tradition. Think of a petro-fabric as the recipe, and the ware as the family of dishes made from it.", "Un petro-fabric describe la composición mineralógica y textural de la pasta cerámica vista bajo microscopía. Un ware es una agrupación tipológica más amplia. El petro-fabric es la receta; el ware es la familia de piezas."),
    payload: {
      kind: "button",
      button: {
        label: localize(n, "Learn more in Info →", "Aprender más en Info →"),
        href: "/resources"
      }
    }
  };
  if ((s.includes("difference") || s.includes("explain")) && (s.includes("ware") || s.includes("type"))) return {
    role: "assistant",
    text: localize(n, "These three are nested concepts in PACP. A ware is the broadest grouping — shared paste and surface treatment (e.g., Buff Ware). A type sits inside a ware and adds decorative or morphological criteria (e.g., Coyotes Buff). A petro-fabric goes deeper — it's the microscopic fabric description, independent of surface appearance.", "Son conceptos anidados. El ware es la agrupación más amplia. El tipo añade criterios decorativos. El petro-fabric es la descripción microscópica de la pasta."),
    payload: {
      kind: "button",
      button: {
        label: localize(n, "Learn more in Info →", "Aprender más en Info →"),
        href: "/resources"
      }
    }
  };
  if (s.includes("explain a concept") || s.includes("explain") && !s.includes("ware") && !s.includes("type")) return {
    role: "assistant",
    text: localize(n, "Happy to explain any PACP concept. What would you like to understand better — ware, type, petro-fabric, assemblage, or something else?", "Con gusto explico cualquier concepto de PACP. ¿Qué te gustaría entender mejor — ware, tipo, petro-fabric, ensamblaje, u otro?")
  };
  if (s.includes("compare") || s.includes("panama plain") && s.includes("cubita")) return {
    role: "assistant",
    text: localize(n, "Both Panama Plain and Cubita Polychrome are Coclé-region ceramic types from Panama, dating to roughly 700–900 CE — but they sit in quite different places in the typology. Panama Plain is a utilitarian buff-ware type with minimal decoration, while Cubita Polychrome is a prestige ware with characteristic painted motifs. Want me to open a side-by-side comparison?", "Ambos son tipos de la región Coclé, Panamá, del 700–900 d.C. Panama Plain es utilitario; Cubita Polychrome es un ware de prestigio con motivos pintados."),
    payload: {
      kind: "button",
      button: {
        label: localize(n, "Open in Compare Assemblages →", "Abrir en Comparar ensamblajes →"),
        href: "/compare"
      }
    }
  };
  if (s.includes("compare records") || s.includes("find similarities")) return {
    role: "assistant",
    text: localize(n, "Sure — which records do you want to compare? You can name two ceramic types, wares, or vessel IDs and I'll open them side-by-side.", "¿Qué registros quieres comparar? Nombra dos tipos cerámicos, wares o IDs de vasijas y los abriré lado a lado."),
    payload: {
      kind: "button",
      button: {
        label: localize(n, "Open Compare Assemblages →", "Abrir Comparar ensamblajes →"),
        href: "/compare"
      }
    }
  };
  if (s.includes("submit") || s.includes("add a vessel") || s.includes("submit data") || s.includes("submitting a vessel") || s.includes("start a vessel")) {
    const c = s.includes("la quemada") ? "La Quemada" : null,
      u = c ? ` from ${c}` : "";
    return {
      role: "assistant",
      text: localize(n, `Sure — what's the vessel registration number${u}? You can fill the rest in later.`, `Claro — ¿cuál es el número de registro de la vasija${u}? El resto puedes llenarlo después.`),
      payload: {
        kind: "quick-input",
        fieldLabel: localize(n, "Registration number", "Número de registro"),
        placeholder: localize(n, "e.g. V-115", "p. ej. V-115"),
        onSubmit: h => {
          const f = c ?? localize(n, "the site", "el sitio");
          o({
            role: "assistant",
            text: localize(n, `Got it — I've started a draft for ${f} ${h}. Continue in the full form when you're ready.`, `Entendido — empecé un borrador para ${f} ${h}. Continúa en el formulario cuando estés listo.`),
            payload: {
              kind: "button",
              button: {
                label: localize(n, "Continue in full form →", "Continuar en formulario →"),
                href: "/submit/vessel"
              }
            }
          });
        }
      }
    };
  }
  return s.includes("identify") || s.includes("identify a sherd") || s.includes("i have a photo") || s.includes("photo or description") || s.includes("sherd") || s.includes("guided identification") ? {
    role: "assistant",
    text: localize(n, "Guided Identification walks you through a structured reasoning process — describing the sherd, comparing it to PACP records, refining matches, and documenting your reasoning. It's designed to help you narrow possibilities defensibly rather than jump to a label. Want me to open it?", "La Identificación Guiada te guía en un proceso de razonamiento estructurado para reducir posibilidades de forma defendible."),
    payload: {
      kind: "button",
      button: {
        label: localize(n, "Start Guided Identification →", "Iniciar Identificación Guiada →"),
        href: "/identify"
      }
    }
  } : s.includes("sites") || s.includes("which site") || s.includes("show me sites") ? siteAnswer(n, o) : s.includes("la quemada") ? {
    role: "assistant",
    text: localize(n, "La Quemada is a major Epiclassic site in Zacatecas, Mexico. PACP has several vessels and sherds from the ceremonial precinct deposit. Want to browse records from there?", "La Quemada es un importante sitio Epiclásico en Zacatecas, México. PACP tiene varias vasijas del depósito del precinto ceremonial."),
    payload: {
      kind: "button",
      button: {
        label: localize(n, "Browse La Quemada records →", "Explorar registros de La Quemada →"),
        href: "/browse"
      }
    }
  } : s.includes("[image]") || s.includes("photo") || s.includes("picture") || s.includes("uploaded") ? {
    role: "assistant",
    text: localize(n, "That looks like a red-slipped bowl rim — possibly Panama Plain or Cubita Polychrome based on the profile. These are suggestions, not classifications — you decide. Want me to walk you through Guided Identification?", "Parece un borde de cuenco con engobe rojo — posiblemente Panama Plain o Cubita Polychrome. Son sugerencias, no clasificaciones. ¿Quieres que te guíe en la Identificación Guiada?"),
    payload: {
      kind: "button",
      button: {
        label: localize(n, "Start Guided Identification →", "Iniciar Identificación Guiada →"),
        href: "/identify"
      }
    }
  } : s.includes("panama plain") || s.includes("cubita polychrome") || s.includes("tonosi") ? {
    role: "assistant",
    text: localize(n, "Here are the closest matches I found in PACP records. These are possibilities — compare the attributes carefully before drawing conclusions.", "Aquí están las coincidencias más cercanas en PACP. Son posibilidades — compara los atributos cuidadosamente."),
    payload: {
      kind: "results",
      title: localize(n, "3 possibilities found", "3 posibilidades encontradas"),
      results: [{
        name: "Panama Plain",
        ware: "Buff Ware",
        match: "Closest — 4 of 5 attributes align",
        color: "bg-amber-100"
      }, {
        name: "Cubita Polychrome",
        ware: "Polychrome Tradition",
        match: "Possible — 3 of 5 align",
        color: "bg-orange-100"
      }, {
        name: "Tonosi Trichrome",
        ware: "Trichrome Group",
        match: "Partial — 2 of 5 align",
        color: "bg-yellow-100"
      }],
      button: {
        label: localize(n, "Start Guided Identification →", "Iniciar Identificación Guiada →"),
        href: "/identify"
      }
    }
  } : dataAnswer(i, n, o) ?? {
    role: "assistant",
    text: localize(n, "I can help with that — though I might need a bit more context. Are you trying to identify a sherd, find records for a site, compare ceramic types, or something else?", "Puedo ayudar — aunque necesito un poco más de contexto. ¿Intentas identificar un fragmento, encontrar registros de un sitio, comparar tipos cerámicos, u otra cosa?")
  };
}

export default assistantEngine;
