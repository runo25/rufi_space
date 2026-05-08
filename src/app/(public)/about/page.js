export const metadata = {
  title: 'About | Rufi Space',
  description: 'Learn more about Rufi Space.',
};

export default function AboutPage() {
  return (
    <main className="max-w-container-max mx-auto px-margin py-section-gap">
      <div className="max-w-3xl">
        <h1 className="font-headline-lg text-headline-lg text-primary uppercase hairline-b pb-8 mb-8">
          ABOUT RUFI SPACE
        </h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant mb-6">
          Architecture over shelter. Curation over volume. Brutalist precision in real estate acquisition.
        </p>
        <p className="font-body-lg text-body-lg text-on-surface-variant mb-6">
          Rufi Space is a premium digital concierge and property listing platform connecting discerning clients with verified luxury estates and minimalist residences.
        </p>
      </div>
    </main>
  );
}