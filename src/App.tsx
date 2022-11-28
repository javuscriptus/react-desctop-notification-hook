// import { pwaInfo } from 'virtual:pwa-info';
import { useRegisterSW } from 'virtual:pwa-register/react';

import useNotification from './hooks/useNotification';
import SimaLandIcon from './icons/sima-logo.png';

const App = () => {
  const { isActiveNotification, enableNotification, disableNotification, notifyUser } =
    useNotification();

  return (
    <div>
      <button onClick={enableNotification}>Включить уведомления</button>
      <button onClick={() => notifyUser('Вам поступает звонок от 1002!')}>
        Отправить уведомление
      </button>
    </div>
  );
};

export default App;
