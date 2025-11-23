import React from "react"
import "../../styles/skeleton.scss"

const Skeleton = ({ width = "100%", height = 16, rounded = 8, style = {}, className = "", lines = 1 }) => {
  const baseStyle = {
    width,
    height,
    borderRadius: rounded,
  }
  if (lines > 1) {
    return (
      <div className={`skeleton-lines ${className}`} style={{ ...style }}>
        {Array.from({ length: lines }).map((_, i) => (
          <div key={i} className="skeleton shimmer" style={{ ...baseStyle, width: i === lines - 1 ? "70%" : width, marginTop: i === 0 ? 0 : 10 }} />
        ))}
      </div>
    )
  }
  return <div className={`skeleton shimmer ${className}`} style={{ ...baseStyle, ...style }} />
}

export default Skeleton
