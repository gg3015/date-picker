
<template>
  <div class='mine'>
    <button @click="search">
      展开
    </button>
    <month-picker
        :open="open"
        :year="true"
        :month="true"
        :height="50"
        :DMinlimit="5"
        :DMaxlimit="6"
        @close="open=$event"
        @change="setValue"
      >
      </month-picker>
  </div>
</template>

<script>
import MonthPicker from './../../components/monthPicker/index'
export default {
  data () {
    return {
      open: true,
      active1: 0
    }
  },

  components: {
    MonthPicker
  },

  computed: {},

  mounted () {},

  methods: {
    search () {
      this.open = !this.open
      console.log()
    },
    setValue (val) {
      console.log(val, 'val')
    }
  }
}

</script>
<style lang='scss' scoped>
@import './../../assets/common';
.mine {
}

</style>
