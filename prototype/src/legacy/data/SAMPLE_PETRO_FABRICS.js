/**
 * Thin-section fixtures for the search page.
 *
 * Moved out of SearchPage so the search model can read them without the two
 * modules importing each other. SearchPage still re-exports both names.
 */
export const thinSectionImage = "/assets/Umbro_BA_Ctx_15_1432-1_Core_thick_cut_20x.6b1338e5.png";

export const SAMPLE_PETRO_FABRICS = [{
  id: "petro-001",
  sampleCode: "Umbro_BA_Ctx_15_1432-1",
  region: "Umbria, Italy",
  period: "Bronze Age",
  context: "Ctx 15, sample 1432-1",
  view: "Core, thick cut",
  magnification: "20x",
  image: thinSectionImage,
  matrixColor: "reddish-brown",
  temperType: ["quartz", "feldspar", "lithic fragments"],
  fabricTexture: "coarse",
  inclusionDensity: "moderate to high",
  voids: !0,
  associatedVessel: "Umbro V-245",
  associatedFabric: "Umbrian Bronze Age Coarse Fabric",
  associatedSite: "Umbrian Bronze Age Settlement",
  contributor: "Dr. Maria Rossi"
}, {
  id: "petro-002",
  sampleCode: "LQ_EC_2024-P-003",
  region: "Zacatecas, Mexico",
  period: "Epiclassic (600-900 CE)",
  context: "Platform 2, Level 3",
  view: "Rim section",
  magnification: "40x",
  image: thinSectionImage,
  matrixColor: "dark brown",
  temperType: ["volcanic basalt", "rhyolite"],
  fabricTexture: "medium-coarse",
  inclusionDensity: "high",
  voids: !1,
  associatedVessel: "La Quemada V-112",
  associatedFabric: "Volcanic Tempered Fabric",
  associatedSite: "La Quemada",
  contributor: "Dr. Sarah Chen"
}, {
  id: "petro-003",
  sampleCode: "SW_PB_1998-T-042",
  region: "Arizona, USA",
  period: "Pueblo II (900-1150 CE)",
  context: "Room 5, floor assemblage",
  view: "Body sherd cross-section",
  magnification: "20x",
  image: thinSectionImage,
  matrixColor: "light brown",
  temperType: ["quartz sand", "crushed sherd"],
  fabricTexture: "fine to medium",
  inclusionDensity: "moderate",
  voids: !0,
  associatedVessel: "SW Pueblo Bowl PB-042",
  associatedFabric: "Sand-tempered Fine Ware",
  associatedSite: "Pueblo Bonito",
  contributor: "Dr. James Martinez"
}];
