export default function NutrientEditor({
    value,
    onChange
}: {
    value: { crudeProtein: number, metabolizableEnergy: number}
    onChange: any
}) {
    return (
        <div className="flex gap-2">
            <input
                type="number"
                value={value.crudeProtein}
                onChange={(e) => 
                    onChange({...value, crudeProtein: +e.target.value})
                }
                className="w-full p-2 border rounded-lg"
                placeholder="Crude Protein %"
            />
            <input
                type="number"
                value={value.metabolizableEnergy}
                onChange={(e) =>
                    onChange({...value, metabolizableEnergy: +e.target.value})
                }
                className="w-full p-2 border rounded-lg"
                placeholder="Metabolizable Energy kcal/kg"
            />
        </div>
    )
}