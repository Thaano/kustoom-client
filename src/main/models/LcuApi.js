/* eslint-disable class-methods-use-this */
import {
  ClientNotFoundError,
  LeagueClient,
  authenticate,
  createHttp2Request,
  createHttpSession,
} from 'league-connect';
import log from 'electron-log';
import i18next from 'i18next';

// import { summonersMockup } from '../../mockup/summoners.js';

const { t } = i18next;

class LcuAPI {
  constructor() {
    if (LcuAPI.instance) {
      return LcuAPI.instance;
    }

    this.credentials = null;
    this.client = null;
    this.session = null;

    LcuAPI.instance = this;
  }

  async init() {
    await this.resetConnection();
  }

  async resetConnection() {
    log.info('LcuAPI: resetting connection...');
    try {
      this.credentials = await authenticate();
      this.client = new LeagueClient(this.credentials);
      this.session = await createHttpSession(this.credentials);

      this.client.on('connect', (newCredentials) => {
        this.credentials = newCredentials;
        this.resetConnection(); // Réinitialisation automatique sur reconnexion
      });

      this.client.start();
    } catch (error) {
      if (error instanceof ClientNotFoundError) {
        console.log(t('backend.lcuApi.clientNotFound'));
        log.warn('LcuAPI (resetConnection()): LoL client not found', error);
      }
    }
  }

  getCredentials() {
    return this.credentials;
  }

  getSession() {
    return this.session;
  }

  async isLcuIsRunning() {
    if (!this.credentials || !this.client || !this.session) {
      await this.resetConnection();
    }

    if (!this.credentials || !this.client || !this.session) {
      log.warn('LcuAPI: LoL client not found');
      return false;
    }

    log.info('LcuAPI: LoL client running');
    return true;
  }

  async getSummonersFromLobby(event, arg) {
    log.info('LcuAPI: getting summoners from lobby...');
    const status = await this.isLcuIsRunning();

    if (status !== true) {
      log.warn('LcuAPI: LoL client not found');
      return {
        success: false,
        error: t('backend.lcuApi.clientNotFoundTryToLaunch'),
      };
    }

    try {
      const data = await this.fetchLobbyData();

      if (!data) {
        log.warn('LcuAPI: not in a lobby');
        return { success: false, error: t('backend.lcuApi.notInALobby') };
      }

      const summoners = data.members.map(this.mapSummonerData);
      // const summoners = summonersMockup;

      // eslint-disable-next-line consistent-return
      const { data: aliases } = await this.getSummonersAliases(
        summoners.map((summoner) => summoner.summonerId)
      );
      // console.log('aliases', aliases);

      summoners.forEach((summoner) => {
        summoner.riotName = aliases[summoner.summonerId];
      });
      // console.log('summoners', summoners);

      return { success: true, summoners };
    } catch (error) {
      log.error('LcuAPI: error while getting summoners from lobby', error);
      console.error(error);
      // eslint-disable-next-line consistent-return
      return {
        success: false,
        error: t('backend.lcuApi.clientNotFoundTryToLaunch'),
      };
    }
  }

  async getSummonersAliases(ids) {
    log.info('LcuAPI: getting summoners aliases...');
    const status = await this.isLcuIsRunning();

    if (status !== true) {
      log.warn('LcuAPI: LoL client not found');
      return {
        success: false,
        error: t('backend.lcuApi.clientNotFoundTryToLaunch'),
      };
    }

    try {
      const data = await this.fetchSummonersAliases(ids);

      if (!data) {
        log.warn('LcuAPI: error while getting summoners aliases');
        return { success: false, error: t('backend.lcuApi.errorFromClient') };
      }

      // eslint-disable-next-line consistent-return
      return { success: true, data };
    } catch (error) {
      log.warn('LcuAPI: error while getting summoners aliases', error);
      console.error(error);
      // eslint-disable-next-line consistent-return
      return {
        success: false,
        error: t('backend.lcuApi.clientNotFoundTryToLaunch'),
      };
    }
  }

