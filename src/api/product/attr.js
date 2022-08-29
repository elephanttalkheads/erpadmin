import getproducts from '@/utils/getproducts'

export const reqCategory1List = () => getproducts({ url: '/admin/product/getCategory1', method: 'get' })
export const reqCategory2List = (category1Id) => getproducts({ url: `/admin/product/getCategory2/${category1Id}`,method:'get' })
export const reqCategory3List = (category2Id) => getproducts({ url: `/admin/product/getCategory3/${category2Id}`,method:'get' })


//GET /admin/product/attrInfoList/{category1Id}/{category2Id}/{category3Id}

//获取平台属性
export const reqAttrList=(category1Id,category2Id,category3Id)=>getproducts({ url:`/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`,method:'get'})
export const reqAddOrUpdateAttr=(data)=>getproducts({ url:'/admin/product/saveAttrInfo',method:'post',data})
