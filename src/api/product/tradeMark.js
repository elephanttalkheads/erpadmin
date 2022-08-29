import getproducts from '@/utils/getproducts.js'
export const reqTradeMarkList = (page, limit) => getproducts({
  url: `/admin/product/baseTrademark/${page}/${limit}`,
  method: 'get'
})

export const reqAddOrUpdateTradeMark =(tradeMark)=>{

  if(tradeMark.id){
    return getproducts({url:'/admin/product/baseTrademark/update',method:'put',data:tradeMark})

  }else{

    return getproducts({url:'/admin/product/baseTrademark/save',method:'post',data:tradeMark})

  }


}
export const reqDeleteTrademark=(id)=>getproducts({url:`/admin/product/baseTrademark/remove/${id}`,method:'delete'})
