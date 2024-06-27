  import React, { useState } from 'react'
  import './Default.scss'
  import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
  import { useNavigate } from 'react-router-dom';
  import CloseIcon from '@mui/icons-material/Close';
  import DoneIcon from '@mui/icons-material/Done';
  import TaskIcon from '@mui/icons-material/Task';
  import ReplayCircleFilledIcon from '@mui/icons-material/ReplayCircleFilled';
  import BookmarksIcon from '@mui/icons-material/Bookmarks';
  import photo from '../../assets/scrw.png'
  import ArrowBackIcon from '@mui/icons-material/ArrowBack';
  import { deleteNewKey, getDefiniteNewKey } from '../../firebase/firebaseConfig';
  import { CircularProgress } from '@mui/material';
  import firebase from 'firebase/compat/app';



  const Default = () => {

    const navigate = useNavigate();
    const [statusLoading,setStatusLoading] = useState(''); // Для вывода результата ключа. Успешно или ошибка
    const [randomNumber, setRandomNumber] = useState(null) ; // Для рандомной цифры!
    const [statusResult,setStatusResult] = useState(false) ; // Для текста "Ключ успешно применен!" или для текста "Ошибка при использовании ключа"
    const [statusBtn, setStatusBtn] = useState(false);//Для кнопки. Будет включен когда инпут для цены не пустой
    const [findKey,setFindKey] = useState(null); // Тут будет найденный ключ если найдется 
    const [loading,setLoading] = useState(false) // для анимации загрузки
    const [dataCheck, setDataCheck] = useState({
      name: '',
      phoneNumber: '',
      price: '',
      dateTime: '' ,
      type: '', 
      key: '', 
    });

    // Функция для отправки назад
    const handleClick = () => {
      navigate('/')
    }

    //Функция для проверки ключа
    const checkKey = async (key) => {
      try {
        // Включается анимация загрузки чтобы дать понять пользователю что страница в обработке
        setLoading(true);

        // Как параметр даем key который ввел пользователь чтобы поискать его в базе
        const data = await getDefiniteNewKey(key,"available");

        // результат поиска
        if (data) {
          // findKey полуает данные найденного ключа
          setFindKey(data); 
          console.log(dataCheck)

          setTimeout(() => {
            deleteNewKey(data, dataCheck )
          },2000)
          console.log(dataCheck)

          //Остановливаем анимацию загрузки
          setLoading(false);

          //Статус изменяем на "успешно"
          setStatusLoading('Ключ успешно применен!');

          //Возвращаем
          return true
        }
        // если ключ не найдется 
        else {
          // findKey остается пустым
          setFindKey(null);

          //Остановливаем анимацию загрузки
          setLoading(false);

          //Статус изменяем на "ошибка"
          setStatusLoading('Ошибка при использовании ключа!');

          //Возвращаем
          return false
        }
      }
      // если будет ошибка при получении ключа 
      catch (error) {
        console.log("При запросе ключа произашло ошибка!");
        console.log(error);
        setStatusLoading('Ошибка при получении ключа с базы! Сделайте скриншот и отправтьте администратору!')
        setLoading(false);
        return false;
      }
    }

    //Проверяет не пусто ли инпут для цены
    function checkValueOfPrice(price) {
      if (price !== 0) {
        setStatusBtn(true);
      } else {
        setStatusBtn(false);
      }
    }

    // Функция которая генерирует случайную цифру для чека
    const generateRandomEightDigitNumber = () => {
      const min = 10000000;
      const max = 99999999;
      return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    // Функция выполняется когда нажимается кнопка "Оплатить"
    const handleSubmit = async (e) => {
      e.preventDefault();
      const name = e.target.elements.name.value;
      const phoneNumber = e.target.elements.phoneNumber.value;
      const price = e.target.elements.price.value;
      const type = e.target.elements.type.value
      const key = e.target.elements.key.value
      const newRandomNumber = generateRandomEightDigitNumber();
      const dateTime = formatDateTime(new Date()); // Форматирование текущей даты и времени
      // Можно добавить дополнительные действия, например, отправку данных на сервер
      console.log(dataCheck)
      
      // checkKey функция которая написано в файле "firebaseConfig.js"
      const resultKey = await checkKey(key); 

      // Проверяется есть ли такой ключ который ввел пользователь
      if (resultKey) {
        // На экран чека выводится данные которые записал пользовател
        setDataCheck({ name, phoneNumber, price, dateTime, type,key});
        setRandomNumber(newRandomNumber);
        //-----------------------------------------------//

        // Результат успешен
        setStatusResult(true);

        //Страница перезагружается после 5 минут
        setTimeout(() => {
          window.location.reload();
        },300000)
      }
      // Если нету такого ключа то результат провален
      else {
        setStatusResult(false);
      }
    }

    // Функция для форматирования даты и времени
    function formatDateTime(dateTime) {
      const options = {
        day: 'numeric',
        month: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      };
      return dateTime.toLocaleDateString('ru-RU', options);
    }



    return (
      <div>
        <div className="upIcon" onClick={handleClick}>
          <ArrowBackIcon className='icon'></ArrowBackIcon>
          <h1>Default</h1>
        </div>

        <div className="container">
        <div className="app">
          <form onSubmit={handleSubmit}>
            <input
              id="name"
              type="text"
              placeholder="Имя пользователя"
              required
            />
            <input
              id="phoneNumber"
              type="text"
              placeholder="Номер телефона"
              required
            />
            <input
              id="price"
              type="text"
              placeholder="Цена"
              onChange={(e) => checkValueOfPrice(e.target.value)}
              required
            />
            <input
              id="type"
              type="text"
              placeholder="Тип оплаты"
              required
            />
            <input
              id="key"
              type="text"
              placeholder="Ключ"
              required
            />

            <button
              type="submit"
              className={statusBtn ? 'on_button' : 'off_button'}
              disabled={!statusBtn}
            >
              Оплатить
            </button>
            <div style={loading ? {display : "block"} : {display: "none"}}>
              <CircularProgress />
            </div>
            <p 
            className='statusLoading'
            style={statusResult ? {color: "green"} : {color: "red"}}
            >{statusLoading}</p>
          </form>
        </div>

          <div className="check">
              <div className="check-block">
                <div className="block-1">
                  {/* <h3>Mbank</h3> */}
                  <div className="img">
                    <img src={photo} alt="" />
                  </div>
                  <CloseIcon />
                </div>
                <div className="block-2">
                  <DoneIcon className='doneIcon' />
                  <p className='success' >Транзакция успешна <br /> проведена</p>
                </div>
                <div className="block-3">
                  <p className='price'>- {dataCheck.price},00 </p>
                  <img src="data:image/png;base64,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" alt="" />
                </div>
                <div className="block-4">
                  <p style={{fontSize: '18px'}}>{dataCheck.type}</p> <br />
                  <p style={{marginTop: '0px'}}>- - - - - - - - - - - - - - - - - - - - - - - - -  </p>
                </div>
                <div className="block-5">
                  <div className='under-block'>
                    <p>Имя получителя</p>
                    <p>{dataCheck.name}</p> {/* Имя пользователя */}
                  </div>
                  {/* <div className='under-block'>
                    <p>Номер телефона</p>
                    <p>{data.phoneNumber}</p> 
                  </div> */}
                  <div className='under-block'> 
                    <p>Оплата со счета</p>
                    <p>103012{randomNumber}</p> {/* Цена оплаты */}
                  </div>
                  <div className='under-block'>
                    <p>Дата операции</p>
                    <p>{dataCheck.dateTime}</p> {/* Дата и время операции */}
                  </div>
                  <div className='under-block'>
                    <p>Номер квитанции</p>
                    <p>P041{randomNumber}</p> {/* Номер квитанции - это статичное значение? */}
                  </div>
                  <p className='line'>- - - - - - - -  - - - - - - - - - - - - - - - -  </p>
                </div>              
                <div className="block-6">
                  <p>{dataCheck.type}. <br /> {dataCheck.phoneNumber}/ {dataCheck.name}// Сумма {dataCheck.price}.00 KGS</p>
                </div>
              </div>
                <div className="iconBlock">
                  <div className="under-block">
                    <TaskIcon className='icon'/>
                    <p>Отправить</p>
                  </div>
                  <div className="under-block">
                    <ReplayCircleFilledIcon className='icon' />
                    <p style={{textAlign: 'center'}}>Повторить <br />платеж</p>
                  </div>
                  <div className="under-block">
                    <BookmarksIcon className='icon' />
                    <p>Создать <br />шаблон</p>
                  </div>
                </div>  
          </div>

        </div>
      </div>
    )
  }

  export default Default
