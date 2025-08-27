const steps = ["Filtering", "Scoring", "Results"];

export default function Stepper({ active = 2 }: { active: number }) {
  return (
    <div className="flex items-center justify-center gap-4 my-6">
      {steps.map((s, idx) => (
        <div key={s} className="flex items-center gap-2">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold
              ${idx <= active ? "bg-indigo-600 text-white" : "bg-gray-200 dark:bg-gray-700 text-gray-500"}`}
          >
            {idx + 1}
          </div>
          <span className={idx <= active ? "text-indigo-600 dark:text-indigo-400 font-medium" : "text-gray-400"}>
            {s}
          </span>
          {idx < steps.length - 1 && (
            <div className="w-10 h-0.5 bg-gray-300 dark:bg-gray-600 mx-2"></div>
          )}
        </div>
      ))}
    </div>
  );
}
