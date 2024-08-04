import { createCampaign, dashboard, logout, payment, profile, withdraw } from '../assets';

export const navlinks = [
  {
    name: 'Главная',
    imgUrl: dashboard,
    link: '/home',
  },
  {
    name: 'Отправить запрос',
    imgUrl: createCampaign,
    link: '/suggest-project',
  },
  
  // {
  //   name: 'withdraw',
  //   imgUrl: withdraw,
  //   link: '/home',
  //   disabled: true,
  // },
  {
    name: 'Мои проекты',
    imgUrl: profile,
    link: '/profile',
  },
  {
    name: 'Выйти',
    imgUrl: logout,
    link: '/home',
    // disabled: true,
  },
  {
    name: 'О нас',
    imgUrl: payment,
    link: '/about_us',
    
  },
];