import { Preferences } from "@capacitor/preferences";

export const getCompanyId = async () => {
  try {
    const result = await Preferences.get({ key: 'company_id' });
    return result.value;
  } catch (e) {
    return null;
  }
};

export const setCompanyId = async (company_id:string) => {
  try {
    await Preferences.set({ key: 'company_id', value: company_id });
  } catch (e) {
    console.error('Failed to set company_id:', e);
  }
};
