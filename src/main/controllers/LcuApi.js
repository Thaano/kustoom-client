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
    try {
      this.credentials = await authenticate();
      this.client = new LeagueClient(this.credentials);
      this.session = await createHttpSession(this.credentials);

      this.client.on('connect', (newCredentials) => {
        this.credentials = newCredentials;
      });

      this.client.start();
    } catch (error) {
      if (error instanceof ClientNotFoundError) {
        console.log('ClientNotFoundError');
      } else {
        console.log(error);
      }
    }
  }

  getCredentials() {
    return this.credentials;
  }

  getSession() {
    return this.session;
  }

  async getPlayersFromLobby(event, arg) {
    try {
      const response = await createHttp2Request(
        {
          method: 'GET',
          url: 'lol-lobby/v2/lobby',
        },
        this.session,
        this.credentials
      );
      const data = await response.json();

      if (data.httpStatus === 404) {
        event.reply('getPlayersFromLobby-reply', {
          success: false,
          error:
            "Vous n'êtes pas dans un lobby. Veuillez lancer une partie et réessayer.",
        });

        return;
      }

      const players = data.members.map((member) => {
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
      });

      event.reply('getPlayersFromLobby-reply', { success: true, players });
      console.log(players);
    } catch (error) {
      console.log(error);
      event.reply('getPlayersFromLobby-reply', {
        success: false,
        error:
          "Le client League of Legends n'a pas pu être trouvé. Veuillez lancer le client et réessayer.",
      });
    }
  }
}

const LcuAPIinstance = new LcuAPI();
LcuAPIinstance.init();
// Object.freeze(LcuAPIinstance);

export default LcuAPIinstance;
