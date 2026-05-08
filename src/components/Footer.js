export default function Footer() {
  return (
    <footer className="bg-primary text-on-primary border-t-2 border-neutral-800 w-full px-12 py-24 mt-auto">
      <div className="max-w-container-max mx-auto grid grid-cols-12 gap-8">
        <div className="col-span-12 md:col-span-6">
          <div className="text-5xl font-black text-on-primary mb-8 font-display-xl uppercase tracking-tighter">
            RUFI SPACE
          </div>
          <p className="font-label-caps text-label-caps text-on-primary/60 max-w-sm mb-12">
            Architecture over shelter. Curation over volume. Brutalist precision in real estate acquisition.
          </p>
          <div className="font-label-caps text-label-caps text-on-primary/40">
            © 2024 RUFI SPACE. ALL RIGHTS RESERVED.
          </div>
        </div>
        <div className="col-span-12 md:col-span-6 flex flex-col md:items-end justify-between">
          <div className="flex flex-col gap-4 text-left md:text-right font-label-caps text-label-caps tracking-widest uppercase">
            <a className="text-on-primary/60 hover:text-on-primary hover:translate-x-1 md:hover:-translate-x-1 transition-all" href="#">
              PRIVACY POLICY
            </a>
            <a className="text-on-primary/60 hover:text-on-primary hover:translate-x-1 md:hover:-translate-x-1 transition-all" href="#">
              TERMS OF SERVICE
            </a>
            <a className="text-on-primary/60 hover:text-on-primary hover:translate-x-1 md:hover:-translate-x-1 transition-all" href="#">
              ACCESSIBILITY
            </a>
            <a className="text-on-primary/60 hover:text-on-primary hover:translate-x-1 md:hover:-translate-x-1 transition-all" href="#">
              CONTACT
            </a>
            <a className="text-on-primary/60 hover:text-on-primary hover:translate-x-1 md:hover:-translate-x-1 transition-all mt-4 text-tertiary-fixed" href="/merchant/login">
              MERCHANT PORTAL
            </a>
            <a className="text-on-primary/60 hover:text-on-primary hover:translate-x-1 md:hover:-translate-x-1 transition-all text-tertiary-fixed" href="/agent/login">
              AGENT PORTAL
            </a>
          </div>
          <div className="mt-12 w-full md:w-auto">
            <p className="font-label-caps text-label-caps text-on-primary/60 mb-4 md:text-right">
              JOIN THE REGISTRY
            </p>
            <div className="flex hairline-all border-on-primary/20">
              <input
                className="bg-transparent border-none text-on-primary font-label-caps text-label-caps p-4 focus:ring-0 placeholder-on-primary/30 w-full md:w-64"
                placeholder="EMAIL ADDRESS"
                type="email"
              />
              <button className="bg-tertiary-fixed text-primary px-6 font-label-caps text-label-caps hover:bg-tertiary-fixed-dim transition-colors">
                SUBMIT
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}