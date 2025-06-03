import type { Meta, StoryObj } from "@storybook/react"
import { useState } from "react"
import ButtonEstrella from "../components/ui/ButtonEstrella"
import "../index.css"
import "../app.css"

const meta: Meta<typeof ButtonEstrella> = {
  title: "Components/ButtonEstrella",
  component: ButtonEstrella,
  tags: ["autodocs"],
  argTypes: {
    rating: { control: { type: "number", min: 0, max: 5 } },
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 180, margin: "2rem auto" }}>
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof ButtonEstrella>

export const Interactivo: Story = {
  render: (args) => {
    const [rating, setRating] = useState(args.rating ?? 0)
    return (
      <ButtonEstrella {...args} rating={rating} onRatingChange={setRating} />
    )
  },
  args: {
    rating: 0,
  },
}
