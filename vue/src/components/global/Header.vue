<template>
  <header class="header">
    <div class="container">
      <div class="header__inner">
        <router-link :to="{name: 'farming'}" class="header__logo">
          <img src="../../assets/images/logo.svg" alt="bribe">
        </router-link>
        <nav class="header__nav">
          <router-link :to="{name: 'farming'}" class="header__link header__link--active">Farming</router-link>
          <router-link :to="{name: 'about'}" class="header__link">About</router-link>
          <router-link :to="{name: 'airdrop'}" class="header__link">Airdrop</router-link>
          <!-- <router-link :to="{name: 'bsc'}" class="header__link">BSC Network</router-link> -->
        </nav>
        <div class="header__box">
          <a href="#" class="button header__button" @click.prevent="showModal" :class="{'button': metamaskAccount}">{{ metamaskAccount ? `${metamaskAccount.substring(0, 6 + 2)}...${metamaskAccount.substring(42 - 6)}` : 'Unlock wallet' }}</a>
          <div class="header__menu">
            <div class="header__menu-icon" @click="menuStatus =! menuStatus"></div>
            <transition name="fade">
              <div class="header__list" v-if="menuStatus">
                <router-link :to="{name: 'farming'}" class="header__link">Farming</router-link>
                <router-link :to="{name: 'about'}" class="header__link">About</router-link>
                <router-link :to="{name: 'airdrop'}" class="header__link">Airdrop</router-link>
                <!--  <router-link :to="{name: 'bsc'}" class="header__link">BSC Network</router-link> -->
              </div>
            </transition>
          </div>
        </div>
      </div>
    </div>
    <WalletModal ref="modal" />
    <NoticeModal ref="notice" />
  </header>
</template>

<script>
import WalletModal from "@/components/WalletModal";
import NoticeModal from "@/components/NoticeModal";

import {mapState} from 'vuex'

export default {
  name: "Header",
  components: {
    WalletModal,
    NoticeModal
  },

  data: function () {
    return {
      menuStatus: false
    }
  },

  computed: {
    ...mapState(['metamaskAccount'])
  },

  watch:{
    $route (){
      this.menuStatus = false;
    }
  },

  methods: {
    showModal: function () {
      this.$refs.modal.show = true
    }
  }
}
</script>

<style>

</style>