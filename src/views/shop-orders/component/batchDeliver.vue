<template>
  <el-dialog title="批量发货" :visible.sync="visible" :close-on-click-modal="false" :close-on-press-escape="false" @closed="onClose()">
    <el-form ref="form" :model="form" :rules="rules" label-width="150px">
      <el-form-item label="上传Excel文件" prop="file_path">
        <custom-upload
          class-name=""
          :limit="1"
          :show-file-list="true"
          :file-list="fileList"
          @handleBeforeUpload="beforeAvatarUpload"
          @handleSuccess="handleAvatarSuccess"
          @handleExceed="handleExceed"
          @handleRemove="handleRemove"
        >
          <el-button type="primary">点击上传</el-button>
        </custom-upload>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" :loading="btnLoading" @click="onFormSubmit()">
        {{ $t('table.confirm') }}
      </el-button>
      <el-button @click="visible = false">
        {{ $t('table.cancel') }}
      </el-button>
    </div>
  </el-dialog>
</template>
<script>
import { batchDeliver } from '@/api/shop-management'
import CustomUpload from '@/components/Upload/CustomUpload'

export default {
  name: 'BatchDeliver',
  components: { CustomUpload },
  data() {
    return {
      visible: false,
      form: {
        file_path: ''
      },
      btnLoading: false,
      fileList: [],
      rules: {
        file_path: [
          { required: true, message: '请上传文件', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    init() {
      this.visible = true
    },
    onClose() {
      this.$reset()
    },
    onFormSubmit() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          batchDeliver(this.form).then((data) => {
            this.$message.success(data.msg)
            this.$emit('refreshList')
            this.visible = false
          })
        } else {
          return false
        }
      })
    },
    handleExceed() {
      this.$message.warning(`当前限制选择 1 个文件，请删除后在上传`)
    },
    beforeAvatarUpload(file, cb) {
      const a = file.name.split('.')
      const isLt2M = file.size / 1024 / 1024 < 3
      if (a[a.length - 1] !== 'xlsx') {
        this.$message.error('上传文件只能是 xlsx 格式!')
        cb(false)
        return false
      }
      if (!isLt2M) {
        this.$message.error('上传文件大小不能超过 3M')
        cb(false)
        return false
      }
      cb(true)
    },
    handleRemove() {
      this.form.file_path = ''
    },
    handleAvatarSuccess(response) {
      this.form.file_path = response
    }
  }
}
</script>

<style  scoped>
</style>

