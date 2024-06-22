import React, { useState } from 'react';
import { motion } from 'framer-motion';
import './Home.scss';
import { Link, useNavigate } from 'react-router-dom';
import CloseIcon from '@mui/icons-material/Close';

const Home = () => {
  const navigate = useNavigate();
  const [statusChooseBlock, setStatusChooseBlock] = useState(false);

  const actionForChooseBlock = (action) => {
    if (action) {
      setStatusChooseBlock(true)
    }
    else {
      setStatusChooseBlock(false)
    }
  }

  return (
    <div>
      <div className="home">
        <div className="img-hacker">
          <img src="https://t3.ftcdn.net/jpg/03/12/75/62/360_F_312756263_LUbawIl0tPk7WiIRhj2TvFy0OyRfA0KM.jpg" alt="" />
        </div>

        <div className="info-block">
          <h1>Отказ от ответственности</h1>
          <hr />
          <p>
            Этот сайт создан исключительно в развлекательных целях.
            Мы гарантируем 100% анонимность при использовании нашего
            сайта. Ваши данные останутся конфиденциальными и не будут
            переданы третьим лицам. Однако, если вы сами каким-то
            образом раскроете свои данные,
            мы не несем ответственности за вашу безопасность.
            Будьте осторожны и свяжитесь с администрацией через
            если у вас возникнут вопросы
          </p>
        </div>

        <div className="button-block">
          <button onClick={() => {actionForChooseBlock(true)}}>
            Прочитал и беру ответственность
          </button>
        </div>

        <motion.div
          className={statusChooseBlock ? "choose-block" : "choose-block-off"}
          style={{ display: statusChooseBlock ? 'block' : 'none' }}
        >
          <CloseIcon className='closeIcon' onClick={() => {actionForChooseBlock (false)}} />
          <h2>Выбери нужную категорию</h2>
          <div className="links">
            <Link to='/mobile'>
              Mobile
            </Link>
            <Link to='/default'>
              Defalut
            </Link>
            <Link to='/default'>
              Food
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Home;
