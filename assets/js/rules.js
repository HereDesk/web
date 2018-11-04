export default {
  BugRules (bug,userinfo) {
  	let BtnRules = {
      del: false,
      edit: false,
      assign: false,
      reopen: false,
      hangup: false,
      close: false,
      Recovered: false,
      notes: true
    }

  	if (bug && userinfo) {
  		let uid = userinfo.user_id
  		let group = userinfo.group
  		// Bug: 删除按钮规则
		  // 1）Bug创建者、测试人员
		  // 2）Bug状态为New时才能删除，已分配他人的缺陷不能删除
  		if ((bug.status === 'New') && (bug.creator_id === uid || group === 'test')) {
  			BtnRules.del = true
  		}

  		// Bug: 编辑按钮规则
      // Bug创建者、测试人员
  		if ((bug.status !== 'Closed') && (group === 'test' || group === 'admin' || bug.creator_id === uid)) {
  			BtnRules.edit = true
  		}

  		// Bug: 分配按钮规则
  		// 所有人都可以进行缺陷分配
  		if (bug.status !== 'Closed') {
  			BtnRules.assign = true
  		}

  		// Bug: 重新打开按钮规则
  		// 当状态为：已解决、已关闭，并且组为：测试
  		if ((bug.status === 'Fixed' || bug.status === 'Closed') && (group === 'test' || group === 'admin' || bug.creator_id === uid)) {
  			BtnRules.reopen = true
  		}

  		// Bug: 挂起按钮规则
  		// 当状态为：已解决、待解决、重新打开
  		if (bug.status === 'Open' || bug.status === 'Reopen') {
  			BtnRules.hangup = true
  		}

  		// Bug: 关闭按钮规则
  		// 当状态为：非关闭状态；组：测试
  		if ((bug.status !== 'Closed') && (group === 'test' || group === 'admin' || bug.creator_id === uid)) {
  			BtnRules.close = true
  		}

  		// Bug: 解决按钮规则
  		// 当状态为：非关闭状态；组：测试
  		if (bug.status === 'Open' || bug.status === 'Reopen') {
  			BtnRules.Recovered = true
  		}

  	}
  	return BtnRules
  },
  RuleManges (UserGroup,PagesRules) {
    let rules = {
      user_create: false,
      product_add: false,
      product_members: false,
      product_release: false,
      product_modules: false,
    }
    if (UserGroup == 'admin') {
      rules.user_create = true
      rules.product_add = true
      rules.product_members = true
      rules.product_release = true
      rules.product_modules = true
    }
    if (PagesRules) {
      for (let item of PagesRules) {
        if (item['url'] == '/app/user-management/user/adduser' && item['is_allow'] == 1) {
          rules.user_create = true
        }
        if (item['url'] == '/app/products/members' && item['is_allow'] == 1) {
          rules.product_members = true
        }
        if (item['url'] == '/app/products/release' && item['is_allow'] == 1) {
          rules.product_release = true
        }
        if (item['url'] == '/app/products/modules' && item['is_allow'] == 1) {
          rules.product_modules = true
        }
        // 增加产品入口，是一个modal，不是页面。因此当只要有管理人员、版本、模块的权限就有增加产品的权限
        if (rules.product_members && rules.product_release && rules.product_modules) {
          rules.product_add = true
        }
      }
    }
    return rules
  },

  // Page: 测试用例
  TestCaseRules (data) {
    let rules = {
      add: true,
      edit: false, 
      del: false,
      fall: false
    }
    let group = data.group
    if (group === 'admin' || group === 'test') {
      rules.edit = true
      rules.del = true
      rules.fall = true
    }
    return rules
  }
}