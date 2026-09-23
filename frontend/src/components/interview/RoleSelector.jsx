import Select from "react-select";
import { Briefcase } from "lucide-react";

export default function RoleSelector({
  role,
  setRole,
  roleOptions,
}) {
  return (
    <div className="bg-[#1E293B] border border-gray-700 rounded-2xl p-5">
      <div className="flex items-center gap-2 mb-3">
        <Briefcase className="w-5 h-5 text-blue-400" />
        <h2 className="text-white font-semibold">
          Select Job Role
        </h2>
      </div>

      <Select
        options={roleOptions}
        value={roleOptions.find((r) => r.value === role)}
        onChange={(selected) => setRole(selected?.value || "")}
        placeholder="🔍 Search Job Role..."
        isSearchable
        styles={{
          control: (base) => ({
            ...base,
            backgroundColor: "#0F172A",
            borderColor: "#4B5563",
            color: "white",
            minHeight: "50px",
            borderRadius: "12px",
          }),
          menu: (base) => ({
            ...base,
            backgroundColor: "#0F172A",
          }),
          option: (base, state) => ({
            ...base,
            backgroundColor: state.isFocused ? "#1E293B" : "#0F172A",
            color: "white",
            cursor: "pointer",
          }),
          singleValue: (base) => ({
            ...base,
            color: "white",
          }),
          input: (base) => ({
            ...base,
            color: "white",
          }),
          placeholder: (base) => ({
            ...base,
            color: "#94A3B8",
          }),
        }}
      />
    </div>
  );
}