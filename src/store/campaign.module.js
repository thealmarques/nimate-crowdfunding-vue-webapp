import {
  SET_IMAGES,
  SET_LOADING_IMAGES,
  SET_DETAIL,
  SET_CAMPAIGN_ID,
  SET_NIMIQ_STATE,
  SET_ADDRESS_STATS
} from "./mutations.type";
import {
  GET_CAMPAIGN_DETAILS,
  GET_IMAGES,
  SAVE_TRANSACTION,
  START_MINING,
  CHANGE_THREADS,
  STOP_MINING,
  GET_STATS
} from "./actions.type";

import { firestore, storage } from "../firebase";
import JQuery from "jquery";
import Nimiq from "Nimiq";
import axios from "axios";

let $ = JQuery;
window.$ = $;

const state = {
  images: [],
  campaign: null,
  loading: false,
  detail: {
    id: "",
    title: "",
    description: "",
    email: "",
    goal: "",
    balance: "",
    days: "",
    completed: "",
    address: "",
    percentage: "",
    images: 0
  },
  nimiq: {
    hashRate: 0,
    totalHashCount: 0,
    totalElapsed: 0,
    progressPercent: 0,
    address: "NQ27 RC5B 9E5A S09M 95LQ G3N4 LHQ0 U9DX EDKM", //default address, it will be replaced by the campaign address during runtime
    network: "main",
    poolServer: "eu.sushipool.com",
    poolPort: "443",
    url: "https://cdn.nimiq.com/nimiq.js",
    log: "Disconnected",
    addressAPI: "",
    poolAPI: "https://api.sushipool.com/api/v1/stats/pool",
    networkAPI: "https://api.sushipool.com/api/v1/stats/network"
  },
  stats: {
    balance: {
      unconfirmed: 0,
      confirmed: 0,
      paid: 0
    },
    total_income: 0,
    wallet_balance: 0,
    total_devices: 0,
    online_devices: 0,
    devices: [],
    total_hashrate: 0
  }
};

const getters = {
  images(state) {
    return state.images;
  },
  detail(state) {
    return state.detail;
  },
  loadingImages(state) {
    return state.loading;
  },
  nimiqlog(state) {
    return state.nimiq.log;
  },
  nimiq(state) {
    return state.nimiq;
  },
  stats(state) {
    return state.stats;
  }
};

