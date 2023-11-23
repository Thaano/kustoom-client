/* eslint-disable class-methods-use-this */
import {
  ClientNotFoundError,
  LeagueClient,
  authenticate,
  createHttp2Request,
  createHttpSession,
} from 'league-connect';

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
        console.log('Client LoL non trouvé');
        throw error;
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
      return false;
    }

    return true;
  }

  async getSummonersFromLobby(event, arg) {
    const status = await this.isLcuIsRunning();

    if (status !== true) {
      return {
        success: false,
        error:
          "Le client League of Legends n'a pas pu être trouvé. Veuillez lancer le client et réessayer.",
      };
    }

    try {
      const data = await this.fetchLobbyData();

      if (!data) {
        return { success: false, error: "Vous n'êtes pas dans un lobby." };
      }

      const summoners = data.members.map(this.mapSummonerData);

      // eslint-disable-next-line consistent-return
      return { success: true, summoners };
    } catch (error) {
      console.error(error);
      // eslint-disable-next-line consistent-return
      return {
        success: false,
        error:
          "Le client League of Legends n'a pas pu être trouvé. Veuillez lancer le client et réessayer.",
      };
    }
  }

  async getLobbyName(event, arg) {
    const status = await this.isLcuIsRunning();

    if (status !== true) {
      return {
        success: false,
        error:
          "Le client League of Legends n'a pas pu être trouvé. Veuillez lancer le client et réessayer.",
      };
    }

    try {
      const data = await this.fetchLobbyData();

      if (!data) {
        return { success: false, error: "Vous n'êtes pas dans un lobby." };
      }

      const lobbyName = data.gameConfig.customLobbyName;

      // eslint-disable-next-line consistent-return
      return { success: true, lobbyName };
    } catch (error) {
      console.error(error);
      // eslint-disable-next-line consistent-return
      return {
        success: false,
        error:
          "Le client League of Legends n'a pas pu être trouvé. Veuillez lancer le client et réessayer.",
      };
    }
  }

  async getRegion() {
    const status = await this.isLcuIsRunning();

    if (status !== true) {
      return {
        success: false,
        error:
          "Le client League of Legends n'a pas pu être trouvé. Veuillez lancer le client et réessayer.",
      };
    }

    try {
      const data = await this.fetchRegionInfo();

      if (!data) {
        return { success: false, error: 'Erreur du client' };
      }

      const { region } = data;
      // eslint-disable-next-line consistent-return
      return { success: true, region };
    } catch (error) {
      console.error(error);
      // eslint-disable-next-line consistent-return
      return {
        success: false,
        error:
          "Le client League of Legends n'a pas pu être trouvé. Veuillez lancer le client et réessayer.",
      };
    }
  }

  async fetchLobbyData() {
    const response = await createHttp2Request(
      { method: 'GET', url: 'lol-lobby/v2/lobby' },
      this.session,
      this.credentials
    );
    const data = await response.json();

    return data.httpStatus !== 404 ? data : null;
  }

  async fetchRegionInfo() {
    const response = await createHttp2Request(
      { method: 'GET', url: 'riotclient/region-locale' },
      this.session,
      this.credentials
    );
    const data = await response.json();

    return data.httpStatus !== 404 ? data : null;
    //   {
    //     "locale": "fr_FR",
    //     "region": "EUW",
    //     "webLanguage": "fr",
    //     "webRegion": "euw"
    //  }
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
