import type { Blog } from '@/features/blog/types/blog.types';
import { ResourceService } from '@/features/resources/services/resourceItem.service';
import type { BlogDependencies } from '../types/blog.types';

async function updateBlog(
  dependencies: BlogDependencies,
  newErrors: Record<string, string>,
  onSuccess?: () => void,
) {
  const { blog, coverImage, blocks, title, setErrors, editBlog } = dependencies;

  try {
    if (Object.keys(newErrors).length > 0) {
      console.log(newErrors);
      throw newErrors;
    }
    let coverUrl = blog?.imageUrl;
    if (coverImage) coverUrl = await ResourceService.uploadImage(coverImage);

    const serialised = await Promise.all(
      blocks.map(async (block) => {
        if (block.kind === 'imagen' && block.file?.name != 'defaultImage.jpg') {
          const imageUrl = await ResourceService.uploadImage(block.file!);
          return { type: 'image' as const, content: imageUrl }; // value → content
        } else if (block.kind == 'imagen') {
          return {
            type: 'image' as const,
            // @ts-ignore
            content: block.originalString ?? '',
          };
        }
        return { type: 'text' as const, content: block.value }; // value → content
      }),
    );

    const newObj: Partial<Blog> = {
      name: title.trim(),
      imageUrl: coverUrl,
      content: serialised,
    };

    const changeset = Object.fromEntries(
      (Object.entries(newObj) as [keyof Blog, Blog[keyof Blog]][]).filter(
        ([key, value]) => {
          if (key == 'content') {
            const sortKeysDeep = (val: unknown): unknown => {
              if (Array.isArray(val)) return val.map(sortKeysDeep);
              if (val !== null && typeof val === 'object') {
                return Object.keys(val)
                  .sort()
                  .reduce(
                    (acc, k) => {
                      acc[k] = sortKeysDeep(
                        (val as Record<string, unknown>)[k],
                      );
                      return acc;
                    },
                    {} as Record<string, unknown>,
                  );
              }
              return val;
            };

            const normalize = (val: unknown) =>
              JSON.stringify(sortKeysDeep(val));

            const isEqual = normalize(blog?.[key]) === normalize(value);
            return !isEqual;
          }
          return blog?.[key] != value;
        },
      ),
    ) as Partial<Blog>;

    if (Object.keys(changeset).length < 1) {
      setErrors((prev) => ({ ...prev, general: 'No hay cambios' }));
      return;
    }

    await editBlog({
      ...(blog ? { _id: blog._id } : {}),
      ...changeset,
    });

    onSuccess?.();
  } catch (error) {
    if (error && typeof error === 'object' && !('message' in error)) {
      // thrown validation errors object — already set via setErrors above
      return;
    }
    setErrors({ general: 'Ocurrió un error al guardar. Intenta de nuevo.' });
  }
}

export default updateBlog;
