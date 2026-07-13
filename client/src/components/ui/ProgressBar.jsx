import buildSteps from "../../data/buildSteps";

export default function ProgressBar({ completedSteps }) {
  return (
    <div className="flex items-center justify-evenly w-full mt-6">
      {buildSteps.map((step, index) => (
        <div
          key={step.id}
          className="flex flex-col items-center flex-1 relative"
        >
          {/* Connecting Line */}
          {index !== 0 && (
            <div
              className={`absolute top-4 right-1/2 w-full h-1 ${
                index <= completedSteps
                  ? "bg-blue-600"
                  : "bg-zinc-700"
              }`}
            />
          )}

          {/* Icon */}
          <div
            className={`z-10 p-2 rounded-full ${
              index < completedSteps
                ? "bg-blue-600"
                : "bg-zinc-800"
            }`}
          >
            <img
              src={step.icon}
              alt={step.name}
              className="w-8 h-8"
            />
          </div>

          {/* Label */}
          <p className="mt-2 text-xs text-zinc-400">
            {step.name}
          </p>
        </div>
      ))}
    </div>
  );
}