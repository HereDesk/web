export default {
  MenuRules (data) {
    let rules = {
      user_management: false
    }
    let group = data.group
    if (group === 'admin') {
      rules.user_management = true
    }
    return rules
  },
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
      console.log(bug)
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

  // page: 用户管理页面
  UserMangeRules (data) {
    let rules = false
    if (data) {
      let group = data.group
      if (group === 'admin') {
        rules = true
      }
    }
    return rules
  },

  // 产品管理页面
  ProductMangeRules (data) {
    let rules = {
      add: false,
      operate: false
    }
    let group = data.group
    let group_list = ['admin']
    if (data) {
      if (group_list.indexOf(group) >= 0) {
        rules.add = true
        rules.operate = true
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