/**
 * Land Acknowledgement.
 *
 * Both statements are reproduced verbatim from
 * panamericanceramics.org/land_acknowledgement. This is the project's own
 * acknowledgement of specific named peoples — not text to paraphrase, and the
 * Spanish version is part of it, not a translation convenience.
 */
export function LandAcknowledgementPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="font-serif text-foreground mb-6">Land Acknowledgement</h1>

        <div className="bg-card border border-border rounded-lg p-6 space-y-4">
          <p className="text-foreground">
            We acknowledge that ASU sits on the ancestral homelands of those American Indian tribes that have
            inhabited this land for centuries, including the Akimel O&rsquo;odham (Pima) and Pee Posh (Maricopa)
            peoples. We also acknowledge and pay respect to Indigenous elders &ndash; past, present, and future
            &ndash; who have stewarded this land throughout the generations.
          </p>
        </div>

        <div className="bg-card border border-border rounded-lg p-6 space-y-4 mt-6">
          <h2 className="font-serif text-foreground">Reconocimiento de tierras</h2>
          <p className="text-muted-foreground">
            Reconocemos que la Universidad Estatal de Arizona se encuentra en las tierras ancestrales de las tribus
            indígenas americanas que han habitado esta tierra durante siglos, incluidos los pueblos Akimel
            O&rsquo;odham (Pima) y Pee Posh (Maricopa). También reconocemos y rindo respeto a los ancianos indígenas,
            pasados, presentes y futuros, que han protegido y mantenido esta tierra a lo largo de las generaciones.
          </p>
        </div>

        <div className="bg-card border border-border rounded-lg p-6 mt-6">
          <h2 className="font-serif text-foreground mb-3">Data and Descendant Communities</h2>
          <p className="text-muted-foreground">
            The PACP works to the CARE principles &mdash; collective benefit, authority to control, responsibility and
            ethics &mdash; alongside FAIR. Contributors choose a privacy level for every record, culturally sensitive
            material can be withheld from public access, and submissions carry an affirmation that the data were
            collected and shared with the permissions required.
          </p>
        </div>
      </div>
    </div>
  );
}

export default LandAcknowledgementPage;
