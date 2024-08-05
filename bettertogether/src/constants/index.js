import { createCampaign, dashboard, logout, payment, profile, withdraw } from '../assets';

export const navlinks = [
  {
    name: 'Главная',
    imgUrl: dashboard,
    link: '/bettertogether/home',
  },
  {
    name: 'Отправить запрос',
    imgUrl: createCampaign,
    link: '/bettertogether/suggest-project',
  },
  
  // {
  //   name: 'withdraw',
  //   imgUrl: withdraw,
  //   link: "/bettertogether/home",
  //   disabled: true,
  // },
  {
    name: 'Мои проекты',
    imgUrl: profile,
    link: '/bettertogether/profile',
  },
  {
    name: 'Выйти',
    imgUrl: logout,
    link: '/bettertogether/home',
    // disabled: true,
  },
  {
    name: 'О нас',
    imgUrl: payment,
    link: '/bettertogether/about_us',
    
  },
];