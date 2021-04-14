<template>
  <div class="modal-box " v-if="show" @click.self="show = false">
    <div class="overlay" @click="show = false"></div>
    <div class="modal">
      <button class="modal__close" @click="show = false">
        <img src="../assets/images/close.svg" alt="">
      </button>
      <div class="modal__container modal__container--height">
        <div class="modal__title notice-title">Notice</div>
        <div class="modal__inner t-center">
          <span class="text"><strong>$BRIBE</strong> token is not launched yet.<br>Official token address will be announced soon.</span>
        </div>
        <div class="modal__cancel">
          <button class="button button--grey button--small" @click="show = false">Close</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import {mapState, mapActions} from 'vuex'

export default {
  name: "WalletModal",

  data() {
    return {
      show: false
    }
  },

  mounted() {
    this.$bus.$on('close-notice-modal', () => {
      this.show = false;
    })
    this.$bus.$on('open-notice-modal', () => {

      this.show = true;
    })
  },

  computed: {
    ...mapState(['metamaskAccount', 'metamaskConnector'])
  },

  methods: {
    ...mapActions(['connectAccount'])
  }
}
</script>


<style lang="scss" scoped>
.notice-title {
  font-size: 24px;
  font-weight: 800;
}
.t-center {
  text-align: center;
}
</style>