const actions = {
  async [GET_STATS]({ commit, state }) {
    axios.get(state.nimiq.addressAPI).then(res => {
      commit(SET_ADDRESS_STATS, res.data);
    });
  },
  async [STOP_MINING]({ commit, state }) {
    $.miner.stopWork();
    $.network.disconnect();
    document.getElementById("statusPool").style.backgroundColor = "#C71818";
    commit(SET_NIMIQ_STATE, "Disconnected");
  },
  async [CHANGE_THREADS]({ commit, state }, thr) {
    try {
      $.miner.threads = thr;
    } catch (error) {
      console.log("Miner disconnected");
    }
  },
  async [START_MINING]({ commit, state }, threads) {
    //await loadScript(state.url);
    document.getElementById("statusPool").style.backgroundColor = "#1a5257";

    Nimiq.init(
      async () => {
        try {
          Nimiq.GenesisConfig.init(
            Nimiq.GenesisConfig.CONFIGS[state.nimiq.network]
          );
        } catch (error) {
          //Genesis already configured
        }

        const networkConfig = new Nimiq.DumbNetworkConfig();
        $.consensus = await Nimiq.Consensus.nano(networkConfig);
        $.blockchain = $.consensus.blockchain;
        $.accounts = $.blockchain.accounts;
        $.mempool = $.consensus.mempool;
        $.network = $.consensus.network;

        try {
          $.wallet = {
            address: Nimiq.Address.fromUserFriendlyAddress(state.nimiq.address)
          };
        } catch (error) {
          console.log("Invalid wallet address");
        }

        const deviceId = Nimiq.BasePoolMiner.generateDeviceId(networkConfig);
        Nimiq.Log.i("Nimate", `Generated deviceId ${deviceId}.`);
        $.miner = new Nimiq.NanoPoolMiner(
          $.blockchain,
          $.network.time,
          $.wallet.address,
          deviceId
        );
        $.miner.threads = threads;

        console.log("Numero de CPUs: " + $.miner.threads);
        $.network.connect();

        console.log("Establishing nano consensus..");
        commit(SET_NIMIQ_STATE, "Establishing nano consensus..");
        $.consensus.on("established", () => {
          console.log("Consensus established");
          commit(SET_NIMIQ_STATE, "Consensus established");

          const address = $.wallet.address.toUserFriendlyAddress();
          console.log(address);
          const poolMiningHost = state.nimiq.poolServer;
          const poolMiningPort = state.nimiq.poolPort;
          Nimiq.Log.i(
            "Nimate",
            `Connecting to pool ${poolMiningHost}:${poolMiningPort}.`
          );
          commit(SET_NIMIQ_STATE, "Connecting to pool..");
          $.miner.connect(poolMiningHost, poolMiningPort);
          $.miner.startWork();
        });

        $.consensus.on("lost", () => {
          commit(SET_NIMIQ_STATE, "Consensus lost");
          console.log("Consensus lost");
          $.miner.stopWork();
        });

        $.miner.on("start", () => {
          console.log("Miner started....");
          commit(SET_NIMIQ_STATE, "Mining");
        });

        $.miner.on("hashrate-changed", () => {
          commit(SET_NIMIQ_STATE, "Connected");
          document.getElementById("statusPool").style.backgroundColor =
            "#12bbad";
          console.log("Hashrate changed: " + $.miner.hashrate);
          state.nimiq.hashrate = $.miner.hashrate;
        });

        $.miner.on("stop", () => {
          console.log("Miner stoped...");
          commit(SET_NIMIQ_STATE, "Stopped Mining");
        });
      },
      code => {
        switch (code) {
          case Nimiq.ERR_WAIT:
            alert("Error: Already open in another tab or window.");
            break;
          case Nimiq.ERR_UNSUPPORTED:
            alert("Error: Browser not supported");
            break;
          default:
            alert("Error: Nimiq initialization error");
            break;
        }
      }
    );
  },
  async [GET_CAMPAIGN_DETAILS]({ commit, state }, campaign) {
    //Get Firebase information
    var self = this;
    let campaignRef = firestore.collection("campaigns").doc(campaign);

    if (state.campaign != campaign) {
      commit(SET_IMAGES, []);
      commit(SET_LOADING_IMAGES, true);
    } else {
      commit(SET_LOADING_IMAGES, false);
    }

    commit(SET_CAMPAIGN_ID, campaign);

    await campaignRef.get().then(function(doc) {
      //doc.data() is never undefined for query doc snapshots
      let data = {};
      data.id = doc.id;
      data.title = doc.data().title;
      data.description = doc.data().description;
      data.email = doc.data().email;
      data.goal = Number(doc.data().goal);
      data.balance = Number(doc.data().balance);
      data.days = calculateDays(doc.data().creationDate, doc.data().duration);
      data.completed = Math.round((doc.data().balance / doc.data().goal) * 100);
      data.address = doc.data().address;
      data.percentage = "width: " + self.completed + "%";
      data.images = doc.data().images;
      commit(SET_DETAIL, data);
    });
  },
  async [GET_IMAGES]({ commit, state }) {
    let images = [];
    for (let i = 0; i < state.detail.images; i++) {
      await storage
        .ref()
        .child("/campaigns/" + state.detail.id + "/img_pos" + i)
        .getDownloadURL()
        .then(function(url) {
          images[i] = url;
        })
        .catch(function(error) {
          console.error(error);
        });
    }
    commit(SET_IMAGES, images);
    commit(SET_LOADING_IMAGES, false);
  },
  async [SAVE_TRANSACTION]({ dispatch }, data) {
    await firestore
      .collection("payments")
      .add({
        type: data.type,
        user: data.user,
        amount: data.amount,
        recipient: data.recipient,
        campaign: data.campaign,
        title: data.title,
        date: new Date().getTime()
      })
      .then(async function() {
        //update campaign value

        try {
          let ref = await firestore
            .collection("campaigns")
            .doc(data.campaign)
            .get();
          var newBalance = parseInt(ref.data().balance) + parseInt(data.amount);

          ref = await firestore
            .collection("campaigns")
            .doc(data.campaign)
            .update({
              balance: newBalance
            });
          dispatch(GET_CAMPAIGN_DETAILS, data.campaign);
        } catch (error) {
          console.log("Error while updating campaign, " + error);
        }
      })
      .catch(function(error) {
        console.error("Error registering payment: ", error);
      });
  }
};
const mutations = {
  [SET_IMAGES](state, data) {
    state.images = data;
  },
  [SET_DETAIL](state, detail) {
    state.detail = detail;
    state.nimiq.address = detail.address;

    //state.nimiq.addressAPI =
    //"https://api.sushipool.com/api/v1/stats/profile/" + detail.address;

    state.nimiq.addressAPI =
      "https://api.sushipool.com/api/v1/stats/profile/NQ04 XEHA A84N FXQ4 DPPE 82PG QS63 TH1X XCHQ";
  },
  [SET_LOADING_IMAGES](state, data) {
    state.loading = data;
  },
  [SET_CAMPAIGN_ID](state, data) {
    state.campaign = data;
  },
  [SET_NIMIQ_STATE](state, data) {
    state.log = data;
    document.getElementById("statusPool").textContent = data;
  },
  [SET_ADDRESS_STATS](state, data) {
    state.stats = data;
  }
};

function calculateDays(date, duration) {
  let auxDate = new Date(date);
  let date1 = new Date();
  let days = parseInt(duration);
  auxDate.setDate(auxDate.getDate() + days);
  if (date1 > auxDate) {
    return "Ended";
  }

  let timeDiff = Math.abs(auxDate.getTime() - date1.getTime());
  let diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
  if (diffDays == 1) {
    return diffDays + " day left";
  }
  return diffDays + " days left";
}

export default {
  state,
  actions,
  mutations,
  getters
};
