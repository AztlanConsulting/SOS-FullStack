import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { TextArea } from './TextArea';

const meta: Meta<typeof TextArea> = {
  title: 'UI/TextArea',
  component: TextArea,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof TextArea>;

const DefaultTextAreaRender = (args: any) => {
  const [value, setValue] = useState('');
  return (
    <TextArea
      {...args}
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  );
};

export const Default: Story = {
  render: DefaultTextAreaRender,
  args: {
    id: 'test-textarea',
    label: 'Descripción adicional',
    placeholder: 'Escribe los detalles aquí...',
    maxLength: 200,
  },
};
