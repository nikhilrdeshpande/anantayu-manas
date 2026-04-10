export function SocialProofBar() {
  return (
    <section className="bg-[#1c1b1b] py-12 border-y border-[#4f4634]/10">
      <div className="container mx-auto px-6 md:px-8 max-w-7xl">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div className="space-y-1">
            <div className="text-3xl font-bold text-[#f6be39] font-['Plus_Jakarta_Sans']">25</div>
            <div className="text-xs uppercase tracking-widest text-[#d3c5ae] font-medium">Questions</div>
          </div>
          <div className="space-y-1">
            <div className="text-3xl font-bold text-[#f6be39] font-['Plus_Jakarta_Sans']">7</div>
            <div className="text-xs uppercase tracking-widest text-[#d3c5ae] font-medium">Prakriti Types</div>
          </div>
          <div className="space-y-1">
            <div className="text-3xl font-bold text-[#f6be39] font-['Plus_Jakarta_Sans']">3,000+</div>
            <div className="text-xs uppercase tracking-widest text-[#d3c5ae] font-medium">Year-Old Science</div>
          </div>
          <div className="space-y-1">
            <div className="text-3xl font-bold text-[#f6be39] font-['Plus_Jakarta_Sans']">PhD-Backed</div>
            <div className="text-xs uppercase tracking-widest text-[#d3c5ae] font-medium">Validation</div>
          </div>
        </div>
      </div>
    </section>
  );
}
