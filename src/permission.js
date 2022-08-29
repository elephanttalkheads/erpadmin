import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'
import { computedAsyncRoutes } from '@/utils/fliterAsyncRouters'
import cloneDeep from 'lodash/cloneDeep'
import { asyncRoutes, anyRoutes, constantRoutes } from './router'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login'] // no redirect whitelist

router.beforeEach(async(to, from, next) => {
    // if (router.options.routes.length === constantRoutes.length) {
    //   JSON.parse(localStorage.getItem('asyncRoutes')).forEach((cur) => {
    //     router.options.routes.push(cur)
    //     }
    //   )
    // }
    // console.log(router.options.routes.length)
    // // console.log('asdasdasdsa',store.state.user.avatar)
    // console.log('asdasdasfff', store.state.user.routes)
    // console.log("-> to.path.indexOf('login')===-1", to.path.indexOf('login')===-1);
    // if(!store.state.user.name && store.state.user.routes!==0 && to.path.indexOf('login')===-1  ){
    //   console.log(from.name)
    //   console.log(`在刷新`)
    // }

    // start progress bar
    NProgress.start()
    // if(from.name === null){
    //   console.log(111111)
    //   next({...to,replace:true})
    // }

    if (store.state.user.routes !== []) {
      if (store.state.user.routes.length === 0) {
        try {
          await store.dispatch('user/getInfo')
        } catch (e) {

        }
      }

    }
    //     const AsyncRouters=computedAsyncRoutes(cloneDeep(asyncRoutes),store.state.user.routes)
    //     const allAsyncArr=AsyncRouters.concat(anyRoutes)
    // router.addRoutes(allAsyncArr)
    //   allAsyncArr.forEach((cur)=>{
    //    router.options.routes.push(cur)
    //
    //   })

    //   console.log([...AsyncRouters, ...anyRoutes])

    // router.options.routes=[...constantRoutes,...AsyncRouters,...anyRoutes]
    // [...AsyncRouters,...anyRoutes].forEach((cur)=>{
    //   router.options.routes.push(cur)
    //
    // })

    // })
    // set page title
    document.title = getPageTitle(to.meta.title)

    // determine whether the user has logged in
    const hasToken = getToken()
    console.log('-> hasToken', hasToken)

    if (hasToken) {
      if (to.path === '/login') {
        // if is logged in, redirect to the home page
        next({ path: '/' })
        NProgress.done()
      } else {
        const hasGetUserInfo = store.getters.name
        if (hasGetUserInfo) {
          next()
        } else {
          try {
            // get user info
            await store.dispatch('user/getInfo')

            next()
          } catch (error) {
            // remove token and go to login page to re-login
            await store.dispatch('user/resetToken')
            Message.error(error || 'Has Error')
            next(`/login?redirect=${to.path}`)
            NProgress.done()
          }
        }
      }
    } else {
      /* has no token*/

      if (whiteList.indexOf(to.path) !== -1) {
        // in the free login whitelist, go directly
        next()
      } else {
        // other pages that do not have permission to access are redirected to the login page.
        next(`/login?redirect=${to.path}`)
        NProgress.done()
      }
    }
  }
)

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
