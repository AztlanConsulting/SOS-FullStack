import type { Meta, StoryObj } from '@storybook/react';
import { Input } from './Input';

const meta: Meta<typeof Input> = {
  title: 'UI/Input',
  component: Input,
  tags: ['autodocs'],
  argTypes: {
    onChange: { action: 'changed' },
  },
};

export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = {
  args: {
    id: 'test-input',
    label: 'Nombre de la mascota',
    placeholder: 'Ej. Firulais',
  },
};

export const Filled: Story = {
  args: {
    id: 'test-input-filled',
    label: 'Nombre de la mascota',
    value: 'Max',
    readOnly: true,
  },
};
