import type { Meta, StoryObj } from '@storybook/react';
import { PetPhotosSection } from './PetPhotosSection';

const meta: Meta<typeof PetPhotosSection> = {
  title: 'Features/Pets/PetPhotosSection',
  component: PetPhotosSection,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof PetPhotosSection>;

export const Default: Story = {
  render: () => (
    <div className="bg-gray-50 min-h-screen pt-10">
      <PetPhotosSection />
    </div>
  ),
};
