import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';


import { useStateContext } from '../context';
import { money } from '../assets';
import { CustomButton, FormField, Loader } from '../components';
import { checkIfImage } from '../utils';

const SuggestProject = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { user, suggestProject } = useStateContext();
  const [form, setForm] = useState({
    owner: '',
    title: '',
    description: '',
    phoneNumber: '', 
    email: '',
    image: ''
  });

  const handleFormFieldChange = (fieldName, e) => {
    setForm({ ...form, [fieldName]: e.target.value })
  }

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
    <div className="bg-[#1c1c24] flex justify-center items-center flex-col rounded-[10px] sm:p-10 p-4">
      {isLoading && <Loader />}
      <div className="flex justify-center items-center p-[16px] sm:min-w-[380px] bg-[#3a3a43] rounded-[10px]">
        <h1 className="font-epilogue font-bold sm:text-[25px] text-[18px] leading-[38px] text-white">Отправить Запрос</h1>
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
            placeholder="описание"
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