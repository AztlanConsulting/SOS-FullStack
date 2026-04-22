import { Text } from '@shared/components/ui/Text';
import ProductPageHero from '@shared/components/layout/ProductPageHero';
import { formatDateEsShort } from '@shared/utils/dateUtils';
import yellowIcon from '@assets/images/yellowIcon.png';
import type { Blog } from '../types/blog.types';

interface Props {
  blog: Blog;
}

const BlogHeader = ({ blog }: Props) => {
  const createdAtLabel = formatDateEsShort(blog.createdAt);
  const updatedAtLabel = formatDateEsShort(blog.updatedAt);

  const heroProduct = {
    imageUrl: blog.imageUrl,
    name: blog.name,
    content: '',
    price: 0,
  };

  return (
    <div className="w-full bg-secondary flex justify-center lg:px-12 xl:px-16">
      <div className="w-5/6 md:w-4/5 lg:w-full lg:max-w-2xl xl:max-w-2xl py-6 md:py-8 flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <img
            src={yellowIcon}
            alt="Logo"
            className="w-7 h-7 md:w-10 md:h-10"
          />
          <Text as="p" variant="caption" className="md:text-base">
            {createdAtLabel}
          </Text>
        </div>

        <ProductPageHero product={heroProduct} />

        <Text as="h1" variant="h2" weight="medium" className="pt-2">
          {blog.name}
        </Text>

        <div className="flex justify-between items-center">
          <Text as="p" variant="small" className="md:text-base">
            Actualizado: {updatedAtLabel}
          </Text>
          <Text as="p" variant="small" className="md:text-base">
            {blog.duration} min
          </Text>
        </div>
      </div>
    </div>
  );
};

export default BlogHeader;
