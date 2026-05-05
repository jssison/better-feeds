import { ANIMALS } from "../data/animals";
import type { AnimalOption , AnimalType} from "../data/types";

interface Props {
  animals: AnimalOption[];
  selected: AnimalType | null;
  onSelect: (animal: AnimalOption) => void;
}

export default function AnimalSelector({ selected, onSelect }: Props) {
    return (
        <div className="grid grid-cols-3 gap-2">
            {ANIMALS.map((a) => (
                <button
                    key={a.key}
                    onClick={() => onSelect(a)}
                    className={`p-3 rounded-xl border text-center
                        ${selected === a.key ? "bg-green-200 border-green-600" : "bg-white"}    
                    `}
                >
                    {/* replace icon with img if needed */}
                    {/* <div className="text-xl">{a.icon}</div> */}
                    <div className="text-sm font-semibold">{a.label}</div>
                </button>
            ))}
        </div>
    )
}