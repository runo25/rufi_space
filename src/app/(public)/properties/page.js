import { fetchProperties } from "@/lib/api";
import PropertyCard from "@/components/PropertyCard";
import { Input } from "@/components/ui/Input";

export default async function PropertiesPage({ searchParams }) {
  // Await the searchParams as required in newer Next.js versions if needed
  const params = await searchParams;
  const properties = await fetchProperties({ ...params, all: true });

  // Filter properties manually if API doesn't support complex queries, 
  // or pass down queries. The API supports agent, verified, city.
  // We'll just display them.

  return (
    <main className="max-w-container-max mx-auto px-margin py-section-gap">
      <div className="flex flex-col md:flex-row gap-12">
        {/* Sidebar Filters */}
        <aside className="w-full md:w-1/4 flex flex-col gap-8">
          <h2 className="font-headline-md text-headline-md text-primary uppercase hairline-b pb-4">
            FILTERS
          </h2>
          <form className="flex flex-col gap-6">
            <Input label="Location" name="city" placeholder="e.g. Abuja" defaultValue={params?.city || ""} />
            
            <div className="flex flex-col w-full">
              <label className="font-label-caps text-label-caps text-on-surface-variant mb-2">CATEGORY</label>
              <select name="category" className="bg-transparent border-none hairline-b font-body-lg text-body-lg text-primary focus:ring-0 p-4 appearance-none cursor-pointer focus:outline-none w-full" defaultValue={params?.category || ""}>
                <option value="">All Categories</option>
                <option value="FLAT">Flat</option>
                <option value="APPARTMENT">Appartment</option>
                <option value="DUPLEX">Duplex</option>
                <option value="LAND">Land</option>
              </select>
            </div>

            <div className="flex flex-col w-full">
              <label className="font-label-caps text-label-caps text-on-surface-variant mb-2">TYPE</label>
              <select name="type" className="bg-transparent border-none hairline-b font-body-lg text-body-lg text-primary focus:ring-0 p-4 appearance-none cursor-pointer focus:outline-none w-full" defaultValue={params?.type || ""}>
                <option value="">All Types</option>
                <option value="RENT">Rent</option>
                <option value="SALES">Sales</option>
                <option value="LEASE">Lease</option>
              </select>
            </div>

            <button type="submit" className="bg-primary text-on-primary font-label-caps text-label-caps p-4 mt-4 hover:bg-tertiary-fixed hover:text-primary transition-colors uppercase">
              APPLY FILTERS
            </button>
          </form>
        </aside>

        {/* Property Grid */}
        <div className="w-full md:w-3/4">
          <div className="flex justify-between items-end mb-8 hairline-b pb-4">
            <h1 className="font-headline-lg text-headline-lg text-primary uppercase">ESTATES & RESIDENCES</h1>
            <span className="font-label-caps text-label-caps text-on-surface-variant">
              {properties.length} RESULTS
            </span>
          </div>

          {properties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
              {properties.map(prop => (
                <PropertyCard key={prop.id} property={prop} />
              ))}
            </div>
          ) : (
            <div className="py-24 text-center text-on-surface-variant font-body-lg text-body-lg">
              No properties found matching your criteria.
            </div>
          )}
        </div>
      </div>
    </main>
  );
}