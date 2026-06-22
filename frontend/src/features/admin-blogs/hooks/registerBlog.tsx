import type { Blog } from '@/features/blog/types/blog.types';
import { ResourceService } from '@/features/resources/services/resourceItem.service';
import type { BlogDependencies } from '../types/blog.types';
import createBlog from '../service/creaetBlog.service';

async function registerBlog(
  dependencies: BlogDependencies,
  newErrors: Record<string, string>,
  onSuccess?: () => void,
) {
  const { blog, coverImage, blocks, setErrors } = dependencies;

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

    const newObj: Blog = {
      name: blog.name.trim(),
      imageUrl: coverUrl,
      content: serialised,
      active: true,
      duration: blog.duration,
    };

    await createBlog(newObj);

    console.log('Success!');
    onSuccess?.();
  } catch (error) {
    if (error && typeof error === 'object' && !('message' in error)) {
      // thrown validation errors object — already set via setErrors above
      return;
    }
    setErrors({ general: 'Ocurrió un error al guardar. Intenta de nuevo.' });
  }
}

export default registerBlog;
