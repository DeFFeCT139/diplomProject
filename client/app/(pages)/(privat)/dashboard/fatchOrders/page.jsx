'use client'

import { Card, message, Tour } from 'antd';
import style from '../css/page.module.css'
import { Html5QrcodeScanner, Html5QrcodeScanType, Html5QrcodeSupportedFormats } from "html5-qrcode";
import { useEffect, useState } from "react";
import axios from 'axios';
import Title from 'antd/es/typography/Title';
import { useTour } from '@/app/store/store';
import { useSession } from 'next-auth/react';

export default function Home() {

  const [state, setState] = useState(null)
  const { data: userData } = useSession();
  const [open, setOpen] = useState(false);
  const setTour = useTour(state => state.setTour)
  const [render, setRender] = useState(false)
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    setTour(setOpen)
    if (state === null && render === true) {
      addQrScaner()
    }
  }, [state, render])

  const addQrScaner = async () => {
    let scaner = new Html5QrcodeScanner('render', {
      aspectRatio: 1.0,
      supportedScanTypes: [
        Html5QrcodeScanType.SCAN_TYPE_CAMERA
      ],
      formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE],
      showTorchButtonIfSupported: false,
      qrbox: {
        width: 200, height: 200
      },
      fps: 30,
    })
    scaner.render((result) => {
      let data = JSON.parse(result)
      if (data.code && data.code === 'pochta') {
        setState(data.id)
        scaner.clear()
      }
    })
  }

  const addPaqckege = async () => {
    await axios.post('/api/orders', {
      idOrders: state,
      userData
    }).then(function (response) {
      if (response.status === 200) {
        messageApi.info({
          type: 'warning',
          content: response.data
        });
      }
    })
    setState(null)
  }

  const openQRscaner = () => {
    setRender(true)
  }
  const steps = [
    {
      title: 'Приём посылок',
      description: 'Страница Приём посылок, в ней осуществляеться приём посылок, посредству сканирования QR кода на посылке',
      target: null,
    }
  ];


  return (
    <div className="">
      {contextHolder}
      <Title level={2}>Приём посылок</Title>
      <div id='renderblock' className={style.qrInner}>
        {state !== null ?
          <div className={style.block}>
            <Card variant="borderless" style={{ width: '100%', backgroundColor: '#eeeeee', }}>
              <strong>Посылка {state}</strong>
            </Card>
            <button onClick={addPaqckege}>Принять</button>
          </div> : render ?
            <div className={style.qrBlock} id="render"></div> :
            <div className={style.block}>
              <button onClick={openQRscaner}>Начать</button>
            </div>
        }
      </div>
      <Tour open={open} onClose={() => setOpen(false)} steps={steps} />
    </div>
  );
}