  async getLobbyName(event, arg) {
    log.info('LcuAPI: getting lobby name...');
    const status = await this.isLcuIsRunning();

    if (status !== true) {
      return {
        success: false,
        error: t('backend.lcuApi.clientNotFoundTryToLaunch'),
      };
    }

    try {
      const data = await this.fetchLobbyData();

      if (!data) {
        log.warn('LcuAPI: not in a lobby');
        return { success: false, error: t('backend.lcuApi.notInALobby') };
      }

      const lobbyName = data.gameConfig.customLobbyName;

      // eslint-disable-next-line consistent-return
      return { success: true, lobbyName };
    } catch (error) {
      log.warn('LcuAPI: error while getting lobby name', error);
      console.error(error);
      // eslint-disable-next-line consistent-return
      return {
        success: false,
        error: t('backend.lcuApi.clientNotFoundTryToLaunch'),
      };
    }
  }

  async getRegion() {
    log.info('LcuAPI: getting region...');
    const status = await this.isLcuIsRunning();

    if (status !== true) {
      return {
        success: false,
        error: t('backend.lcuApi.clientNotFoundTryToLaunch'),
      };
    }

    try {
      const data = await this.fetchRegionInfo();

      if (!data) {
        log.warn('LcuAPI: error while getting region');
        return { success: false, error: t('backend.lcuApi.errorFromClient') };
      }

      const { region } = data;
      // eslint-disable-next-line consistent-return
      return { success: true, region };
    } catch (error) {
      log.warn('LcuAPI: error while getting region', error);
      console.error(error);
      // eslint-disable-next-line consistent-return
      return {
        success: false,
        error: t('backend.lcuApi.clientNotFoundTryToLaunch'),
      };
    }
  }

  async fetchLobbyData() {
    log.info('LcuAPI: fetching lobby data...');
    const response = await createHttp2Request(
      { method: 'GET', url: 'lol-lobby/v2/lobby' },
      this.session,
      this.credentials
    );
    const data = await response.json();

    log.info('LcuAPI: lobby data fetched');
    return data.httpStatus !== 404 ? data : null;
  }

  async fetchRegionInfo() {
    log.info('LcuAPI: fetching region info...');
    const response = await createHttp2Request(
      { method: 'GET', url: 'riotclient/region-locale' },
      this.session,
      this.credentials
    );
    const data = await response.json();

    log.info('LcuAPI: region info fetched');
    return data.httpStatus !== 404 ? data : null;
    //   {
    //     "locale": "fr_FR",
    //     "region": "EUW",
    //     "webLanguage": "fr",
    //     "webRegion": "euw"
    //  }
  }

  async fetchSummonersAliases(ids) {
    log.info('LcuAPI: fetching summoners aliases...', ids);
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
    const response = await fetch(
      `https://127.0.0.1:${this.credentials.port}/lol-summoner/v1/summoner-aliases-by-ids`,
      // 'https://127.0.0.1:12220/lol-summoner/v1/summoner-aliases-by-ids',
      {
        method: 'POST',
        body: JSON.stringify([31039646]),
        headers: {
          Authorization: `Basic ${Buffer.from(
            `riot:${this.credentials.password}`
          ).toString('base64')}`,
          'Content-Type': 'application/json',
        },
      }
    );
    const data = await response.json();
    // console.log('data', data);
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '1';

    log.info('LcuAPI: summoners aliases fetched');
    return data.httpStatus !== 404 ? data : null;
  }

  mapSummonerData(member) {
    return {
      puuid: member.puuid,
      summonerId: member.summonerId,
      summonerInternalName: member.summonerInternalName,
      summonerName: member.summonerName,
      teamId: member.teamId,
      summonerLevel: member.summonerLevel,
      summonerIconId: member.summonerIconId,
      customName: member.summonerName,
    };
  }

  replyWithError(event, errorMessage) {
    event.reply('getSummonersFromLobby-reply', {
      success: false,
      error: errorMessage,
    });
  }
}

const LcuAPIinstance = new LcuAPI();
// LcuAPIinstance.init();
// Object.freeze(LcuAPIinstance);

export default LcuAPIinstance;
