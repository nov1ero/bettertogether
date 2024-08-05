import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';


import { useStateContext } from '../context';
import { money } from '../assets';
import { CustomButton, FormField, Loader } from '../components';
import { checkIfImage } from '../utils';

const SuggestProject = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [ isDarkMode, setDarkMode] = useState(false);
  const { user, suggestProject, theme } = useStateContext();
  const [form, setForm] = useState({
    owner: '',
    title: '',
    description: '',
    phoneNumber: '', 
    email: '',
    image: ''
  });

  console.log("Тема", theme)
  const handleFormFieldChange = (fieldName, e) => {
    setForm({ ...form, [fieldName]: e.target.value })
  }

  useEffect(() => {
    if (theme === 'light') {
      setDarkMode(false);
    } else if (theme === 'dark') {
      setDarkMode(true);
    }
  }, [theme]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log("FORMDATA", form)

    if (!user) {
      alert("Нужно авторизоваться.");
      return;
    }
    checkIfImage(form.image, async (exists) => {
      if(exists) {
        setIsLoading(true)
        await suggestProject(form)
        setIsLoading(false);
        navigate('/home');
      } else {
        alert('Provide valid image URL')
        setForm({ ...form, image: '' });
      }
    })
  }
  const categoryOptions = [
    { value: 'technology', label: 'Technology' },
    { value: 'education', label: 'Education' },
    { value: 'health', label: 'Health' },
    { value: 'other', label: 'Other' }
  ];

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
            labelName="Электроннаяя почта *"
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
          options={categoryOptions} // Pass options for select
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
  )
}

export default SuggestProject