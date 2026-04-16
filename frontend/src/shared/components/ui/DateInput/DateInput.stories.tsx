import type { Meta, StoryObj } from '@storybook/react';
import { DateInput } from './DateInput';

const meta: Meta<typeof DateInput> = {
  title: 'UI/DateInput',
  component: DateInput,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof DateInput>;

export const Default: Story = {
  args: {
    id: 'test-date',
    label: 'Fecha de extravío',
  },
};
