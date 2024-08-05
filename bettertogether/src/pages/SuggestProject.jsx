import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStateContext } from '../context';
import { CustomButton, FormField, Loader } from '../components';
import { checkIfImage } from '../utils';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import emailjs from '@emailjs/browser'

const SuggestProject = () => {
  const navigate = useNavigate();
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDarkMode, setDarkMode] = useState(false);
  const [userName, setUserName] = useState();
  const [userEmail, setUserEmail] = useState();
  const { user, suggestProject, theme, getSingleCategory } = useStateContext();
  const [form, setForm] = useState({
    owner: '',
    title: '',
    description: '',
    phoneNumber: '', 
    email: '',
    image: '',
    category: ''
  });
  

  const handleFormFieldChange = (fieldName, e) => {
    setForm({ ...form, [fieldName]: e.target.value });
  };

  useEffect(() => {
    const fetchCategory = async () => {
      const categoryData = await getSingleCategory();
      if (categoryData) {
        const options = Object.keys(categoryData)
          .filter(key => key !== 'id')
          .map(key => ({
            value: key,
            label: categoryData[key]
          }))
          .sort((a, b) => (a.label === 'Другое' ? 1 : b.label === 'Другое' ? -1 : 0)); // Ensure 'Другое' is last
        setCategoryOptions(options);
      }
    };

    fetchCategory();
  }, [getSingleCategory]);

  useEffect(() => {
    if (theme === 'light') {
      setDarkMode(false);
    } else if (theme === 'dark') {
      setDarkMode(true);
    }
  }, [theme]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      alert("Нужно авторизоваться.");
      return;
    }
    
    checkIfImage(form.image, async (exists) => {
      if (exists) {
        setIsLoading(true);
        await suggestProject(form);
        setIsLoading(false);
        navigate('/bettertogether/home');
      } else {
        alert('Provide valid image URL');
        setForm({ ...form, image: '' });
      }
    });

    // Your EmailJS service ID, template ID, and Public Key
    const serviceId = 'service_85cd3ym';
    const templateId = 'template_zicautf';
    const publicKey = 'oj4-K8TY-KWvvUOxC';

    // Create a new object that contains dynamic template params
    const templateParams = {
      to_email:  userEmail,
      from_name: "BetterTogether",
      project_title: form.title,
      subject: "Запрос успешно отправлен",
      to_name: userName,
      message: 'Подождите некоторое время и ваш проект одобрят админы. Вам могут присылать письма пользователи, которые хотят оказать какую-либо поддержку вашему проекту. Чтобы не пропускать письма от них, пометьте это письмо как "Не спам"',
    };

    // Send the email using EmailJS
    emailjs.send(serviceId, templateId, templateParams, publicKey)
      .then((response) => {
        console.log('Email sent successfully!', response);
        setUserName(null);
        alert("Вам на почту пришло письмо. \n\n Проверьте папку спам, если не нашли его.");
      })
      .catch((error) => {
        console.error('Error sending email:', error);
      });
  };

  const checkUser = async () => {
    if (user) {
      try {
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);
        
        if (userDoc.exists()) {
          const userData = userDoc.data();

          if (userData.displayName) {
            setUserName(userData.displayName);
          }
          
          if (userData.email) {
            setUserEmail(userData.email);
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    }
  };

  useEffect(() => {
    checkUser();
  }, [user]);
  useEffect(() => {
    emailjs.init('oj4-K8TY-KWvvUOxC');
  }, []);

  return (
    <div className={`flex justify-center items-center flex-col rounded-[10px] sm:p-10 p-4 ${isDarkMode ? 'bg-[#1c1c24]' : 'bg-[#e6e6e6]'} `}>
      {isLoading && <Loader />}
      <div className={`flex justify-center items-center p-[16px] sm:min-w-[380px] ${isDarkMode ? 'bg-[#1c1c24]' : 'bg-[#f5f5f5]'} rounded-[10px]`}>
        <h1 className={`font-epilogue font-bold sm:text-[25px] text-[18px] leading-[38px] ${isDarkMode ? 'text-white' : 'text-slate-950'} `}>Отправить Запрос</h1>
      </div>

      <form onSubmit={handleSubmit} className="w-full mt-[65px] flex flex-col gap-[30px]">
        <div className="flex flex-wrap gap-[40px]">
          <FormField 
            labelName="Название Проекта *"
            placeholder=" Название"
            inputType="text"
            value={form.title}
            handleChange={(e) => handleFormFieldChange('title', e)}
          />
          <FormField 
            labelName="Описание проекта *"
            placeholder="Описание"
            isTextArea
            value={form.description}
            handleChange={(e) => handleFormFieldChange('description', e)}
          />
        </div>

        <FormField 
          labelName="Номер телефона *"
          placeholder="+996 (ххх) хх-хх-хх"
          inputType="text"
          value={form.phoneNumber}
          handleChange={(e) => handleFormFieldChange('phoneNumber', e)}
        />

        <div className="flex flex-wrap gap-[40px]">
          <FormField 
            labelName="Электронная почта *"
            placeholder="Эл. почта"
            inputType="text"
            value={form.email}
            handleChange={(e) => handleFormFieldChange('email', e)}
          />
          <FormField 
            labelName="Категория *"
            inputType="select"
            placeholder="Выберите категорию"
            value={form.category}
            handleChange={(e) => handleFormFieldChange('category', e)}
            options={categoryOptions} // Передача опций для select
          />
        </div>

        <FormField 
          labelName="Фото Проекта *"
          placeholder="Вставьте ссылку на фото"
          inputType="url"
          value={form.image}
          handleChange={(e) => handleFormFieldChange('image', e)}
        />

        <div className="flex justify-center items-center mt-[40px]">
          <CustomButton 
            btnType="submit"
            title="Отправить запрос"
            styles="bg-[#1dc071]"
          />
        </div>
      </form>
    </div>
  );
};

export default SuggestProject;