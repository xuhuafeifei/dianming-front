<template>
  <div id="app">
    <el-form :inline="true" :model="dataForm" @keyup.enter="getDataList()">
      <el-form-item>
        <!-- <el-input
          v-model="dataForm.key"
          disabled
          placeholder="参数名"
          clearable
        /> -->
        <el-select
          v-model="className"
          class="m-2"
          placeholder="Select"
          size="large"
        >
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList(className)">查询</el-button>
      </el-form-item>
    </el-form>
    <el-row>
      <el-card v-for="(item, index) in stuList" :key="item.id" class="item">
        <div class="img_box"><img :src="item.sportrait" alt="" /></div>
        <p>{{ item.sname + ": " + item.label }}</p>
        <span :style="{ color: 'red' }"
          ><el-button link type="primary" @click="getMoreInfo(item.id)"
            >详情</el-button
          ></span
        >
      </el-card>

      <el-pagination
        @size-change="sizeChangeHandle"
        @current-change="currentChangeHandle"
        :current-page="pageIndex"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="pageSize"
        :total="totalPage"
        layout="total, sizes, prev, pager, next, jumper"
      />
    </el-row>
    <infocard ref="infoCard" />
  </div>
</template>
<script setup lang="ts">
import { defineComponent, defineAsyncComponent, onMounted, ref } from "vue";
import { ElMessage } from "element-plus";
import classApi from "@/api/class";

