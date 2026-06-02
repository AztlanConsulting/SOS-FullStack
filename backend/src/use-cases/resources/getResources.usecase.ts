import type { Workshop } from '@domain/models/workshop.model';
import type {
  GetManual,
  ManualResult,
  ManualRepository,
} from '@domain/repositories/manual.repository';
import type {
  GetWorkshop,
  WorkshopRepository,
} from '@domain/repositories/workshop.repository';
import {
  getManualsDB,
  getManualByIdDB,
} from '@use-cases/manuals/getManualsDB.usecase';
import {
  getWorkshopById,
  getWorkshopList,
} from '@use-cases/workshops/getWorkshops.usecase';
import { normalizeContent } from '@utils/content.mapper';

export type ResourceType = 'Taller' | 'Manual';

export type ResourceItem = {
  _id: string;
  name: string;
  type: ResourceType;
  price: number;
  imageUrl: string;
  content: ManualResult['content'];
  resourceUrl: string;
  emailContent?: string;
};

type ResourceQuery = {
  page?: number;
  searchTerm?: string;
  sortOption?: string;
  typeOption?: 'Todos' | ResourceType;
  id?: string;
};

const PAGE_SIZE = 6;

const sorters: Record<
  string,
  (left: ResourceItem, right: ResourceItem) => number
> = {
  'Nombre (A-Z)': (left, right) => left.name.localeCompare(right.name),
  'Nombre (Z-A)': (left, right) => right.name.localeCompare(left.name),
  'Precio: menor a mayor': (left, right) => left.price - right.price,
  'Precio: mayor a menor': (left, right) => right.price - left.price,
};

export async function getResourcesList(
  workshopRepository: WorkshopRepository,
  manualRepository: ManualRepository,
  resourceRequest: ResourceQuery,
): Promise<{ resources: ResourceItem[]; totalResources: number }> {
  const {
    id,
    searchTerm = '',
    sortOption = 'Nombre (A-Z)',
    typeOption = 'Todos',
  } = resourceRequest;

  if (id != null) {
    const resource = await getResourceById(
      workshopRepository,
      manualRepository,
      id,
    );

    if (!resource) {
      return { resources: [], totalResources: 0 };
    }

    return { resources: [resource], totalResources: 1 };
  }

  const [workshopList, manualList] = await Promise.all([
    fetchAllWorkshops(workshopRepository, { searchTerm }),
    fetchAllManuals(manualRepository, { searchTerm }),
  ]);

  const normalizedResources = [...workshopList, ...manualList];
  const filteredResources =
    typeOption === 'Todos'
      ? normalizedResources
      : normalizedResources.filter((resource) => resource.type === typeOption);

  const sortedResources = [...filteredResources].sort(
    sorters[sortOption] ?? sorters['Nombre (A-Z)'],
  );

  const page = resourceRequest.page ?? 0;
  const totalResources = sortedResources.length;
  const resources = sortedResources.slice(
    page * PAGE_SIZE,
    page * PAGE_SIZE + PAGE_SIZE,
  );

  return { resources, totalResources };
}

async function getResourceById(
  workshopRepository: WorkshopRepository,
  manualRepository: ManualRepository,
  id: string,
): Promise<ResourceItem | null> {
  const workshop = await getWorkshopById(workshopRepository, id);
  if (workshop) {
    return normalizeWorkshopResource(workshop);
  }

  const manual = await getManualByIdDB(manualRepository, id);
  if (manual) {
    return normalizeManualResource(manual);
  }

  return null;
}

async function fetchAllWorkshops(
  workshopRepository: WorkshopRepository,
  workshopRequest: GetWorkshop,
): Promise<ResourceItem[]> {
  const firstPage = await getWorkshopList(workshopRepository, {
    ...workshopRequest,
    page: 0,
    sortOption: 'Nombre (A-Z)',
  });

  const totalPages = Math.ceil(firstPage.totalWorkshops / PAGE_SIZE);
  const remainingPages = Array.from(
    { length: Math.max(totalPages - 1, 0) },
    (_, index) => index + 1,
  );

  const remainingResults = await Promise.all(
    remainingPages.map((page) =>
      getWorkshopList(workshopRepository, {
        ...workshopRequest,
        page,
        sortOption: 'Nombre (A-Z)',
      }),
    ),
  );

  return [firstPage, ...remainingResults].flatMap((result) =>
    result.workshops.map(normalizeWorkshopResource),
  );
}

async function fetchAllManuals(
  manualRepository: ManualRepository,
  manualRequest: GetManual,
): Promise<ResourceItem[]> {
  const firstPage = await getManualsDB(manualRepository, {
    ...manualRequest,
    page: 0,
    sortOption: 'Nombre (A-Z)',
  });

  const totalPages = Math.ceil(firstPage.totalManuals / PAGE_SIZE);
  const remainingPages = Array.from(
    { length: Math.max(totalPages - 1, 0) },
    (_, index) => index + 1,
  );

  const remainingResults = await Promise.all(
    remainingPages.map((page) =>
      getManualsDB(manualRepository, {
        ...manualRequest,
        page,
        sortOption: 'Nombre (A-Z)',
      }),
    ),
  );

  return [firstPage, ...remainingResults].flatMap((result) =>
    result.manuals.map(normalizeManualResource),
  );
}

function normalizeWorkshopResource(workshop: Workshop): ResourceItem {
  const plainWorkshop =
    typeof (workshop as Workshop & { toObject?: () => Workshop }).toObject ===
    'function'
      ? (workshop as Workshop & { toObject: () => Workshop }).toObject()
      : workshop;

  return {
    _id: String(plainWorkshop._id ?? ''),
    name: plainWorkshop.name,
    type: 'Taller',
    price: typeof plainWorkshop.price === 'number' ? plainWorkshop.price : 0,
    imageUrl: plainWorkshop.imageUrl ?? '',
    content: normalizeContent(plainWorkshop.content),
    resourceUrl: plainWorkshop.videoUrl ?? '',
    emailContent: plainWorkshop.emailContent ?? '',
  };
}

function normalizeManualResource(manual: ManualResult): ResourceItem {
  const plainManual =
    typeof (manual as ManualResult & { toObject?: () => ManualResult })
      .toObject === 'function'
      ? (manual as ManualResult & { toObject: () => ManualResult }).toObject()
      : manual;

  return {
    _id: String((plainManual as ManualResult & { _id?: unknown })._id ?? ''),
    name: plainManual.name,
    type: 'Manual',
    price: typeof plainManual.price === 'number' ? plainManual.price : 0,
    imageUrl: plainManual.imageUrl ?? '',
    content: normalizeContent(plainManual.content),
    resourceUrl: plainManual.pdfUrl ?? '',
    emailContent: plainManual.emailContent ?? '',
  };
}
