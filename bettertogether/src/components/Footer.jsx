import React from 'react';

const Footer = () => {
  return (
    <footer className="w-full bg-gray-800 text-white py-6 flex flex-col items-center">
      <div className="container mx-auto text-center">
        <p className="text-sm">
          &copy; {new Date().getFullYear()} BetterTogether. All rights reserved.
        </p>
        <div className="mt-4">
          {/* <p>Адрес: Кыргызстан, 720005, г.Бишкек, пер.Кубанский, д.63</p>
          <p>Телефон: +996 (312) 97 55 11, +996 (770) 11 55 11</p> */}
          <p>Email: <a href="mailto:dobro@apake.kg" className="text-blue-400">bettertogether598@gmail.com</a></p>
        </div>
        {/* <div className="flex justify-center mt-4 space-x-4">
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-blue-400">
            Twitter
          </a>
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-blue-600">
            Facebook
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-pink-500">
            Instagram
          </a>
        </div> */}
      </div>
    </footer>
  );
};

export default Footer;