const mockData = ref([
  {
    id: 2,
    img: "https://img12.360buyimg.com/jdcms/s300x300_jfs/t1/164708/20/20875/95398/6086e7daE5d1ea589/2248e82326846870.jpg.webp",
    text: "兰叶源  轻奢莫兰迪真绒布绢假塑料白玫瑰浆果花把束艺卉餐桌花瓶摆件 浅蓝色 两套更优惠",
    price: 266
  },
  {
    id: 3,
    img: "https://img12.360buyimg.com/jdcms/s300x300_jfs/t1/156232/40/12942/112817/6041ced3Ef7f383b3/7e29e51c25f7b77e.jpg.webp",
    text: '<i class="more2_info_self">自营</i>都市丽人文胸无钢圈聚拢中薄款蜂巢杯透气美背小花心波斯菊蕾丝胸罩内衣女2B9506 浅肤32/70A杯',
    price: 98
  },
  {
    id: 4,
    img: "https://img12.360buyimg.com/jdcms/s300x300_jfs/t1/176546/26/4766/230854/607aa012E97def171/7417547d2d2e5da3.jpg.webp",
    text: "兰叶源  创意中式陶瓷仕女香插香座插香器线香室内檀香家用线香薰炉摆件 小宫娥 坐  哑光",
    price: 166
  },
  {
    id: 5,
    img: "https://img12.360buyimg.com/jdcms/s300x300_jfs/t1/119997/6/15535/123334/5f8d237bE36364127/a4d5ee3e0209d2a0.jpg.webp",
    text: '<i class="more2_info_chosen"></i>得力（deli）4905 电脑椅 家用办公椅 转椅人体工学网布椅子 时尚升降座椅',
    price: 459
  },
  {
    id: 6,
    img: "https://img11.360buyimg.com/jdcms/s300x300_jfs/t1/158542/28/20137/213892/607aa011Ef99cf77f/ee308525809e7d32.jpg.webp",
    text: "兰叶源  创意简约现代手工陶瓷人物家居小摆件客厅办公室书房工艺品装饰品 小胖",
    price: 96
  },
  {
    id: 7,
    img: "https://img14.360buyimg.com/jdcms/s300x300_jfs/t1/184019/38/1640/74927/608bce5aEcbe6dfa2/7649c02195797afa.jpg.webp",
    text: '<i class="more2_info_self">自营</i>浪琴(Longines)瑞士手表 嘉岚系列 石英钢带女表 L42091917',
    price: 9800
  },
  {
    id: 8,
    img: "https://img13.360buyimg.com/jdcms/s300x300_jfs/t1/161897/28/19295/153357/607aa1caEd6d31b06/470d5052656bbc5e.jpg.webp",
    text: "兰叶源  木雕福猪摆件生肖猪一对客厅玄关电视柜家居装饰乔迁创意礼品 小号木福猪一只(长18厘米)",
    price: 726
  },
  {
    id: 9,
    img: "https://img13.360buyimg.com/jdcms/s300x300_jfs/t1/149094/12/15569/191462/5fbcb4d4Eca6c430b/29df94b426525dd7.jpg.webp",
    text: "木马人 鞋架子多层简易落地卧室客厅鞋柜宿舍实木小鞋凳门口防尘家用门后经济型换鞋凳楠竹收纳置物架 【全板密封】七层102长（加宽深度）",
    price: 149
  },
  {
    id: 10,
    img: "https://img30.360buyimg.com/jdcms/s300x300_jfs/t1/174624/5/4907/80122/607aa012Eef5409a8/a8f6e04aeee6441e.jpg.webp",
    text: "兰叶源  中式禅意陶瓷香炉线香插香座和尚客厅居室佛堂檀香香熏炉创意摆件 花开见佛  哑光 白",
    price: 286
  },
  {
    id: 11,
    img: "https://img11.360buyimg.com/jdcms/s300x300_jfs/t1/177054/37/1733/211397/608ba6ebEe266900e/d7b1156e9a4ca39a.jpg.webp",
    text: '<i class="more2_info_self">自营</i>六福珠宝 足金郁金香黄金足金戒指女款开口戒 计价 L35TBGR0003 约2.89克',
    price: 1535
  },
  {
    id: 12,
    img: "https://img14.360buyimg.com/jdcms/s300x300_jfs/t1/163492/36/20005/182166/607aa1c9Eb6e2ca2e/0e153d6d035ab7f0.jpg.webp",
    text: "兰叶源  木雕华尔街牛摆件工艺品办公室店铺开业礼物新式装修牛装饰 小号花梨木华尔街牛(长30*高15厘米)精品木雕",
    price: 1166
  },
  {
    id: 13,
    img: "https://img30.360buyimg.com/jdcms/s300x300_jfs/t1/164099/14/9714/158384/6041fe36E58d7cd17/bb5eee24f006540d.jpg.webp",
    text: "【春季新品】公牛世家男鞋2021新休闲鞋男透气舒适软底百搭潮流男士板鞋潮流小白鞋运动懒人套脚鞋子男 黑色 41(标准运动码)",
    price: 228
  },
  {
    id: 14,
    img: "https://img11.360buyimg.com/jdcms/s300x300_jfs/t1/162136/12/9073/108200/603f9e2fE40632cc8/e4670383de79c9d7.jpg.webp",
    text: "罗季漫不锈钢晾衣架落地折叠卧室内阳台凉衣架家用婴儿晾衣架晒被子神器ljm 【1.4米】特惠款+四件套 大",
    price: 131
  },
  {
    id: 15,
    img: "https://img10.360buyimg.com/jdcms/s300x300_jfs/t1/191920/18/719/238244/608bc04eE7613da8b/fb82c513e662ff4c.jpg.webp",
    text: "【冰感牛仔面料】卡宾男装蓝色牛仔长裤2021春夏新款潮流简约磨白街头风 J 湖蓝色57 33",
    price: 299
  },
  {
    id: 16,
    img: "https://img20.360buyimg.com/jdcms/s300x300_jfs/t1/130459/1/9069/374142/5f5098acEc93e7813/41aa0540c683f441.jpg.webp",
    text: "汽车脚垫525LI 530LI 320LI X4 X5 X6 X3 X2 X1 180 全包围 咖啡色+咖啡色缇沃丝",
    price: 559
  },
  {
    id: 17,
    img: "https://img30.360buyimg.com/jdcms/s300x300_jfs/t1/171768/27/7247/168130/608c2d15E3a224958/3df7428a2844e3e3.jpg.webp",
    text: "BOLON暴龙眼镜2021新款猫眼太阳镜杨幂同款男女个性潮墨镜BL5052 F10-灰色",
    price: 670
  },
  {
    id: 18,
    img: "https://img10.360buyimg.com/jdcms/s300x300_jfs/t1/140349/32/7397/429223/5f50a18fE8e3909c1/a96a0496c63e6d53.jpg.webp",
    text: "2021款奔驰C200l E300l GLC260 C180A200 GLE350后备箱垫C260E 【菱格款】黑色米线【主垫】",
    price: 349
  },
  {
    id: 19,
    img: "https://img20.360buyimg.com/jdcms/s300x300_jfs/t1/80820/25/492/129600/5ceb5435Ec615b19d/631c49546bfb2240.jpg.webp",
    text: "美国斯诺德健腹轮 自动回弹静音巨轮 收腹滚轮腹肌轮健腹器健身器材 E320大黄蜂健腹轮",
    price: 268
  },
  {
    id: 20,
    img: "https://img20.360buyimg.com/jdcms/s300x300_jfs/t1/106794/37/15660/110370/5e71eb87Ea28f30fc/89fd9f5865dd4a41.jpg.webp",
    text: "加厚鞋盒收纳盒宿舍透明鞋柜鞋子收纳神器抽屉式塑料整理箱省空间ljm 女士翻盖白色 买6送6 共12个 30.2x21x12.2cm",
    price: 114
  },
  {
    id: 21,
    img: "https://img13.360buyimg.com/jdcms/s300x300_jfs/t1/100083/31/13202/105903/5e538678E3f6c2412/554ed54116868951.jpg.webp",
    text: "汽车载车用雨伞男士全自动s雨s反向伞女晴雨两用折叠伞自动伞ljm 全自动反向伞-埃斯托蓝",
    price: 179
  },
  {
    id: 22,
    img: "https://img12.360buyimg.com/jdcms/s300x300_jfs/t1/170420/21/19937/68980/607e8039E04333924/41196ba19d40e8b5.jpg.webp",
    text: "兰叶源  藏香陶瓷香薰炉中式陶瓷香插 家用室内禅意卧香炉沉香檀香线香炉 孤舟",
    price: 46
  },
  {
    id: 23,
    img: "https://img10.360buyimg.com/jdcms/s300x300_jfs/t1/160379/14/19692/51432/607972a4E033dc1a5/062e66b3a0ece4a8.jpg.webp",
    text: "兰叶源  创意现代轻奢潮牌网红暴力熊大摆件家居软装饰品客厅卡通小号摆设 灰色(站)小号",
    price: 106
  },
  {
    id: 24,
    img: "https://img11.360buyimg.com/jdcms/s300x300_jfs/t1/67273/35/13753/175949/5db15a4eE544ee569/480a389438afde18.jpg.webp",
    text: "便携保温水杯女迷你学生男时尚小巧杯网红ins原宿风日系磨砂 香槟金",
    price: 113
  },
  {
    id: 25,
    img: " https://img10.360buyimg.com/n7/jfs/t1/169103/25/26959/153404/6165157eEf6bd0af9/078ff17a8872feba.jpg",
    text: "【现货抢购】iPhone11现货发售！加129元得20W快速充电头！加829元得AirPods!更多优惠！",
    price: 4399
  }
]);

