import type { Meta, StoryObj } from '@storybook/react';
import { Select } from './Select';

const meta: Meta<typeof Select> = {
  title: 'UI/Select',
  component: Select,
  tags: ['autodocs'],
  argTypes: {
    onChange: { action: 'selected' },
  },
};

export default meta;
type Story = StoryObj<typeof Select>;

export const Default: Story = {
  args: {
    id: 'test-select',
    label: 'Especie de la mascota',
    options: [
      { value: 'Perro', label: 'Perro' },
      { value: 'Gato', label: 'Gato' },
      { value: 'Ave', label: 'Ave' },
      { value: 'Otro', label: 'Otro' },
    ],
  },
};
