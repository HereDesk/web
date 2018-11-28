import BasicData from "~/assets/js/data.js"

export default {
   txt_deal_with(txt){
    let reg = /(((https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/ig;
    let result = txt.replace(reg,function(item){
      return '<a href="' +item+ '" target="_blank">' +item+ '</a>';
    });
    return result;
  },
  getWeek (str) {
    if (!str) {
      return ''
    }
    let date = new Date(str)
    return date.getDay()
  },
  date (str, type) {
    if (!str) {
      return '';
    }
    let date = new Date(str);
    let Y = date.getFullYear();
    let M = date.getMonth() + 1;
    let D = date.getDate();
    let h = date.getHours();
    let m = date.getMinutes();
    let s = date.getSeconds();
    let add0 = function (number) {
      return /^\d$/.test(number) ? '0' + number : number;
    };
    // 显示全部
    if (!type || type == 1) {
      return Y + '-' + add0(M) + '-' + add0(D) + ' ' + add0(h) + ':' + add0(m) + ':' + add0(s);
    }
    // 去年去秒
    else if (type == 2) {
      return add0(M) + '/' + add0(D) + ' ' + add0(h) + ':' + add0(m);
    }
    // 去年去秒
    else if (type == 3) {
      return Y + '-' + add0(M) + '-' + add0(D)
    }
    // 只显示时分秒
    else if (type == 4) {
      return add0(h) + ':' + add0(m) + ':' + add0(s)
    }
    else if (type == 5) {
      return add0(Y) + '/' + add0(M) + '/' + add0(D)
    } 
  },
  bugStatusName (data) {
    let status_list = BasicData.bug_status_list
    for (let x in status_list) {
      if (status_list[x]['status_value'] == data) {
        return status_list[x]['status_name']
      }
    }
  },
  getOperatorsName (data) {
    let list =  [
      {"value": "=","name":'='},
      {"value": "!=","name":'!='},
      {"value": ">=","name":'>='},
      {"value": "<=","name":'<='},
      {"value": ">","name":'>'},
      {"value": "<","name":'<'},
      {"value": "and","name":'and'},
      {"value": "or","name":"or"},
      {"value": "range","name":'范围'},
    ]
    for (let x in list) {
      if (list[x]['value'] == data) {
        return list[x]['name']
      }
    }
  },
  getSearchTypeName (data) {
    let list =  BasicData.bug_search_type_list
    for (let x in list) {
      if (list[x]['search_value'] == data) {
        return list[x]['search_name']
      }
    }
  },
  getOrderName (data) {
    let order_list = BasicData.order_list
    for (let x in order_list) {
      if (order_list[x]['order_value'] == data) {
        return order_list[x]['order_name']
      }
    }
  },
  QuickQperationName (data) {
    let QuickQperationList = BasicData.bug_quick_operation_list
    for (let x in QuickQperationList) {
      if (QuickQperationList[x]['quick_value'] == data) {
        return QuickQperationList[x]['quick_name']
      }
    }
  },
  flowdesc (type) {
    let data = [
      {'status': -1, 'name': '不涉及此项'},
      {'status': 0, 'name': '未开始'},
      {'status': 1, 'name': '设计中'},
      {'status': 2, 'name': '开发中'},
      {'status': 3, 'name': '开发完成'},
      {'status': 4, 'name': '待调试'},
      {'status': 5, 'name': '调试中'},
      {'status': 6, 'name': '调试'},
      {'status': 7, 'name': '进入测试'},
      {'status': 8, 'name': '测试中'},
      {'status': 9, 'name': '存在Bug'},
      {'status': 10, 'name': '修复Bug中'},
      {'status': 11, 'name': '回归Bug'},
      {'status': 12, 'name': '测试通过'},
      {'status': 13, 'name': '已上线'}
    ]
    for (let x in data) {
      if (data[x]['status'] == type) {
        return data[x]['name']
      }
    }
  },
  FilterCaseStatus (status_value) {
    let data = [
      { status_name: "正常", status_value: 0 },
      { status_name: "无效", status_value: 1 }
    ]
    for (let x in data) {
      if (data[x]['status_value'] == status_value) {
        return data[x]['status_name']
      }
    }
  }
}