import { Text } from '@shared/components/ui/Text';
import type { Blog } from '../types/blog.types';
import { HeaderBack } from '@shared/components/layout/HeaderBack';
import usePurchaseProduct from '@shared/hooks/usePurchaseProduct';
import ProductPageHero from '@shared/components/layout/ProductPageHero';
import ProductSale from '@shared/components/ui/ProductSale';
import { useNavigate } from 'react-router';

interface Props {
  blog: Blog;
}

const BlogContent = ({ blog }: Props) => {
  const navigate = useNavigate();
  const purchaseData = usePurchaseProduct({
    _id: blog._id,
    item: 'blog',
    price: blog.price,
    url: 'blog',
  });

  return (
    <section className="w-full h-screen flex flex-col items-center justify-start">
      <HeaderBack name="Blog" onBack={() => navigate('/blog')} />
      <div className="bg-secondary w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 md:gap-x-16 items-center md:py-8 color-secondary-bg w-full md:mx-auto md:w-4/5 lg:w-full lg:max-w-4xl xl:max-w-5xl">
          <ProductPageHero product={blog} />
          <ProductSale purchaseData={purchaseData} product={blog} />
        </div>
      </div>
      <div className="w-full p py-10 bg-white flex items-center justify-center">
        <Text
          as="p"
          variant="body"
          weight="regular"
          color="text-black"
          className="w-5/6 md:w-4/5 lg:w-full lg:max-w-4xl xl:max-w-5xl"
        >
          {blog.content}
        </Text>
      </div>
    </section>
  );
};

export default BlogContent;
