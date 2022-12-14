<template>
  <div>
    <el-dialog
      width="800px"
      top="30px"
      :title="form.id ? $t('table.edit') : $t('table.add')"
      :visible.sync="visible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      @closed="onClose()"
    >
      <el-form ref="form" :model="form" label-width="140px" :rules="rules">
        <el-form-item label="模板名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入模板名称" />
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input-number v-model="form.sort" controls-position="right" placeholder="请输入" :min="0" :precision="0" />
        </el-form-item>
        <el-form-item label="价格" prop="cny_price">
          <el-input-number
            v-model="form.cny_price"
            controls-position="right"
            placeholder="请输入价格"
            clearable
            :min="0"
            :precision="2"
          />
        </el-form-item>
        <el-form-item label="上传gltf文件" prop="three_url.three_gltf">
          <custom-upload
            class-name=""
            ref-name="three_url.three_gltf"
            :limit="1"
            :show-file-list="true"
            :file-list="gltfList"
            @handleBeforeUpload="beforeAvatarUpload3d"
            @handleSuccess="handleAvatarSuccess"
            @handleError="handleError"
            @handleExceed="handleExceed"
            @handleRemove="handleRemove"
          >
            <el-button type="primary">点击上传</el-button>
          </custom-upload>
        </el-form-item>
        <el-form-item label="上传bin文件" prop="three_url.three_bin">
          <custom-upload
            class-name=""
            ref-name="three_url.three_bin"
            :limit="1"
            :show-file-list="true"
            :file-list="binList"
            @handleBeforeUpload="beforeAvatarUpload3d"
            @handleSuccess="handleAvatarSuccess"
            @handleError="handleError"
            @handleExceed="handleExceed"
            @handleRemove="handleRemove"
          >
            <el-button type="primary">点击上传</el-button>
          </custom-upload>
        </el-form-item>
        <el-form-item label="3d渲染image文件" prop="three_url.three_image">
          <div class="filter-list-box">
            <draggable
              v-model="form.images"
              v-bind="dragOptions"
              class="wrapper"
              @start="drag = true"
              @end="drag = false"
            >
              <transition-group>
                <div v-for="(item, index) in form.three_url.three_image" :key="item" class="upload-images">
                  <div class="upload-image">
                    <el-image :src="item && domin + item" />
                  </div>
                  <div class="upload-actions">
                    <i class="el-icon-zoom-in" @click="onPicturePreview(item)" />
                    <i class="el-icon-delete" @click="onPictureRemove(item, index, 'three_url.three_image')" />
                  </div>
                </div>
              </transition-group>
            </draggable>
            <custom-upload
              ref-name="three_url.three_image"
              class-name="avatar-uploader"
              @handleBeforeUpload="beforeAvatarUpload"
              @handleSuccess="handleAvatarSuccess"
            >
              <i slot="default" class="el-icon-plus avatar-uploader-icon" />
            </custom-upload>
          </div>
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
  </div>
</template>

<script>
import { addOrUpdate } from '@/api/exclusiveGoods'
import CustomUpload from '@/components/Upload/CustomUpload'
import { getToken, DominKey } from '@/utils/auth'
import draggable from 'vuedraggable'

