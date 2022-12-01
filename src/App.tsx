import useWebNotificationApi from './hooks/useWebNotificationApi';
import IncomingCall from './icons/incoming-call-logo.png';

const App = () => {
  const { permission, error, requestPermission, notify } = useWebNotificationApi();

  // Настройки для уведомления о звонке
  const options = {
    // actions: [
    //   { action: 'like', title: 'Ответить на звонок' },
    //   { action: 'reply', title: 'Сбросить' },
    // ],
    body: 'BODY BODY BODY',
    image: IncomingCall,
  };
  console.log(error);
  return (
    <div>
      <p>Доступ: {permission}</p>
      <p>Ошибка: {}</p>
      <button onClick={requestPermission}>Включить уведомления</button>
      <button onClick={() => notify('Вам поступает звонок от 1002!', options)}>
        Отправить уведомление
      </button>
    </div>
  );
};

export default App;
