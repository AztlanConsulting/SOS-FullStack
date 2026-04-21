import { Button } from '@shared/components/ui/Button/Button';
import { Text } from '@shared/components/ui/Text';
import { useNavigate } from 'react-router';
import type { Blog } from '../types/blog.types';

const BlogCard = ({ blog }: { blog: Blog }) => {
  const navigate = useNavigate();
  return (
    <div
      key={blog._id}
      className="bg-white rounded-lg color-grey-border w-full flex flex-col h-full"
    >
      <img
        src={blog.imageUrl}
        alt={blog.name}
        className="rounded-t-lg w-full h-40 object-cover"
      />
      <Text
        as="p"
        variant="body"
        weight="medium"
        color="text-black"
        className="pl-4 py-4 color-grey-border-top flex-grow"
      >
        {blog.name}
      </Text>
      <div className="w-full flex justify-between align-items">
        <Text
          as="p"
          variant="body"
          weight="regular"
          color="text-black"
          className="text-left pl-4 pb-4"
        >
          Precio
        </Text>
        <Text
          as="p"
          variant="body"
          weight="regular"
          color="text-black"
          className="text-right pr-4 pb-4"
        >
          $ {blog.name}
        </Text>
      </div>
      <div className="w-full flex flex-col items-center justify-center py-5 color-grey-border-top">
        <Button
          label="Ver"
          variant="plans"
          onClick={() => navigate(`/blog/${blog._id}`, { state: { blog } })}
        />
      </div>
    </div>
  );
};

export default BlogCard;
