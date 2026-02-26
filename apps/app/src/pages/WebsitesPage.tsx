import { Link } from "react-router";
import { useWebsites } from "../features/websites/hooks/useWebsite";
import { Button } from "../shared/components/ui/Button";

export default function WebsitesPage() {
  const { data, isLoading } = useWebsites();
  const websites = data?.data || data || [];

  if (isLoading) return <div>Loading websites...</div>;

  return (
    <div>
      {/* top bar */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold">Websites</h1>

        <Link to="/sites/add">
          <Button>Add Website</Button>
        </Link>
      </div>

      {websites.length === 0 && (
        <div className="text-sm text-gray-400">No websites yet.</div>
      )}

      {/* cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {websites.map((site: any) => (
          <div key={site.id} className="border border-gray-300 rounded-xl p-5">
            <h2 className="font-semibold text-lg">{site.name}</h2>

            <p className="text-sm text-gray-400 mt-1">{site.domain}</p>

            <div className="text-xs text-gray-500 mt-3">
              Timezone: {site.timezone}
            </div>

            <div className="mt-4 flex gap-2">
              <Link to={`/sites/${site.domain}`}>
                <Button>Open</Button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
