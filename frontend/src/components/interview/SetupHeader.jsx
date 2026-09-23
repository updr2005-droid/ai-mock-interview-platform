import React from "react";
import { Briefcase } from "lucide-react";

const SetupHeader = () => {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-2">
        <div className="p-3 rounded-xl bg-blue-600 text-white">
          <Briefcase size={24} />
        </div>

        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Set Up Your Interview
          </h1>

          <p className="text-gray-500 mt-1">
            Configure your mock interview and get ready to practice.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SetupHeader;