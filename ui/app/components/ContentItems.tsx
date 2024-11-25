import ReactMarkdown from 'react-markdown';
import { ContentItem } from "../lib/types";

const ContentItems = ({ items }: { items: ContentItem[] }) => {
  const parseContent = (item: any) => {
    if (item.repr && typeof item.repr === 'string') {
      const match = item.repr.match(/ContentItem\(content="(.+?)"\)/s);
      return match ? match[1].replace(/\\n/g, '\n') : '';
    }
    return item.content || '';
  };

  return (
    <div className="space-y-4 h-full">
      <h2 className="text-xl font-semibold mb-4">Content Items</h2>
      {items && items.length > 0 ? (
        items.map((item, index) => (
          <div 
            key={index} 
            className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow w-full max-w-4xl"
          >
            <div className="p-6 prose max-w-none">
              <ReactMarkdown>
                {parseContent(item)}
              </ReactMarkdown>
            </div>
          </div>
        ))
      ) : (
        <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-lg p-6">
          <p className="text-center text-gray-500">No content items available</p>
        </div>
      )}
    </div>
  );
};

export default ContentItems;