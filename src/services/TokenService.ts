import { SecureStoragePlugin } from 'capacitor-secure-storage-plugin';

export const getAccessToken = async () => {
  try {
    const result = await SecureStoragePlugin.get({ key: 'access_token' });
    return result.value;
  } catch (e) {
    return null;
  }
};

export const getRefreshToken = async () => {
  try {
    const result = await SecureStoragePlugin.get({ key: 'refresh_token' });
    return result.value;
  } catch (e) {
    return null;
  }
};

export const setAccessToken = async (token:string) => {
  try {
    await SecureStoragePlugin.set({ key: 'access_token', value: token });
  } catch (e) {
    console.error('Failed to set access_token:', e);
  }
};

export const setRefreshToken = async (token:string) => {
  try {
    await SecureStoragePlugin.set({ key: 'refresh_token', value: token });
  } catch (e) {
    console.error('Failed to set refresh_token:', e);
  }
};

export const removeAccessToken = async () => {
  try {
    const result = await SecureStoragePlugin.remove({ key: 'access_token' });
    return result.value;
  } catch (e) {
    return null;
  }
};

export const removeRefreshToken = async () => {
  try {
    const result = await SecureStoragePlugin.remove({ key: 'refresh_token' });
  } catch (e) {
    return null;
  }
};


export const setCompanyId = async (company_id:string) => {
  try {
    await SecureStoragePlugin.set({ key: 'company_id', value: company_id+'' });
  } catch (e) {
    console.error('Failed to set company_id:', e);
  }
};

export const getCompanyId = async () => {
  try {
    const result = await SecureStoragePlugin.get({ key: 'company_id' });
    return result.value;
  } catch (e) {
    return null;
  }
};

export const removeCompanyId = async () => {
  try {
    const result = await SecureStoragePlugin.remove({ key: 'company_id' });
  } catch (e) {
    return null;
  }
};