import React, { useState, useEffect } from 'react';
import emailjs from '@emailjs/browser'
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

  // Fetch project details if not already provided by state
  useEffect(() => {
    if (!projectData.title && state.pId) {
      fetchProjectById(state.pId);
    }
  }, [state.pId]);

  // Check admin role when user changes
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

  if (!projectData.title) {
    return <Loader />;
  }

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
              <p className="font-epilogue font-normal text-[16px] text-[#808191] leading-[26px] text-justify">Номер телефона: {projectData.phoneNumber}</p>
              <p className="font-epilogue font-normal text-[16px] text-[#808191] leading-[26px] text-justify">Электронная почта: {projectData.email}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="mt-10 flex flex-col gap-4">
            <h4 className="font-epilogue font-semibold text-[18px] text-white uppercase">Отправить письмо</h4>
            <select
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              className="p-2 rounded-md border border-gray-300"
            >
              <option value="">Выберите тему</option>
              <option value="Поддержать проект">Поддержать проект</option>
              <option value="Стать волонтером в">Стать волонтером</option>
            </select>
            <textarea
              name="message"
              placeholder="Напишите ваши контактные данные и цель сообщения и с вами свяжутся..."
              value={formData.message}
              onChange={handleChange}
              className="p-2 rounded-md border border-gray-300 h-32"
            />
            <CustomButton
              btnType="submit"
              title="Отправить"
              styles="bg-[#8c6dfd]"
            />
            {formStatus && <p className="mt-2 text-white">{formStatus}</p>}
          </form>

          {/* Admin View for Approved Status */}
          <div>
            {isAdmin && (
              <>
                <CustomButton
                  btnType="button"
                  title={projectData.approved ? 'Подтверждено' : 'Подтвердить'}
                  styles={projectData.approved ? 'bg-[#1dc071] mr-4' : 'bg-[#a8341d] mr-4'}
                  handleClick={() => projectData.approved ? navigate("/bettertogether/home") : handleApproveProject()}
                />
                <CustomButton
                  btnType="button"
                  title={'Удалить'}
                  styles={'bg-[#a8341d]'}
                  handleClick={() => handleDeleteProject()}
                />
              </>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;
