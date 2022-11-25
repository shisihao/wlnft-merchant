<template>
  <div class="app-container">
    <el-form ref="form" :model="form" :rules="rules" label-width="100px">
      <el-form-item label="APPID" prop="appid">
        <el-input v-model="form.appid" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="秘钥" prop="secret">
        <el-input v-model="form.secret" placeholder="请输入" type="textarea" :rows="10" />
      </el-form-item>
      <el-form-item label="证书" prop="cert_path">
        <custom-upload
          class-name=""
          ref-name="certList"
          :limit="1"
          :show-file-list="true"
          :file-list="certList"
          @handleBeforeUpload="beforeAvatarUpload"
          @handleSuccess="handleAvatarSuccess"
          @handleError="handleError"
          @handleExceed="handleExceed"
          @handleRemove="handleRemove('cert_path')"
        >
          <el-button type="primary" plain>点击上传</el-button>
        </custom-upload>
      </el-form-item>
      <el-form-item label="证书秘钥" prop="key_path">
        <custom-upload
          class-name=""
          ref-name="keyList"
          :limit="1"
          :show-file-list="true"
          :file-list="keyList"
          @handleBeforeUpload="beforeAvatarUpload"
          @handleSuccess="handleAvatarSuccess"
          @handleError="handleError"
          @handleExceed="handleExceed"
          @handleRemove="handleRemove('key_path')"
        >
          <el-button type="primary" plain>点击上传</el-button>
        </custom-upload>
      </el-form-item>
      <el-form-item label="商户号" prop="mer_num">
        <el-input v-model="form.mer_num" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="商户秘钥" prop="mer_key">
        <el-input v-model="form.mer_key" placeholder="请输入" type="textarea" :rows="10" />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" :loading="btnLoading" @click="onFormSubmit">
          {{ $t('table.confirm') }}
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { wxConfig, putWxConfig } from '@/api/configs'
import CustomUpload from '@/components/Upload/CustomUpload'

export default {
  name: 'WxConfig',
  components: { CustomUpload },
  data() {
    return {
      btnLoading: false,
      form: {
        appid: '',
        secret: '',
        mer_num: '',
        mer_key: '',
        cert_path: '',
        key_path: ''
      },
      certList: [],
      keyList: [],
      currentName: '',
      rules: {
        appid: [{ required: true, message: '请输入', trigger: 'blur' }],
        secret: [{ required: true, message: '请输入', trigger: 'blur' }],
        mer_num: [{ required: true, message: '请输入', trigger: 'blur' }],
        mer_key: [{ required: true, message: '请输入', trigger: 'blur' }],
        cert_path: [{ required: true, message: '请输入', trigger: 'blur' }],
        key_path: [{ required: true, message: '请输入', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      this.getList()
    },
    getList() {
      wxConfig().then(response => {
        this.certList = [{ name: response.data.value.cert_path }]
        this.keyList = [{ name: response.data.value.key_path }]
        this.form = response.data.value
      })
    },
    onFormSubmit() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.btnLoading = true
          putWxConfig(this.form)
            .then(({ msg }) => {
              this.$message.success(msg)
              this.getList()
            })
            .catch(() => {})
            .finally(() => {
              this.btnLoading = false
            })
        }
      })
    },
    beforeAvatarUpload(file, cb, refName) {
      const isLt2M = file.size / 1024 / 1024 < 20
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 20M')
        cb(false)
        return
      }
      this.currentName = refName
      cb(true)
    },
    handleAvatarSuccess(response, file) {
      if (this.currentName === 'certList') {
        this.form.cert_path = response
      } else {
        this.form.key_path = response
      }
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 1 个文件，请删除后在上传`)
    },
    handleRemove(file, fileList) {
      if (file === 'cert_path') {
        this.form.cert_path = ''
        this.certList = []
      } else {
        this.form.key_path = ''
        this.keyList = []
      }
    },
    handleError() {
      this[this.currentName] = []
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container {
	width: 800px;
	::v-deep .el-upload-list__item {
		transition: none;
	}
}
</style>
