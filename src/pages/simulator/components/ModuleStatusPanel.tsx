import { LucideIcon } from "lucide-react";

export type ModuleStatusPanelProps = {
  title: string;
  state: string;
  icon: LucideIcon;
  color: string;
  details?: string[];
};

export function ModuleStatusPanel({
  title,
  state,
  icon: Icon,
  color,
  details,
}: ModuleStatusPanelProps) {
  return (
    <div className={`bg-slate-800 rounded-lg p-4 border-2 ${color}`}>
      <div className="flex items-center gap-2 mb-3">
        <Icon className="w-5 h-5 text-white" />
        <h3 className="text-white font-bold text-sm">{title}</h3>
      </div>
      <div
        className={`px-3 py-2 rounded font-bold text-sm text-center ${
          state.includes("ERROR") || state.includes("JAMMED")
            ? "bg-red-600"
            : state.includes("REJECTED") || state.includes("DECLINED")
            ? "bg-orange-600"
            : state.includes("ACCEPTED") ||
              state.includes("APPROVED") ||
              state.includes("COMPLETED")
            ? "bg-green-600"
            : state.includes("VALIDATING") ||
              state.includes("CHECKING") ||
              state.includes("DISPENSING") ||
              state.includes("PROCESSING")
            ? "bg-yellow-600"
            : state.includes("RUNNING")
            ? "bg-blue-600"
            : "bg-gray-600"
        } text-white`}
      >
        {state}
      </div>
      {details && (
        <div className="mt-3 space-y-1 text-xs text-slate-400">
          {details.map((detail, idx) => (
            <div key={idx}>{detail}</div>
          ))}
        </div>
      )}
    </div>
  );
}
