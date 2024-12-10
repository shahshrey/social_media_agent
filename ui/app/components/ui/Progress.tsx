import { cn } from "../../lib/utils";
import { CheckIcon, LoaderCircle } from "lucide-react";
import { truncateUrl } from "../../lib/utils";

export function Progress({
  logs,
}: {
  logs: {
    message: string;
    done: boolean;
  }[];
}) {
  if (logs.length === 0) {
    return null;
  }

  return (
    <div>
      <div className="border border-border bg-muted/30 shadow-md rounded-lg overflow-hidden text-sm py-2">
        {logs.map((log, index) => (
          <div
            key={index}
            className={cn(
              "flex",
              log.done || index === logs.findIndex((log) => !log.done)
                ? ""
                : "opacity-50"
            )}
          >
            <div className="w-8">
              <div className="w-4 h-4 bg-primary flex items-center justify-center rounded-full mt-[10px] ml-[12px]">
                {log.done ? (
                  <CheckIcon className="w-3 h-3 text-primary-foreground" />
                ) : (
                  <LoaderCircle className="w-3 h-3 text-primary-foreground animate-spin" />
                )}
              </div>
              {index < logs.length - 1 && (
                <div className="h-full w-[1px] bg-border ml-[20px]" />
              )}
            </div>
            <div className="flex-1 flex justify-center py-2 pl-2 pr-4">
              <div className="flex-1 flex items-center text-xs text-foreground">
                {log.message.replace(
                  /https?:\/\/[^\s]+/g,
                  (url) => truncateUrl(url)
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