const dataForm = ref({
  key: ""
});
const stuList = ref([]);
const dataList = ref([]);
const pageIndex = ref(1);
const pageSize = ref(10);
const totalPage = ref(0);
const dataListLoading = ref(false);

const className = ref("数科2102班");

const options = [
  {
    value: "数科2101班",
    label: "数科2101班"
  },
  {
    value: "数科2102班",
    label: "数科2102班"
  },
  {
    value: "数科2103班",
    label: "数科2103班"
  },
  {
    value: "数科2104班",
    label: "数科2104班"
  },
  {
    value: "全部",
    label: "数科所有班级"
  }
];

const infoCard = ref();

onMounted(() => {
  getDataList(className.value);
});

const getMoreInfo = id => {
  infoCard.value.init(id);
};

const infocard = defineAsyncComponent(() => import("./infoCard.vue"));

const getDataList = className => {
  dataListLoading.value = true;
  classApi.getList(pageIndex.value, pageSize.value, className).then(data => {
    if (data && data.code === 0) {
      stuList.value = data.data.list;
      totalPage.value = data.data.totalCount;
    } else {
      stuList.value = [];
      totalPage.value = 0;
    }
    dataListLoading.value = false;
  });
};

// 每页数
const sizeChangeHandle = val => {
  pageSize.value = val;
  pageIndex.value = 1;
  getDataList(className.value);
};
// 当前页
const currentChangeHandle = val => {
  pageIndex.value = val;
  getDataList(className.value);
};
</script>
<style>
* {
  margin: 0;
  padding: 0;
  list-style: none;
}

body {
  background: #e3e4e5;
  margin: auto;
}

/* #app {
  width: 1000px;
  margin-left: auto;
  margin-right: auto;
  overflow: hidden;
} */

.item {
  float: left;
  width: 190px;
  height: 266px;
  margin: 0 5px 8px;
  text-align: center;
  background: #fff;
}

.item .img_box {
  width: 120px;
  height: 120px;
  margin: 30px auto;
}

.img_box img {
  width: 100%;
  height: 100%;
}

.item p {
  font-size: 12px;
  line-height: 20px;
  height: 40px;
  padding: 0 10px;
  display: -webkit-box;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.more2_info_self {
  background-color: #e1251b;
  border-radius: 2px;
  color: #fff;
  padding: 0 5px;
  margin-right: 4px;
  line-height: 16px;
  height: 16px;
  font-size: 12px;
  font-style: normal;
}
</style>
