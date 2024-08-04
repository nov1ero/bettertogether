import React from 'react';
import { Navigate, useNavigate } from 'react-router-dom';

const WelcomePage = () => {
  const navigate = useNavigate();

  const handleNavigateHome = () => {
    navigate('/'); // Замените '/home' на ваш маршрут для главной страницы
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="w-full bg-gray-600 text-white py-6">
        <div className="container mx-auto flex justify-center">
          <h1 className="text-3xl font-bold">Добро пожаловать</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-10 flex-grow">
        <section className="text-center mb-10">
          <h2 className="text-2xl font-semibold text-white mb-4">Добро пожаловать на наш сайт!</h2>
          <p className="text-lg text-[#bdbdbd]">
            Мы рады видеть вас на нашем сайте. Здесь вы найдете множество интересных материалов и возможностей.
          </p>
        </section>

        <section className="text-center">
          <button
            onClick={handleNavigateHome}
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-lg hover:bg-blue-700"
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
