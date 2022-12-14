<template>
  <el-dialog
    :title="payType === 'chain'?'链费用缴纳': '服务器费缴纳'"
    :visible.sync="visible"
    @closed="onClose()"
  >
    <el-form ref="form" :rules="rules" :model="form" label-width="120px">
      <div v-if="info" class="info">
        <!-- <div v-if="payType === 'chain'">
          <el-form-item label="购买次数" prop="credential">
            <el-input v-model="form.code" oninput="value=value.replace(/[^\d]/g,'')" placeholder="请输入需要购买的上链次数" clearable />
          </el-form-item>
          <div class="info-item">
            应收金额：
            <span class="price">{{ serverInfo.pay_price }}元</span>
          </div>
          <div>当前优惠：<b style="color: #b8741a;">{{ serverInfo.maintain_rate }} 折</b></div>
        </div> -->
        <div class="info-item pay">
          待付款：
          <span class="price">{{ info.pay_price }}元</span>
        </div>
        <template v-if="info.bank_info">
          <div class="info-item">开户行：{{ info.bank_info.bank }}</div>
          <div class="info-item">开户号：{{ info.bank_info.account_number }}</div>
          <div class="info-item">开户名：{{ info.bank_info.account_name }}</div>
        </template>
      </div>
      <el-form-item label="支付凭证" prop="credential">
        <custom-upload
          class-name="image-uploader"
          ref-name="image"
          @handleBeforeUpload="beforeAvatarUpload"
          @handleSuccess="handleAvatarSuccess"
        >
          <img
            v-if="form.credential"
            :src="domin + form.credential"
            class="image"
          >
          <i v-else class="el-icon-plus image-uploader-icon" />
        </custom-upload>
        <el-button
          class="logo-uploader"
          type="success"
          size="small"
          plain
          @click="onHandleUpload('image-uploader', 'image')"
        >上传图片</el-button>
        <div class="describe">
          <div>
            请将款项转账至以上账户，并上传支付证明（银行转款的电子回单）
          </div>
        </div>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" :loading="btnLoading" @click="onFormSubmit()">
        {{ $t("table.confirm") }}
      </el-button>
      <el-button @click="visible = false">
        {{ $t("table.cancel") }}
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import { chainOrdersPay, severOrdersPay } from '@/api/tenant'
import CustomUpload from '@/components/Upload/CustomUpload'
import { DominKey, getToken } from '@/utils/auth'
import { mapGetters } from 'vuex'

export default {
  name: 'PayFee',
  components: { CustomUpload },
  data() {
    return {
      payType: '',
      domin: getToken(DominKey),
      info: {},
      visible: false,
      btnLoading: false,
      goodsLoading: false,
      form: {
        id: 0,
        credential: ''
      },
      rules: {
        credential: [
          { required: true, message: '凭证不能为空', trigger: ['blur', 'change'] }
        ]
      }
    }
  },
  computed: {
    ...mapGetters({ 'serverInfo': 'info' })
  },
  watch: {},
  methods: {
    init(data, payType) {
      this.info = data
      this.form.id = data.id
      this.payType = payType
      this.visible = true
    },
    onFormSubmit() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.$confirm(`确定处理吗？`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            dangerouslyUseHTMLString: true,
            cancelButtonClass: 'btn-custom-cancel',
            type: 'warning'
          })
            .then(() => {
              this.btnLoading = true
              if (this.payType === 'chain') {
                this.onPayChain()
              } else {
                this.onSeverOrdersPay()
              }
            })
            .catch(() => {})
        }
      })
    },
    onPayChain() {
      chainOrdersPay(this.form)
        .then(({ msg }) => {
          this.$message.success(msg)
          this.visible = false
          this.$emit('refreshList')
        })
        .catch(() => {
          this.btnLoading = false
        })
    },
    onSeverOrdersPay() {
      severOrdersPay(this.form)
        .then(({ msg }) => {
          this.$message.success(msg)
          this.visible = false
          this.$emit('refreshList')
        })
        .catch(() => {
          this.btnLoading = false
        })
    },
    onHandleUpload(className, refName) {
      document.querySelector(`.${className} input`).click()
    },
    handleAvatarSuccess(response, file) {
      this.form.credential = response
    },
    beforeAvatarUpload(file, cb, refName) {
      const type = ['image/jpeg', 'image/jpg', 'image/png']
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!type.includes(file.type)) {
        this.$message.error('上传图片只能是 ' + type.join(',') + ' 格式!')
        cb(false)
      }
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 2M')
        cb(false)
      }
      cb(true)
    },
    onClose() {
      this.btnLoading = false
    }
  }
}
</script>

<style scoped>
.info {
  padding: 0 80px;
}
.info-item {
  margin-bottom: 20px;
}
.pay {
  margin-bottom: 40px;
}
.pay span {
  font-size: 18px;
}
.price{
  color:#dab377;
  font-weight: 700;
}
.el-input-number {
  width: 200px;
}
.image-uploader >>> .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  width: 100px;
  min-height: 100px;

  display: -webkit-box;
  display: -ms-flexbox;
  display: -webkit-flex;
  display: flex;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  -webkit-justify-content: center;
  justify-content: center;
  -webkit-box-align: center;
  -ms-flex-align: center;
  -webkit-align-items: center;
  align-items: center;
}
.image-uploader .el-upload:hover {
  border-color: #409eff;
}
.image-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  text-align: center;
}
.image {
  width: 100%;
  height: auto;
}
.logo-uploader {
  margin: 15px 0;
}
</style>
