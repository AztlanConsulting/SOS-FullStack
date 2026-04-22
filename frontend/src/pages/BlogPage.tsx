import BlogListSection from '@features/blog/components/BlogsListSection';
import Footer from '@shared/components/layout/Footer';
import Header from '@shared/components/layout/Header';
import HeroSection from '@shared/components/layout/HeroSection';
import blogHero from '@assets/images/blog-hero.jpg';

const BlogsPage = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main className='max-md:pt-[80.67px] pt-0"'>
        <HeroSection
          bg="bg-white"
          title={'Blog'}
          image={blogHero}
          content={`En nuestro blog encontrarás información, consejos y recursos para prevenir y actuar ante la pérdida de una mascota.`}
        />
        <BlogListSection />
      </main>
      <Footer />
    </div>
  );
};

export default BlogsPage;
