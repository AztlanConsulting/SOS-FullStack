import type { Meta, StoryObj } from '@storybook/react';
import { Text } from './Text';

// Storybook metadata for the Text component
const meta: Meta<typeof Text> = {
  title: 'UI/Text', // Sidebar location in Storybook
  component: Text,
  tags: ['autodocs'], // Enables automatic docs generation

  // Controls configuration (what can be edited in the UI)
  argTypes: {
    variant: {
      control: 'select',
      options: ['display', 'h1', 'h2', 'h3', 'body', 'caption', 'small'],
    },
    weight: {
      control: 'select',
      options: ['regular', 'medium', 'bold'],
    },
    color: {
      control: 'text',
    },
  },
};

export default meta;

type Story = StoryObj<typeof Text>;

// Interactive playground: allows changing props dynamically in Storybook UI
export const Playground: Story = {
  args: {
    children: 'Texto de ejemplo',
    variant: 'body',
    weight: 'regular',
    color: 'text-gray-900',
  },
};

// Shows all text variants (sizes and hierarchy)
export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <Text variant="display">Display</Text>
      <Text variant="h1">Heading 1</Text>
      <Text variant="h2">Heading 2</Text>
      <Text variant="h3">Heading 3</Text>
      <Text variant="body">Body</Text>
      <Text variant="caption">Caption</Text>
      <Text variant="small">Small</Text>
    </div>
  ),
};

// Shows different font weights
export const Weights: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <Text weight="regular">Regular</Text>
      <Text weight="medium">Medium</Text>
      <Text weight="bold">Bold</Text>
    </div>
  ),
};

// Example of semantic usage: different HTML element with custom visual style
export const SemanticExample: Story = {
  render: () => (
    <div>
      <Text as="h1" variant="h2">
        h1 semantic but h2 style
      </Text>
    </div>
  ),
};
