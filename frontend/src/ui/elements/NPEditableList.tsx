import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

function NPEditableList({ label, items, onChange }: {
    label: string
    items: string[]
    onChange: (items: string[]) => void
}) {
    const add = () => onChange([...items, ""])
    const remove = (i: number) => onChange(items.filter((_, j) => j !== i))
    const update = (i: number, val: string) => onChange(items.map((v, j) => j === i ? val : v))

    return (
        <div 
            className="flex flex-col gap-2 border border-border border-gray-400 p-2 rounded"
            style={{
                border: "1px solid #7C7C7C",
                borderRadius: "8px",
                padding: "8px"
            }}
        >
            <span className="text-background" style={{ color: "#A7A7A7" }}>{label}</span>
            {items.map((item, i) => (
                <div key={i} className="flex gap-2 items-center">
                    <Input 
                        value={item} 
                        onChange={e => update(i, e.target.value)} 
                        style={{ 
                            border: "1px solid #7C7C7C",
                            padding: "4px 8px 4px 8px",
                            fontSize: "0.85rem",
                            backgroundColor: "#252525",
                            height: "31px"
                        }}
                        className="focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-white"
                    />
                    <span onClick={() => remove(i)} className="cursor-pointer opacity-50 hover:opacity-100">✕</span>
                </div>
            ))}
            <Button 
                variant="outline" 
                onClick={add} 
                className="w-full border-dashed text-sm bg-transparent hover:bg-white/10 hover:text-white text-md" 
                style={{ border: "1px dashed #7C7C7C", color: "#A7A7A7", height: "31px" }}
            >+ add</Button>
        </div>
    )
}

export default NPEditableList