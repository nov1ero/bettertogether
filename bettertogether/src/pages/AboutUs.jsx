import React, { useState, useEffect } from 'react';
import { useStateContext } from '../context';


const AboutUs = () => {
  const { theme } = useStateContext();
  const [isDarkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (theme === 'light') {
      setDarkMode(false);
    } else if (theme === 'dark') {
      setDarkMode(true);
    }
  }, [theme]);


  return (
    <div >
      <header className={`w-full bg-grey-600 ${isDarkMode ? 'text-white' : 'text-black  '} py-6`}>
        <div className="container mx-auto flex justify-center">
          <h1 className="text-3xl font-bold">О Нас</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-10">
        <section className="text-center mb-10">
          <h2 className={`text-2xl font-semibold ${isDarkMode ? 'text-white' : 'text-black  '} mb-4`}>BetterTogether</h2>
          <p className={`text-lg ${isDarkMode ? 'text-[#bdbdbd]' : 'text-black  '}`}>
            BetterTogether — это уникальная платформа, созданная для того, чтобы стать мостом между волонтерами, инвесторами и социальными проектами в Кыргызстане. Наша цель — объединить усилия тех, кто стремится к позитивным изменениям, с теми, кто готов поддержать их своими ресурсами и временем.
          </p>
        </section>

        <section className="flex flex-col md:flex-row gap-10">
          <div className="md:w-1/2 p-4 bg-[#919191] rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-4">Цель Платформы</h3>
            <p className="text-gray-700">
              На нашей платформе вы найдете информацию о различных социальных проектах, которые нуждаются в поддержке. Мы стремимся создать прозрачную и доступную среду, где каждый может внести свой вклад в развитие общества. Независимо от того, хотите ли вы стать волонтером, ищете финансирование для вашего проекта или желаете поддержать инициативы, которые вам близки, наша платформа предоставит вам все необходимые инструменты.
            </p>
          </div>

          <div className="md:w-1/2 p-4 bg-[#919191] rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-4">Вместе для Будущего</h3>
            <p className="text-gray-700">
              Мы верим, что вместе мы можем сделать мир лучше, начав с нашего родного Кыргызстана. Присоединяйтесь к нам, чтобы создать будущее, полное возможностей и равенства для всех.
            </p>
          </div>
        </section>
      </main>

      <footer className="w-full bg-grey-600 text-white py-6 mt-auto">
        <div className="container mx-auto text-center">
          <p>© 2024 Наша Компания. Все права защищены.</p>
        </div>
      </footer>
    </div>
  );
};

export default AboutUs;
