import type { Meta, StoryObj } from "@storybook/react"
import { useState } from "react"
import ButtonLike from "../components/ui/ButtonLike"
import "../index.css"
import "../app.css"

const meta: Meta<typeof ButtonLike> = {
  title: "Components/ButtonLike",
  component: ButtonLike,
  tags: ["autodocs"],
  argTypes: {
    liked: { control: "boolean" },
    size: {
      control: { type: "select", options: ["small", "medium", "large"] },
    },
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 100, margin: "2rem auto" }}>
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof ButtonLike>

// Interactivo: permite alternar el estado al hacer click
export const Interactivo: Story = {
  render: (args) => {
    const [liked, setLiked] = useState(args.liked ?? false)
    return <ButtonLike {...args} liked={liked} onToggle={setLiked} />
  },
  args: {
    liked: false,
    size: "medium",
  },
}
