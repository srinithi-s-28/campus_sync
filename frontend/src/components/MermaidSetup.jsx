import React, { useEffect, useRef } from "react"
import mermaid from "mermaid"
import { useTheme } from "../context/ThemeContext"

/* ---------- CLEAN ---------- */
const cleanMermaidChart = (diagram) => {
  if (!diagram) return ""

  let clean =
    typeof diagram === "string"
      ? diagram
      : diagram?.data || ""

  clean = clean
    .replace(/\r\n/g, "\n")
    .replace(/```mermaid/g, "")
    .replace(/```/g, "")
    .trim()

  if (!clean.startsWith("graph")) {
    clean = `graph TD\n${clean}`
  }

  return clean
}

/* ---------- AUTO FIX ---------- */
const autoFixBadNodes = (diagram) => {
  if (!diagram) return ""
  let index = 0
  return diagram.replace(/\[(.*?)\]/g, (_, label) => {
    index++
    return `N${index}[${label}]`
  })
}

function MermaidSetup({ diagram }) {
  const containerRef = useRef(null)

  useEffect(() => {
    if (!diagram || !containerRef.current) return

    const renderDiagram = async () => {
      try {
        mermaid.initialize({
          startOnLoad: false,
          theme: "base",
          flowchart: {
            useMaxWidth: false,
            htmlLabels: true,
            curve: "basis",
          },
          themeVariables: {
            primaryColor: "#0f172a",
            primaryBorderColor: "#3b82f6",
            primaryTextColor: "#e0f2fe",
            lineColor: "#60a5fa",
            secondaryColor: "#020617",
            tertiaryColor: "#020617",
            fontSize: "18px",
            nodeBorder: "#3b82f6",
          },
        })

        const cleaned = cleanMermaidChart(diagram)
        const fixed = autoFixBadNodes(cleaned)

        const { svg } = await mermaid.render(
          `mermaid-${Date.now()}`,
          fixed
        )

        if (containerRef.current) {
          containerRef.current.innerHTML = svg

          // make svg responsive + big
          const svgEl = containerRef.current.querySelector("svg")
          if (svgEl) {
            svgEl.style.width = "100%"
            svgEl.style.height = "auto"
            svgEl.style.maxWidth = "1000px"
          }
        }
      } catch (err) {
        console.error("Mermaid render failed:", err)
        if (containerRef.current) {
          containerRef.current.innerHTML =
            "<p class='text-red-400'>Diagram failed</p>"
        }
      }
    }

    renderDiagram()
  }, [diagram])

  return (
    <div className="w-full overflow-x-auto">
      <div className="mx-auto max-w-5xl bg-gradient-to-br from-slate-950/90 via-blue-950/40 to-slate-950/90 border border-blue-500/20 rounded-2xl p-6 shadow-xl">

        {/* glow */}
        <div className="absolute inset-0 pointer-events-none opacity-20 blur-2xl" />

        <div
          ref={containerRef}
          className="flex justify-center items-center min-h-[300px]"
        />
      </div>
    </div>
  )
}

export default MermaidSetup
