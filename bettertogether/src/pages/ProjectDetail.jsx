import React, { useState, useEffect } from 'react';
import emailjs from '@emailjs/browser';
import { useLocation, useNavigate } from 'react-router-dom';
import { useStateContext } from '../context';
import { CustomButton, Loader } from '../components';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebaseConfig';

const ProjectDetail = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { getProjectDetails, user, approveProject, deleteProject, theme } = useStateContext();

  const [isLoading, setIsLoading] = useState(false);
  const [ownerData, setOwnerData] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userName, setUserName] = useState(null);
  const [projectData, setProjectData] = useState(state || {});
  const [formData, setFormData] = useState({ subject: '', message: '' });
  const [formStatus, setFormStatus] = useState('');
  const [isDarkMode, setDarkMode] = useState(false);

  // Function to fetch project by pId
  const fetchProjectById = async (pId) => {
    try {
      const project = await getProjectDetails(pId);
      setProjectData(project);
    } catch (error) {
      console.error('Error fetching project by ID:', error);
    }
  };

  // Function to check admin role
  const checkAdminRole = async () => {
    if (user) {
      try {
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);
        
        if (userDoc.exists()) {
          const userData = userDoc.data();
          
          if (userData.roles && userData.roles.includes('admin')) {
            setIsAdmin(true);
          }
          if (userData.displayName) {
            setUserName(userData.displayName);
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    }
  };

  // Ensure hooks are called consistently
  useEffect(() => {
    emailjs.init('oj4-K8TY-KWvvUOxC');
  }, []);

  useEffect(() => {
    if (!projectData.title && state.pId) {
      fetchProjectById(state.pId);
    }
  }, [state.pId, projectData.title]);

  useEffect(() => {
    checkAdminRole();
  }, [user]);

  useEffect(() => {
    if (theme === 'light') {
      setDarkMode(false);
    } else if (theme === 'dark') {
      setDarkMode(true);
    }
  }, [theme]);

  useEffect(() => {
    const fetchOwnerData = async () => {
      if (projectData.owner && projectData.owner.id) {
        try {
          const ownerDocRef = doc(db, 'users', projectData.owner.id);
          const ownerDoc = await getDoc(ownerDocRef);
          if (ownerDoc.exists()) {
            setOwnerData(ownerDoc.data());
          } else {
            console.log("Owner document not found");
          }
        } catch (error) {
          console.error("Error fetching owner data:", error);
        }
      } else if (projectData.owner) {
        // Assume owner is already a plain object if not a DocumentReference
        setOwnerData(projectData.owner);
      }
    };
  
    fetchOwnerData();
  }, [projectData.owner]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!user) {
      alert("Нужно авторизоваться.");
      return;
    }

    // Your EmailJS service ID, template ID, and Public Key
    const serviceId = 'service_85cd3ym';
    const templateId = 'template_382jih7';
    const publicKey = 'oj4-K8TY-KWvvUOxC';

    // Create a new object that contains dynamic template params
    const templateParams = {
      to_email:  ownerData?.email,
      from_name: userName,
      subject: formData.subject,
      to_name: ownerData?.displayName,
      project: projectData.title,
      message: formData.message,
    };

    // Send the email using EmailJS
    emailjs.send(serviceId, templateId, templateParams, publicKey)
      .then((response) => {
        console.log('Email sent successfully!', response);
        setUserName(null);
        setFormData({ subject: '', message: '' })
      })
      .catch((error) => {
        console.error('Error sending email:', error);
      });
  }

  // Handle project approval
  const handleApproveProject = async () => {
    const result = await approveProject(state.pId);
    if (result) {
      setProjectData(prevState => ({
        ...prevState,
        approved: true,
      }));
      window.location.reload(); // Перезагрузка страницы
    }
  };

  const handleDeleteProject = async () => {
    if (window.confirm("Вы уверены что хотите удалить этот проект?")) {
      await deleteProject(state.pId);
      navigate("/bettertogether/home"); // Redirect after deletion
    }
  };

  if (!projectData.title) {
    return <Loader />;
  }

  return (
    <div>
      {isLoading && <Loader />}

      <div className="w-full flex md:flex-row flex-col mt-10 gap-[30px]">
        <div className="flex-1 flex-col">
          <img src={projectData.image} alt="campaign" className="w-full h-[410px] object-cover rounded-xl" />
          <div className="relative w-full h-[5px]  mt-8">
            <div>
              <h1 className={`font-epilogue font-bold text-[24px] ${isDarkMode ? 'text-white' : 'text-black  '} uppercase`}>{projectData.title}</h1>
            </div>
          </div>
        </div>

        <div className="flex md:w-[150px] w-full flex-wrap justify-between gap-[30px]">
        </div>
      </div>

      <div className="mt-[60px] flex lg:flex-row flex-col gap-5">
        <div className="flex-[2] flex flex-col gap-[40px]">
          <div>
            <h4 className={`font-epilogue font-semibold text-[18px] ${isDarkMode ? 'text-white' : 'text-black  '} uppercase`}>Основатель</h4>
            <div className="mt-[20px] flex flex-row items-center flex-wrap gap-[14px]">
              <div className="w-[52px] h-[52px] flex items-center justify-center rounded-full bg-[#2c2f32] cursor-pointer">
                <img src={ownerData?.photoURL || ''} alt="user" className="w-[100%] h-[100%] object-fill rounded-full" />
              </div>
              <div>
                <h4 className={`font-epilogue font-semibold text-[14px] ${isDarkMode ? 'text-white' : 'text-black  '} break-all`}>{ownerData?.displayName || ''}</h4>
                <p className="mt-[4px] font-epilogue font-normal text-[12px] text-[#808191]">10 Проектов</p>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-epilogue font-semibold text-[18px] text-white uppercase">Описание</h4>
            <div className="mt-[20px]">
              <p className="font-epilogue font-normal text-[16px] text-[#808191] leading-[26px] text-justify">{projectData.description}</p>
            </div>
          </div>
          <div>
            <h4 className="font-epilogue font-semibold text-[18px] text-white uppercase">Контактные данные</h4>
            <div className="mt-[20px]">
              <p className="font-epilogue font-normal text-[16px] text-[#808191] leading-[26px] text-justify">Номер телефона: {projectData.phone}</p>
            </div>
          </div>
          <div>
            <h4 className="font-epilogue font-semibold text-[18px] text-white uppercase">Ресурсы</h4>
            <div className="mt-[20px]">
              <p className="font-epilogue font-normal text-[16px] text-[#808191] leading-[26px] text-justify">{projectData.resources}</p>
            </div>
          </div>
        </div>
        <div className="flex-1">
          <h4 className={`font-epilogue font-semibold text-[18px] ${isDarkMode ? 'text-white' : 'text-black  '} uppercase`}>Отправить сообщение основателю</h4>
          <form className="mt-[20px] w-full flex flex-col gap-[30px]" onSubmit={handleSubmit}>
            <div className="flex flex-col">
              <label htmlFor="subject" className={`font-epilogue font-medium text-[14px] leading-[22px] ${isDarkMode ? 'text-white' : 'text-black  '} mb-[10px]`}>Тема</label>
              <input
                type="text"
                id="subject"
                name="subject"
                placeholder="Тема"
                className={`py-[10px] sm:px-[20px] px-[15px] outline-none border-[1px] border-[#3a3a43] bg-transparent font-epilogue text-[14px] leading-[22px] ${isDarkMode ? 'text-white' : 'text-black  '} placeholder:text-[#4b5264] rounded-[10px]`}
                value={formData.subject}
                onChange={handleChange}
                required
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="message" className={`font-epilogue font-medium text-[14px] leading-[22px] ${isDarkMode ? 'text-white' : 'text-black  '} mb-[10px]`}>Сообщение</label>
              <textarea
                id="message"
                name="message"
                placeholder="Сообщение"
                rows="10"
                className={`py-[10px] sm:px-[20px] px-[15px] outline-none border-[1px] border-[#3a3a43] bg-transparent font-epilogue text-[14px] leading-[22px] ${isDarkMode ? 'text-white' : 'text-black  '} placeholder:text-[#4b5264] rounded-[10px]`}
                value={formData.message}
                onChange={handleChange}
                required
              />
            </div>
            <div className="flex justify-center items-center">
              <button
                type="submit"
                className="py-[10px] px-[20px] bg-[#1dc071] rounded-[10px] text-[16px] text-white font-semibold leading-[26px]"
              >
                Отправить сообщение
              </button>
            </div>
            {formStatus && <p className="text-center mt-[10px] text-red-500">{formStatus}</p>}
          </form>

          {isAdmin && (
            <div className="mt-[20px]">
              <h4 className={`font-epilogue font-semibold text-[18px] ${isDarkMode ? 'text-white' : 'text-black  '} uppercase`}>Администрирование проекта</h4>
              <div className="mt-[10px] flex flex-col gap-[10px]">
                {!projectData.approved && (
                  <CustomButton
                    btnType="button"
                    title="Одобрить проект"
                    styles="bg-green-500"
                    handleClick={handleApproveProject}
                  />
                )}
                <CustomButton
                  btnType="button"
                  title="Удалить проект"
                  styles="bg-red-500"
                  handleClick={handleDeleteProject}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;
