import mitt from 'mitt';

type Events = {
  toast: {
    toast_type: string
    toast_message: string
  }
};

export const toastEvents = mitt<Events>();