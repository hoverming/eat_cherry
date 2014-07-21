# 前端与后端的接口 #

## 约定 ##

日期类型统一格式： yyyy-MM-dd HH:mm:ss， 如：2014-07-04 12:01:36

## 订单列表 ##

url: /salesOrder/search, method = post

### 入参 ###

#### 说明 ####

com.feifei.order.query.OrderQuery

~~~~ {.language-java}

	/**
	 * 单号
	 */
	private String number;

	/**
	 * 下单人登陆名
	 */
	private String acountName;

	/**
	 * 下单人账号id
	 */
	private Long acountId;

	/**
	 * 仓库id
	 */
	private Integer warehouseId;

	/**
	 * sku名称
	 */
	private String skuName;

	/**
	 * sfaId
	 */
	private Long sfaId;

	/**
	 * 渠道id,必须
	 */
	private Integer channelId;

	/**
	 * 状态
	 */
	private Integer status;

	private String skuNumber;

	/**
	 * 收货人姓名
	 */
	private String receiverName;

	/**
	 * 收货人电话
	 */
	private String receiverTel;

	private Date createTimeBegin;

	private Date createTimeEnd;

	/**
	 * 支付状态 10-未付款 20-部分付款 30-已付款
	 */
	private Integer paymentStatus;

	/**
	 * 监控健康状态 0-正常 1-异常
	 */
	private Integer healthMonitor;

	/**
     * 页大小
     */
    protected int pageSize;
    /**
     * 总数
     */
    private int totalRecord;
    /**
     * 当前页
     */
    private int pageIndex;

    /**
     * 总页数
     */
    private int totalPage;

	/**
	 * 订单状态10-已提交 20-已支付  50-已确认 60-已发货 70-已签收 120-已取消 
	 */
	private Integer orderStatus;

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~    

#### 例子 ####

~~~~ {.language-java}

	"pageSize" : 20,
    "totalRecord" : 7,
    "pageIndex" : 1,
    "totalPage" : 1,
    "number" : null,
    "acountName" : "jahnkey003@163.com",
    "acountId" : null,
    "warehouseId" : null,
    "skuName" : null,
    "sfaId" : null,
    "channelId" : null,
    "status" : null,
    "skuNumber" : null,
    "receiverName" : null,
    "receiverTel" : null,
    "createTimeBegin" : null,
    "createTimeEnd" : null,
    "paymentStatus" : null,
    "healthMonitor" : null,
    "originalPageIndex" : 1,
    "startPosForMysql" : 0,
    "startPos" : 1,
    "endPos" : 7

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

### 出参 ###

#### 说明 ####

~~~~ {.language-java}

	/**
	 * 请求是否成功。
	 *
	 * @return 如果成功，则返回<code>true</code>
	 */
	boolean isSuccess();

	/**
	 * 获取返回码
	 * 
	 * @return 返回码
	 */
	String getResultCode();

	/**
	 * 主键id
	 */
	private long id;

	/**
	 * 渠道id
	 */
	private long channelId;

	/**
	 * 订单号
	 */
	private String number;

	/**
	 * 外部订单号
	 */
	private String outterOrderNumber;

	/**
	 * 下单人账号id
	 */
	private long acountId;

	/**
	 * 下单人登陆名
	 */
	private String acountName;

	/**
	 * 总金额
	 */
	private BigDecimal totalAmount;

	/**
	 * 支付金额
	 */
	private BigDecimal paidAmount;

	/**
	 * 订单状态
	 */
	private int status;

	/**
	 * 订单类型（1-标准订单,2-RMA订单）
	 */
	private int orderType;

	/**
	 * 支付状态 10-未付款 20-部分付款 30-已付款
	 */
	private int paymentStatus;

	/**
	 * 介入方式（1-暂停，2-锁定）
	 */
	private int involveType;

	/**
	 * 介入人
	 */
	private String involveBy;

	/**
	 * 最后修改人
	 */
	private String lastUpdateBy;

	/**
	 * 创建人
	 */
	private String createBy;

	/**
	 * 创建时间
	 */
	private Date createTime;

	/**
	 * 最后修改时间
	 */
	private Date lastUpdateTime;

	/**
	 * 订单总运费
	 */
	private BigDecimal shippingCost;

	/**
	 * 币种Id
	 */
	private long currencyId;

	/**
	 * 币种
	 */
	private String currency;

	/**
	 * 支付时间
	 */
	private Date payTime;

	/**
	 * 状态集
	 */
	private String flagGather;

	/**
	 * sku数量
	 */
	private int orderItemQuantity;

	/**
	 * 收货人名
	 */
	private String firstName;

	/**
	 * 收货人姓
	 */
	private String lastName;

	/**
	 * 收货人手机
	 */
	private String tel;

	/**
	 * 商品总计
	 */
	private BigDecimal itemSubtoal;

	/**
	 * 优惠券金额
	 */
	private BigDecimal couponAmount;

	/**
	 * 优惠券名称
	 */
	private String couponName;

	/**
	 * 发货类型 1-飞飞 2-厂家直发
	 */
	private int shippingType;

	/**
	 * 监控健康状态 0-正常 1-异常
	 */
	private int healthMonitor;

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


