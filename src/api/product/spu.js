import getproducts from '@/utils/getproducts'
//获取spu列表数据的接口
export const reqSpuList=(page,limit,Category3Id)=> getproducts({url:`/admin/product/${page}/${limit}`,method:'get',params:{Category3Id}})

//获取spu猩猩
export const reqSpu = (spuid)=> getproducts({url:`/admin/product/getSpuById/${spuid}`,method:'get'})
//获取品牌信息
export const reqTrademarklist=()=>getproducts(({url:`/admin/product/baseTrademark/getTrademarkList`,method:'get'}))
//获取spu图片
export const reqSpuImageList=(spuid)=>getproducts({url:`/admin/product/spuImageList/${spuid}`,method:'get'})
//获取平台全部销售属性
export const reqBaseSaleAttrList=()=>getproducts({url:'/admin/product/baseSaleAttrList',method:'get'})
//修改和添加spu
export const reqAddOrUpdateSpu=(spuInfo)=>{
  if(spuInfo.id){
    return getproducts({url:'/admin/product/updateSpuInfo',method:'post',data:spuInfo})

  }else{
    return getproducts({url:'admin/product/saveSpuInfo',method:'post',data:spuInfo})

  }



}
//删除spu
export const reqDeleteSpu=(spuId)=>getproducts({url:`/admin/product/deleteSpu/${spuId}`,method:'delete'})



export const reqSpuSaleAttrList =(spuId)=>getproducts(({url:`/admin/products/spuSaleAttrList/${spuId}`,method:'get'}))

export const reqAttrInfoList =(category1Id,category2Id,category3Id)=>getproducts({url:`/admin/products/attrInfoList/${category1Id}/${category2Id}/${category3Id}`,method:'get'})
//添加SKU
///admin/product/saveSkuInfo  post
export const reqAddSku = (skuInfo)=>getproducts({url:'/admin/product/saveSkuInfo',method:'post',data:skuInfo});


//获取SKU列表数据的接口
//GET /admin/product/findBySpuId/{spuId}
export const reqSkuList = (spuId)=>getproducts({url:`/admin/product/findBySpuId/${spuId}`,method:'get'});

