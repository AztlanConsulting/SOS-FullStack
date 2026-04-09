import { MenuIcon } from './icons';

const Header = () => {
  return (
    <header className="bg-white border-b border-[#EFEFF0] px-4 py-[17px]">
      <div className="max-w-[382px] mx-auto flex items-center justify-between relative h-11">
        <img
          src="/1 81.png"
          alt="Logo"
          className="w-10 h-10 absolute left-[17px] top-1"
        />

        <button className="absolute right-0 top-0 p-3 rounded-[228px] hover:bg-light-gray transition-colors">
          <MenuIcon className="w-5 h-[10.5px]" />
        </button>
      </div>
    </header>
  );
};

export default Header;
