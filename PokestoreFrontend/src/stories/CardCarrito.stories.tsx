import type { Meta, StoryObj } from "@storybook/react"
import { useState } from "react"
import CardCarrito from "../components/CardCartito"
import "../index.css"
import "../app.css"

const meta: Meta<typeof CardCarrito> = {
  title: "Components/CardCarrito",
  component: CardCarrito,
  tags: ["autodocs"],
  argTypes: {
    name: { control: "text" },
    price: { control: "number" },
    img: { control: "text" },
    quantity: { control: "number" },
    onIncrease: { action: "increase-click" },
    onDecrease: { action: "decrease-click" },
    onRemove: { action: "remove-click" },
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 340, margin: "2rem auto" }}>
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof CardCarrito>

// Story interactiva
export const Interactivo: Story = {
  render: (args) => {
    const [quantity, setQuantity] = useState(args.quantity ?? 1)

    return (
      <CardCarrito
        {...args}
        quantity={quantity}
        onIncrease={() => setQuantity((q) => Math.min(q + 1, 9))}
        onDecrease={() => setQuantity((q) => Math.max(q - 1, 1))}
        onRemove={() => setQuantity(0)}
      />
    )
  },
  args: {
    name: "Goomy",
    price: 50,
    img: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/704.png",
    quantity: 2,
  },
}

export const Default: Story = {
  args: {
    name: "Goomy",
    price: 50,
    img: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/704.png",
    quantity: 1,
    // No necesitas pasar las funciones, Storybook las inyecta como actions
  },
}
