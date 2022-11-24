<template>
  <div>
    <el-row :gutter="20" class="panel-box">
      <el-col :xs="24" :span="12" class="card-panel-col">
        <el-row :gutter="20" class="panel-group">
          <el-col :xs="24" :span="12">
            <el-card shadow="never" class="card-boder">
              <div class="user-title">
                昨日新增用户（人）
              </div>
              <div class="user-num">
                {{ statistics.user.yesterday }}
              </div>
              <div class="user-text">
                其中消费用户数量 <span>{{ statistics.user.yesterday_buy }}</span>
              </div>
              <el-divider />
              <div class="user-title">
                累计用户数量（人）
              </div>
              <div class="user-num">
                {{ statistics.user.total }}
              </div>
              <div class="user-text">
                其中消费用户数量 <span>{{ statistics.user.total_buy }}</span>
              </div>
            </el-card>
          </el-col>
          <el-col :xs="24" :span="12">
            <el-card v-if="statistics.entity_sale" shadow="never" class="card-boder">
              <div class="user-title">
                昨日纪念品销售额（元）
              </div>
              <div class="user-num">
                <span>{{ statistics.sale.cny.yesterday | moneyToFormat }}</span>
              </div>
              <div class="user-text" />
              <el-divider />
              <div class="user-title">
                昨日商城销售额
              </div>
              <div class="user-num">
                <span>{{ statistics.entity_sale.cny.yesterday }}</span>
              </div>
              <div class="user-text" />
            </el-card>
          </el-col>
        </el-row>
      </el-col>
      <el-col :xs="24" :span="12" class="card-panel-col">
        <el-row :gutter="20" class="panel-group">
          <el-col :xs="24" :span="12">
            <el-card shadow="never" class="card-boder">
              <div class="user-title">
                剩余上链次数
              </div>
              <div class="user-num">
                <b>{{ info.chain_num }}</b>
              </div>
              <div class="user-text">
                <span class="usedetails" @click="handleOprate">立即充值</span>
                <span class="usedetails" @click="$router.push('/chainLog')">使用明细</span>
              </div>
              <el-divider />
              <div class="user-title">
                纪念品转赠收入
              </div>
              <div class="user-num">
                <b>{{ statistics.give_sale | moneyToFormat }}</b>
              </div>
              <div class="user-text" />
            </el-card>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
    <under-order v-if="payVisible" ref="payFee" @refreshList="resetData" />
  </div>

</template>

<script>
import { mapGetters } from 'vuex'
import UnderOrder from '@/views/tenant/components/UnderOrder'
export default {
  components: { UnderOrder },
  props: {
    statistics: {
      type: Object,
      default: () => ({
        entity_sale: {
          cny: {
            curr_month: 0,
            last_month: 0,
            total: 0,
            yesterday: 0
          }
        },
        user: {
          total: 2,
          total_buy: 0,
          yesterday: 0,
          yesterday_buy: 0
        },
        sale: {
          cny: {
            curr_month: 0,
            last_month: 0,
            total: 0,
            yesterday: 0
          }
        },
        give_sale: 0
      })
    }
  },
  data() {
    return {
      payVisible: false
    }
  },
  computed: {
    ...mapGetters(['info'])
  },
  created() {
  },
  methods: {
    init() {
    },
    handleOprate() {
      this.payVisible = true
      this.$nextTick(() => {
        this.$refs.payFee && this.$refs.payFee.init()
      })
    },
    resetData() {
      this.$emit('resetData')
    }
  }
}
</script>

<style lang="scss" scoped>
.card-panel-col {
  margin-bottom: 20px;
}
.card-boder {
  border: 0px;
  min-height: 280px!important;
  .el-divider {
    margin: 20px 0;
  }
  .user-title {
    font-size: 14px;
  }
  .user-num {
    font-size: 30px;
    margin: 16px 0;
    span {
      color: #e6a23c;
    }
    b {
      color: #f56c6c;
      font-weight: normal;
    }
  }
  .user-text {
    font-size: 14px;
    height: 16px;
    color: #8C8C8C;
    span{
      color: #303133;
    }
    b {
      color: #f56c6c;
      font-weight: normal;
    }
    .usedetails{
      float: right;
      cursor: pointer;
      margin-left: 10px;
    }
  }
}

</style>
