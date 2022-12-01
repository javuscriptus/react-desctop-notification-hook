/**
 * Notification API Docs:
 * https://developer.mozilla.org/en-US/docs/Web/API/Notification
 */
import React from 'react';

/**
 * Состояние хука "useNotification" (управляется NotificationReducer).
 */
interface State {
  permission: null | NotificationPermission;
  error: null | Error;
}

/**
 * Действие передано в NotificationReducer.
 */
type Action = Partial<State>;

type NotificationReducer = (prevState: State, action: Action) => State;

/**
 * Предотвращает обновление состояния размонтированного компонента.
 */
function useSafeDispatch(
  dispatch: React.Dispatch<React.ReducerAction<NotificationReducer>>,
) {
  const mounted = React.useRef(false);

  React.useLayoutEffect(() => {
    mounted.current = true;

    return () => {
      mounted.current = false;
    };
  }, []);

  return React.useCallback(
    (action: Action) => {
      if (mounted.current) dispatch(action);
    },
    [dispatch],
  );
}

/**
 * True, если код выполняется на сервере.
 */
const isServer = typeof window === 'undefined';

/**
 * True, если поддерживается Web Notification API.
 */
const isSupported = !isServer && 'Notification' in window;

interface useWebNotificationApiType {
  /**
   * Статус разрешения для отображения веб-уведомлений.
   * default - начальное
   * denied - отключенные
   * granted - включенные
   */
  permission: null | NotificationPermission; // 'default' | 'denied' | 'granted'
  /**
   * Любая ошибка, возникшая при инициализации уведомлений.
   */
  error: null | Error;
  /**
   * Запрашивает разрешение на отображение веб-уведомлений.
   */
  requestPermission: () => Promise<void>;
  /**
   * Запускает веб-уведомление.
   *
   * Примечание: Сигнатура функции соответствует конструктору веб-уведомлений.
   * Смотрите документацию MDN для получения дополнительной информации:
   * https://developer.mozilla.org/en-US/docs/Web/API/Notification
   */
  notify: (
    title: Notification['title'],
    options?: NotificationOptions,
  ) => null | Notification;
}

export function useWebNotificationApi(): useWebNotificationApiType {
  const [{ permission, error }, setState] = React.useReducer<NotificationReducer>(
    (prevState, action) => ({ ...prevState, ...action }),
    {
      permission: isSupported ? Notification.permission : null,
      error: !isSupported
        ? new Error('This browser does not support web notifications.')
        : null,
    },
  );

  const safeSetState = useSafeDispatch(setState);

  // Функция запроса доступа к уведомлениям
  const requestPermission = React.useCallback(async () => {
    try {
      // Если браузер не поддерживает уведомления то отмена
      if (!isSupported || permission !== 'default') return;

      // Запрашиваем доступ к уведомлениям
      const notificationPermission = await Notification.requestPermission();

      // Обновляет статус разрешения и устраняет все ошибки.
      safeSetState({
        permission: notificationPermission,
        error: null,
      });
    } catch {
      // Меняем статус на тот что вернула функция
      Notification.requestPermission((notificationPermission) => {
        // Обновляем статус разрешения и устраняем все ошибки.
        safeSetState({
          permission: notificationPermission,
          error: null,
        });
      });
    }
  }, [permission]);

  // Функция отправки уведомления которая отработает только в том случае если есть разрешение на уведомления
  const notify = React.useCallback(
    (title: Notification['title'], options?: NotificationOptions) => {
      if (!isSupported || permission !== 'granted') return null;

      try {
        const notification = new Notification(title, options);

        // Очищаем возможные ошибки в состоянии.
        safeSetState({ error: null });

        return notification;
      } catch (error) {
        if (error instanceof Error) {
          safeSetState({ error });
        }

        return null;
      }
    },
    [permission],
  );

  return {
    permission,
    error,
    requestPermission,
    notify,
  };
}

export default useWebNotificationApi;
