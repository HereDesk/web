export default {
  BugBtnRules (bug,userinfo) {
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
  		let identity = userinfo.identity
  		// Bug: 删除按钮规则
		  // 1）Bug创建者、测试人员
		  // 2）Bug状态为New时才能删除，已分配他人的缺陷不能删除
  		if ((bug.status === 'New') && (bug.creator_id === uid || identity === 0)) {
  			BtnRules.del = true
  		}

  		// Bug: 编辑按钮规则
      // Bug创建者、测试人员
  		if ((bug.status !== 'Closed') && (identity === 0 || bug.creator_id === uid)) {
  			BtnRules.edit = true
  		}

  		// Bug: 分配按钮规则
  		// 所有人都可以进行缺陷分配
  		if (bug.status !== 'Closed') {
  			BtnRules.assign = true
  		}

  		// Bug: 重新打开按钮规则
  		// 当状态为：已解决、已关闭，并且组为：测试
  		if ((bug.status === 'Fixed' || bug.status === 'Closed') && (identity === 0 || bug.creator_id === uid)) {
  			BtnRules.reopen = true
  		}

  		// Bug: 挂起按钮规则
  		// 当状态为：已解决、待解决、重新打开
  		if (['Open','Reopen','Fixed'].includes(bug.status)) {
  			BtnRules.hangup = true
  		}

  		// Bug: 关闭按钮规则
  		// 当状态为：非关闭状态；组：测试
  		if ((bug.status !== 'Closed') && (identity === 0 || bug.creator_id === uid)) {
  			BtnRules.close = true
  		}

  		// Bug: 解决按钮规则
  		// 当状态为：非关闭状态；组：测试
  		if (['Open','Reopen','Hang-up'].includes(bug.status)) {
  			BtnRules.Recovered = true
  		}

  	}
  	return BtnRules
  },
  RuleManges (userInfo,PagesRules) {
    const identity = userInfo.identity
    let rules = {
      user_create: false,
      bug_create: false,
      bug_edit: false,
      case_create: false,
      case_edit: false,
      product_add: false,
      product_members: false,
      product_release: false,
      product_modules: false,
    }
    if (identity === 0) {
      rules.user_create = true
      rules.bug_create = true
      rules.bug_edit = true
      rules.case_create = true
      rules.case_edit = true
      rules.product_add = true
      rules.product_members = true
      rules.product_release = true
      rules.product_modules = true
    }
    if (PagesRules) {
      for (let item of PagesRules) {
        if (item['url'] == '/app/qa/bug/add' && item['is_allow'] == 1) {
          rules.bug_create = true
        }
        if (item['url'] == '/app/qa/bug/edit' && item['is_allow'] == 1) {
          rules.bug_edit = true
        }
        if (item['url'] == '/app/qa/testcase/add' && item['is_allow'] == 1) {
          rules.case_create = true
        }
        if (item['url'] == '/app/qa/testcase/edit' && item['is_allow'] == 1) {
          rules.case_edit = true
        }
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
  TestCaseBtnRules (userinfo,CaseDetails) {
    let rules = {
      edit: false, 
      del: false,
      fall: false
    }
    let identity = userinfo.identity
    let user_id = userinfo.user_id
    let case_createor = CaseDetails.creator_id
    // 编辑、删除、失效权限: 超级管理员、用例创建者
    if (identity === 0 || user_id === case_createor) {
      rules.edit = true
      rules.del = true
      rules.fall = true
    }
    return rules
  }
}