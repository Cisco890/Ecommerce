// src/stories/Card.stories.tsx
import type { Meta, StoryObj } from "@storybook/react"
import { useState } from "react"
import Card from "../components/Card"
import "../index.css"
import "../app.css"

const meta: Meta<typeof Card> = {
  title: "Components/Card",
  component: Card,
  tags: ["autodocs"],
  argTypes: {
    name: { control: "text" },
    price: { control: "number" },
    img: { control: "text" },
    captured: { control: "boolean" },
    onToggle: { action: "toggle-captura" }, // <-- Aquí agregas la action
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 240, margin: "2rem auto" }}>
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof Card>

// Story interactiva
export const Interactivo: Story = {
  render: (args) => {
    const [captured, setCaptured] = useState(args.captured ?? false)
    return (
      <Card
        {...args}
        captured={captured}
        onToggle={() => setCaptured((prev) => !prev)}
      />
    )
  },
  args: {
    name: "Pikachu",
    price: 50,
    img: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png",
    captured: false,
  },
}

export const Default: Story = {
  args: {
    name: "Pikachu",
    price: 50,
    img: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png",
    captured: false,
    // No necesitas pasar onToggle, Storybook lo inyecta como action
  },
}

export const Capturado: Story = {
  args: {
    name: "Pikachu",
    price: 50,
    img: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png",
    captured: true,
    // No necesitas pasar onToggle, Storybook lo inyecta como action
  },
}
