<!-- Home -->
<template>
  <div>
    <div>欢迎来到照片书DIY系统</div>
    <el-button type="primary" plain @click="goDIY"> 进入设计</el-button>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },

  components: {},

  computed: {},

  mounted() {},

  methods: {
      goDIY(){
          this.$router.push('/diy')
      }
  }
};
</script>
<style lang="scss" scoped></style>
