import React from 'react';

const AboutUs = () => {
  return (
    <div >
      <header className="w-full bg-grey-600 text-white py-6">
        <div className="container mx-auto flex justify-center">
          <h1 className="text-3xl font-bold">О Нас</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-10">
        <section className="text-center mb-10">
          <h2 className="text-2xl font-semibold text-white mb-4">Добро пожаловать в нашу компанию!</h2>
          <p className="text-lg text-[#bdbdbd]">
            Мы — команда профессионалов, которая стремится предоставить лучший сервис в нашей области. Наша цель — удовлетворить потребности наших клиентов и превзойти их ожидания.
          </p>
        </section>

        <section className="flex flex-col md:flex-row gap-10">
          <div className="md:w-1/2 p-4 bg-[#919191] rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-4">Наша Миссия</h3>
            <p className="text-gray-700">
              Наша миссия — предоставить качественные решения для наших клиентов и создать долгосрочные партнерские отношения, основанные на доверии и взаимном уважении.
            </p>
          </div>

          <div className="md:w-1/2 p-4 bg-[#919191] rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-4">Наша Команда</h3>
            <p className="text-gray-700">
              Наша команда состоит из опытных специалистов, которые работают над проектами с большой преданностью делу. Мы ценим каждый вклад и работаем вместе для достижения общих целей.
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