#### 例子 ####

~~~~ {.language-java}

	{
	  "success" : true,
	  "resultCode" : null,
	  "message" : null,
	  "model" : null,
	  "query" : {
	    "pageSize" : 20,
	    "totalRecord" : 7,
	    "pageIndex" : 1,
	    "totalPage" : 1,
	    "number" : null,
	    "acountName" : "jahnkey003@163.com",
	    "acountId" : null,
	    "warehouseId" : null,
	    "skuName" : null,
	    "sfaId" : null,
	    "channelId" : null,
	    "status" : null,
	    "skuNumber" : null,
	    "receiverName" : null,
	    "receiverTel" : null,
	    "createTimeBegin" : null,
	    "createTimeEnd" : null,
	    "paymentStatus" : null,
	    "healthMonitor" : null,
	    "originalPageIndex" : 1,
	    "startPosForMysql" : 0,
	    "startPos" : 1,
	    "endPos" : 7
	  },
	  "models" : [ {
	    "orderAddress" : null,
	    "orderItems" : null,
	    "orderInvoice" : null,
	    "orderPayments" : null,
	    "orderTaxs" : null,
	    "orderPromotions" : null,
	    "orderShipments" : null,
	    "id" : 503,
	    "channelId" : 15,
	    "number" : "TB1404301535891",
	    "outterOrderNumber" : "",
	    "acountId" : 1251992,
	    "acountName" : "jahnkey003@163.com",
	    "totalAmount" : 344.3300,
	    "paidAmount" : 344.3300,
	    "status" : 70,
	    "orderType" : 0,
	    "paymentStatus" : 30,
	    "involveType" : 0,
	    "involveBy" : "",
	    "lastUpdateBy" : "paymentplatform",
	    "createBy" : "jahnkey003@163.com",
	    "createTime" : 1404300364000,
	    "lastUpdateTime" : 1404374997000,
	    "shippingCost" : 283.0600,
	    "currencyId" : 4,
	    "currency" : "USD",
	    "payTime" : 1404301852000,
	    "flagGather" : "001000000000",
	    "orderItemQuantity" : 1,
	    "firstName" : "2",
	    "lastName" : "2",
	    "tel" : "1-2-2",
	    "itemSubtoal" : 0.0000,
	    "couponAmount" : 0,
	    "couponName" : "",
	    "shippingType" : 0,
	    "healthMonitor" : 0
	  }, {
	    "orderAddress" : null,
	    "orderItems" : null,
	    "orderInvoice" : null,
	    "orderPayments" : null,
	    "orderTaxs" : null,
	    "orderPromotions" : null,
	    "orderShipments" : null,
	    "id" : 502,
	    "channelId" : 15,
	    "number" : "TB1404301480394",
	    "outterOrderNumber" : "",
	    "acountId" : 1251992,
	    "acountName" : "jahnkey003@163.com",
	    "totalAmount" : 344.3300,
	    "paidAmount" : 344.3300,
	    "status" : 70,
	    "orderType" : 0,
	    "paymentStatus" : 30,
	    "involveType" : 0,
	    "involveBy" : "",
	    "lastUpdateBy" : "paymentplatform",
	    "createBy" : "jahnkey003@163.com",
	    "createTime" : 1404300308000,
	    "lastUpdateTime" : 1404374997000,
	    "shippingCost" : 283.0600,
	    "currencyId" : 4,
	    "currency" : "USD",
	    "payTime" : 1404301574000,
	    "flagGather" : "000000000000",
	    "orderItemQuantity" : 1,
	    "firstName" : "2",
	    "lastName" : "2",
	    "tel" : "1-2-2",
	    "itemSubtoal" : 0.0000,
	    "couponAmount" : 0,
	    "couponName" : "",
	    "shippingType" : 0,
	    "healthMonitor" : 0
	  }, {
	    "orderAddress" : null,
	    "orderItems" : null,
	    "orderInvoice" : null,
	    "orderPayments" : null,
	    "orderTaxs" : null,
	    "orderPromotions" : null,
	    "orderShipments" : null,
	    "id" : 501,
	    "channelId" : 15,
	    "number" : "TB1404301469629",
	    "outterOrderNumber" : "",
	    "acountId" : 1251992,
	    "acountName" : "jahnkey003@163.com",
	    "totalAmount" : 344.3300,
	    "paidAmount" : 344.3300,
	    "status" : 70,
	    "orderType" : 0,
	    "paymentStatus" : 30,
	    "involveType" : 0,
	    "involveBy" : "",
	    "lastUpdateBy" : "paymentplatform",
	    "createBy" : "jahnkey003@163.com",
	    "createTime" : 1404300298000,
	    "lastUpdateTime" : 1404374997000,
	    "shippingCost" : 283.0600,
	    "currencyId" : 4,
	    "currency" : "USD",
	    "payTime" : 1404302372000,
	    "flagGather" : "001000000000",
	    "orderItemQuantity" : 1,
	    "firstName" : "2",
	    "lastName" : "2",
	    "tel" : "1-2-2",
	    "itemSubtoal" : 0.0000,
	    "couponAmount" : 0,
	    "couponName" : "",
	    "shippingType" : 0,
	    "healthMonitor" : 0
	  }, {
	    "orderAddress" : null,
	    "orderItems" : null,
	    "orderInvoice" : null,
	    "orderPayments" : null,
	    "orderTaxs" : null,
	    "orderPromotions" : null,
	    "orderShipments" : null,
	    "id" : 500,
	    "channelId" : 15,
	    "number" : "TB1404301447467",
	    "outterOrderNumber" : "",
	    "acountId" : 1251992,
	    "acountName" : "jahnkey003@163.com",
	    "totalAmount" : 344.3300,
	    "paidAmount" : 344.3300,
	    "status" : 70,
	    "orderType" : 0,
	    "paymentStatus" : 30,
	    "involveType" : 0,
	    "involveBy" : "",
	    "lastUpdateBy" : "paymentplatform",
	    "createBy" : "jahnkey003@163.com",
	    "createTime" : 1404300276000,
	    "lastUpdateTime" : 1404374997000,
	    "shippingCost" : 283.0600,
	    "currencyId" : 4,
	    "currency" : "USD",
	    "payTime" : 1404301633000,
	    "flagGather" : "000000000000",
	    "orderItemQuantity" : 1,
	    "firstName" : "2",
	    "lastName" : "2",
	    "tel" : "1-2-2",
	    "itemSubtoal" : 0.0000,
	    "couponAmount" : 0,
	    "couponName" : "",
	    "shippingType" : 0,
	    "healthMonitor" : 0
	  }, {
	    "orderAddress" : null,
	    "orderItems" : null,
	    "orderInvoice" : null,
	    "orderPayments" : null,
	    "orderTaxs" : null,
	    "orderPromotions" : null,
	    "orderShipments" : null,
	    "id" : 499,
	    "channelId" : 15,
	    "number" : "TB1404301394166",
	    "outterOrderNumber" : "",
	    "acountId" : 1251992,
	    "acountName" : "jahnkey003@163.com",
	    "totalAmount" : 344.3300,
	    "paidAmount" : 344.3300,
	    "status" : 70,
	    "orderType" : 0,
	    "paymentStatus" : 30,
	    "involveType" : 0,
	    "involveBy" : "",
	    "lastUpdateBy" : "paymentplatform",
	    "createBy" : "jahnkey003@163.com",
	    "createTime" : 1404300222000,
	    "lastUpdateTime" : 1404374997000,
	    "shippingCost" : 283.0600,
	    "currencyId" : 4,
	    "currency" : "USD",
	    "payTime" : 1404301442000,
	    "flagGather" : "001000000000",
	    "orderItemQuantity" : 1,
	    "firstName" : "42",
	    "lastName" : "442",
	    "tel" : "1-2-2",
	    "itemSubtoal" : 0.0000,
	    "couponAmount" : 0,
	    "couponName" : "",
	    "shippingType" : 0,
	    "healthMonitor" : 0
	  }, {
	    "orderAddress" : null,
	    "orderItems" : null,
	    "orderInvoice" : null,
	    "orderPayments" : null,
	    "orderTaxs" : null,
	    "orderPromotions" : null,
	    "orderShipments" : null,
	    "id" : 498,
	    "channelId" : 15,
	    "number" : "TB1404300744940",
	    "outterOrderNumber" : "",
	    "acountId" : 1251992,
	    "acountName" : "jahnkey003@163.com",
	    "totalAmount" : 344.3300,
	    "paidAmount" : 344.3300,
	    "status" : 70,
	    "orderType" : 0,
	    "paymentStatus" : 30,
	    "involveType" : 0,
	    "involveBy" : "",
	    "lastUpdateBy" : "paymentplatform",
	    "createBy" : "jahnkey003@163.com",
	    "createTime" : 1404299573000,
	    "lastUpdateTime" : 1404374997000,
	    "shippingCost" : 283.0600,
	    "currencyId" : 4,
	    "currency" : "USD",
	    "payTime" : 1404301376000,
	    "flagGather" : "001000000000",
	    "orderItemQuantity" : 1,
	    "firstName" : "dasd",
	    "lastName" : "dsdsa",
	    "tel" : "1-232-2342",
	    "itemSubtoal" : 0.0000,
	    "couponAmount" : 0,
	    "couponName" : "",
	    "shippingType" : 0,
	    "healthMonitor" : 0
	  }, {
	    "orderAddress" : null,
	    "orderItems" : null,
	    "orderInvoice" : null,
	    "orderPayments" : null,
	    "orderTaxs" : null,
	    "orderPromotions" : null,
	    "orderShipments" : null,
	    "id" : 386,
	    "channelId" : 14,
	    "number" : "TB1403233079811",
	    "outterOrderNumber" : "",
	    "acountId" : 1251992,
	    "acountName" : "jahnkey003@163.com",
	    "totalAmount" : 1210501.2600,
	    "paidAmount" : 1210501.2600,
	    "status" : 70,
	    "orderType" : 0,
	    "paymentStatus" : 30,
	    "involveType" : 0,
	    "involveBy" : "",
	    "lastUpdateBy" : "jahnkey003@163.com",
	    "createBy" : "jahnkey003@163.com",
	    "createTime" : 1403231919000,
	    "lastUpdateTime" : 1404374997000,
	    "shippingCost" : 1209888.5600,
	    "currencyId" : 4,
	    "currency" : "USD",
	    "payTime" : 1403233173000,
	    "flagGather" : "000000000000",
	    "orderItemQuantity" : 0,
	    "firstName" : "",
	    "lastName" : "",
	    "tel" : "",
	    "itemSubtoal" : 0.0000,
	    "couponAmount" : 0,
	    "couponName" : "",
	    "shippingType" : 0,
	    "healthMonitor" : 0
	  } ]

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

## 订单详情:基本信息，详细信息，支付信息 ##

## 订单评论 ##

## 配送信息 ##
