import React, { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebaseConfig'; // Import Firestore instance

import { tagType } from '../assets';
import { useStateContext } from '../context';

const FundCard = ({
  owner,
  title,
  description,
  phoneNumber,
  email,
  image,
  approved,
  category,
  handleClick,
}) => {
  const [isAdmin, setIsAdmin] = useState(false); // State for user role
  const [loading, setLoading] = useState(true); // Loading state
  const [ownerData, setOwnerData] = useState(null); // State for owner data
  const [ isDarkMode, setDarkMode] = useState(false);
  const { user, theme } = useStateContext();

  useEffect(() => {
    const fetchUserRole = async () => {
      if (user) {
        try {
          const userDocRef = doc(db, 'users', user.uid);
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            const userData = userDoc.data();
            if (userData.roles && userData.roles.includes('admin')) {
              setIsAdmin(true);
            }
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
      setLoading(false); 
    };

    fetchUserRole();
  }, [user]);

  console.log("USer", user)

  useEffect(() => {
    const fetchOwnerData = async () => {
      if (owner && owner.id) { // Check if owner is a valid DocumentReference
        try {
          const ownerDocRef = doc(db, 'users', owner.id);
          const ownerDoc = await getDoc(ownerDocRef);
          if (ownerDoc.exists()) {
            setOwnerData(ownerDoc.data());
          } else {
            console.log("Owner document not found");
          }
        } catch (error) {
          console.error("Error fetching owner data:", error);
        }
      } else {
        setOwnerData(owner); // Assume `owner` is already a plain object if not a DocumentReference
      }
    };

    fetchOwnerData();
  }, [owner]);

  useEffect(() => {
    if (theme === 'light') {
      setDarkMode(false);
    } else if (theme === 'dark') {
      setDarkMode(true);
    }
  }, [theme]);

  if (loading) return <p>Загрузка...</p>; 

  const statusColor = approved ? '#1dc071' : '#a8341d';

  return (
    <div className={`sm:w-[288px] w-full rounded-[15px] ${isDarkMode ? 'bg-[#1c1c24]' : 'bg-[#e6e6e6]'} cursor-pointer" onClick={handleClick}`}>
      <div className="flex justify-center mt-[7px] mr-[7px] ml-[7px]">
        <img src={image} alt="fund" className="w-full h-[158px] object-cover rounded-[15px]" />
      </div>

      <div className="flex flex-col p-4">
        <div className="flex flex-row items-center mb-[18px]">
          <img src={tagType} alt="tag" className="w-[17px] h-[17px] object-contain" />
          <p className="ml-[12px] mt-[2px] font-epilogue font-medium text-[12px] text-[#808191]">{category}</p>
        </div>

        <div className="block">
          <h3 className={`font-epilogue font-semibold text-[20px] ${isDarkMode ? 'text-white' : 'text-dark'} text-left leading-[26px] truncate`}>{title}</h3>
          <p className={`mt-[5px] font-epilogue font-normal ${isDarkMode ? 'text-[#808191]' : 'text-[#404040]'} text-left leading-[18px] truncate`}>{description}</p>
        </div>

        <div className="flex justify-between flex-wrap mt-[15px] gap-2">
          <div className="flex flex-col">
            <h4 className={`font-epilogue font-semibold text-[14px] ${isDarkMode ? 'text-[#b2b3bd]' : 'text-[#262626]'} leading-[22px]`}>Номер телефона: {phoneNumber}</h4>
            <p className={`mt-[3px] font-epilogue font-normal text-[12px] leading-[18px] ${isDarkMode ? 'text-[#808191]' : 'text-[#404040]'} sm:max-w-[120px] truncate`}>Эл.почта: {email}</p>
          </div>
          {isAdmin && (
            <div className="flex flex-col">
              <h4 className="font-epilogue font-semibold text-[14px] leading-[22px]" style={{ color: statusColor }}>
                {approved ? "Подтверждено" : "Не подтверждено"}
              </h4>
            </div>
          )}
        </div>

        <div className="flex items-center mt-[20px] gap-[12px]">
          <div className="w-[40px] h-[40px] rounded-full flex justify-center items-center bg-[#13131a]">
            <img src={ownerData?.photoURL || ''} alt="user" className="w-[100%] h-[100%] rounded-full object-fill" />
          </div>
          <p className="flex-1 font-epilogue font-normal text-[12px] text-[#808191] truncate"><span className="text-[#b2b3bd]">{ownerData?.displayName || ''}</span></p>
        </div>
      </div>
    </div>
  );
};

export default FundCard;
