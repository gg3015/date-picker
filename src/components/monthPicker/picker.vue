<template>
  <section :id="`piacker_${type}`" >
    <div :id="id" >
      <button v-for="(item, index) in list" :key="index" @touchstart="start" @touchmove="move" @touchend="end"  @click="btnClick(item.value)" :class="{ pickerSelected: selected == item.value }" :style="style" :disabled="item.disabled"> {{ item.value }} </button>
    </div>
  </section>
</template>
<script>
export default {
  name: 'picker',

  props: {
    type: String,
    id: String,
    height: Number,
    list: Array,
    marginBottom: String,
    selected: Number,
    fontSize: String,
    preLevelChange: Number
  },
  data () {
    return {
      style: '',
      startClientY: '',
      endClientY: '',
      selectedIndex: 0,
      firstScrollTop: 0,
      first: true,
      touchEnd: false
    }
  },
  created () {
    let marginBottom = this.marginBottom || 3
    let height = this.height || 40
    let fontSize = this.fontSize || '1'
    this.style = `height: ${height}px; margin-bottom: ${marginBottom}px; font-size: ${fontSize}rem`
    this.list.forEach((item, index) => {
      if (item.value === this.selected) {
        this.selectedIndex = index
      }
    })
  },
  watch: {
    preLevelChange (val) {
      this.scrollMiddle()
    }
  },
  mounted () {
    let ctx = this
    this.scrollMiddle()
    let delayedExec = function (delay) {
      let timer
      return function () {
        let e = event
        timer && clearTimeout(timer)
        timer = setTimeout(() => {
          e.stopPropagation()
          ctx.scrollTop = e.target.scrollTop
          // 开关限制循环
          if (!ctx.first && ctx.touchEnd) {
            ctx.endCallback(ctx.scrollTop)
          }
          ctx.first = false
        }, delay)
      }
    }
    let scrollStopper = delayedExec(300)
    document.getElementById(this.id).addEventListener('scroll', scrollStopper)
  },
  methods: {
    end () {
      this.touchEnd = true
    },
    start () {
      this.touchEnd = false
      this.firstScrollTop = this.scrollTop
    },
    move () { this.touchEnd = true },
    endCallback (scrollTop) {
      let itemHeight = this.height || 40
      // 滚动距离大于0.75 个按钮高才触发
      if (Math.abs(scrollTop - this.firstScrollTop) > itemHeight * 0.75) {
        let itemNum = Math.round((this.scrollTop - this.firstScrollTop) / itemHeight)
        let index = itemNum + this.selectedIndex
        index = index <= 0 ? 0 : index > this.list.length ? this.list.length - 1 : index
        let asy = new Promise(resolve => {
          if (index <= this.list.length - 1) {
            this.setValueByIndex(index)
            resolve(index)
          }
          if (index >= this.list.length) {
            this.setValueByIndex(this.list.length - 1)
            resolve(this.list.length - 1)
          }
          if (index <= 0) {
            this.setValueByIndex(0)
            resolve(0)
          }
        })
        asy.then((index) => {
          this.selectedIndex = index
          this.scrollMiddle()
        })
      } else {
        this.scrollMiddle()
      }
    },
    getIndex (arr, el) {
      if (arr.length > 0 && el) {
        for (let i = 0; i < arr.length; i++) {
          if (arr[i].value === el) {
            return i
          }
        }
      }
    },
    btnClick (i) {
      this.selectedIndex = this.getIndex(this.list, i) || 0
      this.setValueByIndex(this.selectedIndex)
      this.scrollMiddle()
    },
    setValueByIndex (index) {
      this.$emit('setSelected', { value: this.list[index].value || this.selected, id: this.id })
    },
    scrollMiddle (i) {
      setTimeout(() => {
        let panel = document.getElementById(this.id)
        let selected = document.getElementsByClassName('pickerSelected')[0]
        let arr = panel.children
        let index
        for (let i = 0; i < arr.length; i++) {
          if (arr[i].className === 'pickerSelected') {
            index = i
            break
          }
        }
        let marginBottom = this.marginBottom || 3
        panel.scrollTop = selected.clientHeight * index + index * marginBottom + selected.clientHeight / 2
        this.first = true
      })
    }
  }
}
</script>
<style lang="scss" scoped>
  section {
    margin-right: 1vw;
    height: inherit;
    width: 45vw;
    overflow: auto;
    display: flex;
    flex-flow: column;
    justify-content: center;
    align-items: center;
    &::-webkit-scrollbar {
      display: none;
    }
    div {
      padding-top: 20vh;
      padding-bottom: 20vh;
      overflow: scroll;
      &::-webkit-scrollbar {
        display: none;
      }
      button {
        width: 45vw;
        border: none;
        outline: none;
        font-size: 1.3rem;
        background: inherit;
        &:last-child {
          margin-bottom: 0;
        }
      }
      .selected {
        color: #ff5722;
      }
    }
  }
</style>
