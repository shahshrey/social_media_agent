import { ContentItem } from "../lib/types";

interface ParsedContent {
  title: string;
  summary: string;
}

// TODO: This is a temporary solution to parse the content items.
const ContentItems = ({ items }: { items: ContentItem[] }) => {
  console.log(items);
  const parseContent = (item: ContentItem): ParsedContent => {
    try {
      const patterns = [
        /ContentItem\(title='([^']*)',\s*summary="([^"]*)"\)/,  // Single quote title, double quote summary
        /ContentItem\(title='([^']*)',\s*summary='([^']*)'\)/,  // Both single quotes
        /ContentItem\(title="([^"]*)",\s*summary="([^"]*)"\)/,  // Both double quotes
        /ContentItem\(title="([^"]*)",\s*summary='([^']*)'\)/   // Double quote title, single quote summary
      ];

      for (const pattern of patterns) {
        const match = item.repr.match(pattern);
        if (match) {
          return {
            title: match[1] || 'Unknown Title',
            summary: match[2] || 'No summary available'
          };
        }
      }

      console.warn('No matching pattern found for:', item.repr);
      return { title: 'Unknown Title', summary: 'No summary available' };
    } catch (e) {
      console.error('Error parsing content:', e);
      return { title: 'Error', summary: 'Failed to parse content' };
    }
  };

  return (
    <div className="space-y-4 h-full">
      <h2 className="text-xl font-semibold mb-4">Content Items</h2>
      {items && items.length > 0 ? (
        items.map((item, index) => {
          const { title, summary } = parseContent(item);
          return (
            <div 
              key={index} 
              className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {summary}
                </p>
                <div className="mt-3 flex items-center gap-2">
                  {item.id.map((tag, idx) => (
                    <span 
                      key={idx}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          );
        })
      ) : (
        <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-lg p-6">
          <p className="text-center text-gray-500">No content items available</p>
        </div>
      )}
    </div>
  );
};

export default ContentItems;