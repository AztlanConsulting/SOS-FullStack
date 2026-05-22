import { render, screen } from '@testing-library/react';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import MembersOnlyContent from '@features/members-only/components/MembersOnlyContent';
import type { MembersOnly } from '@features/members-only/types/membersOnly.types';

vi.mock('@shared/components/layout/HeaderBack', () => ({
  HeaderBack: ({ name }: { name: string }) => (
    <div data-testid="header-back">{name}</div>
  ),
}));

vi.mock('@features/members-only/components/MembersOnlyHeader', () => ({
  default: ({ membersOnly }: { membersOnly: { name: string } }) => (
    <div data-testid="members-only-header">{membersOnly.name}</div>
  ),
}));

const MOCK_MEMBERS_ONLY: MembersOnly = {
  _id: '1',
  name: 'Guía Completa',
  duration: 20,
  content: 'Primer párrafo.\n\nSegundo párrafo.\n\nTercer párrafo.',
  imageUrl: '/img.jpg',
  pdfUrl: '/pdf.pdf',
  createdAt: '2024-06-15T00:00:00Z',
  updatedAt: '2024-06-20T00:00:00Z',
};

describe('MembersOnlyContent', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders HeaderBack with "Contenido Exclusivo"', () => {
    render(<MembersOnlyContent membersOnly={MOCK_MEMBERS_ONLY} />);

    expect(screen.getByTestId('header-back')).toBeDefined();
    expect(screen.getByText('Contenido Exclusivo')).toBeDefined();
  });

  test('renders MembersOnlyHeader with the card name', () => {
    render(<MembersOnlyContent membersOnly={MOCK_MEMBERS_ONLY} />);

    expect(screen.getByTestId('members-only-header')).toBeDefined();
    expect(screen.getByText('Guía Completa')).toBeDefined();
  });

  test('splits content by double newline into paragraphs', () => {
    render(<MembersOnlyContent membersOnly={MOCK_MEMBERS_ONLY} />);

    expect(screen.getByText('Primer párrafo.')).toBeDefined();
    expect(screen.getByText('Segundo párrafo.')).toBeDefined();
    expect(screen.getByText('Tercer párrafo.')).toBeDefined();
  });

  test('renders single paragraph when content has no line breaks', () => {
    const singlePara = { ...MOCK_MEMBERS_ONLY, content: 'Solo un párrafo.' };

    render(<MembersOnlyContent membersOnly={singlePara} />);

    expect(screen.getByText('Solo un párrafo.')).toBeDefined();
    expect(screen.queryByText('Primer párrafo.')).toBeNull();
  });

  test('renders empty section when content is empty', () => {
    const emptyContent = { ...MOCK_MEMBERS_ONLY, content: '' };

    render(<MembersOnlyContent membersOnly={emptyContent} />);

    expect(screen.getByTestId('header-back')).toBeDefined();
    expect(screen.getByTestId('members-only-header')).toBeDefined();
  });
});
