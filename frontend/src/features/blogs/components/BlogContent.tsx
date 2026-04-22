import { Text } from '@shared/components/ui/Text';
import type { Blog } from '../types/blog.types';
import { HeaderBack } from '@shared/components/layout/HeaderBack';
import ProductPageHero from '@shared/components/layout/ProductPageHero';
import { formatDateEsShort } from '@shared/utils/dateUtils';
import yellowIcon from '@assets/images/yellowIcon.png';
import { useNavigate } from 'react-router';

interface Props {
  blog: Blog;
}

const BlogContent = ({ blog }: Props) => {
  const navigate = useNavigate();
  const createdAtLabel = formatDateEsShort(blog.createdAt);
  const updatedAtLabel = formatDateEsShort(blog.updatedAt);

  const heroProduct = {
    imageUrl: blog.imageUrl,
    name: blog.name,
    content: '',
    price: 0,
  };

  return (
    <section className="w-full min-h-screen flex flex-col">
      <HeaderBack name="Blog" onBack={() => navigate('/blog')} />

      {/* HEADER / HERO */}
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

      {/* CONTENT */}
      <div className="w-full bg-white flex justify-center py-6 md:py-10">
        <div className="w-5/6 md:w-4/5 lg:w-full lg:max-w-2xl xl:max-w-2xl flex flex-col gap-6">
          {blog.content.map((block, idx) => {
            if (block.type.toLowerCase() === 'image') {
              return (
                <img
                  key={`${block.type}-${idx}`}
                  src={block.content}
                  alt={`Blog content ${idx + 1}`}
                  className="w-full rounded-lg object-cover"
                />
              );
            }

            return (
              <Text
                key={`${block.type}-${idx}`}
                as="p"
                variant="h3"
                weight="regular"
              >
                {block.content}
              </Text>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default BlogContent;
