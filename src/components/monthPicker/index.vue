<template>
<div class="picker-page" v-if="open">
  <div class="picker-handle" :style="`height: ${height - 5}px; line-height: ${height - 5}px`">
    <div @click="closePicker">取消</div>
    <div @click="compelet">完成</div>
  </div>
  <div class="picker">
    <div class="markHr" :style="markHrStyle"></div>
    <picker :type="'year'" key="year" :id="'year'" :list="yearList" :height="height" :selected="yearSelected" @setSelected="setSelected" :fontSize="fontSize"></picker>
    <picker :type="'month'" :preLevelChange="changeYear" key="month" :id="'month'" :height="height" :list="monthList" :selected="monthSelected" @setSelected="setSelected" :fontSize="fontSize"></picker>
  </div>
</div>
</template>

<script>

import picker from './picker'
export default {
  name: 'MonthPicker',
  data () {
    let date = new Date()
    let yearSelected = Number(date.getFullYear())
    let monthSelected = Number(date.getMonth() + 1)
    return {
      months: [
        1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12
      ],
      monthsLen: 12,
      currentDate: date,
      currentYear: date.getFullYear(),
      currentMonth: date.getMonth() + 1,
      monthSelected: monthSelected,
      yearSelected: yearSelected,
      markHrStyle: 'padding: 50px',
      value: '',
      yearList: [],
      // lists渲染的月份
      monthList: [],
      // 最晚的月份
      DMaxMonth: '',
      // 最大的年份
      DMaxYear: '',
      // 最早的月份
      DMinMonth: '',
      // 最小的年份
      DMinYear: '',
      // // 前推月数
      // DMinlimit: 3,
      // // 后延月数
      // DMaxlimit: 15,
      // 前推年数
      DMinLimitYearNum: '',
      // 后移年数
      DMaxLimitYearNum: '',
      // 月份缓存
      monthObj: {},
      changeYear: ''
    }
  },
  props: {
    year: Boolean,
    month: Boolean,
    height: Number,
    minMonth: Number,
    maxMonth: Number,
    // 控制打开
    open: Boolean,
    min: String,
    max: String,
    DMinlimit: Number,
    DMaxlimit: Number,
    fontSize: String
  },
  watcher: {
  },
  components: {
    picker
  },
  created () {
    let markHrHeight = this.height || 40
    this.markHrStyle = `padding: ${markHrHeight / 2}px`
    this.getYearList()
    this.getMonthLists(this.currentYear, this.monthSelected)
  },
  methods: {
    // 获取最早的月份
    getMinMonth () {
      let minLimit = this.DMinlimit || 3
      this.DMinMonth = this.currentMonth - minLimit >= 1 ? this.currentMonth - minLimit : this.months[(this.currentMonth - minLimit) % 12 + this.monthsLen] || 12
      return this
    },
    // 计算向前的年数
    getMinLimitYearNum () {
      if (!this.DMinLimitYearNum) {
        let minLimit = this.DMinlimit || 3
        this.DMinLimitYearNum = this.currentMonth - minLimit >= 1 ? 0 : Math.ceil(Math.abs((this.currentMonth - minLimit) / 12)) || 1
      }
      return this
    },
    // 获取最小的年份
    getMinYear () {
      if (!this.DMinYear) {
        this.DMinYear = this.currentYear - this.DMinLimitYearNum
      }
      return this
    },

    // 获取最后一个月

    getMaxMonth () {
      this.getMaxLimitYearNum()
      if (!this.DMaxMonth) {
        let maxLimit = this.DMaxlimit || 3
        this.DMaxMonth = this.currentMonth + maxLimit <= 12 ? this.currentMonth + maxLimit : this.months[this.currentMonth + maxLimit - this.monthsLen * this.DMaxLimitYearNum - 1]
      }
      return this
    },
    // 获取向后推迟的年数
    getMaxLimitYearNum () {
      if (!this.DMaxLimitYearNum) {
        let maxLimit = this.DMaxlimit || 3
        this.DMaxLimitYearNum = this.currentMonth + maxLimit <= 12 ? 0 : Math.ceil(Math.abs((this.currentMonth + maxLimit - 12) / 12))
      }
      return this
    },
    getMaxYear (minMonth) {
      this.DMaxYear = this.currentYear + this.DMaxLimitYearNum
      return this
    },
    getMonthLists (year, selectedMonth) {
      this.changeYear = new Date().getTime()
      this.getMinLimitYearNum().getMinMonth()
      this.getMaxLimitYearNum().getMaxMonth()
      if (year === this.DMinYear && year !== this.DMaxYear) {
        this.setMonthList(this.DMinMonth, 12, year, selectedMonth)
        return this
      }
      if (year === this.DMaxYear && year !== this.DMinYear) {
        this.setMonthList(1, this.DMaxMonth, year, selectedMonth)
        return this
      }
      if (this.DMinYear === this.DMaxYear) {
        this.setMonthList(this.DMinMonth, this.DMaxMonth, year, selectedMonth)
        return this
      }
      this.setMonthList(1, 12, year, selectedMonth)
      return this
    },
    setMonthList (min, max, year, selectedMonth) {
      let mi = min || 1
      let ma = max || 12
      let arr = []
      if (this.monthObj[year]) {
        this.monthSelected = this.monthObj[year][0].value
        this.monthList = this.monthObj[year]
        return this
      }
      for (let i = mi; i <= ma; i++) {
        let obj = {
          value: i,
          disabled: false
        }
        arr.push(obj)
      }
      this.monthObj[year] = arr
      this.monthList = arr
      if (!selectedMonth) {
        this.monthSelected = mi
      }
      return this
    },
    getYearList () {
      let min = Number(this.getMinLimitYearNum().getMinYear().DMinYear)
      let max = Number(this.getMaxLimitYearNum().getMaxYear().DMaxYear)
      if (min !== max) {
        for (let i = min; i <= max; i++) {
          let obj = {
            value: i,
            disabled: false
          }
          this.yearList.push(obj)
        }
      } else {
        let obj = {
          value: this.currentYear,
          disabled: false
        }
        this.yearList.push(obj)
      }
    },
    closePicker () {
      this.$emit('close', false)
    },
    compelet () {
      let year = this.yearSelected
      let month = String(this.monthSelected).length === 1 ? '0' + this.monthSelected : this.monthSelected
      this.$emit('change', year + '/' + month + '/01')
      this.$emit('close', false)
    },
    setSelected (val) {
      let value = val.value
      switch (val.id) {
        case 'year':
          this.yearSelected = value
          this.getMonthLists(value)
          break
        case 'month':
          this.monthSelected = val.value
          break
        default:
          break
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .picker-page {
    position: fixed;
    bottom: 0;
    box-shadow: 0 -2px 0 -1px rgb(240, 232, 232);
    background: #fff;
    .picker-handle {
      padding: 0 2vh;
      display: flex;
      justify-content: space-between;
      div:first-child {
        color:#AAA
      }
      div {
        color: rgb(15, 15, 15)
      }
    }
    .picker {
      position: relative;
      width: 100vw;
      height: 30vh;
      display: flex;
      justify-content: center;
      align-content: center;
      box-shadow: 0 -2px 0 -1px rgb(240, 232, 232);
      .markHr {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        width: 100%;
        z-index: -1;
        box-shadow: 0 -2px 0 -1px rgb(240, 232, 232),   /*上边阴影  红色*/
        0 2px 0 -1px rgb(240, 232, 232);    /*下边阴影  黄色*/
      }
    }
  }
</style>