export default {
  name: 'AddOrUpdate',
  components: { CustomUpload, draggable },

  data() {
    return {
      domin: getToken(DominKey),
      visible: false,
      btnLoading: false,
      binList: [],
      gltfList: [],
      imageViewer: false,
      imageViewerList: [],
      currentName: '',
      form: {
        id: 0,
        three_url: {
          three_type: 'gltf',
          three_bin: '',
          three_gltf: '',
          three_image: []
        },
        images: [],
        cny_price: 0,
        sort: 0,
        name: ''
      },
      rules: {
        name: { required: true, message: '不能为空', trigger: ['blur', 'change'] },
        'three_url.three_bin': { required: true, message: '不能为空', trigger: ['blur', 'change'] },
        'three_url.three_gltf': { required: true, message: '不能为空', trigger: ['blur', 'change'] },
        'three_url.three_image': { required: true, message: '不能为空', trigger: ['blur', 'change'] },
        cny_price: { required: true, message: '不能为空', trigger: ['blur', 'change'] },
        sort: { required: true, message: '不能为空', trigger: ['blur', 'change'] }
      }
    }
  },
  computed: {
    dragOptions() {
      return {
        animation: 200,
        group: 'description',
        disabled: false,
        ghostClass: 'ghost'
      }
    }
  },
  methods: {
    init(data) {
      this.visible = true
      if (data) {
        data.three_url.three_type ??= 'gltf'
        this.form = { ...data }
      }
    },
    onFormSubmit() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.btnLoading = true
          this.form.images = JSON.parse(JSON.stringify(this.form.three_url.three_image))
          addOrUpdate(this.form)
            .then(({ msg }) => {
              this.$message.success(msg)
              this.visible = false
              this.$emit('refreshList')
            })
            .catch(() => {
              this.btnLoading = false
            })
        }
      })
    },
    handleAvatarSuccess(response, file) {
      if (this.currentName === 'images') {
        this.form[this.currentName].push(response)
      } else if (this.currentName.indexOf('three_url') >= 0) {
        if (this.currentName.indexOf('image') >= 0) {
          this.form.three_url.three_image.push(response)
        } else {
          const a = this.currentName.split('.')
          this.form[a[0]][a[1]] = response
        }
      } else {
        this.form[this.currentName] = response
      }
    },
    beforeAvatarUpload(file, cb, refName) {
      const type = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif']
      const isLt2M = file.size / 1024 / 1024 < 20
      if (!type.includes(file.type)) {
        this.$message.error('上传图片只能是 ' + type.join(',') + ' 格式!')
        cb(false)
        return
      }
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 20M')
        cb(false)
        return
      }
      this.currentName = refName
      cb(true)
    },
    handleError() {
      this[`${this.currentName.replace('three_url.three_', '')}List`] = []
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 1 个文件，请删除后在上传`)
    },
    handleRemove(file, fileList) {
      this.form.three_url[`three_${file.name.split('.')[1]}`] = ''
      this[`${file.name.split('.')[1]}List`] = []
    },
    beforeAvatarUpload3d(file, cb, refName) {
      const a = file.name.split('.')
      const isLt20M = file.size / 1024 / 1024 < 20
      if (a[a.length - 1] !== refName.replace('three_url.three_', '')) {
        this.$message.error(`上传文件只能是 ${refName.replace('three_url.three_', '')} 格式!`)
        cb(false)
        return
      }
      if (!isLt20M) {
        this.$message.error('上传文件大小不能超过 20M')
        cb(false)
        return
      }
      this.currentName = refName
      cb(true)
    },
    onClose() {
      this.$reset()
    },
    onPicturePreview(img) {
      this.imageViewerList = [this.domin + img]
      this.imageViewer = true
    },
    onPictureRemove(img, index, type) {
      this.form.three_url.three_image.splice(index, 1)
    }
  }
}
</script>

<style lang="scss" scoped>
.el-input-number {
	width: 200px;
}
.avatar-uploader {
	display: inline-block;
	::v-deep .el-upload {
		border: 1px dashed #d9d9d9;
		border-radius: 6px;
		cursor: pointer;
		position: relative;
		overflow: hidden;
		.el-upload-list__item {
			transition: none;
		}
	}
	.el-upload:hover {
		border-color: #409eff;
	}
	.avatar-uploader-icon {
		font-size: 28px;
		color: #8c939d;
		width: 100px;
		height: 100px;
		line-height: 100px;
		text-align: center;
	}
	.avatar {
		width: 100px;
		height: 100px;
		display: block;
		object-fit: contain;
	}
}
::v-deep .filter-list-box {
	.wrapper {
		display: inline;
		vertical-align: top;
	}
	.upload-images {
		overflow: hidden;
		background-color: #fff;
		border: 1px solid #c0ccda;
		border-radius: 6px;
		box-sizing: border-box;
		width: 100px;
		height: 100px;
		margin: 0 8px 8px 0;
		display: inline-block;
		position: relative;
		cursor: grabbing;
		.upload-image {
			width: 100%;
			height: 100%;
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
			& > img {
				width: 100%;
			}
		}
		.upload-actions {
			width: 100%;
			height: 100%;
			position: absolute;
			left: 0;
			top: 0;
			background-color: rgba(0, 0, 0, 0.5);
			text-align: center;
			display: none;
			i {
				margin-left: 6px;
				margin-top: 6px;
				&:first-child {
					margin-left: 0;
				}
			}
		}
		&:hover .upload-actions {
			display: block;
		}
		.upload-actions i {
			color: #fff;
			font-size: 18px;
			cursor: pointer;
		}
	}
}
</style>
