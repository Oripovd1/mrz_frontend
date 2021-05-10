import React, { useState } from 'react'
import { Button, message, Typography, Upload } from 'antd'
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons'
import './App.scss'
const { Title } = Typography

function App() {
  const [loading, setLoading] = useState()
  const [imageUrl, setImageUrl] = useState()
  const [data, setData] = useState(null)

  function getBase64(img, callback) {
    const reader = new FileReader()
    reader.addEventListener('load', () => callback(reader.result))
    reader.readAsDataURL(img)
  }

  function beforeUpload(file) {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG file!')
    }
    const isLt2M = file.size / 1024 / 1024 < 2
    if (!isLt2M) {
      message.error('Image must smaller than 2MB!')
    }
    return isJpgOrPng && isLt2M
  }

  const handleChange = (info) => {
    if (info.file.status === 'uploading') {
      setLoading(true)
      return
    }

    let formdata = new FormData()
    formdata.append('image', info.file.originFileObj, '2021-05-07 14.36.46.jpg')

    let requestOptions = {
      method: 'POST',
      body: formdata,
      redirect: 'follow',
    }

    fetch('https://mrz-service.herokuapp.com/upload', requestOptions)
      .then((response) => response.json())
      .then((result) => {
        getBase64(info.file.originFileObj, (imageUrl) => {
          setImageUrl(imageUrl)
          setLoading(false)
        })
        setData(result.fields)
        console.log(result)
      })
      .catch((error) => console.log('error', error))
  }
  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Загрузить паспорт</div>
    </div>
  )

  return (
    <div className='App'>
      <Title level={3}>Данные паспорта</Title>
      <div className='upload'>
        <Upload
          name='avatar'
          listType='picture-card'
          className='avatar-uploader'
          showUploadList={false}
          beforeUpload={beforeUpload}
          onChange={handleChange}
        >
          {imageUrl ? (
            <img src={imageUrl} alt='avatar' style={{ width: '100%' }} />
          ) : (
            uploadButton
          )}
        </Upload>
      </div>
      <div className='card'>
        <Title level={4}>Личные данные</Title>
        <ul>
          <li>
            <b>Имя</b>
            <span>{data?.firstName}</span>
          </li>
          <li>
            <b>Фамилия</b>
            <span>{data?.lastName}</span>
          </li>
          <li>
            <b>Отчество</b>
            <span>{data?.nationality}</span>
          </li>
          <li>
            <b>Место рождения</b>
            <span>{data?.issuingState}</span>
          </li>
          <li>
            <b>Дата рождения</b>
            <span>{data?.birthDate.split('')}</span>
          </li>
          <li>
            <b>Пол</b>
            <span>{data?.sex}</span>
          </li>
        </ul>
      </div>

      <div className='card'>
        <Title level={4}>Паспортные данные</Title>
        <ul>
          <li>
            <b>Серия паспорта</b>
            <span>{data?.documentNumber.slice(0, 2)}</span>
          </li>
          <li>
            <b>Номер паспорта</b>
            <span>{data?.documentNumber}</span>
          </li>
          <li>
            <b>Срок действия</b>
            <span>{data?.expirationDate}</span>
          </li>
        </ul>
      </div>

      <Button size='large' type='primary' className='button'>
        Продолжить
      </Button>
    </div>
  )
}

export default App
