import Header from '../shared/components/layout/Header';
import Footer from '../shared/components/layout/Footer';
import { SearchForm } from '@/features/members-only/components/SearchForm';

const SearchFormPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow pt-[72px] lg:pt-0">
        <SearchForm />
        <Footer />
      </main>
    </div>
  );
};

export default SearchFormPage;
