import { useEffect, useState } from 'react';

import SimaLandIcon from '../icons/sima-logo.png';

const useNotification = () => {
  const [isActiveNotification, setIsActiveNotification] = useState(false);

  const notifyUser = async (
    notificationText = 'Спасибо что включили уведомления',
    options = {
      // actions: [
      //   { action: 'like', title: 'Like' },
      //   { action: 'reply', title: 'Reply' },
      // ],
      body: 'SIMA-LAND SIP',
      image: SimaLandIcon,
    },
  ) => {
    if (!('Notification' in window)) {
      alert('Браузер не поддерживает уведомления');
    } else if (Notification.permission === 'granted') {
      const notification = new Notification(notificationText, options);
    } else if (
      Notification.permission === 'denied' ||
      Notification.permission === 'default'
    ) {
      Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
          const notification = new Notification(notificationText, options);
          console.log(
            '🚀 ➡️ file: useNotification.ts ➡️ line 30 ➡️ Notification.requestPermission ➡️ notification',
            notification,
          );
        }
      });
    }
    // else if ('serviceWorker' in navigator) {
    //   // First we need to register our service worker
    //   navigator.serviceWorker
    //     .register('serviceWorker.js', { scope: './' })
    //     .then(async () => {
    //       //... check if notifications are allowed
    //       // ... define notificationsProperties with actions
    //       const serviceWorkerRegistration = navigator.serviceWorker.ready;
    //       // This will show the notification with the actions
    //       (
    //         await // This will show the notification with the actions
    //         serviceWorkerRegistration
    //       ).showNotification('Stop Working', options);
    //     });
    // }
  };

  const enableNotification = async () => {
    await notifyUser().then(() => {
      setIsActiveNotification(true);
    });
  };

  const disableNotification = () => {
    setIsActiveNotification(false);
  };

  return {
    isActiveNotification,
    enableNotification,
    disableNotification,
    notifyUser,
  };
};

export default useNotification;
