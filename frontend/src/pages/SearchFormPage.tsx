import Header from '../shared/components/layout/Header';
import Footer from '../shared/components/layout/Footer';
import { SearchForm } from '@/features/members-only/components/form/SearchForm';

const SearchFormPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header accentBg="color-purple-bg" socialBg="color-purple-bg" />
      <main className="flex-grow pt-[72px] lg:pt-0">
        <SearchForm />
        <Footer bg="color-purple-bg" />
      </main>
    </div>
  );
};

export default SearchFormPage;
