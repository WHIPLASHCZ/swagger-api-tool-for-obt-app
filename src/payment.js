const payCommonParams = {
  buyerId: "",
  orderList: [],
  payPwd: "",
  payScene: "",
  subjectBeanList: [],
  webHost: "",
  zcyh: "",
};
const payService = process.env.VUE_APP_YINSHENG_PAYMENT;
export default [
  {
    name: "onlineByYinShenPlane",
    method: "post",
    desc: "银盛支付-机票正常单",
    path: "/obt/pay/onlineByYinShenPlane",
    params: payCommonParams,
  },
  {
    name: "onlineByYinShenPlaneEx",
    method: "post",
    desc: "银盛支付-机票改签单",
    path: "/obt/pay/onlineByYinShenPlaneEx",
    params: payCommonParams,
  },
  {
    name: "selectPayStatus",
    method: "get",
    desc: "银盛支付-获取支付状态",
    path: `${payService}/pay/selectPayStatus`,
    //?payDtoId=xxx
    loading: "0",
    params: {
      payDtoId: "",
    },
  },
  {
    name: "generateschemeUrl",
    method: "get",
    desc: "银盛支付-生成小程序跳转码",
    path: `${payService}/wx/generateschemeUrl`,
    //?payDtoId=xxx
    params: {
      payDtoId: "",
    },
  },
  {
    name: "yinShengAliH5Pay",
    method: "get",
    desc: "银盛支付-获取支付宝跳转链接",
    path: `${payService}/pay/yinShengAliH5Pay`,
    //?payDtoId=xxx
    params: {
      payDtoId: "",
    },
  },
  {
    name: "hotelPayOnline",
    method: "post",
    desc: "银盛支付-酒店正常单",
    path: "/obt/pay/hotelPayOnline",
    params: payCommonParams,
  },
  {
    name: "onlineByYinShenTrain",
    method: "post",
    desc: "银盛支付-火车正常单",
    path: "/obt/pay/onlineByYinShenTrain",
    params: payCommonParams,
  },
  {
    name: "onlineByYinShenTrainEx",
    method: "post",
    desc: "银盛支付-火车改签单",
    path: "/obt/pay/onlineByYinShenTrainEx",
    params: payCommonParams,
  },
  {
    name: "onlineByYinShenVisa",
    method: "post",
    desc: "银盛支付-签证正常单",
    path: "/obt/pay/onlineByYinShenVisa",
    params: payCommonParams,
  },
  {
    method: "post",
    name: "delSmsTmp",
    desc: "删除短信模板",
    path: "/obt/delSmsTmp",
    params: {
      id: "",
    },
  },
  {
    method: "post",
    name: "findCorpSmsConfigList",
    desc: "企业短信模板设置列表",
    path: "/obt/findCorpSmsConfigList",
    params: {
      corpId: "",
      tmpNo: "",
      tmpType: "",
      pageNum: "",
      count: "",
    },
  },
];
