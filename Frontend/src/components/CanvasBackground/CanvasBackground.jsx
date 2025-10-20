import { useEffect, useRef } from 'react'

/**
 * CanvasBackground renders a crisp, square grid across the viewport.
 * It adapts to light/dark theme via CSS variables and redraws on resize.
 */
const CanvasBackground = ({
	cellSize = 32, // size of each square in CSS pixels
	lineWidth = 1,
	opacity = 0.18, // overall line alpha multiplier
	vignetteRadius = 0.3, // 0.0–1.0, higher = larger vignette, fade starts farther from center
}) => {
	const canvasRef = useRef(null)

	// Get a themed grid color from CSS variables; fallback to subtle gray
		const getGridColor = () => {
		const root = document.documentElement
		const styles = getComputedStyle(root)
		// Prefer a subtle text tint if available, else border color
		const raw =
			styles.getPropertyValue('--text-color4').trim() ||
			styles.getPropertyValue('--border-color').trim() ||
			'#5a5a5a88'
			return applyOpacity(normalizeColor(raw), opacity)
	}

	// Normalize CSS color values to a canvas-friendly rgba() string
	function normalizeColor(c) {
		// If already rgba/hsla or a named color, just return
		if (/^rgba?|hsla?|#/.test(c) === false) return c
		if (c.startsWith('rgb') || c.startsWith('hsl')) return c
		// Handle hex #RRGGBB or #RRGGBBAA
		if (c.startsWith('#')) {
			const hex = c.replace('#', '').trim()
			const isShort = hex.length === 3 || hex.length === 4
			const expand = (h) =>
				h
					.split('')
					.map((ch) => ch + ch)
					.join('')
			const full = isShort ? expand(hex) : hex
			const r = parseInt(full.slice(0, 2), 16)
			const g = parseInt(full.slice(2, 4), 16)
			const b = parseInt(full.slice(4, 6), 16)
					const a = full.length === 8 ? parseInt(full.slice(6, 8), 16) / 255 : 0.35
					return `rgba(${r}, ${g}, ${b}, ${a.toFixed(3)})`
		}
		return c
	}

			function applyOpacity(color, alphaMul) {
				try {
					if (color.startsWith('rgba')) {
						const m = color.match(/rgba\(([^)]+)\)/)
						if (!m) return color
						const parts = m[1].split(',').map((p) => p.trim())
						const r = parts[0], g = parts[1], b = parts[2]
						const a = parseFloat(parts[3] ?? '1')
						const newA = Math.max(0, Math.min(1, a * alphaMul))
						return `rgba(${r}, ${g}, ${b}, ${newA.toFixed(3)})`
					}
					if (color.startsWith('rgb(')) {
						const m = color.match(/rgb\(([^)]+)\)/)
						if (!m) return color
						const parts = m[1].split(',').map((p) => p.trim())
						const r = parts[0], g = parts[1], b = parts[2]
						const newA = Math.max(0, Math.min(1, 1 * alphaMul))
						return `rgba(${r}, ${g}, ${b}, ${newA.toFixed(3)})`
					}
					// For hex or others, normalize to rgba and recurse once
					if (color.startsWith('#')) {
						return applyOpacity(normalizeColor(color), alphaMul)
					}
					return color
				} catch {
					return color
				}
			}


	const draw = () => {
		const canvas = canvasRef.current
		if (!canvas) return
		const ctx = canvas.getContext('2d')
		if (!ctx) return

		const dpr = Math.max(1, Math.floor(window.devicePixelRatio || 1))
		const cssWidth = window.innerWidth
		const cssHeight = window.innerHeight
		canvas.width = cssWidth * dpr
		canvas.height = cssHeight * dpr
		canvas.style.width = cssWidth + 'px'
		canvas.style.height = cssHeight + 'px'
		ctx.setTransform(dpr, 0, 0, dpr, 0, 0) // scale for DPR

		// Clear
		ctx.clearRect(0, 0, cssWidth, cssHeight)

		// Grid style
		ctx.strokeStyle = getGridColor()
		ctx.lineWidth = lineWidth

		// Draw vertical lines
		ctx.beginPath()
		for (let x = 0; x <= cssWidth; x += cellSize) {
			ctx.moveTo(x + 0.5, 0)
			ctx.lineTo(x + 0.5, cssHeight)
		}

		// Draw horizontal lines
		for (let y = 0; y <= cssHeight; y += cellSize) {
			ctx.moveTo(0, y + 0.5)
			ctx.lineTo(cssWidth, y + 0.5)
		}
		ctx.stroke()

		// --- Vignette effect: fade out grid at corners/edges ---
		// Use a radial gradient alpha mask
		const vignetteStrength = 0.85 // 0 = no fade, 1 = strong fade
		const cx = cssWidth / 2
		const cy = cssHeight / 2
		const maxR = Math.sqrt(cx * cx + cy * cy)
		const grad = ctx.createRadialGradient(cx, cy, maxR * vignetteRadius, cx, cy, maxR)
		grad.addColorStop(0, 'rgba(0,0,0,0)')
		grad.addColorStop(1, `rgba(0,0,0,${vignetteStrength})`)

		ctx.save()
		ctx.globalCompositeOperation = 'destination-out'
		ctx.fillStyle = grad
		ctx.fillRect(0, 0, cssWidth, cssHeight)
		ctx.restore()
	}

	useEffect(() => {
		let raf = 0
		const handleResize = () => {
			cancelAnimationFrame(raf)
			raf = requestAnimationFrame(draw)
		}
		handleResize()
		window.addEventListener('resize', handleResize)
		window.addEventListener('orientationchange', handleResize)

		// Redraw when theme changes (data-theme attribute changes on <html>)
		const mo = new MutationObserver((mut) => {
			for (const m of mut) {
				if (m.type === 'attributes' && m.attributeName === 'data-theme') {
					handleResize()
					break
				}
			}
		})
		mo.observe(document.documentElement, { attributes: true })

		return () => {
			window.removeEventListener('resize', handleResize)
			window.removeEventListener('orientationchange', handleResize)
			mo.disconnect()
			cancelAnimationFrame(raf)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
		}, [cellSize, lineWidth, opacity])

	return (
		<canvas
			ref={canvasRef}
			aria-hidden="true"
			style={{
				position: 'fixed',
				inset: 0,
				width: '100vw',
				height: '100vh',
				pointerEvents: 'none',
				zIndex: 0,
			}}
		/>
	)
}

export default CanvasBackground

