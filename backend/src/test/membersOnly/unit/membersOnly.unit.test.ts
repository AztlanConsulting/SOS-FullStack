import { MembersOnlyModel } from '@domain/models/membersOnly.model';
import { MembersOnlyDataAccess } from '@infrastructure/data-access/membersOnly.data-access';

jest.mock('@domain/models/membersOnly.model');

describe('membersOnly data access unit tests', () => {
  const mockItem = {
    name: 'Guia de mascotas',
    duration: 30,
    content: 'Contenido del recurso',
    imageUrl: 'https://example.com/image.png',
    pdfUrl: 'https://example.com/file.pdf',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  /**
   * getMembersOnly — SUCCESS
   * Returns a paginated, sorted list from the database.
   */
  test('getMembersOnly returns list of items', async () => {
    (MembersOnlyModel.find as jest.Mock).mockReturnValue({
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      sort: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValue([mockItem, mockItem]),
    });

    const result = await MembersOnlyDataAccess.getMembersOnly({
      page: 0,
      searchTerm: '',
      sortOption: 'Nombre (A-Z)',
    });

    expect(MembersOnlyModel.find).toHaveBeenCalledTimes(1);
    expect(result).toEqual([mockItem, mockItem]);
  });

  /**
   * getMembersOnly — EMPTY RESULT
   * Returns an empty array when no documents match.
   */
  test('getMembersOnly returns empty array when no items exist', async () => {
    (MembersOnlyModel.find as jest.Mock).mockReturnValue({
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      sort: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValue([]),
    });

    const result = await MembersOnlyDataAccess.getMembersOnly({ page: 0 });

    expect(result).toEqual([]);
  });

  /**
   * getMembersOnly — ERROR
   * Propagates database errors to the caller.
   */
  test('getMembersOnly throws on database failure', async () => {
    (MembersOnlyModel.find as jest.Mock).mockReturnValue({
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      sort: jest.fn().mockReturnThis(),
      exec: jest.fn().mockRejectedValue(new Error('Database error')),
    });

    await expect(
      MembersOnlyDataAccess.getMembersOnly({ page: 0 }),
    ).rejects.toThrow('Database error');
  });

  /**
   * getMembersOnlyById — SUCCESS
   * Returns the document when the id exists.
   */
  test('getMembersOnlyById returns item when found', async () => {
    (MembersOnlyModel.findById as jest.Mock).mockReturnValue({
      exec: jest.fn().mockResolvedValue(mockItem),
    });

    const result = await MembersOnlyDataAccess.getMembersOnlyById('some-id');

    expect(MembersOnlyModel.findById).toHaveBeenCalledWith('some-id');
    expect(result).toEqual(mockItem);
  });

  /**
   * getMembersOnlyById — NOT FOUND
   * Returns null when no document matches the id.
   */
  test('getMembersOnlyById returns null when not found', async () => {
    (MembersOnlyModel.findById as jest.Mock).mockReturnValue({
      exec: jest.fn().mockResolvedValue(null),
    });

    const result =
      await MembersOnlyDataAccess.getMembersOnlyById('nonexistent-id');

    expect(result).toBeNull();
  });

  /**
   * getMembersOnlyById — ERROR
   * Propagates database errors to the caller.
   */
  test('getMembersOnlyById throws on database failure', async () => {
    (MembersOnlyModel.findById as jest.Mock).mockReturnValue({
      exec: jest.fn().mockRejectedValue(new Error('Database error')),
    });

    await expect(
      MembersOnlyDataAccess.getMembersOnlyById('some-id'),
    ).rejects.toThrow('Database error');
  });

  /**
   * getTotalMembersOnly — SUCCESS
   * Returns the correct document count matching the query.
   */
  test('getTotalMembersOnly returns total count', async () => {
    (MembersOnlyModel.countDocuments as jest.Mock).mockResolvedValue(25);

    const result = await MembersOnlyDataAccess.getTotalMembersOnly({
      searchTerm: '',
    });

    expect(result).toBe(25);
  });

  /**
   * getTotalMembersOnly — EMPTY
   * Returns 0 when no documents are in the collection.
   */
  test('getTotalMembersOnly returns 0 when collection is empty', async () => {
    (MembersOnlyModel.countDocuments as jest.Mock).mockResolvedValue(0);

    const result = await MembersOnlyDataAccess.getTotalMembersOnly({
      searchTerm: '',
    });

    expect(result).toBe(0);
  });

  /**
   * createMembersOnly — SUCCESS
   * Creates a document and returns its plain object representation.
   */
  test('createMembersOnly creates and returns the new item', async () => {
    const mockCreated = { ...mockItem, toObject: () => mockItem };
    (MembersOnlyModel.create as jest.Mock).mockResolvedValue(mockCreated);

    const result = await MembersOnlyDataAccess.createMembersOnly(mockItem);

    expect(MembersOnlyModel.create).toHaveBeenCalledWith(mockItem);
    expect(result).toEqual(mockItem);
  });

  /**
   * createMembersOnly — ERROR
   * Propagates database errors to the caller.
   */
  test('createMembersOnly throws on database failure', async () => {
    (MembersOnlyModel.create as jest.Mock).mockRejectedValue(
      new Error('Database error'),
    );

    await expect(
      MembersOnlyDataAccess.createMembersOnly(mockItem),
    ).rejects.toThrow('Database error');
  });
});
