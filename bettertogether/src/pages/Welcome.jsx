import React, { useState, useEffect } from 'react';
import { useStateContext } from '../context';
import { Navigate, useNavigate } from 'react-router-dom';

const WelcomePage = () => {
  const { theme } = useStateContext();
  const [isDarkMode, setDarkMode] = useState(false);

  const navigate = useNavigate();

  const handleNavigateHome = () => {
    navigate("/home"); // Замените "/home" на ваш маршрут для главной страницы
  };

  useEffect(() => {
    if (theme === 'light') {
      setDarkMode(false);
    } else if (theme === 'dark') {
      setDarkMode(true);
    }
  }, [theme]);

  return (
    <div className="min-h-screen flex flex-col">
      <header className="w-full bg-gray-600 text-white py-6">
        <div className="container mx-auto flex justify-center">
          <h1 className="text-3xl font-bold">Добро пожаловать</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-10 flex-grow">
        <section className="text-center mb-10">
          <h2 className={`text-2xl font-semibold ${isDarkMode ? 'text-white' : 'text-black  '} mb-4`}>Добро пожаловать в BetterTogether!</h2>
          <p className={`text-lg ${isDarkMode ? 'text-[#bdbdbd]' : 'text-black  '}`}>
            Наша платформа - это ваш путь к достижению значимых результатов в Кыргызстане. Независимо от того, хотите ли вы стать волонтером, получить финансирование для проекта или поддержать инициативы, которые находят у вас отклик, BetterTogether предлагает все необходимое, чтобы внести свой вклад в позитивные изменения. Присоединяйтесь к нам в построении будущего, полного возможностей и равенства для всех. Вместе мы сможем создать лучший мир, начав прямо здесь и прямо сейчас.
          </p>
        </section>

        <section className="text-center">
          <button
            onClick={handleNavigateHome}
            className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-lg hover:bg-blue-700"
          >
            Перейти на главную
          </button>
        </section>
      </main>

      <footer className="w-full bg-gray-600 text-white py-6">
        <div className="container mx-auto text-center">
          <p>© 2024 Ваша Компания. Все права защищены.</p>
        </div>
      </footer>
    </div>
  );
};

export default WelcomePage;
