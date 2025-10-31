import mitt from 'mitt';

type Events = {
  toast: {
    type: string
    message: string
  }
};

export const toastEvents = mitt<Events>();