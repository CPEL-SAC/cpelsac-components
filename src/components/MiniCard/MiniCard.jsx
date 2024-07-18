import { useEffect, useState } from "react"
import './MiniCard.css'

function MiniCard({
  icon, title, data, color
}) {
  const [size, setSize] = useState(1)

  const setTextSize = () => {
    // if (!data) return
    const len = data?.toString()?.length
    if (len > 10) {
      setSize(1)
    } else if (len > 6) {
      setSize(2)
    } else {
      setSize(3)
    }
  }

  useEffect(() => {
    setTextSize()
  }, [data]) // eslint-disable-line

  return (
    <article className={`mini-card c-${color}`}>
      <div className="icon">{icon}</div>
      <div className="title">{title}</div>
      <div className={`data size-${size} text-center`}>{data}</div>
    </article>
  )
}

export default MiniCard
