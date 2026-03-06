import { useState, useRef, useEffect } from "react"

const clamp = (val:number, min:number, max:number) => Math.max(min, Math.min(max, val))

const BORDER = 6
type ResizeDir = 'n' | 's' | 'e' | 'w' | 'ne' | 'nw' | 'se' | 'sw'

function NPWindow({ name, children, onClose, defaultPos, defaultSize, bounds }: {
    name:string
    children: React.ReactNode
    onClose?: () => void
    defaultPos?: { x:number, y:number }
    defaultSize?: { width:number, height:number }
    bounds?: { x:number, y:number, w:number, h:number }
}) {
    const [pos, setPos] = useState(defaultPos ?? { x: 100, y: 100 })
    const [size, setSize] = useState(defaultSize ?? { width: 300, height: 200 })
    const clampPos = (x:number, y:number) => {
        const minX = bounds?.x ?? 0
        const minY = bounds?.y ?? 0
        const maxX = (bounds ? bounds.x + bounds.w : window.innerWidth) - size.width
        const maxY = (bounds ? bounds.y + bounds.h : window.innerHeight) - size.height
        return {
            x: clamp(x, minX, maxX),
            y: clamp(y, minY, maxY),
        }
    }

    const dragging = useRef(false)
    const dragOffset = useRef({ x: 0, y: 0 })
    const resizing = useRef(false)
    const resizeDir = useRef<ResizeDir>('se')
    const resizeStart = useRef({ mx: 0, my: 0, x: 0, y: 0, w: 0, h: 0 })

    useEffect(() => {
        setPos(p => clampPos(p.x, p.y))
    }, [])

    const onTitleMouseDown = (e:React.MouseEvent) => {
        e.stopPropagation()
        dragging.current = true
        dragOffset.current = { x: e.clientX - pos.x, y: e.clientY - pos.y }
        window.addEventListener('mousemove', handleDragMove)
        window.addEventListener('mouseup', handleDragUp)
    }
    const handleDragMove = (e:MouseEvent) => {
        if (!dragging.current) return
        setPos(clampPos(e.clientX - dragOffset.current.x, e.clientY - dragOffset.current.y))
    }
    const handleDragUp = () => {
        dragging.current = false
        window.removeEventListener('mousemove', handleDragMove)
        window.removeEventListener('mouseup', handleDragUp)
    }

    const onResizeMouseDown = (e:React.MouseEvent, dir: ResizeDir) => {
        e.stopPropagation()
        resizing.current = true
        resizeDir.current = dir
        resizeStart.current = { mx: e.clientX, my: e.clientY, x: pos.x, y: pos.y, w: size.width, h: size.height }
        window.addEventListener('mousemove', handleResizeMove)
        window.addEventListener('mouseup', handleResizeUp)
    }
    const handleResizeMove = (e: MouseEvent) => {
        if (!resizing.current) return
        const { mx, my, x, y, w, h } = resizeStart.current
        const dx = e.clientX - mx
        const dy = e.clientY - my
        const dir = resizeDir.current
        let nx = x, ny = y, nw = w, nh = h
        if (dir.includes('e')) nw = Math.max(150, w + dx)
        if (dir.includes('s')) nh = Math.max(100, h + dy)
        if (dir.includes('w')) { nw = Math.max(150, w - dx); nx = x + (w - nw) }
        if (dir.includes('n')) { nh = Math.max(100, h - dy); ny = y + (h - nh) }
    
        // clamp position but compensate size so right/bottom edge stays fixed
        const clampedX = clamp(nx, 0, window.innerWidth - nw)
        const clampedY = clamp(ny, 0, window.innerHeight - nh)
        if (dir.includes('w')) nw += nx - clampedX
        if (dir.includes('n')) nh += ny - clampedY
    
        setPos({ x: clampedX, y: clampedY })
        setSize({ width: Math.max(150, nw), height: Math.max(100, nh) })
    }
    const handleResizeUp = () => {
        resizing.current = false
        window.removeEventListener('mousemove', handleResizeMove)
        window.removeEventListener('mouseup', handleResizeUp)
    }

    useEffect(() => {
        setPos(p => clampPos(p.x, p.y))

        const onResize = () => setPos(p => clampPos(p.x, p.y))
        window.addEventListener('resize', onResize)
        return () => window.removeEventListener('resize', onResize)
    }, [])

    const edge = (dir: ResizeDir, style:React.CSSProperties) => (
        <div onMouseDown={e => onResizeMouseDown(e, dir)} style={{ position: 'absolute', ...style }} />
    )

    return (
        <div style={{
            width: size.width,
            height: size.height,
            position: "absolute",
            top: pos.y,
            left: pos.x,
            background: "#2C2C2C",
            border: "1px solid #7C7C7C",
            color: "#FFFFFF",
            fontFamily: "monospace",
            userSelect: "none",
            zIndex: 10,
            borderRadius: "6px",
            overflow: "hidden",
            boxSizing: "border-box",
        }}>
            {/* title bar */}
            <div
                onMouseDown={onTitleMouseDown}
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "6px 12px",
                    cursor: "move",
                    borderBottom: "1px solid #7C7C7C",
                }}
            >
                <span style={{ fontWeight: "bold" }}>{name}</span>
                <span
                    onMouseDown={e => e.stopPropagation()}
                    onClick={() => onClose?.()}
                    style={{ cursor: "pointer", lineHeight: 1, opacity: 0.7 }}
                >✕</span>
            </div>

            {/* content */}
            <div style={{ padding: "12px", width: "100%", height: "calc(100% - 33px)", boxSizing: "border-box", overflow: "auto" }}>
                {children}
            </div>

            {/* edges */}
            {edge('n',  { top: 0, left: BORDER, right: BORDER, height: BORDER, cursor: 'n-resize' })}
            {edge('s',  { bottom: 0, left: BORDER, right: BORDER, height: BORDER, cursor: 's-resize' })}
            {edge('w',  { left: 0, top: BORDER, bottom: BORDER, width: BORDER, cursor: 'w-resize' })}
            {edge('e',  { right: 0, top: BORDER, bottom: BORDER, width: BORDER, cursor: 'e-resize' })}
            {edge('nw', { top: 0, left: 0, width: BORDER, height: BORDER, cursor: 'nw-resize' })}
            {edge('ne', { top: 0, right: 0, width: BORDER, height: BORDER, cursor: 'ne-resize' })}
            {edge('sw', { bottom: 0, left: 0, width: BORDER, height: BORDER, cursor: 'sw-resize' })}
            {edge('se', { bottom: 0, right: 0, width: BORDER, height: BORDER, cursor: 'se-resize' })}
        </div>
    )
}

export default NPWindow