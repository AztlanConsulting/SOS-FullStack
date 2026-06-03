import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useState } from 'react';
import userEvent from '@testing-library/user-event';
import { ResourceModal } from '@/features/resources/components/ResourceModal'; // Adjust paths
import EditResourceModal from '@/features/resources/components/EditResourceModal';
import { ResourceService } from '@/features/resources/services/resourceItem.service';
import type { Resource } from '@/features/resources/types/resource';

// 1. Mock External Services and Utils
vi.mock('@/features/resources/services/resourceItem.service', () => ({
  ResourceService: {
    uploadImage: vi.fn(),
    updateResource: vi.fn(),
  },
}));

vi.mock('@/shared/utils/formatPrice', () => ({
  default: vi.fn((val) => val), // Simple bypass for tests
}));

// 2. Global Browser APIs Setup
global.URL.createObjectURL = vi.fn(() => 'mock-blob-url');

const mockResource: Resource = {
  _id: 'res-789',
  name: 'Mastering Pet Care Workshop',
  type: 'Taller',
  price: 150,
  resourceUrl: 'https://videos.com/taller-1',
  imageUrl: 'https://images.com/cover.jpg',
  emailContent: 'Thank you for purchasing the workshop!',
  content: [{ type: 'text', content: 'Welcome to Chapter 1.' }],
};

// 3. Orchestration Wrapper Component for Testing Integration States
const TestResourceWorkflowContainer = ({
  initialResource,
}: {
  initialResource: Resource;
}) => {
  const [currentResource, setCurrentResource] = useState<Resource | null>(
    initialResource,
  );
  const [isEditing, setIsEditing] = useState(false);

  if (isEditing) {
    return (
      <EditResourceModal
        resource={currentResource}
        cancel={() => setIsEditing(false)}
        close={() => setIsEditing(false)}
        success={() => {
          setIsEditing(false);
          // Mimic state refresh after a successful patch request
          setCurrentResource({
            ...currentResource!,
            name: 'Updated Workshop Title',
            price: 200,
          });
        }}
      />
    );
  }

  return (
    <ResourceModal
      resource={currentResource}
      onClose={vi.fn()}
      setEdit={() => setIsEditing(true)}
    />
  );
};

describe('Resource Feature Integration Workflow', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn().mockResolvedValue({
      blob: vi.fn().mockResolvedValue(new Blob([''], { type: 'image/jpeg' })),
    });
  });

  it('should navigate through full view, edit, update block, and successful save flow', async () => {
    const user = userEvent.setup();
    render(<TestResourceWorkflowContainer initialResource={mockResource} />);

    // ── STEP A: Verify Resource View State ──
    expect(screen.getByText('Detalle del recurso')).toBeTruthy();
    expect(screen.getByText('Mastering Pet Care Workshop')).toBeTruthy();
    expect(screen.getByText('$150 USD')).toBeTruthy();

    // ── STEP B: Transition into Edit Mode ──
    const editButton = screen.getByRole('button', { name: /editar/i });
    await user.click(editButton);

    // Verify modal shifted into edit context
    const titleInput = screen.getByPlaceholderText(
      'Nombre del recurso',
    ) as HTMLInputElement;
    expect(titleInput.value).toBe('Mastering Pet Care Workshop');

    // ── STEP C: Change Inputs & Trigger Validation Handling ──
    // Modify text content inputs
    await user.clear(titleInput);
    await user.type(titleInput, 'Updated Workshop Title');

    const priceInput = screen.getByPlaceholderText('0') as HTMLInputElement;
    await user.clear(priceInput);
    await user.type(priceInput, '200');

    // ── STEP D: Interacting with Content Blocks (Add block dropdown) ──
    const selectDropdown = screen.getByDisplayValue(
      /selecciona el bloque de contenido/i,
    );
    await user.selectOptions(selectDropdown, 'texto');

    // Assert that a new block text field section spawned successfully
    const textareas = screen.getAllByPlaceholderText(
      'Escribe el contenido aquí...',
    );
    expect(textareas.length).toBe(2);
    await user.type(textareas[0], 'Integrated dynamic text block content');

    // ── STEP E: Mock Service Resolution and Submit Form ──
    const updateServiceSpy = vi
      .spyOn(ResourceService, 'updateResource')
      .mockResolvedValue(true);

    const saveButton = screen.getByRole('button', { name: /guardar/i });
    await user.click(saveButton);

    // ── STEP F: Confirm State Change Repopulation after Hook Success Callback ──
    await waitFor(() => {
      expect(updateServiceSpy).toHaveBeenCalled();
    });

    // Validates component flipped back into Read Detail window with updated parameters
    await waitFor(() => {
      expect(screen.getByText('Detalle del recurso')).toBeTruthy();
      expect(screen.getByText('Updated Workshop Title')).toBeTruthy();
      expect(screen.getByText('$200 USD')).toBeTruthy();
    });
  });

  it('should display error messages inside the modal template when submit actions reject', async () => {
    const user = userEvent.setup();
    render(<TestResourceWorkflowContainer initialResource={mockResource} />);

    // Switch to edit window
    await user.click(screen.getByRole('button', { name: /editar/i }));

    // Mock API Crash
    vi.spyOn(ResourceService, 'updateResource').mockRejectedValue(
      new Error('Internal Server Error'),
    );

    const saveButton = screen.getByRole('button', { name: /guardar/i });
    await user.click(saveButton);

    // Verify modal stayed open and displayed fallback notice message
    expect(screen.getByText('Registrando un recurso')).toBeTruthy();
    await waitFor(() => {
      expect(
        screen.getByText('Ocurrió un error al guardar. Intenta de nuevo.'),
      ).toBeTruthy();
    });
  });
});
