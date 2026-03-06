import NPWindow from "./elements/NPWindow"
import NPButton from "./elements/NPButton"
import { useState } from "react"
import NPEditableList from "./elements/NPEditableList"

function ScanWindow({ onClose }: { onClose: () => void }) {
    const [positive, setPositive] = useState([
        "The king sat on his throne",
        "The queen wore her crown",
        "The prince rode his horse"
    ])
    const [negative, setNegative] = useState([
        "The programmer wrote some code",
        "The dog ran across the field",
        "The chef cooked a meal",
    ])

    return (
        <NPWindow name="Scan" onClose={onClose} defaultSize={{width: 300, height: 495.8}} bounds={{ x: 0, y: 0 + 35, w: window.innerWidth, h: window.innerHeight }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <NPEditableList label="Positive inputs" items={positive} onChange={setPositive} />
                <NPEditableList label="Negative inputs" items={negative} onChange={setNegative} />
                <NPButton>Start scanning</NPButton>
            </div>
        </NPWindow>
    )
}

export default ScanWindow