import axios from "axios"
import 'dotenv/config';


export const sendSMS = async (sms, number) => {
    console.log( `Bearer ${process.env.API_KEY_MTS}`)
    await axios.post('https://api.exolve.ru/messaging/v1/SendSMS',{
        number: "79584966487",
        destination: number,
        text: sms
    }, 
    {
        headers: {
            Authorization: `Bearer ${process.env.API_KEY_MTS}`
        }
    }).then(response => {
        console.log("Успех:", response.data);
      })
      .catch(error => {
        console.error("Ошибка:", error.response?.data || error.message);
      });
}
