import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const Footer = () => {
  const { t } = useTranslation();
  const currentHash = window.location.hash;

  const isActive = (path) => {
    return `#${path}` === currentHash;
  };

  return (
    <footer className="lg:container mx-auto p-4 border-t border-[#b8b9bd]">
      {/* <p className="p-5">Footer</p> */}
      <div className="flex gap-6">
        <Link
          to="/"
          className={isActive('/') ? 'underline underline-offset-8' : ''}
        >
          {t('footer.links.home')}
        </Link>
        <Link
          to="/history"
          className={isActive('/history') ? 'underline underline-offset-8' : ''}
        >
          {t('footer.links.history')}
        </Link>
        <Link
          to="/seed-tester"
          className={
            isActive('/seed-tester') ? 'underline underline-offset-8' : ''
          }
        >
          {t('footer.links.seed_tester')}
        </Link>
      </div>
    </footer>
  );
};

export default Footer;
