import React, { useState } from 'react'
import './Admin.scss'

const Admin = () => {

    const [keys,setKeys] = useState([]) ;

    function generateApiKeys (length = 16) {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let key = '' ;
        
        for (let i = 0; i < characters.length; i++) {
            // это строка получает рандомную цифру до 16 и по этой числе выбирется буква по индексу
            key += characters.charAt(Math.floor(Math.random() * characters.length)); 
        }
        return key
    }



  return (
    <div>
      <div className="admin">
        <form>
            <input type="text" />
            {/* <button onClick={}> */}
                Получить уникальный 
            {/* </button> */}
        </form>
      </div>
    </div>
  )
}

export default Admin
