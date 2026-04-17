import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';
import { HiChevronRight, HiArrowRight } from 'react-icons/hi';

const meta: Meta<typeof Button> = {
  title: 'Atoms/Buttons',
  component: Button,
  decorators: [
    (Story) => (
      <div className="flex justify-center w-xl bg-white p-4">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: {
    label: 'Perdi mi mascota',
    variant: 'primary',
    icon: HiChevronRight,
  },
};

export const Secondary: Story = {
  args: {
    label: 'Encontré una mascota',
    variant: 'secondary',
  },
};

export const Danger: Story = {
  args: {
    label: '¿No es lo que buscas? Personalízalo',
    variant: 'danger',
    icon: HiArrowRight,
  },
};

export const Plans: Story = {
  args: {
    label: 'Seleccionar',
    variant: 'plans',
  },
};

export const Disabled: Story = {
  args: {
    label: 'Unavailable',
    variant: 'primary',
    disabled: true,
  },
};
