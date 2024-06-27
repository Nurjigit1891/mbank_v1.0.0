import React, { useEffect, useState } from 'react';
import './Admin.scss';
import {getAllKeys, sendNewKeysToFirebase } from '../../firebase/firebaseConfig';
import CircularProgress from '@mui/material/CircularProgress';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';


const Admin = () => {

  const navigation = useNavigate() ;
  const [keys, setKeys] = useState([]);
  const [inputValue, setInputValue] = useState(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');
  const [allKeys, setAllKeys] = useState([]) ;
  const [usedKeys,setUsedkeys] = useState([]);
  const [availableKeys,setAvailableKeys] = useState([]);
  const [checks,setChecks] = useState([]);


  useEffect(() => {
    const getKeys = async () => {
      try{
        const availableKeys = await getAllKeys("available");
        const used = await getAllKeys("used");
        const checks = await getAllKeys ("checks");

        if (availableKeys) {
          setAvailableKeys(availableKeys);
          console.log("Успешно получено: AVAILABLE");
        }else {
          console.log("Ошибка при получении доступных ключей AVAILABLE")
        }

        if (used) {
          setUsedkeys(used)
          console.log("Успешно получено: USED")
        }else {
          console.log("Ошибка при получении использованных ключей USED")
        }

        if (used && availableKeys) {
          const allKeys = [...used,...availableKeys];
          setAllKeys(allKeys) ;
        }

        if (checks) {
          setChecks(checks)
          console.log("Успешно получено: CHECKS")
          console.log(checks)
        }else {
          console.log("Ошибка при получении использованных чеков CHECKS")
        }


      }catch (error) {
        console.log(error);
      }
    }

    getKeys()
  },[])

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(parseInt(value));
  };

  const outputKeys = async (count) => {
    setLoading(true); // Включение загрузки
    let keyArray = [];

    for (let i = 0; i < count; i++) {
      const keyOriginal = generateApiKeys();
      const date = new Date();
      const formattedDate = {
        day: date.getDate(),
        month: date.getMonth() + 1, // месяцы начинаются с 0
        year: date.getFullYear(),
        hours: date.getHours(),
        minutes: date.getMinutes()
      };

      const formattedDateString = `${formattedDate.day}/${formattedDate.month}/${formattedDate.year} ${formattedDate.hours}:${formattedDate.minutes}`;


      const keyObject = {
        date: formattedDateString,
        keyOriginal,
        status: 1,
      };

      try {
        await sendNewKeysToFirebase(keyObject,"available");
        console.log('key added successfully!');
        keyArray.push(keyObject);
      } catch (error) {
        console.log(error);
        setStatus(`Ошибка при добавлении ключей: ${error}`);
        setLoading(false);
        return; // Прерываем цикл при ошибке
      }
    }
    setKeys(keyArray);
    setStatus(`Ключи успешно добавлены! Всего ключей: ${keyArray.length}`);
    setLoading(false);
  };  

  function generateApiKeys(length = 32) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let key = '';

    for (let i = 0; i < length; i++) {
      // это строка получает рандомную цифру до 16 и по этой числе выбирется буква по индексу
      key += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return key;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue > 0) {
      outputKeys(inputValue);
    }
  };

  const goToBack = () => {
    navigation('/')
  }

  return (
    <div>
      <div 
      className="backIcon"
      onClick={goToBack}
      >
        <ArrowBackIcon />
      </div>
      <div className="admin">
        <form onSubmit={handleSubmit}>
          <input
            type="number"
            min="0"
            step="1"
            placeholder="Введите количество нужных ключей"
            onChange={handleInputChange}
          />
          <button type="submit">Получить уникальный</button>
        </form>

        <div className="outputBlock">
          {loading ? (
            <CircularProgress />
          ) : (
            <div className="write">
              <p>{status}</p>

              <ol>
                {keys.map((element, index) => (
                  <li key={index}>{element.keyOriginal}</li>
                ))}
              </ol>
            </div>
          )}
        </div>

        <div className="keys">
          <div className="keys-text">
            <p>Ключи</p>
          </div>

          <div className="block-keys">
            <div className="allKeys">
              <p>Все ключи ({allKeys ? allKeys.length : ''}шт)</p>

              <div className="data">
                {allKeys.length > 0 ? (
                <ol>
                  {allKeys.map((key,index) => (
                    <li key={index}>{key.keyOriginal}</li>
                  ))}
                </ol>
                ) : (
                  <CircularProgress />
                )}
              </div>
            </div>
            <div className="available">
              <p>Доступные ({availableKeys ? availableKeys.length : ""}шт)</p>

              <div className="data">
                {availableKeys.length > 0 ? (
                <ol>
                  {availableKeys.map((key,index) => (
                    <li key={index}>{key.keyOriginal}</li>
                  ))}
                </ol>
                ) : (
                  <CircularProgress />
                )}
              </div>
            </div>

            <div className="usedKeys">
              <p>Использованные ({usedKeys ? usedKeys.length : ""}шт)</p>

              <div className="data">
                {usedKeys.length > 0 ? (
                <ol>
                  {usedKeys.map((key,index) => (
                    <li key={index}>{key.keyOriginal}</li>
                  ))}
                </ol>
                ) : (
                  <CircularProgress />
                )}
              </div>
            </div>
          </div>

          <div className="checks">
                <h2>Использованные чеки</h2>

                <div className="data">
                  {checks.length > 0 ? (
                    <div>
                      {checks.map((element,index) => (
                        <div key={index}>
                          <p>{element.name}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div></div>
                  )}
                </div>
                
          </div>
        </div>

        </div>
    </div>
  );
};

export default Admin;
