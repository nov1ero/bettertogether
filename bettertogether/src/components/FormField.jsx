import React, {useState, useEffect} from 'react'
import { useStateContext } from '../context';


const FormField = ({ labelName, placeholder, inputType, isTextArea, value, handleChange, options }) => {
  const [ isDarkMode, setDarkMode] = useState(false);
  const { theme } = useStateContext(); 

  useEffect(() => {
    if (theme === 'light') {
      setDarkMode(false);
    } else if (theme === 'dark') {
      setDarkMode(true);
    }
  }, [theme]);

  return (
    <label className="flex-1 w-full flex flex-col">
      {labelName && (
        <span className={`font-epilogue font-medium text-[14px] leading-[22px] ${isDarkMode ? 'text-[#808191]' : 'text-[#26262b]'} mb-[10px]`}>{labelName}</span>
      )}
      {isTextArea ? (
        <textarea 
          required
          value={value}
          onChange={handleChange}
          rows={10}
          placeholder={placeholder}
          className={`py-[15px] sm:px-[25px] px-[15px] outline-none border-[1px] ${isDarkMode ? 'border-[#3a3a43]' : 'border-[#515157]'} ${isDarkMode ? 'bg-transparent' : 'bg-[#f1f0f2]'} ${isDarkMode ? 'text-white' : 'text-black'}  font-epilogue text-[14px] placeholder:text-[#4b5264] rounded-[10px] sm:min-w-[300px]`}
        />
      ) : inputType === 'select' ? (
        <select
          required
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          className={`py-[15px] sm:px-[25px] px-[15px] outline-none border-[1px] ${isDarkMode ? 'border-[#3a3a43]' : 'border-[##515157]'} ${isDarkMode ? 'bg-[#1c1c24]' : 'bg-[#f1f0f2]'} ${isDarkMode ? 'text-white' : 'text-black'} font-epilogue text-[14px] placeholder:text-[#4b5264] rounded-[10px] sm:min-w-[300px]`}
        >
          <option value="" disabled selected hidden>Выберите категорию</option>
          {options.map((option, index) => (
            <option key={index} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : (
        <input 
          required
          value={value}
          onChange={handleChange}
          type={inputType}
          step="0.1"
          placeholder={placeholder}
          className={`py-[15px] sm:px-[25px] px-[15px] outline-none border-[1px] border-[#3a3a43] ${isDarkMode ? 'border-[#3a3a43]' : 'border-[##515157]'} ${isDarkMode ? 'bg-transparent' : 'bg-[#f1f0f2]'} ${isDarkMode ? 'text-white' : 'text-black'} font-epilogue  text-[14px] placeholder:text-[#4b5264] rounded-[10px] sm:min-w-[300px]`}
        />
      )}
    </label>
  )
}


export default FormField