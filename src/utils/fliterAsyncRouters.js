export  const computedAsyncRoutes = (asyncRoutes,routes)=>{
  //过滤出当前用户【超级管理|普通员工】需要展示的异步路由
  return asyncRoutes.filter(item=>{
    //数组当中没有这个元素返回索引值-1，如果有这个元素返回的索引值一定不是-1
    if(routes.indexOf(item.name)!==-1){
      //递归:别忘记还有2、3、4、5、6级路由
      if(item.children&&item.children.length){
        item.children = computedAsyncRoutes(item.children,routes);
      }
      return true;
    }
  })
}
