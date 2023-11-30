import i18next from 'i18next';
import LcuAPIinstance from './LcuApi';

const { t } = i18next;

export const getSummonerData = async (summonerInternalName) => {
  const { region } = await LcuAPIinstance.getRegion();

  const URL = `${process.env.REACT_APP_BACKEND_API_URL}/summoner/get/${region}/${summonerInternalName}`;
  try {
    const resp = await fetch(URL, {
      method: 'GET',
      headers: {},
    });
    const data = await resp.json();

    if (!data.success) {
      return { success: false, error: data.error };
    }

    return { success: true, data: data.data };
  } catch (error) {
    // console.log('error', error);
    return { success: false, error: t('backend.errors.internalError') };
  }
};

export const getLobbyData = async (summoners) => {
  const { region } = await LcuAPIinstance.getRegion();

  const URL = `${process.env.REACT_APP_BACKEND_API_URL}/summoner/getLobby/${region}`;
  try {
    const resp = await fetch(URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ summoners }),
    });
    const data = await resp.json();

    if (!data.success) {
      return { success: false, error: data.error };
    }

    return { success: true, data: data.data };
  } catch (error) {
    return { success: false, error: t('backend.errors.internalError') };
  }
};

export const getLobbyRating = async (summoners, method) => {
  const { region } = await LcuAPIinstance.getRegion();
  const URL = `${process.env.REACT_APP_BACKEND_API_URL}/summoner/calculate-lobby-rating/${method}/${region}`;
  try {
    const resp = await fetch(URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ summoners }),
    });
    const data = await resp.json();

    if (!data.success) {
      return { success: false, error: data.error };
    }

    return { success: true, data: data.data.summoners };
  } catch (error) {
    return { success: false, error: t('backend.errors.internalError') };
  }
};
