import React, { useState } from "react"

interface ButtonEstrellaProps {
  rating?: number
  onRatingChange?: (rating: number) => void
}

const ButtonEstrella: React.FC<ButtonEstrellaProps> = ({
  rating = 0,
  onRatingChange,
}) => {
  const [currentRating, setCurrentRating] = useState(rating)
  const [hoverRating, setHoverRating] = useState(0)

  const handleClick = (starIndex: number) => {
    const newRating = starIndex + 1
    setCurrentRating(newRating)
    onRatingChange?.(newRating)
  }

  return (
    <div className="btn-estrella">
      {[...Array(5)].map((_, index) => (
        <button
          key={index}
          className={`btn-estrella__star ${
            index < (hoverRating || currentRating)
              ? "btn-estrella__star--filled"
              : ""
          }`}
          onClick={() => handleClick(index)}
          onMouseEnter={() => setHoverRating(index + 1)}
          onMouseLeave={() => setHoverRating(0)}
        >
          <svg viewBox="0 0 24 24" className="btn-estrella__icon">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        </button>
      ))}
    </div>
  )
}

export default ButtonEstrella
