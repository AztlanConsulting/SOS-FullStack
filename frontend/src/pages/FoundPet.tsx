import Header from '../shared/components/layout/Header';
import Footer from '../shared/components/layout/Footer';
import {PetLocationSection} from '@features/found-pet/components/FoundLocation';
import { usePetReportForm } from '@features/users/hooks/usePetReportForm';
import FoundInfo from '@features/found-pet/components/FoundInfo';
import { ContactInfoSection } from '@features/found-pet/components/ContactInfoSection';



const CreditsPage = () => {
    const { formData, errors, updateFormData, handleNext } =
    usePetReportForm({});
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow pt-[72px] lg:pt-0">
        <FoundInfo/>
        <PetLocationSection formData={formData} updateForm={updateFormData} />
        <ContactInfoSection formData={formData} updateForm={updateFormData} />
      </main>
      <Footer />
    </div>
  );
};

export default CreditsPage;

