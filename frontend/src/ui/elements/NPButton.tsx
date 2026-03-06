import { useState } from "react";

function NPButton({ children, onClick }: { children: React.ReactNode, onClick?: () => void }) {
    const [hovered, setHovered] = useState(false)
    const [pressed, setPressed] = useState(false)

    return (
        <button
            onClick={onClick}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => { setHovered(false); setPressed(false) }}
            onMouseDown={() => setPressed(true)}
            onMouseUp={() => setPressed(false)}
            style={{
                background: hovered ? "#222222" : "#252525",
                color: hovered ? "#FFFFFF" : "#DDDDDD",
                border: hovered ? "1px solid #7C7C7C" : "1px solid #2C2C2C",
                fontFamily: "monospace",
                cursor: "pointer",
                padding: "4px 8px",
                borderRadius: "4px",
                transform: pressed ? "scale(0.95)" : "scale(1)",
                transition: "transform 0.1s ease, background 0.15s ease, color 0.15s ease, border 0.15s ease",
                height: "31px"
            }}
        >
            {children}
        </button>
    )
}

export default NPButton