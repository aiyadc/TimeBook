<!--  -->
<template>
  <div>
    <login @login="login"></login>
  </div>
</template>

<script>
import Login from "@/components/Login";
export default {
  components: { Login },
  data() {
    return {};
  },

  computed: {},

  mounted() {},

  methods: {
      login(params){
          if(params.account=='eachan' && params.password == '123456')
          this.$router.push('/')
      }
  }
};
</script>
<style lang="scss" scoped></style>
