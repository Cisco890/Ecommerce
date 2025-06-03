import React, { useState } from "react"

interface ButtonLikeProps {
  liked?: boolean
  onToggle?: (liked: boolean) => void
  size?: "small" | "medium" | "large"
}

const ButtonLike: React.FC<ButtonLikeProps> = ({
  liked = false,
  onToggle,
  size = "medium",
}) => {
  const [isLiked, setIsLiked] = useState(liked)

  const handleClick = () => {
    const newState = !isLiked
    setIsLiked(newState)
    onToggle?.(newState)
  }

  return (
    <button
      className={`btn-like btn-like--${size} ${isLiked ? "btn-like--liked" : ""}`}
      onClick={handleClick}
    >
      <svg
        className="btn-like__heart"
        viewBox="0 0 24 24"
        fill={isLiked ? "#ff69b4" : "none"}
        stroke={isLiked ? "#ff69b4" : "currentColor"}
        strokeWidth="2"
      >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    </button>
  )
}

export default ButtonLike
