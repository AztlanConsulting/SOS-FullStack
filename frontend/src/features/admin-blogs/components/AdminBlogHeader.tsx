import { Text } from '@/shared/components/ui';
import Search from '@/shared/components/ui/Search';
import { HiPlus } from 'react-icons/hi';
import { Link, useLocation } from 'react-router';
import type { BlogStatsSchema } from '../types/blog.types';

interface Props {
  searchHook: {
    handleSearch: (s: string) => void;
    sortHook: [
      sortOption: string,
      setSortOption: React.Dispatch<React.SetStateAction<string>>,
    ];
  };
  createBlog: () => void;
  blogStats: BlogStatsSchema | undefined;
}

const AdminBlogHeader = ({ searchHook, createBlog, blogStats }: Props) => {
  const { published, drafts } = blogStats ?? {
    published: 0,
    drafts: 0,
    comparison: 0,
  };
  const total = published + drafts;

  return (
    <section className="w-full">
      <div className="flex justify-between">
        <div>
          <Text variant="h1" weight="semibold">
            Blog
          </Text>
          <Text variant="caption">Gestiona y publica tus entradas</Text>
        </div>
        <button
          className="h-fit my-auto flex gap-2 border-2 group pl-1 pr-2 rounded-md color-grey-border hover:bg-secondary hover:border-primary hover:text-primary items-center"
          onClick={createBlog}
        >
          <HiPlus />
          <Text className="group-hover:text-primary">Agregar entrada</Text>
        </button>
      </div>

      <div className="flex w-full justify-between mt-4">
        <div className="flex w-1/2 gap-5 h-fit">
          <Tag label={'Todos'} amount={total} route={'/admin/blogs'} />
          <Tag
            label={'Publicados'}
            amount={published}
            route={'/admin/blogs/publicados'}
          />
          <Tag
            label={'Borrados'}
            amount={drafts}
            route={'/admin/blogs/borrados'}
          />
        </div>
        <div className="h-fit -my-8 w-4/5 flex justify-end">
          <Search searchHook={searchHook} />
        </div>
      </div>
    </section>
  );
};

interface TagProps {
  label: string;
  amount: number;
  route: string;
}

function Tag({ label, amount, route }: TagProps) {
  const path = useLocation().pathname;
  return (
    <Link
      className={`border-1 p-1 px-2 flex rounded-full ${path == route ? 'bg-primary/20 border-primary' : 'bg-base border-base-gray hover:bg-secondary hover:border-primary'} gap-2 group`}
      to={route}
    >
      <Text
        className={`group-hover:text-primary ${path == route ? 'text-dark-yellow' : ''}`}
      >
        {label}
      </Text>
      <p
        className={`rounded-full px-3 ${path == route ? 'bg-white/20' : 'bg-gray-200'}`}
      >
        <Text
          color={`${path == route ? 'text-dark-yellow' : 'text-base-gray'}`}
        >
          {amount}
        </Text>
      </p>
    </Link>
  );
}

export default AdminBlogHeader;
