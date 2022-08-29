import getproducts from '@/utils/getproducts'

export const reqSkuList = (page,limit)=>getproducts({url:`/admin/product/list/${page}/${limit}`,method:'get'});

//上架
///admin/product/onSale/{skuId}
export const reqSale = (skuId)=>getproducts({url:`/admin/product/onSale/${skuId}`,method:'get'});

//下架
///admin/product/cancelSale/{skuId}
export const reqCancel = (skuId)=>getproducts({url:`/admin/product/cancelSale/${skuId}`,method:'get'});

//获取SKU详情的接口
///admin/product/getSkuById/{skuId}  get
export const reqSkuById = (skuId)=>getproducts({url:`/admin/product/getSkuById/${skuId}`,method:'get'});
