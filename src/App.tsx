import useNotification from './hooks/useNotification';
import IncomingCall from './icons/incoming-call-logo.png';

const App = () => {
  const { permission, error, requestPermission, notify } = useNotification();

  // Настройки для уведомления о звонке
  const options = {
    // actions: [
    //   { action: 'like', title: 'Ответить на звонок' },
    //   { action: 'reply', title: 'Сбросить' },
    // ],
    body: 'SIMA-LAND SIP',
    image: IncomingCall,
  };
  console.log(error);
  return (
    <div>
      <span>Доступ: {permission}</span>
      <span>Ошибка: {}</span>
      <button onClick={requestPermission}>Включить уведомления</button>
      <button onClick={() => notify('Вам поступает звонок от 1002!', options)}>
        Отправить уведомление
      </button>
    </div>
  );
};

export default App;
