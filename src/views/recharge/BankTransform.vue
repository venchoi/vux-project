<template>
  <div class="news-list-page">
    <x-header :left-options="{backText: ''}" style="background-color:#EA3939;">银行转账</x-header>
    <group class="info-container">
      <div v-html="info"></div>
    </group>
    <group>
      <x-textarea title='备注说明' name="description" :placeholder="placeholder" v-model="remark"></x-textarea>
      <div class="form">
        <div class="text">上传示例</div>
        <form id="portrait-upload" method="post" action="/pay/bank_transfer/api/ajax.html" enctype="multipart/form-data">
          <input type="file" class="upload-user-icon" id="inputImage" name="head_pic" accept="image/*" @change="imgChange">
        </form>
        <img :src="this.imgUrl" alt="" class="pre-view">
        <!-- <input type="file" style="opacity:0" class="input"> -->
      </div>
    </group>
      <div class="btn-container">
        <x-button type="primary" @click.native="charge" style="width:80%;background: #EA3939;color:#fff">充值</x-button>
      </div>
  </div>
</template>
<script>
import { XHeader, Group, XTextarea, XInput, XButton } from 'vux'
import ajax from '../../plugins/ajax'
import { setTimeout } from 'timers';
export default {
  data() {
    return {
      remark: '',
      placeholder: '',
      imgFile: {},
      amount: this.$route.query.amount,
      imgUrl: '',
      info: '',
      formData: {}
    }
  },
  mounted() {
    this.getTransfer()
  },
  methods: {
    imgChange(e) {
      const targetEle = e.target
      const filePath = targetEle.value
      const file = targetEle.files[0]
      const URL = window.URL || window.webkitURL;
      const blobURL = URL.createObjectURL(file);
      this.imgUrl = blobURL
      this.imgFile = file
      // this.imgUrl = targetEle.files[0];
    },
    getTransfer() {
      ajax.TRANSFER_WAY({
        success: (res) => {
          this.info = res.data.info
        }
      })
    },
    charge() {
      const param = {
        amount: this.amount,
        img_file: this.imgFile,
        remark: this.remark
      }
      ajax.form({
        url: '/pay/bank_transfer/api/ajax.html',
        param
      }).then((res) => {
        if (res.error_code === '0') {
          this.$vux.toast.show({
            text: res.msg,
            type: 'text'
          })
        } else {
          this.$vux.toast.show({
            text: res.msg,
            type: 'cancel'
          })
        }
      })
    }
  },
  components: {
    XHeader,
    Group,
    XTextarea,
    XInput,
    XButton
  }
}
</script>
<style lang="less">
.info-container {
  > div {
    // padding: 10px;
  }
}
.form {
  position: relative;
  form {
    position: absolute;
    top: 0;
    left: 0;
    width: 0;
    height: 0;
    input {
      width: 60px;
      height: 20px;
      opacity: 0;
    }
  }
}
.pre-view {
  width: 90px;
  height: auto;
}
.btn-container {
  display: flex;
  align-items: center;
  margin-top: 20px;
  padding: 0 10px;
}
.btn-container .charge-btn {
  width: 90%;
}
</style>
